import { save, saveGame } from '../data/SaveManager.js';

export class UIManager {
    constructor() {
        this.directorTimer = null;
        this.initDOM();
        this.bindEvents();
    }

    initDOM() {
        this.dom = {
            nameLayer: document.getElementById('nameLayer'),
            nameInput: document.getElementById('nameInput'),
            saveName: document.getElementById('saveName'),
            profileName: document.getElementById('profileName'),
            avatar: document.getElementById('avatar'),
            profileProgress: document.getElementById('profileProgress'),
            director: document.getElementById('director'),
            directorMessage: document.getElementById('directorMessage'),
            toastContainer: document.getElementById('toastContainer'),
            modalLayer: document.getElementById('modalLayer'),
            modalTitle: document.getElementById('modalTitle'),
            modalSubtitle: document.getElementById('modalSubtitle'),
            modalContent: document.getElementById('modalContent'),
            modalClose: document.getElementById('modalClose'),
            
            // Interaction Card
            interactionCard: document.getElementById('interactionCard'),
            intLevelTitle: document.getElementById('intLevelTitle'),
            intLevelName: document.getElementById('intLevelName'),
            intStars: document.getElementById('intStars'),
            
            topbar: document.querySelector('.topbar'),
            bottomNav: document.querySelector('.bottom-nav')
        };
    }

    bindEvents() {
        if(this.dom.modalClose) {
            this.dom.modalClose.onclick = () => this.closeModal();
        }

        if(this.dom.saveName) {
            this.dom.saveName.onclick = () => {
                const name = this.dom.nameInput.value.trim();
                if (!name) return;
                save.name = name;
                saveGame();
                this.dom.nameLayer.classList.remove("open");
                this.updateProfile();
                this.toast("WELCOME", `Welcome, ${name}.`);
                setTimeout(() => { this.directorMessage("I've been waiting for you."); }, 1200);
            };
        }

        document.querySelectorAll(".nav-button").forEach(button => {
            button.addEventListener("click", () => {
                document.querySelectorAll(".nav-button").forEach(b => b.classList.remove("active"));
                button.classList.add("active");
                const page = button.dataset.page;
                if(page === "map"){
                    this.closeModal();
                    return;
                }
                this.openPage(page);
            });
        });
        
        // Hide interaction card on start
        if(this.dom.interactionCard) {
            this.dom.interactionCard.style.display = 'none';
        }
    }

    updateProfile() {
        const name = save.name || "Player";
        if(this.dom.profileName) this.dom.profileName.textContent = name;
        if(this.dom.avatar) this.dom.avatar.textContent = name.charAt(0).toUpperCase();
        if(this.dom.profileProgress) this.dom.profileProgress.textContent = `World 01 · ${save.completed.length} / 15`;
    }

    directorMessage(message) {
        if(!this.dom.director) return;
        this.dom.directorMessage.textContent = message;
        this.dom.director.classList.add("show");
        clearTimeout(this.directorTimer);
        this.directorTimer = setTimeout(() => {
            this.dom.director.classList.remove("show");
        }, 3500);
    }

    toast(title, text) {
        if(!this.dom.toastContainer) return;
        const element = document.createElement("div");
        element.className = "toast";
        element.innerHTML = `<div class="toast-title">${title}</div><div class="toast-text">${text}</div>`;
        this.dom.toastContainer.appendChild(element);
        setTimeout(() => {
            element.style.opacity = "0";
            element.style.transform = "translateX(20px)";
            element.style.transition = ".3s ease";
            setTimeout(() => element.remove(), 300);
        }, 3500);
    }

    openModal(title, subtitle, html) {
        if(!this.dom.modalLayer) return;
        this.dom.modalTitle.textContent = title;
        this.dom.modalSubtitle.textContent = subtitle;
        this.dom.modalContent.innerHTML = html;
        this.dom.modalLayer.classList.add("open");
    }

    closeModal() {
        if(this.dom.modalLayer) this.dom.modalLayer.classList.remove("open");
        document.querySelectorAll(".nav-button").forEach(b => b.classList.remove("active"));
        const mapBtn = document.querySelector('.nav-button[data-page="map"]');
        if(mapBtn) mapBtn.classList.add("active");
    }

    openPage(page) {
        if(page === "statistics") {
            const totalDeaths = Object.values(save.deaths).reduce((a,b)=>a+b, 0);
            this.openModal("Statistics", "The Director keeps records.", `
                <div class="stats-grid">
                    <div class="stat"><div class="stat-label">Levels Completed</div><div class="stat-value">${save.completed.length}</div></div>
                    <div class="stat"><div class="stat-label">Total Deaths</div><div class="stat-value" style="color:var(--danger)">${totalDeaths}</div></div>
                </div>
            `);
        } else if(page === "journal") {
            this.openModal("Journal", "Encrypted logs from past subjects.", `
                <div style="background:var(--panel-soft); padding: 15px; border-radius: var(--radius-small); margin-bottom: 10px; border-left: 3px solid var(--accent);">
                    <div style="color:var(--muted); font-size:12px; margin-bottom: 5px;">Log #01 - The Simulation</div>
                    <div style="color:var(--text); line-height: 1.5;">It starts nice enough. Rolling hills, soft music. But then the ground starts falling away. They're testing our trust.</div>
                </div>
                <div style="background:var(--panel-soft); padding: 15px; border-radius: var(--radius-small); border-left: 3px solid var(--accent-2);">
                    <div style="color:var(--muted); font-size:12px; margin-bottom: 5px;">Log #04 - Ghosts</div>
                    <div style="color:var(--text); line-height: 1.5;">I keep seeing someone in the corner of my eye. Another runner? No... it's doing exactly what I did before I fell. It's me.</div>
                </div>
            `);
        } else if(page === "achievements") {
            this.openModal("Achievements", "Milestones in the facility.", `
                <div style="display:flex; align-items:center; gap: 15px; background:var(--panel-soft); padding: 15px; border-radius: var(--radius-small); margin-bottom: 10px; ${save.completed.length > 0 ? 'opacity: 1;' : 'opacity: 0.5; filter: grayscale(1);'}">
                    <div style="font-size: 24px; background: rgba(255,255,255,0.1); width: 40px; height: 40px; border-radius: 20px; display:flex; align-items:center; justify-content:center;">🌱</div>
                    <div>
                        <div style="color:var(--text); font-weight:bold;">First Steps</div>
                        <div style="color:var(--muted); font-size:12px;">Complete your first level.</div>
                    </div>
                </div>
                <div style="display:flex; align-items:center; gap: 15px; background:var(--panel-soft); padding: 15px; border-radius: var(--radius-small); margin-bottom: 10px; ${Object.values(save.deaths).reduce((a,b)=>a+b, 0) > 0 ? 'opacity: 1;' : 'opacity: 0.5; filter: grayscale(1);'}">
                    <div style="font-size: 24px; background: rgba(255,255,255,0.1); width: 40px; height: 40px; border-radius: 20px; display:flex; align-items:center; justify-content:center;">💀</div>
                    <div>
                        <div style="color:var(--text); font-weight:bold;">Learning Opportunity</div>
                        <div style="color:var(--muted); font-size:12px;">Die for the first time.</div>
                    </div>
                </div>
                <div style="display:flex; align-items:center; gap: 15px; background:var(--panel-soft); padding: 15px; border-radius: var(--radius-small); ${save.completed.length >= 15 ? 'opacity: 1;' : 'opacity: 0.5; filter: grayscale(1);'}">
                    <div style="font-size: 24px; background: rgba(255,255,255,0.1); width: 40px; height: 40px; border-radius: 20px; display:flex; align-items:center; justify-content:center;">👑</div>
                    <div>
                        <div style="color:var(--text); font-weight:bold;">World 01 Champion</div>
                        <div style="color:var(--muted); font-size:12px;">Complete all 15 levels in Whispering Meadow.</div>
                    </div>
                </div>
            `);
        } else {
            this.openModal("Information", "This section is classified.", "<p>Return to the map.</p>");
        }
    }
    
    // 3D Interaction Card
    showInteractionCard(level) {
        if(!this.dom.interactionCard) return;
        this.dom.intLevelTitle.textContent = `LEVEL ${String(level.id).padStart(2,'0')}`;
        this.dom.intLevelName.textContent = level.name;
        
        let stars = '';
        for(let i=0; i<5; i++){
            stars += i < level.difficulty ? '★' : '☆';
        }
        this.dom.intStars.textContent = stars;
        
        this.dom.interactionCard.style.display = 'flex';
        // force reflow
        void this.dom.interactionCard.offsetWidth;
        this.dom.interactionCard.classList.add('show');
    }
    
    hideInteractionCard() {
        if(!this.dom.interactionCard) return;
        this.dom.interactionCard.classList.remove('show');
        setTimeout(() => {
            if(!this.dom.interactionCard.classList.contains('show')) {
                this.dom.interactionCard.style.display = 'none';
            }
        }, 200);
    }
    
    hideMainUI() {
        this.dom.topbar.style.display = 'none';
        this.dom.bottomNav.style.display = 'none';
    }
    
    showMainUI() {
        this.dom.topbar.style.display = 'flex';
        this.dom.bottomNav.style.display = 'flex';
    }
}
