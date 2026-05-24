# App, Header, Hamburg Menu Migration Guide

Hướng dẫn này dùng để copy App integration, Header, Sidebar và hamburg-menu active/non-active từ dự án cũ sang dự án mới sao cho giữ đúng style và behavior.

## 1. Mục Tiêu

Muốn giống dự án cũ, phải copy đủ 3 lớp:

1. App integration:
   - Import CSS đúng thứ tự.
   - Mount `Dependency`, routes, scroll utilities.

2. Header/menu:
   - `HeaderV1`
   - `HeaderMenu`
   - `HeaderSidebar`
   - `scrollNavigation`

3. CSS state:
   - `.header-menu-wrap`
   - `.scroll-to-show-menu`
   - `.hamburg-menu`
   - `.hamburg-menu.active`
   - `.header-sidebar-wrap`
   - `.header-sidebar-wrap.active`

## 2. Files Cần Copy

Copy các file này:

```txt
old/src/components/header/HeaderV1.tsx
new/src/components/header/HeaderV1.tsx

old/src/components/header/HeaderMenu.tsx
new/src/components/header/HeaderMenu.tsx

old/src/components/header/HeaderSidebar.tsx
new/src/components/header/HeaderSidebar.tsx

old/src/components/social/SocialShareV1.tsx
new/src/components/social/SocialShareV1.tsx

old/src/components/utilities/scrollNavigation.ts
new/src/components/utilities/scrollNavigation.ts
```

Nếu copy App shell đầy đủ:

```txt
old/src/App.tsx
old/src/components/utilities/Dependency.tsx
old/src/components/utilities/RoutesScrollToTop.tsx
old/src/components/utilities/ScrollToTopButton.tsx
old/src/components/utilities/Preloader.tsx
old/src/components/motion/StoryMotionProvider.tsx
```

## 3. Assets Cần Copy

```txt
old/public/assets/images/logo-1.png
new/public/assets/images/logo-1.png

old/public/assets/images/sidebarbg.png
new/public/assets/images/sidebarbg.png

old/public/assets/images/gradient-border.png
new/public/assets/images/gradient-border.png
```

`gradient-border.png` được dùng bởi dropdown menu:

```css
.header-menu-wrap .navbar .menu li .dropdown-list::before {
    background: url('/assets/images/gradient-border.png');
}
```

## 4. App Integration

Trong dự án mới, `App.tsx` nên giữ import CSS theo thứ tự giống dự án cũ nếu bạn copy legacy CSS:

```tsx
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import "aos/dist/aos.css";
import "react-toastify/dist/ReactToastify.css";

import "./css/line-awesome.min.css";
import "./css/iconoir.css";
import "./css/fontawesome.min.css";
import "./css/animate.min.css";

import "./css/aixor-unit-test.css";
import "./css/style.css";
import "./css/responsive.css";
import "./css/fullpage-motion.css";
```

Nếu dự án mới đã tách CSS thành `src/styles/*`, thì vẫn phải copy đủ block header/sidebar/hamburg từ `style.css` và responsive overrides từ `responsive.css`.

App shell tối thiểu:

```tsx
import Routers from "./Routers";
import Dependency from "./components/utilities/Dependency";
import RoutesScrollToTop from "./components/utilities/RoutesScrollToTop";
import { ScrollToTopButton } from "./components/utilities/ScrollToTopButton";

function App() {
  return (
    <>
      <Dependency />
      <Routers />
      <RoutesScrollToTop />
      <ScrollToTopButton />
    </>
  );
}

export default App;
```

Nếu dùng preloader như dự án cũ, giữ pattern:

```tsx
const [isLoading, setIsLoading] = useState(true);

return (
  <>
    <Dependency />
    {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
    {!isLoading && (
      <>
        <Routers />
        <RoutesScrollToTop />
        <ScrollToTopButton />
      </>
    )}
  </>
);
```

## 5. HeaderV1 Contract

`HeaderV1.tsx` chỉ là wrapper:

```tsx
import HeaderSidebar from "./HeaderSidebar";
import HeaderMenu from "./HeaderMenu";

const HeaderV1 = () => {
  return (
    <>
      <HeaderSidebar />
      <HeaderMenu />
    </>
  );
};

export default HeaderV1;
```

Không đổi thứ tự nếu muốn giống dự án cũ. Sidebar/hamburg được render trước header menu.

## 6. HeaderMenu Behavior

`HeaderMenu` cần:

- `useLocation()`
- `useNavigate()`
- `scrollToHomeTop()`
- `logo-1.png`

Home click behavior:

```tsx
const handleHomeClick = (event: MouseEvent<HTMLAnchorElement>) => {
  event.preventDefault();

  if (location.pathname === "/") {
    scrollToHomeTop();
    return;
  }

  navigate("/");
};
```

Ý nghĩa:

- Nếu đang ở `/`, click Home/logo không reload route mà scroll/move về anchor `hero`.
- Nếu đang ở route khác, click Home/logo navigate về `/`.

Class contract phải giữ:

```txt
header-menu-wrap
custom-container
custom-row
logo
navbar
menu
dropdown-menu-item
dropdown-list
header-right-info
header-phone
header-cta-btn
```

Nếu đổi class, CSS cũ sẽ không apply.

## 7. HeaderSidebar Behavior

State cũ:

```tsx
const [isSidebarActive, setIsSidebarActive] = useState(false);
const [isHamburgActive, setIsHamburgActive] = useState(false);
```

Scroll active logic:

```tsx
useEffect(() => {
  const handleScroll = () => {
    setIsHamburgActive(window.scrollY >= 100);
  };

  window.addEventListener("scroll", handleScroll);

  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
}, []);
```

Open behavior:

```tsx
const handleHamburgClick = () => {
  setIsSidebarActive(true);
  document.body.style.overflow = "hidden";
};
```

Close behavior:

```tsx
const handleCloseClick = () => {
  setIsSidebarActive(false);
  document.body.style.overflow = "auto";
};
```

Section click behavior:

```tsx
const handleSectionClick = (anchor: string) => {
  handleCloseClick();

  if (location.pathname === "/") {
    moveToSection(anchor);
    return;
  }

  navigate(`/#${anchor}`);
};
```

## 8. Hamburg Menu Active / Non-Active

Đây là phần quan trọng nhất để giống dự án cũ.

### Non-Active State

Markup:

```tsx
<span className="hamburg-menu">
  <span />
  <span />
  <span />
</span>
```

CSS non-active:

```css
.hamburg-menu {
    border: 2.5px solid rgba(254, 255, 247, 0.72);
    width: 60px;
    height: 60px;
    display: flex;
    flex-direction: column;
    position: absolute;
    right: 35px;
    top: 25px;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    gap: 5px;
    background:
        radial-gradient(circle at 30% 20%, rgba(255, 135, 17, 0.28), transparent 42%),
        rgba(16, 39, 43, 0.74);
    box-shadow: 0 14px 38px rgba(16, 39, 43, 0.22);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    cursor: pointer;
    transform: scale(0);
    transition: .3s;
    -webkit-transition: .3s;
}
```

Non-active nghĩa là nút vẫn tồn tại trong DOM nhưng bị ẩn bằng:

```css
transform: scale(0);
```

Không dùng `display: none` nếu muốn animation giống cũ.

### Active State

Markup từ React:

```tsx
<span className={`hamburg-menu ${isHamburgActive ? "active" : ""}`}>
  <span />
  <span />
  <span />
</span>
```

CSS active:

```css
.hamburg-menu.active {
    transform: scale(1);
}
```

Điều kiện active:

```txt
window.scrollY >= 100
```

Tức là:

- Lúc ở top page: hamburger ẩn.
- Scroll xuống ít nhất 100px: hamburger hiện bằng scale animation.

### Hover State

```css
.hamburg-menu:hover {
    background: var(--color-accent);
}

.hamburg-menu:hover span {
    background: var(--color-paper);
}

.hamburg-menu span {
    display: block;
    width: 20px;
    height: 1px;
    background: var(--color-paper);
    transition: .3s;
    -webkit-transition: .3s;
}
```

## 9. Sidebar Active / Non-Active

### Non-Active Overlay

```css
.header-sidebar-wrap {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1026;
    width: 100%;
    height: 100%;
    background:
        radial-gradient(circle at 18% 12%, rgba(70, 233, 233, 0.18), transparent 28%),
        rgba(16, 39, 43, 0.82);
    opacity: 0;
    visibility: hidden;
    transition: 0.4s;
    -webkit-transition: 0.4s;
}
```

### Non-Active Panel

```css
.header-sidebar-wrap .header-sidebar-content {
    width: 42%;
    margin-left: auto;
    height: 100vh;
    background:
        radial-gradient(circle at 22% 0%, rgba(255, 122, 26, 0.18), transparent 28%),
        radial-gradient(circle at 86% 72%, rgba(18, 214, 221, 0.12), transparent 28%),
        linear-gradient(180deg, rgba(16, 42, 48, 0.98) 0%, rgba(7, 26, 31, 0.98) 100%);
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-direction: column;
    flex-wrap: nowrap;
    position: relative;
    transform: translateX(100%);
    overflow-x: hidden;
    gap: 150px;
    transition: 0.4s;
    -webkit-transition: 0.4s;
}
```

### Active Overlay

```css
.header-sidebar-wrap.active {
    opacity: 1;
    visibility: visible;
}
```

### Active Panel

```css
.header-sidebar-wrap.active .header-sidebar-content {
    transform: translateX(0);
}
```

Ý nghĩa:

- Overlay fade in bằng opacity/visibility.
- Panel trượt từ phải vào bằng `translateX(100%) -> translateX(0)`.

## 10. CSS Header/Menu Phải Copy

Copy nguyên các selector sau từ `src/css/style.css`:

```txt
.header-menu-wrap
.header-menu-wrap .custom-container
.header-menu-wrap .custom-container .custom-row
.header-menu-wrap .logo
.header-menu-wrap .logo img
.header-menu-wrap .navbar .menu
.header-menu-wrap .navbar .menu > li
.header-menu-wrap .navbar .menu li a
.header-menu-wrap .navbar .menu li a>span
.header-menu-wrap .navbar .menu li a:before
.header-menu-wrap .navbar .menu li a:hover:before
.header-menu-wrap .navbar .menu li a:hover
.header-menu-wrap .navbar .menu li
.header-menu-wrap .navbar .menu li .dropdown-list *
.header-menu-wrap .navbar .menu li .dropdown-list::before
.header-menu-wrap .navbar .menu li .dropdown-list
.header-menu-wrap .navbar .menu li:hover>.dropdown-list
.header-menu-wrap .navbar .menu li .dropdown-list li a
.header-menu-wrap .header-right-info
.header-menu-wrap .header-right-info .header-phone
.header-menu-wrap .header-right-info .header-phone:hover
.header-menu-wrap .header-right-info a img
.header-menu-wrap .header-right-info a i
.header-menu-wrap .header-right-info a:hover i
.header-menu-wrap .header-cta-btn
.header-menu-wrap .header-cta-btn:hover
```

Copy sidebar/hamburg selectors:

```txt
.header-sidebar-wrap
.header-sidebar-wrap .header-sidebar-content
.header-sidebar-wrap.active
.header-sidebar-wrap.active .header-sidebar-content
.header-sidebar-wrap .header-sidebar-content .sidebar-shape
.header-sidebar-wrap .header-sidebar-content .close-header-sidebar
.header-sidebar-wrap .header-sidebar-content .header-sidebar-top
.header-sidebar-wrap .header-sidebar-content .header-sidebar-top ul
.header-sidebar-wrap .header-sidebar-content .header-sidebar-top ul li
.header-sidebar-wrap .header-sidebar-content .header-sidebar-top ul li a
.header-sidebar-wrap .header-sidebar-content .header-sidebar-top ul li span
.header-sidebar-wrap .header-sidebar-content .sidebar-menu
.header-sidebar-wrap .header-sidebar-content .sidebar-menu ul
.header-sidebar-wrap .header-sidebar-content .sidebar-menu ul li a
.header-sidebar-wrap .header-sidebar-content .sidebar-menu ul li a:before
.header-sidebar-wrap .header-sidebar-content .sidebar-menu ul li a:hover:before
.header-sidebar-wrap .header-sidebar-content .sidebar-menu ul li a:hover
.header-sidebar-wrap .header-sidebar-content .header-sidebar-bottom
.header-sidebar-wrap .header-sidebar-content .header-sidebar-bottom ul
.header-sidebar-wrap .header-sidebar-content .header-sidebar-bottom ul li
.header-sidebar-wrap .header-sidebar-content .header-sidebar-bottom ul li a
.header-sidebar-wrap .header-sidebar-content .header-sidebar-bottom ul li a:hover
.scroll-to-show-menu
.hamburg-menu
.hamburg-menu.active
.hamburg-menu:hover
.hamburg-menu:hover span
.hamburg-menu span
```

## 11. Responsive CSS Phải Copy

Copy responsive rules liên quan từ `src/css/responsive.css`:

```css
@media (max-width: 1440px) {
    .header-menu-wrap .custom-container {
        max-width: 100%;
        padding-left: 72px;
        padding-right: 72px;
    }
}
```

```css
@media (max-width: 1439px) {
    .header-menu-wrap .navbar {
        margin-left: auto;
        margin-right: 66px;
    }

    .header-menu-wrap .navbar>ul>li:not(.dropdown-menu-item) {
        display: none;
    }
}
```

```css
@media (max-width: 809px) {
    .header-menu-wrap .navbar {
        margin-right: 36px;
    }

    .header-menu-wrap .navbar .menu li .dropdown-list {
        left: auto;
        right: 0;
    }

    .header-menu-wrap .custom-container {
        padding-left: 22px;
        padding-right: 22px;
    }

    .hamburg-menu {
        right: 20px;
    }

    .header-sidebar-wrap .header-sidebar-content {
        width: 100%;
    }

    .header-sidebar-wrap .header-sidebar-content .header-sidebar-bottom,
    .header-sidebar-wrap .header-sidebar-content .sidebar-menu {
        padding-left: 25px;
    }

    .header-sidebar-wrap .header-sidebar-content .header-sidebar-top {
        padding-left: 25px;
        padding-right: 25px;
        padding-top: 70px;
    }

    .header-sidebar-wrap .header-sidebar-content .header-sidebar-top ul li {
        gap: 25px;
    }

    .header-sidebar-wrap .header-sidebar-content .close-header-sidebar {
        right: 20px;
    }
}
```

```css
@media (max-width: 767px) {
    .header-sidebar-wrap .header-sidebar-content {
        gap: 50px;
    }
}
```

## 12. Token CSS Bắt Buộc

Header/sidebar CSS dùng các biến:

```txt
--color-accent
--color-accent-soft
--color-paper
--site-bg
--primary
--secondary
--text-primary
--border-default
```

Nếu dự án mới dùng token mới, map tối thiểu:

```css
:root {
    --bg-base: #071A1F;
    --bg-deep: #020608;
    --bg-surface: #102A30;
    --text-primary: #F8FAFC;
    --text-secondary: #A7B4BD;
    --accent-orange: #FF7A1A;
    --accent-orange-hover: #FF9A4D;
    --accent-cyan: #12D6DD;

    --color-accent: var(--accent-orange);
    --color-accent-soft: var(--accent-orange-hover);
    --color-paper: #FEFFF7;
    --site-bg: var(--bg-deep);
    --primary: rgba(254, 255, 247, 0.82);
    --secondary: rgba(254, 255, 247, 0.62);
    --border-default: rgba(248, 250, 252, 0.12);
}
```

## 13. Anchor Map Cho Sidebar

Giữ đúng anchor nếu copy Home1 structure:

```tsx
const sectionLinks = [
  { label: "About Us", anchor: "about" },
  { label: "Services", anchor: "services" },
  { label: "Projects", anchor: "feature" },
  { label: "Awards", anchor: "awards" },
  { label: "Members", anchor: "team" },
  { label: "Pricing", anchor: "price" },
  { label: "Contact", anchor: "contact" },
];
```

Không đổi `feature` thành `projects` hoặc `price` thành `pricing` nếu `scrollNavigation.ts` và section class chưa đổi.

## 14. Cleanup Bắt Buộc

Dự án cũ chưa restore body overflow khi component unmount. Khi đưa sang dự án mới, nên thêm cleanup này để tránh kẹt scroll nếu route unmount lúc sidebar mở:

```tsx
useEffect(() => {
  return () => {
    document.body.style.overflow = "auto";
  };
}, []);
```

Nếu yêu cầu “giống logic cũ 100%”, có thể giữ nguyên. Nếu yêu cầu production-safe, thêm cleanup trên.

## 15. Không Được Làm Nếu Muốn Giống 100%

Không:

- Đổi `.hamburg-menu.active` thành class khác.
- Dùng `display: none` thay cho `transform: scale(0)`.
- Đổi điều kiện active từ `scrollY >= 100`.
- Đổi `z-index` của header/sidebar/hamburg nếu chưa kiểm tra Spline/Hero.
- Đổi `translateX(100%)` của sidebar panel.
- Bỏ `document.body.style.overflow = "hidden"` khi mở sidebar.
- Đổi class `header-menu-wrap`, `header-sidebar-wrap`, `scroll-to-show-menu`.

## 16. Manual Test

Sau khi copy, test:

```txt
1. Ở đầu trang, hamburg-menu không hiện.
2. Scroll xuống >= 100px, hamburg-menu scale lên và hiện.
3. Hover hamburg-menu, nền chuyển orange.
4. Click hamburg-menu, sidebar overlay fade in.
5. Sidebar panel trượt từ phải sang trái.
6. Body không scroll khi sidebar mở.
7. Click close, sidebar biến mất và body scroll lại.
8. Click section link trên route `/`, sidebar đóng và moveToSection(anchor).
9. Click section link từ route khác, navigate về `/#anchor`.
10. Mobile <= 809px, sidebar width 100%, hamburger right 20px.
```

## 17. Prompt Cho Codex Ở Dự Án Mới

```txt
Add the App/Header/Hamburg menu system from the old PhongDev portfolio exactly.

Copy:
- HeaderV1.tsx
- HeaderMenu.tsx
- HeaderSidebar.tsx
- SocialShareV1.tsx
- scrollNavigation.ts
- required header assets: logo-1.png, sidebarbg.png, gradient-border.png

Copy CSS blocks exactly for:
- .header-menu-wrap and dropdown menu
- .header-sidebar-wrap and .header-sidebar-wrap.active
- .scroll-to-show-menu
- .hamburg-menu and .hamburg-menu.active
- responsive overrides for header/sidebar/hamburg

Preserve behavior:
- hamburg-menu non-active uses transform: scale(0)
- hamburg-menu active uses transform: scale(1)
- active condition is window.scrollY >= 100
- sidebar active uses .header-sidebar-wrap.active
- sidebar panel slides translateX(100%) to translateX(0)
- body overflow is hidden on open and restored on close
- Home click scrolls to hero on / and navigates to / from other routes

Run npm run build and report changed files.
```
