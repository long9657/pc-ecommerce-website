# Pc-ecommerce-website

# HƯỚNG DẪN LÀM VIỆC VÀ CÀI ĐẶT MÔI TRƯỜNG DỰ ÁN

## 1. Quy chuẩn Git Repo
Repo này có 2 nhánh chính:
- `main`: Nhánh sản phẩm, chứa code đã hoàn thiện và ổn định.
- `develop`: Nhánh phát triển của ae, chứa code mới nhất đang tích hợp.

Có một nguyên tắc là ae tuyệt đối không push trực tiếp lên `main` và `develop`.
Mọi tính năng mới phải làm trên nhánh riêng, sau đó tạo Pull Request (PR) ghép vào `develop`. Long sẽ (tạm thời) review và duyệt PR.

## 3. Luồng làm việc chuẩn cho Ae

**Bước 1: Lấy code mới nhất**
- Lần đầu tiên: `git clone https://github.com/long9657/pc-ecommerce-website.git`
- Các lần sau:
  + `git checkout develop` (chuyển về nhánh develop).
  + `git pull origin develop` (kéo code mới nhất về máy).

**Bước 2: Tạo nhánh làm việc riêng**
- `git checkout -b <tên_nhánh>`
*(Lưu ý đặt tên nhánh ngắn gọn, có ý nghĩa: ví dụ `feat_login_Long`, `fix_bug_Nam` hoặc `dev_<tên>` cũng được)*

**Bước 3: Code và đẩy code lên Github**
Sau khi code xong chức năng:
- `git status`: Kiểm tra lại các file đã thay đổi
- `git add .`:  Thêm tất cả các file đã sửa vào staged
- `git commit -m "mô tả ngắn gọn việc vừa làm, ví dụ: thêm hàm login"`
- `git push origin <tên_nhánh_của_ae>`

**Bước 4:** Lên GitHub, bấm tạo Pull Request từ nhánh của ae vào nhánh `develop` và thông báo lên nhóm để duyệt.


## 4. (Bonus) Quy chuẩn đặt tên nhánh, commit và viết Pull Request (PR)
Để lịch sử dự án chuyên nghiệp, anh em dễ đọc code của nhau và tiện cho việc review, ae tham khảo các quy tắc sau:

**A. Cách đặt tên nhánh**
Cú pháp: `<loại>/<tên_tính_năng>` hoặc `<loại>/<tên_ae>`
- `feat/...` : Phát triển tính năng mới (VD: `feat/login-page`, `feat/cv-upload`).
- `fix/...` : Sửa lỗi code (VD: `fix/db-connection`, `fix/sql-injection-user`).
- `docs/...` : Cập nhật tài liệu dự án.
- Tên cá nhân: `dev_Long`, `dev_Nam` (Dùng tạm nếu ae làm các task tổng hợp, gộp nhiều chức năng nhỏ).

**B. Cách viết commit chuẩn**
Cú pháp: `<loại>: <Mô tả ngắn gọn bằng tiếng Việt hoặc Anh>`
- `feat:` Thêm chức năng (VD: `feat: hoàn thiện giao diện trang chủ cho ứng viên`).
- `fix:` Vá lỗi (VD: `fix: sửa lỗi null pointer ở DAO lúc lấy danh sách Job`).
- `chore:` Các task cài đặt lặt vặt (VD: `chore: cập nhật lại version trong pom.xml`).
- `refactor:` Viết gọn lại code cho sạch đẹp nhưng không đổi logic.

**C. Tiêu chuẩn tạo Pull Request (PR)**
Khi ae ấn tạo PR ghép code từ nhánh của mình vào nhánh `develop`, không nên trống phần mô tả. 
Ae nên ghi chú nhanh theo format sau để reviewer nắm bắt nhanh tiến độ trước khi duyệt:

1. **Tóm tắt nội dung:** PR này làm chức năng gì hoặc sửa lỗi gì?
2. **Phạm vi ảnh hưởng:** Có sửa vào file dùng chung nào của người khác không (như `pom.xml`, `web.xml`, base classes)?
3. **Checklist:**
   - [ ] Đã chạy `setup-env` và pass full pre-commit local.
   - [ ] Code đã chạy test thành công trên máy cá nhân.
