const express = require('express');
const router = express.Router();
const PriceSheetController = require('../controllers/PriceSheetController');

// Create a new price sheet
router.post('/', PriceSheetController.createPriceSheet);

// Get all price sheets
router.get('/', PriceSheetController.getAllPriceSheets);

// Get a price sheet by ID
router.get('/:id', PriceSheetController.getPriceSheetById);

// Update Price Sheet
router.put('/:id', PriceSheetController.updatePriceSheet);

// Delete Price Sheet
router.delete('/:id', PriceSheetController.deletePriceSheet);

router.patch('/:id/active-status', PriceSheetController.updateActiveStatus);


module.exports = router;


// Get And Post
// http://localhost:3000/api/price-sheets

// Get By Id
// http://localhost:3000/api/price-sheets/:id



//  Dummy Data
// {
//     "name": "Price Sheet 17 September",
//     "city": "Morbi",
//     "effectiveDate": "2024-01-01",
//     "effectiveTime": "10:00:00",
//     "remark": "Seasonal pricing",
//     "data": [
//       {
//         "supplierName": "IOCL",
//         "productName": "PROPANE",
//         "loadingPoint": "KANDLA",
//         "basicPrice": 56590,
//         "cv": 11100,
//         "transportCharge": 1450,
//         "gst": 10186
//       },
//       {
//         "supplierName": "RIL",
//         "productName": "PROPANE",
//         "loadingPoint": "JAMNAGAR",
//         "basicPrice": 56690,
//         "cv": 11100,
//         "transportCharge": 1450,
//         "gst": 10204
//       }
//     ]
//   }
  