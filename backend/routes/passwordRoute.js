const {sendResetPasswordLinkCtrl, getResetPasswordLinkCtrl, resetPasswordCtrl}=require("../controllers/passwordController");

const router=require("express").Router();

// /api/password/reset-password-link
router.post("/reset-password-link",sendResetPasswordLinkCtrl);

router.route("/reset-password/:userId/:token")
      .get(getResetPasswordLinkCtrl)
      .post(resetPasswordCtrl);
module.exports=router;