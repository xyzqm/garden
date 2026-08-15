---
title: Diary dashboard
---

> [!info]- About this note
> Open in **Reading view** (`Cmd+E`) — it reads every entry in `diary/` and recomputes on each render, so there is nothing to build or refresh.
> Word counts exclude frontmatter, code blocks and heading lines, so the template's scaffolding doesn't inflate them.
> Days are taken from each entry's `date:` property, falling back to a `YYYY-MM-DD` in the filename.

```dataviewjs
// ---------------------------------------------------------------- constants
const DIARY_FOLDER = "diary"
const DAY_MS = 86400000
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
const WEEKDAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
const SVG_NS = "http://www.w3.org/2000/svg"

// Sequential blue ramp (light→dark on light themes, dark→light on dark themes).
// Index 0 is "no entry" and sits just off the surface.
const RAMP = {
  light: ["#eceae3", "#cde2fb", "#86b6ef", "#3987e5", "#256abf", "#184f95"],
  dark:  ["#232322", "#184f95", "#256abf", "#3987e5", "#6da7ec", "#9ec5f4"],
}

// ------------------------------------------------------------------ helpers
const pad2 = (n) => String(n).padStart(2, "0")
const keyOf = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
const parseKey = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d) }
const fmtNum = (n) => Number(n).toLocaleString("en-US")
const prettyDate = (d) => `${WEEKDAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
const DATE_RE = /(\d{4}-\d{2}-\d{2})/

const WORDISH = /[\p{L}\p{N}]/u
// built with RegExp so no literal triple-backtick appears inside this fence
const FENCED_CODE = new RegExp("`{3}[\\s\\S]*?`{3}", "g")
function countWords(raw) {
  const body = raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "")
  const prose = body
    .replace(FENCED_CODE, " ")
    .replace(/`[^`\n]*`/g, " ")
    .split(/\r?\n/)
    .filter((line) => !/^\s{0,3}#{1,6}\s/.test(line))
    .join("\n")
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[\[([^\]|]*\|)?([^\]]*)\]\]/g, "$2")
    .replace(/[*_~>#]+/g, " ")
  return prose.split(/\s+/).filter((t) => WORDISH.test(t)).length
}

// ------------------------------------------------------------------- gather
const pages = dv.pages(`"${DIARY_FOLDER}"`).array()
const byDate = new Map()
let undated = 0

for (const page of pages) {
  const fm = page.file.frontmatter ?? {}
  const rawDate = fm.date != null ? String(fm.date) : ""
  const date = (rawDate.match(DATE_RE) ?? page.file.name.match(DATE_RE) ?? [])[1]
  if (!date) { undated++; continue }

  const words = countWords(await dv.io.load(page.file.path))
  const existing = byDate.get(date)
  if (existing) {
    existing.words += words
  } else {
    byDate.set(date, {
      date,
      words,
      mood: fm.mood != null ? String(fm.mood) : "",
      path: page.file.path,
    })
  }
}

const entries = [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date))
const wordsByDate = new Map(entries.map((e) => [e.date, e.words]))

const root = dv.container.createDiv({ cls: "diary-dash" })

if (entries.length === 0) {
  root.createEl("p", {
    text: `No dated entries in ${DIARY_FOLDER}/ yet. Create today's note from the diary template and this dashboard will fill in.`,
  })
  return
}

// -------------------------------------------------------------------- stats
const today = new Date(); today.setHours(0, 0, 0, 0)
const totalWords = entries.reduce((s, e) => s + e.words, 0)
const sortedCounts = entries.map((e) => e.words).sort((a, b) => a - b)
const median = sortedCounts[sortedCounts.length >> 1]
const mean = Math.round(totalWords / entries.length)
const best = entries.reduce((a, b) => (b.words > a.words ? b : a))

// current streak — a gap for today alone doesn't break it, the day isn't over
let currentStreak = 0
{
  const cursor = wordsByDate.has(keyOf(today)) ? new Date(today) : new Date(today - DAY_MS)
  while (wordsByDate.has(keyOf(cursor))) { currentStreak++; cursor.setDate(cursor.getDate() - 1) }
}
let longestStreak = 0
{
  let run = 0, prev = null
  for (const e of entries) {
    const day = parseKey(e.date)
    run = prev && day - prev === DAY_MS ? run + 1 : 1
    longestStreak = Math.max(longestStreak, run)
    prev = day
  }
}

const firstDate = parseKey(entries[0].date)
const spanDays = Math.round((today - firstDate) / DAY_MS) + 1
const coverage = Math.round((entries.length / spanDays) * 100)

const monthTotals = new Map()
const weekdayAgg = Array.from({ length: 7 }, () => ({ words: 0, days: 0 }))
for (const e of entries) {
  const month = e.date.slice(0, 7)
  monthTotals.set(month, (monthTotals.get(month) ?? 0) + e.words)
  const slot = weekdayAgg[parseKey(e.date).getDay()]
  slot.words += e.words; slot.days++
}

// quantile cut points over the days actually written, so the ramp adapts to
// how much this diary tends to write rather than to a fixed scale
const cuts = [...new Set([1, 2, 3, 4].map((i) => sortedCounts[Math.floor((sortedCounts.length * i) / 5)]))]
const levelOf = (w) => {
  if (!w) return 0
  let lv = 1
  for (const c of cuts) if (w >= c) lv++
  return Math.min(lv, cuts.length + 1)
}

// ---------------------------------------------------------------- one-time CSS
if (!document.getElementById("diary-dash-style")) {
  const style = document.head.createEl("style", { attr: { id: "diary-dash-style" } })
  const vars = (mode) => RAMP[mode].map((hex, i) => `--seq-${i}:${hex};`).join("")
  style.textContent = `
    .theme-light .diary-dash{${vars("light")}}
    .theme-dark  .diary-dash{${vars("dark")}}
    .diary-dash{display:flex;flex-direction:column;gap:18px;font-variant-numeric:normal}
    .diary-dash .dd-herorow{display:flex;gap:14px;flex-wrap:wrap;align-items:stretch}
    .diary-dash .dd-card{background:var(--background-primary);border:1px solid var(--background-modifier-border);border-radius:9px;padding:16px}
    .diary-dash .dd-hero{flex:1 1 210px}
    .diary-dash .dd-hero .v{font-size:48px;font-weight:600;line-height:1.04;letter-spacing:-.02em;margin-top:4px}
    .diary-dash .dd-tiles{flex:3 1 460px;display:grid;grid-template-columns:repeat(auto-fit,minmax(112px,1fr));gap:1px;background:var(--background-modifier-border);border:1px solid var(--background-modifier-border);border-radius:9px;overflow:hidden}
    .diary-dash .dd-tile{background:var(--background-primary);padding:12px 14px}
    .diary-dash .dd-tile .v{font-size:21px;font-weight:600;margin-top:3px;letter-spacing:-.01em}
    .diary-dash .l{font-size:11px;color:var(--text-muted)}
    .diary-dash h4{margin:0 0 2px;font-size:13px;font-weight:600}
    .diary-dash .dd-sub{font-size:11px;color:var(--text-muted);margin:0 0 14px}
    .diary-dash .dd-scroll{overflow-x:auto;padding-bottom:2px}
    .diary-dash .dd-head{display:flex;gap:8px;align-items:flex-start;flex-wrap:wrap;margin-bottom:12px}
    .diary-dash .dd-ranges{display:flex;gap:4px;margin-left:auto;flex-wrap:wrap}
    .diary-dash .dd-ranges button{font:inherit;font-size:11px;padding:2px 9px;border-radius:999px;cursor:pointer;background:transparent;color:var(--text-muted);border:1px solid var(--background-modifier-border);box-shadow:none;height:auto}
    .diary-dash .dd-ranges button[aria-pressed="true"]{background:var(--interactive-accent);border-color:var(--interactive-accent);color:var(--text-on-accent)}
    .diary-dash rect.cell:hover{stroke:var(--text-normal);stroke-width:1.5}
    .diary-dash rect.bar{fill:var(--interactive-accent)}
    .diary-dash rect.bar:hover{opacity:.8}
    .diary-dash text.tick{font-size:10px;fill:var(--text-faint)}
    .diary-dash line.grid{stroke:var(--background-modifier-border)}
    .diary-dash .dd-legend{display:flex;align-items:center;gap:5px;font-size:11px;color:var(--text-muted);margin-top:10px}
    .diary-dash .dd-legend i{width:12px;height:12px;border-radius:2.5px;display:inline-block}
    .diary-dash .dd-table{border-collapse:collapse;width:100%;margin-top:12px;font-size:13px}
    .diary-dash .dd-table th,.diary-dash .dd-table td{text-align:left;padding:5px 10px 5px 0;border-bottom:1px solid var(--background-modifier-border)}
    .diary-dash .dd-table th{font-size:10px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em}
    .diary-dash .dd-table .num{text-align:right;padding-right:0;font-variant-numeric:tabular-nums}
    .diary-dash summary{cursor:pointer;font-size:12px;color:var(--text-muted)}
    .diary-dash .dd-two{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:14px}
    #diary-dash-tip{position:fixed;pointer-events:none;opacity:0;transition:opacity .09s;z-index:60;
      background:var(--background-primary);color:var(--text-normal);border:1px solid var(--background-modifier-border);
      border-radius:7px;padding:6px 9px;font-size:12px;line-height:1.45;box-shadow:0 4px 16px rgba(0,0,0,.18);max-width:230px}
    #diary-dash-tip .m{color:var(--text-muted)}
  `
}

// ------------------------------------------------------------------ tooltip
let tip = document.getElementById("diary-dash-tip")
if (!tip) tip = document.body.createDiv({ attr: { id: "diary-dash-tip" } })
const hideTip = () => { tip.style.opacity = "0" }
function hoverable(node, html) {
  node.addEventListener("mousemove", (evt) => {
    tip.innerHTML = html
    tip.style.opacity = "1"
    const box = tip.getBoundingClientRect()
    let x = evt.clientX + 14
    let y = evt.clientY - box.height - 12
    if (x + box.width > window.innerWidth - 8) x = evt.clientX - box.width - 14
    if (y < 8) y = evt.clientY + 18
    tip.style.left = `${x}px`
    tip.style.top = `${y}px`
  })
  node.addEventListener("mouseleave", hideTip)
}
window.addEventListener("scroll", hideTip, true)

const svgEl = (parent, name, attrs = {}) => {
  const node = document.createElementNS(SVG_NS, name)
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, String(v))
  parent.append(node)
  return node
}

// ------------------------------------------------------------- hero + tiles
{
  const row = root.createDiv({ cls: "dd-herorow" })
  const hero = row.createDiv({ cls: "dd-card dd-hero" })
  hero.createDiv({ cls: "l", text: "Total words written" })
  hero.createDiv({ cls: "v", text: fmtNum(totalWords) })
  hero.createDiv({ cls: "l", text: `best day ${fmtNum(best.words)} on ${prettyDate(parseKey(best.date))}` })

  const tiles = row.createDiv({ cls: "dd-tiles" })
  const tileData = [
    ["Entries", fmtNum(entries.length), `since ${prettyDate(firstDate)}`],
    ["Current streak", fmtNum(currentStreak), currentStreak === 1 ? "day" : "days"],
    ["Longest streak", fmtNum(longestStreak), longestStreak === 1 ? "day" : "days"],
    ["Median entry", fmtNum(median), `words · ${fmtNum(mean)} mean`],
    ["Days written", `${coverage}%`, `of ${fmtNum(spanDays)} days`],
  ]
  for (const [label, value, foot] of tileData) {
    const tile = tiles.createDiv({ cls: "dd-tile" })
    tile.createDiv({ cls: "l", text: label })
    tile.createDiv({ cls: "v", text: value })
    tile.createDiv({ cls: "l", text: foot })
  }
}

// ------------------------------------------------------------------ heatmap
{
  const card = root.createDiv({ cls: "dd-card" })
  const head = card.createDiv({ cls: "dd-head" })
  const titles = head.createDiv()
  titles.createEl("h4", { text: "Words per day" })
  titles.createEl("p", { cls: "dd-sub", text: "Darker means a longer entry. Hover a day for the count." })
  const ranges = head.createDiv({ cls: "dd-ranges", attr: { role: "group", "aria-label": "Time range" } })

  const scroll = card.createDiv({ cls: "dd-scroll" })
  const svg = svgEl(scroll, "svg", { role: "img", "aria-label": "Calendar heatmap of words written per day" })

  const CELL = 12, GAP = 3, STEP = CELL + GAP, PAD_L = 30, PAD_T = 18

  function draw(range) {
    let start, end
    if (range === "recent") {
      end = new Date(today)
      start = new Date(today); start.setFullYear(start.getFullYear() - 1); start.setDate(start.getDate() + 1)
    } else {
      start = new Date(Number(range), 0, 1)
      end = new Date(Number(range), 11, 31)
    }
    const gridStart = new Date(start)
    gridStart.setDate(gridStart.getDate() - gridStart.getDay()) // back to Sunday

    const weeks = Math.ceil((end - gridStart) / DAY_MS / 7) + 1
    const width = PAD_L + weeks * STEP
    const height = PAD_T + 7 * STEP
    svg.replaceChildren()
    svg.setAttribute("width", width)
    svg.setAttribute("height", height)
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`)

    for (const row of [1, 3, 5]) {
      svgEl(svg, "text", { x: 0, y: PAD_T + row * STEP + CELL - 2, class: "tick" }).textContent = WEEKDAYS[row]
    }

    let lastMonth = -1
    const cursor = new Date(gridStart)
    for (let w = 0; w < weeks; w++) {
      for (let d = 0; d < 7; d++) {
        if (cursor >= start && cursor <= end) {
          const k = keyOf(cursor)
          const words = wordsByDate.get(k) ?? 0
          const rect = svgEl(svg, "rect", {
            x: PAD_L + w * STEP, y: PAD_T + d * STEP, width: CELL, height: CELL,
            rx: 2.5, ry: 2.5, class: "cell", fill: `var(--seq-${levelOf(words)})`,
          })
          const when = prettyDate(new Date(cursor))
          const mood = byDate.get(k)?.mood
          hoverable(rect, words
            ? `<b>${fmtNum(words)} words</b><br><span class="m">${when}</span>${mood ? `<br><span class="m">mood: ${mood}</span>` : ""}`
            : `<b>No entry</b><br><span class="m">${when}</span>`)

          if (d === 0 && cursor.getMonth() !== lastMonth) {
            lastMonth = cursor.getMonth()
            svgEl(svg, "text", { x: PAD_L + w * STEP, y: 10, class: "tick" }).textContent = MONTHS[lastMonth]
          }
        }
        cursor.setDate(cursor.getDate() + 1)
      }
    }
  }

  const years = [...new Set(entries.map((e) => e.date.slice(0, 4)))].sort().reverse()
  const buttons = []
  for (const range of [{ id: "recent", label: "Last 12 months" }, ...years.map((y) => ({ id: y, label: y }))]) {
    const btn = ranges.createEl("button", { text: range.label })
    btn.setAttribute("aria-pressed", String(range.id === "recent"))
    btn.onclick = () => {
      for (const other of buttons) other.setAttribute("aria-pressed", String(other === btn))
      draw(range.id)
    }
    buttons.push(btn)
  }
  draw("recent")

  const legend = card.createDiv({ cls: "dd-legend" })
  legend.appendText("Less")
  for (let lv = 0; lv <= cuts.length + 1; lv++) {
    const sw = legend.createEl("i")
    sw.style.background = `var(--seq-${lv})`
    const lo = lv === 0 ? 0 : lv === 1 ? 1 : cuts[lv - 2]
    const hi = lv === 0 ? 0 : lv > cuts.length ? null : cuts[lv - 1] - 1
    hoverable(sw, lv === 0 ? "<b>No entry</b>" : `<b>${fmtNum(lo)}${hi === null ? "+" : `–${fmtNum(hi)}`} words</b>`)
  }
  legend.appendText("More")
}

// --------------------------------------------------------------- bar charts
function barChart(parent, title, subtitle, rows, unit) {
  const card = parent.createDiv({ cls: "dd-card" })
  card.createEl("h4", { text: title })
  card.createEl("p", { cls: "dd-sub", text: subtitle })
  const scroll = card.createDiv({ cls: "dd-scroll" })
  const svg = svgEl(scroll, "svg", { role: "img", "aria-label": `${title} bar chart` })
  if (rows.length === 0) return

  const PAD = { t: 10, r: 4, b: 24, l: 42 }
  const H = 176
  const W = Math.max(300, Math.min(560, rows.length * 30 + PAD.l + PAD.r))
  const plotW = W - PAD.l - PAD.r
  const plotH = H - PAD.t - PAD.b
  const max = Math.max(...rows.map((r) => r[1]), 1)
  const niceMax = Math.ceil(max / 100) * 100 || max
  svg.setAttribute("width", W); svg.setAttribute("height", H)
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`)

  for (let i = 0; i <= 2; i++) {
    const value = (niceMax / 2) * i
    const y = PAD.t + plotH - (value / niceMax) * plotH
    svgEl(svg, "line", { x1: PAD.l, x2: W - PAD.r, y1: y, y2: y, class: "grid" })
    svgEl(svg, "text", { x: PAD.l - 7, y: y + 3.5, class: "tick", "text-anchor": "end" }).textContent =
      value >= 1000 ? `${(value / 1000).toFixed(value % 1000 ? 1 : 0)}k` : String(value)
  }

  const slot = plotW / rows.length
  const barW = Math.max(3, Math.min(34, slot - 2)) // 2px surface gap between bars
  const stride = Math.max(1, Math.ceil(rows.length / Math.floor(plotW / 42)))
  rows.forEach(([name, value], i) => {
    const h = (value / niceMax) * plotH
    const x = PAD.l + i * slot + (slot - barW) / 2
    const rect = svgEl(svg, "rect", {
      x, y: PAD.t + plotH - h, width: barW,
      height: Math.max(h, value > 0 ? 1 : 0), rx: Math.min(4, barW / 2), class: "bar",
    })
    hoverable(rect, `<b>${fmtNum(value)} ${unit}</b><br><span class="m">${name}</span>`)
    if (i % stride === 0) {
      svgEl(svg, "text", { x: x + barW / 2, y: H - 7, class: "tick", "text-anchor": "middle" }).textContent = name
    }
  })
}

{
  const two = root.createDiv({ cls: "dd-two" })
  const monthRows = [...monthTotals.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([m, w]) => [`${MONTHS[Number(m.slice(5, 7)) - 1]} ${m.slice(2, 4)}`, w])
  barChart(two, "Words per month", "Total across all entries that month.", monthRows, "words")
  barChart(two, "Average entry by weekday", "Mean words on the days you did write.",
    weekdayAgg.map((s, i) => [WEEKDAYS[i], s.days ? Math.round(s.words / s.days) : 0]), "words/entry")
}

// -------------------------------------------------------------- table view
{
  const card = root.createDiv({ cls: "dd-card" })
  const details = card.createEl("details")
  details.createEl("summary", { text: `All entries (${fmtNum(entries.length)}) — table view` })
  const table = details.createEl("table", { cls: "dd-table" })
  const headRow = table.createEl("thead").createEl("tr")
  for (const [label, cls] of [["Date", ""], ["Words", "num"], ["Mood", ""]]) {
    headRow.createEl("th", { text: label, cls })
  }
  const body = table.createEl("tbody")
  for (const entry of [...entries].reverse()) {
    const row = body.createEl("tr")
    const link = row.createEl("td").createEl("a", {
      cls: "internal-link",
      text: prettyDate(parseKey(entry.date)),
      attr: { href: entry.path, "data-href": entry.path },
    })
    link.onclick = (evt) => {
      evt.preventDefault()
      dv.app.workspace.openLinkText(entry.path, "", evt.metaKey || evt.ctrlKey)
    }
    row.createEl("td", { text: fmtNum(entry.words), cls: "num" })
    row.createEl("td", { text: entry.mood || "—" })
  }
  if (undated > 0) {
    card.createEl("p", { cls: "dd-sub", text: `${undated} file(s) skipped — no date property and no YYYY-MM-DD in the filename.` })
  }
}
```
