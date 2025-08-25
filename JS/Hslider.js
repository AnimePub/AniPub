const Slides = document.querySelectorAll(".slide");
const EhName = document.querySelectorAll(".AniName");
let init = 0;

Slides.forEach((value, i) => {
    value.style.left = `${i*100}%`
})



const goleft = () => {
    init++;
    if (init === 4) {
        init = 0
    }

    SlidShow();

}

function SlidShow() {
    Slides.forEach(value => {
        value.style.transform = `translateX(-${init*100}%)`


    })
}
setInterval(() => {
    goleft()
}, 5000);


EhName.forEach(value => {
    const ehe = value.innerText

    if (ehe.length >= 30) {
        value.style.fontSize = "30px"
    }
})