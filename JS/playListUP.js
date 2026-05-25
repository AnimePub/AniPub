const addButtons = document.querySelectorAll(".watch-list");

addButtons.forEach(
    value => {
        value.addEventListener('click',async () => {
            const AniID = value.dataset.animeid;
            const EpID = 0;
             const dataRf = await fetch("/refresh")
    let infoRf = dataRf.json()
    if(infoRf.success) {
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
    }
    else {
        console.log(infoRf.error);
    }
          
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
    } else if (data.includes("Already")) {
        document.querySelector(".notify-span").innerHTML = `Already In The List`
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}