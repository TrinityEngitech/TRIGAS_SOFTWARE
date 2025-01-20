const prisma = require('@prisma/client');
const prismaClient = new prisma.PrismaClient();
const fs = require('fs');
const path = require('path');

/**
 * Save tanker details and documents.
 * @param {Request} req
 * @param {Response} res
 */



const saveTankerDetails = async (req, res) => {
  try {
    const {
      transporterName,
      tankerNumber,
      licenseCapacity,
      driverName,
      product,
      grossWeight,
      tareWeight,
      chassisNumber,
      engineNumber,
      numberOfAxle,
      documents: documentsMetadata,
    } = req.body;

    console.log('Request Body:', req.body);
    console.log('Request Files:', req.files);

    // Parse documents metadata
    let parsedDocuments = [];
    try {
      if (documentsMetadata) {
        parsedDocuments = JSON.parse(documentsMetadata);
        console.log('Parsed Documents:', parsedDocuments);
      }
    } catch (error) {
      console.error('Error parsing documents metadata:', error);
      return res.status(400).json({ error: 'Invalid documents metadata format' });
    }

    // Fetch transporter company details (optional)
    let companyId = null;
    if (transporterName) {
      const company = await prismaClient.transporterCompanyDetails.findFirst({
        where: { transporterName },
      });

      if (company) {
        companyId = company.id;
      } else {
        console.warn(`Transporter not found for name: ${transporterName}`);
      }
    }

    // Save tanker details
    const tanker = await prismaClient.tankerDetails.create({
      data: {
        transporterName: transporterName || null, // Set null if not provided
        companyId, // Set null if not found
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

    console.log('Tanker Details Saved:', tanker);

    // Save documents
    if (parsedDocuments.length > 0) {
      const documentsData = parsedDocuments.map((doc, index) => {
        const documentFile = req.files?.[index]?.filename || null;
        console.log(`Document File for Index ${index}:`, documentFile);
        return {
          documentType: doc.documentType,
          validFrom: new Date(doc.validFrom),
          validUpto: new Date(doc.validUpto),
          documentFile,
          tankerId: tanker.id,
        };
      });

      // Filter valid documents
      const validDocuments = documentsData.filter((doc) => doc.documentFile);
      console.log('Valid Documents to Save:', validDocuments);

      if (validDocuments.length > 0) {
        const savedDocuments = await prismaClient.tankerDocumentsDetails.createMany({
          data: validDocuments,
        });
        console.log('Documents Saved Successfully:', savedDocuments);
      } else {
        console.warn('No valid documents to save');
      }
    } else {
      console.warn('No documents metadata provided');
    }

    res.status(201).json({ message: 'Tanker details and documents saved successfully!' });
  } catch (error) {
    console.error('Error saving tanker details:', error);
    res.status(500).json({ error: 'An error occurred while saving data' });
  }
};






/**
 * Get all tanker details with documents.
 * @param {Request} req
 * @param {Response} res
 */
const getAllTankers = async (req, res) => {
    try {
      const tankers = await prismaClient.tankerDetails.findMany({
        include: {
          documents: true, // Fetch associated documents
        },
      });
  
      res.status(200).json({ data: tankers });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching data' });
    }
  };
  

/**
 * Get tanker details by ID.
 * @param {Request} req
 * @param {Response} res
 */
const getTankerById = async (req, res) => {
  try {
    const { id } = req.params;

    const tanker = await prismaClient.tankerDetails.findUnique({
      where: { id: parseInt(id) },
      include: { documents: true },
    });

    if (!tanker) {
      return res.status(404).json({ message: 'Tanker not found' });
    }

    res.status(200).json(tanker);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching data' });
  }
};

// /**
//  * Update tanker details by ID.
//  * @param {Request} req
//  * @param {Response} res
//  */
// const updateTankerDetails = async (req, res) => {
//     try {
//       const { id } = req.params;
//       const {
//         tankerNumber,
//         licenseCapacity,
//         driverName,
//         product,
//         grossWeight,
//         tareWeight,
//         chassisNumber,
//         engineNumber,
//         numberOfAxle,
//         documents,
//       } = req.body;
  
//       // Parse the documents if provided
//       const parsedDocuments = documents ? JSON.parse(documents) : [];
  
//       // Start a transaction to handle both tanker and documents
//       await prismaClient.$transaction(async (prisma) => {
//         // Clear existing documents and tanker data
//         await prisma.tankerDocumentsDetails.deleteMany({
//           where: { tankerId: parseInt(id) },
//         });
  
//         await prisma.tankerDetails.update({
//           where: { id: parseInt(id) },
//           data: {
//             tankerNumber,
//             licenseCapacity: parseInt(licenseCapacity),
//             driverName,
//             product,
//             grossWeight: parseFloat(grossWeight),
//             tareWeight: parseFloat(tareWeight),
//             chassisNumber,
//             engineNumber,
//             numberOfAxle: parseInt(numberOfAxle),
//           },
//         });
  
//         // Save new documents if provided
//         if (parsedDocuments.length > 0) {
//           const documentsData = parsedDocuments.map((doc, index) => ({
//             documentType: doc.documentType,
//             validFrom: new Date(doc.validFrom),
//             validUpto: new Date(doc.validUpto),
//             documentFile: req.files && req.files[index] ? req.files[index].filename : null, // File may be null
//             tankerId: parseInt(id),
//           }));
  
//           // Create new documents for the tanker
//           await prisma.tankerDocumentsDetails.createMany({
//             data: documentsData,
//           });
//         }
//       });
  
//       res.status(200).json({ message: 'Tanker details updated successfully!' });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'An error occurred while updating data' });
//     }
//   };
      
// const updateTankerDetails = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const {
//       transporterName,
//       tankerNumber,
//       licenseCapacity,
//       driverName,
//       product,
//       grossWeight,
//       tareWeight,
//       chassisNumber,
//       engineNumber,
//       numberOfAxle,
//       documents, // JSON string containing new document details
//     } = req.body;

//     console.log(req.body);
//     console.log(req.files);

//     // Parse the documents field
//     let parsedDocuments = [];
//     try {
//       parsedDocuments = documents ? JSON.parse(documents) : [];
//     } catch (err) {
//       return res.status(400).json({ error: 'Invalid documents format' });
//     }

//     // Start a transaction with a timeout
//     await prismaClient.$transaction(
//       async (prisma) => {
//         // Fetch existing tanker to ensure it exists
//         const existingTanker = await prisma.tankerDetails.findUnique({
//           where: { id: parseInt(id) },
//         });
//         if (!existingTanker) {
//           throw new Error('Tanker not found');
//         }

//         // Update tanker details
//         await prisma.tankerDetails.update({
//           where: { id: parseInt(id) },
//           data: {
//             transporterName,
//             tankerNumber,
//             licenseCapacity: parseInt(licenseCapacity),
//             driverName,
//             product,
//             grossWeight: parseFloat(grossWeight),
//             tareWeight: parseFloat(tareWeight),
//             chassisNumber,
//             engineNumber,
//             numberOfAxle: parseInt(numberOfAxle),
//           },
//         });

//         if (parsedDocuments.length > 0) {
//           // Filter out completely empty or invalid documents
//           const validDocuments = parsedDocuments.filter((doc, i) => {
//             const hasValidData =
//               doc.documentType ||
//               doc.validFrom ||
//               doc.validUpto ||
//               (req.files && req.files[i] && req.files[i].filename) ||
//               doc.documentFile;
        
//             return hasValidData;
//           });
        
//           if (validDocuments.length > 0) {
//             const newDocuments = validDocuments.map((doc, i) => {
//               const file = req.files && req.files[i] ? req.files[i].filename : doc.documentFile;
//               return {
//                 documentType: doc.documentType || null,
//                 validFrom: doc.validFrom ? new Date(doc.validFrom) : null,
//                 validUpto: doc.validUpto ? new Date(doc.validUpto) : null,
//                 documentFile: file || null,
//                 tankerId: parseInt(id),
//               };
//             });
        
//             // Batch insert valid documents
//             await prisma.tankerDocumentsDetails.createMany({
//               data: newDocuments,
//             });
//             documentsAdded = true; 
//           } else {
//             console.log("No valid document details provided, skipping document update.");
//           }
//         } else {
//           console.log("No documents provided, skipping document update.");
//         }
        
        
       
//       },
//       { timeout: 10000 } // Set transaction timeout to 10 seconds
//     );

//     res.status(200).json({ success: true, message: 'Tanker details updated successfully!' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       error: error.message || 'An error occurred while updating data',
//     });
//   }
// };

const updateTankerDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      transporterName,
      tankerNumber,
      licenseCapacity,
      driverName,
      product,
      grossWeight,
      tareWeight,
      chassisNumber,
      engineNumber,
      numberOfAxle,
      documents, // JSON string containing new document details
    } = req.body;

    console.log(req.body);
    console.log(req.files);

    // Parse the documents field
    let parsedDocuments = [];
    try {
      parsedDocuments = documents ? JSON.parse(documents) : [];
    } catch (err) {
      return res.status(400).json({ error: 'Invalid documents format' });
    }

    // Start a transaction with a timeout
    await prismaClient.$transaction(
      async (prisma) => {
        // Fetch existing tanker to ensure it exists
        const existingTanker = await prisma.tankerDetails.findUnique({
          where: { id: parseInt(id) },
        });
        if (!existingTanker) {
          throw new Error('Tanker not found');
        }

        let companyId = existingTanker.companyId; // Default to existing companyId

        // If a new transporterName is provided, fetch the new companyId
        if (transporterName && transporterName !== existingTanker.transporterName) {
          const company = await prisma.transporterCompanyDetails.findFirst({
            where: { transporterName },
          });

          if (company) {
            companyId = company.id;
          } else {
            console.warn(`Transporter not found for name: ${transporterName}`);
            companyId = null; // Set to null if company is not found
          }
        }

        // Update tanker details
        await prisma.tankerDetails.update({
          where: { id: parseInt(id) },
          data: {
            transporterName,
            companyId, // Set companyId (may be null if transporter not found)
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

        if (parsedDocuments.length > 0) {
          // Filter out completely empty or invalid documents
          const validDocuments = parsedDocuments.filter((doc, i) => {
            const hasValidData =
              doc.documentType ||
              doc.validFrom ||
              doc.validUpto ||
              (req.files && req.files[i] && req.files[i].filename) ||
              doc.documentFile;
        
            return hasValidData;
          });
        
          if (validDocuments.length > 0) {
            const newDocuments = validDocuments.map((doc, i) => {
              const file = req.files && req.files[i] ? req.files[i].filename : doc.documentFile;
              return {
                documentType: doc.documentType || null,
                validFrom: doc.validFrom ? new Date(doc.validFrom) : null,
                validUpto: doc.validUpto ? new Date(doc.validUpto) : null,
                documentFile: file || null,
                tankerId: parseInt(id),
              };
            });
        
            // Batch insert valid documents
            await prisma.tankerDocumentsDetails.createMany({
              data: newDocuments,
            });
            console.log('Documents added successfully.');
          } else {
            console.log('No valid document details provided, skipping document update.');
          }
        } else {
          console.log('No documents provided, skipping document update.');
        }
      },
      { timeout: 10000 } // Set transaction timeout to 10 seconds
    );

    res.status(200).json({ success: true, message: 'Tanker details updated successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message || 'An error occurred while updating data',
    });
  }
};

  

/**
 * Delete tanker details by ID.
 * @param {Request} req
 * @param {Response} res
 */
const deleteTankerDetails = async (req, res) => {
  try {
    const { id } = req.params;

    await prismaClient.tankerDocumentsDetails.deleteMany({ where: { tankerId: parseInt(id) } });
    await prismaClient.tankerDetails.delete({ where: { id: parseInt(id) } });

    res.status(200).json({ message: 'Tanker details deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while deleting data' });
  }
};



// const documentDelete = async (req, res) => {
//   try {
//     const { id } = req.params; // Get the document ID from the request parameters

//     // Log prismaClient to check if it's initialized properly
//     console.log(prismaClient);  // This should not be undefined

//     // Ensure the ID is valid
//     const document = await prismaClient.documents.findUnique({
//       where: { id: parseInt(id) },
//     });

//     if (!document) {
//       return res.status(404).json({ message: "Document not found" });
//     }

//     // Remove the file from the uploads folder (if applicable)
//     const filePath = document.filePath;  // Assuming filePath contains the file location

//     // Check if the file exists before attempting to delete
//     if (filePath && fs.existsSync(filePath)) {
//       fs.unlinkSync(filePath);  // Deletes the file from the filesystem
//       console.log(`File ${filePath} deleted successfully.`);
//     }

//     // Delete the document from the database
//     await prismaClient.documents.delete({
//       where: { id: parseInt(id) },
//     });

//     res.status(200).json({ message: "Document and file deleted successfully" });
//   } catch (error) {
//     console.error("Error in documentDelete:", error);
//     res.status(500).json({ error: "An error occurred while deleting the document" });
//   }
// };

const documentDelete = async (req, res) => {
  try {
    const { id } = req.params; // Get the document ID from the request parameters

    // Delete the tanker document detail by its ID
    const deletedDocument = await prismaClient.tankerDocumentsDetails.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: 'Tanker document deleted successfully', deletedDocument });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while deleting the tanker document' });
  }
};



module.exports = {
  saveTankerDetails,
  getAllTankers,
  getTankerById,
  updateTankerDetails,
  deleteTankerDetails,
  documentDelete,
};


