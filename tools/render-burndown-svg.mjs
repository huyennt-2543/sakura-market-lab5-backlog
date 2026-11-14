// Vẽ burndown Sprint 1 (SWP còn lại cuối mỗi ngày) ra reports/burndown-sprint-1.svg
// và in bảng số liệu để chép vào progress-report.md. Chỉ issue Done mới trừ khỏi SWP còn lại.
// Chạy: node tools/render-burndown-svg.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { items } from './backlog-data.mjs';
import { progress, workDays, sprint } from './sprint-1-progress-data.mjs';

const swpFinal = JSON.parse(readFileSync(new URL('./swp-final.json', import.meta.url), 'utf8'));
const scope = items.filter((i) => i.sp === 1);
const total = scope.reduce((a, i) => a + swpFinal.issues[i.k].swp, 0);
const remaining = workDays.map((d) => total - scope
  .filter((i) => progress[i.k]?.status === 'Done' && progress[i.k].done <= d)
  .reduce((a, i) => a + swpFinal.issues[i.k].swp, 0));
const ideal = workDays.map((_, i) => +(total - (total * (i + 1)) / workDays.length).toFixed(1));

const W = 720, H = 380, L = 56, R = 24, T = 48, B = 64;
const x = (i) => L + ((W - L - R) * (i + 1)) / workDays.length;
const x0 = L;
const y = (v) => T + (H - T - B) * (1 - v / total);
const path = (vals) => `M${x0},${y(total)} ` + vals.map((v, i) => `L${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
const grid = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(total * f));

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" font-family="Segoe UI, Arial, sans-serif" font-size="12">
<rect width="${W}" height="${H}" fill="#ffffff"/>
<text x="${L}" y="24" font-size="15" font-weight="600" fill="#1f2328">Burndown ${sprint.name} (${sprint.start} → ${sprint.end}) — SWP còn lại · số liệu giả lập</text>
${grid.map((g) => `<line x1="${L}" x2="${W - R}" y1="${y(g)}" y2="${y(g)}" stroke="#e5e7eb"/><text x="${L - 8}" y="${y(g) + 4}" text-anchor="end" fill="#57606a">${g}</text>`).join('\n')}
${workDays.map((d, i) => `<text x="${x(i)}" y="${H - B + 18}" text-anchor="middle" fill="#57606a">${d.slice(8)}/${d.slice(5, 7)}</text>`).join('\n')}
<text x="${x0}" y="${H - B + 18}" text-anchor="middle" fill="#57606a">bắt đầu</text>
<path d="${path(ideal)}" fill="none" stroke="#8c959f" stroke-width="2" stroke-dasharray="6 4"/>
<path d="${path(remaining)}" fill="none" stroke="#cf222e" stroke-width="2.5"/>
${remaining.map((v, i) => `<circle cx="${x(i)}" cy="${y(v)}" r="3.5" fill="#cf222e"/>`).join('\n')}
<text x="${x(workDays.length - 1) - 4}" y="${y(remaining.at(-1)) + 22}" text-anchor="end" fill="#cf222e" font-weight="600">còn ${remaining.at(-1)} SWP</text>
<g transform="translate(${L},${H - 22})"><line x1="0" x2="24" y1="0" y2="0" stroke="#8c959f" stroke-width="2" stroke-dasharray="6 4"/><text x="30" y="4" fill="#1f2328">Lý tưởng</text>
<line x1="110" x2="134" y1="0" y2="0" stroke="#cf222e" stroke-width="2.5"/><text x="140" y="4" fill="#1f2328">Thực tế (chỉ tính issue Done)</text></g>
</svg>
`;
writeFileSync(new URL('../reports/burndown-sprint-1.svg', import.meta.url), svg);
console.log(`| Ngày | Lý tưởng | Thực tế |\n|---|---:|---:|\n| bắt đầu | ${total} | ${total} |`);
workDays.forEach((d, i) => console.log(`| ${d} | ${ideal[i]} | ${remaining[i]} |`));
