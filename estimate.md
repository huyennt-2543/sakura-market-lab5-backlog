# Estimate — SWP và giờ

**Báo cáo HTML của skill chấm SWP:** [reports/sun-estimate-sakura-market-lab5-backlog-20261114.html](reports/sun-estimate-sakura-market-lab5-backlog-20261114.html)
(skill `tkm:sun-estimate`; file HTML tự chứa, không gọi mạng — tải về rồi mở bằng trình duyệt)

Tóm tắt từ payload nhúng trong báo cáo: 57 việc chấm trực tiếp (issue không có con + sub-issue), 11 container (8 epic + #23, #42, #53) lấy tổng của con, **tổng 301 SWP**, trạng thái hiệu chỉnh `accepted`. SWP trên Project lấy đúng từ báo cáo này (script [`tools/export-swp-from-report.mjs`](tools/export-swp-from-report.mjs)), không chấm lại bằng tay.

## 1. Issue mẫu skill chọn để kiểm

Skill tự chọn 5 issue theo luật cố định (nhỏ nhất, trung vị, lớn nhất, lệch xa nhất, độ tin cậy thấp nhất). Mỗi issue được hỏi 2 bước: mức khó (rất dễ / dễ / vừa / khó / rất khó), rồi điểm cụ thể trong mức.

| Issue | Skill chấm (Scope × Complexity → SWP) | Bạn chốt | Lý do |
|---|---|---|---|
| #24 [E3-07a] confirm_trade đọc cờ 確認者 | 1 × 1 → **1** (rất dễ) | 1 — giữ | Đúng một nhánh `if` trong RPC đã có, test bật/tắt cờ. Không có gì để nâng |
| #40 [E6-04] day_reopen_requests + 2 RPC | 3 × 2 → **5** (dễ) | 5 — giữ | Cùng khuôn với #29 (bảng + RPC + SoD). Cân nhắc hạ xuống 4 vì làm theo mẫu, nhưng giữ 5 vì vẫn phải test SoD và trạng thái ngày `reopened` tương tác với chốt sổ |
| #60 [E7-06] Chênh lệch sau khóa kỳ 完納奨励金 | 5 × 5 → **15** (khó) | 15 — giữ | Issue lớn nhất. Cân nhắc 20 nhưng giữ 15: rủi ro chính (tổng âm) đã có giả định G-05; nếu khách trả lời khác thì chấm lại, không cộng dự phòng vào điểm |
| #18 [E3-02] Vòng đời phiên bản quy tắc + BR-RULE-01 | 5 × 3 → **10** (vừa) | 10 — giữ | 4 RPC, SoD, đếm 4 lần/năm, ràng buộc ngày 1 tháng. Thực tế Sprint 1 đã dùng 26 / 30 giờ dù còn ở In Review, khớp mức này |
| #49 [E7-01] Làm rõ công thức 完納奨励金 | 2 × 2 → **3** (dễ), độ tin cậy thấp | 3 — giữ | Effort là soạn câu hỏi và cập nhật PREMISE; thời gian chờ khách không tính vào SWP mà theo dõi ở rủi ro R1 |

**Không sửa issue nào. Vì sao giữ nguyên:** cả 5 issue mẫu đều có lý do chấm cụ thể (số bảng, số RPC, biến công thức), khớp cách nhóm hình dung độ lớn. Hai chỗ cân nhắc sửa (#40 xuống 4, #60 lên 20) đều bị bác vì lý do đã ghi ở trên. Không sửa nên không có quy tắc lan sang issue cùng nhóm; 52 issue còn lại giữ điểm ban đầu. Đánh đổi: review chỉ 5/57 mẫu (9%) nên lỗi chấm ở nhóm không có mẫu (ví dụ migration, đã thấy lệch ở Sprint 1) chưa được phát hiện; xem rủi ro R3 trong progress-report.

## 2. Cách quy ra giờ

- **Cách chọn:** quy ước đổi cố định **giờ ước lượng = SWP × 3**, áp cho mọi issue và sub-issue; epic và issue có sub-issue = tổng con. Không ước trực tiếp từng issue.
- **Vì sao:** SWP đã được chấm và review theo một thang thống nhất. Ước giờ trực tiếp thì mỗi issue một kiểu cảm tính, và giờ với SWP có thể mâu thuẫn nhau. Một hệ số duy nhất giữ hai trường luôn khớp, và chỉnh được bằng một con số khi có dữ liệu thật.
- **Căn cứ con số 3:** issue 1 SWP nhỏ nhất (#63: sửa `requireRole` 2 route + test 403 + PR review) ≈ 3 giờ. Kiểm lại với Sprint 1 giả lập: 8 issue Done ước 96 giờ, thực tế 105 giờ (+9%), trong ngưỡng ±15% nên giữ hệ số.
- **Quy tắc áp dụng:** giờ gồm làm + unit/DB test + review + sửa sau review của chính issue đó. Không gồm kiểm thử hệ thống, PM, chờ khách, dự phòng rủi ro. Dự phòng để ở mức release (mục 4), không nhét vào từng issue. Giờ không làm tròn vì SWP là số nguyên.
- **Khi nào đổi hệ số:** sau 2 sprint, nếu giờ thực tế / giờ ước lượng của issue Done lệch quá ±15% thì chỉnh hệ số cho cả backlog (không sửa SWP). Riêng nhóm migration đang lệch +33% (#27), theo dõi riêng ở R3.

## 3. Tổng theo epic

| Epic | Số issue (kể cả sub-issue) | Tổng SWP | Tổng giờ | Ghi chú |
|---|---:|---:|---:|---|
| #1 Nền tảng | 4 | 14 | 42 | Toàn bộ ở Sprint 1 |
| #2 Ngày nghiệp vụ & lịch chợ | 4 | 19 | 57 | |
| #3 Quy tắc vận hành (Maker-Checker) | 10 | 48 | 144 | Gồm bảng tỷ lệ 奨励金 (#21) |
| #4 Giấy phép 許可 / 承認 | 8 | 50 | 150 | 2 issue migration dữ liệu |
| #5 Hủy giao dịch | 2 | 11 | 33 | |
| #6 Chốt sổ, mở lại, 訂正 | 12 | 57 | 171 | #42 có 3 sub-issue |
| #7 **完納奨励金** | 14 | **71** | **213** | Ràng buộc đặc thù; epic lớn nhất; #53 có 6 sub-issue; 6 issue độ tin cậy trung bình/thấp vì chờ FIN-02 |
| #8 Phân quyền, audit, MFA, hạ tầng | 6 | 31 | 93 | |
| **Tổng** | **60** | **301** | **903** | ≈ 113 người-ngày (8 giờ/ngày), chưa gồm dự phòng |

**Dự phòng mức release:** +20% (≈ 180 giờ) cho chênh lệch ước lượng và trả lời FIN-02 khác giả định. Thấp hơn 30% của LAB-1 vì phần khó về kỹ thuật (offline sync) đã ra khỏi phạm vi.

## 4. So với estimate LAB-1

LAB-1 tính bằng người-ngày, phần phát triển (BE + FE + design, gồm hệ số FixBug 0.3 và UT 0.7, chưa gồm QA, PM, buffer 30%). LAB-5 đổi giờ ra người-ngày theo 8 giờ/ngày, cùng nền "phát triển + unit test", nên so được với nhau.

| Phần | LAB-1 (người-ngày) | LAB-5 (người-ngày) | Chênh | Vì sao |
|---|---:|---:|---:|---|
| #1 Nền tảng (LAB-1: 共通基盤 + RBAC) | 22 | 5.3 | −76% | Prototype LAB-2 đã có kiến trúc, RBAC, xử lý lỗi; LAB-5 chỉ thêm `markets` và 2 vai trò (PREMISE G-08) |
| #2 Ngày nghiệp vụ & lịch (SCR-ADM-001) | 8.5 | 7.1 | −16% | LAB-1 tính 業務日 trong 共通基盤; LAB-5 tách thành #13, #14 |
| #3 Quy tắc vận hành (SCR-SET-011〜013) | 28.5 | 18 | −37% | Dùng lại UI kit và mẫu RPC của prototype; LAB-5 thêm job #19 và 3 sub-issue đọc tham số |
| #4 Giấy phép (参加者管理, trừ PAR-004 và batch cảnh báo) | 30 | 18.8 | −37% | Màn danh sách đã có ở prototype; LAB-5 thêm 2 issue migration dữ liệu mà LAB-1 không có |
| #5 Hủy giao dịch (SCR-TRD-005) | 6.5 | 4.1 | −37% | Màn giao dịch đã có, chỉ thêm dialog và RPC |
| #6 Chốt sổ + 訂正 (照合・締め + 訂正管理) | 70.5 | 21.4 | −70% | Prototype đã có SET-001/002 và khóa ngày; còn thiếu khung giờ, mở lại ngày và 訂正 |
| #7 **完納奨励金** (SET-009, SET-010, engine, chênh lệch kỳ sau) | 38 | 26.6 | **−30%** | Giảm ít nhất vì prototype chưa có gì phần này. LAB-5 thêm việc LAB-1 không tính: issue làm rõ #49, bộ test vector #59, job #61 (PREMISE P-01, P-05). Ngược lại bỏ phần dữ liệu cũ và báo cáo RPT-07 |
| #8 Phân quyền, audit, MFA, hạ tầng (監査 + SCR-COM-002) | 24 | 11.6 | −52% | Trigger audit đã có ở prototype; LAB-5 thêm chuyển region Tokyo #68 mà LAB-1 không có (LAB-1 dựng AWS mới) |
| **Tổng phần tương ứng** | **228** | **112.9** | **−50%** | |
| Ngoài phạm vi LAB-5 | 帳票 113, data migration 42, offline/PWA 31, 通知 25, 会計連携 20, 紛争 16… | — | — | LAB-4 đã để ngoài Release 1 hoặc chỉ ở mức kiến trúc |

Hai nguyên nhân chính của mức giảm 50%: (1) LAB-1 ước cho hệ thống mới trên Java/AWS, LAB-5 làm tiếp trên prototype đã chạy (G-08); (2) LAB-1 nhân thêm FixBug + UT ≈ 2 lần giờ làm, LAB-5 dùng một hệ số 3 giờ/SWP đã gồm test và đã đối chiếu với Sprint 1. Riêng 完納奨励金 giảm ít nhất. Đây cũng là nơi estimate dễ sai nhất, vì công thức còn chờ khách (#49).

## Từ viết tắt và mã dùng trong file này

| Viết tắt / mã | Nghĩa |
|---|---|
| SWP | Standard Work Point — điểm khối lượng công việc chuẩn của skill `tkm:sun-estimate`. Mỗi issue chấm 2 trục: Scope (độ rộng: số màn, bảng, lớp) và Complexity (độ khó bên trong: trạng thái, thuật toán, migration, rủi ro vận hành); SWP tra từ bảng nhân cố định Scope × Complexity. Thang: rất dễ 1–2, dễ 3–5, vừa 6–12, khó 13–25, rất khó 26+. Không phải giờ: bài này quy 1 SWP = 3 giờ |
| Scope × Complexity | Hai trục chấm SWP: Scope ∈ {1, 2, 3, 5, 8, 13}, Complexity ∈ {0, 1, 2, 3, 5, 8} |
| LAB-1 / LAB-2 / LAB-4 | Các bài thực hành trước: LAB-1 đọc RFP, estimate, WBS (8 file Excel); LAB-2 prototype Next.js + Supabase; LAB-4 bộ thiết kế `specs/` (wireframe, kiến trúc, ADR, spec màn hình, gap-analysis) |
| FIN-01, FIN-02 | Mã câu hỏi nhóm tài chính trong bảng hỏi RFP của LAB-1. FIN-01: ngày thanh toán lấy từ đâu (trả lời giả định: nhập tay hoặc import CSV). FIN-02: chi tiết công thức 完納奨励金 (trả lời giả định: kỳ tháng, tỷ lệ theo bậc doanh số, hạn N ngày) |
| BR-xxx-nn | Business Rule — mã quy tắc nghiệp vụ dùng chung từ LAB-1/LAB-4 (ví dụ BR-INC-01 công thức 完納奨励金, BR-RULE-01 Maker ≠ Checker và tối đa 4 lần/năm, BR-PERM-01 tư cách người mua) |
| SCR-xxx-nnn | Mã màn hình theo 画面一覧 LAB-1. Nhóm: COM chung, IAM tài khoản, PAR người tham gia, LOT lô hàng, TRD giao dịch, DEL giao hàng, SET chốt sổ / 精算 / 奨励金, RPT báo cáo, ADM quản trị, AUD kiểm toán |
| RPT-nn | Mã báo cáo cố định trong RFP (ví dụ RPT-07 kết quả 完納奨励金 theo kỳ) |
| P-nn / G-nn / H-nn | Mã dòng trong PREMISE.md của LAB-5: P = spec sửa so với LAB-4, G = giả định bổ sung, H = hướng đã chốt. Issue trỏ ngược về các mã này |
| E1…E8, E7-05a | Key nội bộ của backlog trong `tools/backlog-data.mjs`: E1〜E8 là epic, E7-05 là issue thứ 5 của epic 7, E7-05a là sub-issue. Tiêu đề issue trên GitHub bắt đầu bằng key này, ví dụ `[E7-05a]` |
| #nn | Số issue trên GitHub (ví dụ #7 = epic 完納奨励金, #53 = engine tính) |
| R1〜R6 | Mã rủi ro trễ tiến độ trong progress-report.md |
| BE / FE / QA | Backend / Frontend / Quality Assurance (kiểm thử). BE-1, FE-2, QA-1… là vai trò giả định trong đội, không phải người thật |
| PM / TL | Project Manager / Tech Lead |
| RPC | Remote Procedure Call — ở đây là hàm trong Postgres (Supabase) mà API gọi tới; quy tắc nghiệp vụ cần nguyên tử nằm trong RPC (ADR-002 LAB-4) |
| SoD | Segregation of Duties — tách nhiệm vụ: người lập và người duyệt phải khác nhau |
| Maker-Checker | Quy trình 2 người: Maker lập bản nháp, Checker duyệt; dùng cho phiên bản quy tắc vận hành và biểu phí |
| MFA / TOTP / AAL | Multi-Factor Authentication (xác thực nhiều lớp) / Time-based One-Time Password (mã 6 số theo thời gian) / Authenticator Assurance Level (aal2 = đã qua MFA) |
| RBAC | Role-Based Access Control — phân quyền theo vai trò |
| UT | Unit Test — kiểm thử đơn vị |
| PR | Pull Request — yêu cầu gộp code, nơi review |
| DB | Database — cơ sở dữ liệu (Postgres trên Supabase) |
| UI | User Interface — giao diện màn hình |
| PWA | Progressive Web App — web chạy offline như ứng dụng (ngoài Release 1) |
| AWS | Amazon Web Services — hạ tầng mà estimate LAB-1 giả định |
