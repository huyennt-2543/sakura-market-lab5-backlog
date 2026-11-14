// Tạo view cho Project: đổi tên view bảng mặc định, thêm board Sprint 1 và bảng lọc 完納奨励金.
// Board nhóm theo Status (mặc định của layout board).
// Chạy: node tools/create-project-views.mjs <owner> <projectNumber>
import { execFileSync } from 'node:child_process';

const [owner, number] = process.argv.slice(2);
if (!owner || !number) throw new Error('usage: node tools/create-project-views.mjs <owner> <projectNumber>');

function gql(query, variables = {}) {
  const out = execFileSync('gh', ['api', 'graphql', '--input', '-'], {
    input: JSON.stringify({ query, variables }), encoding: 'utf8', stdio: ['pipe', 'pipe', 'inherit'],
  });
  const res = JSON.parse(out);
  if (res.errors) throw new Error(JSON.stringify(res.errors));
  return res.data;
}

const p = gql(`query($o:String!,$n:Int!){user(login:$o){projectV2(number:$n){id
  views(first:20){nodes{id name}}
  fields(first:50){nodes{... on ProjectV2FieldCommon{id name}}}}}}`, { o: owner, n: +number }).user.projectV2;
const fieldId = Object.fromEntries(p.fields.nodes.map((f) => [f.name, f.id]));
const cols = (names) => names.map((n) => {
  if (!fieldId[n]) throw new Error(`thiếu trường ${n}`);
  return fieldId[n];
});

const tableCols = cols(['Title', 'Status', 'Iteration', 'SWP (đã review)', 'Giờ ước lượng', 'Giờ thực tế', 'Phụ trách (giả định)', 'Ưu tiên', 'Parent issue', 'Sub-issues progress', 'Labels']);
const boardCols = cols(['Title', 'SWP (đã review)', 'Giờ ước lượng', 'Phụ trách (giả định)', 'Ưu tiên', 'Parent issue']);

const update = (viewId, name, filter, visible) => gql(
  `mutation($v:ID!,$n:String!,$f:String!,$c:[ID!]){updateProjectV2View(input:{viewId:$v,name:$n,filter:$f,configuration:{visibleFieldIds:$c}}){projectV2View{id}}}`,
  { v: viewId, n: name, f: filter, c: visible });
const create = (name, layout, filter, visible) => {
  const existing = p.views.nodes.find((v) => v.name === name);
  const id = existing?.id ?? gql(`mutation($p:ID!,$n:String!){createProjectV2View(input:{projectId:$p,name:$n,layout:${layout}}){projectV2View{id}}}`,
    { p: p.id, n: name }).createProjectV2View.projectV2View.id;
  update(id, name, filter, visible);
  console.log(`${existing ? 'updated' : 'created'} view: ${name}`);
};

const first = p.views.nodes[0];
update(first.id, 'Backlog (bảng)', '', tableCols);
console.log('updated view: Backlog (bảng)');
create('Sprint 1 — Board', 'BOARD_LAYOUT', 'iteration:"Sprint 1"', boardCols);
create('完納奨励金', 'TABLE_LAYOUT', 'label:"constraint:完納奨励金"', tableCols);
