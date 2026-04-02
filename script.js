const grid = document.getElementById('mainGrid');
const searchInput = document.getElementById('search');
const modal = document.getElementById('playerModal');
const videoWrapper = document.getElementById('videoWrapper');
const videoTitle = document.getElementById('videoTitle');
const closeBtn = document.querySelector('.close-btn');

// Charger les données de l'API
async function loadAnime() {
    try {
        const res = await fetch('https://api.jikan.moe/v4/top/anime');
        const json = await res.json();
        display(json.data);
    } catch (e) {
        grid.innerHTML = "<p>Erreur de chargement...</p>";
    }
}

function display(data) {
    grid.innerHTML = "";
    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${item.images.jpg.large_image_url}" alt="${item.title}">
            <div class="card-title">${item.title.substring(0, 25)}...</div>
        `;
        
        // Action au clic : Ouvrir le lecteur interne
        card.onclick = () => {
            const query = encodeURIComponent(item.title + " streaming vostfr");
            // On utilise un moteur de recherche de flux externe pour l'iframe
            // Ici configuré sur une recherche YouTube pour l'exemple
            const streamUrl = `https://www.youtube.com/embed?listType=search&list=${query}`;
            
            videoTitle.innerText = item.title;
            videoWrapper.innerHTML = `<iframe src="${streamUrl}" allowfullscreen></iframe>`;
            modal.style.display = "block";
        };
        
        grid.appendChild(card);
    });
}

// Fermeture du lecteur
closeBtn.onclick = () => {
    modal.style.display = "none";
    videoWrapper.innerHTML = ""; // Stop la vidéo
};

// Recherche dynamique
searchInput.oninput = (e) => {
    const term = e.target.value.toLowerCase();
    document.querySelectorAll('.card').forEach(card => {
        card.style.display = card.innerText.toLowerCase().includes(term) ? "block" : "none";
    });
};

loadAnime();
