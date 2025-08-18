/**
 * 3D Avatar System with Three.js
 * Handles 3D model loading, animations, and lip-sync
 */

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class AvatarSystem {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      modelPath: '/wp-content/themes/youtuneai-theme/assets/models/avatar-default.glb',
      width: 200,
      height: 200,
      ...options,
    };

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.model = null;
    this.mixer = null;
    this.clock = new THREE.Clock();

    this.init();
  }

  async init() {
    this.setupScene();
    await this.loadModel();
    this.animate();
  }

  setupScene() {
    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0b0f14);

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.options.width / this.options.height,
      0.1,
      1000,
    );
    this.camera.position.z = 2;

    // Renderer
    const canvas = this.container.querySelector('canvas') || document.createElement('canvas');
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(this.options.width, this.options.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    if (!this.container.contains(canvas)) {
      this.container.appendChild(canvas);
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    this.scene.add(directionalLight);
  }

  async loadModel() {
    const loader = new GLTFLoader();

    try {
      const gltf = await new Promise((resolve, reject) => {
        loader.load(
          this.options.modelPath,
          resolve,
          (progress) => console.log('Avatar loading:', `${progress.loaded / progress.total * 100}%`),
          reject,
        );
      });

      this.model = gltf.scene;
      this.model.scale.setScalar(1.5);
      this.model.position.y = -1;

      this.scene.add(this.model);

      // Setup animations
      if (gltf.animations && gltf.animations.length > 0) {
        this.mixer = new THREE.AnimationMixer(this.model);

        // Find idle animation or use first animation
        const idleAnimation = gltf.animations.find(anim =>
          anim.name.toLowerCase().includes('idle') ||
          anim.name.toLowerCase().includes('breathing'),
        ) || gltf.animations[0];

        if (idleAnimation) {
          const action = this.mixer.clipAction(idleAnimation);
          action.play();
        }
      }

      console.log('✅ Avatar model loaded successfully');
    } catch (error) {
      console.error('❌ Failed to load avatar model:', error);
      this.createFallbackAvatar();
    }
  }

  createFallbackAvatar() {
    // Create simple geometric avatar as fallback
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshLambertMaterial({ color: 0x6C5CE7 });

    this.model = new THREE.Mesh(geometry, material);
    this.model.position.y = -0.5;

    this.scene.add(this.model);
    console.log('📦 Fallback avatar created');
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();

    // Update animations
    if (this.mixer) {
      this.mixer.update(delta);
    }

    // Gentle rotation
    if (this.model) {
      this.model.rotation.y += 0.005;
    }

    this.renderer.render(this.scene, this.camera);
  }

  // Lip-sync functionality
  playVisemes(visemes) {
    if (!this.model || !visemes || visemes.length === 0) {
      return;
    }

    console.log('🎵 Playing visemes:', visemes);

    visemes.forEach((viseme, _index) => {
      setTimeout(() => {
        this.triggerViseme(viseme.v);
      }, viseme.t * 1000);
    });
  }

  triggerViseme(visemeType) {
    // In a real implementation, this would manipulate blend shapes
    // on the 3D model based on the viseme type
    console.log('👄 Viseme:', visemeType);

    // Simple visual feedback - change material color briefly
    if (this.model && this.model.material) {
      const originalColor = this.model.material.color.getHex();
      this.model.material.color.setHex(0x00D1B2);

      setTimeout(() => {
        this.model.material.color.setHex(originalColor);
      }, 100);
    }
  }

  // Update avatar configuration
  updateConfig(config) {
    console.log('🔧 Updating avatar config:', config);

    if (config.colorway && this.model) {
      // Apply colorway changes
      this.applyColorway(config.colorway);
    }
  }

  applyColorway(colorway) {
    // Apply color changes to model materials
    if (this.model && colorway) {
      this.model.traverse((child) => {
        if (child.isMesh && child.material) {
          // This is a simplified example
          // Real implementation would map specific materials
          if (child.name.includes('skin') && colorway.skin) {
            child.material.color.setStyle(colorway.skin);
          }
        }
      });
    }
  }

  dispose() {
    if (this.renderer) {
      this.renderer.dispose();
    }

    if (this.scene) {
      this.scene.clear();
    }

    console.log('🧹 Avatar system disposed');
  }
}
