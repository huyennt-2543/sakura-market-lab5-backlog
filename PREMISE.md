# PREMISE — Backlog LAB-5 khác bản LAB-4 ở đâu

Bản gốc: bộ thiết kế LAB-4 `specs/` (PREMISE chốt ngày 2026-11-08, nằm trong repo prototype private `sakura-market`, commit `e4c0f25`). Repo này không chép lại bộ spec. Mọi dòng dưới đây đều có issue trỏ ngược về mã dòng (P-xx, G-xx, H-xx).

## 1. Spec thêm / bỏ / sửa so với LAB-4

| Mã | Spec (mã / file LAB-4) | Thêm/Bỏ/Sửa | Trước → sau | Vì sao | Issue bị ảnh hưởng |
|---|---|---|---|---|---|
| P-01 | F-19 完納奨励金 — `PREMISE.md §3`, `architecture.md` I-06, `data-model.md` | Sửa | "Chỉ thiết kế mức kiến trúc, không screen spec" → thiết kế đủ để break task: thêm 3 bảng `incentive_payments` (ngày hoàn tất thanh toán), `incentive_results` (kết quả kỳ), `incentive_adjustments` (delta chuyển kỳ); thêm 2 màn SCR-SET-009, SCR-SET-010 (mô tả trong issue, chưa viết screen spec đầy đủ) | Đề LAB-5 bắt buộc tách riêng hạng mục này. Khi break thì thấy LAB-4 không có chỗ chứa ngày thanh toán và kết quả tính, nên không chia task và ước lượng được | #7, #50–#62 |
| P-02 | `market_rule_versions` — `data-model.md`, SCR-SET-012 | Thêm | Không có tham số hạn thanh toán → thêm `payment_due_days` (mặc định 10) | Bảng hỏi LAB-1 câu FIN-02 đã trả lời "hạn thanh toán là quy tắc N ngày, cấu hình được", nhưng data-model LAB-4 bỏ sót tham số này. Phát hiện khi viết #54 | #17, #21, #54 |
| P-03 | BR-RULE-01 — `behavior-logic.md` BL010 | Sửa | Bản đổi biểu phí có hiệu lực ngày bất kỳ → bản có `is_tariff_change = true` bắt buộc `effective_from` là ngày 1 của tháng | Khi break #56 thấy: đổi biểu phí giữa tháng thì một kỳ tháng có 2 bảng tỷ lệ, LAB-4 không nói dùng bảng nào | #18, #21, #56 |
| P-04 | SCR-SET-012 trường E21 `incentive_rounding` | Sửa | Cho chọn 切り捨て / 四捨五入 / 切り上げ → cố định 切り捨て, bỏ ô chọn | Mâu thuẫn với BR-INC-01 (LAB-1 機能一覧, フィーチャー一覧: cắt phần lẻ dưới 1 yên). Cho chọn là mở thêm biến không ai yêu cầu | #21, #57 |
| P-05 | `architecture.md` I-06 (thời điểm tính 奨励金) | Sửa | "Tính khi nhập ngày thanh toán thật" → job tự tính kỳ vào ngày sau hạn thanh toán | Tính ngay lúc nhập thì kết quả đổi theo thứ tự nhập, và 訂正 duyệt trước hạn không vào kỳ. Sau hạn mọi đầu vào đã chốt (xem H-01) | #58, #61 |
| P-06 | Tên RPC duyệt 訂正 — `behavior-logic.md` BL003/BL008 ghi `decide_correction`, `PREMISE.md §6` ghi `approve_correction` | Sửa | Hai tên → thống nhất `approve_correction` | Theo luật của LAB-4: PREMISE là hợp đồng chung, file khác lệch thì file đó sai | #45, #60 |

## 2. Giả định bổ sung

Chỉ lấp chỗ RFP / spec để ngỏ. Hệ số 110/100 và cắt phần lẻ là nội dung RFP đã nêu nên giữ nguyên, không đặt giả định đè lên.

| Mã | Giả định | Chỗ spec/RFP để ngỏ | Ảnh hưởng tới issue/estimate |
|---|---|---|---|
| G-01 | Kỳ tính = tháng dương lịch theo **ngày nghiệp vụ**; doanh số kỳ = tổng tiền **chưa thuế** của giao dịch còn hiệu lực (`v_trade_effective`) | FIN-02 chỉ nói "theo tháng", không nói tháng theo ngày nào và tính trên tiền trước hay sau thuế | #55; nếu tính sau thuế thì sửa 1 hàm, không đổi SWP |
| G-02 | Hạn thanh toán = ngày cuối tháng + `payment_due_days` ngày lịch, giờ Tokyo, không bỏ qua ngày nghỉ chợ | FIN-02 nói "N ngày" nhưng không nói tính từ đâu, có tính ngày nghỉ không | #54 |
| G-03 | "Thanh toán đủ" = SETTLEMENT đã nhập **ngày hoàn tất thanh toán** ≤ hạn. Hệ thống không theo dõi số tiền đã trả | FIN-01 trả lời "nhập tay ngày hoàn tất / import CSV"; quản lý công nợ nằm ngoài phạm vi (LAB-1 SCOPE-OUT-05) | #50, #54; nếu khách muốn đối chiếu số tiền thì thêm 1 epic con (+10〜15 SWP) |
| G-04 | Bậc tỷ lệ áp **toàn phần**: một tỷ lệ cho toàn bộ doanh số kỳ, không lũy tiến; ranh giới `min ≤ doanh số < max` | FIN-02 nói "tỷ lệ theo bậc doanh số", không nói toàn phần hay lũy tiến | #56; lũy tiến thì #56 tăng từ 3 lên ~5 SWP |
| G-05 | Tổng kỳ sau khi cộng delta âm < 0 → trả 0, phần âm chuyển sang kỳ sau | LAB-1 FN-SET-009 nói "chênh lệch đưa vào kỳ sau" nhưng không nói trường hợp âm | #60 |
| G-06 | CSV thanh toán: UTF-8, 3 cột `参加者コード`, `対象年月` (YYYY-MM), `支払完了日` (YYYY-MM-DD) | FIN-01 nói có import CSV, không có định dạng | #51 |
| G-07 | Đội giả định: BE-1, BE-2, FE-1, FE-2, QA-1, BrSE (bán thời gian); 6 giờ làm hiệu quả / người / ngày; sprint 2 tuần, 6 sprint từ 2026-11-09 | RFP không quy định đội và nhịp | Năng lực sprint, báo cáo tiến độ |
| G-08 | Release 1 tiếp tục trên nền prototype LAB-2 (Next.js + Supabase), không viết lại | LAB-4 đã chốt giữ stack; LAB-1 ước lượng cho hệ thống mới Java | Toàn bộ estimate (xem estimate.md mục 5) |

Một điểm **để mở, không giả định**: hàng thủy sản chịu thuế suất giảm 8% nhưng BR-INC-01 ghi hệ số 110/100. Giữ 110/100 theo RFP và đưa vào câu hỏi số 4 của #49.

## 3. Hướng đã chốt

| Mã | Vấn đề | Các phương án ở LAB-4 | Phương án chốt | Vì sao |
|---|---|---|---|---|
| H-01 | Lúc nào tính 完納奨励金 | (a) Khi nhập ngày thanh toán (I-06) · (b) Job sau hạn thanh toán · (c) SETTLEMENT bấm tay | (b), kỳ khóa ngay sau job | Mọi đầu vào đã chốt; kết quả không phụ thuộc thứ tự nhập. (c) thêm thao tác và rủi ro quên chạy |
| H-02 | Đổi biểu phí giữa kỳ thì dùng bảng nào | LAB-4 không nói. Cân nhắc: (a) bản hiệu lực ngày đầu kỳ · (b) bản ngày cuối kỳ · (c) chia doanh số theo ngày | (a) + ràng buộc P-03 | Với P-03 thì (a) và (b) luôn trùng nhau; (c) thêm một biến tính mà không ai yêu cầu |
| H-03 | Kiểu làm tròn 奨励金 | Ô chọn 3 kiểu (SCR-SET-012 E21) · cố định theo BR-INC-01 | Cố định 切り捨て (P-04) | RFP đã nói rõ |
| H-04 | Chạy job hằng ngày bằng gì | `pg_cron` hoặc Vercel Cron gọi API có khóa bí mật (gap G-H1) | `pg_cron` | Chạy cạnh dữ liệu, không phải mở thêm API có khóa. Còn rủi ro gói Supabase (xem #19) |
| H-05 | Break backlog từ đâu | Từ 31 gap của `gap-analysis.md` · break lại toàn bộ 62 màn LAB-1 | Từ gap LAB-4 + epic 完納奨励金 mới | Prototype đã chạy phần nền; break lại toàn bộ sẽ đếm trùng việc đã làm (G-08) |

## Từ viết tắt và mã dùng trong file này

| Viết tắt / mã | Nghĩa |
|---|---|
| SWP | Standard Work Point — điểm khối lượng công việc chuẩn của skill `tkm:sun-estimate`. Mỗi issue chấm 2 trục: Scope (độ rộng: số màn, bảng, lớp) và Complexity (độ khó bên trong: trạng thái, thuật toán, migration, rủi ro vận hành); SWP tra từ bảng nhân cố định Scope × Complexity. Thang: rất dễ 1–2, dễ 3–5, vừa 6–12, khó 13–25, rất khó 26+. Không phải giờ: bài này quy 1 SWP = 3 giờ |
| LAB-1 / LAB-2 / LAB-4 | Các bài thực hành trước: LAB-1 đọc RFP, estimate, WBS (8 file Excel); LAB-2 prototype Next.js + Supabase; LAB-4 bộ thiết kế `specs/` (wireframe, kiến trúc, ADR, spec màn hình, gap-analysis) |
| RFP | Request for Proposal — tài liệu yêu cầu của khách (`product-a-rfp-ja-v1.0-rc7`). Không chép vào repo |
| FIN-01, FIN-02 | Mã câu hỏi nhóm tài chính trong bảng hỏi RFP của LAB-1. FIN-01: ngày thanh toán lấy từ đâu (trả lời giả định: nhập tay hoặc import CSV). FIN-02: chi tiết công thức 完納奨励金 (trả lời giả định: kỳ tháng, tỷ lệ theo bậc doanh số, hạn N ngày) |
| F-nn | Mã feature trong フィーチャー一覧 của LAB-1 (ví dụ F-19 = tính 完納奨励金, F-21 = 14 báo cáo) |
| FN-xxx-nnn | Mã chức năng trong 機能一覧 của LAB-1 (ví dụ FN-SET-007 = engine tính 完納奨励金) |
| BR-xxx-nn | Business Rule — mã quy tắc nghiệp vụ dùng chung từ LAB-1/LAB-4 (ví dụ BR-INC-01 công thức 完納奨励金, BR-RULE-01 Maker ≠ Checker và tối đa 4 lần/năm, BR-PERM-01 tư cách người mua) |
| BLnnn | Behavior Logic — số mục trong `07-business-rules/behavior-logic.md` của LAB-4 (ví dụ BL010 vòng đời phiên bản quy tắc) |
| SCR-xxx-nnn | Mã màn hình theo 画面一覧 LAB-1. Nhóm: COM chung, IAM tài khoản, PAR người tham gia, LOT lô hàng, TRD giao dịch, DEL giao hàng, SET chốt sổ / 精算 / 奨励金, RPT báo cáo, ADM quản trị, AUD kiểm toán |
| SCOPE-OUT-nn | Mục RFP ghi rõ nằm ngoài phạm vi (SCOPE-OUT-05: liên kết ngân hàng, quản lý công nợ) |
| G-A1, G-C2… (gap) | Mã dòng trong `gap-analysis.md` của LAB-4: chỗ prototype LAB-2 còn làm khác thiết kế. Nhóm A giấy phép, B ngày nghiệp vụ, C quy tắc vận hành, D giao dịch / chốt sổ, E giao hàng, F phân quyền / audit, H hạ tầng / dữ liệu mẫu |
| P-nn / G-nn / H-nn | Mã dòng trong PREMISE.md của LAB-5: P = spec sửa so với LAB-4, G = giả định bổ sung, H = hướng đã chốt. Issue trỏ ngược về các mã này |
| #nn | Số issue trên GitHub (ví dụ #7 = epic 完納奨励金, #53 = engine tính) |
| BE / FE / QA | Backend / Frontend / Quality Assurance (kiểm thử). BE-1, FE-2, QA-1… là vai trò giả định trong đội, không phải người thật |
| BrSE | Bridge System Engineer — kỹ sư cầu nối, làm việc trực tiếp với khách Nhật |
| RPC | Remote Procedure Call — ở đây là hàm trong Postgres (Supabase) mà API gọi tới; quy tắc nghiệp vụ cần nguyên tử nằm trong RPC (ADR-002 LAB-4) |
| API | Application Programming Interface — ở đây là Route Handler của Next.js mà màn hình gọi |
| CSV | Comma-Separated Values — file bảng dạng văn bản, dùng để import ngày thanh toán |
| pg_cron | Extension của Postgres để chạy job theo lịch (dùng cho job kích hoạt quy tắc, hết hạn giấy phép, tính 奨励金) |
| SETTLEMENT, SETTLEMENT_MANAGER, RULE_ADMIN… | Mã vai trò trong hệ thống (PREMISE LAB-4 §5): SETTLEMENT 照合事務局 (精算), SETTLEMENT_MANAGER 照合部門長 (duyệt), RULE_ADMIN người lập quy tắc, SYS_ADMIN quản trị hệ thống, MARKET_ADMIN quản lý chợ, AUDITOR kiểm toán nội bộ |
