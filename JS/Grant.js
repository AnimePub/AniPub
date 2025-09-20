const grant = document.querySelectorAll(".grant");

grant.forEach(value=>{
    value.addEventListener('click',()=>{
        const id = value.dataset.value ;
        const type = value.dataset.type;
        if(type === "grant") {
       fetch(`/Admin/Grant/Premium/${id}`)
       .then(response=>response.json())
       .then(info=>{
        if(info === 0) {
            window.location.reload();
        }
        else if (info ===1 ) {
            alert("Already Granted")
        }
       })
    }
    else {
         fetch(`/Admin/Revoke/Premium/${id}`)
       .then(response=>response.json())
       .then(info=>{
        if(info === 0) {
            window.location.reload();
        }
        else if (info ===1 ) {
            alert("Already Revoked")
        }
       })
    }
    }) 

})