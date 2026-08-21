import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js';
import { WORLDS } from '../data/Worlds.js';

export class WorldManager {
    constructor(canvasId, worldId = 1) {
        this.canvas = document.getElementById(canvasId);
        this.worldId = worldId;
        this.biome = WORLDS[this.worldId].biome;
        this.landmarks = [];
        this.init();
    }

    init() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(this.biome.sky3D);
        this.scene.fog = new THREE.FogExp2(this.biome.sky3D, this.biome.fogDensity);

        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        
        // Renderer
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: false });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        // Make colors pop more
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.1;

        // Lighting
        const hemiLight = new THREE.HemisphereLight(0xffffff, this.biome.ambient3D, 0.8);
        hemiLight.position.set(0, 50, 0);
        this.scene.add(hemiLight);

        const dirLight = new THREE.DirectionalLight(this.biome.sun3D, 1.2);
        dirLight.position.set(-20, 40, 20);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 2048;
        dirLight.shadow.mapSize.height = 2048;
        dirLight.shadow.camera.near = 0.5;
        dirLight.shadow.camera.far = 150;
        dirLight.shadow.camera.left = -50;
        dirLight.shadow.camera.right = 50;
        dirLight.shadow.camera.top = 50;
        dirLight.shadow.camera.bottom = -50;
        dirLight.shadow.bias = -0.001;
        this.scene.add(dirLight);

        this.buildTerrain();
        this.buildParticles();
        
        window.addEventListener('resize', this.onWindowResize.bind(this));
    }
    
    buildTerrain() {
        // Flat Ground
        const groundGeo = new THREE.PlaneGeometry(250, 100, 1, 1);
        const groundMat = new THREE.MeshStandardMaterial({ 
            color: this.biome.ground3D, 
            roughness: 0.9,
            metalness: 0.1
        });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);

        // Path (Stepping stones)
        const stoneGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.1, 6);
        const stoneMat = new THREE.MeshStandardMaterial({ color: this.biome.path3D, roughness: 1.0 });
        
        for(let i=0; i<80; i++) {
            const stone = new THREE.Mesh(stoneGeo, stoneMat);
            stone.position.set(-80 + i * 2, 0.05, Math.sin(i * 0.2) * 1.5);
            stone.rotation.y = Math.random() * Math.PI;
            stone.receiveShadow = true;
            this.scene.add(stone);
        }
        
        // Populate Levels (Landmarks)
        const levels = WORLDS[this.worldId].levels;
        
        this.signMat = new THREE.MeshStandardMaterial({ color: 0x7A4E2D });
        this.baseMat = new THREE.MeshStandardMaterial({ color: 0x9ca3af });
        
        for (let i=0; i<levels.length; i++) {
            // Place landmarks near the path
            const stoneIndex = 5 + (i * 4); // rough approximation along the path
            const x = -80 + (stoneIndex * 2);
            const z = Math.sin(stoneIndex * 0.2) * 1.5 - 3; // offset from path
            
            this.createLandmark(x, z, levels[i]);
            
            // Decorative Trees scattered randomly
            if(i % 2 === 0) {
                this.createTree(x - 5 - Math.random()*5, z - 3 - Math.random()*5);
                this.createTree(x + 5 + Math.random()*5, z + 5 + Math.random()*5);
                this.createTree(x - 2 - Math.random()*8, z + 6 + Math.random()*4);
            }
        }
    }
    
    createLandmark(x, z, levelData) {
        const group = new THREE.Group();
        group.position.set(x, 0, z);
        
        // Stone base
        const baseGeo = new THREE.CylinderGeometry(1.2, 1.5, 0.4, 8);
        const base = new THREE.Mesh(baseGeo, this.baseMat);
        base.position.y = 0.2;
        base.receiveShadow = true;
        base.castShadow = true;
        group.add(base);
        
        // Floating Crystal
        const crystalGeo = new THREE.OctahedronGeometry(0.5);
        const crystalMat = new THREE.MeshStandardMaterial({ 
            color: 0x38bdf8, 
            emissive: 0x0284c7,
            emissiveIntensity: 0.4,
            roughness: 0.1,
            metalness: 0.5
        });
        const crystal = new THREE.Mesh(crystalGeo, crystalMat);
        crystal.position.y = 1.5;
        crystal.castShadow = true;
        group.add(crystal);
        
        // Interaction prompt indicator
        crystal.userData = { isLandmark: true, level: levelData };
        base.userData = { isLandmark: true, level: levelData };
        group.userData = { crystal: crystal, initialY: 1.5 };
        
        this.scene.add(group);
        this.landmarks.push(group);
    }
    
    createTree(x, z) {
        const trunkGeo = new THREE.CylinderGeometry(0.3, 0.4, 2.0);
        const trunk = new THREE.Mesh(trunkGeo, this.signMat);
        trunk.position.set(x, 1.0, z);
        trunk.castShadow = true;
        trunk.receiveShadow = true;
        
        // Layered leaves
        const leavesMat = new THREE.MeshStandardMaterial({ color: this.biome.foliage3D, roughness: 0.8 });
        
        const leaves1 = new THREE.Mesh(new THREE.ConeGeometry(1.8, 2.5, 7), leavesMat);
        leaves1.position.set(x, 2.5, z);
        leaves1.castShadow = true;
        
        const leaves2 = new THREE.Mesh(new THREE.ConeGeometry(1.4, 2.0, 7), leavesMat);
        leaves2.position.set(x, 3.5, z);
        leaves2.castShadow = true;
        
        this.scene.add(trunk);
        this.scene.add(leaves1);
        this.scene.add(leaves2);
    }
    
    buildParticles() {
        // Clouds (only if not dense fog)
        if (this.biome.fogDensity < 0.03) {
            this.clouds = new THREE.Group();
            const cloudGeo = new THREE.DodecahedronGeometry(2);
            const cloudMat = new THREE.MeshStandardMaterial({ 
                color: 0xffffff, 
                roughness: 1.0,
                flatShading: true,
                transparent: true, 
                opacity: 0.8 
            });
            for(let i=0; i<12; i++) {
                const cloud = new THREE.Mesh(cloudGeo, cloudMat);
                cloud.position.set(-100 + Math.random() * 200, 15 + Math.random() * 10, -20 + Math.random() * 30);
                cloud.scale.set(1.5 + Math.random()*2, 0.6, 1 + Math.random());
                cloud.rotation.y = Math.random() * Math.PI;
                this.clouds.add(cloud);
            }
            this.scene.add(this.clouds);
        }

        // Ambient Particles
        const particleCount = 200;
        const geom = new THREE.BufferGeometry();
        const pos = new Float32Array(particleCount * 3);
        this.particlePhases = new Float32Array(particleCount);
        
        for(let i=0; i<particleCount; i++) {
            pos[i*3] = -100 + Math.random() * 200; // x
            pos[i*3+1] = Math.random() * 15;  // y
            pos[i*3+2] = -15 + Math.random() * 30; // z
            this.particlePhases[i] = Math.random() * Math.PI * 2;
        }
        geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        
        let pMat;
        if(this.biome.particles === 'leaves') {
            pMat = new THREE.PointsMaterial({
                color: 0x9F1239,
                size: 0.3,
                transparent: true,
                opacity: 0.9,
                blending: THREE.NormalBlending
            });
        } else {
            pMat = new THREE.PointsMaterial({
                color: 0xfacc15,
                size: 0.15,
                transparent: true,
                opacity: 0.9,
                blending: THREE.AdditiveBlending
            });
        }
        
        this.fireflies = new THREE.Points(geom, pMat);
        this.scene.add(this.fireflies);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    render(time) {
        // Animate crystals floating and spinning
        this.landmarks.forEach((l, i) => {
            const crystal = l.userData.crystal;
            crystal.position.y = l.userData.initialY + Math.sin(time*2 + i) * 0.2;
            crystal.rotation.y += 0.02;
        });
        
        // Animate Clouds
        if(this.clouds) {
            this.clouds.children.forEach((c) => {
                c.position.x += 0.015;
                if (c.position.x > 100) c.position.x = -100;
            });
        }

        // Animate Particles
        if(this.fireflies) {
            const pos = this.fireflies.geometry.attributes.position.array;
            for(let i=0; i<200; i++) {
                if (this.biome.particles === 'leaves') {
                    // Leaves fall down
                    pos[i*3+1] -= 0.02; // falling y
                    pos[i*3] += Math.sin(time + this.particlePhases[i]) * 0.01; // drifting x
                    if(pos[i*3+1] < 0) {
                        pos[i*3+1] = 15;
                    }
                } else {
                    // Fireflies bob
                    pos[i*3+1] += Math.sin(time*0.5 + this.particlePhases[i]) * 0.003; // bobbing y
                    pos[i*3] += Math.cos(time*0.2 + this.particlePhases[i]) * 0.002; // drifting x
                }
            }
            this.fireflies.geometry.attributes.position.needsUpdate = true;
        }
        
        this.renderer.render(this.scene, this.camera);
    }
}
