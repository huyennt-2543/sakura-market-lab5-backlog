// Tạo label, epic, issue, sub-issue trên GitHub từ backlog-data.mjs.
// Repo mới nên số issue đi tuần tự: epic #1..#8, sau đó items theo thứ tự trong file.
// Kết quả (key → số issue, id) ghi ra tools/issue-map.json để các script sau dùng.
// Chạy: node tools/create-github-issues.mjs <owner/repo>
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { epics, items } from './backlog-data.mjs';

const repo = process.argv[2];
if (!repo) throw new Error('usage: node tools/create-github-issues.mjs <owner/repo>');

function gh(args, input) {
  return execFileSync('gh', args, { input, encoding: 'utf8', stdio: ['pipe', 'pipe', 'inherit'] });
}
function api(method, path, body) {
  const out = gh(['api', '-X', method, path, '--input', '-'], JSON.stringify(body ?? {}));
  return out ? JSON.parse(out) : null;
}

// Số issue dự kiến: epic trước, items sau, theo đúng thứ tự tạo.
const num = {};
epics.forEach((e, i) => { num[e.k] = i + 1; });
items.forEach((it, i) => { num[it.k] = epics.length + i + 1; });
const ref = (keys) => keys === '—' ? '—' : keys.split(/,\s*/).map((k) => (num[k] ? `#${num[k]} (${k})` : k)).join(', ');

const LABELS = [
  ['epic', '5319e7', 'Epic'], ['P0', 'b60205', 'Chặn ràng buộc đặc thù / luồng chính'], ['P1', 'd93f0b', 'Luồng chính Release 1'],
  ['P2', 'fbca04', 'Hoàn thiện'], ['clarification', '0e8a16', 'Issue làm rõ với khách / spec'],
  ['constraint:完納奨励金', 'c5def5', 'Ràng buộc đặc thù Product A: tiền thưởng thanh toán đủ hạn'],
];
for (const [name, color, description] of LABELS) {
  try { api('POST', `/repos/${repo}/labels`, { name, color, description }); } catch { /* đã có */ }
}

function epicBody(e) {
  const children = items.filter((it) => it.p === e.k).map((it) => `- [ ] #${num[it.k]} ${it.title}`).join('\n');
  return [`**Spec / nguồn:** ${e.spec}`, e.note ? `**Ghi chú:** ${e.note}` : '', '', '## Issue con', children].filter((l) => l !== '').join('\n');
}
function itemBody(it) {
  return [
    `**Epic:** #${num[it.p.split('-')[0]]} · **Cha:** #${num[it.p]} · **Ưu tiên:** ${it.pri} · **Sprint dự kiến:** ${it.sp} · **Phụ trách (giả định):** ${it.who}`,
    `**Spec LAB-4 / nguồn:** ${it.spec} · **Gap:** ${it.gap}`,
    '', '## Mô tả', it.desc,
    '', '## Việc cần làm', ...it.todo.map((t) => `- [ ] ${t}`),
    '', '## Định nghĩa xong', ...it.dod.map((d) => `- ${d}`),
    '- Chung: migration chạy lại được (`db:reset`), test DB của BR liên quan xanh, review code 1 người, trigger audit cho bảng mới',
    '', `**Phụ thuộc:** ${ref(it.dep)}`,
  ].join('\n');
}

const map = {};
for (const e of epics) {
  const r = api('POST', `/repos/${repo}/issues`, { title: `[${e.k}] ${e.title}`, body: epicBody(e), labels: ['epic', ...(e.k === 'E7' ? ['constraint:完納奨励金'] : [])] });
  if (r.number !== num[e.k]) throw new Error(`${e.k}: expected #${num[e.k]}, got #${r.number}`);
  map[e.k] = { number: r.number, id: r.id };
  console.log(`#${r.number} ${e.k}`);
}
for (const it of items) {
  const labels = [it.pri, ...(it.label ? [it.label] : []), ...(it.p.startsWith('E7') ? ['constraint:完納奨励金'] : [])];
  const r = api('POST', `/repos/${repo}/issues`, { title: `[${it.k}] ${it.title}`, body: itemBody(it), labels });
  if (r.number !== num[it.k]) throw new Error(`${it.k}: expected #${num[it.k]}, got #${r.number}`);
  map[it.k] = { number: r.number, id: r.id };
  api('POST', `/repos/${repo}/issues/${map[it.p].number}/sub_issues`, { sub_issue_id: r.id });
  console.log(`#${r.number} ${it.k} → parent #${map[it.p].number}`);
}
writeFileSync(new URL('./issue-map.json', import.meta.url), JSON.stringify(map, null, 2));
