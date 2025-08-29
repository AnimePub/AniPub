const SELECT = document.querySelector(".BULK");
const genreList = [];
const form5 = document.querySelector(".form5");
const updateExisting = document.querySelector(".update-existing")
const form3 = document.querySelector(".container3");
const BulkADDB = document.querySelector(".BulkAdd");

const genre = document.querySelectorAll(".genre");
genre.forEach(value => {
    value.addEventListener('click', () => {
        if (genreList.includes(value.dataset.genre)) {
            const Index = genreList.indexOf(value.dataset.genre);
            const alu = genreList.splice(Index, 1);
            GENRERMV(alu)

        } else {
            genreList.push(value.dataset.genre);
            GENRESHOW(genreList)
        }

    })
})

function GENRESHOW(value) {
    if (value.length > 0) {
        value.forEach(i => {
            document.querySelector(`.${i}`).style.color = `black`;
            document.querySelector(`.${i}`).style.background = `rgb(28, 247, 28)`;
        })
    }
}

function GENRERMV(value) {
    if (value.length > 0) {
        value.forEach(i => {
            document.querySelector(`.${i}`).style.color = `rgb(0, 255, 0)`;
            document.querySelector(`.${i}`).style.background = `transparent`;
        })
    }
}

const form = document.querySelector(".container");
const form1 = document.querySelector(".container2");

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (genreList.length > 0) {
        const INfo = {
            id: form.ID.value,
            epName: form.name.value,
            Name: form.Name.value,
            ip: form.ip.value,
            cover: form.cover.value,
            syn: form.syn.value,
            link: `src=`+form.link.value,
            title: form.title.value,
            aired: form.aired.value,
            premiered: form.Premiered.value,
            duration: form.Duration.value,
            Status: form.Status.value,
            malscore: form.MLScore.value,
            ratings: form.ratings.value,
            studios: form.Studios.value,
            producers: form.Producers.value,
            genre: genreList,
            des: form.Description.value,
            type: "iframe"
        }
        fetch("/upload", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(INfo)
            })
            .then(res => res.json())
            .then(info => {
                if (Number(info) === 1) {
                    alert("Anime Added Successfully");
                    window.location.reload();
                } else {
                    alert("There was an Error");
                    window.location.reload();
                }
            })

    } else {
        alert("Please Select atleast on Genre");
    }

})

form1.addEventListener('submit', (e) => {
    e.preventDefault();
    const INfo = {
        id: form1.ID.value,
        epName: form1.name.value,
        link:  `src=`+form1.link.value,
        title: form1.title.value,
    }
    fetch("/update/info", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(INfo)
        })
        .then(res => res.json())
        .then(info => {
            if (Number(info) === 1) {
                alert("Ep Added Successfully");
                window.location.reload();
            } else {
                alert("There was an Error");
                window.location.reload();
            }
        })

})



const upLoad = document.querySelector(".upLoad");
const upDate = document.querySelector(".upDate");

upLoad.addEventListener("click", () => {
    form.style.display = "flex";
    form1.style.display = "none";
    form3.style.display = "none";
    form5.style.display = "none";
    SELECT.style.display = "none"

})
upDate.addEventListener('click', () => {
    form1.style.display = "flex"
    form.style.display = "none";
    SELECT.style.display = "none"
    form3.style.display = "none"
    form5.style.display = "none"
})

const option = document.querySelector(".Slct");
const title = document.querySelector(".title-div");
const Name = document.querySelector(".name-div");
const link = document.querySelector(".link-div");
const img = document.querySelector(".img-div");


updateExisting.addEventListener('click', () => {
    form1.style.display = "none"
    form.style.display = "none"
    SELECT.style.display = "none"
    form3.style.display = "flex"
    form5.style.display = "none";
})

option.addEventListener("change", () => {
    if (option.value === "name") {
        Name.style.display = "flex";
        title.style.display = "none"
        link.style.display = "none";
        img.style.display = "none";

    } else if (option.value === "cover") {
        Name.style.display = "none";
        title.style.display = "flex"
        link.style.display = "none";
        img.style.display = "none";
    } else if (option.value === "link") {
        Name.style.display = "none";
        title.style.display = "none"
        link.style.display = "flex";
        img.style.display = "none";
    } else if (option.value === "image") {
        Name.style.display = "none";
        title.style.display = "none"
        link.style.display = "none";
        img.style.display = "flex";
    } else {
        Name.style.display = "none";
        title.style.display = "none"
        link.style.display = "none";
        img.style.display = "none";
    }
})

form3.addEventListener('submit', (e) => {
    e.preventDefault();
    let VAlue = "";
    if (option.value) {
        if (option.value === "name") {
            VAlue = form3.name.value;
        } else if (option.value === "cover") {
            VAlue = form3.title.value;
        } else if (option.value === "link") {
            VAlue =  `src=`+ form3.link.value;
        } else if (option.value === "image") {
            VAlue = form3.image.value;
        }
        const BODY = {
            ID: form3.ID.value,
            EP: form3.EP.value,
            TYPE: option.value,
            Value: VAlue,
        }
        const endpoint = "/update/ext"
        fetch(endpoint, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(BODY)
            })
            .then(res => res.json())
            .then(info => {
                if (Number(info) === 1) {
                    alert("Anime Edited Successfully");
                    window.location.reload();
                } else {
                    alert("There was an Error");
                    window.location.reload();
                }
            })


    } else {
        alert("Option Value Not Set Bro");
    }
})

BulkADDB.addEventListener('click', () => {
    SELECT.style.display = "flex"
})
let HTMLTOADD = "";
SELECT.addEventListener('change', () => {
    form1.style.display = "none"
    HTMLTOADD = "";
    form.style.display = "none"
    form3.style.display = "none"
    form5.style.display = "flex";
    generate(Number(SELECT.value))
})

const generate = (a) => {

    HTMLTOADD += `<div>
    <p>Anime ID</p>
    <input required    type="number" class="ID" name="ID" placeholder="ID">
</div>`
    for (let i = 0; i < a; i++) {
        HTMLTOADD += `<div>
        <p>Link ${i+1}</p>
            <input required class="link" type="text" name="link" placeholder=" ${i+1}">
        </div>`
    }
    HTMLTOADD += `<div class="button-div">
    <button>Submit</button>
</div>`

    form5.innerHTML = HTMLTOADD;
}

form5.addEventListener('submit', (e) => {
    e.preventDefault()
    const FormDATA = new FormData(form5);
    const ARD = FormDATA.getAll('link');
    const ID = form5.ID.value;
    const ARY = [];
    for (let i = 0; i < ARD.length; i++) {
        ARY.push({
            link:  `src=`+ ARD[i]
        })
    }
    const OBJ = {
        ID,
        ARY
    }

    fetch('/Bulk/Add', {
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(OBJ)
        })
        .then(res => res.json())
        .then(info => {
            if (Number(info) === 1) {
                alert("Bulk Added Successfully");
                window.location.reload();
            } else {
                alert("There was an Error");
                window.location.reload();
            }
        })

})