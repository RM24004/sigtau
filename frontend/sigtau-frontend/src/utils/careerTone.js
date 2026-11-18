// Colores fijos por carrera según su nombre (se usan en la lista y en los formularios).
export const TONES = [
    { bg: "#dbe5ff", fg: "#1b3a8a" },
    { bg: "#ffe5bd", fg: "#7a4a00" },
    { bg: "#d5efdf", fg: "#145a3a" },
    { bg: "#f8dbe5", fg: "#8a1f4b" },
    { bg: "#e5def8", fg: "#4b2e9b" },
];

export function getTone(name = "") {
    const sum = [...name].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    return TONES[sum % TONES.length];
}

export function getInitials(name = "") {
    const words = name.split(/\s+/).filter((w) => w.length > 2);
    const source = words.length ? words : [name];
    const letters =
        source.length > 1
            ? source[0][0] + source[1][0]
            : source[0].slice(0, 2);
    return letters.toUpperCase();
}