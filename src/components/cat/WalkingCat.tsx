import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { useStore } from '../../context/StoreContext';

/**
 * Creates a delightful, procedural 3D stylized low-poly cat in Three.js
 * Palette matches Bomato's warm tokens: warm charcoal coat (#2A2421),
 * cream chest/paws (#ECE8E0), brand blue collar (#1A56DB), and golden bell.
 */
function createProceduralCat() {
  const catRoot = new THREE.Group();

  // Materials
  const coatMat = new THREE.MeshStandardMaterial({
    color: 0x2a2421,
    roughness: 0.65,
    metalness: 0.05,
  });
  const creamMat = new THREE.MeshStandardMaterial({
    color: 0xece8e0,
    roughness: 0.75,
    metalness: 0.0,
  });
  const pinkMat = new THREE.MeshStandardMaterial({
    color: 0xe8a095,
    roughness: 0.5,
  });
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x38a169 }); // emerald
  const pupilMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
  const collarMat = new THREE.MeshStandardMaterial({
    color: 0x1a56db, // Bomato brand blue
    roughness: 0.3,
  });
  const bellMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b, // gold bell
    roughness: 0.2,
    metalness: 0.8,
  });

  // Body container (for vertical bobbing)
  const bodyGroup = new THREE.Group();
  bodyGroup.position.set(0, 0.42, 0);
  catRoot.add(bodyGroup);

  // Main Torso
  const torsoGeo = new THREE.BoxGeometry(0.68, 0.36, 0.32);
  const torsoMesh = new THREE.Mesh(torsoGeo, coatMat);
  bodyGroup.add(torsoMesh);

  // Cream chest bib
  const chestGeo = new THREE.BoxGeometry(0.2, 0.26, 0.33);
  const chestMesh = new THREE.Mesh(chestGeo, creamMat);
  chestMesh.position.set(0.24, -0.04, 0);
  bodyGroup.add(chestMesh);

  // Head container (for nodding / looking around)
  const headGroup = new THREE.Group();
  headGroup.position.set(0.38, 0.22, 0);
  bodyGroup.add(headGroup);

  const headGeo = new THREE.BoxGeometry(0.34, 0.3, 0.3);
  const headMesh = new THREE.Mesh(headGeo, coatMat);
  headGroup.add(headMesh);

  // Snout / Muzzle
  const muzzleGeo = new THREE.BoxGeometry(0.14, 0.12, 0.18);
  const muzzleMesh = new THREE.Mesh(muzzleGeo, creamMat);
  muzzleMesh.position.set(0.16, -0.06, 0);
  headGroup.add(muzzleMesh);

  // Pink Nose
  const noseGeo = new THREE.BoxGeometry(0.04, 0.03, 0.05);
  const noseMesh = new THREE.Mesh(noseGeo, pinkMat);
  noseMesh.position.set(0.23, -0.03, 0);
  headGroup.add(noseMesh);

  // Left Eye & Pupil
  const leftEyeMesh = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.06, 0.06), eyeMat);
  leftEyeMesh.position.set(0.15, 0.04, 0.1);
  const leftPupil = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.05, 0.025), pupilMat);
  leftPupil.position.set(0.155, 0.04, 0.1);
  headGroup.add(leftEyeMesh);
  headGroup.add(leftPupil);

  // Right Eye & Pupil
  const rightEyeMesh = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.06, 0.06), eyeMat);
  rightEyeMesh.position.set(0.15, 0.04, -0.1);
  const rightPupil = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.05, 0.025), pupilMat);
  rightPupil.position.set(0.155, 0.04, -0.1);
  headGroup.add(rightEyeMesh);
  headGroup.add(rightPupil);

  // Ears
  const earGeo = new THREE.ConeGeometry(0.08, 0.16, 4);
  const innerEarGeo = new THREE.ConeGeometry(0.05, 0.12, 4);

  // Left Ear
  const leftEar = new THREE.Mesh(earGeo, coatMat);
  leftEar.position.set(0.02, 0.22, 0.1);
  leftEar.rotation.z = -0.15;
  const leftInner = new THREE.Mesh(innerEarGeo, pinkMat);
  leftInner.position.set(0.03, 0.21, 0.1);
  leftInner.rotation.z = -0.15;
  headGroup.add(leftEar);
  headGroup.add(leftInner);

  // Right Ear
  const rightEar = new THREE.Mesh(earGeo, coatMat);
  rightEar.position.set(0.02, 0.22, -0.1);
  rightEar.rotation.z = -0.15;
  const rightInner = new THREE.Mesh(innerEarGeo, pinkMat);
  rightInner.position.set(0.03, 0.21, -0.1);
  rightInner.rotation.z = -0.15;
  headGroup.add(rightEar);
  headGroup.add(rightInner);

  // Blue collar with gold bell
  const collarMesh = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.03, 8, 16), collarMat);
  collarMesh.rotation.y = Math.PI / 2;
  collarMesh.position.set(0.3, 0.08, 0);
  bodyGroup.add(collarMesh);

  const bellMesh = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), bellMat);
  bellMesh.position.set(0.44, 0.03, 0);
  bodyGroup.add(bellMesh);

  // Four Legs (joint groups anchored at hip/shoulder for natural pivoting)
  const createLeg = (x: number, z: number) => {
    const legPivot = new THREE.Group();
    legPivot.position.set(x, 0.3, z);

    // Upper Leg
    const legUpper = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.24, 0.11), coatMat);
    legUpper.position.set(0, -0.1, 0);
    legPivot.add(legUpper);

    // Cream sock & paw
    const pawMesh = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.1, 0.14), creamMat);
    pawMesh.position.set(0.02, -0.22, 0);
    legPivot.add(pawMesh);

    catRoot.add(legPivot);
    return legPivot;
  };

  const legFL = createLeg(0.22, 0.13); // Front Left
  const legFR = createLeg(0.22, -0.13); // Front Right
  const legBL = createLeg(-0.22, 0.13); // Back Left
  const legBR = createLeg(-0.22, -0.13); // Back Right

  // Tail: multi-segment group curling up
  const tailGroup = new THREE.Group();
  tailGroup.position.set(-0.32, 0.52, 0);
  catRoot.add(tailGroup);

  const tailSeg1 = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 0.22, 8), coatMat);
  tailSeg1.position.set(-0.08, 0.08, 0);
  tailSeg1.rotation.z = Math.PI / 3.5;
  tailGroup.add(tailSeg1);

  const tailSeg2 = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.035, 0.2, 8), coatMat);
  tailSeg2.position.set(-0.16, 0.22, 0);
  tailSeg2.rotation.z = Math.PI / 2.5;
  tailGroup.add(tailSeg2);

  // Soft Ellipse Ground Shadow (moves with cat)
  const shadowGeo = new THREE.PlaneGeometry(0.85, 0.4);
  shadowGeo.rotateX(-Math.PI / 2);
  const shadowMat = new THREE.MeshBasicMaterial({
    color: 0x3c2814,
    transparent: true,
    opacity: 0.25,
  });
  const groundShadow = new THREE.Mesh(shadowGeo, shadowMat);
  groundShadow.position.set(0, 0.02, 0);
  catRoot.add(groundShadow);

  // Scale overall model for the 80px high canvas
  catRoot.scale.set(0.85, 0.85, 0.85);

  const updateProceduralAnimation = (time: number, isWalking: boolean) => {
    if (isWalking) {
      const stepFreq = 8.5;
      // 4-beat trot gait
      legFL.rotation.z = Math.sin(time * stepFreq) * 0.48;
      legBR.rotation.z = Math.sin(time * stepFreq) * 0.48;
      legFR.rotation.z = -Math.sin(time * stepFreq) * 0.48;
      legBL.rotation.z = -Math.sin(time * stepFreq) * 0.48;

      // Subtle body bobbing
      bodyGroup.position.y = 0.42 + Math.abs(Math.sin(time * stepFreq * 2)) * 0.03;
      // Head nodding
      headGroup.rotation.z = Math.sin(time * stepFreq) * 0.06;
      headGroup.rotation.y = 0;
      // Tail swaying
      tailGroup.rotation.y = Math.sin(time * 4) * 0.3;
      tailGroup.rotation.z = Math.sin(time * stepFreq) * 0.08;
    } else {
      // Idle / Sitting / Resting
      legFL.rotation.z = 0;
      legFR.rotation.z = 0;
      legBL.rotation.z = 0;
      legBR.rotation.z = 0;

      // Soft breathing
      bodyGroup.position.y = 0.42 + Math.sin(time * 2.5) * 0.015;
      // Look slightly at the camera
      headGroup.rotation.y = Math.sin(time * 1.5) * 0.35;
      headGroup.rotation.z = 0;
      // Tail leisurely swishing
      tailGroup.rotation.y = Math.sin(time * 3) * 0.4;
      tailGroup.rotation.z = Math.sin(time * 1.5) * 0.1;
    }
  };

  return {
    group: catRoot,
    update: updateProceduralAnimation,
  };
}

export const WalkingCat: React.FC = () => {
  const { isCatHidden, activeTab } = useStore();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Check hardware tier and reduced motion
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isLowTierDevice =
    typeof navigator !== 'undefined' &&
    navigator.hardwareConcurrency !== undefined &&
    navigator.hardwareConcurrency < 4;

  const isCheckoutOpen = activeTab === 'checkout';

  useEffect(() => {
    // Hidden while checkout is open, or if user toggled hide, or reduced motion, or low tier device
    if (isCatHidden || prefersReducedMotion || isLowTierDevice || isCheckoutOpen) {
      return;
    }

    let isMounted = true;
    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let animFrameId: number | null = null;
    const clock = new THREE.Clock();

    // Cat motion variables
    let posX = 80;
    let direction = 1; // 1 = walking right, -1 = walking left
    let isIdling = false;
    let idleTimer = 0;
    const catSpeed = 48; // px per second

    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = window.innerWidth;
    const height = 80;

    // 1. Setup Three.js Scene & Renderer
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 100);
    camera.position.set(0, 0.6, 4.5);
    camera.lookAt(0, 0.3, 0);

    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'low-power',
    });

    const maxPr = window.innerWidth < 768 ? 1.5 : 2.0;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPr));
    renderer.setSize(width, height);

    // Warm Ambient & Directional Lighting
    const ambientLight = new THREE.AmbientLight(0xfffbf5, 1.4);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.6);
    dirLight.position.set(3, 5, 4);
    scene.add(dirLight);

    // 2. Instantiate procedural cat immediately so it is actively walking
    const procedural = createProceduralCat();
    let activeCatGroup: THREE.Group = procedural.group;
    let updateAnimation: (time: number, isWalking: boolean) => void = procedural.update;
    scene.add(activeCatGroup);

    // Also check for optional /models/cat.glb if user supplied one
    let gltfMixer: THREE.AnimationMixer | null = null;
    let gltfWalkAction: THREE.AnimationAction | null = null;
    let gltfIdleAction: THREE.AnimationAction | null = null;

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    fetch('/models/cat.glb', { method: 'HEAD' })
      .then((res) => {
        if (!isMounted || !res.ok) return;
        gltfLoader.load(
          '/models/cat.glb',
          (gltf) => {
            if (!isMounted || !scene) return;
            // Switch to gltf cat
            scene.remove(activeCatGroup);
            activeCatGroup = gltf.scene;
            activeCatGroup.scale.set(0.6, 0.6, 0.6);
            scene.add(activeCatGroup);

            if (gltf.animations && gltf.animations.length > 0) {
              gltfMixer = new THREE.AnimationMixer(activeCatGroup);
              const walkClip =
                gltf.animations.find((a) => /walk/i.test(a.name)) || gltf.animations[0];
              const idleClip = gltf.animations.find((a) => /idle/i.test(a.name));

              if (walkClip) {
                gltfWalkAction = gltfMixer.clipAction(walkClip);
                gltfWalkAction.play();
              }
              if (idleClip) {
                gltfIdleAction = gltfMixer.clipAction(idleClip);
              }
              updateAnimation = (_time: number, isWalking: boolean) => {
                if (isWalking) {
                  if (gltfIdleAction) gltfIdleAction.fadeOut(0.3);
                  if (gltfWalkAction) gltfWalkAction.reset().fadeIn(0.3).play();
                } else {
                  if (gltfWalkAction) gltfWalkAction.fadeOut(0.3);
                  if (gltfIdleAction) gltfIdleAction.reset().fadeIn(0.3).play();
                }
              };
            }
          },
          undefined,
          () => {
            // Keep procedural cat
          }
        );
      })
      .catch(() => {
        // Keep procedural cat
      });

    // 3. Animation loop: shared requestAnimationFrame, pauses on tab hidden
    const render = () => {
      if (!isMounted) return;

      if (document.hidden) {
        animFrameId = requestAnimationFrame(render);
        return;
      }

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      if (gltfMixer) {
        gltfMixer.update(delta);
      }

      const screenW = window.innerWidth;
      // Frustum calculation for camera fov=30, distance=4.5
      const frustumHeight = 2 * 4.5 * Math.tan((30 * Math.PI) / 360);
      const aspect = screenW / height;
      const visibleWidth = frustumHeight * aspect;

      if (isIdling) {
        idleTimer -= delta;
        updateAnimation(elapsed, false);
        if (idleTimer <= 0) {
          isIdling = false;
        }
      } else {
        posX += direction * catSpeed * delta;
        updateAnimation(elapsed, true);

        // Turn around at screen bounds
        if (posX > screenW - 60 && direction === 1) {
          direction = -1;
          // Random chance to pause & idle
          if (Math.random() < 0.45) {
            isIdling = true;
            idleTimer = 2.5;
          }
        } else if (posX < 60 && direction === -1) {
          direction = 1;
          if (Math.random() < 0.45) {
            isIdling = true;
            idleTimer = 2.5;
          }
        }
      }

      // Smoothly orient cat in travel direction (Math.PI/2 = right, -Math.PI/2 = left)
      const targetRotationY = direction === 1 ? Math.PI / 2 : -Math.PI / 2;
      activeCatGroup.rotation.y = THREE.MathUtils.lerp(
        activeCatGroup.rotation.y,
        targetRotationY,
        0.12
      );

      // Map posX (pixels) to Three.js world X coordinates
      const worldX = ((posX / (screenW || 1)) - 0.5) * visibleWidth;
      activeCatGroup.position.x = worldX;

      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }

      animFrameId = requestAnimationFrame(render);
    };

    animFrameId = requestAnimationFrame(render);

    const handleResize = () => {
      if (!renderer || !camera) return;
      const newW = window.innerWidth;
      camera.aspect = newW / height;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, height);
    };

    window.addEventListener('resize', handleResize);

    // 4. Cleanup on unmount
    return () => {
      isMounted = false;
      window.removeEventListener('resize', handleResize);
      if (animFrameId) cancelAnimationFrame(animFrameId);

      dracoLoader.dispose();

      if (scene) {
        scene.traverse((obj) => {
          if ((obj as THREE.Mesh).isMesh) {
            const mesh = obj as THREE.Mesh;
            mesh.geometry?.dispose();
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach((mat) => mat.dispose());
            } else {
              mesh.material?.dispose();
            }
          }
        });
      }

      if (renderer) {
        renderer.dispose();
      }
    };
  }, [isCatHidden, prefersReducedMotion, isLowTierDevice, isCheckoutOpen]);

  // If user hid the cat, checkout is open, or reduced motion, render nothing
  if (isCatHidden || prefersReducedMotion || isLowTierDevice || isCheckoutOpen) {
    return null;
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 h-[80px] pointer-events-none z-30 overflow-hidden"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="w-full h-full block bg-transparent" />
    </div>
  );
};

export default WalkingCat;
