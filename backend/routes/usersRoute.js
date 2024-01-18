const router=require("express").Router();
const { getAllUsersCtrl, getUserProfileCtrl, updateUserProfileCtrl, getUsersCountCtrl, profilePhotoUploadCtrl, deleteUserProfileCtrl } = require("../controllers/userController");
const {verifyTokenAdmin, verifyTokenAndOnlyUser,verifyToken, verifyTokenAndAuthorization}=require("../middlewares/verifyToken");
const validateObjectId=require("../middlewares/validateObjectId");
const photoUpload=require("../middlewares/photoUpload");

// /api/users/profile
router.route("/profile").get(verifyTokenAdmin,getAllUsersCtrl);

// /api/users/profile/:id
router.route("/profile/:id")
.get(validateObjectId,getUserProfileCtrl)
.put(validateObjectId,verifyTokenAndOnlyUser,updateUserProfileCtrl)
.delete(validateObjectId,verifyTokenAndAuthorization,deleteUserProfileCtrl);

// /api/users/profile/profile-photo-upload
router.route("/profile/profile-photo-upload")
.post(verifyToken, photoUpload.single("image"), profilePhotoUploadCtrl);

// /api/users/count
router.route("/count").get(verifyTokenAdmin,getUsersCountCtrl);

module.exports=router;