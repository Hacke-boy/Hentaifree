/**
 * PSYX-MANGA - Logiciel de gestion dynamique
 * Gère l'affichage, la recherche et le panier
 */

// --- CONFIGURATION ---
const JIKAN_API = "https://api.jikan.moe/v4";
const mangaGrid = document.getElementById('mangaGrid');
const searchInput = document.getElementById('searchInput');
const cartCount = document.getElementById('cartCount');

// État de l'application
let cart = JSON.parse(localStorage.getItem('psyx_cart')) || [];

// --- FONCTIONS PRINCIPALES ---

/**
 * Charge les mangas depuis l'API Jikan
 * @param {string} query - Terme de recherche
 * @param {string} genreId - ID du genre (optionnel)
 */
async function loadMangas(query = '', genreId = '') {
    // Affichage d'un loader pendant le chargement
    mangaGrid.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:50px; color:#666;">Chargement des données...</div>';

    let url = `${JIKAN_API}/top/manga?limit=12&type=manga`;
    
    if (query) {
        url = `${JIKAN_API}/manga?q=${query}&limit=12&order_by=popularity`;
    } else if (genreId) {
        url = `${JIKAN_API}/manga?genres=${genreId}&limit=12&order_by=popularity`;
    }

    try {
        const response = await fetch(url);
        const result = await response.json();
        
        if (result.data && result.data.length > 0) {
            renderCards(result.data);
        } else {
            mangaGrid.innerHTML = '<p style="grid-column:1/-1; text-align:center;">Aucun manga trouvé.</p>';
        }
    } catch (error) {
        console.error("Erreur API:", error);
        mangaGrid.innerHTML = '<p style="grid-column:1/-1; text-align:center; color:red;">Erreur de connexion. Vérifiez votre internet.</p>';
    }
}

/**
 * Génère le HTML pour chaque carte de manga
 */
function renderCards(mangas) {
    mangaGrid.innerHTML = '';
    
    mangas.forEach(manga => {
        const title = manga.title;
        const image = manga.images.jpg.large_image_url;
        const score = manga.score || 'N/A';
        const type = manga.type || 'Manga';
        const genres = manga.genres.map(g => g.name).join(', ');

        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${image}" class="card-img" alt="${title}" loading="lazy">
            <div class="card-hover">
                <div class="card-hover-btns">
                    <button class="card-btn read" onclick="openReader('${manga.mal_id}')">LIRE</button>
                    <button class="card-btn buy" onclick="addToCart('${title.replace(/'/g, "\\'")}')">ACHETER</button>
                </div>
            </div>
            <div class="card-body">
                <div class="card-name">${title}</div>
                <div class="card-meta">
                    <span class="card-genre">${type} • ★ ${score}</span>
                </div>
            </div>
        `;
        mangaGrid.appendChild(card);
    });
}

// --- SYSTÈME DE PANIER ---

window.addToCart = (mangaTitle) => {
    cart.push(mangaTitle);
    localStorage.setItem('psyx_cart', JSON.stringify(cart));
    updateCartBadge();
    showToast(`${mangaTitle} ajouté au panier !`);
};

function updateCartBadge() {
    if (cartCount) cartCount.innerText = cart.length;
}

// --- RECHERCHE ---

let searchTimer;
searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimer);
    const value = e.target.value;
    // On attend 500ms après la frappe pour ne pas saturer l'API
    searchTimer = setTimeout(() => {
        if (value.length > 2) {
            loadMangas(value);
        } else if (value.length === 0) {
            loadMangas();
        }
    }, 500);
});

// --- UTILITAIRES ---

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast ok';
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Fonction pour simuler l'ouverture d'un lecteur
window.openReader = (id) => {
    alert("Ouverture du lecteur pour le manga ID: " + id + "\n(Connexion MangaDex en cours...)");
};

// --- INITIALISATION ---
document.addEventListener('DOMContentLoaded', () => {
    loadMangas();
    updateCartBadge();
});
