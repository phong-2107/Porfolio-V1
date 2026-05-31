# Bối cảnh Thiết kế & Lịch sử Nâng cấp (DESIGN_CONTEXT)

Tài liệu này đóng vai trò kim chỉ nam cho tất cả các Agent/AI hoặc Lập trình viên khi tham gia vào dự án `Portfolio-V1`. Bắt buộc phải đọc trước khi thực hiện các thay đổi về Layout, UI, hoặc Animation.

## 1. Hệ thống Layout (Fluid Widescreen Paradigm)

Dự án đã được nâng cấp (dựa trên cảm hứng từ MoncyDev) để phá bỏ rào cản của giao diện khối hẹp (Boxed Layout) truyền thống.
- **Tiêu chuẩn Container Mới:** Tất cả các Section chính (About, Career, Projects, Tech Profile, Showreel, Contact) và các Modal (Project Demo) ĐỀU PHẢI sử dụng cấu trúc Fluid:
  ```tsx
  <div className="section-focal-wrapper w-full px-4 md:px-[4vw] max-w-[1920px] mx-auto relative z-10">
  ```
- **Tuyệt đối cấm:** Sử dụng các class giới hạn cứng như `max-w-4xl`, `max-w-5xl`, `max-w-6xl`, hay `container` mặc định của Tailwind/Bootstrap trên các thẻ bao bọc (wrapper) cấp cao nhất của Section. Mục tiêu là để website tận dụng tối đa màn hình siêu rộng (Edge-to-Edge).

## 2. Ngôn ngữ Thiết kế (Visual Language & High-End Aesthetic)

Dự án áp dụng phong cách **High-End Visual Design** (Agency/Awwwards-tier):
- **Bảng màu:**
  - Nền siêu tối (Deep Dark): `--bg-deep` (`#020608`), `--bg-surface` (`#102A30`).
  - Màu nhấn chính (Primary Accent): Cam (`--accent-orange`) và Xanh lơ (`--accent-cyan`).
  - Màu nhấn đặc biệt (Special Glow): Tím Neon (`#D2A8FF`) được sử dụng linh hoạt để tạo điểm nhấn khác biệt (ví dụ: khu vực "WHAT I DO").
- **Double-Bezel & HUD Sci-fi:** Các thẻ thông tin (Card) thay vì dùng `box-shadow` thông thường, sẽ ưu tiên sử dụng viền mờ (`border-white/10`), viền nét đứt (`border-dashed`), và các góc đánh dấu (Corner Markers) bằng pseudo-element để tạo cảm giác giao diện phi thuyền không gian (Sci-fi HUD).
- **Typography:** Bỏ qua sự gò bó, sử dụng cỡ chữ cực lớn cho tiêu đề (`clamp(5rem, 10vw, 9rem)`), chữ mảnh, cách điệu (SplitText) để tạo hiệu ứng thị giác mạnh.

## 3. Hệ thống Hoạt ảnh (GSAP Motion & Performance)

Toàn bộ hoạt ảnh cuộn và tương tác được quản lý bởi **GSAP + ScrollTrigger**:
- **Tránh Jitter/Stutter:** Không sử dụng các sự kiện `window.addEventListener('scroll')` hoặc các lệnh `video.play()` / `video.pause()` ngay đúng lúc thẻ đang cuộn qua mép màn hình.
- **Cơ chế Cuộn Bám Dính (Scroll Snapping / Fullpage):** Dự án sử dụng hệ thống cuộn bám dính chuyên nghiệp (thường thông qua `@fullpage/react-fullpage` hoặc CSS Scroll Snap). Khi phát triển thêm Section mới, tuyệt đối phải đảm bảo tương thích với kiến trúc cuộn này (duy trì đúng class hoặc cấu trúc thẻ bọc) để không làm vỡ cơ chế bắt dính màn hình.
- **Tối ưu Video 3D (Showreel):**
  - Sử dụng định dạng `WebM` để tối ưu dung lượng Web.
  - Xóa phông nền đen bằng CSS `mix-blend-screen` để nhân vật 3D nổi thẳng lên nền web.
  - Gắn thuộc tính `preload="auto"` để trình duyệt chuẩn bị sẵn dữ liệu vào RAM.
  - **ScrollTrigger Logic cho Video:** Cài đặt `start: 'top 150%'` (kích hoạt Play sớm khi video còn ẩn tít dưới màn hình) và `end: 'bottom -20%'` (chủ động Pause khi đã cuộn qua hoàn toàn) để đảm bảo độ mượt 60 FPS mà không lãng phí tài nguyên CPU/GPU.
- **GSAP Hover Physics:** Các tương tác hover (di chuột) phải đi kèm theo các thay đổi vật lý như nảy (`scale-105`), dịch chuyển toạ độ (`y: -2px`), đổi màu glow viền thay vì chỉ đơn thuần là chuyển màu nền.

## 4. Lịch sử Thay đổi Quan trọng Gần Nhất (Changelog Nổi Bật)

- **Phase 18 (Khôi phục Bám dính & Animation About Me):** Đã khôi phục thành công cơ chế cuộn bám dính toàn trang (Scroll Snapping). Nâng cấp toàn diện hoạt ảnh cho `AboutMeSection` bằng GSAP ScrollTrigger (hiệu ứng xuất hiện mượt mà khi scroll down và ẩn đi chuyên nghiệp khi scroll up, xoá bỏ sự đơn điệu tĩnh lặng trước đó).
- **Phase 19 (Mở rộng Layout Fluid):** Xoá bỏ toàn bộ cấu trúc thu hẹp trung tâm, trải rộng các Section ra sát mép màn hình (`px-[4vw]`).
- **Phase 20 (Đại tu Showreel -> What I Do):** Đập bỏ layout 1 cột cũ, xây dựng lại cấu trúc Asymmetric 3 Cột (Grid-12). Thiết kế cụm Text khổng lồ, phóng to nhân vật 3D bằng `scale-[1.35]`, đổi định dạng video thành `.webm`, loại bỏ `ScrollTrigger.create()` bị xung đột khung hình cũ và tái lập bằng giới hạn Toạ độ Sớm/Trễ tinh vi (Top 150% - Bottom -20%). Tích hợp hiệu ứng Sci-fi HUD cho 2 thẻ Develop & Design.

## 5. Quy trình cho Agent AI

1. Bất kỳ AI nào khi chỉnh sửa Layout đều phải kiểm tra xem file mình định sửa có đang dùng `max-w-` cứng hay không. Nếu có, lập tức đập bỏ và thay bằng chuẩn `section-focal-wrapper`.
2. Khi chỉnh sửa Animation, tuyệt đối không chèn CSS `transition: all` vào cùng phần tử đang được GSAP điều khiển.
3. Luôn luôn kiểm tra `mix-blend-mode` trước khi định viết logic xoá nền cho bất kỳ file media/hình ảnh nào.
4. Chú ý bảo toàn hệ thống cuộn bám dính (Fullpage) khi thêm mới hoặc xoá các thẻ wrapper lớn.
