const delButton = document.querySelectorAll(".remove-btn");

let lisT = "";

delButton.forEach(
    value => {
        value.addEventListener('click', () => {

            clearTimeout(lisT);
            const listId = value.dataset.del;
            fetch(`/PlayList/Delete/${listId}`, {
                    method: "DELETE",
                })
                .then(info => info.json())
                .then(data => {
                    if (data.includes("Delete Done")) {
                        window.location.reload()
                    } else {
                        console.log(data);
                    }

                })
        })
    }
)