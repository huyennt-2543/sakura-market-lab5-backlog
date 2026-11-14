# AI-report — Cách dùng AI ở LAB-5

Công cụ: Claude Code (desktop) với bộ skill Takumi. AI làm phần đọc, soạn, chạy script và gọi GitHub. Người (học viên) chốt các quyết định, review điểm SWP mẫu và duyệt nội dung trước khi nộp.

## 1. Skill và prompt cho từng việc

| Việc | Skill / công cụ | Prompt / cách giao việc |
|---|---|---|
| Đọc đầu vào | Đọc file, `pdftotext`, đọc trực tiếp XML trong file Excel LAB-1 bằng một script node nhỏ | "Thực hành tiếp LAB-5" + dán nguyên đề. AI tự tìm bộ LAB-4 (`specs/`), gap-analysis 31 dòng, bảng hỏi FIN-01/FIN-02 và estimate LAB-1. RFP PDF không trích được chữ tiếng Nhật (lỗi font), nên quy tắc 完納奨励金 lấy từ file Excel LAB-1 thay vì RFP |
| Chốt thông tin thiếu | Hỏi người dùng có lựa chọn | 3 câu hỏi một lần: repo mới hay public repo code, mã học viên, khoảng thời gian sprint. Thêm 1 câu xin phép cài Python cho skill chấm SWP |
| Break task | Không dùng skill sinh task; AI viết thẳng một file dữ liệu [`tools/backlog-data.mjs`](tools/backlog-data.mjs) | Ràng buộc đặt cho AI: mỗi gap LAB-4 thành issue hoặc ghi lý do không thành; 完納奨励金 tách theo **từng biến của công thức**; issue ≤ 4 ngày; mỗi issue có "Việc cần làm", "Định nghĩa xong" viết thành test được, "Phụ thuộc" |
| Đưa lên GitHub | Script [`tools/create-github-issues.mjs`](tools/create-github-issues.mjs) gọi `gh api` | Tạo label → epic → issue → nối sub-issue bằng API sub-issue gốc. Số issue được tính trước và script dừng nếu GitHub trả số khác, để phần "Phụ thuộc #số" trong body không bị lệch |
| Chấm SWP | `tkm:sun-estimate` (+ `tkm:confidence`) | "GitHub issues của repo, #1–#68, 8 epic là container, lý do viết tiếng Việt". Skill chỉ đọc (mọi lệnh gọi GitHub qua cổng kiểm tra quyền `tool_policy.py`, chặn POST/mutation). AI chấm Scope × Complexity cho 57 việc, script của skill kiểm hợp lệ, tự chọn 5 issue mẫu, người review từng issue 2 bước, script render HTML |
| Ghi SWP lên Project | Script [`tools/sync-github-project.mjs`](tools/sync-github-project.mjs) | Tách khỏi skill chấm vì skill chỉ được đọc. Script đọc SWP từ payload nhúng trong báo cáo HTML ([`tools/export-swp-from-report.mjs`](tools/export-swp-from-report.mjs)), không cho AI gõ lại số, rồi tạo trường và ghi giá trị bằng GraphQL, gom 20 thay đổi / request |
| Quy giờ | AI đề xuất, người duyệt | "Một hệ số cố định, có căn cứ, kiểm lại bằng số liệu sprint". Kết quả 3 giờ/SWP, căn cứ ở estimate.md mục 2 |
| Báo cáo tiến độ | Script [`tools/render-burndown-svg.mjs`](tools/render-burndown-svg.mjs) + AI viết lời | Dữ liệu sprint giả lập đặt trong một file riêng; burndown, bảng trạng thái, tải theo người đều **tính từ file đó**, AI chỉ viết phần diễn giải |

## 2. Review output của AI

**Người review ở các bước:**
1. Chốt phạm vi và hình thức nộp trước khi AI làm (repo public mới, không public repo code; Sprint 1 = 09/11–20/11).
2. Review 5 issue mẫu SWP: mỗi issue chọn mức khó rồi chọn điểm. Cả 5 giữ nguyên; lý do và các chỗ đã cân nhắc sửa ghi ở estimate.md mục 1.
3. Đọc bản nháp các file Markdown trước khi push.

**Vấn đề phát hiện trong output của AI và cách xử lý:**

| Vấn đề | Phát hiện thế nào | Xử lý |
|---|---|---|
| Kế hoạch Sprint 1 đầu tiên dồn 87 giờ cho BE-1 và 0 giờ cho 2 FE | Cộng giờ theo người từ file dữ liệu, không đọc theo cảm giác | Giữ nguyên trong giả lập (đó là lỗi lập kế hoạch thật hay gặp) nhưng báo cáo nói thẳng là nguyên nhân trễ (R2, R4), không đổ cho "ước lượng sai" |
| Bản nháp báo cáo tiến độ ghi BE-2 = 42 giờ | Kiểm lại từng con số trong bảng bằng cộng tay | Sửa thành 57 giờ trước khi nộp |
| Nguy cơ tô hồng: tính % hoàn thành theo việc "đang làm" hoặc chỉ đưa dự báo tốt | Đặt luật trước: burndown chỉ trừ issue Done; dự báo đưa cả 2 kịch bản | Báo cáo ghi 58% (không phải ~75% nếu tính việc dở); dự báo trễ ~3 sprint và ~1 sprint ghi cạnh nhau |
| AI đi theo thiết kế LAB-4 "tính 奨励金 khi nhập ngày thanh toán" | Khi viết tiêu chí xong cho engine, không viết được test ổn định vì kết quả phụ thuộc thứ tự nhập | Đổi sang job sau hạn (PREMISE P-05, H-01) |
| Spec LAB-4 do AI viết trước đó tự mâu thuẫn (làm tròn 3 kiểu ↔ BR-INC-01; `decide_correction` ↔ `approve_correction`) | Đối chiếu chéo khi break, grep tên RPC | PREMISE P-04, P-06 |
| AI muốn coi hệ số 110/100 là sai vì thủy sản chịu thuế 8% | RFP ghi rõ 110/100 | Không sửa; để mở và hỏi khách (#49 câu 4). Giả định không được đè lên điều RFP đã nói |
| Nhãn trên ảnh burndown đè lên đường biểu đồ | Mở ảnh trong trình duyệt, chụp màn hình | Dời nhãn, sinh lại ảnh |
| Lỗi kỹ thuật khi chạy: heredoc bash vỡ, Python in tiếng Việt lỗi mã hóa cp932 trên Windows, một lệnh bị ngắt giữa chừng | Lệnh trả lỗi; kiểm tra lại thư mục `reports/` chưa có file | Ghi file bằng công cụ ghi file, bật `PYTHONUTF8=1`, chạy lại và kiểm payload nhúng (57 việc, 301 SWP, không gọi mạng) |

## 3. Điểm đặc biệt trong cách dùng AI

**Chỗ tin là hiệu quả**
- **Một nguồn dữ liệu, nhiều đầu ra.** Backlog, SWP, tiến độ đều nằm trong file dữ liệu, còn issue, Project, burndown và các bảng trong Markdown sinh ra từ đó. AI không phải gõ lại số ở 4 chỗ, và chỗ nào lệch thì do dữ liệu sai chứ không do chép nhầm.
- **Tách quyền đọc và quyền ghi.** Skill chấm SWP chỉ được đọc; việc ghi lên Project là bước riêng, đọc số từ báo cáo đã được người review. Nhìn vào Project biết ngay số nào đã qua review.
- **Review theo mẫu do máy chọn.** Người chỉ review 5/57 issue, nhưng 5 issue đó được chọn theo luật (nhỏ nhất, trung vị, lớn nhất, lệch xa, kém tin cậy nhất), không phải 5 issue dễ đồng ý.

**Chỗ chưa tốt, cần cải thiện khi làm thật**
- Review 5 mẫu là ít. Nhóm migration lệch +33% ở Sprint 1 mà không có mẫu nào thuộc nhóm đó. Làm thật nên review thêm 1 mẫu cho mỗi nhóm việc có rủi ro (migration, job, tính tiền), tốn thêm ~10 phút.
- Số liệu sprint là giả lập do AI đặt ra, nên báo cáo chỉ chứng minh được **cách** báo cáo, chưa chứng minh ước lượng đúng. Làm thật phải lấy giờ thực tế từ Project (trường "Giờ thực tế") thay cho file giả lập.
- Phần lớn token tốn vào việc đọc lại spec LAB-4 và file Excel. Nếu LAB-4 có sẵn bản tóm tắt dạng dữ liệu (mã BR, bảng, RPC) thì bước break sẽ rẻ hơn nhiều.
- Chưa có ý tưởng tốt cho việc kiểm tự động "báo cáo có tô hồng không" ngoài luật đặt trước (chỉ tính Done, luôn có dự báo xấu). Hiện vẫn dựa vào người đọc lại.
