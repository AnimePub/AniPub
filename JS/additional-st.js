const Genres = document.querySelectorAll(".genre")
let genreList = JSON.parse(localStorage.getItem("genre")) || [];

const setItem = (setItem) =>{
    genreList.push(setItem);
    localStorage.setItem("genre",JSON.stringify(genreList))
}
const spliceItem = (remover) => {
   const removed = genreList.splice(remover,1);
   localStorage.setItem("genre",JSON.stringify(genreList));
   return removed;
}
export const getItem = () =>{
    return JSON.parse(localStorage.getItem("genre")) ;
}

Genres.forEach(value=>{
    value.addEventListener('click',()=>{
        const genre = value.dataset.genre;
        if(genreList.includes(genre)) {
            const index = genreList.indexOf(genre);
           const splicedGenre = spliceItem(index);
           removeColor(splicedGenre);
        }
        else if (!genreList.includes(genre)) {
            setItem(genre);

        }
      
        addingColor ();
    })
})

addingColor ();
function addingColor () {
    if(genreList.length > 0 ) {
        genreList.forEach(value=>{
            document.querySelector(`.${value}`).style.color = "#ffe9e9";
            document.querySelector(`.${value}`).style.fontWeight ="bold"
            document.querySelector(`.${value}`).style.background = "rgb(49, 123, 49)";

        })
    }
}
function removeColor(splicedGenre) {
     document.querySelector(`.${splicedGenre}`).style.color = "rgb(35, 216, 35)";
    document.querySelector(`.${splicedGenre}`).style.background = "transparent";

}