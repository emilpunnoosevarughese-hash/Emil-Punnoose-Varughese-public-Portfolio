import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js';

export class PlayerController {
    constructor(world, ui, levelManager) {
        this.world = world;
        this.ui = ui;
        this.levelManager = levelManager;
        
        this.speed = 8;
        this.velocity = new THREE.Vector3();
        this.keys = { w: false, a: false, s: false, d: false, e: false };
        
        this.nearbyLandmark = null;
        
        this.initModel();
        this.bindEvents();
    }
    
    initModel() {
        this.group = new THREE.Group();
        this.group.position.set(-80, 0, 0); // Start at level 1 path
        
        const matShirt = new THREE.MeshStandardMaterial({ color: 0x0f766e, roughness: 0.7 }); // teal
        const matPants = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 }); // brown
        const matSkin = new THREE.MeshStandardMaterial({ color: 0xfcb69f, roughness: 0.5 });
        const matPack = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.6 }); // orange
        const matEye = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.2 });

        // Container to hold the character parts so they rotate together
        this.characterRig = new THREE.Group();
        this.group.add(this.characterRig);

        // Head
        this.head = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.6, 0.7), matSkin);
        this.head.position.set(0, 1.4, 0);
        this.head.castShadow = true;
        this.characterRig.add(this.head);
        
        // Eyes
        const eyeGeo = new THREE.BoxGeometry(0.1, 0.1, 0.1);
        const eyeL = new THREE.Mesh(eyeGeo, matEye);
        eyeL.position.set(0.2, 0.1, 0.36);
        this.head.add(eyeL);
        const eyeR = new THREE.Mesh(eyeGeo, matEye);
        eyeR.position.set(-0.2, 0.1, 0.36);
        this.head.add(eyeR);

        // Body
        this.body = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.7, 0.4), matShirt);
        this.body.position.set(0, 0.75, 0);
        this.body.castShadow = true;
        this.characterRig.add(this.body);
        
        // Backpack
        const pack = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.5, 0.3), matPack);
        pack.position.set(0, 0, -0.3); // relative to body
        pack.castShadow = true;
        this.body.add(pack);
        
        // Legs
        this.legL = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.4, 0.22), matPants);
        this.legL.position.set(0.15, 0.2, 0);
        this.legL.castShadow = true;
        this.characterRig.add(this.legL);
        
        this.legR = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.4, 0.22), matPants);
        this.legR.position.set(-0.15, 0.2, 0);
        this.legR.castShadow = true;
        this.characterRig.add(this.legR);
        
        this.world.scene.add(this.group);
        
        // Initial Camera setup
        this.world.camera.position.set(-80, 8, 12);
        this.world.camera.lookAt(this.group.position);
    }
    
    bindEvents() {
        window.addEventListener('keydown', (e) => this.onKey(e.key.toLowerCase(), true));
        window.addEventListener('keyup', (e) => this.onKey(e.key.toLowerCase(), false));
    }
    
    onKey(key, isDown) {
        // Map arrow keys to WASD
        if (key === 'arrowup') key = 'w';
        if (key === 'arrowdown') key = 's';
        if (key === 'arrowleft') key = 'a';
        if (key === 'arrowright') key = 'd';
        
        if (this.keys.hasOwnProperty(key)) {
            this.keys[key] = isDown;
        }
        
        if (key === 'e' && isDown && this.nearbyLandmark && !this.levelManager.isPlaying) {
            this.levelManager.startLevel(this.nearbyLandmark.userData.level);
        }
    }
    
    update(dt, time) {
        if (this.levelManager.isPlaying) return;

        // Movement relative to world coordinates
        this.velocity.set(0, 0, 0);
        if (this.keys.w) this.velocity.z -= 1;
        if (this.keys.s) this.velocity.z += 1;
        if (this.keys.a) this.velocity.x -= 1;
        if (this.keys.d) this.velocity.x += 1;
        
        if (this.velocity.lengthSq() > 0) {
            this.velocity.normalize();
            
            // Rotation - face direction of movement
            const targetAngle = Math.atan2(this.velocity.x, this.velocity.z);
            let diff = targetAngle - this.characterRig.rotation.y;
            while (diff < -Math.PI) diff += Math.PI * 2;
            while (diff > Math.PI) diff -= Math.PI * 2;
            this.characterRig.rotation.y += diff * 12 * dt;
            
            // Position update
            this.group.position.addScaledVector(this.velocity, this.speed * dt);
            
            // Walk Animation (sine wave driven)
            this.legL.position.z = Math.sin(time * 15) * 0.25;
            this.legR.position.z = -Math.sin(time * 15) * 0.25;
            this.legL.position.y = 0.2 + Math.max(0, -Math.sin(time * 15) * 0.1);
            this.legR.position.y = 0.2 + Math.max(0, Math.sin(time * 15) * 0.1);
            
            // Body bounce
            const bounce = Math.abs(Math.sin(time * 15)) * 0.08;
            this.body.position.y = 0.75 + bounce;
            this.head.position.y = 1.4 + bounce;
        } else {
            // Idle Animation
            this.legL.position.z = 0;
            this.legL.position.y = 0.2;
            this.legR.position.z = 0;
            this.legR.position.y = 0.2;
            
            // Soft breathing bounce
            const breathe = Math.sin(time * 2.5) * 0.03;
            this.body.position.y = 0.75 + breathe;
            this.head.position.y = 1.4 + breathe;
        }
        
        // Camera Follow (smooth trailing camera)
        const camOffset = new THREE.Vector3(0, 8, 12);
        const targetCamPos = this.group.position.clone().add(camOffset);
        this.world.camera.position.lerp(targetCamPos, 3 * dt);
        
        const lookTarget = this.group.position.clone().add(new THREE.Vector3(0, 1, 0));
        this.world.camera.lookAt(lookTarget);
        
        this.checkProximity();
    }
    
    checkProximity() {
        let closest = null;
        let minDist = 3.5; // Interaction radius
        
        for (const lm of this.world.landmarks) {
            const dist = this.group.position.distanceTo(lm.position);
            if (dist < minDist) {
                minDist = dist;
                closest = lm;
            }
        }
        
        if (closest !== this.nearbyLandmark) {
            this.nearbyLandmark = closest;
            if (closest) {
                this.ui.showInteractionCard(closest.userData.level);
            } else {
                this.ui.hideInteractionCard();
            }
        }
    }
}
