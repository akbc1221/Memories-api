import PostMessage from '../models/postMessage.js';
import mongoose from 'mongoose';

//get post
export const getPosts = async (req,res)=>{
    try { 
        const postMessages = await PostMessage.find();
        res.status(200).send(postMessages);

    } catch (error) {
        res.status(404).send({message: error.message});
    }
}

//create post
export const createPost = async (req,res)=>{
    const post = req.body;
    const newPost = new PostMessage(post);

    try {
        await newPost.save();
        res.status(201).send(newPost);

    } catch (error) {
        res.status(409).send({message:error.message});
    }
}

//modify post
export const updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, message, creator, selectedFile, tags } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    const updatedPost = { creator, title, message, tags, selectedFile, _id: id };

    await PostMessage.findByIdAndUpdate(id, updatedPost, { new: true });

    res.send(updatedPost);
}

//delete post
export const deletePost = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    await PostMessage.findByIdAndRemove(id);

    res.send({ message: "Post deleted successfully." });
}


//like post
export const likePost = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);
    
    const post = await PostMessage.findById(id);

    const updatedPost = await PostMessage.findByIdAndUpdate(id, { likeCount: post.likeCount + 1 }, { new: true });
    
    res.send(updatedPost);
}