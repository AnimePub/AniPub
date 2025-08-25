const form = document.querySelector("form");
const Warning = document.querySelector(".warning");

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = form.Email.value;
    const pass = form.Password.value;

    try {
        fetch("/Login", {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    pass
                }),
            })
            .then(response => response.json())
            .then(data => {
                Changer(data)
            })

    } catch (error) {
        console.log(error)
    }

})

function Changer(data) {
    if (data.includes("Email or Pass is wrong")) {
        warning("Email or Pass is wrong")
    } else if (data.includes("Could't find any account with this account")) {
        warning("Could't find any account with this account")
    } else if (data.includes("/Home")) {
        window.location.href = "/Home";
    } else {
        warning("You can't login right now")
    }
}

let wrhtml = "";

function warning(value) {
    wrhtml = value;
    Warning.innerHTML = wrhtml;
}