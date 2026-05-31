import Spline from '@splinetool/react-spline';
import type { Application } from '@splinetool/runtime';
import { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useGSAP } from '@gsap/react';
import { getGsap } from '../../lib/gsap';

const { gsap, ScrollTrigger } = getGsap();

const SHOW_CALIBRATION_PANEL = false; // Đặt thành true nếu cần mở lại bảng cân chỉnh 3D

export default function SplineHeroScene() {
  const spline = useRef<Application | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollState = useRef<'hero' | 'about' | 'past'>('hero');
  
  const baseRot = useRef({
    monitorX: 0,
    monitorY: 0.630,
    monitorZ: 0,
    sceneX: 0,
    sceneY: -0.340,
    sceneZ: 0,
    bodyX: 0,
    bodyY: 0.630,
    bodyZ: 0,
    podiumX: -1.570,
    podiumY: 0,
    podiumZ: -1.015
  });

  const lastHoverOffset = useRef({ x: 0, y: 0, z: 0 });
  const xTo = useRef<any>(null);
  const yTo = useRef<any>(null);
  const zTo = useRef<any>(null);

  // Tránh lặp lại onLoad khi StrictMode render 2 lần
  const [isLoaded, setIsLoaded] = useState(false);

  // Danh sách các đối tượng 3D trong Scene
  const [objectList, setObjectList] = useState<string[]>([]);
  const [selectedObjectName, setSelectedObjectName] = useState<string>('');
  const selectedObjectRef = useRef<any>(null);

  // Trạng thái cân chỉnh góc quay (để false làm mặc định để kích hoạt hover ngay lập tức)
  const [calibrationMode, setCalibrationMode] = useState(false);
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const [rotZ, setRotZ] = useState(0);

  // useGSAP sẽ quản lý vòng đời và dọn dẹp Timeline/ScrollTrigger khi component unmount
  const { contextSafe } = useGSAP({ scope: containerRef });

  const setupAnimations = contextSafe(() => {
    if (!containerRef.current) return;

    const monitorObj = spline.current?.findObjectByName('Monitor');
    const scene1Obj = spline.current?.findObjectByName('Scene 1');
    const bodyObj = spline.current?.findObjectByName('Body');
    const podiumObj = spline.current?.findObjectByName('Podium');
    const mainScrollContainer = document.querySelector(".main-scroll-container");

    // Sử dụng gsap.matchMedia để quản lý Responsive (tự động tính toán lại khi resize màn hình)
    let mm = gsap.matchMedia();

    mm.add({
      isDesktop: "(min-width: 1025px)",
      isTablet: "(min-width: 641px) and (max-width: 1024px)",
      isMobile: "(max-width: 640px)"
    }, (context) => {
      let { isDesktop, isTablet, isMobile } = context.conditions as any;

      // Tính toán tỷ lệ hiển thị và vị trí lệch chuẩn cho từng màn hình
      // Tỷ lệ cũ (1.62) quá khổng lồ làm che khuất hoàn toàn chữ ở hai bên.
      // Cân chỉnh lại: Desktop (1.1), Tablet (0.85), Mobile (0.6)
      const currentScale = isMobile ? 0.6 : (isTablet ? 0.85 : 1.1);
      const xOffset = isMobile ? window.innerWidth * 0.02 : (isTablet ? window.innerWidth * 0.25 : window.innerWidth * 0.35);
      const yOffset = isMobile ? '12vh' : (isTablet ? '8vh' : '4vh'); // Đẩy mô hình lên một chút để thấy rõ receipt paper

      // Thiết lập hiển thị ban đầu ổn định cho container 3D
      gsap.set(containerRef.current, {
        x: 0,
        scale: currentScale,
        y: yOffset,
        opacity: 1,
        visibility: "visible",
        force3D: true
      });

      // Bản đồ di chuyển gốc của Spline đi qua toàn bộ các section của trang
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: mainScrollContainer || undefined,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
        onUpdate: () => {
          if (scene1Obj) gsap.set(scene1Obj.rotation, { x: baseRot.current.sceneX, y: baseRot.current.sceneY, z: baseRot.current.sceneZ });
          if (monitorObj) gsap.set(monitorObj.rotation, { x: baseRot.current.monitorX + lastHoverOffset.current.x, y: baseRot.current.monitorY + lastHoverOffset.current.y, z: baseRot.current.monitorZ + lastHoverOffset.current.z });
          if (bodyObj) gsap.set(bodyObj.rotation, { x: baseRot.current.bodyX, y: baseRot.current.bodyY, z: baseRot.current.bodyZ });
          if (podiumObj) gsap.set(podiumObj.rotation, { x: baseRot.current.podiumX, y: baseRot.current.podiumY, z: baseRot.current.podiumZ });
        }
      });

      if (monitorObj && scene1Obj) {
        // Giai đoạn chuyển tiếp từ Hero sang About (progress 0 -> 0.5)
        tl.fromTo(baseRot.current, 
          { monitorX: 0, monitorY: 0.630, monitorZ: 0, sceneX: 0, sceneY: -0.340, sceneZ: 0, bodyX: 0, bodyY: 0.630, bodyZ: 0, podiumX: -1.570, podiumY: 0.000, podiumZ: -1.015 },
          { monitorX: 0, monitorY: -0.175, monitorZ: -0.020, sceneX: 0, sceneY: -0.340, sceneZ: 0, bodyX: 0, bodyY: -0.175, bodyZ: -0.020, podiumX: -1.570, podiumY: 0.005, podiumZ: -1.670, ease: "none", duration: 0.5 },
          0
        );
        // Giữ nguyên góc quay cho phần còn lại
        tl.to(baseRot.current, { duration: 3.0 }, 0.5);
      }

      // Di chuyển Container sang phải khi cuộn từ Hero sang About
      tl.fromTo(containerRef.current,
        { x: 0, y: yOffset, scale: currentScale },
        { x: xOffset, y: yOffset, scale: currentScale, force3D: true, ease: "none", duration: 0.5 },
        0
      );

      // Giữ nguyên vị trí của Container ở bên phải trong suốt phần còn lại của trang
      tl.to(containerRef.current,
        { x: xOffset, y: yOffset, scale: currentScale, force3D: true, ease: "none", duration: 3.0 },
        0.5
      );
    });

    // 2. Cập nhật trạng thái cuộn khi người dùng đi vào/ra phần Technical Profile (About)
    // Phần này không phụ thuộc vào responsive scale nên đặt ngoài matchMedia để tránh tạo lại
    const aboutSection = document.getElementById("about");
    ScrollTrigger.create({
      trigger: aboutSection || undefined,
      start: "top top",
      onEnter: () => {
        scrollState.current = 'about';
        gsap.fromTo('.spline-dialogue-bubble',
          { opacity: 0, scaleX: 0.88, scaleY: 0.88 },
          { opacity: 1, scaleX: 1, scaleY: 1, duration: 0.45, ease: "back.out(1.7)", overwrite: "auto" }
        );
      },
      onLeaveBack: () => {
        scrollState.current = 'hero';
        gsap.to('.spline-dialogue-bubble', {
          opacity: 0,
          scaleX: 0.88,
          scaleY: 0.88,
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto"
        });
      }
    });

    // Buộc ScrollTrigger tính toán lại toàn bộ vị trí các trigger trên trang sau khi layout đã ổn định hoàn toàn
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);
  });

  // Áp dụng góc xoay trực tiếp khi kéo thanh trượt ở chế độ calibration
  useEffect(() => {
    const obj = selectedObjectRef.current;
    if (!obj || !calibrationMode) return;
    obj.rotation.x = rotX;
    obj.rotation.y = rotY;
    obj.rotation.z = rotZ;
  }, [rotX, rotY, rotZ, calibrationMode]);

  useEffect(() => {
    if (!isLoaded) return;

    // Khởi tạo trạng thái ban đầu ổn định
    if (containerRef.current) {
      containerRef.current.style.display = "block";
      containerRef.current.style.opacity = "1";
    }

    // Refresh ScrollTrigger sau khi React DOM render đã hoàn tất để tính toán vị trí pin spacer chính xác nhất
    ScrollTrigger.refresh();

    const handleWindowHover = contextSafe((e: MouseEvent) => {
      if (!spline.current || calibrationMode) return;
      
      const monitor = spline.current.findObjectByName('Monitor');
      if (!monitor) return;

      const state = scrollState.current;

      if (state === 'hero') {
        // Khi ở Hero: Di chuyển và xoay theo chuột toàn màn hình bình thường
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = -(e.clientY / window.innerHeight) * 2 + 1;

        const theta = 0.820;
        const cosT = Math.cos(theta);
        const sinT = Math.sin(theta);

        const pitch = -y * 0.4;
        const yaw = x * 0.4;

        const ox = pitch * cosT;
        const oy = yaw;
        const oz = -pitch * sinT;
        lastHoverOffset.current = { x: ox, y: oy, z: oz };

        if (xTo.current && yTo.current && zTo.current) {
          xTo.current(baseRot.current.monitorX + ox);
          yTo.current(baseRot.current.monitorY + oy);
          zTo.current(baseRot.current.monitorZ + oz);
        } else {
          gsap.to(monitor.rotation, {
            x: baseRot.current.monitorX + ox,
            y: baseRot.current.monitorY + oy,
            z: baseRot.current.monitorZ + oz,
            duration: 0.15,
            ease: 'power1.out',
            overwrite: 'auto'
          });
        }
      } else if (state === 'about') {
        // Khi ở Technical Profile (About): Giới hạn chỉ hover theo trỏ chuột bên trái
        const isLeft = e.clientX < window.innerWidth * 0.55;

        if (isLeft) {
          const x = (e.clientX / window.innerWidth) * 2 - 1;
          const y = -(e.clientY / window.innerHeight) * 2 + 1;

          const theta = 0.820;
          const cosT = Math.cos(theta);
          const sinT = Math.sin(theta);

          const pitch = -y * 0.4;
          const yaw = x * 0.4;

          const ox = pitch * cosT;
          const oy = yaw;
          const oz = -pitch * sinT;
          lastHoverOffset.current = { x: ox, y: oy, z: oz };

          if (xTo.current && yTo.current && zTo.current) {
            xTo.current(baseRot.current.monitorX + ox);
            yTo.current(baseRot.current.monitorY + oy);
            zTo.current(baseRot.current.monitorZ + oz);
          } else {
            gsap.to(monitor.rotation, {
              x: baseRot.current.monitorX + ox,
              y: baseRot.current.monitorY + oy,
              z: baseRot.current.monitorZ + oz,
              duration: 0.15,
              ease: 'power1.out',
              overwrite: 'auto'
            });
          }
        } else {
          // Khi trỏ chuột sang phải, monitor quay về hướng trái nhìn vào text và đứng yên
          const theta = 0.820;
          const cosT = Math.cos(theta);
          const sinT = Math.sin(theta);
          
          const yaw = -0.25; // Quay sang trái -0.25 rad
          const pitch = 0;   // Góc nhìn ngang

          const ox = pitch * cosT;
          const oy = yaw;
          const oz = -pitch * sinT;
          lastHoverOffset.current = { x: ox, y: oy, z: oz };

          if (xTo.current && yTo.current && zTo.current) {
            xTo.current(baseRot.current.monitorX + ox);
            yTo.current(baseRot.current.monitorY + oy);
            zTo.current(baseRot.current.monitorZ + oz);
          } else {
            gsap.to(monitor.rotation, {
              x: baseRot.current.monitorX + ox,
              y: baseRot.current.monitorY + oy,
              z: baseRot.current.monitorZ + oz,
              duration: 0.3,   // Mượt mà trượt về vị trí khóa
              ease: 'power1.out',
              overwrite: 'auto'
            });
          }
        }
      }
    });

    const handleScroll = contextSafe(() => {
      // Tìm phần tử section tiếp theo (About Me) làm mốc ẩn mô hình
      const aboutMeEl = document.getElementById('about-me');
      if (!aboutMeEl || !containerRef.current) return;

      const rect = aboutMeEl.getBoundingClientRect();
      // Cơ chế: Chỉ ẩn mô hình 3D khi đã cuộn đến 30% chiều cao của section tiếp theo (About Me)
      const threshold = window.innerHeight - (rect.height * 0.3);

      const shouldHide = rect.top <= threshold;

      if (shouldHide && scrollState.current !== 'past') {
        scrollState.current = 'past';
        gsap.to('.spline-dialogue-bubble', {
          opacity: 0,
          scaleX: 0.88,
          scaleY: 0.88,
          duration: 0.3,
          overwrite: "auto"
        });
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.4,
          ease: "power2.out",
          onComplete: () => {
            if (scrollState.current === 'past' && containerRef.current) {
              containerRef.current.style.display = "none";
            }
          }
        });
      } else if (!shouldHide && scrollState.current === 'past') {
        const aboutEl = document.getElementById('about');
        const aboutRect = aboutEl ? aboutEl.getBoundingClientRect() : null;
        
        const newState = (aboutRect && aboutRect.top <= 0) ? 'about' : 'hero';
        scrollState.current = newState;
        
        containerRef.current.style.display = "block";
        gsap.to(containerRef.current, {
          opacity: 1,
          duration: 0.4,
          ease: "power2.out"
        });

        if (newState === 'about') {
          gsap.fromTo('.spline-dialogue-bubble',
            { opacity: 0, scaleX: 0.88, scaleY: 0.88 },
            { opacity: 1, scaleX: 1, scaleY: 1, duration: 0.45, ease: "back.out(1.7)", overwrite: "auto" }
          );
        } else {
          gsap.to('.spline-dialogue-bubble', {
            opacity: 0,
            scaleX: 0.88,
            scaleY: 0.88,
            duration: 0.3,
            overwrite: "auto"
          });
        }
      }
    });

    window.addEventListener('mousemove', handleWindowHover);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Gọi lập tức để cập nhật trạng thái chuẩn xác khi reload trang
    handleScroll();

    // Chặn sự kiện wheel và touch để Spline không "nuốt" scroll của trang
    const blockScrollPropagation = (e: Event) => {
      e.stopPropagation();
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', blockScrollPropagation, { capture: true, passive: false });
      container.addEventListener('touchstart', blockScrollPropagation, { capture: true, passive: false });
      container.addEventListener('touchmove', blockScrollPropagation, { capture: true, passive: false });
    }

    return () => {
      window.removeEventListener('mousemove', handleWindowHover);
      window.removeEventListener('scroll', handleScroll);
      if (container) {
        container.removeEventListener('wheel', blockScrollPropagation, { capture: true });
        container.removeEventListener('touchstart', blockScrollPropagation, { capture: true });
        container.removeEventListener('touchmove', blockScrollPropagation, { capture: true });
      }
    };
  }, [isLoaded, calibrationMode, contextSafe]);

  // Khi người dùng chọn đối tượng khác trong dropdown
  const handleObjectChange = (name: string) => {
    setSelectedObjectName(name);
    if (!spline.current) return;
    const obj = spline.current.findObjectByName(name);
    selectedObjectRef.current = obj;
    if (obj) {
      setRotX(obj.rotation.x);
      setRotY(obj.rotation.y);
      setRotZ(obj.rotation.z);
    }
  };

  function onLoad(splineApp: Application) {
    if (isLoaded) return; // Chặn StrictMode chạy 2 lần

    spline.current = splineApp;

    // Duyệt qua scene để lấy danh sách tên các object 3D
    let sceneObj = (splineApp as any).scene;
    if (!sceneObj && (splineApp as any)._scene) {
      sceneObj = (splineApp as any)._scene;
    }

    const names: string[] = [];
    if (sceneObj) {
      const traverse = (obj: any) => {
        if (obj.name && !names.includes(obj.name) && !obj.name.startsWith('Default') && obj.name !== 'Scene') {
          names.push(obj.name);
        }
        if (obj.children) {
          obj.children.forEach((child: any) => traverse(child));
        }
      };
      traverse(sceneObj);
    }

    if (names.length === 0) {
      names.push('Monitor');
    }

    setObjectList(names);

    // Áp dụng các góc quay tối ưu đã được bạn hiệu chỉnh ở P1 và P2:
    const monitor = splineApp.findObjectByName('Monitor');
    const scene1 = splineApp.findObjectByName('Scene 1');
    const body = splineApp.findObjectByName('Body');
    const podium = splineApp.findObjectByName('Podium');
    const plant = splineApp.findObjectByName('Plant');

    if (monitor) {
      gsap.set(monitor.rotation, { x: 0, y: 0.630, z: 0 });
      // Phóng to riêng Monitor lên 20%
      monitor.scale.x *= 1.2;
      monitor.scale.y *= 1.2;
      monitor.scale.z *= 1.2;
    }
    if (scene1) gsap.set(scene1.rotation, { x: 0, y: -0.340, z: 0 });
    // Đồng bộ góc quay Y của Body khớp với Monitor (0.630) để thẳng hàng và không bị lệch
    if (body) gsap.set(body.rotation, { x: 0, y: 0.630, z: 0 });
    if (podium) gsap.set(podium.rotation, { x: -1.570, y: 0.000, z: -1.015 });
    if (plant) gsap.set(plant.rotation, { x: -0.050, y: 2.295, z: 0.050 });
    
    // Chọn đối tượng Monitor mặc định trong Dropdown
    const defaultObjName = 'Monitor';
    setSelectedObjectName(defaultObjName);
    selectedObjectRef.current = monitor;

    if (monitor) {
      setRotX(monitor.rotation.x);
      setRotY(monitor.rotation.y);
      setRotZ(monitor.rotation.z);
      
      // Khởi tạo các hàm quickTo điều khiển góc quay mượt mà với hiệu suất cao nhất
      xTo.current = gsap.quickTo(monitor.rotation, 'x', { duration: 0.22, ease: 'power1.out' });
      yTo.current = gsap.quickTo(monitor.rotation, 'y', { duration: 0.22, ease: 'power1.out' });
      zTo.current = gsap.quickTo(monitor.rotation, 'z', { duration: 0.22, ease: 'power1.out' });
    }

    setIsLoaded(true);
    setupAnimations();
  }

  return (
    <>
      <div
        ref={containerRef}
        className="w-full h-full relative z-[10] pointer-events-auto will-change-transform"
        style={{ transformOrigin: 'center center' }}
      >
        <Spline
          scene="https://prod.spline.design/4QDf3qwGtpRrRVFU/scene.splinecode"
          onLoad={onLoad}
        />

        {/* Bong bóng thoại (Dialogue/Thought Bubble) giới thiệu kỹ năng thân thiện */}
        <div 
          className="spline-dialogue-bubble pointer-events-none opacity-0"
          style={{
            position: 'absolute',
            bottom: '72%',         /* neo phía trên màn hình, sát nóc monitor */
            left: '50%',
            transform: 'translateX(-50%) scale(0.9)',
            transformOrigin: 'bottom center',
            zIndex: 20,
            width: 'max-content',
            maxWidth: '220px',
          }}
        >
          <div className="spline-dialogue-bubble-float">
            {/* Card kính mờ cao cấp */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(8,7,6,0.96) 0%, rgba(23,21,18,0.94) 100%)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(var(--accent-cyan-rgb),0.34)',
              borderRadius: '16px',
              boxShadow: '0 0 26px rgba(var(--accent-cyan-rgb),0.12), 0 8px 32px rgba(0,0,0,0.55), inset 0 1px 0 rgba(244,239,231,0.06)',
              padding: '12px 16px 14px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              position: 'relative',
            }}>
              {/* Mũi tên trỏ xuống */}
              <div style={{
                position: 'absolute',
                bottom: '-7px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '14px',
                height: '14px',
                background: 'linear-gradient(135deg, rgba(23,21,18,0.94), rgba(23,21,18,0.94))',
                border: '1px solid rgba(var(--accent-cyan-rgb),0.34)',
                borderTop: 'none',
                borderLeft: 'none',
                rotate: '45deg',
              }} />

              {/* Label */}
              <span style={{
                fontSize: '9px',
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--accent-orange)',
                lineHeight: 1,
              }}>MY SKILLS</span>

              {/* Nội dung chính */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center', margin: '2px 0' }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--accent-orange)', flexShrink: 0 }}>
                  <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
                </svg>
                <p style={{
                  fontSize: '11px',
                  color: 'var(--text-primary)',
                  lineHeight: '1.4',
                  fontWeight: 500,
                  textAlign: 'center',
                  margin: 0,
                }}>
                  Đây là những kỹ năng<br/>chuyên môn của tôi.
                </p>
              </div>

              {/* Mini tech tags */}
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '2px' }}>
                {['C#', 'React', 'Node'].map(tag => (
                  <span key={tag} style={{
                    fontSize: '8px',
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: 'rgba(var(--accent-cyan-rgb),0.10)',
                    border: '1px solid rgba(var(--accent-cyan-rgb),0.24)',
                    color: 'var(--accent-cyan)',
                    letterSpacing: '0.05em',
                  }}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Floating keyframes cho bong bóng thoại để tạo cảm giác sinh động */}
      <style>{`
        @keyframes spline-bubble-float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        .spline-dialogue-bubble-float {
          animation: spline-bubble-float 4s ease-in-out infinite;
        }
      `}</style>

      {/* Bảng cân chỉnh góc xoay mô hình 3D sử dụng Portal để đưa ra ngoài stacking context */}
      {SHOW_CALIBRATION_PANEL && isLoaded && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed bottom-12 left-6 z-[99999] p-4 bg-bg-surface/90 backdrop-blur-md border border-accent-cyan/30 rounded-xl text-text-secondary font-mono text-[11px] w-[310px] pointer-events-auto flex flex-col gap-3 shadow-lg select-none"
          style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
        >
          <div className="flex items-center justify-between border-b border-accent-cyan/20 pb-2">
            <span className="text-accent-cyan font-bold tracking-widest uppercase">3D CALIBRATION PANEL</span>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input 
                type="checkbox" 
                checked={calibrationMode}
                onChange={(e) => setCalibrationMode(e.target.checked)}
                className="accent-accent-orange"
              />
              <span className={calibrationMode ? "text-accent-orange" : ""}>Calib</span>
            </label>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-text-secondary/80">Select Object:</span>
            <select
              value={selectedObjectName}
              onChange={(e) => handleObjectChange(e.target.value)}
              className="bg-bg-base border border-accent-cyan/20 rounded px-2 py-1 text-white font-mono text-[11px] focus:outline-none focus:border-accent-cyan/50"
            >
              {objectList.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between">
                <span>Rotation X (Pitch):</span>
                <span className="text-white font-bold">{rotX.toFixed(3)} rad</span>
              </div>
              <input 
                type="range" 
                min="-3.14" 
                max="3.14" 
                step="0.005"
                value={rotX} 
                disabled={!calibrationMode}
                onChange={(e) => setRotX(parseFloat(e.target.value))}
                className="w-full accent-accent-cyan"
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between">
                <span>Rotation Y (Yaw):</span>
                <span className="text-white font-bold">{rotY.toFixed(3)} rad</span>
              </div>
              <input 
                type="range" 
                min="-3.14" 
                max="3.14" 
                step="0.005"
                value={rotY} 
                disabled={!calibrationMode}
                onChange={(e) => setRotY(parseFloat(e.target.value))}
                className="w-full accent-accent-cyan"
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between">
                <span>Rotation Z (Roll):</span>
                <span className="text-white font-bold">{rotZ.toFixed(3)} rad</span>
              </div>
              <input 
                type="range" 
                min="-3.14" 
                max="3.14" 
                step="0.005"
                value={rotZ} 
                disabled={!calibrationMode}
                onChange={(e) => setRotZ(parseFloat(e.target.value))}
                className="w-full accent-accent-cyan"
              />
            </div>
          </div>

          <div className="text-[10px] border-t border-accent-cyan/20 pt-2 text-text-secondary/70 flex flex-col gap-1">
            {calibrationMode ? (
              <span className="text-accent-orange">⚠️ Kéo thanh trượt để xoay, bỏ tích 'Calib' để kiểm tra hiệu ứng chuột hover.</span>
            ) : (
              <span className="text-green-400">✔️ Chế độ chuột theo dõi đang bật.</span>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
