const profileButton = document.querySelector(".profile-icon");
const searchInput = document.querySelector('.searchbox');
const bOXS = document.querySelector('.sbf');
let MSGEBOX = "";
profileButton.addEventListener('click', () => {
    window.location.href = `/Profile`
})

searchInput.addEventListener("keyup",(e)=>{
    searchDB ();
})

function   searchDB (){
    if (searchInput.value.length > 2) {
        const index = searchInput.value ;
        fetch("/search/q",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({query:index})
        })
        .then(response=>response.json())
        .then(info=>{
            shower(info)
        })
    }
    else {
         MSGEBOX = "";
         bOXS.innerHTML = "";
        bOXS.style.display = "none"
    }
}

const shower = (info) =>{
    if(info === 0) {
        MSGEBOX = `
        <div class="fdivS">
            <p>Can't Find Any Account With That Info</p>
            </div>
        `
        bOXS.innerHTML = MSGEBOX;
        bOXS.style.display = "flex"
    }
    else {
      let fl = JSON.parse(info);
      MSGEBOX = `
        <div class="fdivS" data-anime="${fl.Id}">
                <img class="sdivImg" src="${fl.Image}" alt="">
                <div>
                    <p class="sName">${fl.Name}</p>
                    <p class="detS">
                        <span>ID: ${fl.Id} </span>
                    </p>
                </div>
            </div>
      `
       bOXS.innerHTML = MSGEBOX;
        bOXS.style.display = "flex"

    }
}


// document.addEventListener('DOMContentLoaded', function() {
//     const searchButton = document.querySelector('.search-button');
   
    
//     if (searchButton && searchInput) {
//         searchButton.addEventListener('click', function(e) {
//             e.preventDefault();
//             performSearch();
//         });
        
//         searchInput.addEventListener('keypress', function(e) {
//             if (e.key === 'Enter') {
//                 e.preventDefault();
//                 performSearch();
//             }
//         });
        
//         function performSearch() {
//             const query = searchInput.value.trim();
//             if (query.length > 0) {
//                 window.location.href = `/Search?genre=${encodeURIComponent(query)}`;
//             } else {
//                 alert('Please enter a search term');
//             }
//         }
//     }
// });