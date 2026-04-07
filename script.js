/**
 * PSYX-MANGA - Script Officiel
 * Style: OrtegaScans (Clean & Fast)
 */

// 1. GESTION DU LOADER (Écran de chargement)
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
            // On réactive le scroll une fois chargé
            document.body.classList.remove('loading-active');
        }, 1500); // 1.5 seconde pour le style "Premium"
    }
});

// 2. GESTION DES CHAPITRES (Simulation Ortega)
// Ajoute un effet au clic sur les chapitres
document.querySelectorAll('.chap').forEach(btn => {
    btn.addEventListener('click', (e) => {
        // e.preventDefault(); // Décommenter si tu ne veux pas que le lien change de page
        console.log("Lecture du chapitre lancée...");
        // Ici, tu pourrais ouvrir une modale de lecture ou une nouvelle page
    });
});

// 3. LOGIQUE DU PANIER (Si achat de tomes physiques)
let cart = [];

function addToCart(mangaName, price) {
    const item = {
        name: mangaName,
        price: price,
        date: new Date().toLocaleDateString()
    };
    
    cart.push(item);
    updateCartIcon();
    
    // Notification rapide
    alert(`${mangaName} ajouté à votre sélection !`);
}

function updateCartIcon() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.innerText = cart.length;
        // Petit effet d'animation sur l'icône
        cartCount.style.transform = 'scale(1.2)';
        setTimeout(() => cartCount.style.transform = 'scale(1)', 200);
    }
}

// 4. FORMULAIRE DE COMMANDE WHATSAPP (Style Ortega)
function sendOrderWhatsApp() {
    const name = document.getElementById('form-name')?.value;
    const phone = document.getElementById('form-phone')?.value;
    const address = document.getElementById('form-address')?.value;
    const payMethod = document.getElementById('form-pay')?.value;

    if (!name || !phone || !address) {
        alert("Veuillez remplir tous les champs de l'Empire !");
        return;
    }

    let message = `*COMMANDE PSYX-MANGA*%0A`;
    message += `--------------------------%0A`;
    message += `*Client:* ${name}%0A`;
    message += `*WhatsApp:* ${phone}%0A`;
    message += `*Lieu:* ${address}%0A`;
    message += `*Paiement:* ${payMethod}%0A`;
    message += `--------------------------%0A`;
    message += `*Sélection:*%0A`;
    
    cart.forEach(item => {
        message += `- ${item.name} (${item.price} HTG)%0A`;
    });

    const finalUrl = `https://wa.me/50935144295?text=${message}`;
    window.open(finalUrl, '_blank');
}

// 5. RECHERCHE (Optionnel - Pour le look Ortega)
const searchIcon = document.querySelector('.fa-search');
if (searchIcon) {
    searchIcon.parentElement.addEventListener('click', () => {
        const query = prompt("Quel manga cherchez-vous dans l'Empire ?");
        if (query) alert("Recherche en cours pour : " + query);
    });
            }
