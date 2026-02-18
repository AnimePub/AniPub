const profileButton = document.querySelector(".profile-icon");
const searchInput = document.querySelectorAll('.searchbox');
const bOXS = document.querySelectorAll('.sbf');
const searchButton = document.querySelectorAll('.search-button');
let MSGEBOX = "";
profileButton.addEventListener('click', () => {
    window.location.href = `/Profile`
})

searchInput.forEach((value,i)=>{
    value.addEventListener("keyup",(e)=>{
    searchDB (i);
})
});

function   searchDB (i){
    if (searchInput[i].value.length > 2) {
        const index = searchInput[i].value ;
        fetch("/search/q",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({query:index})
        })
        .then(response=>response.json())
        .then(info=>{
            shower(info,i)
        })
    }
    else {
         MSGEBOX = "";
         bOXS.innerHTML = "";
        bOXS.style.display = "none"
    }
}

const shower = (info,i) =>{
      let fl = JSON.parse(info);
     if (fl.length > 1 ) {
        fl.forEach((value,i) => {
              const POSTER = value.Image;
                   const POSTERARY = POSTER.split("https://");
                   let LINKU = "";
                   if(POSTERARY.length > 1){
                       LINKU = "https://" + POSTERARY[1];
                   }
                   else {
                       LINKU = "https://www.anipub.xyz/" + POSTERARY[0];
                   }
            MSGEBOX += `
              <a style="text-decoration:none" href="/AniPlayer/${value.Id}/0" target="_blank" data-value="${i}"> <div class="fdivS" data-anime="${value.Id}">
                <img class="sdivImg" src="${LINKU}" alt="">
                <div>
                    <p class="sName">${value.Name}</p>
                    <p class="detS">
                        <span>ID: ${value.Id} </span>
                    </p>
                </div>
            </div> </a>
            `
            
        });
        if(i === 0) {
        bOXS[0].innerHTML = MSGEBOX;
        bOXS[0].style.display = "flex"
        MSGEBOX = "";
        }
        else {
        bOXS[1].innerHTML = MSGEBOX;  
        bOXS[1].style.display = "flex"
        MSGEBOX = "";
        }
      
    }
    //letter fix
    else {
      if(info === 0) {
        MSGEBOX = `
        <div class="fdivS">
            <p>Can't Find Any Account With That Info</p>
            </div>
        `
        if(i===0){
             bOXS[0].innerHTML = MSGEBOX;
        bOXS[0].style.display = "flex"
         
         MSGEBOX = "";
        }
        else {
 bOXS[1].innerHTML = MSGEBOX;
        bOXS[1].style.display = "flex"
            
         MSGEBOX = "";
        }
       
    }
   
    else {
      MSGEBOX = `
       <a href="/AniPlayer/${fl.Id}/0" target="_blank"> <div class="fdivS" data-anime="${fl.Id}">
                <img class="sdivImg" src="${fl.Image}" alt="">
                <div>
                    <p class="sName">${fl.Name}</p>
                    <p class="detS">
                        <span>ID: ${fl.Id} </span>
                    </p>
                </div>
            </div> </a>
      `
       bOXS.innerHTML = MSGEBOX;
        bOXS.style.display = "flex"
         MSGEBOX = "";
    }
}
}


searchButton.forEach((value,i)=>{
    value.addEventListener('click',()=>{
    if (searchInput[i].value.length > 2) {
        const searchString = searchInput.value ;
        window.location.href = `/search/q?query=${searchString}`
    }
    else {
        alert("Please Enter A Query")
    }
})
})

document.body.addEventListener("keyup",(e)=>{
    if(e.key === "Enter" ) {
        if(searchInput[0].value.length > searchInput[1].value.length ) {
                const searchString = searchInput[0].value ;
        window.location.href = `/search/q?query=${searchString}`
        }
        else {
                const searchString = searchInput[1].value ;
        window.location.href = `/search/q?query=${searchString}`
        }
     
    }
})

// document.addEventListener('DOMContentLoaded', function() {
//     
   
    
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