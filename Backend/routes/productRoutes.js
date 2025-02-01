// const express = require("express");
// const router = express.Router();
// const productController = require("../controllers/productController");

// // CRUD routes
// router.post("/", productController.createProduct);
// router.get("/", productController.getAllProducts);
// router.get("/:id", productController.getProductById);
// router.put("/:id", productController.updateProduct);
// router.delete("/:id", productController.deleteProduct);

// router.put("/toggle/:id", productController.toggleProductStatus);



// module.exports = router;

const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { authenticate, authorize } = require("../auth/authMiddleware"); // Import the middleware

// CRUD routes with authentication
router.post("/", authenticate, authorize(["Admin"]), productController.createProduct); // Only 'admin' role can create products
router.get("/", authenticate,authorize(["Admin","Employee","Customer"]), productController.getAllProducts); // All authenticated users can access
router.get("/:id", authenticate, productController.getProductById); // All authenticated users can access
router.put("/:id", authenticate, authorize(["Admin", "Employee"]), productController.updateProduct); // 'admin' and 'editor' roles can update
router.delete("/:id", authenticate, authorize(["Admin"]), productController.deleteProduct); // Only 'admin' role can delete

// Toggle product status (requires authentication and admin/editor role)
router.put("/toggle/:id", authenticate, authorize(["Admin", "Employee"]), productController.toggleProductStatus);

module.exports = router;



// get and post
// http://localhost:3000/api/products/ 

// /api/products/:id