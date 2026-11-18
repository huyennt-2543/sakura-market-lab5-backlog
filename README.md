# Sakura Market — LAB-5 Backlog

- **Dự án:** 桜水産卸売市場 運営支援システム — Release 1
- **Mã học viên:** B122543 (GitHub account: huyennt-2543)
- **Đề:** Product A (sàn đấu giá thủy sản)

## Tổng quan

- **Break từ:** bộ thiết kế LAB-4 `specs/` (PREMISE chốt ngày **2026-11-08**, repo prototype private `sakura-market`, commit `e4c0f25`), dùng `gap-analysis.md` (31 gap) làm khung.
- **PREMISE.md: có thay đổi.** 6 chỗ sửa spec (P-01〜P-06), lớn nhất là đưa 完納奨励金 từ mức kiến trúc lên mức task; 8 giả định bổ sung; 5 hướng đã chốt.
- **Backlog:** 8 epic, 48 issue, 12 sub-issue; 301 SWP (Standard Work Point — điểm khối lượng chuẩn, giải thích ở cuối file; đã review) ≈ 903 giờ.
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

## Từ viết tắt và mã dùng trong file này

| Viết tắt / mã | Nghĩa |
|---|---|
| SWP | Standard Work Point — điểm khối lượng công việc chuẩn của skill `tkm:sun-estimate`. Mỗi issue chấm 2 trục: Scope (độ rộng: số màn, bảng, lớp) và Complexity (độ khó bên trong: trạng thái, thuật toán, migration, rủi ro vận hành); SWP tra từ bảng nhân cố định Scope × Complexity. Thang: rất dễ 1–2, dễ 3–5, vừa 6–12, khó 13–25, rất khó 26+. Không phải giờ: bài này quy 1 SWP = 3 giờ |
| LAB-1 / LAB-2 / LAB-4 | Các bài thực hành trước: LAB-1 đọc RFP, estimate, WBS (8 file Excel); LAB-2 prototype Next.js + Supabase; LAB-4 bộ thiết kế `specs/` (wireframe, kiến trúc, ADR, spec màn hình, gap-analysis) |
| F-nn | Mã feature trong フィーチャー一覧 của LAB-1 (ví dụ F-19 = tính 完納奨励金, F-21 = 14 báo cáo) |
| BR-xxx-nn | Business Rule — mã quy tắc nghiệp vụ dùng chung từ LAB-1/LAB-4 (ví dụ BR-INC-01 công thức 完納奨励金, BR-RULE-01 Maker ≠ Checker và tối đa 4 lần/năm, BR-PERM-01 tư cách người mua) |
| BLnnn | Behavior Logic — số mục trong `07-business-rules/behavior-logic.md` của LAB-4 (ví dụ BL010 vòng đời phiên bản quy tắc) |
| ADR-nnn | Architecture Decision Record — bản ghi quyết định kiến trúc của LAB-4 (ADR-001〜008) |
| SCR-xxx-nnn | Mã màn hình theo 画面一覧 LAB-1. Nhóm: COM chung, IAM tài khoản, PAR người tham gia, LOT lô hàng, TRD giao dịch, DEL giao hàng, SET chốt sổ / 精算 / 奨励金, RPT báo cáo, ADM quản trị, AUD kiểm toán |
| G-A1, G-C2… (gap) | Mã dòng trong `gap-analysis.md` của LAB-4: chỗ prototype LAB-2 còn làm khác thiết kế. Nhóm A giấy phép, B ngày nghiệp vụ, C quy tắc vận hành, D giao dịch / chốt sổ, E giao hàng, F phân quyền / audit, H hạ tầng / dữ liệu mẫu |
| P-nn / G-nn / H-nn | Mã dòng trong PREMISE.md của LAB-5: P = spec sửa so với LAB-4, G = giả định bổ sung, H = hướng đã chốt. Issue trỏ ngược về các mã này |
| E1…E8, E7-05a | Key nội bộ của backlog trong `tools/backlog-data.mjs`: E1〜E8 là epic, E7-05 là issue thứ 5 của epic 7, E7-05a là sub-issue. Tiêu đề issue trên GitHub bắt đầu bằng key này, ví dụ `[E7-05a]` |
| #nn | Số issue trên GitHub (ví dụ #7 = epic 完納奨励金, #53 = engine tính) |
| Maker-Checker | Quy trình 2 người: Maker lập bản nháp, Checker duyệt; dùng cho phiên bản quy tắc vận hành và biểu phí |
| MFA / TOTP / AAL | Multi-Factor Authentication (xác thực nhiều lớp) / Time-based One-Time Password (mã 6 số theo thời gian) / Authenticator Assurance Level (aal2 = đã qua MFA) |
