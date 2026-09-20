const input = document.querySelector("input");
const submit = document.querySelector(".submit");
const t1 = document.querySelector(".t1");
const t2 = document.querySelector(".t2");

submit.addEventListener('click',async()=>{
    let number = 0;
    if(input.value !== null && input.value !== undefined && input.value.length > 6) {
        number = input.value.replace(/\+/,'');
        number = Number(number);
       let aluQ = await fetch("/user/number",{
             method:"POST",
            headers:{
                "Content-Type":"Application/Json"
            },
            body:JSON.stringify({number})
        })

        aluQ = await aluQ.json();
        console.log(aluQ);
        if(aluQ.includes(1)) {
            alert("The Number could not be saved");
        }
        else {
            alert("Number saved and notification saved");
            window.location.reload();
        }
    }
    else {
        alert("Please provide a valid number")
    }
})

t1.addEventListener('click',()=>{
    fetch("/user/n/t1")
    .then(info=>info.json())
    .then(res=>{
        if(res.includes(0)) {
            alert("WP Notification Turned ON");
             window.location.reload();
        }
    })
})
t2.addEventListener('click',()=>{
    fetch("/user/n/t2")
    .then(info=>info.json())
    .then(res=>{
        if(res.includes(0)) {
            alert("WP Notification Turned OFF");
            window.location.reload();
        }
    })
})