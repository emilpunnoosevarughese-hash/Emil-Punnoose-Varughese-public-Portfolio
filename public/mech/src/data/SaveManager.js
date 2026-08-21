const SAVE_KEY = "mechio_save_v1";

export let save = {
    name: "",
    completed: [],
    deaths: {},
    bestTimes: {},
    secrets: 0,
    totalJumps: 0,
    playTime: 0,
    endings: {},
    settings: { flash: true, shake: true }
};

export function loadSave() {
    try {
        const raw = localStorage.getItem(SAVE_KEY);
        if (raw) {
            save = Object.assign(save, JSON.parse(raw));
        }
    } catch (error) {
        console.warn("Save data could not be loaded.", error);
    }
}

export function saveGame() {
    localStorage.setItem(SAVE_KEY, JSON.stringify(save));
}

export function resetProgress() {
    if (!confirm("Reset all local progress?")) return;
    localStorage.removeItem(SAVE_KEY);
    location.reload();
}
