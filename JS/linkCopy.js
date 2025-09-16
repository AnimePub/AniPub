const shareBTN = document.querySelector(".btn");
shareBTN.addEventListener('click',()=>{
    const value = window.location.href;
    navigator.clipboard.writeText(value);
    alert("Link Text Copied")
})
