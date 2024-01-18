const router=require("express").Router();
const{createCommentCtrl, getAllCommentsCtrl, deleteCommentCtrl, updateCommentCtrl}=require("../controllers/commentsController");
const validateObjectId = require("../middlewares/validateObjectId");
const{verifyToken, verifyTokenAdmin}=require("../middlewares/verifyToken");

// /api/comments
router.route("/")
.post(verifyToken,createCommentCtrl)
.get(verifyTokenAdmin,getAllCommentsCtrl);

// /api/comments/:id
router.route("/:id")
.delete(validateObjectId,verifyToken,deleteCommentCtrl)
.put(validateObjectId,verifyToken,updateCommentCtrl);

module.exports=router;