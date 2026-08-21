import { save, saveGame } from '../data/SaveManager.js';

export class LevelManager {
    constructor(ui) {
        this.ui = ui;
        this.isPlaying = false;
        this.game = null;
        this.currentLevel = null;
        
        this.initPhaser();
    }
    
    initPhaser() {
        const config = {
            type: Phaser.AUTO,
            parent: "phaser-container",
            width: 1200,
            height: 700,
            transparent: true,
            scale: {
                mode: Phaser.Scale.RESIZE,
                autoCenter: Phaser.Scale.CENTER_BOTH
            },
            physics: {
                default: 'arcade',
                arcade: { gravity: { y: 1000 }, debug: false }
            },
            render: { antialias: true, pixelArt: false },
            scene: [BootScene, PlatformerScene]
        };
        
        this.game = new Phaser.Game(config);
        
        // Hide container initially
        document.getElementById("phaser-container").style.display = 'none';
        
        // Expose quitLevel globally so the scene can call it
        window.quitLevel = () => this.quitLevel();
    }
    
    startLevel(levelData) {
        if (this.isPlaying) return;
        this.isPlaying = true;
        this.currentLevel = levelData;
        
        this.ui.hideInteractionCard();
        this.ui.hideMainUI();
        
        // Show phaser container
        const container = document.getElementById("phaser-container");
        container.style.display = 'block';
        container.style.opacity = '0';
        
        // Fade in
        let opacity = 0;
        const fade = setInterval(() => {
            opacity += 0.1;
            container.style.opacity = opacity;
            if (opacity >= 1) clearInterval(fade);
        }, 30);
        
        this.ui.toast("LEVEL READY", `Entering ${levelData.name}...`);
        if (levelData.boss) this.ui.directorMessage("The end.");
        else this.ui.directorMessage("Let's see what you do this time.");
        
        // Stop Boot/Platformer and start fresh
        const sc = this.game.scene.getScene('PlatformerScene');
        if (sc) {
            this.game.scene.stop('PlatformerScene');
            this.game.scene.start('PlatformerScene', { levelData: levelData });
        }
    }
    
    quitLevel() {
        this.isPlaying = false;
        this.game.scene.stop('PlatformerScene');
        
        // Fade out
        const container = document.getElementById("phaser-container");
        let opacity = 1;
        const fade = setInterval(() => {
            opacity -= 0.1;
            container.style.opacity = opacity;
            if (opacity <= 0) {
                clearInterval(fade);
                container.style.display = 'none';
                
                this.ui.showMainUI();
                this.ui.updateProfile();
            }
        }, 30);
    }
}

/* ============================================================
   PHASER SCENES
   ============================================================ */

class BootScene extends Phaser.Scene {
    constructor() { super("BootScene"); }
    preload() {
        const g = this.add.graphics();
        
        // Player texture (match 3D character colors)
        // Body (teal)
        g.fillStyle(0x0f766e,1); g.fillRect(4,10,16,10);
        // Head (beige)
        g.fillStyle(0xfcb69f,1); g.fillRect(6,2,12,8);
        // Eyes
        g.fillStyle(0x111111,1); g.fillRect(8,5,2,2); g.fillRect(14,5,2,2);
        // Legs (brown)
        g.fillStyle(0x78350f,1); g.fillRect(6,20,4,8); g.fillRect(14,20,4,8);
        g.generateTexture('player', 24, 28);
        g.clear();

        // Spike (metallic)
        g.fillStyle(0x9ca3af,1); g.fillTriangle(10,0, 0,20, 20,20);
        g.fillStyle(0x6b7280,1); g.fillTriangle(10,0, 10,20, 20,20);
        g.generateTexture('spike', 20, 20);
        g.clear();

        // Door (Wooden sign or archway)
        g.fillStyle(0x7A4E2D,1); g.fillRect(0,0,40,60);
        g.fillStyle(0x000000,0.5); g.fillRect(5,5,30,50); // dark interior
        g.generateTexture('door', 40, 60);
        g.clear();
    }
    create() {
        // Wait for LevelManager to start PlatformerScene
    }
}

class PlatformerScene extends Phaser.Scene {
    constructor() { super("PlatformerScene"); }

    init(data) {
        this.levelData = data.levelData;
        this.biome = data.biome || { skyHex: '#8FD8FF', grassHex: 0x5FAE5C, dirtHex: 0xB78352 };
        this.dCount = 0;
        this.startTime = Date.now();
        this.isDead = false;
        this.levelComplete = false;
        this.frameData = []; // Ghost recording array
    }

    create() {
        this.cameras.main.setBackgroundColor(this.biome.skyHex);
        this.physics.world.gravity.y = 1000;
        
        const lv = this.levelData;
        this.cameras.main.setBounds(0, 0, lv.width || 800, lv.height || 600);
        this.physics.world.setBounds(0, 0, lv.width || 800, (lv.height || 600) + 200);

        // Decorative background elements (clouds/hills)
        for(let i=0; i<10; i++) {
            const cx = Phaser.Math.Between(0, lv.width || 800);
            const cy = Phaser.Math.Between(0, 300);
            const cw = Phaser.Math.Between(100, 300);
            const cloud = this.add.graphics();
            cloud.fillStyle(0xffffff, 0.4);
            cloud.fillEllipse(cx, cy, cw, cw/3);
            cloud.setScrollFactor(0.2); // parallax
        }

        this.platforms = this.physics.add.staticGroup();
        this.fakeFloors = this.physics.add.staticGroup();
        this.spikes = this.physics.add.group({allowGravity:false, immovable:true});
        this.traps = lv.traps || [];

        if(lv.platforms) {
            lv.platforms.forEach(p => {
                const group = p.fake ? this.fakeFloors : this.platforms;
                
                // Physics body
                const b = group.create(p.x + p.w/2, p.y + p.h/2, 'door').setAlpha(0);
                b.displayWidth = p.w; b.displayHeight = p.h; b.refreshBody();
                b.pData = p;
                
                // Visual terrain
                const g = this.add.graphics();
                // Dirt Body
                g.fillStyle(this.biome.dirtHex, 1); 
                g.fillRect(p.x, p.y + 8, p.w, p.h - 8);
                // Dirt texture overlay
                g.fillStyle(0x000000, 0.2);
                g.fillRect(p.x, p.y + 8, p.w, 4);
                // Grass Top
                g.fillStyle(this.biome.grassHex, 1);
                g.fillRect(p.x, p.y, p.w, 12);
                // Grass highlights
                g.fillStyle(0xffffff, 0.1);
                g.fillRect(p.x, p.y, p.w, 4);
                
                b.graphicsObj = g; // Store reference to fade fake floors
            });
        }

        if(lv.spikes) {
            lv.spikes.forEach(s => {
                const sp = this.spikes.create(s.x+10, s.y+10, 'spike');
                sp.body.setSize(12, 10); sp.body.setOffset(4, 10);
            });
        }

        // Exit door
        this.door = this.physics.add.staticSprite(lv.exit.x, lv.exit.y, 'door');
        
        // Add a floating crystal above the door to signify the exit clearly
        this.exitCrystal = this.add.graphics();
        this.exitCrystal.fillStyle(0x38bdf8, 1);
        this.exitCrystal.fillTriangle(lv.exit.x, lv.exit.y-50, lv.exit.x-10, lv.exit.y-35, lv.exit.x+10, lv.exit.y-35);
        this.exitCrystal.fillTriangle(lv.exit.x, lv.exit.y-20, lv.exit.x-10, lv.exit.y-35, lv.exit.x+10, lv.exit.y-35);
        
        this.tweens.add({
            targets: this.exitCrystal,
            y: -10,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.inOut'
        });

        if(this.biome.fogOverlay2D) {
            const fog = this.add.graphics();
            fog.fillStyle(0x000000, 0.5);
            fog.fillRect(-1000, -1000, 5000, 5000);
            fog.setScrollFactor(0);
            fog.setDepth(100);
        }

        // Initialize Ghost System
        save.ghosts = save.ghosts || {};
        const prevGhost = save.ghosts[lv.id];
        if (prevGhost && prevGhost.length > 0) {
            this.ghost = this.add.sprite(prevGhost[0].x, prevGhost[0].y, 'player');
            this.ghost.setAlpha(0.3);
            this.ghost.setTint(0xaabbff);
            this.ghostFrame = 0;
            this.ghostData = prevGhost;
        }

        this.player = this.physics.add.sprite(lv.spawn.x, lv.spawn.y, 'player');
        this.player.setCollideWorldBounds(true);
        this.player.setSize(18, 26);

        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.player, this.fakeFloors, this.hitFakeFloor, null, this);
        this.physics.add.overlap(this.player, this.spikes, this.die, null, this);
        this.physics.add.overlap(this.player, this.door, this.win, null, this);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.keys = {
            W: this.input.keyboard.addKey('W'),
            A: this.input.keyboard.addKey('A'),
            S: this.input.keyboard.addKey('S'),
            D: this.input.keyboard.addKey('D'),
            ESC: this.input.keyboard.addKey('ESC')
        };

        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.createHUD();
    }

    createHUD() {
        let hud = document.getElementById('levelHud');
        if(!hud) {
            hud = document.createElement('div');
            hud.id = 'levelHud';
            hud.style.cssText = 'position:absolute;top:20px;left:20px;z-index:50;display:flex;gap:15px;';
            document.body.appendChild(hud);
        }
        hud.innerHTML = `
            <div style="background:rgba(255,255,255,0.7);padding:10px 15px;border-radius:10px;border:1px solid rgba(0,0,0,0.1);color:#333;font-family:Inter;font-weight:bold;backdrop-filter:blur(5px);box-shadow:0 5px 15px rgba(0,0,0,0.1);">
                ⏱ <span id="hudTime">0</span>s
            </div>
            <div style="background:rgba(255,255,255,0.7);padding:10px 15px;border-radius:10px;border:1px solid rgba(0,0,0,0.1);color:#fb7185;font-family:Inter;font-weight:bold;backdrop-filter:blur(5px);box-shadow:0 5px 15px rgba(0,0,0,0.1);">
                ☠ <span id="hudDeaths">${this.dCount}</span>
            </div>
            <div style="background:rgba(255,255,255,0.7);padding:10px 15px;border-radius:10px;border:1px solid rgba(0,0,0,0.1);color:#666;font-family:Inter;font-weight:bold;cursor:pointer;box-shadow:0 5px 15px rgba(0,0,0,0.1);" onclick="window.quitLevel()">
                ESC TO QUIT
            </div>
        `;
        hud.style.display = 'flex';
    }

    update() {
        if(this.isDead || this.levelComplete) return;

        // Record ghost frame
        this.frameData.push({
            x: Math.round(this.player.x),
            y: Math.round(this.player.y),
            f: this.player.flipX ? 1 : 0
        });

        // Playback ghost frame
        if (this.ghost && this.ghostData) {
            if (this.ghostFrame < this.ghostData.length) {
                const frame = this.ghostData[this.ghostFrame];
                this.ghost.setPosition(frame.x, frame.y);
                this.ghost.setFlipX(frame.f === 1);
                this.ghostFrame++;
            } else if (!this.ghost.isDeadAnim) {
                this.ghost.isDeadAnim = true;
                this.ghost.setTint(0xff0000);
                this.tweens.add({
                    targets: this.ghost,
                    y: this.ghost.y - 100,
                    alpha: 0,
                    duration: 1000
                });
            }
        }

        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const timeEl = document.getElementById('hudTime');
        if(timeEl) timeEl.textContent = elapsed;

        if (Phaser.Input.Keyboard.JustDown(this.keys.ESC)) {
            document.getElementById('levelHud').style.display = 'none';
            window.quitLevel();
            return;
        }

        const speed = 200;
        if (this.cursors.left.isDown || this.keys.A.isDown) {
            this.player.setVelocityX(-speed);
            this.player.setFlipX(true); // face left
        } else if (this.cursors.right.isDown || this.keys.D.isDown) {
            this.player.setVelocityX(speed);
            this.player.setFlipX(false); // face right
        } else {
            this.player.setVelocityX(0);
        }

        if ((this.cursors.up.isDown || this.keys.W.isDown || this.cursors.space.isDown) && this.player.body.touching.down) {
            this.player.setVelocityY(-450);
        }

        if (this.player.y > (this.levelData.height || 600) + 50) this.die();

        this.traps.forEach(t => {
            if(t.type==='pos' && !t.triggered && this.player.x > t.triggerX) {
                t.triggered = true;
                if(t.action === 'spikeDrop') {
                    const sp = this.spikes.create(t.tx, t.ty, 'spike');
                    sp.body.allowGravity = true;
                    sp.setVelocityY(t.spd || 300);
                }
            }
        });
    }

    hitFakeFloor(player, floor) {
        if (floor.pData.drop && !floor.dropping) {
            floor.dropping = true;
            this.time.delayedCall(150, () => {
                floor.body.enable = false;
                this.add.tween({targets: [floor, floor.graphicsObj], alpha: 0, duration: 200});
            });
        }
    }

    die() {
        if(this.isDead || this.levelComplete) return;
        this.isDead = true;
        this.dCount++;
        save.deaths[this.levelData.id] = (save.deaths[this.levelData.id] || 0) + 1;
        document.getElementById('hudDeaths').textContent = this.dCount;
        
        // Save the ghost data immediately upon death
        save.ghosts = save.ghosts || {};
        save.ghosts[this.levelData.id] = this.frameData;
        
        this.player.setTint(0xff0000);
        this.player.body.checkCollision.none = true;
        this.player.setVelocityY(-300); // death jump
        
        this.cameras.main.shake(200, 0.02);
        
        this.time.delayedCall(800, () => this.scene.restart());
    }

    win() {
        if(this.isDead || this.levelComplete) return;
        this.levelComplete = true;
        
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        
        if(!save.completed.includes(this.levelData.id)) save.completed.push(this.levelData.id);
        const best = save.bestTimes[this.levelData.id] || 999;
        if(elapsed < best) save.bestTimes[this.levelData.id] = elapsed;
        
        // Remove ghost data upon winning
        if(save.ghosts && save.ghosts[this.levelData.id]) {
            delete save.ghosts[this.levelData.id];
        }
        
        saveGame();
        
        // Celebration bounce
        this.player.setVelocityY(-200);
        
        this.time.delayedCall(1000, () => {
            document.getElementById('levelHud').style.display = 'none';
            window.quitLevel();
        });
    }
}
