import Spline from '@splinetool/react-spline';
import type { Application } from '@splinetool/runtime';
import { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function SplineHeroScene() {
  const spline = useRef<Application | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

    // Phóng to toàn bộ mô hình lên 20% (từ scale: 1.35 lên scale: 1.62) và dịch chuyển Y xuống
    gsap.set(containerRef.current, { scale: 1.62, y: '8vh', force3D: true });

    // Thay thế "vw" String bằng Pixel số thực tuyệt đối
    const xOffset = window.innerWidth > 768 ? window.innerWidth * 0.28 : window.innerWidth * 0.4;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".main-scroll-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5, // Giảm từ 1 xuống 0.5 để phản ứng nhanh, bớt tồn đọng (lag)
        invalidateOnRefresh: true,
      }
    });

    // Giữ nguyên tỷ lệ 20% (scale: 1.62) và chiều cao (y: 8vh), chỉ trượt sang lề phải/trái
    tl.to(containerRef.current, {
      x: xOffset * 1.25, // About (phải)
      y: '8vh', 
      scale: 1.62,
      force3D: true, // Kích hoạt Hardware Acceleration
      ease: "none"
    })
    .to(containerRef.current, {
      x: -xOffset * 1.25, // Projects (trái)
      y: '8vh',
      scale: 1.62,
      force3D: true,
      ease: "none"
    })
    .to(containerRef.current, {
      x: xOffset * 1.25, // Career (phải)
      y: '8vh',
      scale: 1.62,
      force3D: true,
      ease: "none"
    })
    .to(containerRef.current, {
      x: xOffset * 0.8, // Contact (phải-center)
      y: '8vh',
      scale: 1.62,
      force3D: true,
      ease: "none"
    });
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

    const handleWindowHover = contextSafe((e: MouseEvent) => {
      if (!spline.current || calibrationMode) return;
      
      const monitor = spline.current.findObjectByName('Monitor');
      if (!monitor) return;

      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;

      // Góc quay Y tích lũy trong không gian thế giới (World Y Rotation)
      // Bao gồm: Scene 1 (-0.340) + Body (0.530) + Monitor Local Y (0.630) = 0.820 rad
      const theta = 0.820;
      const cosT = Math.cos(theta);
      const sinT = Math.sin(theta);

      // Pitch (ngửa lên/xuống) và Yaw (xoay trái/phải)
      const pitch = -y * 0.4;
      const yaw = x * 0.4;

      // Chiếu vector Pitch lên trục X và Z của Monitor để tránh hiện tượng xoay xéo lệch trục
      gsap.to(monitor.rotation, {
        x: pitch * cosT,
        y: 0.630 + yaw,
        z: -pitch * sinT,
        duration: 0.15,
        ease: 'power1.out',
        overwrite: 'auto' // Ghi đè hoạt ảnh cũ ngay lập tức, tiết kiệm tài nguyên CPU
      });
    });

    window.addEventListener('mousemove', handleWindowHover);

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
      if (container) {
        container.removeEventListener('wheel', blockScrollPropagation, { capture: true });
        container.removeEventListener('touchstart', blockScrollPropagation, { capture: true });
        container.removeEventListener('touchmove', blockScrollPropagation, { capture: true });
      }
    };
  }, [isLoaded, calibrationMode, contextSafe]);

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
    }

    setIsLoaded(true);
    setupAnimations();
  }

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
      </div>

      {/* Bảng cân chỉnh góc xoay mô hình 3D sử dụng Portal để đưa ra ngoài stacking context */}
      {isLoaded && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed bottom-12 left-6 z-[99999] p-4 bg-[#071A1F]/90 backdrop-blur-md border border-[#12D6DD]/30 rounded-xl text-[#A7B4BD] font-mono text-[11px] w-[310px] pointer-events-auto flex flex-col gap-3 shadow-lg select-none"
          style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
        >
          <div className="flex items-center justify-between border-b border-[#12D6DD]/20 pb-2">
            <span className="text-[#12D6DD] font-bold tracking-widest uppercase">3D CALIBRATION PANEL</span>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input 
                type="checkbox" 
                checked={calibrationMode}
                onChange={(e) => setCalibrationMode(e.target.checked)}
                className="accent-[#FF7A1A]"
              />
              <span className={calibrationMode ? "text-[#FF7A1A]" : ""}>Calib</span>
            </label>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[#A7B4BD]/80">Select Object:</span>
            <select
              value={selectedObjectName}
              onChange={(e) => handleObjectChange(e.target.value)}
              className="bg-[#102A30] border border-[#12D6DD]/20 rounded px-2 py-1 text-white font-mono text-[11px] focus:outline-none focus:border-[#12D6DD]/50"
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
                className="w-full accent-[#12D6DD]"
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
                className="w-full accent-[#12D6DD]"
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
                className="w-full accent-[#12D6DD]"
              />
            </div>
          </div>

          <div className="text-[10px] border-t border-[#12D6DD]/20 pt-2 text-[#A7B4BD]/70 flex flex-col gap-1">
            {calibrationMode ? (
              <span className="text-[#FF7A1A]">⚠️ Kéo thanh trượt để xoay, bỏ tích 'Calib' để kiểm tra hiệu ứng chuột hover.</span>
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
