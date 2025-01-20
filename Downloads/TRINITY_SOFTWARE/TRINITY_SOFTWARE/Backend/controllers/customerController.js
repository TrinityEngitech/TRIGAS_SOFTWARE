const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


  exports.createCustomerDetails = async (req, res) => {
    try {
      const {
        uuid, // Provided by frontend
        companyName,
        email,
        primaryPhoneNumber,
        secondaryPhoneNumber,
        address1,
        address2,
        state,
        district,
        city,
        zipcode,
        associatedSuppliers,
        team,
        typeOfCompany,
        licenseNumber,
        ourCompanies,
        tanNumber,
        gstNumber,
        panNumber,
        licenseValidTill,
        licenseCapacity,
        latitude,
        longitude,
        transporter,
        competitorSupplier,
      } = req.body;
  
      console.log("UUID:", uuid);
      console.log("Incoming Request Body:", req.body);
  
      // Validate required fields
      if (
        !uuid ||
        !companyName ||
        !email ||
        !primaryPhoneNumber ||
        !address1 ||
        !state ||
        !district ||
        !city ||
        !zipcode ||
        !typeOfCompany
      ) {
        return res.status(400).json({
          error: 'All required fields, including uuid, must be provided.',
        });
      }
  
      // Validate the UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(uuid)) {
        return res.status(400).json({ error: 'Invalid UUID format.' });
      }
      const existingCustomer = await prisma.customerDetails.findUnique({
        where: { uuid },
      });
  
      if (existingCustomer) {
        return res.status(409).json({
          error: 'A customer with this UUID already exists.',
        });
      }
      // Create a new customer record
      const newCustomer = await prisma.customerDetails.create({
        data: {
          uuid,
          companyName,
          email,
          primaryPhoneNumber,
          secondaryPhoneNumber,
          address1,
          address2,
          state,
          district,
          city,
          zipcode,
          associatedSuppliers: associatedSuppliers ? JSON.stringify(associatedSuppliers) : null, // Store as JSON
          team,
          typeOfCompany,
          licenseNumber,
          ourCompanies: ourCompanies ? JSON.stringify(ourCompanies) : null, // Store as JSON
          tanNumber,
          gstNumber,
          panNumber,
          licenseValidTill: licenseValidTill ? new Date(licenseValidTill) : null,
          licenseCapacity,
          latitude,
          longitude,
          transporter,
          competitorSupplier,
        },
      });

      console.log("Saved Customer Record:", newCustomer);
  
      // Return the created record
      res.status(201).json(newCustomer);
    } catch (error) {
      console.error('Error creating customer details:', error);
  
      // Check for unique constraint violations
      if (error.code === 'P2002') {
        return res.status(409).json({ error: 'Duplicate entry for a unique field.' });
      }
  
      // General server error
      res.status(500).json({ error: 'An internal server error occurred.' });
    }
  };

  exports.createCustomerContactDetails = async (req, res) => {
    try {
      const { customerId, contacts } = req.body;
  
      console.log("Customer UUID:", customerId);
      console.log("Contacts:", contacts);
  
      // Validate required fields
      if (!customerId || !Array.isArray(contacts) || contacts.length === 0) {
        return res.status(400).json({
          error: "customerUuid and a non-empty contacts array are required.",
        });
      }
  
      // Check if the customer with the given UUID exists
      const existingCustomer = await prisma.customerDetails.findUnique({
        where: { uuid: customerId },
      });
  
      if (!existingCustomer) {
        return res.status(404).json({
          error: "Customer with the given UUID not found.",
        });
      }
  
      // Validate each contact
      for (const contact of contacts) {
        if (!contact.contactName || !contact.phoneNumber) {
          return res.status(400).json({
            error: "Each contact must have a contactName and phoneNumber.",
          });
        }
      }
  
      // Create multiple records using Prisma
      const createdContacts = await prisma.customerContactDetails.createMany({
        data: contacts.map((contact) => ({
          customerId: existingCustomer.id, // Use the ID from the existing customer
          contactName: contact.contactName,
          phoneNumber: contact.phoneNumber,
          role: contact.role || null,
          commentRemark: contact.commentRemark || null,
        })),
        skipDuplicates: true, // Avoid inserting duplicates
      });
  
      // Return the number of successfully created records
      res.status(201).json({
        message: "Customer contact details added successfully.",
        createdCount: createdContacts.count,
      });
    } catch (error) {
      console.error("Error creating customer contact details:", error);
  
      // Check for unique constraint violations
      if (error.code === "P2002") {
        return res.status(409).json({
          error: "Duplicate entry for a unique field.",
        });
      }
  
      // General server error
      res.status(500).json({
        error: "An internal server error occurred.",
      });
    }
  };
 
  exports.createCustomerGeneralDetails = async (req, res) => {
    try {
      const {
        customerId, // This is UUID received from the frontend
        productSegment,
        noOfKiln,
        lengthOfKiln,
        dailyNaturalGasConsumption,
        dailyConsumption,
        hourlyConsumption,
        monthlyConsumption,
        startingStock,
        startingStockDateTime,
        newPurchase,
        newPurchaseDateTime,
        updatedTotalStock,
        remainingHoursOfStock,
      } = req.body;
  
      console.log("Customer ID (UUID):", customerId);
      console.log("General Details:", req.body);
  
      // Validate required fields
      if (!customerId || !productSegment || noOfKiln === undefined || lengthOfKiln === undefined) {
        return res.status(400).json({
          error: 'customerId, productSegment, noOfKiln, and lengthOfKiln are required.',
        });
      }
  
      // Verify if the Customer with the given UUID exists
      const existingCustomer = await prisma.customerDetails.findUnique({
        where: { uuid: customerId }, // Using UUID for the query
      });
  
      if (!existingCustomer) {
        return res.status(404).json({
          error: 'Customer with the given UUID not found.',
        });
      }
  
      // Parse values to ensure correct data types before saving
      const newGeneralDetails = await prisma.customerGeneralDetails.create({
        data: {
          customerId: existingCustomer.id, // Use the internal ID after verifying UUID
          productSegment,
          noOfKiln: parseInt(noOfKiln), // Ensure noOfKiln is an integer
          lengthOfKiln: parseFloat(lengthOfKiln), // Ensure lengthOfKiln is a float
          dailyNaturalGasConsumption: dailyNaturalGasConsumption ? parseFloat(dailyNaturalGasConsumption) : null,
          dailyConsumption: dailyConsumption ? parseFloat(dailyConsumption) : null,
          hourlyConsumption: hourlyConsumption ? parseFloat(hourlyConsumption) : null,
          monthlyConsumption: monthlyConsumption ? parseFloat(monthlyConsumption) : null,
          startingStock: startingStock ? parseFloat(startingStock) : null,
          startingStockDateTime: startingStockDateTime ? new Date(startingStockDateTime) : null,
          newPurchase: newPurchase ? parseFloat(newPurchase) : null,
          newPurchaseDateTime: newPurchaseDateTime ? new Date(newPurchaseDateTime) : null,
          updatedTotalStock: updatedTotalStock ? parseFloat(updatedTotalStock) : null,
          remainingHoursOfStock: remainingHoursOfStock ? parseFloat(remainingHoursOfStock) : null,
        },
      });
  
      // Return the created record
      res.status(201).json({
        message: 'Customer general details added successfully.',
        data: newGeneralDetails,
      });
    } catch (error) {
      console.error('Error creating customer general details:', error);
  
      // Check for unique constraint violations
      if (error.code === 'P2002') {
        return res.status(409).json({
          error: 'Duplicate entry for a unique field.',
        });
      }
  
      // General server error
      res.status(500).json({
        error: 'An internal server error occurred.',
      });
    }
  };
  
 

  exports.createCustomerSAPCodesDetails = async (req, res) => {
    try {
      const { customerId, sapCodesDetails } = req.body;
  
      console.log("Customer ID (UUID):", customerId);
      console.log("SAP Codes Details:", sapCodesDetails);
  
      // Validate required fields
      if (!customerId || !Array.isArray(sapCodesDetails) || sapCodesDetails.length === 0) {
        return res.status(400).json({
          error: 'customerId and a non-empty sapCodesDetails array are required.',
        });
      }
  
      // Verify if the Customer with the given UUID exists in the CustomerDetails table
      const existingCustomer = await prisma.customerDetails.findUnique({
        where: { uuid: customerId }, // Use UUID for querying
      });
  
      if (!existingCustomer) {
        return res.status(404).json({
          error: 'Customer with the given UUID not found.',
        });
      }
  
      // Validate each SAP code entry
      for (const detail of sapCodesDetails) {
        if (!detail.supplierName || !detail.productName || !detail.sapCode) {
          return res.status(400).json({
            error: 'Each SAP code entry must include supplierName, productName, and sapCode.',
          });
        }
      }
  
      // Create multiple records for SAP codes
      const newSAPCodes = await prisma.customerSAPCodesDetails.createMany({
        data: sapCodesDetails.map((detail) => ({
          customerId: existingCustomer.id, // Use the internal customer ID after verifying UUID
          supplierName: detail.supplierName,
          productName: detail.productName,
          sapCode: detail.sapCode,
        })),
      });
  
      // Return the created records count
      res.status(201).json({
        message: 'Customer SAP codes added successfully.',
        count: newSAPCodes.count,
      });
    } catch (error) {
      console.error('Error creating customer SAP codes:', error);
  
      // Check for unique constraint violations
      if (error.code === 'P2002') {
        return res.status(409).json({
          error: 'Duplicate entry for a unique field.',
        });
      }
  
      // General server error
      res.status(500).json({
        error: 'An internal server error occurred.',
      });
    }
  };
  
  
  exports.createCustomerBankDetails = async (req, res) => {
    try {
      const { customerId, bankDetails } = req.body;
  
      console.log("Customer ID:", customerId);
      console.log("Bank Details:", bankDetails);
  
      // Validate required fields
      if (!customerId || !Array.isArray(bankDetails) || bankDetails.length === 0) {
        return res.status(400).json({
          error: 'customerId and a non-empty bankDetails array are required.',
        });
      }
  
      // Validate each bank detail entry
      for (const detail of bankDetails) {
        if (
          !detail.accountName ||
          !detail.natureOfAccount ||
          !detail.bankName ||
          !detail.branchName ||
          !detail.ifscCode ||
          !detail.accountNumber
        ) {
          return res.status(400).json({
            error:
              'Each bank detail entry must include accountName, natureOfAccount, bankName, branchName, ifscCode, and accountNumber.',
          });
        }
      }
  
      // Create multiple records for bank details
      const newBankDetails = await prisma.customerBankDetails.createMany({
        data: bankDetails.map((detail) => ({
          customerId,
          accountName: detail.accountName,
          natureOfAccount: detail.natureOfAccount,
          bankName: detail.bankName,
          branchName: detail.branchName,
          ifscCode: detail.ifscCode,
          accountNumber: detail.accountNumber,
        })),
      });
  
      // Return the created records count
      res.status(201).json({
        message: 'Customer bank details added successfully.',
        count: newBankDetails.count,
      });
    } catch (error) {
      console.error('Error creating customer bank details:', error);
  
      // Check for unique constraint violations
      if (error.code === 'P2002') {
        return res.status(409).json({
          error: 'Duplicate entry for a unique field.',
        });
      }
  
      // General server error
      res.status(500).json({
        error: 'An internal server error occurred.',
      });
    }
  };

  
exports.createVirtualAccount = async (req, res) => {
  try {
    const {
      customerId,      // UUID received from the frontend
      customerName,    // Name of the customer
      customerCode,    // Customer code (SAP Code)
      productName,     // Product name (e.g., PROPANE)
      sapCode,         // SAP Code
      supplierId,      // Supplier ID
      supplierName,    // Supplier name (e.g., IOCL)
      supplierLogo,    // Supplier logo
    } = req.body;

    console.log("Account Details:", req.body); // Debug log for incoming data

    // Validate required fields
    if (!customerId || !customerName || !customerCode || !supplierId) {
      return res.status(400).json({
        error: 'customerId, customerName, customerCode, and supplierId are required.',
      });
    }

    // Verify if the Customer with the given UUID exists
    const existingCustomer = await prisma.customerDetails.findUnique({
      where: { uuid: customerId }, // Query using the customer UUID
    });

    if (!existingCustomer) {
      return res.status(404).json({
        error: 'Customer with the given UUID not found.',
      });
    }

    // Fetch supplier bank details by supplier ID
    const supplier = await prisma.supplier.findUnique({
      where: { id: supplierId },
      include: { bankDetails: true }, // Include related bank details
    });

    if (!supplier) {
      return res.status(404).json({
        error: 'Supplier with the given ID not found.',
      });
    }

    const { bankDetails } = supplier;

    if (!bankDetails || bankDetails.length === 0) {
      return res.status(404).json({
        error: `No bank details found for Supplier ID ${supplierId}`,
      });
    }

    // Filter bank details based on productName
    let filteredBankDetails = bankDetails.filter((detail) => detail.productName === productName);

    // If no rows match the productName, include all bank details for the supplier
    if (filteredBankDetails.length === 0) {
      filteredBankDetails = bankDetails;
    }

    // Filter active bank details and create virtual accounts
    const virtualAccountsData = filteredBankDetails
      .filter((detail) => detail.activeStatus) // Only active bank details
      .map((detail) => {
        // Replace SAP Code in the bank account numbers
        const replaceSapCode = (text) =>
          text?.includes("SAP Code") ? text.replace("SAP Code", customerCode) : text;

        const preNumber = replaceSapCode(detail.preNumber);
        const middleNumber = replaceSapCode(detail.middleNumber);
        const postNumber = replaceSapCode(detail.postNumber);

        // Construct the virtual account number
        const virtualAccountNumber = `${preNumber}${middleNumber}${postNumber}`;

        return {
          customerId: existingCustomer.id, // Internal customer ID
          accountName: customerName,
          natureOfAccount: "Virtual Account",
          bankName: detail.bankName,
          branchName: detail.branchName,
          ifscCode: detail.ifscCode,
          accountNumber: virtualAccountNumber, // New virtual account number
          supplierName: supplierName,
          productName: productName,
          sapCode: sapCode,
          supplierLogo: supplierLogo,
        };
      });

    // If no active bank details are found, return an error
    if (virtualAccountsData.length === 0) {
      return res.status(404).json({
        error: `No active bank details to generate virtual accounts for Supplier ID ${supplierId}`,
      });
    }

    // Insert data into the database using Prisma ORM
    const newVirtualAccounts = await prisma.customerBankDetails.createMany({
      data: virtualAccountsData,
    });

    // Return the created virtual account details
    res.status(201).json({
      message: 'Virtual accounts created successfully.',
      data: newVirtualAccounts,
    });
  } catch (error) {
    console.error('Error creating virtual accounts:', error);

    // Check for unique constraint violations (e.g., duplicate entries)
    if (error.code === 'P2002') {
      return res.status(409).json({
        error: 'Duplicate entry for a unique field.',
      });
    }

    // General server error
    res.status(500).json({
      error: 'An internal server error occurred.',
    });
  }
};





  

// ----------------------------------------------------------------
  exports.getAllCustomersDetails = async (req, res) => {
    try {
      // Fetch all customers with their associated data
      const customers = await prisma.customerDetails.findMany({
        include: {
          contactDetails: true,  // Fetch all contact details for each customer
          generalDetails: true,  // Fetch general details for each customer
          sapCodesDetails: true,  // Fetch SAP codes for each customer
          bankDetails: true,  // Fetch bank details for each customer
        },
      });
  
      // If no customers found
      if (customers.length === 0) {
        return res.status(404).json({ error: 'No customers found.' });
      }
  
      // Return the list of customers with all associated data
      res.status(200).json(customers);
    } catch (error) {
      console.error('Error fetching all customers:', error);
      res.status(500).json({ error: 'An internal server error occurred.' });
    }
  };

  exports.getByidCustomerDetails = async (req, res) => {
    const { customerId } = req.params;
  
    try {
      let customer;
  
      // Check if customerId is numeric or alphanumeric (UUID)
      if (!isNaN(Number(customerId))) {
        // If numeric, fetch using the `id` field
        customer = await prisma.customerDetails.findUnique({
          where: { id: Number(customerId) },
          include: {
            contactDetails: true,
            generalDetails: true,
            sapCodesDetails: true,
            bankDetails: true,
          },
        });
      } else {
        // If alphanumeric (UUID), fetch using the `uuid` field
        customer = await prisma.customerDetails.findUnique({
          where: { uuid: customerId }, // Assuming your Prisma schema includes a `uuid` field
          include: {
            contactDetails: true,
            generalDetails: true,
            sapCodesDetails: true,
            bankDetails: true,
          },
        });
      }
  
      // If customer is not found
      if (!customer) {
        return res.status(404).json({ error: 'Customer not found.' });
      }
  
      // Return the customer data
      res.status(200).json(customer);
    } catch (error) {
      console.error('Error fetching customer details:', error);
      res.status(500).json({ error: 'An internal server error occurred.' });
    }
  };
  exports.getCustomerBankDetailsById = async (req, res) => {
    const { id } = req.params;  // Extracting the ID from the request parameters
    
    try {
      // Query the database using Prisma to get the bank details by customer ID
      const bankDetails = await prisma.customerBankDetails.findUnique({
        where: {
          id: parseInt(id),  // Converting the ID to an integer
        },
        include: {
          customer: true,  // If you want to include customer details in the response as well
        },
      });
  
      if (!bankDetails) {
        return res.status(404).json({ message: 'Bank details not found' });
      }
  
      return res.json(bankDetails);
    } catch (error) {
      console.error('Error fetching bank details:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  


  
//   -----------------------------------------------------
  exports.updateCustomerDetails = async (req, res) => {
    try {
      const {
        uuid, // Provided by frontend, remains unchanged
        companyName,
        email,
        primaryPhoneNumber,
        secondaryPhoneNumber,
        address1,
        address2,
        state,
        district,
        city,
        zipcode,
        associatedSuppliers,
        team,
        typeOfCompany,
        licenseNumber,
        ourCompanies,
        tanNumber,
        gstNumber,
        panNumber,
        licenseValidTill,
        licenseCapacity,
        latitude,
        longitude,
        transporter,
        competitorSupplier,
      } = req.body;
  
      console.log("UUID:", uuid);
      console.log(req.body);
  
      // Validate required fields
      if (
        !uuid ||
        !companyName ||
        !email ||
        !primaryPhoneNumber ||
        !address1 ||
        !state ||
        !district ||
        !city ||
        !zipcode ||
        !typeOfCompany
      ) {
        return res.status(400).json({
          error: 'All required fields, including uuid, must be provided.',
        });
      }
  
      // Validate the UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(uuid)) {
        return res.status(400).json({ error: 'Invalid UUID format.' });
      }
  
      // Find and update the customer record based on uuid
      const updatedCustomer = await prisma.customerDetails.update({
        where: {
          uuid, // Use uuid to find the existing customer
        },
        data: {
          companyName,
          email,
          primaryPhoneNumber,
          secondaryPhoneNumber,
          address1,
          address2,
          state,
          district,
          city,
          zipcode,
          associatedSuppliers,
          team,
          typeOfCompany,
          licenseNumber,
          ourCompanies,
          tanNumber,
          gstNumber,
          panNumber,
          licenseValidTill: licenseValidTill ? new Date(licenseValidTill) : null,
          licenseCapacity,
          latitude,
          longitude,
          transporter,
          competitorSupplier,
        },
      });
  
      // Return the updated customer record
      res.status(200).json(updatedCustomer);
    } catch (error) {
      console.error('Error updating customer details:', error);
  
      // Check for unique constraint violations
      if (error.code === 'P2002') {
        return res.status(409).json({ error: 'Duplicate entry for a unique field.' });
      }
  
      // Handle record not found error
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Customer not found.' });
      }
  
      // General server error
      res.status(500).json({ error: 'An internal server error occurred.' });
    }
  };


  exports.updateCustomerContactDetails = async (req, res) => {
    try {
        const { customerId, contacts } = req.body;
    
        // Ensure customerId is an integer
        const customerIdInt = parseInt(customerId, 10);
    
        if (isNaN(customerIdInt)) {
          return res.status(400).json({
            error: 'Invalid customerId, it should be a valid number.',
          });
        }
    
        console.log("Customer ID:", customerIdInt);
        console.log("Contacts:", contacts);
    
        // Validate required fields
        if (!customerId || !Array.isArray(contacts) || contacts.length === 0) {
          return res.status(400).json({
            error: 'customerId and a non-empty contacts array are required.',
          });
        }
    
        // Validate each contact
        for (const contact of contacts) {
          if (!contact.contactName || !contact.phoneNumber || !contact.role) {
            return res.status(400).json({
              error: 'Each contact must have a contactName and phoneNumber.',
            });
          }
        }
    
        // Delete existing contact details for the given customerId
        await prisma.customerContactDetails.deleteMany({
          where: {
            customerId: customerIdInt,  // Use the integer value of customerId
          }
        });
    
        // Create new contact records
        const createdContacts = await prisma.customerContactDetails.createMany({
          data: contacts.map((contact) => ({
            customerId: customerIdInt,
            contactName: contact.contactName,
            phoneNumber: contact.phoneNumber,
            role: contact.role,
            commentRemark: contact.commentRemark || null,
          })),
          skipDuplicates: true, // Prevent duplicates if needed
        });
    
        // Return the created records count
        res.status(201).json({
          message: 'Customer contact details updated successfully.',
          createdCount: createdContacts.count,
        });
      } catch (error) {
        console.error('Error updating customer contact details:', error);
    
        // Check for unique constraint violations
        if (error.code === 'P2002') {
          return res.status(409).json({
            error: 'Duplicate entry for a unique field.',
          });
        }
    
        // General server error
        res.status(500).json({
          error: 'An internal server error occurred.',
        });
      }
  };

  


  // exports.updateCustomerGeneralDetails  = async (req, res) => {
  //   try {
  //       const {
  //         customerId,
  //         productSegment,
  //         noOfKiln,
  //         lengthOfKiln,
  //         dailyNaturalGasConsumption,
  //         dailyConsumption,
  //         hourlyConsumption,
  //         monthlyConsumption,
  //         startingStock,
  //         startingStockDateTime,
  //         newPurchase,
  //         newPurchaseDateTime,
  //         updatedTotalStock,
  //         remainingHoursOfStock,
  //       } = req.body;
    
  //       console.log("Customer ID:", customerId);
  //       console.log("General Details:", req.body);
    
  //       // Validate required fields
  //       if (!customerId || !productSegment || noOfKiln === undefined || lengthOfKiln === undefined) {
  //         return res.status(400).json({
  //           error: 'customerId, productSegment, noOfKiln, and lengthOfKiln are required.',
  //         });
  //       }
    
  //       // Delete all existing records for the customerId
  //       await prisma.customerGeneralDetails.deleteMany({
  //         where: { customerId },
  //       });
    
  //       // Create new customer general details
  //       const newGeneralDetails = await prisma.customerGeneralDetails.create({
  //         data: {
  //           customerId,
  //           productSegment,
  //           noOfKiln,
  //           lengthOfKiln,
  //           dailyNaturalGasConsumption: dailyNaturalGasConsumption || null,
  //           dailyConsumption: dailyConsumption || null,
  //           hourlyConsumption: hourlyConsumption || null,
  //           monthlyConsumption: monthlyConsumption || null,
  //           startingStock: startingStock || null,
  //           startingStockDateTime: startingStockDateTime || null,
  //           newPurchase: newPurchase || null,
  //           newPurchaseDateTime: newPurchaseDateTime || null,
  //           updatedTotalStock: updatedTotalStock || null,
  //           remainingHoursOfStock: remainingHoursOfStock || null,
  //         },
  //       });
    
  //       // Return the newly created record
  //       res.status(201).json({
  //         message: 'Customer general details updated successfully.',
  //         data: newGeneralDetails,
  //       });
  //     } catch (error) {
  //       console.error('Error updating customer general details:', error);
    
  //       // Check for unique constraint violations
  //       if (error.code === 'P2002') {
  //         return res.status(409).json({
  //           error: 'Duplicate entry for a unique field.',
  //         });
  //       }
    
  //       // General server error
  //       res.status(500).json({
  //         error: 'An internal server error occurred.',
  //       });
  //     }
  // };

  exports.updateCustomerGeneralDetails = async (req, res) => {
    try {
      const {
        customerId,
        productSegment,
        noOfKiln,
        lengthOfKiln,
        dailyNaturalGasConsumption,
        dailyConsumption,
        hourlyConsumption,
        monthlyConsumption,
        startingStock,
        startingStockDateTime,
        newPurchase,
        newPurchaseDateTime,
        updatedTotalStock,
        remainingHoursOfStock,
      } = req.body;
  
      console.log("Customer ID:", customerId);
      console.log("General Details:", req.body);
  
      // Validate required fields
      if (!customerId || !productSegment || noOfKiln === undefined || lengthOfKiln === undefined) {
        return res.status(400).json({
          error: 'customerId, productSegment, noOfKiln, and lengthOfKiln are required.',
        });
      }
  
      // Convert all numeric fields to numbers
      const parsedDetails = {
        customerId: parseInt(customerId, 10),
        noOfKiln: parseFloat(noOfKiln),
        lengthOfKiln: parseFloat(lengthOfKiln),
        dailyNaturalGasConsumption: dailyNaturalGasConsumption ? parseFloat(dailyNaturalGasConsumption) : null,
        dailyConsumption: dailyConsumption ? parseFloat(dailyConsumption) : null,
        hourlyConsumption: hourlyConsumption ? parseFloat(hourlyConsumption) : null,
        monthlyConsumption: monthlyConsumption ? parseFloat(monthlyConsumption) : null,
        startingStock: startingStock ? parseFloat(startingStock) : null,
        newPurchase: newPurchase ? parseFloat(newPurchase) : null,
        updatedTotalStock: updatedTotalStock ? parseFloat(updatedTotalStock) : null,
        remainingHoursOfStock: remainingHoursOfStock ? parseFloat(remainingHoursOfStock) : null,
      };
  
      // Parse date fields
      const parsedDates = {
        startingStockDateTime: startingStockDateTime ? new Date(startingStockDateTime) : null,
        newPurchaseDateTime: newPurchaseDateTime ? new Date(newPurchaseDateTime) : null,
      };
  
      // Delete all existing records for the customerId
      await prisma.customerGeneralDetails.deleteMany({
        where: { customerId: parsedDetails.customerId },
      });
  
      // Create new customer general details
      const newGeneralDetails = await prisma.customerGeneralDetails.create({
        data: {
          customerId: parsedDetails.customerId,
          productSegment,
          noOfKiln: parsedDetails.noOfKiln,
          lengthOfKiln: parsedDetails.lengthOfKiln,
          dailyNaturalGasConsumption: parsedDetails.dailyNaturalGasConsumption,
          dailyConsumption: parsedDetails.dailyConsumption,
          hourlyConsumption: parsedDetails.hourlyConsumption,
          monthlyConsumption: parsedDetails.monthlyConsumption,
          startingStock: parsedDetails.startingStock,
          startingStockDateTime: parsedDates.startingStockDateTime,
          newPurchase: parsedDetails.newPurchase,
          newPurchaseDateTime: parsedDates.newPurchaseDateTime,
          updatedTotalStock: parsedDetails.updatedTotalStock,
          remainingHoursOfStock: parsedDetails.remainingHoursOfStock,
        },
      });
  
      // Return the newly created record
      res.status(201).json({
        message: 'Customer general details updated successfully.',
        data: newGeneralDetails,
      });
    } catch (error) {
      console.error('Error updating customer general details:', error);
  
      // Check for unique constraint violations
      if (error.code === 'P2002') {
        return res.status(409).json({
          error: 'Duplicate entry for a unique field.',
        });
      }
  
      // General server error
      res.status(500).json({
        error: 'An internal server error occurred.',
      });
    }
  };
  
  
  


  exports.updateCustomerSAPCodesDetails = async (req, res) => {
    try {
        const { customerId, sapCodesDetails } = req.body;
    
        console.log("Customer ID:", customerId);
        console.log("SAP Codes Details:", sapCodesDetails);
    
        // Validate required fields
        if (!customerId || !Array.isArray(sapCodesDetails) || sapCodesDetails.length === 0) {
          return res.status(400).json({
            error: 'customerId and a non-empty sapCodesDetails array are required.',
          });
        }
    
        // Validate each SAP code entry
        for (const detail of sapCodesDetails) {
          if (!detail.supplierName || !detail.productName || !detail.sapCode) {
            return res.status(400).json({
              error: 'Each SAP code entry must include supplierName, productName, and sapCode.',
            });
          }
        }
    
        // Delete existing SAP codes for the given customerId
        await prisma.customerSAPCodesDetails.deleteMany({
          where: {
            customerId: customerId,
          },
        });
    
        // Create new records for SAP codes
        const newSAPCodes = await prisma.customerSAPCodesDetails.createMany({
          data: sapCodesDetails.map((detail) => ({
            customerId,
            supplierName: detail.supplierName,
            productName: detail.productName,
            sapCode: detail.sapCode,
          })),
        });
    
        // Return the created records count
        res.status(200).json({
          message: 'Customer SAP codes updated successfully.',
          count: newSAPCodes.count,
        });
      } catch (error) {
        console.error('Error updating customer SAP codes:', error);
    
        // Check for unique constraint violations
        if (error.code === 'P2002') {
          return res.status(409).json({
            error: 'Duplicate entry for a unique field.',
          });
        }
    
        // General server error
        res.status(500).json({
          error: 'An internal server error occurred.',
        });
      }
  };
 

  exports.deleteCustomerSAPCode = async (req, res) => {
    const { sapCodeId } = req.body;  // Assuming you're sending the sapCodeId from the frontend in the body
  
    try {
      // First, find the CustomerSAPCodesDetails by ID to get the sapCode
      const sapCodeDetails = await prisma.customerSAPCodesDetails.findUnique({
        where: {
          id: sapCodeId,  // Use the ID sent from the frontend
        },
      });
  
      if (!sapCodeDetails) {
        return res.status(404).json({ message: "Customer SAP Code not found" });
      }
  
      // Get the sapCode from the found CustomerSAPCodesDetails
      const { sapCode } = sapCodeDetails;
  
      // Now delete the CustomerBankDetails where the sapCode matches
      await prisma.customerBankDetails.deleteMany({
        where: {
          sapCode: sapCode,  // Deleting based on sapCode
        },
      });
  
      // Finally, delete the CustomerSAPCodesDetails
      const deletedSAPCode = await prisma.customerSAPCodesDetails.delete({
        where: {
          id: sapCodeId,  // Use the ID to delete the SAP Code
        },
      });
  
      res.status(200).json({ message: "Customer SAP Code and related bank details deleted", deletedSAPCode });
    } catch (error) {
      console.error("Error deleting SAP Code and related bank details:", error);
      res.status(500).json({ message: "Error deleting SAP Code and related bank details", error: error.message });
    }
  };
  
  
  
  


  
  
  