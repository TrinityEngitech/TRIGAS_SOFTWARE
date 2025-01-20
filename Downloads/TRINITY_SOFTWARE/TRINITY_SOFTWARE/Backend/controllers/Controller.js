const prisma = require('@prisma/client').prisma;
const multer = require('multer');
const path = require('path');

// Set up Multer to handle file uploads
const upload = multer({ dest: 'uploads/' }); // Define the upload folder

// Function to handle adding tanker details along with documents
const addTankerWithDocuments = async (req, res) => {
  try {
    const {
      tankerNumber,
      licenseCapacity,
      driverName,
      product,
      grossWeight,
      tareWeight,
      chassisNumber,
      engineNumber,
      numberOfAxle,
      documents
    } = req.body;

    const tankerFiles = req.files; // Multer files for documents

    // Step 1: Create the tanker entry in TankerDetails model
    const tanker = await prisma.tankerDetails.create({
      data: {
        tankerNumber,
        licenseCapacity: parseInt(licenseCapacity),
        driverName,
        product,
        grossWeight: parseFloat(grossWeight),
        tareWeight: parseFloat(tareWeight),
        chassisNumber,
        engineNumber,
        numberOfAxle: parseInt(numberOfAxle),
      },
    });

    // Step 2: Create document entries for each document in TankerDocumentsDetails
    const documentPromises = documents.map((doc, index) => {
      const file = tankerFiles[index];

      return prisma.tankerDocumentsDetails.create({
        data: {
          documentType: doc.documentType,
          validFrom: new Date(doc.validFrom),
          validUpto: new Date(doc.validUpto),
          documentFile: file ? file.path : null, // Save the file path
          tankerId: tanker.id,
        },
      });
    });

    await Promise.all(documentPromises);

    // Step 3: Send a success response
    res.status(201).json({
      message: 'Tanker and documents added successfully',
      tanker: tanker,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create tanker and document details' });
  }
};

module.exports = {
  addTankerWithDocuments,
};
