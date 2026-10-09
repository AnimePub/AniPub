const sb = document.querySelector(".codeS");

const wr = document.querySelector(".warning");
sb.addEventListener('click',async ()=>{
    const user = document.querySelector(".username");
    if(user.value.length <= 6) {
        wr.innerHTML = `
        <span style="color:red";> Invalid Req <span>
        `
        setTimeout(()=>{
            wr.innerHTML= ""
        },3000);

}
else {
   const wa = await fetch("/forget",{
        method:"POST",
          headers: {
                        "Content-Type": "application/json"
                    },
        body:JSON.stringify({
            email : user.value 
        }     )       
    })
    let w =await wa.json();
    if(w === 3 || w === 0){
         wr.innerHTML = `
        <span style="color:red";> User not Found <span>
        `
        setTimeout(()=>{
            wr.innerHTML= ""
        },5000);
    }
    else {
         wr.innerHTML = `
        <span style="color:green";> Email Sent <span>
        `
        setTimeout(()=>{
            wr.innerHTML= ""
        },5000);
    }
}
})
