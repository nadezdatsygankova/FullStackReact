
import PostModel from "../modules/Post.js";

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find();
    res.json(posts)
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "Failed to see posts"
    })
  }
}

export const create = async (req, res) => {
  try {

    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user:req.userId
    });
const post = await doc.save();
res.json(post);

  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "failed to post"
    })
  }
}