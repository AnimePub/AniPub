const input1 = document.querySelector(".input1");
const input2 = document.querySelector(".input2");
const input3 = document.querySelector(".input3");

const change1 = document.querySelector(".change1");
const change2 = document.querySelector(".change2");
const change3 = document.querySelector(".change3");

change1.addEventListener("click", () => {
    const value = input1.value;
    pvChange(value, "name");
})
change2.addEventListener("click", () => {
    const value = input2.value;
    pvChange(value, "mail");
})
change3.addEventListener("click", () => {
    const value = input3.value;
    pvChange(value, "pass");
})
const endpoint = "/data/change/"
const pvChange = (value, data) => {
    if (data === "name") {
        Fetch(value, "name");
    } else if (data === "mail") {
        Fetch(value, "mail");
    } else if (data === "pass") {
        Fetch(value, "pass");
    }
}

function Fetch(data, type) {
    const AlurBody = {
        info: data,
        type
    };
    fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "Application/json"
            },
            body: JSON.stringify(AlurBody)
        })
        .then(response => response.json())
        .then(info => {
            if (info === 1) {
                NotifyS(1);
            } else if (info === 2) {
                NotifyS(2);
            } else if (info === 3) {
                NotifyS(3);
            }
        })
}


function NotifyS(v) {
    const toast = document.getElementById('save-toast');
    const notifys = document.querySelector(".notify-span");
    if (v === 1) {
        notifys.innerText = "Profile Name Changed"
    } else if (v === 2) {
        notifys.innerText = "Request Done"
    } else {
        notifys.innerText = "Password Changed"
    }
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}