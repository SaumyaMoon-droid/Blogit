const form= document.querySelector("form");
form.addEventListener("submit", async (event)=>{
    event.preventDefault();
    const title=document.getElementById("titl").value;
    const content=document.getElementById("post").value;
    const tags=document.getElementById("tag").value;
    const userID=localStorage.getItem("userID");

    const response=await fetch("/api/posts",{
        method : "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
            userID : userID,
            title : title,
            content : content,
            tags : tags,
        })
    })
    
    const data= await response.json();
    alert(data.message);
    form.reset();
    location.reload();
})



async function yourAcc(){
    const ID=localStorage.getItem("ID");
    const username=localStorage.getItem("username");
    const response=await fetch(`/api/users/${ID}`,{
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
            ID : ID,
            username: username
        })
    })
    const accdata= await response.json();
    console.log(accdata.message);
    location.reload();
}

//like function
async function likePost(postID){
    const userID=localStorage.getItem("userID");
    if(!(userID)){
        alert("please log in");
        return ;
    }
    const response=await fetch(`/api/posts/${postID}/like`,{
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
            userID : userID,
        })
    })
    const data= await response.json();
    console.log(data.message);
    location.reload();
}

async function loadPosts(){
    const response=await fetch("/api/posts");
    const posts= await response.json();
    const feedBox=document.getElementById("feedBox");
    const currentUserId=localStorage.getItem("userID");
    const yourAcc=document.getElementById("accName");

    yourAcc.textContent=localStorage.getItem("username");

    posts.forEach((post)=>{
        // MySQL may return column names in different case, so read both
        const postId = post.ID ?? post.id;
        const postOwnerId = post.user_ID ?? post.user_id;
        const postBox=document.createElement("div");
        postBox.innerHTML=`
        <div class="prevpost">
        <h3>${post.title}</h3>
        <p><b>Posted By:</b>${post.USERNAME ?? post.username}</p>
        <p>${post.content}</p>
        <p><b>${post.tags}</b></p>
        <button 
            onClick="likePost(${post.id})"
            style=" border: none; cursor: pointer; background-color: rgb(255, 246, 234);;"
        >
        ❤️${post.likeCount}
        </button>
        `;
        // localStorage always returns a string, the DB returns a number -> compare as strings
        if(currentUserId !== null && String(currentUserId)===String(postOwnerId)){
            const deleteBtn=document.createElement("button");
            deleteBtn.innerText="delete";
            deleteBtn.innerHTML=`<div class="deletebtn">Delete</div>`;
            deleteBtn.addEventListener("click",  async ()=>{
                const response= await fetch(`/api/posts/${postId}`,{
                    method: "DELETE",
                    headers : {"Content-Type" : "application/json"},
                    body: JSON.stringify({
                        userID : currentUserId,
                    })
                });
                    const data= await response.json();
                    alert(data.message);
                    location.reload();
            })
            postBox.appendChild(deleteBtn);
        }
        
        feedBox.appendChild(postBox)
    })
}
loadPosts();

const logout=document.getElementById("logout");
logout.addEventListener("click", ()=>{
localStorage.removeItem("userID");
localStorage.removeItem("username");
alert("logout successful");
window.location.href="login.html";
})

const myp=document.querySelector(".mypbtn");
myp.addEventListener("click", function() {
    window.location.href="Youraccount.html";
})