const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { PrismaClient } = require("@prisma/client");




const driverController = require("../controllers/driverController");


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
  { name: "aadharCardFile", maxCount: 1 },
  { name: "pccFile", maxCount: 1 },
  { name: "drivingLicenseFile", maxCount: 1 },
]);




  
// Routes
router.post("/", uploadFiles, driverController.createDriver);
  
// CRUD routes
// router.post("/", driverController.createDriver);
router.get("/", driverController.getAllDrivers);
router.get("/:id", driverController.getDriverById);
router.put("/:id", uploadFiles,driverController.updateDriver);
router.delete("/:id", driverController.deleteDriver);

// Toggle Active Status of a Driver
router.put("/toggle/:id", driverController.toggleDriverStatus);

module.exports = router;

// Routes Usage:

// Create a new Driver (POST)
// http://localhost:3000/api/drivers/

// Get all Drivers (GET)
// http://localhost:3000/api/drivers/

// Get a Driver by ID (GET)
// http://localhost:3000/api/drivers/:id

// Update a Driver (PUT)
// http://localhost:3000/api/drivers/:id

// Delete a Driver (DELETE)
// http://localhost:3000/api/drivers/:id

// Toggle Active Status of a Driver (PUT)
// http://localhost:3000/api/drivers/toggle/:id

// Example Payload for Driver:
// {
//   "name": "Jane Smith",
//   "age": 35,
//   "driverNumber": "DRV123456",
//   "managerNumber": "MGR987654",
//   "aadharCardNumber": "1234-5678-9012",
//   "pccNumber": "PCC001122",
//   "drivingLicense": "DL123456789",
//   "activeStatus": true
// }
