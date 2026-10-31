const express = require("express");
const mysql = require("mysql2");
const app = express();
const PORT = 3000;
const db= mysql.createConnection({

    host: "localhost",
    user: "root",
    password: "Saumya@07",
    database: "blog_db"
})
db.connect((err)=>{
    if(err){
        console.log("ERROR:",err);
    }
    else{
        console.log("connected to mysql");
    }
})
app.use(express.json());
app.get("/",(req,res)=>{
    res.redirect("signin.html");
});
app.use(express.static("public"));
app.post("/api/posts",(req,res)=>{
    const {userID,title,content,tags}=req.body;
    const sql=`INSERT INTO POSTS (user_ID,title,content,tags) VALUES (?,?,?,?)`;
    db.query(sql,[userID,title,content,tags],(err,result)=>{
        if(err){
        console.log("ERROR:",err);
        return res.status(500).json({
            message: "Error"
        });}
        res.json({
            message: "Post created successfully"
        });
    })
})

app.get("/api/posts",(req,res)=>{
    const sql=`SELECT POSTS.*,USERS.USERNAME, 
            (
                SELECT COUNT (*)
                FROM LIKES
                WHERE LIKES.postId=posts.id
            ) AS likeCount
             FROM POSTS
             JOIN USERS ON POSTS.user_ID=users.ID
             ORDER BY POSTS.CREATED_AT DESC
    `;
    db.query(sql,(err,results)=>{
        if(err){
        console.log("ERROR:",err);
        return res.status(500).json({
            message: "Error"
        });
    }
    res.json(results);
    });
});

app.post("/api/signin",(req,res)=>{
    const {username, email, password}=req.body;
    const sql=`
        INSERT INTO USERS (username,email,password) VALUES (?,?,?);
    `;
    db.query(sql,[username,email,password],(err,result)=>{
        if(err){
            console.log("Error",err);
            return res.status(500).json({
                message : "error account cannot be made"
            });
        }
        res.json({
            message: "Account created successfully" 
        })
    })
})

app.post("/api/login",(req,res)=>{
    const {email,password}=req.body;
    const sql=`
         SELECT * FROM USERS WHERE email=? AND password=?;
    `;
    db.query(sql,[email,password],(err,results)=>{
        if(err){
            console.log("Error",err);
            return res.status(500).json({
                message : "error account cannot be found"
            });
        }
        if(results.length===0){
            return res.status(401).json({
                message : "please enter the details"
            })
        }
        const user=results[0];
        res.json({
            message : "logged in successfully",
            userID: user.ID,
            username : user.username
        })
    })
})

app.delete("/api/posts/:ID",(req,res)=>{
    const postID=req.params.ID;
    const userID=req.body.userID;
    const sql="DELETE FROM POSTS WHERE ID= ? AND user_ID=?";
    db.query(sql,[postID,userID],(err,result)=>{
        if(err){
            console.log("Error",err);
            return res.status(500).json({
                message : "POST can not be deleted"
            });
        }
        if(result.affectedRows===0){
            return res.status(403).json({message : "Post not found or you are not the owner"});
        }
        res.json({message : "Post deleted" })
    })
})

app.post("/api/posts/:id/like",(req,res)=>{
    const postId=req.params.id;
    const userId=req.body.userID;
    const checkSql=`
    SELECT * FROM LIKES
    WHERE userId=? AND postId=? 
    `;
    db.query(checkSql, [userId,postId], (err,results)=>{
         if(err){
            console.log("Error",err);
            return res.status(500).json({
                message : "error in like count"
            });
        }
        if(results.length>0){
            const deleteSql=`DELETE FROM LIKES WHERE userId=? AND postId=?`;
            db.query(deleteSql,[userId,postId],(err)=>{
                if(err){
            console.log("Error",err);
            return res.status(500).json({
                message : "error in like count"
            });
        }
        res.json({message : "Unliked!"});
            })
        }
        else{
            const insertSql=`INSERT INTO LIKES (userId,postId) VALUES (?,?)`;
            db.query(insertSql,[userId,postId],(err)=>{
                if(err){
            console.log("Error",err);
            return res.status(500).json({
                message : "error in like count"
            });
        }
        res.json({message: "Liked!"});
            })
        }
    })
})

app.listen(PORT, () => {
         console.log(`Server running on http://localhost:${PORT}`);});

