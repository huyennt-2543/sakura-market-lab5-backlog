// Tạo GitHub Project (user-owned, public) cho backlog và ghi giá trị trường cho từng issue:
// Status, Iteration, SWP (đã review), Giờ ước lượng, Giờ thực tế (Sprint 1), Phụ trách (giả định), Ưu tiên.
// SWP lấy từ tools/swp-final.json (xuất từ báo cáo HTML của tkm:sun-estimate), không tự chấm lại.
// Chạy: node tools/sync-github-project.mjs <owner> <repo>
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { epics, items, sprints } from './backlog-data.mjs';
import { progress, HOURS_PER_SWP } from './sprint-1-progress-data.mjs';

const [owner, repo] = process.argv.slice(2);
if (!owner || !repo) throw new Error('usage: node tools/sync-github-project.mjs <owner> <repo>');
const swpFinal = JSON.parse(readFileSync(new URL('./swp-final.json', import.meta.url), 'utf8'));
const issueMap = JSON.parse(readFileSync(new URL('./issue-map.json', import.meta.url), 'utf8'));

function gql(query, variables = {}) {
  const out = execFileSync('gh', ['api', 'graphql', '--input', '-'], {
    input: JSON.stringify({ query, variables }), encoding: 'utf8', stdio: ['pipe', 'pipe', 'inherit'],
  });
  const res = JSON.parse(out);
  if (res.errors) throw new Error(JSON.stringify(res.errors));
  return res.data;
}

// SWP: việc chấm trực tiếp lấy từ báo cáo; container = tổng con (đúng như rollup trong báo cáo).
const swpOf = (k) => swpFinal.issues[k]?.swp ?? items.filter((i) => i.p === k).reduce((a, i) => a + swpOf(i.k), 0);

// 1. Project + liên kết repo
const ids = gql(`query($o:String!,$r:String!){user(login:$o){id} repository(owner:$o,name:$r){id}}`, { o: owner, r: repo });
const project = gql(`mutation($o:ID!,$t:String!){createProjectV2(input:{ownerId:$o,title:$t}){projectV2{id number url}}}`,
  { o: ids.user.id, t: 'Sakura Market — LAB-5 Backlog (Product A)' }).createProjectV2.projectV2;
const P = project.id;
gql(`mutation($p:ID!,$r:ID!){linkProjectV2ToRepository(input:{projectId:$p,repositoryId:$r}){repository{id}}}`, { p: P, r: ids.repository.id });
gql(`mutation($p:ID!,$d:String!,$m:String!){updateProjectV2(input:{projectId:$p,public:true,shortDescription:$d,readme:$m}){projectV2{id}}}`, {
  p: P, d: 'Backlog Release 1 break từ LAB-4: epic → issue → sub-issue, SWP đã review, giờ ước lượng, Sprint 1 giả lập',
  m: `Repo: https://github.com/${owner}/${repo}\n\nSWP chấm bằng tkm:sun-estimate, đã review 5 issue mẫu. Giờ ước lượng = SWP × ${HOURS_PER_SWP}. Người phụ trách và số liệu Sprint 1 là GIẢ LẬP.`,
});

// 2. Trường
const options = (names) => names.map((name) => ({ name, color: 'GRAY', description: '' }));
const createField = (dataType, name, extra = '') => gql(
  `mutation($p:ID!,$n:String!){createProjectV2Field(input:{projectId:$p,dataType:${dataType},name:$n${extra}}){projectV2Field{... on ProjectV2Field{id} ... on ProjectV2SingleSelectField{id options{id name}} ... on ProjectV2IterationField{id configuration{iterations{id title}}}}}}`,
  { p: P, n: name }).createProjectV2Field.projectV2Field;
const fSWP = createField('NUMBER', 'SWP (đã review)');
const fHours = createField('NUMBER', 'Giờ ước lượng');
const fActual = createField('NUMBER', 'Giờ thực tế');
const people = ['BE-1', 'BE-2', 'FE-1', 'FE-2', 'QA-1', 'BrSE'];
const fWho = createField('SINGLE_SELECT', 'Phụ trách (giả định)', `,singleSelectOptions:${JSON.stringify(options(people)).replace(/"(\w+)":/g, '$1:').replace(/"GRAY"/g, 'GRAY')}`);
const fPri = createField('SINGLE_SELECT', 'Ưu tiên', `,singleSelectOptions:${JSON.stringify(options(['P0', 'P1', 'P2'])).replace(/"(\w+)":/g, '$1:').replace(/"GRAY"/g, 'GRAY')}`);
const iterCfg = `,iterationConfiguration:{startDate:"${sprints[0].start}",duration:14,iterations:[${sprints.map((s) => `{title:"${s.title}",startDate:"${s.start}",duration:${s.days}}`).join(',')}]}`;
const fIter = createField('ITERATION', 'Iteration', iterCfg);
const iterId = Object.fromEntries(fIter.configuration.iterations.map((it) => [it.title, it.id]));

// Status: đổi option mặc định thành 5 cột
const statusField = gql(`query($p:ID!){node(id:$p){... on ProjectV2{field(name:"Status"){... on ProjectV2SingleSelectField{id}}}}}`, { p: P }).node.field;
const statusNames = ['Todo', 'In Progress', 'In Review', 'Blocked', 'Done'];
const statusColors = { Todo: 'GRAY', 'In Progress': 'YELLOW', 'In Review': 'BLUE', Blocked: 'RED', Done: 'GREEN' };
const fStatus = gql(`mutation($f:ID!){updateProjectV2Field(input:{fieldId:$f,singleSelectOptions:[${statusNames.map((n) => `{name:"${n}",color:${statusColors[n]},description:""}`).join(',')}]}){projectV2Field{... on ProjectV2SingleSelectField{id options{id name}}}}}`,
  { f: statusField.id }).updateProjectV2Field.projectV2Field;
const opt = (field, name) => field.options.find((o) => o.name === name).id;

// 3. Thêm issue vào Project (node id lấy theo số issue)
const nodes = JSON.parse(execFileSync('gh', ['api', '--paginate', `repos/${owner}/${repo}/issues?state=all&per_page=100`, '--jq', '[.[] | {number, node_id}]'], { encoding: 'utf8' }).replace(/\]\s*\[/g, ','));
const nodeOf = Object.fromEntries(nodes.map((n) => [n.number, n.node_id]));
const itemId = {};
for (const k of [...epics.map((e) => e.k), ...items.map((i) => i.k)]) {
  const r = gql(`mutation($p:ID!,$c:ID!){addProjectV2ItemById(input:{projectId:$p,contentId:$c}){item{id}}}`, { p: P, c: nodeOf[issueMap[k].number] });
  itemId[k] = r.addProjectV2ItemById.item.id;
}

// 4. Giá trị trường, gom 20 mutation / request
const ops = [];
const set = (k, field, value) => ops.push({ k, field, value });
for (const e of epics) {
  const swp = swpOf(e.k);
  set(e.k, fSWP.id, `{number:${swp}}`);
  set(e.k, fHours.id, `{number:${swp * HOURS_PER_SWP}}`);
}
for (const it of items) {
  const swp = swpOf(it.k);
  const pr = progress[it.k];
  set(it.k, fSWP.id, `{number:${swp}}`);
  set(it.k, fHours.id, `{number:${swp * HOURS_PER_SWP}}`);
  set(it.k, fWho.id, `{singleSelectOptionId:"${opt(fWho, it.who)}"}`);
  set(it.k, fPri.id, `{singleSelectOptionId:"${opt(fPri, it.pri)}"}`);
  set(it.k, fIter.id, `{iterationId:"${iterId[`Sprint ${it.sp}`]}"}`);
  set(it.k, fStatus.id, `{singleSelectOptionId:"${opt(fStatus, pr?.status ?? 'Todo')}"}`);
  if (pr) set(it.k, fActual.id, `{number:${pr.actualH}}`);
}
for (const e of epics) {
  const childStatus = items.filter((i) => i.p === e.k).map((i) => progress[i.k]?.status ?? 'Todo');
  const s = childStatus.every((x) => x === 'Done') ? 'Done' : childStatus.some((x) => x !== 'Todo') ? 'In Progress' : 'Todo';
  set(e.k, fStatus.id, `{singleSelectOptionId:"${opt(fStatus, s)}"}`);
}
for (let i = 0; i < ops.length; i += 20) {
  const body = ops.slice(i, i + 20).map((o, j) =>
    `m${j}:updateProjectV2ItemFieldValue(input:{projectId:"${P}",itemId:"${itemId[o.k]}",fieldId:"${o.field}",value:${o.value}}){projectV2Item{id}}`).join('\n');
  gql(`mutation{${body}}`);
}

writeFileSync(new URL('./project-info.json', import.meta.url), JSON.stringify({ url: project.url, number: project.number }, null, 2));
console.log(`Project ${project.url}: ${Object.keys(itemId).length} items, ${ops.length} field values`);
