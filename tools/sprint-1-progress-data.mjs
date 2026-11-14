// Dữ liệu GIẢ LẬP của Sprint 1 (09/11–20/11/2026, 10 ngày làm việc). Không phải số liệu thật.
// status: trạng thái trên Project lúc chốt sprint · done: ngày đóng issue · actualH: giờ thực tế giả lập
// Giờ ước lượng = SWP × 3 (quy ước ở estimate.md).
export const HOURS_PER_SWP = 3;
export const sprint = { name: 'Sprint 1', start: '2026-11-09', end: '2026-11-20' };
export const workDays = ['2026-11-09', '2026-11-10', '2026-11-11', '2026-11-12', '2026-11-13', '2026-11-16', '2026-11-17', '2026-11-18', '2026-11-19', '2026-11-20'];

export const progress = {
  'E1-01': { status: 'Done', done: '2026-11-12', actualH: 18 },
  'E1-02': { status: 'Done', done: '2026-11-11', actualH: 8 },
  'E1-03': { status: 'Done', done: '2026-11-13', actualH: 5 },
  'E1-04': { status: 'In Progress', actualH: 9, note: 'Chờ E4-02 để seed giấy phép' },
  'E2-01': { status: 'Done', done: '2026-11-18', actualH: 12, note: 'Phải sửa thêm 6 chỗ gọi hàm cũ không có trong issue' },
  'E2-02': { status: 'Done', done: '2026-11-19', actualH: 15 },
  'E2-04': { status: 'Done', done: '2026-11-20', actualH: 9 },
  'E3-01': { status: 'Done', done: '2026-11-17', actualH: 14 },
  'E3-02': { status: 'In Review', actualH: 26, note: 'Review phát hiện thiếu kiểm ngày 1 của tháng cho bản đổi biểu phí' },
  'E4-01': { status: 'Done', done: '2026-11-16', actualH: 24, note: 'Bảng map buyer cũ phải hỏi BrSE, mất 1 ngày' },
  'E4-02': { status: 'In Progress', actualH: 10 },
  'E7-01': { status: 'Blocked', actualH: 6, note: 'Đã gửi 6 câu hỏi ngày 11/11, khách hẹn trả lời 27/11' },
};
