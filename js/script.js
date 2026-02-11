// --- FONCTION GLOBALE POUR LES ACCORDÉONS ---
// Elle doit être à l'extérieur pour être appelée par l'attribut onclick du HTML
function toggleCard(card) {
    card.classList.toggle('active');
}

document.addEventListener('DOMContentLoaded', () => {
    
    // --- DÉTECTION AUTO DES SUB-PAGES ---
    if (!document.body.classList.contains('home-page')) {
        document.body.classList.add('sub-page');
    }
    
    // --- PARTIE 1 : MENU HAMBURGER ---
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('open');
        });

        // Fermer le menu en cliquant sur un lien
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('open');
            });
        });

        // Fermer le menu en cliquant en dehors
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('open');
            }
        });
    }

    // --- PARTIE 2 : SYSTÈME STYLE PARTICLES.JS ---
    const canvas = document.getElementById('canvas-particles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particlesArray = [];
        
        const mouse = {
            x: null,
            y: null,
            radius: 150 
        };

        window.addEventListener('mousemove', (event) => {
            mouse.x = event.x;
            mouse.y = event.y;
        });

        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.vx = Math.random() * 1.5 - 0.75;
                this.vy = Math.random() * 1.5 - 0.75;
            }

            draw() {
                // Couleur adaptée selon la page
                const color = document.body.classList.contains('home-page') 
                    ? 'rgba(255, 255, 255, 0.8)' 
                    : 'rgba(0, 212, 255, 0.6)';
                
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }

            update() {
                // Répulsion
                if (mouse.x !== null) {
                    let dx = this.x - mouse.x;
                    let dy = this.y - mouse.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < mouse.radius && distance > 1) {
                        let force = (mouse.radius - distance) / mouse.radius;
                        let directionX = dx / distance;
                        let directionY = dy / distance;
                        
                        this.x += directionX * force * 5;
                        this.y += directionY * force * 5;
                    }
                }

                this.x += this.vx;
                this.y += this.vy;

                if (this.x > canvas.width) this.x = 0;
                else if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0;
                else if (this.y < 0) this.y = canvas.height;
            }
        }

        function connect() {
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    let dx = particlesArray[a].x - particlesArray[b].x;
                    let dy = particlesArray[a].y - particlesArray[b].y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        let opacity = 1 - (distance / 100);
                        const lineColor = document.body.classList.contains('home-page')
                            ? `rgba(255, 255, 255, ${opacity * 0.2})`
                            : `rgba(0, 212, 255, ${opacity * 0.3})`;
                        
                        ctx.strokeStyle = lineColor;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function init() {
            particlesArray = [];
            let numberOfParticles = (canvas.width * canvas.height) / 9000; 
            for (let i = 0; i < numberOfParticles; i++) {
                particlesArray.push(new Particle());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
                particlesArray[i].draw();
            }
            connect(); 
            requestAnimationFrame(animate);
        }

        function setCanvasSize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            init();
        }

        window.addEventListener('resize', setCanvasSize);
        setCanvasSize();
        animate();
    }

    // --- PARTIE 3 : EFFET TYPING SUR LE HERO (PAGE D'ACCUEIL) ---
    if (document.body.classList.contains('home-page')) {
        const heroText = document.querySelector('.hero-content p');
        if (heroText) {
            const text = heroText.textContent;
            heroText.textContent = '';
            let i = 0;
            
            const typeWriter = () => {
                if (i < text.length) {
                    heroText.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 50);
                }
            };
            
            setTimeout(typeWriter, 500);
        }
    }

    // --- PARTIE 4 : SCROLL REVEAL POUR LES SUB-PAGES ---
    if (document.body.classList.contains('sub-page')) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observer les éléments à animer
        document.querySelectorAll('.skill-card, .design-card, .certif-card, .article-card, .flux-info-box').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    // --- PARTIE 5 : ACCORDÉONS ALTERNATIFS (SI PAS D'ONCLICK DANS LE HTML) ---
    const skillCards = document.querySelectorAll('.skill-card:not([onclick])');
    skillCards.forEach(card => {
        card.addEventListener('click', () => {
            // Fermer les autres cards
            skillCards.forEach(otherCard => {
                if (otherCard !== card) {
                    otherCard.classList.remove('active');
                }
            });
            // Toggle la card cliquée
            card.classList.toggle('active');
        });
    });
});

// --- PARTIE 6 : FLUX RSS VEILLE TECHNOLOGIQUE ---
const RSS_URL = 'https://news.google.com/rss/search?q=Zero+Trust+Network+Access+security&hl=fr&gl=FR&ceid=FR:fr';
const STORAGE_KEY = 'ma_veille_cache';

async function loadFeed() {
    const container = document.getElementById('feed-container');
    if (!container) return; // Si l'élément n'existe pas, on sort
    
    // 1. Tenter de récupérer les données en ligne
    try {
        const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`);
        
        if (!response.ok) throw new Error('Erreur réseau');

        const data = await response.json();
        
        // Sauvegarder dans le navigateur pour plus tard
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data.items));
        
        // Afficher les données fraîches
        renderArticles(data.items, "Actualisé en direct");

    } catch (error) {
        console.warn("Mode hors-ligne ou erreur de flux. Tentative de récupération du cache...");
        
        // 2. Si échec (pas de réseau), chercher dans le LocalStorage
        const cachedData = localStorage.getItem(STORAGE_KEY);
        
        if (cachedData) {
            const items = JSON.parse(cachedData);
            renderArticles(items, "Affichage hors-ligne (dernière mise à jour enregistrée)");
        } else {
            container.innerHTML = `
                <div style="text-align:center; padding: 40px; color: #ff4b4b;">
                    <p>Impossible de charger la veille. Connexion Internet requise pour le premier chargement.</p>
                </div>`;
        }
    }
}

// Fonction pour générer le HTML proprement
function renderArticles(items, statusMessage) {
    const container = document.getElementById('feed-container');
    
    // On ajoute un petit badge de statut en haut du flux
    let html = `<p style="font-size: 0.7rem; color: #00d4ff; text-transform: uppercase; margin-bottom: 20px; letter-spacing: 1px;">
                    ● ${statusMessage}
                </p>`;

    items.forEach(item => {
        const cleanDesc = item.description.replace(/<[^>]*>/g, '').substring(0, 160);
        
        html += `
            <article class="article-card">
                <span class="article-date" style="color:#00d4ff; font-size:0.8rem;">
                    ${new Date(item.pubDate).toLocaleDateString('fr-FR', {day:'numeric', month:'long'})}
                </span>
                <a href="${item.link}" target="_blank" class="article-title">${item.title}</a>
                <p class="article-description">${cleanDesc}...</p>
                <a href="${item.link}" target="_blank" class="btn-outline" style="display:inline-block; margin-top:15px; padding: 8px 15px; font-size: 0.7rem; border: 1px solid #00d4ff; color: #00d4ff; text-decoration: none; border-radius: 4px;">
                    Lire l'article
                </a>
            </article>
        `;
    });

    container.innerHTML = html;
}

// Lancer au chargement si l'élément feed-container existe
if (document.getElementById('feed-container')) {
    window.addEventListener('load', loadFeed);
}