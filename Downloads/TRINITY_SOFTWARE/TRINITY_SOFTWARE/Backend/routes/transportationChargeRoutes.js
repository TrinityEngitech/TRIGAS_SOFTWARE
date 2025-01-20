const express = require('express');
const router = express.Router();
const TransportationChargeController = require('../controllers/TransportationChargeController');

// Add a new transportation charge
router.post('/', TransportationChargeController.addTransportationCharge);

// Get all transportation charges
router.get('/', TransportationChargeController.getAllTransportationCharges);

// Update a transportation charge
router.put('/:id', TransportationChargeController.updateTransportationCharge);

// Delete a transportation charge
router.delete('/:id', TransportationChargeController.deleteTransportationCharge);

module.exports = router;


// Get And Post
// http://localhost:3000/api/transportation-charges

// Put And Delete
// http://localhost:3000/api/transportation-charges/:id

// Demo Data 
// {
//     "supplierName": "ABC Supplier",
//     "loadingPoint": "Mumbai",
//     "transportationCharge": 1500.75
//   }
  