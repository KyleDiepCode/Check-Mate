// Person colors. The first few are hand-picked; after that we generate more
// with the "golden angle" trick so colors never repeat and stay spread apart.
const PALETTE = ["#8EB1C7", "#FFEB0A", "#EFAB57", "#7FC8A9", "#E58FA8", "#B39DDB", "#F28C6B"]

function hslToHex(h, s, l) {
    s /= 100
    l /= 100
    const k = (n) => (n + h / 30) % 12
    const a = s * Math.min(l, 1 - l)
    const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
    const toHex = (x) => Math.round(x * 255).toString(16).padStart(2, "0")
    return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`
}

// Pick the first palette color nobody is using yet, otherwise generate one
export function nextColor(usedColors) {
    const free = PALETTE.find((c) => !usedColors.includes(c))
    if (free) return free
    const hue = (usedColors.length * 137.508) % 360
    return hslToHex(hue, 65, 70)
}

export const FIRST_COLOR = PALETTE[0]

// Black or white text, whichever is easier to read on `hex`
export function textColorFor(hex) {
    const n = parseInt(hex.slice(1), 16)
    const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return luminance > 0.55 ? "#1f2937" : "#ffffff"
}
