const shareBTN = document.querySelector(".share-btn");
shareBTN.addEventListener('click',()=>{
    const value = window.location.href;
    navigator.clipboard.writeText(value);
    alert("Link Text Copied")
})
