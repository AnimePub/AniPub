if (data.includes("Already")) {
    document.querySelector(".notify-span").innerHTML = `Already In The List`
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}