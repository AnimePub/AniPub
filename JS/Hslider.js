const Slides = document.querySelectorAll(".slide");
const EhName = document.querySelectorAll(".AniName");
let init = 0;
const names = document.querySelectorAll(".AniName")
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

 names.forEach(value=>{
        if(value.innerHTML.length >= 30) {
              value.style.fontSize = "25px"
        }
        else {
        value.style.fontSize = "40px"
    }
})


document.onchange = function (params) {
    if (window.innerWidth < 830) {
    
    names.forEach(value=>{
        if(value.innerHTML.length >= 30) {
              value.style.fontSize = "15px"
        }
        else {
        value.style.fontSize = "20px"
    }
    })
}
     if (window.innerWidth > 830) {
        names.forEach(value=>{
        if(value.innerHTML.length >= 30) {
              value.style.fontSize = "25px"
        }
        else {
        value.style.fontSize = "40px"
    }
    })
     }

}
if (window.innerWidth < 830) {
    names.forEach(value=>{
        if(value.innerHTML.length >= 30) {
              value.style.fontSize = "15px"
        }
        else {
        value.style.fontSize = "20px"
    }
    })

}

if (window.innerWidth < 405) {
     names.forEach(value=>{
        if(value.innerHTML.length >= 30) {
              value.style.fontSize = "15px"
        }
        else {
        value.style.fontSize = "20px"
    }
})
}