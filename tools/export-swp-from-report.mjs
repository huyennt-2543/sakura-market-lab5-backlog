// Đọc payload JSON nhúng trong báo cáo HTML của tkm:sun-estimate, kiểm nhanh,
// rồi ghi tools/swp-final.json (key issue → số issue, Scope, Complexity, SWP cuối).
// Đây là nguồn SWP duy nhất cho các bước ghi lên Project và viết estimate.md.
// Chạy: node tools/export-swp-from-report.mjs reports/<file>.html
import { readFileSync, writeFileSync } from 'node:fs';

const file = process.argv[2];
const html = readFileSync(file, 'utf8');
const m = html.match(/<script id="report-data" type="application\/json">([\s\S]*?)<\/script>/);
if (!m) throw new Error('không thấy payload report-data');
const p = JSON.parse(m[1]);

const out = { issues: {}, parents: {} };
for (const i of p.issues) {
  out.issues[i.functionRef] = { number: +i.issueRef.split('#')[1], scope: i.finalScope, complexity: i.finalComplexity, swp: i.finalSWP, confidence: i.confidence };
}
for (const x of p.parents) {
  out.parents[x.issueRef.split('#')[1]] = { status: x.aggregationStatus, swp: x.finalSWP };
}
out.total = p.issues.reduce((a, i) => a + i.finalSWP, 0);
out.calibrationStatus = p.run.calibrationStatus;
out.representatives = p.representatives.map((r) => ({ number: +r.issueRef.split('#')[1], reasons: r.selectionReasons }));

const network = /fetch\(|XMLHttpRequest|src="https?:/.test(html);
console.log(`status=${out.calibrationStatus} issues=${p.issues.length} parents=${p.parents.length} total=${out.total} network=${network}`);
writeFileSync(new URL('./swp-final.json', import.meta.url), JSON.stringify(out, null, 1));
