# Task breakdown — Backlog Release 1

68 issue trên GitHub: 8 epic, 48 issue, 12 sub-issue. Nguồn dữ liệu của mọi issue nằm ở [`tools/backlog-data.mjs`](tools/backlog-data.mjs) (một file duy nhất, script tạo issue đọc từ đây).

## 1. Nguyên tắc chia task

**Độ hạt — chia tới đâu thì dừng**
- Một issue = một thay đổi review được trong một PR, một người làm, xong trong ≤ 4 ngày (≤ 10 SWP ≈ 30 giờ). Duy nhất #60 (15 SWP) vượt ngưỡng; đã thử tách nhưng các phần dùng chung một phép tính lại kỳ, tách ra thì không phần nào test độc lập được.
- Tách theo lớp khi lớp đó giao được riêng: DB/RPC một issue, màn hình một issue. Màn hình phụ thuộc RPC nên luôn đứng sau trong thứ tự sprint.
- Dừng khi tiêu chí xong viết được thành test cụ thể (biên giờ, ô bảng quyết định, ca test vector). Nếu "xong" chỉ viết được là "chạy đúng" thì vẫn còn mơ hồ, phải chia tiếp.

**Khi nào tách sub-issue**
- Issue có từ 2 phần độc lập, mỗi phần có test riêng nhưng cùng phục vụ một mục tiêu. Ba issue như vậy: #23 (3 chỗ hard-code ở 3 module), #42 (bảng → RPC lập → RPC duyệt), #53 (engine 奨励金: mỗi biến của công thức một sub-issue).
- Issue cha khi đó không chấm điểm riêng; SWP = tổng sub-issue (đúng cách skill chấm SWP cộng dồn).

**Định nghĩa xong (chung cho mọi issue, ghi sẵn trong body)**
- Migration chạy lại được từ đầu (`db:reset`); bảng mới có trigger audit (FR-AUDIT-01).
- Test DB cho BR liên quan xanh; màn hình đúng bảng "phân quyền hiển thị" của screen spec LAB-4.
- Thông điệp lỗi đúng bảng mã lỗi; 1 người review code; smoke test trên URL deploy xanh.
- Cộng tiêu chí riêng ở mục "Định nghĩa xong" của từng issue.

**Cách dùng epic → issue → sub-issue trên Project**
- Epic = issue có label `epic`, dùng quan hệ sub-issue gốc của GitHub (không dùng checklist văn bản) để Project hiện được cột Parent và thanh tiến độ con.
- Issue và sub-issue mang Iteration, trạng thái, người phụ trách, SWP, giờ. Epic chỉ mang SWP / giờ tổng và trạng thái suy ra từ con.
- Label `constraint:完納奨励金` gắn cho toàn bộ epic #7 để lọc nhanh hạng mục chịu ràng buộc đặc thù; label `clarification` cho issue làm rõ.

## 2. Spec → issue

| Spec LAB-4 | Epic | Issue / sub-issue | Phần spec chưa thành issue và vì sao |
|---|---|---|---|
| PREMISE §2.4, §5, gap G-C1, G-F1, G-H2, G-H3 | #1 | #9, #10, #11, #12 | G-F7 (gắn trigger audit cho bảng mới) không tách issue riêng: đưa vào định nghĩa xong của mọi issue tạo bảng, tách riêng sẽ thành issue không làm độc lập được |
| ADR-005, BL005, BL006, SCR-ADM-001, gap G-B1〜B3 | #2 | #13, #14, #15, #16 | — |
| ADR-008, BL010, BL014, SCR-SET-011〜013, gap G-C2, G-C3, G-A7, G-E1, G-H1 | #3 | #17, #18, #19, #20, #21, #22, #23 (#24, #25, #26) | — |
| ADR-004, BL001, BL002, BL013, SCR-PAR-001〜003, gap G-A1〜A8 | #4 | #27, #28, #29, #30, #31, #32, #33, #34 | SCR-PAR-004 (danh sách sắp hết hạn) — LAB-4 đã để ngoài Release 1 |
| BL009, SCR-TRD-005, gap G-D1 | #5 | #35, #36 | — |
| ADR-006, BL007, BL008, BL011, SCR-SET-001〜003, 006〜008, gap G-D2〜D5, G-H4 | #6 | #37, #38, #39, #40, #41, #42 (#43, #44, #45), #46, #47, #48 | — |
| F-19 / BR-INC-01 (LAB-4 chỉ ở mức kiến trúc) → PREMISE P-01〜P-05 | #7 | #49, #50, #51, #52, #53 (#54〜#59), #60, #61, #62 | Báo cáo RPT-07 期別完納奨励金 (SCR-RPT-008): 14 báo cáo vẫn ở mức kiến trúc theo LAB-4, SCR-SET-010 đã đủ để tra cứu kết quả |
| ADR-003, ADR-007, permissions-matrix, gap G-F2〜F6 | #8 | #63, #64, #65, #66, #67, #68 | — |
| PREMISE LAB-4 §3 "chỉ kiến trúc" và "bỏ khỏi Release 1" | — | — | 14 báo cáo (F-21), CSV kế toán IF-ACC-01 (F-22), email (F-23), giám sát, PWA offline (F-14), tranh chấp (F-17), chuyển dữ liệu cũ (F-28): ngoài phạm vi Release 1 theo LAB-4, chưa thành issue |

## 3. Hạng mục chịu ràng buộc đặc thù của đề (Product A: 完納奨励金)

LAB-4 để toàn bộ 完納奨励金 ở mức kiến trúc (một dòng I-06). Backlog này tách thành epic riêng #7 (71 SWP, epic lớn nhất), và tách engine #53 theo từng biến của công thức.

| Ràng buộc | Issue | Vì sao tách riêng |
|---|---|---|
| Công thức còn 6 điểm mở (FIN-02) | #49 | Việc làm rõ có người làm và thời gian chờ riêng. Để nó trong issue code thì issue code bị chặn mà không nhìn thấy lý do |
| Ngày hoàn tất thanh toán là đầu vào (FIN-01) | #50, #51, #52 | Bảng + RPC, import CSV, màn hình: 3 lớp, 3 người khác nhau, giao được riêng |
| Biến 1 — đủ hạn: hoàn tất ≤ cuối kỳ + N ngày, quá hạn = 0, không ân hạn | #54 | Biên ngày (cuối tháng, năm nhuận) có bộ test riêng; N ngày đang là giả định G-02 |
| Biến 2 — doanh số kỳ sau hủy và 訂正 | #55 | Phụ thuộc view của epic #6; ranh giới bút toán trước/sau khóa kỳ là chỗ dễ sai nhất |
| Biến 3 — bậc tỷ lệ theo phiên bản quy tắc | #56 | Phụ thuộc epic #3 và giả định G-04 (toàn phần hay lũy tiến) |
| Biến 4 — `floor(doanh số × tỷ lệ × 110/100)` | #57 | Làm tròn sai 1 yên là lỗi tiền; test riêng bằng `numeric` |
| Lưu kết quả, khóa kỳ, ghi phiên bản áp dụng | #58 | Idempotent và khóa kỳ là chuyện vận hành, khác với công thức |
| Bộ test vector DS-INC-EDGE-01 | #59 | QA làm song song; là tiêu chí xong của cả #53 |
| Chênh lệch sau khóa kỳ → kỳ sau (次期繰越相殺) | #60 | Chạm epic #6 (訂正) và có thể đổi bậc tỷ lệ của kỳ đã trả; rủi ro cao nhất backlog |
| Job tính sau hạn | #61 | Dùng chung hạ tầng job #19 nhưng lịch và điều kiện riêng |
| Màn kết quả SCR-SET-010 | #62 | Chỉ xem, làm sau cùng khi dữ liệu đã đúng |
| Biểu phí trong phiên bản quy tắc, tối đa 4 lần/năm | #18, #21 (epic #3) | Đã có ở LAB-4; LAB-5 thêm ràng buộc ngày 1 tháng (P-03) và bỏ ô chọn làm tròn (P-04) |

## 4. Chỗ hở / mâu thuẫn của spec LAB-4 phát hiện khi break

| Spec | Chỗ hở / mâu thuẫn | Xử lý |
|---|---|---|
| PREMISE §3, architecture I-06 | 完納奨励金 không có bảng chứa ngày thanh toán, kết quả, chênh lệch → không break được | Đã sửa thiết kế — [PREMISE P-01](PREMISE.md#1-spec-thêm--bỏ--sửa-so-với-lab-4) |
| data-model `market_rule_versions` | Thiếu tham số hạn thanh toán N ngày dù FIN-02 đã trả lời | Đã sửa thiết kế — PREMISE P-02 |
| BL010 | Đổi biểu phí giữa tháng → một kỳ có 2 bảng tỷ lệ | Đã sửa thiết kế — PREMISE P-03 |
| SCR-SET-012 E21 ↔ BR-INC-01 | Spec cho chọn 3 kiểu làm tròn, RFP cố định 切り捨て | Đã sửa thiết kế — PREMISE P-04 |
| architecture I-06 | Tính khi nhập ngày thanh toán → kết quả phụ thuộc thứ tự nhập | Đã sửa thiết kế — PREMISE P-05, H-01 |
| behavior-logic BL008 ↔ PREMISE §6 | Tên RPC `decide_correction` ≠ `approve_correction` | Đã sửa thiết kế — PREMISE P-06 |
| FIN-02 | Bậc toàn phần hay lũy tiến; N ngày tính từ đâu; tổng âm | Giả định — PREMISE G-02, G-04, G-05; tạo issue làm rõ #49 |
| BR-INC-01 ↔ thuế suất thủy sản 8% | Hệ số 110/100 có thể không khớp thuế thực phẩm | Để mở: giữ theo RFP, hỏi trong #49 (câu 4) — không tự đổi công thức khách đã ghi |
| FIN-01 | "Thanh toán đủ" đo bằng ngày hay số tiền | Giả định — PREMISE G-03 |
| screen-list SCR-AUD-001 | Có trong danh sách màn và ma trận quyền, không có wireframe + spec | Tạo issue làm rõ #64 |
| gap G-H1 | Chạy job bằng `pg_cron` hay Vercel Cron | Đã chốt — PREMISE H-04; còn rủi ro gói Supabase ghi ở #19 |
| gap G-A1 | Không có quy tắc map `buyer` cũ sang 仲卸 / 売買参加者 | Để mở trong #27: dữ liệu prototype là dữ liệu mẫu, BrSE quyết khi làm (Sprint 1 đã xử lý, mất thêm 1 ngày) |
