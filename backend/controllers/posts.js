const { Console } = require("node:console");
const Post = require("../models/post");

exports.createPost = (req, res, next) => {
    const url = req.protocol + '://' + req.get("host");
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename,
        creator: req.userData.userId
    });
/*     console.log(req.userData)
    return res.status(200).json({}) */
    post.save().then(createdPost => {
        res.status(201).json({
            message: 'Post added sucessfully',
            post: {
                ...createdPost,
                id: createdPost._id,
/*                 title: createdPost.title,
                content: createdPost.content,
                imagePath: createdPost.imagePath */
            }
        });
    })
    .catch(error => {
        res.status(500).json({
            message: "Creating a post failed!"
        })
    });
}

exports.updatePost = (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
        const url = req.protocol + '://' + req.get("host");
        imagePath = url + "/images/" + req.file.filename
    }

    const post = {
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creator: req.userData.userId
    }
    Post.updateOne({_id: req.params.id, creator:req.userData.userId }, post).then(result => {
        if (result.n > 0) {
            res.status(200).json({ message: "Update successful!"});
        } else {
            res.status(401).json({ message: "Not authorized!" })
        }   
    })
    .catch(error => {
        res.status(500).json({
            message: "Couldn't update post!"
        })
    });
}

exports.getPosts = (req, res, next) => {
    const pageSize = +req.query.pageSize; //extraxting
    const currentPage = +req.query.page; //+ working w numbers
    const postQuery = Post.find();
    let fetchedPosts;
    if (pageSize && currentPage) {
        postQuery
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize); //limits amounts of documents
    }
    postQuery
    .then(documents => {
        fetchedPosts = documents;
        return Post.count();
    })
    .then(count => {
        res.status(200).json({
            message: 'Posts fetched succsessfully',
            posts: fetchedPosts,
            maxPosts: count
        });
    })
    .catch(error =>{
        res.status(500).json({
            message: "Fetching post failed!"
        })
    });
}

exports.getPost = (req, res, next) => {
    Post.findById(req.params.id).then(post => {
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({message: 'Post not found!'});
        }
    })
    .catch(error =>{
        res.status(500).json({
            message: "Fetching post failed!"
        })
    });;
}

exports.deletePost = (req, res, next) => {
    Post.deleteOne({_id: req.params.id, creator: req.userData.userId}).then(result => {
        console.log(result);
        if (result.n > 0) {
            res.status(200).json({ message: "Deletion successful!"});
        } else {
            res.status(401).json({ message: "Not authorized!" })
        }
    })
    .catch(error => {
        res.status(500).json({
            message: "Deleting post failed!"
        })
    });
}