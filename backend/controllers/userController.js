const asyncHandler=require("express-async-handler");
const{ User, validateUpdateUser }=require("../models/User");
const bcrypt=require("bcryptjs");
const path=require("path");
const fs=require("fs");
const {cloudinaryRemoveImage,cloudinaryUploadImage, cloudinaryRemoveMultipleImage}=require("../utils/cloudinary");
const {Comment}=require("../models/Comment");
const {Post}=require("../models/Post");

/**
 * @desc Get user
 * @router /api/users/profile
 * @method GET
 * @access private
 */

module.exports.getAllUsersCtrl=asyncHandler(async (req,res)=>{
    const users=await User.find().select("-password").populate("posts");
    res.status(200).json(users);
});

/**
 * @desc Get user profile
 * @router /api/users/profile/:id
 * @method GET
 * @access public
 */

module.exports.getUserProfileCtrl=asyncHandler(async (req,res)=>{
    const user=await User.findById(req.params.id).select("-password").populate("posts");
    if(!user){
        res.status(400).json({message:"User does not exist"});
    }

    res.status(200).json(user);
});

/**
 * @desc Update user profile
 * @router /api/users/profile/:id
 * @method PUT
 * @access private
 */
module.exports.updateUserProfileCtrl=asyncHandler(async (req,res)=>{
    const {error}=validateUpdateUser(req.body);
    if(error){
        return res.status(400).json({message:error.details[0].message});
    }

    if(req.body.password){
        const salt=await bcrypt.genSalt(10);
        req.body.password=await bcrypt.hash(req.body.password,salt);  
    }

    const updatedUser=await User.findByIdAndUpdate(req.params.id,{
        $set:{
            username:req.body.username,
            password:req.body.password,
            bio:req.body.bio,
        }
    }, {new:true}).select("-password")
                  .populate("posts");
    
    res.status(200).json(updatedUser);
});

/**
 * @desc Get user count 
 * @router /api/users/count
 * @method GET
 * @access private
 */

module.exports.getUsersCountCtrl=asyncHandler(async (req,res)=>{
    const count=await User.countDocuments();
    res.status(200).json(count);
});

/**
 * @desc Profile photo upload
 * @router /api/users/profile/profile-photo-upload
 * @method POST
 * @access private
 */

module.exports.profilePhotoUploadCtrl=asyncHandler(async (req,res)=>{
    if(!req.file){
        res.status(403).json({message:"No file provided"}); 
    }

    const imagePath=path.join(__dirname,`../images/${req.file.filename}`);

    const result=await cloudinaryUploadImage(imagePath);
    
    const user=await User.findById(req.user.id);

    user.profilePhoto={
        url:result.secure_url,
        publicId:result.public_Id,
    };
    
    await user.save();
    
    if (user.profilePhoto?.publicId) {
        await cloudinaryRemoveImage(user.profilePhoto.publicId);
    }

    res.status(200).json({message:"Your profile photo has been uploaded successfully",
    profilePhoto:{ url:result.secure_url, publicId:result.public_Id}
    });

    fs.unlinkSync(imagePath);
});

/**
 * @desc Delete user
 * @router /api/users/profile/:id
 * @method DELETE
 * @access private
 */

module.exports.deleteUserProfileCtrl=asyncHandler(async(req,res)=>{
    const user=await User.findById(req.params.id);
    if(!user){
        return res.status(400).json({message:"User not found"});
    }
    
    const posts=await Post.find({user:user._id});

    const publicIds=posts?.map((post)=>post.image.publicId);

    if(publicIds?.length>0){
        await cloudinaryRemoveMultipleImage(publicIds);
    }
    
    if(user.profilePhoto?.publicId){
        await cloudinaryRemoveImage(user.profilePhoto.publicId);
    }
   

    await Post.deleteMany({user:user._id});
    await Comment.deleteMany({user:user._id});

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({message:"Profile has been successfully deleted"});
});