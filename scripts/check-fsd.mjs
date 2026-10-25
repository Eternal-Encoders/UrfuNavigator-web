import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const root = path.resolve('src');
const layers = ['app', 'pages', 'widgets', 'features', 'entities', 'shared'];
const slicedLayers = layers.slice(1, -1);
const segments = new Set(['ui', 'model', 'api', 'lib', 'config']);
const errors = [];

function files(directory) {
    return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
        const target = path.join(directory, entry.name);
        return entry.isDirectory() ? files(target) : [target];
    });
}

function identity(file) {
    const parts = path.relative(root, file).split(path.sep);
    return { layer: parts[0], slice: parts[1], parts };
}

for (const file of files(root).filter(file => /\.[cm]?[jt]sx?$/.test(file))) {
    const owner = identity(file);
    const name = path.relative(process.cwd(), file);
    const fail = message => errors.push(`${name}: ${message}`);
    if (!layers.includes(owner.layer) && owner.parts.length > 1) fail('Unknown FSD layer');
    if (slicedLayers.includes(owner.layer)) {
        if (owner.parts.length < 3 || (owner.parts[2] !== 'index.ts' && !segments.has(owner.parts[2]))) {
            fail('Slice files must live in ui/model/api/lib/config or the public index.ts');
        }
        if (!fs.existsSync(path.join(root, owner.layer, owner.slice, 'index.ts'))) fail('Missing public index.ts');
    }
    const source = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
    function inspect(node) {
        const specifier = (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) ? node.moduleSpecifier
            : ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword ? node.arguments[0]
                : undefined;
        if (specifier && ts.isStringLiteral(specifier)) {
            const value = specifier.text;
            const target = value.startsWith('@/') ? path.join(root, value.slice(2))
                : value.startsWith('.') ? path.resolve(path.dirname(file), value) : null;
            if (target) {
                const other = identity(target);
                if (layers.includes(other.layer)) {
                    if (other.layer !== owner.layer) {
                        if (layers.indexOf(other.layer) < layers.indexOf(owner.layer)) fail(`Upward import: ${value}`);
                        if (!value.startsWith('@/')) fail(`Use @/ when crossing layers: ${value}`);
                    } else if (slicedLayers.includes(owner.layer) && other.slice !== owner.slice) {
                        fail(`Cross-slice import: ${value}`);
                    }
                    const outsideSlice = other.layer !== owner.layer || other.slice !== owner.slice;
                    if (outsideSlice && slicedLayers.includes(other.layer) && other.parts.length !== 2) {
                        fail(`Import through the slice public API: ${value}`);
                    }
                }
            }
        }
        ts.forEachChild(node, inspect);
    }
    inspect(source);
}

if (errors.length) {
    console.error(errors.join('\n'));
    process.exitCode = 1;
} else {
    console.log('FSD: layer direction, slice boundaries, public APIs and segments are valid.');
}
