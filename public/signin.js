const signupForm= document.getElementById("signin");
signupForm.addEventListener("submit", async (event)=>{
    event.preventDefault();

    const username=document.getElementById("Username").value;
    const email=document.getElementById("userEmail").value;
    const password=document.getElementById("password").value;

    const response= await fetch("/api/signin", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
            username : username,
            email : email,
            password : password,
        })
    })
    const data= await response.json();
    alert(data.message);
})