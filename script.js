const grid = document.getElementById('mainGrid');
const searchInput = document.getElementById('search');
const modal = document.getElementById('playerModal');
const videoWrapper = document.getElementById('videoWrapper');
const videoTitle = document.getElementById('videoTitle');
const closeBtn = document.querySelector('.close-btn');

// --- SYSTÈME D'HISTORIQUE ---
let history = JSON.parse(localStorage.getItem('lafond_history')) || [];

function saveToHistory(item) {
    // Évite les doublons
    history = history.filter(h => h.id !== item.mal_id);
    history.unshift({
        id: item.mal_id,
        title: item.title,
        img: item.images.jpg.small_image_url,
        date: new Date().toLocaleDateString()
    });
    // On garde seulement les 10 derniers
    if (history.length > 10) history.pop();
    localStorage.setItem('lafond_history', JSON.stringify(history));
}

// --- CHARGEMENT DU CATALOGUE ---
async function loadAnime() {
    try {
        const res = await fetch('https://api.jikan.moe/v4/top/anime?limit=20');
        const json = await res.json();
        display(json.data);
    } catch (e) {
        grid.innerHTML = "<p>Erreur de connexion...</p>";
    }
}

function display(data) {
    grid.innerHTML = "";
    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${item.images.jpg.large_image_url}" alt="${item.title}" loading="lazy">
            <div class="card-info">
                <div class="card-title">${item.title.substring(0, 25)}...</div>
            </div>
        `;
        
        card.onclick = () => {
            saveToHistory(item);
            openPlayer(item.title);
        };
        grid.appendChild(card);
    });
}

// --- MOTEUR DE LECTURE (VOSTFR / VF) ---
function openPlayer(title) {
    videoTitle.innerText = title;
    
    // On cible des sources comme VostFree via une recherche de flux intégrable
    // Note : Google/YouTube bloquent moins les "Trailers" ou "Previews"
    const searchQuery = encodeURIComponent(title + " streaming vostfr vf");
    const streamUrl = `https://www.youtube.com/embed?listType=search&list=${searchQuery}&autoplay=1`;

    videoWrapper.innerHTML = `
        <iframe 
            src="${streamUrl}" 
            allow="autoplay; fullscreen" 
            allowfullscreen>
        </iframe>`;
    
    modal.style.display = "block";
}

closeBtn.onclick = () => {
    modal.style.display = "none";
    videoWrapper.innerHTML = ""; 
    // Ici, le navigateur mémorise naturellement la position si c'est un flux compatible
};

// Fermer au clic extérieur
window.onclick = (e) => { if (e.target == modal) closeBtn.onclick(); };

// Recherche
searchInput.oninput = (e) => {
    const term = e.target.value.toLowerCase();
    document.querySelectorAll('.card').forEach(card => {
        card.style.display = card.innerText.toLowerCase().includes(term) ? "block" : "none";
    });
};

loadAnime();
