const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const prismaClient = new PrismaClient();



exports.createTransporterCompany = async (req, res) => {
  try {
    const {
      uuid, // Provided by frontend
      transporterName,
      email,
      address1,
      address2,
      state,
      district,
      city,
      zipCode,
      typeOfCompany,
      panNumber,
      gstNumber,
    } = req.body;
    console.log("UUID:", uuid);
    console.log(req.body);

    // Validate required fields
    if (!uuid || !transporterName || !email || !address1 || !state || !district || !city || !zipCode || !typeOfCompany || !panNumber || !gstNumber) {
      return res.status(400).json({ error: 'All required fields, including uuid, must be provided.' });
    }

    // Validate the UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(uuid)) {
      return res.status(400).json({ error: 'Invalid UUID format.' });
    }

    // Create a new company record
    const newCompany = await prisma.transporterCompanyDetails.create({
      data: {
        uuid,
        transporterName,
        email,
        address1,
        address2,
        state,
        district,
        city,
        zipCode,
        typeOfCompany,
        panNumber,
        gstNumber,
      },
    });

    // Return the created record
    res.status(201).json(newCompany);
  } catch (error) {
    console.error('Error creating transporter company:', error);

    // Check for unique constraint violations
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Duplicate entry for a unique field.' });
    }

    // General server error
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
};



exports.saveContactDetails = async (req, res) => {
  try {
    const { companyUuid, contacts } = req.body;

    // Check if the company with the given UUID exists
    const existingCompany = await prisma.transporterCompanyDetails.findUnique({
      where: { uuid: companyUuid },
    });

    if (!existingCompany) {
      return res.status(404).json({
        error: "Transporter company with the given UUID not found.",
      });
    }

    // Save contact details with a relationship to the company
    const newContacts = await prisma.transporterContactDetails.createMany({
      data: contacts.map((contact) => ({
        contactName: contact.contactName,
        role: contact.role,
        phoneNumber: contact.phoneNumber,
        email: contact.email,
        companyId: existingCompany.id, // Use the ID of the company
      })),
    });

    res.status(201).json({
      message: "Contact details saved successfully.",
      data: newContacts,
    });
  } catch (error) {
    console.error("Error saving contact details:", error);

    // Handle unique constraint errors
    if (error.code === "P2002") {
      const field = error.meta.target;
      return res.status(400).json({ error: `${field} already exists.` });
    }

    res.status(500).json({ error: "An unexpected error occurred." });
  }
};

exports.saveTankerDetails = async (req, res) => {

  console.log(req.body);
  
  try {
    const { companyUuid, tankerDetailsArray } = req.body;

    let transporterName = null;
    let companyId = null;

    if (companyUuid) {
      // Fetch the company by UUID
      const company = await prisma.transporterCompanyDetails.findUnique({
        where: { uuid: companyUuid },
      });

      // Check if the company exists
      if (!company) {
        return res.status(404).json({ error: "Transporter company not found" });
      }

      // Set the transporterName and companyId
      transporterName = company.transporterName;
      companyId = company.id;
    }

    // Create an array of promises for saving multiple tankers
    const tankerPromises = tankerDetailsArray.map((tankerDetails) => {
      return prisma.tankerDetails.create({
        data: {
          transporterName, // Optional transporter name
          companyId,       // Optional company ID
          tankerNumber: tankerDetails.tankerNumber,
          licenseCapacity: parseInt(tankerDetails.licenseCapacity),
          driverName: tankerDetails.driverName,
          product: tankerDetails.product,
          grossWeight: parseFloat(tankerDetails.grossWeight),
          tareWeight: parseFloat(tankerDetails.tareWeight),
          chassisNumber: tankerDetails.chassisNumber,
          engineNumber: tankerDetails.engineNumber,
          numberOfAxle: parseInt(tankerDetails.numberOfAxle),
        },
      });
    });

    // Execute all promises concurrently
    const tankers = await Promise.all(tankerPromises);

    console.log("Tanker Details Saved:", tankers);

    res.status(201).json({
      message: "Tanker details saved successfully!",
      tankers,
    });
  } catch (error) {
    console.error("Error saving tanker details:", error);
    res.status(500).json({ error: "An error occurred while saving tanker details" });
  }
};




exports.saveTankerDocumentsDetails = async (req, res) => {
  try {
    console.log('Files:', req.files);
    console.log('Body:', req.body);

    // Validate files and body
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    let tankerDocumentsDetailsArray;
    if (typeof req.body.tankerDocumentsDetailsArray === 'string') {
      tankerDocumentsDetailsArray = JSON.parse(req.body.tankerDocumentsDetailsArray);
    } else {
      tankerDocumentsDetailsArray = req.body.tankerDocumentsDetailsArray;
    }

    console.log('Parsed tanker documents details:', tankerDocumentsDetailsArray);

    // Save data to database
    const savedDocuments = [];
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      const documentDetails = tankerDocumentsDetailsArray[i];

      const savedDocument = await prisma.tankerDocumentsDetails.create({
        data: {
          documentType: documentDetails.documentType,
          validFrom: new Date(documentDetails.validFrom),
          validUpto: new Date(documentDetails.validUpto),
          documentFile: file.path,
          tankerId: parseInt(documentDetails.tankerId), // Ensure tankerId is an integer
        },
      });

      savedDocuments.push(savedDocument);
    }

    console.log('Saved Documents:', savedDocuments);

    res.status(201).json({
      message: 'Documents saved successfully!',
      savedDocuments: {
        count: savedDocuments.length,
        details: savedDocuments,
      },
    });
  } catch (error) {
    console.error('Error saving tanker documents:', error);
    res.status(500).json({ message: 'An error occurred', error });
  }
};



exports.saveBankDetails = async (req, res) => {
  try {
    const { companyUuid, bankDetails } = req.body;

    // Check if the company with the given UUID exists
    const existingCompany = await prisma.transporterCompanyDetails.findUnique({
      where: { uuid: companyUuid },
    });

    if (!existingCompany) {
      return res.status(404).json({
        error: "Transporter company with the given UUID not found.",
      });
    }

    // Save bank details with a relationship to the company
    const newBankDetails = await prisma.transporterBank.createMany({
      data: bankDetails.map((bankDetail) => ({
        accountName: bankDetail.accountName,
        natureOfAccount: bankDetail.natureOfAccount,
        bankName: bankDetail.bankName,
        branchName: bankDetail.branchName,
        ifscCode: bankDetail.ifscCode,
        accountNumber: bankDetail.accountNumber,
        companyId: existingCompany.id, // Use the ID of the company
      })),
    });

    res.status(201).json({
      message: "Bank details saved successfully.",
      data: newBankDetails,
    });
  } catch (error) {
    console.error("Error saving bank details:", error);

    // Handle unique constraint errors
    if (error.code === "P2002") {
      const field = error.meta.target;
      return res.status(400).json({ error: `${field} already exists.` });
    }

    res.status(500).json({ error: "An unexpected error occurred." });
  }
};

//fetch all data
exports.getAllTransporterCompanies = async (req, res) => {
  try {
    // Fetch all transporter companies with related contact, bank details, and tankers
    const companies = await prisma.transporterCompanyDetails.findMany({
      include: {
        contacts: true, // Include related contact details
        bankDetails: true, // Include related bank details
        tankers: { // Include related tankers
          include: {
            documents: true, // Include documents related to tankers
          },
        },
      },
    });

    // Send the data as the response
    res.status(200).json(companies);
  } catch (error) {
    console.error('Error fetching transporter companies:', error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
};

exports.getTransporterCompanyByUUID = async (req, res) => {
  const { uuid } = req.params; // Extract uuid from the request parameters

  try {
    // Fetch the transporter company using the uuid
    const company = await prisma.transporterCompanyDetails.findUnique({
      where: {
        uuid, // Use the uuid to filter
      },
      include: {
        contacts: true, // Include related contact details
        bankDetails: true, // Include related bank details
        tankers: { // Include related tankers
          include: {
            documents: true, // Include documents related to tankers
          },
        },
      },
    });

    // If the company is not found, return a 404 response
    if (!company) {
      return res.status(404).json({ error: 'Transporter company not found.' });
    }

    // Send the data as the response
    res.status(200).json(company);
  } catch (error) {
    console.error('Error fetching transporter company by UUID:', error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
};

exports.getTransporterCompanyById = async (req, res) => {
  const { id } = req.params; // Extract id from request parameters
  console.log('Request received with ID:', id); // Log the received ID

  try {
    // Fetch the transporter company by ID with related contact, bank details, and tankers
    const company = await prisma.transporterCompanyDetails.findUnique({
      where: { id: parseInt(id) }, // Ensure the id is parsed as an integer
      include: {
        contacts: true, // Include related contact details
        bankDetails: true, // Include related bank details
        tankers: { // Include related tankers
          include: {
            documents: true, // Include documents related to tankers
          },
        },
      },
    });

    console.log('Fetched company data:', company); // Log the fetched data

    // Check if the company was found
    if (!company) {
      console.log('No company found for ID:', id); // Log if no company was found
      return res.status(404).json({ error: 'Transporter company not found' });
    }

    // Send the data as the response
    res.status(200).json(company);
  } catch (error) {
    console.error('Error fetching transporter company by ID:', error); // Log the error
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
};

exports.toggleTransporterStatus = async (req, res) => {
  try {
    const transporterId = parseInt(req.params.id);

    const transporter = await prisma.transporterCompanyDetails.findUnique({
      where: { id: transporterId },
    });
    if (!transporter) {
      return res.status(404).json({ error: "transporter not found" });
    }

    // Toggle active status
    const updatedTranporter = await prisma.transporterCompanyDetails.update({
      where: { id: transporterId },
      data: {
        activeStatus: !transporter.activeStatus,
      },
    });

    res.status(200).json(updatedTranporter);
  } catch (error) {
    res.status(500).json({ error: "Failed to toggle Tranporter status", details: error.message });
  }
};

exports.deleteTankerById = async (req, res) => {
  const { tankerId } = req.params; // Extract tanker ID from request parameters

  try {
    // Log the received tanker ID
    console.log('Request received to delete tanker with ID:', tankerId);

    // Check if the tanker exists
    const tanker = await prisma.tankerDetails.findUnique({
      where: { id: parseInt(tankerId) },
    });

    if (!tanker) {
      console.log('No tanker found for ID:', tankerId);
      return res.status(404).json({ error: 'Tanker not found' });
    }

    // Delete associated documents first
    await prisma.tankerDocumentsDetails.deleteMany({
      where: { tankerId: parseInt(tankerId) },
    });

    console.log('Associated documents deleted for tanker ID:', tankerId);

    // Delete the tanker
    await prisma.tankerDetails.delete({
      where: { id: parseInt(tankerId) },
    });

    console.log('Tanker deleted with ID:', tankerId);

    // Respond with success
    res.status(200).json({ message: 'Tanker and associated documents deleted successfully' });
  } catch (error) {
    console.error('Error deleting tanker and documents:', error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
};



exports.editTransporterCompany = async (req, res) => {
  try {
    const { id } = req.params; // Extract the ID from the URL parameter
    const {
      transporterName,
      email,
      address1,
      address2,
      state,
      district,
      city,
      zipCode,
      typeOfCompany,
      panNumber,
      gstNumber,
    } = req.body;

    // Find the transporter company by ID
    const existingCompany = await prisma.transporterCompanyDetails.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingCompany) {
      return res.status(404).json({ error: 'Transporter company not found.' });
    }

    // Update the company data
    const updatedCompany = await prisma.transporterCompanyDetails.update({
      where: { id: parseInt(id) },
      data: {
        transporterName,
        email,
        address1,
        address2,
        state,
        district,
        city,
        zipCode,
        typeOfCompany,
        panNumber,
        gstNumber,
      },
    });

    // Update the transporter name in all related tankers
    await prisma.tankerDetails.updateMany({
      where: { transporterId: parseInt(id) }, // Ensure the tankers are linked to this transporter
      data: { transporterName }, // Update transporterName field
    });

    res.status(200).json({
      message: 'Transporter company and related tankers updated successfully.',
      data: updatedCompany,
    });
  } catch (error) {
    console.error('Error updating transporter company:', error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
};




exports.editTransporterContact = async (req, res) => {
  try {
    const { id } = req.params; // Extract the company ID from the route parameter
    const { contacts } = req.body; // Array of contacts to be updated or created

    if (!id) {
      return res.status(400).json({ error: "Company ID is required." });
    }

    if (!Array.isArray(contacts)) {
      return res.status(400).json({ error: "Contacts must be an array." });
    }

    // Delete existing contacts for the company
    await prisma.transporterContactDetails.deleteMany({
      where: {
        companyId: parseInt(id), // Match contacts related to the company ID
      },
    });

    // Create or update new contacts
    const updatedContacts = await Promise.all(
      contacts.map(async (contact) => {
        if (contact.id) {
          // Update existing contact (this is kept in case any update is needed)
          return await prisma.transporterContactDetails.update({
            where: { id: contact.id },
            data: {
              contactName: contact.contactName,
              role: contact.role,
              phoneNumber: contact.phoneNumber,
              email: contact.email,
            },
          });
        } else {
          // Create new contact
          return await prisma.transporterContactDetails.create({
            data: {
              contactName: contact.contactName || null,
              role: contact.role || null,
              phoneNumber: contact.phoneNumber || null,
              email: contact.email || null,
              company: {
                connect: {
                  id: parseInt(id), // Use the company ID from the route parameter
                },
              },
            },
          });
        }
      })
    );

    res.status(200).json({
      message: "Contacts updated successfully.",
      data: updatedContacts,
    });
  } catch (error) {
    console.error("Error updating transporter contacts:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
};




//update bank details 
exports.editTransporterBankDetails = async (req, res) => {
  try {
    const { id } = req.params; // Extract the company ID from the URL parameter
    const { bankDetails } = req.body; // Extract bankDetails array from the request body

    if (!id) {
      return res.status(400).json({ error: "Company ID is required." });
    }

    if (!Array.isArray(bankDetails)) {
      return res.status(400).json({ error: "Bank details must be an array." });
    }

    await prisma.transporterBank.deleteMany({
      where: {
        companyId: parseInt(id), // Match contacts related to the company ID
      },
    });

    // Iterate through the bank details array and update or create as needed
    const updatedBankDetails = await Promise.all(
      bankDetails.map(async (bank) => {
        const { id: bankId, accountName, natureOfAccount, bankName, branchName, ifscCode, accountNumber } = bank;

        if (bankId) {
          // Update existing bank detail
          return prisma.transporterBank.update({
            where: { id: bankId },
            data: {
              accountName: accountName || null,
              natureOfAccount: natureOfAccount || null,
              bankName: bankName || null,
              branchName: branchName || null,
              ifscCode: ifscCode || null,
              accountNumber: accountNumber || null,
            },
          });
        } else {
          // Create new bank detail
          return prisma.transporterBank.create({
            data: {
              accountName: accountName || null,
              natureOfAccount: natureOfAccount || null,
              bankName: bankName || null,
              branchName: branchName || null,
              ifscCode: ifscCode || null,
              accountNumber: accountNumber || null,
              company: {
                connect: {
                  id: parseInt(id), // Associate with the company
                },
              },
            },
          });
        }
      })
    );

    res.status(200).json({
      message: "Transporter bank details updated successfully.",
      data: updatedBankDetails,
    });
  } catch (error) {
    console.error("Error updating transporter bank details:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
};

