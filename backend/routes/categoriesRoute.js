const router=require("express").Router();
const{createCategoryCtrl, getAllCategories, deleteCategoryCtrl}=require("../controllers/categoriesController");
const validateObjectId = require("../middlewares/validateObjectId");
const{verifyTokenAdmin}=require("../middlewares/verifyToken");

// /api/categories
router.route("/")
      .post(verifyTokenAdmin,createCategoryCtrl)
      .get(getAllCategories);

// /api/categories/:id
router.route("/:id").delete(validateObjectId,verifyTokenAdmin,deleteCategoryCtrl);
module.exports=router;