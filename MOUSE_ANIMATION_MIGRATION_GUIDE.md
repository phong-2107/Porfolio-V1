# Mouse Animation Migration Guide

Hướng dẫn này dùng để thêm mouse animation cho dự án mới sao cho giống dự án cũ 100% về style và behavior.

## 1. Nguyên Tắc

Muốn giống dự án cũ 100%, không viết lại animation mới. Copy đúng các file đang được mount trong dự án cũ:

```txt
src/components/animated/MotionCursor.tsx
src/hooks/usePointerInteractions.ts
```

Và copy đúng các CSS block liên quan từ:

```txt
src/css/style.css
```

Không dùng `MagicCursor`, `CursorTrail`, hoặc `GhostCursor` cho bản 100% giống hiện tại vì các component đó tồn tại trong source nhưng không phải lớp cursor chính đang được mount bởi `Dependency.tsx`.

## 2. Behavior Của Dự Án Cũ

Dự án cũ có 2 lớp mouse animation chạy cùng nhau:

1. Custom cursor:
   - Dot màu cam đi nhanh theo chuột.
   - Ring trắng/cyan đi chậm hơn tạo inertia.
   - Khi hover link/button/card, dot đổi trắng, ring phóng to và border chuyển cam.
   - Khi mouse down, dot nhỏ lại, ring thu về 44px.
   - Body bị ẩn cursor mặc định bằng `body.has-motion-cursor`.

2. Pointer hover physics:
   - Target được thêm class `.motion-hover` và `.is-pointer-active`.
   - JS set CSS variables:
     - `--motion-x`
     - `--motion-y`
     - `--motion-tilt-x`
     - `--motion-tilt-y`
     - `--motion-scale`
   - Button/link bị hút nhẹ theo chuột.
   - Card/project/service có tilt 3D nhẹ.
   - Rect được cache và chỉ refresh khi scroll/resize để tránh lag.

## 3. Files Cần Copy Sang Dự Án Mới

Copy file:

```txt
old/src/components/animated/MotionCursor.tsx
new/src/components/animated/MotionCursor.tsx

old/src/hooks/usePointerInteractions.ts
new/src/hooks/usePointerInteractions.ts
```

Nếu dự án mới chưa có folder:

```txt
src/components/animated/
src/hooks/
```

Thì tạo đúng path trên để import không cần sửa nhiều.

## 4. Gắn Vào App

Tạo hoặc copy component `Dependency.tsx` tối giản:

```tsx
import { usePointerInteractions } from "../../hooks/usePointerInteractions";
import MotionCursor from "../animated/MotionCursor";

const Dependency = () => {
  usePointerInteractions();

  return <MotionCursor />;
};

export default Dependency;
```

Gắn vào `App.tsx` ở level global:

```tsx
import Dependency from "./components/utilities/Dependency";

function App() {
  return (
    <>
      <Dependency />
      {/* routes/app content */}
    </>
  );
}

export default App;
```

Nếu dự án mới đã copy `Dependency.tsx` từ dự án cũ, giữ nguyên phần này:

```tsx
usePointerInteractions();
...
<MotionCursor />
```

## 5. CSS Phải Copy Nguyên Bản

Copy các block CSS sau từ `old/src/css/style.css` sang `new/src/styles/mouse-animation.css` hoặc file CSS global đang import.

### 5.1. Motion Hover CSS

```css
.motion-hover {
    --motion-x: 0px;
    --motion-y: 0px;
    --motion-tilt-x: 0deg;
    --motion-tilt-y: 0deg;
    --motion-scale: 1;
    transform:
        translate3d(var(--motion-x), var(--motion-y), 0)
        rotateX(var(--motion-tilt-x))
        rotateY(var(--motion-tilt-y))
        scale(var(--motion-scale));
    transition:
        transform 0.55s cubic-bezier(0.22, 1, 0.36, 1),
        box-shadow 0.45s cubic-bezier(0.22, 1, 0.36, 1),
        border-color 0.45s cubic-bezier(0.22, 1, 0.36, 1),
        background-color 0.45s cubic-bezier(0.22, 1, 0.36, 1);
    transform-style: preserve-3d;
    will-change: transform;
}

.motion-hover.is-pointer-active {
    transition:
        transform 0.18s ease-out,
        box-shadow 0.45s cubic-bezier(0.22, 1, 0.36, 1),
        border-color 0.45s cubic-bezier(0.22, 1, 0.36, 1),
        background-color 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}

.header-menu-wrap a.motion-hover,
.notch-bar-menu-wrap a.motion-hover {
    display: inline-flex;
    transform-origin: center;
}

.header-menu-wrap a.motion-hover.is-pointer-active,
.notch-bar-menu-wrap a.motion-hover.is-pointer-active {
    color: var(--color-accent);
    text-shadow: 0 0 24px rgba(252, 101, 3, 0.22);
}

.motion-hover.is-pointer-active.theme-btn {
    box-shadow: 0 24px 72px rgba(93, 254, 254, 0.22), 0 8px 28px rgba(252, 101, 3, 0.18);
}

.motion-hover.is-pointer-active.service-box,
.motion-hover.is-pointer-active.feature-project,
.motion-hover.is-pointer-active.pricing-box,
.motion-hover.is-pointer-active.team-member-box,
.motion-hover.is-pointer-active.testimonial-box {
    border-color: rgba(254, 255, 247, 0.3);
    box-shadow: 0 36px 120px rgba(93, 254, 254, 0.18), 0 12px 42px rgba(0, 0, 0, 0.2);
}
```

### 5.2. Custom Cursor CSS

```css
body.has-motion-cursor,
body.has-motion-cursor * {
    cursor: none !important;
}

.motion-cursor {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 2147483647;
    pointer-events: none;
    opacity: 0;
    will-change: transform, opacity;
}

.motion-cursor.is-visible {
    opacity: 1;
}

.motion-cursor--dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #ff6a00;
    box-shadow: 0 0 26px rgba(255, 106, 0, 0.72);
    transition: opacity 0.2s ease, width 0.22s ease, height 0.22s ease, background-color 0.22s ease;
}

.motion-cursor--ring {
    width: 42px;
    height: 42px;
    border: 1px solid rgba(255, 255, 255, 0.82);
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.05);
    box-shadow: 0 0 38px rgba(93, 254, 254, 0.32);
    transition: opacity 0.2s ease, width 0.28s cubic-bezier(0.22, 1, 0.36, 1), height 0.28s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.22s ease, background-color 0.22s ease;
}

.motion-cursor--dot.is-hovering {
    width: 12px;
    height: 12px;
    background: #ffffff;
}

.motion-cursor--ring.is-hovering {
    width: 72px;
    height: 72px;
    border-color: rgba(255, 106, 0, 0.68);
    background: rgba(255, 106, 0, 0.08);
}

.motion-cursor--dot.is-pressed {
    width: 6px;
    height: 6px;
}

.motion-cursor--ring.is-pressed {
    width: 44px;
    height: 44px;
}
```

### 5.3. Reduced Motion / Touch CSS

```css
@media (hover: none) {
    body.has-motion-cursor,
    body.has-motion-cursor * {
        cursor: auto !important;
    }

    .motion-cursor {
        display: none;
    }
}

@media (hover: none), (prefers-reduced-motion: reduce) {
    .motion-hover,
    .motion-hover.is-pointer-active {
        transform: none !important;
        transition: none !important;
    }
}
```

### 5.4. Hover Transform Overrides

```css
.pricing-box.motion-hover:hover {
    transform:
        translate3d(var(--motion-x), calc(var(--motion-y) - 10px), 0)
        rotateX(var(--motion-tilt-x))
        rotateY(var(--motion-tilt-y))
        scale(var(--motion-scale));
}

.testimonial-box.motion-hover:hover {
    transform:
        translate3d(var(--motion-x), calc(var(--motion-y) - 8px), 0)
        rotateX(var(--motion-tilt-x))
        rotateY(var(--motion-tilt-y))
        scale(var(--motion-scale));
}

.service-box.motion-hover:hover,
.feature-project.motion-hover:hover,
.team-member-box.motion-hover:hover,
.theme-btn.motion-hover:hover {
    transform:
        translate3d(var(--motion-x), var(--motion-y), 0)
        rotateX(var(--motion-tilt-x))
        rotateY(var(--motion-tilt-y))
        scale(var(--motion-scale));
}
```

## 6. CSS Variables Bắt Buộc

Các CSS block trên dùng:

```txt
--color-accent
```

Trong dự án mới phải có token này. Nếu đã dùng token mới, map như sau:

```css
:root {
    --accent-orange: #FF7A1A;
    --color-accent: var(--accent-orange);
}
```

Để giống 100%, nên giữ thêm màu hard-coded trong cursor CSS:

```txt
#ff6a00
rgba(255, 106, 0, ...)
rgba(93, 254, 254, ...)
```

Không đổi sang token khác nếu yêu cầu là giống dự án cũ 100%.

## 7. Selector Target Của Hover Physics

`usePointerInteractions.ts` chỉ áp dụng cho các selector này:

```txt
.theme-btn
.header-menu-wrap a
.notch-bar-menu-wrap a
.service-box
.feature-project
.pricing-box
.team-member-box
.testimonial-box
```

Nếu dự án mới đổi tên class, animation sẽ không giống 100%. Muốn giữ đúng behavior thì giữ nguyên class cũ trên component mới.

Nếu thêm component mới muốn có cùng hiệu ứng, thêm class tương ứng thay vì sửa hook. Ví dụ:

```tsx
<a className="theme-btn">...</a>
<article className="feature-project">...</article>
<div className="service-box">...</div>
```

## 8. Không Được Làm Nếu Muốn Giống 100%

Không:

- Dùng Framer Motion thay cho hook cũ.
- Đổi easing.
- Đổi z-index cursor.
- Đổi kích thước dot/ring.
- Đổi màu `#ff6a00`.
- Đổi strength/scale/tilt trong `usePointerInteractions.ts`.
- Mount đồng thời `MagicCursor`, `CursorTrail`, `GhostCursor`.
- Thêm custom cursor khác.
- Gắn animation vào mobile/touch.

## 9. Kiểm Tra Sau Khi Gắn

Run:

```bash
npm run build
```

Windows fallback:

```bash
npm.cmd run build
```

Manual test:

```txt
1. Di chuột trên trang: dot cam đi nhanh, ring đi trễ hơn.
2. Hover link/header: dot trắng, ring phóng to 72px.
3. Hover .theme-btn: button bị hút nhẹ và có glow cyan/orange.
4. Hover .feature-project/.service-box: card tilt nhẹ.
5. Mouse down: dot còn 6px, ring 44px.
6. Rời khỏi viewport: cursor ẩn.
7. Mobile/touch: custom cursor không hiện.
8. prefers-reduced-motion: hover transform bị disable.
```

## 10. Prompt Cho Codex Ở Dự Án Mới

Dùng prompt này:

```txt
Add the mouse animation from the old PhongDev portfolio exactly 100%.

Copy these old files without changing behavior:
- src/components/animated/MotionCursor.tsx
- src/hooks/usePointerInteractions.ts

Copy the related CSS blocks exactly:
- .motion-hover
- .motion-cursor
- body.has-motion-cursor
- hover/reduced-motion media queries
- pricing/testimonial/service/feature/team/theme-btn motion-hover overrides

Mount usePointerInteractions() and <MotionCursor /> globally through Dependency.tsx or App.tsx.

Do not use MagicCursor, CursorTrail, GhostCursor, Framer Motion, or any rewritten cursor implementation.
Keep the original sizes, colors, easing, z-index, selectors, and interaction strengths.
Run npm run build and report changed files.
```
