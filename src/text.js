import chars from './chars.json' assert { type: "json" }

const defaultWidth = chars['W']

export const width = s => [...s].reduce((acc, c) => acc + chars[c] || defaultWidth, 0)

export const extent = function (lines, fontSize = 40) {
  const factor = fontSize / 30
  const widths = lines.map(line => width(line) * factor)
  return [Math.max(...widths), lines.length * fontSize]
}
