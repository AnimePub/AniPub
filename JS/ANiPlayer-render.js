const PlayButton = document.querySelectorAll(".watch-button");
PlayButton.forEach(value => {
    value.addEventListener('click', () => {
        const ID = value.dataset.animeid;
        setTimeout(() => {
            window.location.href = `/AniPlayer/${ID}/0`
        }, 1000);
    })
})