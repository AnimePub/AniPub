const shareBTN = document.querySelectorAll(".btn");
shareBTN.forEach(value=>{
    value.addEventListener('click',()=>{
        const data = value.dataset.value ;
        if(data === "share") {
              const Value = window.location.href;
    navigator.clipboard.writeText(Value);
    alert("Link Text Copied")
        }
        else if (data === "edit") {
            window.location.href = "/Settings"
        }
  
})

})
