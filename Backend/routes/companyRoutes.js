const express = require("express");
const router = express.Router();
const companyController = require("../controllers/companyController");

// CRUD routes
router.post("/", companyController.createCompany);
router.get("/", companyController.getAllCompanies);
router.get("/:id", companyController.getCompanyById);
router.put("/:id", companyController.updateCompany);
router.delete("/:id", companyController.deleteCompany);

router.put("/toggle/:id", companyController.toggleCompanyStatus);

module.exports = router;


// Get And Post 
// http://localhost:3000/api/companies/

// Get a Company by ID (GET)
// http://localhost:3000/api/companies/:id

// Update a Company (PUT)
// http://localhost:3000/api/companies/:id

// Delete a Company (DELETE)
// http://localhost:3000/api/companies/:id

// Toggle Active Status of a Company (PUT)
// http://localhost:3000/api/companies/toggle/:id


// {
//   "companyName": "Tech Solutions",
//   "GSTNumber": "123456789",
//   "supplierName": "ABC Supplies",
//   "ownerName": "John Doe",
//   "address": "123 Tech Street",
//   "country": "USA",
//   "state": "California",
//   "district": "Silicon Valley",
//   "city": "San Francisco",
//   "pinCode": "94016",
//   "activeStatus": false
// }