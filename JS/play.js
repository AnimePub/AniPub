 if (document.querySelector("iframe")) {
     const playB = document.querySelector(".Play-button");
     const LisT = document.querySelectorAll(".list");
     playB.addEventListener('click', () => {
         const i = window.location.pathname;

         const l = i.split("/");
         window.location.href = `/AniPlayer/${l[2]}/${l[3]}`
     })
 }