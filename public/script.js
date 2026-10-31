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

async function loadPosts(){
    const response=await fetch("/api/posts");
    const posts= await response.json();
    const feedBox=document.getElementById("feedBox");
    const currentUserId=localStorage.getItem("userID");

    posts.forEach((post)=>{
        // MySQL may return column names in different case, so read both
        const postId = post.ID ?? post.id;
        const postOwnerId = post.user_ID ?? post.user_id;
        const postBox=document.createElement("div");
        postBox.innerHTML=`
        <div style="background-color: white; width: 300px;">
        <h3>${post.title}</h3>
        <p><b>Posted By:</b>${post.USERNAME ?? post.username}</p>
        <p>${post.content}</p>

        `;
        // localStorage always returns a string, the DB returns a number -> compare as strings
        if(currentUserId !== null && String(currentUserId)===String(postOwnerId)){
            const deleteBtn=document.createElement("button");
            deleteBtn.innerText="delete";
            deleteBtn.innerHTML=`<div class="deletebtn" style="background-color: brown; color:bisque;">Delete</div>`;
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