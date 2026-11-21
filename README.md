# LaiQR

Trang QR chuyển khoản tĩnh, dùng HTML/CSS/JS thuần.

Chạy trong thư mục này:

```sh
python3 -m http.server 4173
```

Mở `http://localhost:4173/` để xem trang QR. Thông tin nhận tiền cố định: VietinBank, số tài khoản `105882793068`, chủ tài khoản `MA HOANG LAI`. Người xem phải nhập cả số tiền và nội dung chuyển khoản; khi hoàn tất ô nhập, hộp thoại QR mở giữa màn hình. Có thể mở lại bằng nút **Thanh toán**.

Để đổi thông tin nhận tiền sau này, sửa các hằng số trong `qr.mjs` rồi triển khai lại trang.

Sau khi nhập đủ số tiền và nội dung, nút **Chuyển khoản ngay** mở danh sách ứng dụng. Chọn một ứng dụng sẽ điều hướng tới deeplink VietQR ngay. 5 ứng dụng đầu được đánh dấu hỗ trợ tự điền trên Android và iOS; Agribank Plus (`app=vba`) mở được app nhưng hiện có `autofill=0`, nên người xem có thể phải nhập lại thông tin. Người xem đăng nhập và xác nhận trong ứng dụng ngân hàng; trang này không biết giao dịch đã thành công hay chưa. Deeplink miễn phí có thể không tự điền khi vượt giới hạn dịch vụ hoặc khi ứng dụng ngân hàng thay đổi hỗ trợ.

Kiểm tra logic bằng `node --test qr.test.mjs`.
