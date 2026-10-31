# Mô Phỏng Luyện Tập Router `Viettel vGP-42X6V1` (Firmware `V1302250508`)

Trang web mô phỏng luyện tập Offline/Online giao diện quản trị thực tế của Modem quang GPON Wi-Fi 6 **`Viettel vGP-42X6V1`** (VHT), phục vụ thực hành môn **Mạng máy tính (`CSC10008` — Đồ án WLAN)**.

> **Lưu ý an toàn:** Đây là bản mô phỏng học tập thuần phía trình duyệt (`localStorage`), sử dụng dữ liệu mẫu giả lập, không kết nối tới Router thật và không gửi bất kỳ dữ liệu nào ra ngoài mạng.

## Tính năng chính
- **Đầy đủ 25 trang cấu hình (`/cgi-bin/*.asp`)** chia theo đúng 6 nhóm menu thực tế: *Tổng quan*, *Mạng (WAN OMCI / LAN DHCP / IP Tĩnh)*, *Wi-Fi (2.4GHz, 5GHz 160MHz, EasyMesh, Multi-SSID)*, *An ninh (Tường lửa SPI, Kiểm soát con cái Deny/Allow)*, *Ứng dụng (DMZ, Port Forwarding, Giới hạn phiên, Static Route, DDNS, Lập lịch Wi-Fi)* và *Bảo dưỡng (Quản trị, Uplink Mirroring, NTP, Firmware, Cấu hình 4 nút, Chẩn đoán Ping/Traceroute, Syslog, Reboot)*.
- **Mô phỏng 5 bẫy kiểm tra lỗi thực tế của Firmware `V1302250508`** (định dạng MAC dấu `:`, nút `+` bảng lịch trình `Allow`, hết phiên `5 phút`, rớt kết nối khi không cắm dây `LAN1`, cảnh báo gập dây quang `LOS` đỏ).
- **Bàn Luyện Tập 3-trong-1:**
  - 🎬 Nạp sẵn trạng thái đầu phân cảnh cho từng thành viên **`TV1 → TV6`**.
  - 📱 **Điện thoại & VMware ảo** để kiểm chứng Trước/Sau (quét sóng Wi-Fi, nhận IP tĩnh `.150`, trình duyệt test chặn MAC/URL, chạy `ping` Infrastructure & Ad-hoc).
  - 📟 **Phần cứng ảo `vGP-42X6V1`** với 10 đèn LED thời gian thực, lật xem Tem mặt đáy, nút `WPS` và lỗ chọc `Reset` cứng; phím tắt **`F9`** bật chế độ khung hình sạch cho OBS.

## Cách chạy
- **Chạy trực tiếp trên máy:** Mở file `index.html` bằng trình duyệt bất kỳ.
- **Chạy qua GitHub Pages:** Vào `Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: main / (root)` để lấy link gửi cho cả nhóm cùng luyện tập.
