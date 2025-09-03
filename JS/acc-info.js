import {
    redirect
} from "./ad-st-s.js";
const AIsB = document.querySelector(".ac-info-save");
const IMAGEBS = document.querySelector(".pfp-s");
let FIMAGE ="";

AIsB.addEventListener('click', () => {
    if (image.length === 0) {
    FIMAGE = IMAGEBS.dataset.alreadypic;
    }
    else {
     FIMAGE = image
        }
    const bio = document.querySelector("textarea").value;

    if (bio.length <= 200) {
        if (Gender || !Gender) {

            fetch("/settings/account-info", {
                    method: 'POST',
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify({
                        image:FIMAGE,
                        Gender,
                        bio
                    })
                })
                .then(info => info.json())
                .then(data => {
                    console.log(data);
                    redirect(data);
                })
        }

    } else {
        alert("Hey There Please make sure your bio is under 200 words")
    }
})




const bioTextarea = document.getElementById('bio');
const charCount = document.querySelector('.char-count');

function updateCharCount() {
    const count = bioTextarea.value.length;
    charCount.textContent = `${count}/200`;

    charCount.classList.remove('warning', 'danger');
    if (count > 180) {
        charCount.classList.add('warning');
    }
    if (count > 200) {
        charCount.classList.add('danger');
    }
}

bioTextarea.addEventListener('input', updateCharCount);
updateCharCount();



document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.settings-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.style.opacity = '0';
        card.style.animation = 'fadeIn 0.5s ease forwards';
    });
});