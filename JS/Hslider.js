const Slides = document.querySelectorAll(".slide");
const EhName = document.querySelectorAll(".AniName");
let init = 0;
const names = document.querySelectorAll(".AniName");
const totalSlides = Slides.length;
let autoSlideInterval;
let isTransitioning = false;

// Initialize slide positions
Slides.forEach((value, i) => {
    value.style.left = `${i * 100}%`;
});

// Navigate to next slide
const goNext = () => {
    if (isTransitioning) return;
    init++;
    if (init >= totalSlides) {
        init = 0;
    }
    SlidShow();
    resetAutoSlide();
};

// Navigate to previous slide
const goPrev = () => {
    if (isTransitioning) return;
    init--;
    if (init < 0) {
        init = totalSlides - 1;
    }
    SlidShow();
    resetAutoSlide();
};

// Navigate to specific slide
const goToSlide = (index) => {
    if (isTransitioning || index === init || index < 0 || index >= totalSlides) return;
    init = index;
    SlidShow();
    resetAutoSlide();
};

// Animate slide transition
function SlidShow() {
    isTransitioning = true;
    Slides.forEach(value => {
        value.style.transform = `translateX(-${init * 100}%)`;
    });
    setTimeout(() => {
        isTransitioning = false;
    }, 500);
    updateSlideIndicator();
}

// Update slide indicator (if added)
function updateSlideIndicator() {
    const indicators = document.querySelectorAll(".slide-indicator");
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle("active", index === init);
    });
}

// Reset auto-slide timer
function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
}

// Start auto-slide
function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        goNext();
    }, 5000);
}

// Handle next button click
const nextBtn = document.querySelector(".slider-next");
if (nextBtn) {
    nextBtn.addEventListener("click", goNext);
}

// Handle previous button click
const prevBtn = document.querySelector(".slider-prev");
if (prevBtn) {
    prevBtn.addEventListener("click", goPrev);
}

// Handle indicator click
const indicators = document.querySelectorAll(".slide-indicator");
indicators.forEach((indicator) => {
    indicator.addEventListener("click", (e) => {
        const slideIndex = parseInt(e.target.getAttribute("data-slide"));
        goToSlide(slideIndex);
    });
});

// Keyboard navigation
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") goNext();
    if (e.key === "ArrowLeft") goPrev();
});

// Start auto-slide on load
startAutoSlide();

// Update font sizes based on viewport
function updateFontSizes() {
    names.forEach(value => {
        if (value.innerHTML.length >= 30) {
            if (window.innerWidth < 600) {
                value.style.fontSize = "15px";
            } else if (window.innerWidth < 830) {
                value.style.fontSize = "18px";
            } else {
                value.style.fontSize = "25px";
            }
        } else {
            if (window.innerWidth < 600) {
                value.style.fontSize = "18px";
            } else if (window.innerWidth < 830) {
                value.style.fontSize = "28px";
            } else {
                value.style.fontSize = "40px";
            }
        }
    });
}

// Initial font size update
updateFontSizes();

// Handle window resize
window.addEventListener("resize", updateFontSizes);
window.addEventListener("orientationchange", updateFontSizes);