# Master Engineering Report: Premium Portfolio Visual & Motion System

Tài liệu này cung cấp cái nhìn toàn diện, phân tích sâu và chi tiết kỹ thuật về quá trình xây dựng, tối ưu hóa và cấu trúc lại hệ thống chuyển động, giao diện của Portfolio-V1 từ **Giai đoạn 1 đến Giai đoạn 12**.

---

## 1. Bản đồ Công nghệ Áp dụng (Technology Stack & Architecture)

Hệ thống được thiết kế theo mô hình Component-Driven kết hợp Scrollytelling, tận dụng khả năng tăng tốc phần cứng (GPU-Acceleration):

*   **UI Framework:** React 19.0.1 (hỗ trợ Concurrent rendering và tối ưu hóa hook hiệu suất cao).
*   **Module Bundler:** Vite 6.2.3 (dev server khởi động tức thì, HMR nhanh nhẹn).
*   **Language:** TypeScript (ràng buộc kiểu tĩnh nghiêm ngặt trên toàn hệ thống dữ liệu).
*   **Motion Framework:** GreenSock GSAP 3.12.5 + `@gsap/react` 2.1.1 (quản lý timeline hoạt ảnh và ghim trang cuộn).
*   **3D Render Engine:** Spline Web Component (`@splinetool/react-spline` 1.2.21) chạy WebGL/WebGL2 cho mô hình tương tác thời gian thực.
*   **Styling System:** Vanilla CSS với cấu trúc Tokens (Design System) và @layer Base/Components giúp kiểm soát tuyệt đối luồng hiển thị mà không bị phụ thuộc vào các CSS Utility framework cồng kềnh.

---

## 2. Nhật Ký Chi Tiết 12 Giai Đoạn Nâng Cấp (Phase 1-12 Review)

### Giai đoạn 1-4: Thiết lập Nền tảng & Cấu trúc Dự án
*   **Tái cấu trúc (Phase 1):** Phân tách và dọn dẹp cấu trúc thư mục. Tạo tệp dữ liệu tập trung [portfolio.ts](file:///c:/Users/Admin/OneDrive/M%C3%A1y%20t%C3%ADnh/Porfolio-V1/src/data/portfolio.ts) để tách biệt lớp dữ liệu (Data layer) ra khỏi lớp giao diện (View layer).
*   **Typography (Phase 2):** Cấu hình dải font chữ chuyên nghiệp từ Google Fonts:
    *   *Syne:* Tiêu đề hiển thị (Display Header), nét dày cá tính và đậm chất tương lai.
    *   *Plus Jakarta Sans:* Font chữ nội dung (Body text) có độ tương phản và khoảng cách ký tự (kerning) cực kỳ dễ đọc trên màn tối.
    *   *Cormorant Garamond:* Font chữ Serif nghiêng mềm mại cho các đoạn text phụ (kickers/quotes).
    *   *JetBrains Mono:* Font chữ đơn sắc (Monospace) cho các nhãn kỹ thuật, chỉ số GPA và metadata.
*   **GSAP Integration (Phase 3-4):** Tích hợp ScrollTrigger làm engine ghim và reveal nội dung. Thực hiện các cấu hình build tối ưu để đóng gói không bị lỗi TypeScript hoặc Rollup warnings.

### Giai đoạn 5-8: Cyber-Chroma Visual Direction & Color Harmony
*   **Halo Glow (Phase 5):** Thêm bộ lọc nền phát sáng phía sau mô hình 3D:
    ```css
    /* Nền phát sáng tỏa tròn lơ lửng */
    background: radial-gradient(circle, rgba(59,130,246,0.08) 0%, rgba(242,92,5,0.04) 45%, rgba(5,7,12,0) 75%);
    filter: blur(160px);
    ```
*   **Pinning & Scroll Logic (Phase 6):** Cấu hình ScrollTrigger với `pin: true` trên máy tính cho phần Stack và Contact HUD. Tạo ra trải nghiệm cuộn ghim trang màn hình: màn hình khóa cuộn dọc, chạy hoạt ảnh reveal của chữ và xoay các vòng tròn HUD, sau đó mới mở khóa để người dùng cuộn tiếp.
*   **Polish Neon Borders (Phase 7-8):** 
    *   Giảm độ đục của các đường biên phát sáng xuống `rgba(..., 0.15)` để tránh gây nhức mắt (Cyberpunk neon overload).
    *   Cấu trúc lại các thẻ card dự án thành dạng kính mờ (glassmorphism) với `backdrop-blur-md` và độ nghiêng 3D tinh tế khi hover.

### Giai đoạn 9: Cân chỉnh Trục & Tối ưu hóa Trỏ chuột 3D Monitor
*   **Đồng bộ trục quay:** Sửa lỗi lệch trục quay giữa màn hình (`Monitor`) và thân máy tính (`Body`). Sau khi phân tích vector, chúng tôi đã khóa và đồng bộ góc quay Yaw mặc định của cả hai về chính xác `y: 0.630 rad` (đồng bộ World Y Rotation).
*   **Công thức lượng giác hover:** 
    Khi di chuột trên màn hình, monitor sẽ xoay theo góc nhìn của người dùng. Để tránh hiện tượng xoay xéo lệch trục do góc camera của Scene bị nghiêng (`Scene 1` có góc quay `y: -0.340 rad`), chúng tôi áp dụng phép chiếu lượng giác:
    $$\theta_{WorldY} = \theta_{Scene1Y} + \theta_{BodyY} + \theta_{MonitorY} = -0.340 + 0.630 + 0.530 = 0.820 \text{ rad}$$
    $$\text{Pitch Rotation X} = -\text{mouseY} \times 0.4 \times \cos(\theta_{WorldY})$$
    $$\text{Pitch Rotation Z} = \text{mouseY} \times 0.4 \times \sin(\theta_{WorldY})$$
    $$\text{Yaw Rotation Y} = 0.630 + (\text{mouseX} \times 0.4)$$
    Phép chiếu này giúp trục ngửa lên/xuống (Pitch) của Monitor hoạt động chính xác theo phương dọc màn hình thực tế của người dùng.
*   **Hiệu năng:** Thay thế scrub HMR từ 1 xuống 0.15 bằng `gsap.to` và `overwrite: 'auto'` giúp loại bỏ hoàn toàn hiện tượng lag trỏ chuột và tiết kiệm tài nguyên CPU.

### Giai đoạn 10: Tương tác Vi mô (Micro-interactions)
*   **Hiệu ứng Xáo trộn Chữ cái (Scramble Text):**
    Tạo component React `<ScrambleText />` tại [ScrambleText.tsx](file:///c:/Users/Admin/OneDrive/M%C3%A1y%20t%C3%ADnh/Porfolio-V1/src/components/utilities/ScrambleText.tsx) để xáo trộn các ký tự ngẫu nhiên đầy công nghệ khi hover hoặc lúc tải trang. Hoạt động dựa trên thuật toán:
    1.  Kích hoạt vòng lặp `requestAnimationFrame` cập nhật liên tục 60 lần/giây.
    2.  Ở mỗi khung hình, một tỷ lệ ký tự ngẫu nhiên trong chuỗi được thay thế bằng các ký tự đặc biệt (`!@#$%^&*()_+...`).
    3.  Tăng dần số lượng ký tự chính xác từ trái sang phải cho đến khi hiển thị đầy đủ văn bản gốc.
*   **Hiệu ứng Hút nam châm (Magnetic Elements):**
    Hook [useMagneticElements.ts](file:///c:/Users/Admin/OneDrive/M%C3%A1y%20t%C3%ADnh/Porfolio-V1/src/hooks/useMagneticElements.ts) tạo ra lực hút hút các nút và biểu tượng mạng xã hội theo trỏ chuột trong bán kính kích hoạt 65px. Lực hút được giới hạn ở mức 35% (`pull = 0.35`) để đảm bảo người dùng vẫn làm chủ được trỏ chuột. Khi chuột rời đi, GSAP áp dụng hàm easing `elastic.out(1, 0.3)` để tạo độ nẩy nảy bung đàn hồi cực kỳ sinh động về vị trí tâm ban đầu.

### Giai đoạn 11: moncy.dev-inspired Career Timeline Section
*   **Cấu trúc dữ liệu:** Khai thác dữ liệu CV của chủ sở hữu để xây dựng timeline 3 mốc (HUTECH 2021, DEK AWS Intern 2025, và Freelance/Self-directed NOW).
*   **Trục dọc và chấm sáng cuộn:**
    Đường line tiến trình màu gradient (`.timeline-line-progress`) được liên kết với tiến trình cuộn của ScrollTrigger thông qua hoạt ảnh `scaleY` (0 lên 1).
    Chấm sáng phát sáng màu cam (`.timeline-tracer-dot`) di chuyển tương đối dọc theo trục nhờ hoạt ảnh thay đổi thuộc tính `top` từ `0%` lên `100%`.
*   **Reveal hoạt ảnh từng mốc:** Khi chấm sáng đi qua vị trí của mỗi `.career-item`, ScrollTrigger tương ứng kích hoạt hoạt ảnh reveal chữ trượt mượt mà từ hai bên cột vào giữa, loại bỏ bộ lọc blur và đổi trạng thái năm (`year`) cùng điểm giao thời gian (`node`) sang phát sáng màu cam.

### Giai đoạn 12: Bố cục Bất đối xứng 60/40 phản chiếu (Asymmetric Layouts)
*   **Vấn đề lớn:** Grid 2 cột cũ của Projects chiếm toàn bộ chiều rộng màn hình, đè lấp lên mô hình 3D khi nó di chuyển sang trái. Timeline Career nằm chính giữa cũng bị đè bởi mô hình 3D.
*   **Cải tiến đột phá:** Loại bỏ giới hạn `max-w-7xl` để mở rộng layout. Sắp đặt bố cục zigzag bất đối xứng so le để tránh hoàn toàn hiện tượng chồng chéo và tận dụng tối đa chiều sâu của mô hình 3D:
    1.  **About Section (Model bên Phải):** Cột nội dung dồn sang bên **Trái (55% width)**. Bên Phải là khoảng trống 40% cho mô hình.
    2.  **Projects Section (Model bên Trái):** Cột nội dung chứa các card dự án xếp dọc chuyển sang bên **Phải (55% width)**. Bên Trái là khoảng trống 40% nhường chỗ cho mô hình.
    3.  **Career Section (Model bên Phải):** Trục timeline dịch chuyển lề trái (`.timeline-asymmetric-container` với trục dọc ở `12%` bề rộng cột nội dung). Cột nội dung timeline dồn sang bên **Trái (55% width)**, nhường **Phải (40% width)** cho mô hình.
    4.  **Contact Section (Model bên Phải):** Certifications & Contact dồn sang bên **Trái (55% width)** xếp cạnh nhau thành lưới đôi, nhường **Phải (40% width)** làm không gian hiển thị cho mô hình.
*   **Đồng bộ quỹ đạo 3D:** Điều chỉnh timeline di chuyển của canvas 3D trong [SplineHeroScene.tsx](file:///c:/Users/Admin/OneDrive/M%C3%A1y%20t%C3%ADnh/Porfolio-V1/src/components/hero/SplineHeroScene.tsx) trượt zigzag mượt mà theo 4 chặng: `Center (Hero) -> Right (About) -> Left (Projects) -> Right (Career) -> Center-Right (Contact)`.

---

## 3. Bản đồ Spacing & Bố cục Hệ thống (Layout Spacing Matrix)

```
┌────────────────────────────────────────────────────────┐
│ [Hero Section]                                         │
│   [Left Text Grid 20%] <--- 3D Model Center ---> [CTA]  │
├────────────────────────────────────────────────────────┤
│ [About Section]                                        │
│   [Content Area 55% width]       [Spacer 40% - Model R]│
├────────────────────────────────────────────────────────┤
│ [Projects Section]                                     │
│   [Spacer 40% - Model L]       [Content Area 55% width]│
├────────────────────────────────────────────────────────┤
│ [Career Section (Left Timeline)]                        │
│   [Content Area 55% width]       [Spacer 40% - Model R]│
├────────────────────────────────────────────────────────┤
│ [Contact Section (Left Grid)]                          │
│   [Content Area 55% width]       [Spacer 40% - Model R]│
└────────────────────────────────────────────────────────┘
```

---

## 4. Các File Thay Đổi & Vai Trò (Modified Files & Roles)

| File | Vai trò kỹ thuật | Loại thay đổi |
| :--- | :--- | :--- |
| [portfolio.ts](file:///c:/Users/Admin/OneDrive/M%C3%A1y%20t%C3%ADnh/Porfolio-V1/src/data/portfolio.ts) | Định nghĩa dữ liệu tĩnh của Portfolio | Modify (Mở rộng dữ liệu `EXPERIENCE` và thuộc tính `year`) |
| [SplineHeroScene.tsx](file:///c:/Users/Admin/OneDrive/M%C3%A1y%20t%C3%ADnh/Porfolio-V1/src/components/hero/SplineHeroScene.tsx) | Quản lý canvas 3D và hoạt ảnh di chuyển mô hình | Modify (Cập nhật 4 chặng di chuyển zigzag của 3D model) |
| [hero.css](file:///c:/Users/Admin/OneDrive/M%C3%A1y%20t%C3%ADnh/Porfolio-V1/src/styles/hero.css) | Chứa CSS giao diện phần Hero, Timeline và Spacing | Modify (Thêm class timeline asymmetric và layout di động) |
| [Hero.tsx](file:///c:/Users/Admin/OneDrive/M%C3%A1y%20t%C3%ADnh/Porfolio-V1/src/components/Hero.tsx) | Component trang chủ chính lắp ghép các section | Modify (Cơ cấu lại layout Projects, Career, Contact dạng 60/40) |
| [ScrambleText.tsx](file:///c:/Users/Admin/OneDrive/M%C3%A1y%20t%C3%ADnh/Porfolio-V1/src/components/utilities/ScrambleText.tsx) | Component chạy hiệu ứng xáo trộn chữ cái | New |
| [useMagneticElements.ts](file:///c:/Users/Admin/OneDrive/M%C3%A1y%20t%C3%ADnh/Porfolio-V1/src/hooks/useMagneticElements.ts) | Hook quản lý lực hút nam châm của con trỏ chuột | New |

---

## 5. Kết Quả Biên Dịch Sản Phẩm (Build Result)

Bản đóng gói production bằng Vite hoàn thành thành công vượt trội, không phát sinh lỗi cú pháp hay cảnh báo kiểu dữ liệu:
```bash
vite v6.4.2 building for production...
transforming...
✓ 2119 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                         0.40 kB
dist/assets/index-DDwo19-f.css                         57.27 kB
dist/assets/index-gcDLuIYK.js                       2,575.50 kB
✓ built in 9.54s
```

---

## 6. Lộ trình Đề xuất cho Phiên tiếp theo (Next Session Backlog)

Để tiếp tục phát triển dự án lên các tầm cao mới, các nhà phát triển tiếp theo có thể cân nhắc:
1.  **Tích hợp Lenis Smooth Scroll:** Bổ sung Lenis để làm mịn tuyệt đối gia tốc cuộn chuột. Điều này giúp các ScrollTrigger hoạt động mượt mà hơn và tăng cảm giác premium của portfolio.
2.  **Hoạt ảnh hạt năng lượng (Cosmic Particles):** Tạo một canvas 2D nền chạy các hạt neon phát sáng nhẹ xung quanh mô hình 3D để tạo bầu không khí tương lai.
3.  **Học máy gợi ý Manga (Manga Recommendation Demo HUD):** Tạo một HUD tương tác nhỏ mô phỏng cơ chế gợi ý Manga (mangasmurf) bằng Python ngay trên giao diện của dự án MangaSmurf.
