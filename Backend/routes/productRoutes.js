const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// CRUD routes
router.post("/", productController.createProduct);
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

router.put("/toggle/:id", productController.toggleProductStatus);



module.exports = router;


// get and post
// http://localhost:3000/api/products/ 

// /api/products/:id