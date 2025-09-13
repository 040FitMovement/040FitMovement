// EERST alle globale variabelen declareren
let currentSlide = 0;
let totalSlides = 0;
let carousel = null;
let indicators = null;
let autoPlay = null;

// DAN alle functies definiëren
function updateCarousel() { 
    const translateX = -currentSlide * 100; 
    carousel.style.transform = `translateX(${translateX}%)`;
    
    // Update indicators
    indicators.forEach((indicator, index) => { 
        if (index === currentSlide) { 
            indicator.classList.add('active');
        } else { 
            indicator.classList.remove('active');
        } 
    }); 
} 

function nextSlide() { 
    currentSlide = (currentSlide + 1) % totalSlides; 
    updateCarousel();
} 

function prevSlide() { 
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides; 
    updateCarousel(); 
} 

function goToSlide(index) { 
    currentSlide = index; 
    updateCarousel(); 
} 

function initCarouselEvents() { 
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) { 
        carouselContainer.addEventListener('mouseenter', () => { 
            clearInterval(autoPlay);
        });
        
        carouselContainer.addEventListener('mouseleave', () => { 
            autoPlay = setInterval(nextSlide, 5000); 
        }); 
    } 
    
    // Touch/swipe support for mobile 
    let startX = 0;
    let endX = 0;
    
    carousel.addEventListener('touchstart', (e) => { 
        startX = e.touches[0].clientX; 
    });
    
    carousel.addEventListener('touchend', (e) => { 
        endX = e.changedTouches[0].clientX;
        const diffX = startX - endX;
        if (Math.abs(diffX) > 50) {
            if (diffX > 0) { 
                nextSlide(); 
            } else { 
                prevSlide(); 
            } 
        } 
    }); 
    
    // Keyboard navigation 
    document.addEventListener('keydown', (e) => { 
        if (e.key === 'ArrowLeft') { 
            prevSlide();
        } else if (e.key === 'ArrowRight') { 
            nextSlide(); 
        } 
    });
}

// DAN pas de DOMContentLoaded event listener
document.addEventListener("DOMContentLoaded", function() {
    
// Carousel initialisatie
carousel = document.getElementById('carousel');
if (carousel) {
    totalSlides = document.querySelectorAll('#carousel .carousel-item').length;
    indicators = document.querySelectorAll('.indicator');
        
// Start autoplay 
autoPlay = setInterval(nextSlide, 5000); 
        
// Voeg event listeners toe 
    initCarouselEvents(); 
}
    
// Maps-monitor
const iframe = document.querySelector(".screen iframe");
if (iframe) {
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    iframe.classList.add("loaded");
                }, 2500);
                observer.unobserve(iframe);
            }
        });
    }, { threshold: 0.5 });
    observer.observe(iframe);
}
});

//Formulier afhandeling
const form = document.getElementById("contactForm");
const thankYouMessage = document.getElementById("thankYouMessage");

if (form) {
    form.addEventListener("submit", function(event) {
        event.preventDefault();
        
        // Verstuur formulier met fetch API
        fetch(form.action, {
            method: "POST",
            body: new FormData(form),
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                // Succes: toon bedankbericht
                form.style.display = "none";
                if (thankYouMessage) thankYouMessage.style.display = "block";
            } else {
                // Error: laat gebruiker het opnieuw proberen
                alert("Er ging iets mis bij het verzenden. Probeer het later opnieuw.");
            }
        })
        .catch(error => {
            alert("Er ging iets mis bij het verzenden. Probeer het later opnieuw.");
        });
    });
}