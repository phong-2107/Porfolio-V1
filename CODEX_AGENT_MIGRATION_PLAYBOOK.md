# Codex Agent Migration Playbook

Bộ hướng dẫn này dùng để giao việc cho Codex khi dựng dự án mới từ source portfolio hiện tại.

## 1. Prompt Khởi Động

Dùng prompt này trong dự án hiện tại trước khi yêu cầu Codex tạo dự án mới:

```txt
Use $phongdev-portfolio-migration.

Analyze the current PhongDev portfolio and build a new React + TypeScript + Vite project structure that can safely reuse:
- HeroV1 with the current Spline scene
- Header/menu/sidebar navigation
- popup/sidebar body-lock pattern
- GSAP story motion
- magnetic mouse/CTA interaction
- dark futuristic orange/cyan design system
- reusable section/card/button styles

Do not rewrite the current app.
Do not add Tailwind or shadcn/ui.
Do not change the Spline scene URL.
Build in small reviewable phases.
Run npm run build after code changes.
Report changed files, copied patterns, build result, and remaining manual checks.
```

## 2. Agent Vai Trò: Project Architect

Mục tiêu:

- Đọc source hiện tại.
- Xác định component nào copy nguyên, component nào rewrite.
- Tạo cấu trúc dự án mới.
- Giữ routing và dependency sạch.

Checklist:

- Đọc `DESIGN_CONTEXT.md.md`, `design-system.md.md`, `PROJECT_STRUCTURE.md`.
- Đọc skill `phongdev-portfolio-migration`.
- Inspect `package.json`, `vite.config.ts`, `src/App.tsx`, `src/Routers.tsx`.
- Tạo target folders theo `NEW_PROJECT_STRUCTURE_BLUEPRINT.md`.
- Không thêm dependency ngoài stack hiện có nếu chưa cần.

Output cần có:

- Danh sách cấu trúc thư mục.
- Danh sách dependency.
- Danh sách component sẽ copy.
- Danh sách component nên rewrite.

## 3. Agent Vai Trò: Design System Migrator

Mục tiêu:

- Tách style nền từ global CSS thành tokens và primitives.
- Giữ đúng phong cách premium dark futuristic.

Checklist:

- Extract token màu từ `src/css/style.css`.
- Tạo `tokens.css`, `base.css`, `components.css`, `motion.css`, `hero.css`, `story.css`.
- Giữ orange là CTA/action.
- Giữ cyan là border/metadata/support.
- Không tạo palette mới.
- Không copy toàn bộ legacy CSS nếu không cần.

Output cần có:

- File CSS mới.
- Mapping selector cũ sang selector mới.
- Rủi ro selector legacy còn phụ thuộc.

## 4. Agent Vai Trò: Hero/Spline Migrator

Mục tiêu:

- Copy HeroV1 sang dự án mới và giữ Spline/motion hoạt động.

Checklist:

- Copy `HeroV1.tsx`.
- Copy `useHeroV1Motion.ts`.
- Copy `HeroV1.timeline.ts`.
- Copy `useHeroGuideStory.ts` nếu giữ guide.
- Copy `Bulge.tsx`.
- Copy asset `btn-arrow.svg`.
- Thêm Spline viewer script vào `index.html` nếu thiếu.
- Copy CSS hero từ `style.css`, `fullpage-motion.css`, `responsive.css`.
- Giữ Spline scene URL.
- Test CTA không bị Spline che.

Output cần có:

- Hero render được.
- Build pass.
- Manual check desktop/mobile/reduced motion.

## 5. Agent Vai Trò: Navigation And Popup Migrator

Mục tiêu:

- Copy Header/menu/sidebar.
- Chuẩn hóa popup/sidebar body-lock pattern.

Checklist:

- Copy `HeaderV1`, `HeaderMenu`, `HeaderSidebar`.
- Copy `scrollNavigation.ts`.
- Copy assets logo/sidebar image.
- Preserve Home click behavior.
- Preserve anchor map nếu dùng Home story route.
- Cleanup body overflow khi đóng và unmount.
- Tạo reusable `Popup`/`Drawer` nếu dự án mới cần nhiều overlay.

Output cần có:

- Header hoạt động.
- Sidebar mở/đóng không làm kẹt scroll.
- Anchor links hoạt động trên `/` và route khác.

## 6. Agent Vai Trò: Motion System Migrator

Mục tiêu:

- Copy và scope GSAP motion primitives.

Checklist:

- Copy `lib/gsap.ts`.
- Copy `lib/motion.ts`.
- Copy `useStoryReveal.ts`.
- Copy `useMagneticElements.ts`.
- Copy `StoryMotionProvider.tsx`.
- Mount provider một lần trong đúng scope.
- Dùng `data-motion` cho new sections.
- Không animate element có `data-aos`.
- Reduced motion phải set final visible states.

Output cần có:

- Story reveal hoạt động.
- Magnetic CTA hoạt động.
- Không có duplicate ScrollTrigger trên cùng target.

## 7. Agent Vai Trò: Section Rebuilder

Mục tiêu:

- Chuyển section template sang story chapters và data-driven content.

Chapter map:

```txt
Arrival    -> Hero
Signal     -> About
Craft      -> Services / Skills
Proof      -> Feature / Projects
Method     -> Process
Invitation -> Contact
```

Checklist:

- Copy About/Services/Feature trước.
- Convert content sang `src/data/*`.
- Giảm hoặc bỏ Team/Price/Partner nếu không phục vụ portfolio.
- Dùng `data-motion="heading"`, `reveal`, `card`, `media`, `cta`.
- Dùng `data-motion-group="cards"` cho card groups.

Output cần có:

- Section có vai trò trong câu chuyện.
- Không còn nội dung template agency lạc hướng.

## 8. Agent Vai Trò: Verification

Mục tiêu:

- Kiểm tra build, layout, motion, Spline, navigation.

Commands:

```bash
npm run build
```

Windows fallback:

```bash
npm.cmd run build
```

Manual viewport checks:

```txt
1440
1280
1024
768
430
375
```

Checklist:

- No build errors.
- No horizontal overflow.
- No white background leak.
- Hero text and CTA readable.
- Spline visible and not blocking CTA.
- Header Home works.
- Sidebar anchors work.
- Reduced motion works.
- AOS/GSAP not applied to same new target.

## 9. Final Report Format

Codex nên trả lời theo mẫu:

```txt
Files changed:
- ...

What changed:
- ...

Copied/reused from old source:
- ...

Build:
- npm run build: passed/failed

Remaining checks:
- ...
```
