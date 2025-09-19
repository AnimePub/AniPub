const change1 = document.querySelector(".change1");
const change2 = document.querySelector(".change2");
const change3 = document.querySelector(".change3");

change1.addEventListener('click',()=>{
    const value = Number(change1.dataset.value);
    if(value === 1) {
    fetch("privacy/hide/email",{
        method:"GET"
    })
    .then(response=>response.json())
    .then( info=>
       info=>{
        if(info === 0) {
            alert("There Was Some Problem");
        }
        else {
            window.location.reload()
        }
    }
    )
}
else {
    fetch("privacy/show/email",{
        method:"GET"
    })
    .then(response=>response.json())
    .then( info=>{
        if(info === 0) {
            alert("There Was Some Problem");
        }
        else {
            window.location.reload()
        }
    }
    )
}

})
change2.addEventListener('click',()=>{
      const value = Number(change2.dataset.value);
   if(value === 1) {
      fetch("privacy/hide/address",{
        method:"GET"
    })
    .then(response=>response.json())
    .then( info=>{
        if(info === 0) {
            alert("There Was Some Problem");
        }
        else {
            window.location.reload()
        }
    }
    )}
    else {
         fetch("privacy/show/address",{
        method:"GET"
    })
    .then(response=>response.json())
    .then( info=>{
        if(info === 0) {
            alert("There Was Some Problem");
        }
        else {
            window.location.reload()
        }
    }
    )
    }

})

change3.addEventListener('click',()=>{
      const value = Number(change3.dataset.value);
    if (value === 1) {
      fetch("privacy/hide/rlts",{
        method:"GET"
    })
    .then(response=>response.json())
    .then(
        info=>{
        if(info === 0) {
            alert("There Was Some Problem");
        }
        else {
            window.location.reload()
        }
    }
    )
}
else {
     fetch("privacy/show/rlts",{
        method:"GET"
    })
    .then(response=>response.json())
    .then(
      info=>{
        if(info === 0) {
            alert("There Was Some Problem");
        }
        else {
            window.location.reload()
        }
    }
    )
}
})
