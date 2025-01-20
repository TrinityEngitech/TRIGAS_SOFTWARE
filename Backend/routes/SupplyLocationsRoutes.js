const express = require("express");
const router = express.Router();

const supplyLocationController = require('../controllers/SupplyLocationsController');

router.post('/supply-locations', supplyLocationController.createSupplyLocation);
router.get('/supply-locations', supplyLocationController.getAllSupplyLocations);
router.get('/supply-locations/:id', supplyLocationController.getSupplyLocationById);
router.put('/supply-locations/:id', supplyLocationController.updateSupplyLocation);
router.patch('/supply-locations/:id/toggle-status', supplyLocationController.toggleSupplyLocationStatus);
router.delete('/supply-locations/:id', supplyLocationController.deleteSupplyLocation);




module.exports = router;


// get and post
// http://localhost:3000/api/SupplyLocations/supply-locations

// /api/products/:id


// SupplierLocation

// get
// http://localhost:3000/api/SupplyLocations/supply-locations
//put
// http://localhost:3000/api/SupplyLocations/supply-locations${locationId}
//post
// http://localhost:3000/api/SupplyLocations/supply-locations
//patch
//http://localhost:3000/api/SupplyLocations/supply-locations/${id}/toggle-status