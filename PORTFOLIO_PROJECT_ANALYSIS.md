# Portfolio Project Analysis

Phân tích này dùng để hiểu source hiện tại trước khi dựng một dự án mới có thể copy component, style, hero Spline và motion system từ dự án này.

## 1. Tổng Quan

Dự án hiện tại là portfolio React + TypeScript + Vite theo hướng:

- Premium dark futuristic portfolio
- Scroll storytelling
- Spline/3D-first hero
- GSAP motion system
- Global CSS-heavy template
- Bootstrap + template section components

Điểm mạnh của source là đã có nhiều thành phần nền để tái sử dụng: Hero Spline, header/sidebar, motion hooks, ScrollToTop, data-motion convention, token màu dark/orange/cyan, và cấu trúc placeholder cho `src/lib`, `src/data`, `src/styles`, `src/hooks/motion`.

Rủi ro chính là CSS và animation đang chồng nhiều lớp: Bootstrap, global template CSS, AOS, animate.css, GSAP, Lenis, Fullpage, Spline, Three.js. Khi copy sang dự án mới cần tách theo từng nhóm thay vì copy toàn bộ cùng lúc.

## 2. Stack Hiện Tại

Runtime:

- React 19
- TypeScript
- Vite
- React Router
- Bootstrap
- GSAP + `@gsap/react`
- `@fullpage/react-fullpage`
- Lenis
- AOS / animate.css legacy
- Three.js experiment route
- Spline web component trong `HeroV1`

Build/dev:

- `npm run build` chạy `tsc -b && vite build`
- Vite dùng `@vitejs/plugin-react-swc`
- Nên giữ `resolve.dedupe: ["react", "react-dom"]`

## 3. Kiến Trúc Route Và Trang Chính

`Home1` là route chính `/`.

Luồng chính:

```txt
src/main.tsx
src/App.tsx
src/Routers.tsx
src/pages/homePages/Home1.tsx
```

`Home1.tsx` hiện render:

```txt
HeaderV1
HeroV1
AboutV1
ServicesV1
FeatureV1
AwardsV1
TeamV1
PriceV1
TestimonialV1
ContactV1
PartnerV1
FooterV1
```

Anchor contract cần giữ nếu dùng Fullpage/Home navigation:

```txt
hero
about
services
feature
awards
team
price
testimonial
contact
partner
footer
```

## 4. HeroV1

HeroV1 là component quan trọng nhất để copy sang dự án mới.

File liên quan:

```txt
src/components/hero/HeroV1.tsx
src/components/hero/useHeroV1Motion.ts
src/components/hero/HeroV1.timeline.ts
src/hooks/motion/useHeroGuideStory.ts
src/components/utilities/Bulge.tsx
```

Hero hiện có:

- Spline viewer URL cố định
- Pointer parallax
- IntersectionObserver để ẩn/hiện Spline khi ra khỏi viewport
- Cinematic intro timeline
- Scroll depth timeline
- Title split reveal
- Magnetic CTA qua `data-motion="magnetic"`
- Robot guide / device trigger
- `data-motion` và `data-motion-el` song song

Khi copy Hero sang dự án mới, phải copy cả TSX, hook, timeline, CSS hero, responsive CSS và asset `btn-arrow.svg`.

## 5. Header, Sidebar, Popup Pattern

Header chính gồm:

```txt
src/components/header/HeaderV1.tsx
src/components/header/HeaderMenu.tsx
src/components/header/HeaderSidebar.tsx
src/components/utilities/scrollNavigation.ts
```

Behavior quan trọng:

- Logo/Home click ở route `/` gọi `scrollToHomeTop()`.
- Logo/Home click từ route khác navigate về `/`.
- Sidebar link dùng anchor map.
- Sidebar mở thì lock `document.body.style.overflow = "hidden"`.
- Sidebar đóng thì restore overflow.

Pattern này có thể dùng làm nền cho popup/modal reusable trong dự án mới.

## 6. Motion System

Motion primitives đáng tái sử dụng:

```txt
src/lib/gsap.ts
src/lib/motion.ts
src/hooks/motion/useStoryReveal.ts
src/hooks/interaction/useMagneticElements.ts
src/hooks/usePointerInteractions.ts
src/components/motion/StoryMotionProvider.tsx
```

Quy tắc copy:

- Dùng GSAP cho motion mới.
- Scope animation theo rootRef khi có thể.
- Cleanup timeline, ScrollTrigger, listener, observer.
- Không dùng AOS cho element mới đã có GSAP.
- Không animate layout properties.
- Luôn có reduced-motion fallback.

Lưu ý: source hiện tại có khả năng mount `StoryMotionProvider` global trong `App.tsx` và route-scoped trong `Home1.tsx`. Dự án mới nên chọn một cách mount rõ ràng để tránh double animation.

## 7. CSS Và Design System

CSS hiện tại nằm chủ yếu ở:

```txt
src/css/style.css
src/css/fullpage-motion.css
src/css/responsive.css
src/css/aixor-unit-test.css
```

Trong dự án mới, nên tách dần thành:

```txt
src/styles/tokens.css
src/styles/base.css
src/styles/components.css
src/styles/motion.css
src/styles/hero.css
src/styles/story.css
src/styles/responsive.css
```

Token màu chính:

```txt
--bg-base: #071A1F
--bg-deep: #020608
--bg-surface: #102A30
--text-primary: #F8FAFC
--text-secondary: #A7B4BD
--accent-orange: #FF7A1A
--accent-orange-hover: #FF9A4D
--accent-cyan: #12D6DD
```

Tỷ lệ màu:

```txt
Dark base: 75%
Neutral/text: 15%
Orange accent: 7%
Cyan support: 3%
```

## 8. Component Tái Sử Dụng

Ưu tiên copy sớm:

- `HeaderV1`, `HeaderMenu`, `HeaderSidebar`
- `HeroV1` và motion files
- `StoryMotionProvider`
- `ScrollToTopButton`
- `Bulge`
- `ContactV1`
- `FooterV1`

Copy sau khi app đã build:

- `AboutV1`
- `ServicesV1`
- `FeatureV1`
- `AwardsV1`
- `TestimonialV1`

Cân nhắc rewrite thay vì copy nguyên:

- `TeamV1`
- `PriceV1`
- `PartnerV1`

Các section này có thể còn mang logic template agency, chưa chắc phù hợp portfolio cá nhân.

## 9. Hướng Dựng Dự Án Mới

Chiến lược tốt nhất:

1. Dựng Vite React TS sạch.
2. Cài dependency cùng stack.
3. Copy token, base CSS, asset bắt buộc.
4. Copy `lib`, `hooks/motion`, `hooks/interaction`.
5. Copy Header/sidebar.
6. Copy Hero Spline.
7. Build.
8. Copy từng section.
9. Convert content sang `src/data/*`.
10. Tách CSS legacy thành các layer rõ ràng.

Không nên copy toàn bộ `src` một lần vì sẽ kéo theo route/template/animation conflict khó kiểm soát.

## 10. Kết Luận

Dự án hiện tại phù hợp làm source template nâng cao cho portfolio mới, nhưng nên dùng như migration source chứ không phải clone nguyên trạng. Giá trị lớn nhất nằm ở HeroV1, motion hooks, màu sắc, header/sidebar behavior, và định hướng Scroll Storytelling. Rủi ro lớn nhất nằm ở CSS global và nhiều animation engine cùng tồn tại.
