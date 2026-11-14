# Sakura Market — LAB-5 Backlog

- **Dự án:** 桜水産卸売市場 運営支援システム — Release 1
- **Mã học viên:** huyennt-2543
- **Đề:** Product A (sàn đấu giá thủy sản)

## Tổng quan

- **Break từ:** bộ thiết kế LAB-4 `specs/` (PREMISE chốt ngày **2026-11-08**, repo prototype private `sakura-market`, commit `e4c0f25`), dùng `gap-analysis.md` (31 gap) làm khung.
- **PREMISE.md: có thay đổi.** 6 chỗ sửa spec (P-01〜P-06), lớn nhất là đưa 完納奨励金 từ mức kiến trúc lên mức task; 8 giả định bổ sung; 5 hướng đã chốt.
- **Backlog:** 8 epic, 48 issue, 12 sub-issue; 301 SWP (đã review) ≈ 903 giờ.
- **Sprint giả lập đã chạy:** `Sprint 1` (2026-11-09 → 2026-11-20). Xong 32/55 SWP, còn 23 SWP chuyển Sprint 2.

## Link

| | |
|---|---|
| Repo | https://github.com/huyennt-2543/sakura-market-lab5-backlog |
| GitHub Project | https://github.com/users/huyennt-2543/projects/2 |
| Báo cáo HTML skill chấm SWP | [reports/sun-estimate-sakura-market-lab5-backlog-20261114.html](reports/sun-estimate-sakura-market-lab5-backlog-20261114.html) |

Đã mở thử repo, Project và trang issue bằng cửa sổ ẩn danh (không đăng nhập): xem được.

## Cấu trúc repo

| File / thư mục | Nội dung |
|---|---|
| `README.md` | File này |
| `PREMISE.md` | Backlog khác LAB-4 ở đâu: spec sửa, giả định, hướng đã chốt |
| `task-breakdown.md` | Nguyên tắc chia task, spec → issue, hạng mục 完納奨励金, chỗ hở của spec LAB-4 |
| `estimate.md` | Issue mẫu đã review, quy ước giờ = SWP × 3, tổng theo epic, so với LAB-1 |
| `progress-report.md` | Báo cáo Sprint 1: trạng thái, burndown, rủi ro trễ |
| `AI-report.md` | Skill, prompt, cách review output AI, điểm cần cải thiện |
| `reports/` | Báo cáo HTML của skill chấm SWP (`sun-estimate-…html`) và ảnh burndown (`burndown-sprint-1.svg`) |
| `tools/backlog-data.mjs` | Nguồn duy nhất của backlog (epic, issue, sub-issue, ưu tiên, sprint, người phụ trách giả định) |
| `tools/create-github-issues.mjs` | Tạo label, epic, issue, sub-issue trên GitHub từ file dữ liệu |
| `tools/export-swp-from-report.mjs` | Đọc payload trong báo cáo HTML → `tools/swp-final.json` |
| `tools/sync-github-project.mjs` | Tạo Project, trường, Iteration và ghi giá trị cho từng issue |
| `tools/create-project-views.mjs` | Tạo 3 view trên Project: Backlog (bảng), Sprint 1 — Board, 完納奨励金 |
| `tools/sprint-1-progress-data.mjs` | Số liệu Sprint 1 **giả lập** (trạng thái, ngày xong, giờ thực tế) |
| `tools/render-burndown-svg.mjs` | Vẽ burndown từ số liệu giả lập |
| `tools/issue-map.json`, `tools/swp-final.json`, `tools/project-info.json` | Kết quả trung gian của các script (key → số issue, SWP cuối, link Project) |

Không có thư mục `skills/`: không viết hay chỉnh skill nào, chỉ dùng skill có sẵn (`tkm:sun-estimate`, `tkm:confidence`).

## Spec → epic

| Spec (mã / file LAB-4, hoặc dòng PREMISE) | Epic trên Project | Ghi chú |
|---|---|---|
| PREMISE §2.4, §5; gap G-C1, G-F1, G-H2, G-H3 | #1 — Nền tảng: chợ, vai trò mới, mã lỗi, dữ liệu mẫu | |
| ADR-005, BL005/BL006, SCR-ADM-001; gap G-B1〜B3 | #2 — Ngày nghiệp vụ 02:00 và lịch chợ | Giờ chuyển ngày 02:00 |
| ADR-008, BL010/BL014, SCR-SET-011〜013; gap G-C2, G-C3, G-A7, G-E1, G-H1 | #3 — Quy tắc vận hành có phiên bản (Maker-Checker) | Bảng tỷ lệ 奨励金, tối đa 4 lần/năm; thêm PREMISE P-02, P-03, P-04 |
| ADR-004, BL001/BL002/BL013, SCR-PAR-001〜003; gap G-A1〜A8 | #4 — Giấy phép 許可 / 承認 và tư cách người mua | |
| BL009, SCR-TRD-005; gap G-D1 | #5 — Hủy giao dịch trước chốt sổ | |
| ADR-006, BL007/BL008/BL011, SCR-SET-001〜003, 006〜008; gap G-D2〜D5, G-H4 | #6 — Chốt sổ, mở lại ngày, 訂正申請 | PREMISE P-06 |
| F-19 / BR-INC-01 (LAB-4: chỉ kiến trúc) → PREMISE P-01〜P-05, G-01〜G-06 | #7 — 完納奨励金 | **Ràng buộc đặc thù Product A**: epic riêng, engine tách theo từng biến công thức (#54〜#59) |
| ADR-003, ADR-007, permissions-matrix; gap G-F2〜F6 | #8 — Phân quyền, kiểm toán, MFA, hạ tầng | |
