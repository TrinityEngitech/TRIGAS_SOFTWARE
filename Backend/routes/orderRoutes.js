const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// CRUD Routes for Orders

// Create a new order (initial data)
router.post("/create", orderController.createOrder);

// Allocate a tanker to an order
router.post("/allocate-tanker", orderController.allocateTankerToOrder);

// Update additional fields for an order
router.patch("/update-additional-fields", orderController.updateOrderAdditionalFields);
router.patch("/:id/orderBookDateTime", orderController.updateOrderBookDateTime);

router.get("/", orderController.getAllOrders);
router.get("/:id", orderController.getOrderById);


// Get order by ID
// router.get("/get/:id", orderController.getOrderById);

// Get all orders
// router.get("/list", orderController.getAllOrders);

// Delete or deactivate an order (optional, based on your requirements)
// router.delete("/delete/:id", orderController.deleteOrder);

// patch : /:id/orderBookDateTime
// http://localhost:3000/api/orders/5/orderBookDateTime
// example
// {
//   "orderBookDateTime": "2025-01-28T15:30:00Z"
// }


module.exports = router;