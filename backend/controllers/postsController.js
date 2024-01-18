const fs=require("fs");
const path=require("path");
const asyncHandler=require("express-async-handler");
const {Post,validateCreatePost,validateUpdatePost}=require("../models/Post");
const {cloudinaryUploadImage, cloudinaryRemoveImage}=require("../utils/cloudinary");
const {Comment}=require("../models/Comment");

/**
 * @desc Create new post
 * @router /api/posts
 * @method POST
 * @access public
 */

module.exports.createPostCtrl=asyncHandler(async(req,res)=>{
    if(!req.file){
        return res.status(403).json({message:"No image provided"});
    }

    const{error}=validateCreatePost(req.body);
    if(error){
        return res.status(400).json({message:error.details[0].message});
    }

    const imagePath=path.join(__dirname,`../images/${req.file.filename}`);
    const result=await cloudinaryUploadImage(imagePath);

    const post=await Post.create({
        title:req.body.title,
        description:req.body.description,
        category:req.body.category,
        user:req.user.id,
        image:{
            url:result.secure_url,
            publidId:result.publidId
        }
    });

    res.status(201).json(post);

    fs.unlink(imagePath);
});

/**
 * @desc Get all posts 
 * @router /api/posts
 * @method GET
 * @access public
 */

module.exports.getAllPostsCtrl=asyncHandler(async (req,res)=>{
    const POST_PER_PAGE=3;
    const{pageNumber,category}=req.query;
    let posts;

    if(pageNumber){
        posts=await Post.find()
        .skip((pageNumber-1)*POST_PER_PAGE)
        .limit(POST_PER_PAGE)
        .sort({createdAt:-1})
        .populate("user",["-password"]);
    }else if(category){
        posts=await Post.find({category}).sort({createdAt:-1})
        .populate("user",["-password"]);
    }else{
        posts=await Post.find().sort({createdAt:-1})
        .populate("user",["-password"]);

    }
    res.status(200).json(posts);
});

/**
 * @desc Get single post    
 * @router /api/posts/:id
 * @method GET
 * @access public
 */

module.exports.getSinglePostCtrl=asyncHandler(async (req,res)=>{
    const post=await Post.findById(req.params.id)
    .populate("user",["-password"])
    .populate("comments");
    if(!post){
        return res.status(404).json({message:"post not found"});
    }

    res.status(200).json(post);
});

/**
 * @desc Get posts count 
 * @router /api/posts/count
 * @method GET
 * @access public 
 */


module.exports.getPostCountCtrl=asyncHandler(async (req,res)=>{
   const count=await Post.countDocuments();
   res.status(200).json(count);
});

/**
 * @desc Delete post   
 * @router /api/posts/:id
 * @method DELETE
 * @access private
 */

module.exports.deletePostCtrl=asyncHandler(async (req,res)=>{
    const post=await Post.findById(req.params.id);
    if(!post){
        return res.status(404).json({message:"post not found"});
    }

    if(req.user.isAdmin||req.user.id===post.user.toString()){
        await Post.findByIdAndDelete(req.params.id);

        if (post.image && post.image.publicId) {
            await cloudinaryRemoveImage(post.image.publicId);
        }
        

        await Comment.deleteMany({postId:post._Id});
        res.status(200).json(
            {
                message:"Post deleted successfully",
                postId:post._id
            }
        );
    } else{
        res.status(403).json({message:"Access denied"})
    }

 
});

/**
 * @desc Update post
 * @router /api/posts/:id
 * @method PUT
 * @access private
 */

module.exports.updatePostCtrl= asyncHandler(async(req,res)=>{
    const{error}=validateUpdatePost(req.body);

    if(error){
        return res.status(400).json({message:error.details[0].message});
    }

    const post=await Post.findById(req.params.id);

    if(!post){
        return res.status(400).json({message:"Post not found"});
    }

    if(req.user.id!==post.user.toString()){
        return res.status(400).json({message:"Access denied"});
    }

    const updatedPost=await Post.findByIdAndUpdate(req.params.id,{
        $set:{
            title:req.body.title,
            description:req.body.description,
            category:req.body.category
        }
    },{new:true}).populate("user",["-password"]);

    res.status(200).json(updatedPost);
});

/**
 * @desc Update post image 
 * @router /api/posts/update-image/:id
 * @method PUT
 * @access private
 */

module.exports.updatePostImage= asyncHandler(async(req,res)=>{
    if(!req.file){
        return res.status(400).json({message:"No image provided"});
    }

    const post=await Post.findById(req.params.id);

    if(!post){
        return res.status(400).json({message:"Post not found"});
    }

    if(req.user.id!==post.user.toString()){
        return res.status(400).json({message:"Access denied"});
    }

    if (post.image?.publicId){
        await cloudinaryRemoveImage(post.image.publicId);
    }

    const imagePath=path.join(__dirname,`../images/${req.file.filename}`);
    const result=await cloudinaryUploadImage(imagePath);

    const updatedPost=await Post.findByIdAndUpdate(req.params.id,{
        $set:{
            image:{
                url:result.secure_url,
                publicId:result.publicId
            }
        }
    },{new:true});

    res.status(200).json(updatedPost);

    fs.unlinkSync(imagePath);
});

/**
 * @desc Toggle like
 * @router /api/posts/like/:id
 * @method PUT
 * @access private
 */ 

module.exports.toggleLikeCtrl=asyncHandler(async(req,res)=>{
    const loggedInUser=req.user.id;
    const {id:postId}=req.params;

    let post=await Post.findById(postId);
    if(!post){
        return res.status(404).json({message:"Post not found"});
    }

    const isPostAlreadyLiked=post.likes.find((user)=>user.toString()===loggedInUser);

    if(isPostAlreadyLiked){
        post=await Post.findByIdAndUpdate(postId,{
            $pull:{likes:loggedInUser}
        },{new:true});
    }
    else{
        post=await Post.findByIdAndUpdate(postId,{
            $push:{likes:loggedInUser}
        },{new:true});
    }
    res.status(200).json(post); 
})