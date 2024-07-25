declare module '*.module.css';

declare module '*.module.css' {
    const classes: { readonly [key: string]: string };
    export default classes;
}