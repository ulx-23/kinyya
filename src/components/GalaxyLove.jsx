import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

const HEART_PATH = "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

// HORIZONTAL orbit (tidur/datar — cincin Saturnus)
const horizontalOrbit = [
  { type: "letter", content: "B", radius: 240, speed: 20, startAngle: 0,   planetColor: "#FF2E93", glowColor: "rgba(255,46,147,0.5)" },
  { type: "letter", content: "U", radius: 240, speed: 20, startAngle: 120, planetColor: "#EC4899", glowColor: "rgba(236,72,153,0.5)" },
  { type: "letter", content: "L", radius: 240, speed: 20, startAngle: 240, planetColor: "#F43F5E", glowColor: "rgba(244,63,94,0.5)" },
  { type: "bouquet",  radius: 330, speed: 32, startAngle: 60 },
  { type: "card",     radius: 330, speed: 32, startAngle: 180 },
  { type: "heart-sm", radius: 330, speed: 32, startAngle: 300 },
];

// VERTICAL orbit (berdiri tegak — roda Ferris)
const verticalOrbit = [
  { type: "letter", content: "A", radius: 240, speed: 22, startAngle: 0,   planetColor: "#FF758F", glowColor: "rgba(255,117,143,0.5)" },
  { type: "letter", content: "N", radius: 240, speed: 22, startAngle: 180, planetColor: "#FF2E93", glowColor: "rgba(255,46,147,0.5)" },
];

export default function GalaxyLove() {
  const [stars, setStars] = useState([]);
  const [floatingHearts, setFloatingHearts] = useState([]);
  const [clickSparks, setClickSparks] = useState([]);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const requestRef = useRef();

  // Asteroid belt of 48 tiny hearts surrounding the central galaxy
  const [heartsBelt] = useState(() => 
    Array.from({ length: 48 }).map((_, i) => ({
      id: `hb-${i}`,
      radius: 140 + Math.random() * 190, // Spanned between 140px and 330px
      speed: 12 + Math.random() * 20,
      startAngle: Math.random() * 360,
      scale: 0.3 + Math.random() * 0.5,
      opacity: 0.35 + Math.random() * 0.55,
      color: ['#FF2E93', '#EC4899', '#F43F5E', '#FF758F', '#FBCFE8', '#FF8DA1'][Math.floor(Math.random() * 6)],
      isVertical: Math.random() > 0.5,
    }))
  );

  // Starfield
  useEffect(() => {
    setStars(Array.from({ length: 60 }).map((_, i) => ({
      id: i, x: Math.random() * 100, y: Math.random() * 100,
      size: Math.random() > 0.6 ? 3 : 2,
      opacity: 0.12 + Math.random() * 0.7,
      delay: Math.random() * 4,
      zParallax: 0.3 + Math.random() * 0.7,
    })));
  }, []);

  // Floating background hearts (banyak love melayang)
  useEffect(() => {
    const hearts = Array.from({ length: 75 }).map((_, i) => ({
      id: `fh-${i}`,
      x: Math.random() * 100,
      size: 10 + Math.random() * 22,
      delay: Math.random() * 20,
      duration: 12 + Math.random() * 18,
      opacity: 0.16 + Math.random() * 0.28,
      color: ['#FF2E93', '#EC4899', '#F43F5E', '#FF758F', '#FBCFE8', '#FF8DA1'][Math.floor(Math.random() * 6)],
    }));
    setFloatingHearts(hearts);
  }, []);

  // Mouse parallax
  useEffect(() => {
    let tX = 0, tY = 0, cX = 0, cY = 0;
    const onMove = (e) => {
      tX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      tY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
    };
    const tick = () => {
      cX += (tX - cX) * 0.06;
      cY += (tY - cY) * 0.06;
      setMouseOffset({ x: cX, y: cY });
      requestRef.current = requestAnimationFrame(tick);
    };
    window.addEventListener('mousemove', onMove);
    requestRef.current = requestAnimationFrame(tick);
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(requestRef.current); };
  }, []);

  // Click burst
  const handleBgClick = (e) => {
    if (e.target.closest('.interactive-el')) return;
    const sparks = Array.from({ length: 10 }).map((_, i) => {
      const a = (i * Math.PI * 2) / 10 + Math.random() * 0.3;
      const d = 50 + Math.random() * 80;
      return { id: `${Date.now()}-${i}`, x: e.clientX, y: e.clientY, dx: Math.cos(a) * d, dy: Math.sin(a) * d, size: 10 + Math.random() * 14 };
    });
    setClickSparks(p => [...p, ...sparks]);
    setTimeout(() => setClickSparks(p => p.filter(s => !sparks.find(ns => ns.id === s.id))), 1000);
  };

  const camTiltX = 15 + mouseOffset.y * 10;
  const camTiltY = mouseOffset.x * 15;

  // Billboard untuk Ring 1 (Horizontal, miring 60deg): 
  // Batalkan kemiringan orbit 60deg dulu, lalu ikuti arah kamera
  const billboardStyle = { 
    transform: `rotateX(-60deg) rotateY(${-camTiltY}deg) rotateX(${-camTiltX}deg)`,
    transformStyle: 'preserve-3d'
  };

  // Billboard untuk Ring 2 (Vertical, miring rotateY 75deg, rotateZ 15deg):
  // Batalkan kemiringan Z dan Y orbit, lalu ikuti arah kamera
  const billboardVertStyle = { 
    transform: `rotateZ(-15deg) rotateY(-75deg) rotateY(${-camTiltY}deg) rotateX(${-camTiltX}deg)`,
    transformStyle: 'preserve-3d'
  };

  const renderContent = (item, isVertical) => {
    const bb = isVertical ? billboardVertStyle : billboardStyle;

    if (item.type === "letter") {
      // Fungsi pembantu untuk membuat shadow 3D bertingkat (extrusion) yang solid dan jelas
      const get3DShadow = (color) => {
        return `
          0 1px 0 #ffffff,
          0 2px 0 ${color},
          0 3px 0 ${color}ee,
          0 4px 0 ${color}cc,
          0 5px 0 ${color}bb,
          0 6px 0 ${color}aa,
          0 7px 0 ${color}99,
          0 8px 0 ${color}77,
          0 10px 15px rgba(0, 0, 0, 0.8),
          0 0 25px ${item.glowColor}
        `;
      };

      return (
        <div style={bb}>
          <motion.div
            initial={{ rotate: -item.startAngle }}
            animate={{ rotate: -item.startAngle - 360 }}
            transition={{ repeat: Infinity, duration: item.speed, ease: "linear" }}
            className="relative w-[92px] h-[92px] flex items-center justify-center select-none cursor-pointer group"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Planet 3D Sphere - Crystal Glassmorphism style with borderless glowing aura */}
            <div
              className="absolute inset-0 rounded-full transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_70px_var(--glow)]"
              style={{
                '--glow': item.glowColor,
                background: `radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 46, 147, 0.1) 75%, rgba(255, 46, 147, 0.3) 100%)`,
                boxShadow: `0 0 30px ${item.glowColor}, inset 0 0 25px rgba(255, 255, 255, 0.25), inset -12px -12px 24px rgba(0,0,0,0.5)`,
                transform: 'translateZ(0px)',
              }}
            />
            
            {/* Specular highlight (kilauan planet) */}
            <div 
              className="absolute top-3 left-4 w-7 h-6 bg-white/45 rounded-full blur-[4px] rotate-[-20deg]" 
              style={{ transform: 'translateZ(15px)' }}
            />
            
            {/* Letter text - Massive, clear, 3D extruded and floating in front! */}
            <div 
              className="relative z-10 font-sans font-black text-5xl text-white select-none tracking-normal"
              style={{
                transform: 'translateZ(30px)', // Physical 3D floating depth!
                textShadow: get3DShadow(item.planetColor),
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))',
              }}
            >
              {item.content}
            </div>
          </motion.div>
        </div>
      );
    }
    if (item.type === "bouquet") {
      return (
        <div className="w-full h-full flex items-center justify-center" style={bb}>
          <motion.div initial={{ rotate: -item.startAngle }} animate={{ rotate: -item.startAngle - 360 }}
            transition={{ repeat: Infinity, duration: item.speed, ease: "linear" }}>
            <img src="/bouquet.png" alt="Buket Bunga" className="w-[80px] h-auto filter drop-shadow-[0_8px_20px_rgba(0,0,0,0.35)]" />
          </motion.div>
        </div>
      );
    }
    if (item.type === "card") {
      return (
        <div className="w-full h-full flex items-center justify-center" style={bb}>
          <motion.div initial={{ rotate: -item.startAngle }} animate={{ rotate: -item.startAngle - 360 }}
            transition={{ repeat: Infinity, duration: item.speed, ease: "linear" }}
            className="bg-white p-1 rounded-xl shadow-[0_8px_20px_rgba(0,0,0,0.3)] border border-[#e8e6df]">
            <img src="/card_flower.png" alt="Kartu Bunga" className="w-[60px] h-auto rounded-lg" />
          </motion.div>
        </div>
      );
    }
    if (item.type === "heart-sm") {
      return (
        <div className="w-full h-full flex items-center justify-center" style={bb}>
          <motion.div initial={{ rotate: -item.startAngle }} animate={{ rotate: -item.startAngle - 360 }}
            transition={{ repeat: Infinity, duration: item.speed, ease: "linear" }} className="text-[#FF2E93]">
            <Heart size={40} fill="currentColor" className="filter drop-shadow-[0_4px_15px_rgba(255,46,147,0.5)]" />
          </motion.div>
        </div>
      );
    }
    return null;
  };

  const getSize = (item) => {
    if (item.type === "letter") return 92;
    if (item.type === "bouquet") return 90;
    if (item.type === "card") return 80;
    if (item.type === "heart-sm") return 50;
    return 56;
  };

  const renderOrbitRing = (items, isVertical) => items.map((item, i) => {
    const half = getSize(item) / 2;
    return (
      <motion.div key={i}
        className="absolute flex items-center justify-center"
        style={{ width: item.radius * 2, height: item.radius * 2, transformStyle: 'preserve-3d' }}
        initial={{ rotate: item.startAngle }}
        animate={{ rotate: item.startAngle + 360 }}
        transition={{ repeat: Infinity, duration: item.speed, ease: "linear" }}
      >
        <motion.div
          className="absolute select-none pointer-events-auto cursor-pointer interactive-el"
          style={{ top: 0, left: item.radius - half, width: getSize(item), height: getSize(item), transformStyle: 'preserve-3d' }}
          whileHover={{ scale: 1.25 }}
        >
          {renderContent(item, isVertical)}
        </motion.div>
      </motion.div>
    );
  });

  return (
    <div onClick={handleBgClick} className="relative w-screen h-screen bg-gradient-to-b from-[#120008] via-[#0d0005] to-[#080003] text-white overflow-hidden flex flex-col items-center justify-center select-none">

      {/* 1. Parallax Starfield */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {stars.map((s) => (
          <div key={s.id} className="absolute bg-white/50 rounded-full" style={{
            left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size,
            boxShadow: s.size === 3 ? '0 0 10px rgba(255,255,255,0.6)' : 'none',
            transform: `translate(${mouseOffset.x * -30 * s.zParallax}px, ${mouseOffset.y * -30 * s.zParallax}px)`,
            opacity: s.opacity,
          }} />
        ))}
      </div>

      {/* 2. Floating Background Hearts (Banyak Love Melayang) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {floatingHearts.map((h) => (
          <motion.svg
            key={h.id}
            viewBox="0 0 24 24"
            className="absolute"
            style={{
              bottom: '-30px',
              left: `${h.x}%`,
              width: h.size,
              height: h.size,
              fill: h.color,
              opacity: h.opacity,
              filter: 'drop-shadow(0 0 6px rgba(255, 46, 147, 0.45))',
            }}
            initial={{ y: 0, x: 0, rotate: 0 }}
            animate={{
              y: '-110vh',
              x: [0, Math.sin(h.x) * 25, Math.cos(h.x) * 25, 0],
              rotate: [0, 30, -30, 0],
            }}
            transition={{
              duration: h.duration,
              delay: h.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <path d={HEART_PATH} />
          </motion.svg>
        ))}
      </div>

      {/* 3. Ambient Nebula (Pink) */}
      <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[600px] h-[600px] bg-[#FF2E93]/5 rounded-full blur-[150px] pointer-events-none z-0"
        style={{ transform: `translate(${mouseOffset.x * -20}px, ${mouseOffset.y * -20}px)` }} />
      <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute w-[450px] h-[450px] bg-[#D946EF]/5 rounded-full blur-[130px] pointer-events-none z-0"
        style={{ transform: `translate(${mouseOffset.x * 15}px, ${mouseOffset.y * 15}px)` }} />



      {/* ============================================ */}
      {/* 5. DUAL-RING 3D GALAXY                       */}
      {/* ============================================ */}
      <div className="relative flex items-center justify-center z-10 scale-[0.52] sm:scale-75 md:scale-90 lg:scale-100 transition-all duration-300" style={{ perspective: '1600px' }}>
        <div
          className="relative flex items-center justify-center w-[620px] h-[620px] transition-transform duration-[200ms] ease-out"
          style={{ transform: `rotateX(${camTiltX}deg) rotateY(${camTiltY}deg)`, transformStyle: 'preserve-3d' }}
        >

          {/* RING 1: HORIZONTAL */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ transformStyle: 'preserve-3d', transform: 'rotateX(60deg)' }}>
            <div className="absolute border-2 border-dashed border-[#FF2E93]/15 rounded-full" style={{ width: 480, height: 480 }} />
            <div className="absolute border border-dashed border-[#FF758F]/10 rounded-full" style={{ width: 660, height: 660 }} />
            {renderOrbitRing(horizontalOrbit, false)}

            {/* Tiny cosmic hearts in horizontal space orbit */}
            {heartsBelt.filter(h => !h.isVertical).map((h) => {
              const size = 18 * h.scale;
              return (
                <motion.div key={h.id}
                  className="absolute flex items-center justify-center pointer-events-auto"
                  style={{ width: h.radius * 2, height: h.radius * 2, transformStyle: 'preserve-3d' }}
                  initial={{ rotate: h.startAngle }}
                  animate={{ rotate: h.startAngle + 360 }}
                  transition={{ repeat: Infinity, duration: h.speed, ease: "linear" }}
                >
                  <div
                    className="absolute pointer-events-none"
                    style={{ top: 0, left: h.radius - size / 2, width: size, height: size, ...billboardStyle }}
                  >
                    <Heart size={size} fill={h.color} className="text-transparent filter drop-shadow-[0_0_8px_rgba(255,46,147,0.6)] animate-pulse" style={{ opacity: h.opacity }} />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* RING 2: VERTICAL */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ transformStyle: 'preserve-3d', transform: 'rotateY(75deg) rotateZ(15deg)' }}>
            <div className="absolute border-2 border-dashed border-[#EC4899]/12 rounded-full" style={{ width: 480, height: 480 }} />
            {renderOrbitRing(verticalOrbit, true)}

            {/* Tiny cosmic hearts in vertical space orbit */}
            {heartsBelt.filter(h => h.isVertical).map((h) => {
              const size = 18 * h.scale;
              return (
                <motion.div key={h.id}
                  className="absolute flex items-center justify-center pointer-events-auto"
                  style={{ width: h.radius * 2, height: h.radius * 2, transformStyle: 'preserve-3d' }}
                  initial={{ rotate: h.startAngle }}
                  animate={{ rotate: h.startAngle + 360 }}
                  transition={{ repeat: Infinity, duration: h.speed, ease: "linear" }}
                >
                  <div
                    className="absolute pointer-events-none"
                    style={{ top: 0, left: h.radius - size / 2, width: size, height: size, ...billboardVertStyle }}
                  >
                    <Heart size={size} fill={h.color} className="text-transparent filter drop-shadow-[0_0_8px_rgba(255,46,147,0.6)] animate-pulse" style={{ opacity: h.opacity }} />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* CENTRAL 3D HEART */}
          <div className="absolute flex items-center justify-center z-30 pointer-events-auto"
            style={{ transform: `translateZ(10px) rotateY(${-camTiltY}deg) rotateX(${-camTiltX}deg)`, transformStyle: 'preserve-3d' }}>
            
            <div className="absolute w-72 h-72 rounded-full bg-[#FF2E93]/12 filter blur-3xl animate-pulse pointer-events-none" />

            {/* Gold 3D Frame */}
            <div className="absolute" style={{ transform: 'translateZ(-25px)' }}>
              <Heart size={260} fill="none" stroke="#FF758F" strokeWidth={3} className="opacity-15 filter blur-[2px]" />
            </div>
            <div className="absolute" style={{ transform: 'translateZ(-15px)' }}>
              <Heart size={255} fill="none" stroke="#FF758F" strokeWidth={2.5} className="opacity-20" />
            </div>
            <div className="absolute" style={{ transform: 'translateZ(-8px)' }}>
              <Heart size={250} fill="none" stroke="#FF2E93" strokeWidth={4}
                className="opacity-50 filter drop-shadow-[0_0_15px_rgba(255,46,147,0.4)]" />
            </div>

            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
              className="relative flex items-center justify-center" style={{ transformStyle: 'preserve-3d', width: 220, height: 220 }}
            >
              <div className="absolute" style={{ transform: 'translateZ(-5px)' }}>
                <Heart size={220} fill="#aa2050" className="text-[#aa2050] opacity-70" />
              </div>
              <Heart size={220} fill="currentColor"
                className="text-[#FF2E93] filter drop-shadow-[0_20px_50px_rgba(255,46,147,0.5)] relative"
                style={{ transform: 'translateZ(5px)' }} />
              <div className="absolute top-8 left-12 w-14 h-18 bg-white/25 rounded-full blur-md rotate-[-30deg] pointer-events-none"
                style={{ transform: 'translateZ(10px)' }} />
              <div className="absolute top-6 left-10" style={{ transform: 'translateZ(8px)' }}>
                <Heart size={80} fill="white" className="text-white opacity-[0.08] filter blur-[1px]" />
              </div>

              {/* Glowing text group "for you" & "kinyya" tucked inside the heart, floating at translateZ(18px) with dynamic 3D depth */}
              <div 
                className="absolute inset-0 flex flex-col items-center justify-center select-none pointer-events-none text-center"
                style={{ 
                  transform: 'translateZ(18px)',
                  transformStyle: 'preserve-3d'
                }}
              >
                {/* "for you" - smaller, elegant serif */}
                <div 
                  className="font-serif font-medium italic text-sm md:text-base text-white/90 tracking-widest lowercase"
                  style={{
                    textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 0 10px rgba(255,117,143,0.6)'
                  }}
                >
                  for you
                </div>
                {/* "kinyya" - large, bold, majestic sans-serif */}
                <div 
                  className="font-sans font-black italic text-3xl md:text-4xl text-white tracking-widest uppercase mt-0.5"
                  style={{
                    textShadow: '0 2px 10px rgba(0,0,0,0.85), 0 0 15px rgba(255,117,143,0.9), 0 0 30px rgba(255,46,147,0.7)'
                  }}
                >
                  kinyya
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* 7. Click Sparks */}
      <AnimatePresence>
        {clickSparks.map((sp) => (
          <motion.svg key={sp.id} viewBox="0 0 24 24" className="absolute pointer-events-none z-50"
            style={{ left: 0, top: 0, width: sp.size, height: sp.size, fill: '#FF2E93' }}
            initial={{ x: sp.x - sp.size / 2, y: sp.y - sp.size / 2, scale: 0, opacity: 1 }}
            animate={{ x: sp.x + sp.dx - sp.size / 2, y: sp.y + sp.dy - sp.size / 2, scale: [0, 1.3, 0.5], opacity: 0 }}
            exit={{ opacity: 0 }} transition={{ duration: 0.9, ease: 'easeOut' }}>
            <path d={HEART_PATH} />
          </motion.svg>
        ))}
      </AnimatePresence>

      {/* 8. Bottom hint */}
      <motion.p 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 0.35 }} 
        className="absolute bottom-6 text-[10px] text-[#FF758F]/50 tracking-widest uppercase z-20 pointer-events-none hidden sm:block"
      >
        Klik di mana saja untuk menyebarkan cinta
      </motion.p>
    </div>
  );
}
