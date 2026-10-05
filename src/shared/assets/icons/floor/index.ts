const iconModules = import.meta.glob('./*.svg', {
    eager: true,
    import: 'default',
    query: '?url',
}) as Record<string, string>;

function fileName(path: string): string {
    const base = path.split('/').pop() ?? path;
    return decodeURIComponent(base).normalize('NFC');
}

const iconsByFileName = new Map(
    Object.entries(iconModules).map(([path, url]) => [fileName(path), url])
);

export function floorIconSrc(icon: string): string | undefined {
    const filename = (icon.endsWith('.svg') ? icon : `${icon}.svg`).normalize('NFC');
    return iconsByFileName.get(filename);
}
