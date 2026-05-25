const addButtons = document.querySelectorAll(".Add-button");

addButtons.forEach(
    value => {
        value.addEventListener('click', async() => {
            const AniID = value.dataset.animeWId;
            const EpID = value.dataset.animeWEid;
             const dataRf = await fetch("/authmal/refresh")
    let infoRf = dataRf.json()
fetch("/PlayList/Update", {
                    method: "POST",
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify({
                        AniID,
                        EpID
                    })
                })
                .then(response => response.json())
                .then(data => {
                    checking(data);
                })
                console.log(infoRf);
    
            
        })
    }
)

function checking(data) {
    const toast = document.getElementById('save-toast');
    if (data.includes("PlayList Updated")) {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    } else if (data.includes("/Login")) {
        window.location.href = "/Login"
    }
}