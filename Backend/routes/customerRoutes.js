const express = require('express');
const router = express.Router();

const customerController = require('../controllers/customerController');

// Create new customer details
router.post('/createCustomerDetails', customerController.createCustomerDetails); // Create a new customer
router.post('/customerContactDetails', customerController.createCustomerContactDetails); // Create customer contact details
router.post('/customerGeneralDetails', customerController.createCustomerGeneralDetails); // Create customer general details
router.post('/customerSAPCodesDetails', customerController.createCustomerSAPCodesDetails); // Create customer SAP codes details
router.post('/customerBankDetails', customerController.createCustomerBankDetails); // Create customer bank details
router.post('/createVirtualAccount', customerController.createVirtualAccount); // Create customer bank details

// Update existing customer details
router.put('/updateCustomerDetails', customerController.updateCustomerDetails); // Update customer details by uuid
router.put('/updateCustomerContactDetails', customerController.updateCustomerContactDetails); // Update customer details by uuid
router.put('/updateCustomerGeneralDetails', customerController.updateCustomerGeneralDetails); // Update customer details by uuid
router.put('/updateCustomerSAPCodesDetails', customerController.updateCustomerSAPCodesDetails); // Update customer details by uuid

router.delete('/deleteCustomerSAPCode', customerController.deleteCustomerSAPCode); // Update customer details by uuid

// Get all customer details
router.get('/', customerController.getAllCustomersDetails); // Get all customer details
+
// Get customer details by ID (uuid)
router.get('/:customerId', customerController.getByidCustomerDetails); // Get customer details by uuid
router.get('/ViewCustomerBank/:id', customerController.getCustomerBankDetailsById); // Get customer details by uuid



module.exports = router;

// 2025-01-01 09:46:00.000


// http://localhost:3000/api/customers/createCustomerDetails

// post - createCustomerDetails
// {
//     "uuid": "123e4567-e89b-12d3-a456-426614174000",
//     "companyName": "ABC Corp",
//     "email": "contact@abccorp.com",
//     "primaryPhoneNumber": "1234567890",
//     "secondaryPhoneNumber": "0987654321",
//     "address1": "123 Main Street",
//     "address2": "Suite 456",
//     "state": "California",
//     "district": "Los Angeles",
//     "city": "Los Angeles",
//     "zipcode": "90001",
//     "associatedSupplier": "Supplier X",
//     "team": "Team A",
//     "typeOfCompany": "Private",
//     "licenseNumber": "LIC123456",
//     "ourCompany": "true",
//     "tanNumber": "TAN123456",
//     "gstNumber": "GST123456",
//     "panNumber": "PAN123456",
//     "licenseValidTill": "2025-12-31",
//     "licenseCapacity": 1000,
//     "latitude": 34.0522,
//     "longitude": -118.2437,
//     "transporter": "Transporter Y",
//     "competitorSupplier": "Competitor Z"
//   }
  
// post - customerContactDetails
// {
//     "customerId": 1,
//     "contacts": [
//       {
//         "contactName": "John Doe",
//         "phoneNumber": "1234567890",
//         "role": "help",
//         "commentRemark": "Primary contact"
//       },
//       {
//         "contactName": "Jane Smith",
//         "phoneNumber": "0987654321",
//         "role": "help",
//         "commentRemark": "Secondary contact"
//       }
//     ]
//   }

// post - customerGeneralDetails
// {
//     "customerId": 1,
//     "productSegment": "Industrial",
//     "noOfKiln": 2,
//     "lengthOfKiln": 25.5,
//     "dailyNaturalGasConsumption": 500.0,
//     "dailyConsumption": 1000.0,
//     "hourlyConsumption": 50.0,
//     "monthlyConsumption": 30000.0,
//     "startingStock": 200.0,
//     "newPurchase": 500.0,
//     "updatedStock": 700.0,
//     "remainingHoursOfStock": 14.0
//   }

// post - customerGeneralDetails
// {
//     "customerId": 1,
//     "productSegment": "Industrial",
//     "noOfKiln": 2,
//     "lengthOfKiln": 25.5,
//     "dailyNaturalGasConsumption": 500.0,
//     "dailyConsumption": 1000.0,
//     "hourlyConsumption": 50.0,
//     "monthlyConsumption": 30000.0,
//     "startingStock": 200.0,
//     "newPurchase": 500.0,
//     "updatedStock": 700.0,
//     "remainingHoursOfStock": 14.0
//   }


// post - customerSAPCodesDetails
// {
//     "customerId": 1,
//     "sapCodesDetails": [
//       {
//         "supplierName": "Supplier A",
//         "productName": "Product X",
//         "sapCode": "SAP001"
//       },
//       {
//         "supplierName": "Supplier B",
//         "productName": "Product Y",
//         "sapCode": "SAP002"
//       }
//     ]
//   }
  
// post - customerBankDetails
// {
//     "customerId": 1,
//     "bankDetails": [
//       {
//         "accountName": "John Doe",
//         "natureOfAccount": "Savings",
//         "bankName": "ABC Bank",
//         "branchName": "Downtown",
//         "ifscCode": "ABC123456",
//         "accountNumber": "1234567890"
//       },
//       {
//         "accountName": "Jane Smith",
//         "natureOfAccount": "Current",
//         "bankName": "XYZ Bank",
//         "branchName": "Uptown",
//         "ifscCode": "XYZ987654",
//         "accountNumber": "9876543210"
//       }
//     ]
//   }
// -----------------------
// {
//     "bankDetails": [
//         {
//             "id": 1,
//             "accountName": "iocl",
//             "typeOfAccount": "Saving",
//             "bankName": "sbi",
//             "branchName": "mumbai",
//             "ifscCode": "SBIN452636",
//             "accountNumber": "748596748596",
//             "preNumber": "74859",
//             "middleNumber": "SAP Code",
//             "postNumber": "4103",
//             "activeStatus": true,
//             "createDate": "2025-01-13T10:58:19.810Z",
//             "supplierId": 1
//         }
//     ]
// }
// Example Request Payload
// {
//     "customerName": "Saicon Tiles Private Limited",
//     "customerCode": "41035542",
//     "supplierId": 1
//   }
  


// ----------------------------------------------------
  
// put - updateCustomerDetails
// {
//     "uuid": "some-uuid-1234",  // This UUID remains unchanged
//     "companyName": "Updated Company Name",
//     "email": "updatedemail@company.com",
//     "primaryPhoneNumber": "9876543210",
//     "secondaryPhoneNumber": "1234567890",
//     "address1": "Updated Address 1",
//     "address2": "Updated Address 2",
//     "state": "Updated State",
//     "district": "Updated District",
//     "city": "Updated City",
//     "zipcode": "123456",
//     "associatedSupplier": "Updated Supplier",
//     "team": "Updated Team",
//     "typeOfCompany": "Updated Manufacturer",
//     "licenseNumber": "NEW12345",
//     "ourCompany": "Updated Our Company",
//     "tanNumber": "TAN12345",
//     "gstNumber": "GST12345",
//     "panNumber": "PAN12345",
//     "licenseValidTill": "2025-12-31",
//     "licenseCapacity": 100.5,
//     "latitude": 12.3456,
//     "longitude": 78.9012,
//     "transporter": "Updated XYZ Transport",
//     "competitorSupplier": "Updated Competitor A"
//   }
  
  
  
// put - updateCustomerContactDetails
// {
//     "customerId": "1",
//     "contacts": [
//       {
//         "contactName": "Updated John Doe",
//         "phoneNumber": "9876543210",
//         "commentRemark": "New primary contact"
//       },
//       {
//         "contactName": " Updated Jane",
//         "phoneNumber": "9876543211",
//         "commentRemark": "New secondary contact"
//       }
//     ]
//   }
  
  
// put - updateCustomerGeneralDetails
// {
//     "customerId": 1,
//     "productSegment": "Ceramics",
//     "noOfKiln": 5,
//     "lengthOfKiln": 100,
//     "dailyNaturalGasConsumption": 2000,
//     "dailyConsumption": 1500,
//     "hourlyConsumption": 100,
//     "monthlyConsumption": 30000,
//     "startingStock": 5000,
//     "newPurchase": 2000,
//     "updatedStock": 7000,
//     "remainingHoursOfStock": 50
//   }
  
  
  
// put - updateCustomerSAPCodesDetails
// {
//     "customerId": 1,
//     "sapCodesDetails": [
//       {
//         "supplierName": "Supplier A",
//         "productName": "Product X",
//         "sapCode": "12345"
//       },
//       {
//         "supplierName": "Supplier B",
//         "productName": "Product Y",
//         "sapCode": "67890"
//       }
//     ]
//   }
  
  
  
  
  