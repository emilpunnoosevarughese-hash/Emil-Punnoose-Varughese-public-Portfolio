import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js';
import { loadSave, save, saveGame } from './data/SaveManager.js';
import { UIManager } from './ui/UIManager.js';
import { WorldManager } from './world/WorldManager.js';
import { PlayerController } from './player/PlayerController.js';
import { LevelManager } from './game/LevelManager.js';

let ui, world, player, levelManager;

function init() {
    loadSave();
    
    // World switching API for testing
    window.switchWorld = (id) => {
        save.currentWorld = id;
        saveGame();
        location.reload();
    };
    
    ui = new UIManager();
    world = new WorldManager('three-canvas', save.currentWorld || 1);
    levelManager = new LevelManager(ui);
    player = new PlayerController(world, ui, levelManager);
    
    // Start game loop
    const clock = new THREE.Clock();
    
    function animate() {
        requestAnimationFrame(animate);
        
        const dt = Math.min(clock.getDelta(), 0.1);
        const time = clock.getElapsedTime();
        
        if (!levelManager.isPlaying) {
            player.update(dt, time);
            world.render(time);
        }
    }
    
    animate();
    
    // Check for name on start
    ui.updateProfile();
    if (!localStorage.getItem('mechio_save_v1') || !JSON.parse(localStorage.getItem('mechio_save_v1')).name) {
        document.getElementById("nameLayer").classList.add("open");
    } else {
        setTimeout(() => ui.directorMessage("Welcome back."), 1800);
    }
}

window.addEventListener('DOMContentLoaded', init);
