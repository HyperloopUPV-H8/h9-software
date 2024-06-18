export function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
}

export function normalize(value: number, min: number, max: number) {
    return (value - min) / (max - min);
}

export function clampAndNormalize(value: number, min: number, max: number) {
    return normalize(clamp(value, min, max), min, max);
}
