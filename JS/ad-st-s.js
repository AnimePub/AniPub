// import { getItem } from "./additional-st.js";
// import { Converter } from "./ad-st-converter.js";
// let finalAdSt = JSON.parse(localStorage.getItem("finalAdst"))||[];

// const setAdSt = (r,a,b) => {
//     const Alu = Converter(Number(r),Number(b));

//     const rl =  Alu.r;
   
//     const blood = Alu.b;
//     finalAdSt.push(
//      {
//        Relation: rl
//      },
//      {
//         address: a
//      },
//      {
//         bloodGroup : blood
//      },
//      {
//         Genre: getItem(),
//      }     
//     )
//      localStorage.setItem("finalAdst",JSON.stringify(finalAdSt))
// };

// const clearAdst = () =>{
//    finalAdSt.splice(0,finalAdSt.length);
//    localStorage.setItem("finalAdst",JSON.stringify(finalAdSt));
// }
// const relation = document.getElementById("rlts");
// const addr = document.querySelector(".addr");
// const bloodG = document.getElementById("bloodgroup");
// const atstSave = document.querySelector(".atst-save");

// atstSave.addEventListener('click',()=>{
//     const rlts = relation.value ;
//     const address = addr.value;
//     const bloodGroup = bloodG.value;
//     clearAdst();
//     setAdSt(rlts,address,bloodGroup);
//     console.log(finalAdSt);

//     // now we will fetch it to the server
//    fetch("Settings/ad-st",{
//       method:"POST",
//       headers:{"content-type":"application/json"},
//       body:JSON.stringify({finalAdSt})
//    })
//    .then (info=>info.json())
//    .then(data =>{
//       redirect (data);
//    })
// })

export function redirect (data) {
   if(data.includes("/Info Saved")) {
   const toast = document.getElementById('save-toast');
          toast.classList.add('show');
             setTimeout(() => {
                toast.classList.remove('show');
                }, 3000);

   }
   else if (data.includes("/Login")) {
      window.location.href = "/Login"
   }
   else {
      console.log("There is a error with internal server ");
   }
}