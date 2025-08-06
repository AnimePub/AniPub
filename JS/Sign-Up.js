const form = document.querySelector("form");
const WarningMsge = document.querySelector(".r-n")
let wr = "";
form.addEventListener('submit',async (event)=>{
    event.preventDefault();
    const name = form.Name.value;
    const email = form.Email.value;
    const pass = form.Password.value;
    const cpass = form.cpass.value ;

    if(pass === cpass) {
        try {
         fetch("/Sign-Up",{
            method:"POST",
            body:JSON.stringify({name,email,pass}),
            headers:{"Content-Type":"application/json"}}
            )
            .then(response=>response.json())
            .then(data =>{
                
                if(data.includes("/Home")){
                    window.location.href= "/Notify"
                }
                    
                else {
                    wr = data[0].error;
                    
                    WarningMsge.innerText = wr;
                    wr = "";
                }
            })

        } catch (error) {
            wr =  "Couldn't Sent Request";
            WarningMsge.innerText = wr;
            wr ="";
            console.log(error);
        }
       
    }
    else {
        wr = "Password Didn't Match"
        WarningMsge.innerText = wr;
        wr = "";
    }
})
