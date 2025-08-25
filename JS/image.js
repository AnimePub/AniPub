const select = document.querySelector("#gender");
const girls_pic = document.querySelector(".girls-pfp");
const boys_pic = document.querySelector(".boys-pfp");
const pfp = document.querySelectorAll(".pfp");

select.addEventListener('change', () => {
    GenderStatus();
})

let Gender = JSON.parse(localStorage.getItem("gender")) || false;

if (!Gender) {
    boys_pic.style.display = "flex";
    girls_pic.style.display = "none";
    select.value = "Male"
} else {
    boys_pic.style.display = "none";
    girls_pic.style.display = "flex";
    select.value = "Female"
}

function GenderStatus() {
    if (select.value === "Male") {
        boys_pic.style.display = "flex";
        girls_pic.style.display = "none";
        updateGender("Male")

    } else {
        boys_pic.style.display = "none";
        girls_pic.style.display = "flex";
        updateGender("Female")
    }
}

function updateGender(name) {
    if (name === "Male") {
        Gender = false;
        localStorage.setItem("gender", JSON.stringify(Gender));
    } else if (name === "Female") {
        Gender = true;
        localStorage.setItem("gender", JSON.stringify(Gender));

    }
}

let image = JSON.parse(localStorage.getItem("image")) || [];


pfp.forEach(value => {
    value.addEventListener('click', () => {
        const name = value.dataset.name;
        checkerPfp(name);
    })
})

const checkerPfp = (data) => {
    if (image.includes(data)) {
        index = image.indexOf(data);
        image.splice(index, 1);
    } else if (image.length > 0) {

        image = [];
        image.push(data);
    } else {
        image.push(data);
    }
    updateImage();
}
const updateImage = () => {
    localStorage.setItem("image", JSON.stringify(image));
}


const imageSammer = (data) => {
    pfp.forEach(value => {
        value.style.height = "100px";
        value.style.width = "100px";
        value.style.border = "none"

    })
}