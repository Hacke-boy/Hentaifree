const grid = document.getElementById('mainGrid');
const searchInput = document.getElementById('search');

// Fonction pour récupérer les données (API gratuite)
async function fetchEmpireContent() {
    try {
        // On récupère les titres populaires pour remplir le site
        const response = await fetch('https://api.jikan.moe/v4/top/anime?filter=bypopularity');
        const result = await response.json();
        renderCards(result.data);
    } catch (error) {
        grid.innerHTML = "<p>Erreur de connexion au serveur de l'Empire.</p>";
    }
}

function renderCards(items) {
    grid.innerHTML = ""; // On vide le loader
    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${item.images.jpg.large_image_url}" alt="${item.title}" loading="lazy">
            <div class="card-title">${item.title}</div>
        `;
        grid.appendChild(card);
    });
}

// Barre de recherche dynamique
searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        const title = card.innerText.toLowerCase();
        card.style.display = title.includes(term) ? 'block' : 'none';
    });
});

// Lancement automatique
fetchEmpireContent();

