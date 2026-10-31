const loginform= document.querySelector("#login");

loginform.addEventListener("submit", async (event)=>{
event.preventDefault();

const email=document.getElementById("userEmail").value;
const password=document.getElementById("password").value;

const response= await fetch("/api/login", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
            email : email,
            password : password,
        })
    })
    const data= await response.json();
    alert(data.message);
    if(response.ok){
        console.log(data);
        console.log(data.userID);
        localStorage.setItem("userID",data.userID);
        localStorage.setItem("username",data.username);
        window.location.href="index.html"
    }
})
