const input1 = document.querySelector(".input1");
const input2 = document.querySelector(".input2");
const input3 = document.querySelector(".input3");

const change1 = document.querySelector(".change1");
const change2 = document.querySelector(".change2");
const change3 = document.querySelector(".change3");

change1.addEventListener("click", () => {
    const value = input1.value;
     if(value.length < 3) {
        alert("Min Length Is 3")
     }
     else {
        pvChange(value, "name");
     }
    
})
function mailValidetor (mail) {
    if(mail.length >= 10) {
        return true;
    }
    else {
        return false ;
    }
}
change2.addEventListener("click", () => {
    const value = input2.value;
    const mailChecker = value.split("www.");
    let finalMail = "";
    if (mailChecker.length > 1) {
        finalMail = mailChecker[1];
    } 
    else {
        finalMail = mailChecker[0];
    }
    if(mailValidetor(finalMail) === false) {
        alert("Max Length is 10 bruh")
    }
    else {
       pvChange(finalMail, "mail");
    }
    
})

change3.addEventListener("click", () => {
    const value = input3.value;
    if(value.length < 8) {
        alert("Min Length Is 8")
    }
    else {
    pvChange(value, "pass");
    }
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
              const toast = document.getElementById('save-toast');
             const notifys = document.querySelector(".notify-span");
             notifys.innerText === "Wait ...Password Changing "
              toast.classList.add('show');
                setTimeout(() => {
                    toast.classList.remove('show');
                }, 3000);
            if (info === 1) {
                NotifyS(1);
            } else if (info === 2) {
                NotifyS(2);
            } else if (info === 3) {
                NotifyS(3);
            }
            else if (info === 4) {
                 NotifyS(4);
            }
             else if (info === 5) {
                 NotifyS(5);
            }
             else if (info === 6) {
                 NotifyS(6);
            }
             else if (info === 7) {
                 NotifyS(7);
            }
            else if (info === 8) {
                 NotifyS(8);
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
    } else if (v=== 3){
        notifys.innerText = "Password Changed"
    }
    else if (Number(v)===4) {
        notifys.innerText = "Password Recently Changed"
    }
    else if (Number(v)===5) {
        notifys.innerText = "Email Address Already in Use"
    }
    else if (Number(v)===6) {
        notifys.innerText = "Email Account Is Not Valid"
    }
     else if (Number(v)===7) {
        notifys.innerText = "Name length is small"
    }
     else if (Number(v)===8) {
        notifys.innerText = "Req already made recently"
    }
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}