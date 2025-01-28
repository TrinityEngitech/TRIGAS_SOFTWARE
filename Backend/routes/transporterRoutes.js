const express = require('express');
const router = express.Router();
// const upload = require('../utils/multer');
const upload = require('../utils/multer');

const transporterController = require('../controllers/transporterController');


// router.post('/transporterCompany', createTransporterCompany); // Create a new company
router.post('/createTransporterCompany',transporterController.createTransporterCompany ); // Create a new company
// router.post('/transporterCompany', createTransporterCompany); // Create a new company
router.post('/saveContactDetails',transporterController.saveContactDetails ); // Create a new company
router.post('/saveTankerDetails',transporterController.saveTankerDetails ); // Create a new company
// router.post('/saveTankerDocumentsDetails',upload.array('documents'),transporterController.saveTankerDocumentsDetails ); // Create a new company
router.post('/saveBankDetails',transporterController.saveBankDetails ); // Create a new company

router.post('/saveTankerDocumentsDetails', (req, res, next) => {
    console.log('Files:', req.files); // Logs uploaded files
    console.log('Body:', req.body);   // Logs additional form data
    next();
  }, upload.array('documents'), transporterController.saveTankerDocumentsDetails);
  


router.get('/',transporterController.getAllTransporterCompanies ); // Create a new company
router.get('/:uuid',transporterController.getTransporterCompanyByUUID ); // Create a new company
// Express Route Example
router.get('/transporterId/:id', transporterController.getTransporterCompanyById);

// delete tanker 
router.delete('/deleteTanker/:tankerId', transporterController.deleteTankerById);



//edit and update

router.put('/transporterCompany/:id', transporterController.editTransporterCompany);
router.put('/transporterCompany/:id/contact', transporterController.editTransporterContact);
router.put('/transporterCompany/:id/bank', transporterController.editTransporterBankDetails);



router.put('/toggle/:id', transporterController.toggleTransporterStatus);

// http://localhost:3000/api/transporters/transporterCompany/3/contact
// {
//   "contacts": [
//     {
//       "contactName": "zjrx",
//       "role": "Owner",
//       "phoneNumber": "546756566658978",
//       "email": "gyhjfggh@contact.com"
//     },
//     {
//       "contactName": "zkfgx",
//       "role": "Owner",
//       "phoneNumber": "54655655756789",
//       "email": "gyg55gf6h@contact.com"
//     }
//   ]
// }

module.exports=router;

// {
//     "uuid": "0b7e6df0-bf1a-4b23-bc8d-2356c4b5799a",
//     "transporterName": "ABC Transport Co.",
//     "email": "contact@abctransport.com",
//     "address1": "123 Main Street",
//     "address2": "Suite 100",
//     "state": "California",
//     "country": "USA",
//     "city": "Los Angeles",
//     "zipCode": "90001",
//     "typeOfCompany": "Logistics",
//     "panNumber": "ABCDE1234F",
//     "gstNumber": "22ABCDE1234F1Z5"
//   }
  


// {
//     "companyUuid": "0b7e6df0-bf1a-4b23-bc8d-2356c4b5799a",
//     "contacts": [
//       {
//         "uuid": "1f2e3d4c-5a6b-7c8d-9e0f-12345abcd123",
//         "contactName": "John Doe",
//         "role": "Manager",
//         "phoneNumber": "+1-555-987-6543",
//         "email": "johndoe@abctransport.com"
//       },
//       {
//         "uuid": "2b3c4d5e-6f7g-8h9i-0j1k-67890xyz678",
//         "contactName": "Jane Smith",
//         "role": "Assistant Manager",
//         "phoneNumber": "+1-555-654-3210",
//         "email": "janesmith@abctransport.com"
//       }
//     ]
//   }
 

// {
//     "companyUuid": "987e6543-b12a-34d5-f678-987654321000",
//     "tankerDetailsArray": [
//       {
//         "tankerNumber": "TANK12345415",
//         "licenseCapacity": 1000,
//         "driverName": "Robert Brown",
//         "product": "Propane",
//         "grossWeight": 1500.0,
//         "tareWeight": 1200.0,
//         "chassisNumber": "CH12345678",
//         "engineNumber": "EN98765432",
//         "numberOfAxle": 2
//       },
//       {
//         "tankerNumber": "TANK543215896",
//         "licenseCapacity": 800,
//         "driverName": "Alice Green",
//         "product": "Butane",
//         "grossWeight": 1400.0,
//         "tareWeight": 1100.0,
//         "chassisNumber": "CH87654321",
//         "engineNumber": "EN12345678",
//         "numberOfAxle": 3
//       },
//       {
//         "tankerNumber": "TANK6789065454",
//         "licenseCapacity": 1500,
//         "driverName": "John Doe",
//         "product": "Gasoline",
//         "grossWeight": 2000.0,
//         "tareWeight": 1300.0,
//         "chassisNumber": "CH23456789",
//         "engineNumber": "EN76543210",
//         "numberOfAxle": 3
//       },
//       {
//         "tankerNumber": "TANK098767458",
//         "licenseCapacity": 1200,
//         "driverName": "Eve White",
//         "product": "Diesel",
//         "grossWeight": 1800.0,
//         "tareWeight": 1100.0,
//         "chassisNumber": "CH34567890",
//         "engineNumber": "EN87654321",
//         "numberOfAxle": 2
//       }
//     ]
//   }
  
// {
//     "companyUuid": "987e6543-b12a-34d5-f678-987654321000",
//     "bankDetails": [
//       {
//         "accountName": "ABC Transport Ltd.",
//         "natureOfAccount": "Business",
//         "bankName": "XYZ Bank",
//         "branchName": "Downtown Branch",
//         "ifscCode": "XYZ1234",
//         "accountNumber": "9876543210"
//       },
//       {
//         "accountName": "DEF Logistics",
//         "natureOfAccount": "Business",
//         "bankName": "LMN Bank",
//         "branchName": "Uptown Branch",
//         "ifscCode": "LMN5678",
//         "accountNumber": "1234567890"
//       }
//     ]
//   }
  