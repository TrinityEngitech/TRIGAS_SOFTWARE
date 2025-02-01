const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const upload = require("../utils/multer"); // Multer for file uploads

// 🛒 Order Routes
router.post("/create", orderController.createOrder); // Create a new order
router.patch("/:id/orderBookDateTime", orderController.updateOrderBookDateTime); // Update order book date
router.get("/", orderController.getAllOrders); // Get all orders
router.get("/:id", orderController.getOrderById); // Get order by ID

// 💰 Payment Routes
// router.post("/:id/payment/create", upload.single("paymentSlipImage"), orderController.createPayment);
router.post("/:id/payment/create", upload.single("paymentSlipImage"), orderController.createPayment);
router.patch("/:id/payment/update-status", orderController.updatePaymentStatus); // Update payment status (Approved/Rejected)



// Route for creating a new tanker allocation
router.post("/:id/orderTanker/allocation", orderController.createTankerAllocation);

// ✅ Update Tanker DO/SO Number
router.put("/:id/orderTanker/update-doso/:tankerNumber", orderController.updateTankerDosoNumber);

// ✅ Update Tanker Reporting DateTime
router.put("/:id/orderTanker/update-reporting/:tankerNumber", orderController.updateTankerReportingDateTime);

// ✅ Update Tanker Loading DateTime
router.put("/:id/orderTanker/update-loading/:tankerNumber", orderController.updateTankerLoadingDateTime);

// ✅ Update Tanker Status With Remark
router.put("/:id/orderTanker/update-remark-status/:tankerNumber", orderController.updateTankerStatusWithRemark);

// ✅ Update Tanker Invoice Weight And Dispatched DateTime 
router.put("/:id/orderTanker/invoice-and-dispatched/:tankerNumber", orderController.updateInvoiceWeightAndDispatchedDateTime);

// ✅ Update Tanker update TankerDeliver DateTime 
router.put("/:id/orderTanker/deliver/:tankerNumber", orderController.updateTankerDeliverDateTime);

// ✅ Update Tanker update unload DateTime 
router.put("/:id/orderTanker/unload/:tankerNumber", orderController.updateTankerUnloadedDateTime);

// ✅ Update Order Completion 
router.put("/:id/order-completed", orderController.updateOrderCompletion);

module.exports = router;



// Get all orders
// router.get("/list", orderController.getAllOrders);

// {
//     "customerId": 1,
//     "customerName": "EMBITO GRANITO LLP",
//     "supplierName": "BPCL",
//     "supplyLoadingPoint": "MUMBAI",
//     "productName": "BUTANE",
//     "productQuantity": 5000,
//     "teamName": "Team Alpha",
//     "orderCreatedBy": "Admin",
//     "orderDateTime": "2025-01-23T10:00:00Z"
//   }


// patch : /:id/orderBookDateTime
// http://localhost:3000/api/orders/5/orderBookDateTime
// example
// {
//   "orderBookDateTime": "2025-01-28T15:30:00Z"
// }


// POST create payment
// http://localhost:3000/api/orders/5/payment/create

// Patch
// http://localhost:3000/api/orders/5/payment/update-status
// Example
// {
//     "id": 5,
//     "paymentStatus": true
//   }

// ------------------Tanker-Add---------------------------------

// POST
// http://localhost:3000/api/orders/5/orderTanker/allocation
// Example
// {
//     "transporterName": "XYZ Transporters",
//     "tankerCapacity": 5000,
//     "tankerNumber": "TN-12345",
//     "driverName": "John Doe",
//     "driverNumber": "7485967485",
//     "tankerGPS": "12.9716° N, 77.5946° E"
//   }

  
// PUT
// http://localhost:3000/api/orders/5/orderTanker/update-doso/TN-12345
// Example
// {
//     "tankerDosoNumber": "DO123456789"
//   }

  
// PUT
// http://localhost:3000/api/orders/5/orderTanker/update-reporting/TN-12345
// Example
// {
//     "reportingDateTime": "2024-01-25T10:30:00Z"
//   }
  
// PUT
// http://localhost:3000/api/orders/5/orderTanker/update-loading/TN-12345
// Example
// {
//     "loadingDateTime": "2024-10-10T12:30:00.000Z"
//   }

  
// PUT
// http://localhost:3000/api/orders/5/orderTanker/update-remark-status/TN-12345
// Example
// {
//     "remarkStatus": "Tanker loaded successfully",
//     "tankerStatus": true
//   }
  
  
// PUT
// http://localhost:3000/api/orders/5/orderTanker/invoice-and-dispatched/TN-12345
// Example
// {
//     "invoiceWeight": 1500,
//     "tankerDispatchedDateTime": "2025-02-01T10:00:00Z"
//   }
  
  
// PUT
// http://localhost:3000/api/orders/5/orderTanker/deliver/TN-12345
// Example
// {
//     "tankerDeliverDateTime": "2025-02-01T14:30:00Z"
//   }
  
  
// PUT
// http://localhost:3000/api/orders/5/orderTanker/unload/TN-12345
// Example
// {
//     "tankerUnloadedDateTime": "2025-02-02T16:00:00Z"
//   }
  
  
// PUT
// http://localhost:3000/api/orders/5/order-completed
// Example
// {
//     "referenceNumber": "REF12345",
//     "remark": "Order completed successfully."
//   }
  
  
  
  



