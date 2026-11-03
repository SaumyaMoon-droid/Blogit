const yourAcc=document.getElementById("accName");
yourAcc.textContent=localStorage.getItem("username");
async function loadMyPosts() {
    const userID = localStorage.getItem("userID");
    if (!userID) {
        window.location.href = "login.html";
        return;
    }
    const res = await fetch(`/api/users/${userID}/posts`);
    const posts = await res.json();
    const feedBox = document.getElementById("feedBox");
    posts.forEach(post => {
        const postId = post.ID ?? post.id;
        const box = document.createElement("div");
        box.innerHTML = `
            <div class="prevpost">
                <h3>${post.title}</h3>
                <p>${post.content}</p>
                <p><b>${post.tags}</b></p>
                <p>❤️ ${post.likeCount}</p>
                <button onclick="deletePost(${postId})">Delete</button>
            </div>`;
        feedBox.appendChild(box);
    });
}
async function deletePost(postId) {
    const userID = localStorage.getItem("userID");
    await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID })
    });
    location.reload();
}
document.getElementById("logout").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "login.html";
});
loadMyPosts();
const homebtn= document.querySelector(".homebtn");
document.addEventListener("click" ,function (){
    window.location.href="index.html";
})