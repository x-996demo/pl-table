export function parseHeight(height) {
    if (typeof height === 'number') {
        return height;
    }
    if (typeof height === 'string') {
        if (/^\d+(?:px)?$/.test(height)) {
            return parseInt(height, 10);
        } else {
            return height;
        }
    }
    return null;
}
