const express = require("express");
const postsData = require("./data/posts.json");
const fs = require("fs");
const app = express();

//pass incoming data
app.use(express.json());

//Routing
//Home Page
app.get("/", function (req, res) {
  res.send("Home Paga");
});
// Fetch all posts
app.get("/posts", function (req, res) {
  res.json({
    message: "Posts Fetched Successfully",
    postsData,
  });
});

//Create Post
app.post("/posts", function (req, res) {
  //get the post from user
  const newPost = req.body;
  //push the new post into existing post
  postsData.unshift({
    ...newPost,
    id: postsData.length.toString(),
  });
  console.log(postsData);
  //write to the file
  fs.writeFile("data/posts.json", JSON.stringify(postsData), function (err) {
    if (err) {
      console.log(err);
    }
    //send message to the user
    res.json({
      message: "Post Created Successfully",
    });
  });
});

// Put the post
//app.put("/posts/:id", function (req, res) {
//res.send("Post is putted successfully ");
//});

//Update post
app.put("/posts/:id", function (req, res) {
  //get the dynamic id === params
  const id = req.params.id;
  const { url, title, description } = req.body;
  //find the post to update
  const foundPost = postsData.find(function (post) {
    return post.id === id;
  });
  if (!foundPost) return res.json({ msg: "Post not found" });
  //filter out all post with the post found
  const filteredPosts = postsData.filter((post) => post.id !== id);
  //update the found post
  foundPost.title = title;
  foundPost.url = url;
  foundPost.description = description;
  //push the updated post in to filtered posts array
  filteredPosts.unshift(foundPost);
  //write to the file
  fs.writeFile(
    "data/posts.json",
    JSON.stringify(filteredPosts),
    function (err) {
      if (err) {
        console.log(err);
      }
      //send message to the user
      res.json({
        message: "Post updated Successfully",
      });
    }
  );
});

// Delete Post
app.delete("/posts/:id", function (req, res) {
  //get the id
  const id = req.params.id;
  const filteredPosts = postsData.filter(function (post) {
    return post.id !== id;
  });
  //write to the file
  fs.writeFile(
    "data/posts.json",
    JSON.stringify(filteredPosts),
    function (err) {
      if (err) {
        console.log(err);
      }
      //send message to the user
      res.json({
        message: "Post deleted Successfully",
      });
    }
  );
});

// Feteh single post
app.get("/posts/:id", function (req, res) {
  //get the id of the post
  const id = req.params.id;
  //find post id
  const postFound = postsData.find((post) => {
    return post.id === id;
  });
  if (!postFound) {
    res.json({
      message: "Post not found",
    });
  } else {
    // data will send the user
    res.json({ postFound });
  }
});

//Create server
app.listen(9000, function (req, res) {
  console.log("Server is running");
});
