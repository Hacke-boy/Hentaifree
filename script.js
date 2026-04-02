const grid = document.getElementById('mainGrid');
const searchInput = document.getElementById('search');

// Configuration de l'Empire
const API_URL = 'https://api.jikan.moe/v4/top/anime?filter=bypopularity';

async function initEmpire() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        render(data.data);
    } catch (err) {
        grid.innerHTML = `<div style="color:red; text-align:center; width:100%;">
            Système hors ligne. Vérifiez votre connexion.
        </div>`;
    }
}

function render(items) {
    grid.innerHTML = "";
    items.forEach(item => {
        // Lien de recherche intelligent pour le visionnage
        const searchLink = `https://vostfree.ws/?do=search&subaction=search&story=${encodeURIComponent(item.title)}`;
        
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <a href="${searchLink}" target="_blank" style="text-decoration:none; color:inherit;">
                <img src="${item.images.jpg.large_image_url}" alt="${item.title}" loading="lazy">
                <div class="card-info">
                    <div class="play-icon">▶</div>
                    <div class="card-title">${item.title}</div>
                </div>
            </a>
        `;
        grid.appendChild(card);
    });
}

// Recherche instantanée sans recharger la page
searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        const title = card.innerText.toLowerCase();
        if(title.includes(term)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
});

// Lancement au démarrage
initEmpire();
