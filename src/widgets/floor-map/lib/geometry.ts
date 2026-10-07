export function desktopMapInset(width: number): number {
    if (width <= 1200) {
        return 0;
    }
    return Math.min(Math.max(width * 0.27, 340), 430) + 24;
}
