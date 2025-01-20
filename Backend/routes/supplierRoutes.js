const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const multer = require("multer");
// Define the routes and map them to controller functions

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Files will be stored in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({storage});

// File upload fields for multiple files
const uploadFiles  = upload.fields([
  { name: "supplierLogo", maxCount: 1 },
]);

// CREATE - Add a new supplier
router.post('/',uploadFiles, supplierController.createSupplier);
// READ - Get all suppliers
router.get('/', supplierController.getAllSuppliers);

// READ - Get a single supplier by ID
router.get('/:id', supplierController.getSupplierById);

// UPDATE - Update a supplier by ID
// router.put('/:id', supplierController.updateSupplierById);

// UPDATE - Update supplier by ID
router.put('/:id', uploadFiles, supplierController.updateSupplierById);

// Toggle 
router.put('/toggle-status/:id', supplierController.toggleActiveStatus);

// DELETE - Delete a supplier by ID
router.delete('/:id', supplierController.deleteSupplierById);

module.exports = router;


// http://localhost:3000/api/supplier

// Dummy data
 
// {
//     "supplierName": "Green Grove Distributors",
//     "legalName": "Green Grove Pvt. Ltd.",
//     "supplierEmail": "info@greengrove.com",
//     "supplierGstNumber": "gst1111gg",
//     "supplierPanNumber": "pan1111gg",
//     "products": [
//         {
//             "productName": "Compost Fertilizer",
//             "productCode": "CF1234",
//             "_id": "1"
//         },
//         {
//             "productName": "Biodegradable Plates",
//             "productCode": "BP5678",
//             "_id": "2"
//         },
//         {
//             "productName": "Solar Lanterns",
//             "productCode": "SL9876",
//             "_id": "3"
//         },
//         {
//             "productName": "Eco Paints",
//             "productCode": "EP5432",
//             "_id": "4"
//         }
//     ],
//     "productLocations": {
//         "1": [
//             {
//                 "location": "Ahmedabad",
//                 "zipCode": "380001"
//             },
//             {
//                 "location": "Rajkot",
//                 "zipCode": "360001"
//             }
//         ],
//         "2": [
//             {
//                 "location": "Bangalore",
//                 "zipCode": "560001"
//             },
//             {
//                 "location": "Mysore",
//                 "zipCode": "570001"
//             }
//         ],
//         "3": [
//             {
//                 "location": "Hyderabad",
//                 "zipCode": "500001"
//             }
//         ],
//         "4": [
//             {
//                 "location": "Surat",
//                 "zipCode": "395001"
//             }
//         ]
//     },
//     "contacts": [
//         {
//             "contactName": "Vikram Desai",
//             "designation": "Sales Manager",
//             "email": "vikram@greengrove.com",
//             "phoneNumber": "9876543120"
//         },
//         {
//             "contactName": "Ananya Roy",
//             "designation": "Marketing Executive",
//             "email": "ananya@greengrove.com",
//             "phoneNumber": "9234567890"
//         },
//         {
//             "contactName": "Mohit Singh",
//             "designation": "Logistics Coordinator",
//             "email": "mohit@greengrove.com",
//             "phoneNumber": "9123456789"
//         }
//     ]
// }
