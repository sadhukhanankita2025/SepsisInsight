import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, OrbitControls, Html } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, HelpCircle, Shield, Info, ArrowUpRight, Sparkles } from 'lucide-react';
import * as THREE from 'three';

// --- DATA: Brain regions anatomical details and coordinates ---
const brainRegions = [
  {
    id: "frontal",
    name: "Frontal Lobe",
    desc: "Governs critical cognitive functions including decision making, reasoning, long-term planning, and voluntary motor control.",
    pos: [0, 0.45, 0.95],
    cameraPos: [0, 0.6, 4.0],
    labelOffset: { x: -240, y: -60 },
    color: "#4DA6FF"
  },
  {
    id: "parietal",
    name: "Parietal Lobe",
    desc: "Processes vital sensory inputs including touch, pressure, temperature, and coordinates spatial awareness and body orientation.",
    pos: [0, 0.8, -0.4],
    cameraPos: [0, 3.2, 2.0],
    labelOffset: { x: 200, y: -100 },
    color: "#8A7CFF"
  },
  {
    id: "temporal",
    name: "Temporal Lobe",
    desc: "Coordinates language comprehension, auditory processing, auditory memory, and houses structures for emotional response.",
    pos: [0.9, -0.1, 0.25],
    cameraPos: [4.2, 0, 1.8],
    labelOffset: { x: 220, y: 10 },
    color: "#FF4D9D"
  },
  {
    id: "occipital",
    name: "Occipital Lobe",
    desc: "Houses the primary visual cortex, decoding incoming sensory inputs from eyes into color, shape, size, and depth information.",
    pos: [0, 0.15, -1.0],
    cameraPos: [0, 0.4, -4.2],
    labelOffset: { x: -240, y: 40 },
    color: "#34D399"
  },
  {
    id: "cerebellum",
    name: "Cerebellum",
    desc: "Regulates motor coordination, posture, fine muscle movements, balance, and procedural learning profiles.",
    pos: [0, -0.6, -0.75],
    cameraPos: [2.5, -1.6, -3.2],
    labelOffset: { x: 210, y: 80 },
    color: "#FB923C"
  },
  {
    id: "brainstem",
    name: "Brain Stem",
    desc: "Connects cerebrum to spinal cord, modulating autonomic cardiovascular actions, respiratory rates, and reflex control.",
    pos: [0, -0.9, -0.15],
    cameraPos: [0, -2.5, 3.8],
    labelOffset: { x: -220, y: 110 },
    color: "#F472B6"
  },
  {
    id: "hippocampus",
    name: "Hippocampus",
    desc: "Fuses temporary cognitive experiences into solid long-term memory configurations and enables spatial navigation mapping.",
    pos: [0.35, -0.2, 0.05],
    cameraPos: [2.5, 1.0, 3.0],
    labelOffset: { x: -240, y: -10 },
    color: "#2DD4BF"
  },
  {
    id: "cerebrum",
    name: "Cerebrum",
    desc: "The massive outer hemisphere regulating conscious thought processes, intelligence patterns, logic, and voluntary operations.",
    pos: [-0.65, 0.55, 0.35],
    cameraPos: [-3.8, 2.2, 2.2],
    labelOffset: { x: -240, y: -110 },
    color: "#A78BFA"
  },
  {
    id: "medulla",
    name: "Medulla",
    desc: "Lowest portion of the brainstem managing reflex actions, swallowing, sneezing, vaso-constriction, and respiratory rhythms.",
    pos: [0, -1.25, -0.25],
    cameraPos: [-2.0, -3.0, 3.2],
    labelOffset: { x: 200, y: 150 },
    color: "#F87171"
  }
];

// --- 3D PARTICLE SYSTEM: Floating medical nodes ---
function BackgroundParticles() {
  const pointsRef = useRef();
  const count = 70;

  const positions = React.useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.03;
      pointsRef.current.rotation.x = state.clock.getElapsedTime() * 0.01;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#8A7CFF"
        transparent
        opacity={0.35}
        depthWrite={false}
      />
    </points>
  );
}

// --- CAMERA CONTROLLER: Handles smooth camera transition to regions ---
function CameraController({ activeRegion, isInteracting, controlsRef }) {
  const { camera } = useThree();
  const defaultPos = React.useMemo(() => new THREE.Vector3(0, 1.2, 5.5), []);
  const targetPosRef = useRef(defaultPos.clone());
  const lookAtRef = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    if (activeRegion) {
      const region = brainRegions.find(r => r.id === activeRegion);
      if (region) {
        targetPosRef.current.set(...region.cameraPos);
      }
    } else {
      targetPosRef.current.copy(defaultPos);
    }
  }, [activeRegion, defaultPos]);

  useFrame(() => {
    if (isInteracting) return; // Yield complete control to OrbitControls user interaction

    // Smoothly lerp camera position
    camera.position.lerp(targetPosRef.current, 0.06);

    // Sync camera focus looking at the center
    const origin = new THREE.Vector3(0, 0, 0);
    lookAtRef.current.lerp(origin, 0.06);
    camera.lookAt(lookAtRef.current);

    if (controlsRef.current) {
      controlsRef.current.target.lerp(origin, 0.06);
      controlsRef.current.update();
    }
  });

  return null;
}

// --- 3D BRAIN MODEL: Handles textures, lighting reflection, and rotations ---
function BrainModel({ activeRegion, isInteracting }) {
  const { scene } = useGLTF('/brain.glb');
  const groupRef = useRef();

  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;

          // Override texture map with realistic flesh/anatomical shader properties
          child.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color('#f0a599'), // Realistic soft peach/pink flesh color
            roughness: 0.75,
            metalness: 0.08,
            bumpScale: 0.05,
            flatShading: false,
            emissive: new THREE.Color('#2d1212'), // Subtle internal warm tissue glow
            emissiveIntensity: 0.15,
          });
        }
      });
    }
  }, [scene]);

  // Handle gentle idle float and slow rotation
  useFrame((state) => {
    if (!groupRef.current) return;

    if (activeRegion) {
      // Smoothly align model orientation back to front view so camera coordinates align perfectly
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0, 0.06);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0, 0.06);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 0, 0.06);
    } else if (!isInteracting) {
      // Float idle animation
      const t = state.clock.getElapsedTime();
      groupRef.current.rotation.y = t * 0.1;
      groupRef.current.position.y = Math.sin(t * 1.1) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} scale={2.4} position={[0, 0, 0]} />
    </group>
  );
}

// --- MAIN ANATOMY COMPONENT ---
export default function BrainAnatomy3D() {
  const [activeRegion, setActiveRegion] = useState(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const controlsRef = useRef();

  // Clear interaction flag on mouse release
  const handleInteractionStart = () => setIsInteracting(true);
  const handleInteractionEnd = () => setIsInteracting(false);

  return (
    <section className="relative min-h-screen py-24 flex flex-col justify-center items-center overflow-hidden bg-dark-bg select-none">
      
      {/* Immersive radial background glows */}
      <div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] w-[600px] h-[600px] bg-gradient-to-r from-neon-blue/5 via-soft-purple/5 to-neon-pink/5 rounded-full blur-[160px] pointer-events-none -z-10 animate-pulse" />
      <div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] w-[350px] h-[350px] bg-[#071426] border border-white/5 rounded-full blur-[80px] pointer-events-none -z-20" />

      {/* Header Info */}
      <div className="text-center max-w-3xl mx-auto px-6 mb-16 space-y-4 relative z-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neon-blue/10 border border-neon-blue/20 text-neon-blue text-xs font-bold uppercase tracking-wider">
          <Brain className="w-3.5 h-3.5" /> Functional Mapping
        </div>
        <h2 className="text-4xl lg:text-5xl font-extrabold font-outfit text-white-text leading-tight">
          Anatomy of Cognitive Longevity
        </h2>
        <p className="text-sec-text text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Hover or click regions below to map key anatomical sectors, trigger smooth diagnostic targeting, and view clinical functionality mappings.
        </p>
      </div>

      {/* Canvas Area Container */}
      <div className="w-full max-w-6xl h-[650px] relative px-6 z-10 flex justify-center items-center">
        
        {/* Helper Instructions tag */}
        <div className="absolute bottom-2 left-6 z-20 pointer-events-none bg-white/5 border border-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] text-sec-text/80 font-mono flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-neon-blue" />
          <span>Drag left/right to rotate 360° | Right-drag to pan | Click labels to study</span>
        </div>

        {/* 3D Canvas */}
        <div className="w-full h-full rounded-3xl border border-white/5 bg-[#071426]/20 backdrop-blur-sm relative overflow-hidden">
          <Canvas
            shadows
            camera={{ position: [0, 1.2, 5.5], fof: 45 }}
            className="w-full h-full cursor-grab active:cursor-grabbing"
          >
            <ambientLight intensity={1.5} />
            
            {/* Soft pink directional keylight for organic flesh depth */}
            <directionalLight 
              position={[5, 8, 5]} 
              intensity={2.2} 
              color="#ffe4e1" 
              castShadow 
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
            />
            
            {/* Cool neon blue backlight to anchor shape boundaries */}
            <pointLight position={[-6, -4, -6]} intensity={1.5} color="#4DA6FF" />
            <pointLight position={[6, -2, 6]} intensity={1.0} color="#FF4D9D" />

            <Suspense fallback={null}>
              <BrainModel activeRegion={activeRegion} isInteracting={isInteracting} />
              
              {/* Background space particles */}
              <BackgroundParticles />

              {/* R3F HTML coordinates projector */}
              {brainRegions.map((region) => {
                const isActive = activeRegion === region.id;
                return (
                  <group key={region.id} position={region.pos}>
                    
                    {/* Hotspot indicator sphere */}
                    <mesh>
                      <sphereGeometry args={[0.045, 16, 16]} />
                      <meshBasicMaterial 
                        color={isActive ? "#FF4D9D" : "#8A7CFF"} 
                        transparent
                        opacity={isActive ? 1.0 : 0.8}
                      />
                    </mesh>

                    {/* Billboarded HTML nodes */}
                    <Html
                      distanceFactor={6}
                      center
                      zIndexRange={[10, 100]}
                      className="pointer-events-none"
                    >
                      <div className="relative w-1 h-1 flex items-center justify-center pointer-events-auto">
                        
                        {/* Connecting Line from center (0,0) to offset coordinate */}
                        <svg 
                          className="absolute overflow-visible pointer-events-none" 
                          style={{ left: 0, top: 0, width: 1, height: 1 }}
                        >
                          <line
                            x1={0}
                            y1={0}
                            x2={region.labelOffset.x}
                            y2={region.labelOffset.y}
                            stroke={isActive ? region.color : "rgba(255, 255, 255, 0.15)"}
                            strokeWidth={isActive ? 2 : 1}
                            strokeDasharray={isActive ? "none" : "3 3"}
                            className="transition-all duration-300"
                          />
                          <circle
                            cx={0}
                            cy={0}
                            r={isActive ? 6 : 4}
                            fill={isActive ? "#FF4D9D" : region.color}
                            className="transition-all duration-300 animate-pulse"
                          />
                        </svg>

                        {/* Label Pill Container */}
                        <button
                          onClick={() => setActiveRegion(isActive ? null : region.id)}
                          onMouseEnter={() => setActiveRegion(region.id)}
                          onMouseLeave={() => setActiveRegion(null)}
                          style={{
                            transform: `translate(${region.labelOffset.x}px, ${region.labelOffset.y}px)`,
                            position: 'absolute',
                            borderColor: isActive ? region.color : 'rgba(255,255,255,0.1)',
                            boxShadow: isActive ? `0 0 20px ${region.color}33` : 'none',
                          }}
                          className={`px-4 py-2 rounded-full border text-xs font-bold font-outfit whitespace-nowrap transition-all duration-300 shadow-lg select-none flex items-center gap-1.5 backdrop-blur-md cursor-pointer ${
                            isActive
                              ? 'bg-[#071426]/90 text-white-text'
                              : 'bg-[#0B1020]/75 text-sec-text hover:text-white-text hover:bg-[#071426]/80'
                          }`}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: isActive ? '#FF4D9D' : region.color }}
                          />
                          {region.name}
                          <ArrowUpRight className={`w-3 h-3 opacity-60 transition-transform ${isActive ? 'translate-x-0.5 -translate-y-0.5' : ''}`} />
                        </button>

                        {/* Tooltip Card Overlay (renders below label pill) */}
                        <AnimatePresence>
                          {isActive && (
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.95 }}
                              transition={{ duration: 0.2 }}
                              style={{
                                transform: `translate(${region.labelOffset.x}px, ${region.labelOffset.y + 40}px)`,
                                position: 'absolute',
                                width: '220px'
                              }}
                              className="glass-panel p-4 border border-white/10 text-left space-y-1.5 shadow-[0_15px_30px_rgba(0,0,0,0.5)] z-50 pointer-events-none"
                            >
                              <div className="flex items-center gap-1.5 text-white-text font-extrabold font-outfit text-xs">
                                <Sparkles className="w-3.5 h-3.5" style={{ color: region.color }} />
                                <span>{region.name}</span>
                              </div>
                              <p className="text-[10px] text-sec-text leading-relaxed font-medium">
                                {region.desc}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>

                      </div>
                    </Html>

                  </group>
                );
              })}

            </Suspense>

            <OrbitControls
              ref={controlsRef}
              enableZoom={false}
              enablePan={true}
              enableRotate={true}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI * 3 / 4}
              onStart={handleInteractionStart}
              onEnd={handleInteractionEnd}
              makeDefault
            />

            <CameraController 
              activeRegion={activeRegion} 
              isInteracting={isInteracting} 
              controlsRef={controlsRef} 
            />
          </Canvas>
        </div>

      </div>

    </section>
  );
}
