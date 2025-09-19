const num = document.querySelector(".phone-Number");
const id = document.querySelector(".ID-Phone");
const submit  = document.querySelector(".submit-btn");

submit.addEventListener('click',()=>{
    const Number = num.value ;
    const ID = id.value;
    if(Number.length === 10 && ID.length > 0){
        fetch("/premium",{
            method:"POST",
            headers:{
                "Content-Type":"Application/Json"
            },
            body:JSON.stringify({Number,ID})
        })
        .then(response=>response.json())
        .then(info=>{
            if(info === 0) {alert("An Error While Submiting the form.. Contact the Admin")}  
                else if (info === 1) {window.location.href = "/Login"}
                    else {alert("Request Submitted Successfully")}
        })
    }
    else {
        alert("Maxlen of Number is 10 .... Please Check if your number is Correct and Everything is Fine")
    }
})