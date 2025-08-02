const select = document.querySelector("#gender");
const girls_pic = document.querySelector(".girls-pfp");
const boys_pic = document.querySelector(".boys-pfp");
const pfp = document.querySelectorAll(".pfp");

select.addEventListener('change',()=>{
    GenderStatus ();
})

let Gender = JSON.parse(localStorage.getItem("gender")) ||false ;

if (!Gender) {
    boys_pic.style.display = "flex";
    girls_pic.style.display = "none";
    select.value = "Male"
}
else {
    boys_pic.style.display = "none";
    girls_pic.style.display = "flex";
    select.value = "Female"
}

function GenderStatus () {
    if (select.value === "Male") {
        boys_pic.style.display = "flex";
        girls_pic.style.display = "none";
        updateGender ("Male")

    }
    else {
        boys_pic.style.display = "none";
        girls_pic.style.display = "flex";
        updateGender ("Female")
    }
}

function updateGender (name) {
    if(name ==="Male"){
        Gender = false ;
        localStorage.setItem("gender",JSON.stringify(Gender));
    }
    else if (name === "Female") {
        Gender = true ;
        localStorage.setItem("gender",JSON.stringify(Gender));
  
    }
}

let image = JSON.parse(localStorage.getItem("image")) || [];


pfp.forEach(value =>{
    value.addEventListener('click',()=>{
        const name = value.dataset.name;
        checkerPfp(name);
        imageSammer();
        imageStyler();
        
    })
})

const checkerPfp = (data) =>{
    if (image.includes(data)) {
        index = image.indexOf(data);
        image.splice(index,1);
    }
    else if (image.length > 0) {
       
        image = [];
       image.push(data);
    }
    else {
        image.push(data);
    }
    updateImage();
}
const updateImage = () =>{
    localStorage.setItem("image",JSON.stringify(image));
}
const imageStyler = () => {
    if (image.length > 0) {
        let pfpname = image[0];
        pfpname = pfpname.split(".");
        pfpname = pfpname[0];
        pfpname = pfpname.toLowerCase();
        const Simage = document.querySelector(`.${pfpname}`)
        Simage.style.height = "96px";
        Simage.style.width = "96px";
        Simage.style.border = "2px dotted #00ff00"
    }
}

imageStyler ();

const imageSammer = (data) =>{
    pfp.forEach(value =>{
        value.style.height = "100px";
        value.style.width = "100px";
        value.style.border = "none"
 
    })
}

// This is for Bio 

let BIO = [];
const bioEditor = document.querySelector("textarea");
const bioCount = document.querySelector(".count");
const wrBio = document.querySelector(".wrn")
bioEditor.addEventListener('keyup',(event)=>{
 const bio = bioEditor.value;
 BIO =[bio];
 
 bioCount.innerHTML = bio.length;
 if (bio.length > 50) {
    wrBio.style.color = "red"
    bioCount.style.color = "red"
 }
 else {
    wrBio.style.color = "white"
    bioCount.style.color = "white"
 }
})