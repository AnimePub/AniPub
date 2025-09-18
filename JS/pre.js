const num = document.querySelector(".phone-Number");
const id = document.querySelector(".ID-Phone");
const submit  = document.querySelector(".submit-btn");

submit.addEventListener('click',()=>{
    const Number = num.value ;
    const ID = id.value;
    if(Number.length === 11 && ID.length > 0){
        fetch("/premium",{
            method:"POST",
            headers:{
                "Content-Type":"Application/Json"
            },
            body:JSON.stringify({Number,ID})
        })
        .then(res=>res.json())
        .then(info=>{
            console.log(info)
        })
    }
    else {
        alert("Please Check if your number is Correct and Everything is Fine")
    }
})