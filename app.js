// app.js - Logique dynamique
const mangaGrid = document.getElementById('mangaGrid');
const searchInput = document.getElementById('searchInput');

// 1. Récupérer les mangas depuis l'API Jikan (MyAnimeList)
async function fetchMangas(query = '') {
    const url = query 
        ? `https://api.jikan.moe/v4/manga?q=${query}&limit=12`
        : `https://api.jikan.moe/v4/top/manga?limit=12`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        displayMangas(data.data);
    } catch (error) {
        console.error("Erreur API:", error);
        mangaGrid.innerHTML = `<p class="empty">Erreur de connexion aux serveurs.</p>`;
    }
}

// 2. Affichage dans la grille
function displayMangas(mangas) {
    mangaGrid.innerHTML = '';
    mangas.forEach(manga => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${manga.images.jpg.image_url}" class="card-img" alt="${manga.title}">
            <div class="card-hover">
                <div class="card-hover-btns">
                    <button class="card-btn read">LIRE</button>
                    <button class="card-btn buy">ACHETER</button>
                </div>
            </div>
            <div class="card-body">
                <div class="card-name">${manga.title}</div>
                <div class="card-meta">
                    <span class="card-genre">${manga.type || 'Manga'}</span>
                    <span class="card-ep">★ ${manga.score || 'N/A'}</span>
                </div>
            </div>
        `;
        mangaGrid.appendChild(card);
    });
}

// 3. Recherche en temps réel
searchInput.addEventListener('input', (e) => {
    if (e.target.value.length > 2) {
        fetchMangas(e.target.value);
    }
});

// Initialisation
fetchMangas();
