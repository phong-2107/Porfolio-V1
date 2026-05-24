# App Header Hamburg Reference

Use this reference when migrating the old PhongDev App shell, Header, Sidebar, and hamburg-menu active/non-active behavior.

## Exact Files

Copy:

- `src/components/header/HeaderV1.tsx`
- `src/components/header/HeaderMenu.tsx`
- `src/components/header/HeaderSidebar.tsx`
- `src/components/social/SocialShareV1.tsx`
- `src/components/utilities/scrollNavigation.ts`

Optional App shell files:

- `src/App.tsx`
- `src/components/utilities/Dependency.tsx`
- `src/components/utilities/RoutesScrollToTop.tsx`
- `src/components/utilities/ScrollToTopButton.tsx`
- `src/components/utilities/Preloader.tsx`

## Required Assets

- `/assets/images/logo-1.png`
- `/assets/images/sidebarbg.png`
- `/assets/images/gradient-border.png`

## Hamburg State Contract

Non-active:

```css
.hamburg-menu {
  transform: scale(0);
}
```

Active:

```css
.hamburg-menu.active {
  transform: scale(1);
}
```

React state:

```tsx
const [isHamburgActive, setIsHamburgActive] = useState(false);

useEffect(() => {
  const handleScroll = () => {
    setIsHamburgActive(window.scrollY >= 100);
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);
```

Markup:

```tsx
<span className={`hamburg-menu ${isHamburgActive ? "active" : ""}`} onClick={handleHamburgClick}>
  <span />
  <span />
  <span />
</span>
```

## Sidebar State Contract

Non-active:

```css
.header-sidebar-wrap {
  opacity: 0;
  visibility: hidden;
}

.header-sidebar-wrap .header-sidebar-content {
  transform: translateX(100%);
}
```

Active:

```css
.header-sidebar-wrap.active {
  opacity: 1;
  visibility: visible;
}

.header-sidebar-wrap.active .header-sidebar-content {
  transform: translateX(0);
}
```

React state:

```tsx
const [isSidebarActive, setIsSidebarActive] = useState(false);

const handleHamburgClick = () => {
  setIsSidebarActive(true);
  document.body.style.overflow = "hidden";
};

const handleCloseClick = () => {
  setIsSidebarActive(false);
  document.body.style.overflow = "auto";
};
```

## Required CSS Selectors

Copy from `src/css/style.css`:

- `.header-menu-wrap`
- `.header-menu-wrap .custom-container`
- `.header-menu-wrap .custom-container .custom-row`
- `.header-menu-wrap .logo`
- `.header-menu-wrap .navbar .menu`
- `.header-menu-wrap .navbar .menu li a`
- `.header-menu-wrap .navbar .menu li .dropdown-list`
- `.header-menu-wrap .header-right-info`
- `.header-menu-wrap .header-cta-btn`
- `.header-sidebar-wrap`
- `.header-sidebar-wrap .header-sidebar-content`
- `.header-sidebar-wrap.active`
- `.header-sidebar-wrap.active .header-sidebar-content`
- `.header-sidebar-wrap .header-sidebar-content .close-header-sidebar`
- `.header-sidebar-wrap .header-sidebar-content .sidebar-menu`
- `.header-sidebar-wrap .header-sidebar-content .header-sidebar-bottom`
- `.scroll-to-show-menu`
- `.hamburg-menu`
- `.hamburg-menu.active`
- `.hamburg-menu:hover`
- `.hamburg-menu span`

Copy responsive overrides from `src/css/responsive.css` for:

- `.header-menu-wrap .custom-container`
- `.header-menu-wrap .navbar`
- `.header-menu-wrap .navbar>ul>li:not(.dropdown-menu-item)`
- `.hamburg-menu`
- `.header-sidebar-wrap .header-sidebar-content`
- `.header-sidebar-wrap .header-sidebar-content .sidebar-menu`
- `.header-sidebar-wrap .header-sidebar-content .header-sidebar-top`
- `.header-sidebar-wrap .header-sidebar-content .close-header-sidebar`

## Navigation Contract

Home click:

- On `/`: call `scrollToHomeTop()`.
- On any other route: `navigate("/")`.

Sidebar link:

- On `/`: call `moveToSection(anchor)`.
- On any other route: `navigate("/#anchor")`.

Preserve Home anchors:

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

## Integration Prompt

```txt
Use the old PhongDev Header and hamburg-menu exactly.
Copy HeaderV1, HeaderMenu, HeaderSidebar, SocialShareV1, scrollNavigation, logo-1.png, sidebarbg.png, gradient-border.png.
Copy the exact CSS for header-menu-wrap, header-sidebar-wrap, scroll-to-show-menu, hamburg-menu, hamburg-menu.active, and responsive overrides.
Keep hamburg non-active as transform: scale(0), active as transform: scale(1), active threshold window.scrollY >= 100, and sidebar active as .header-sidebar-wrap.active.
Run npm run build.
```
