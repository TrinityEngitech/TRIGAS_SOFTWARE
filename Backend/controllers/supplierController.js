const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


exports.createSupplier = async (req, res) => {
  console.log("Request Body (form data):", req.body);
  console.log("Uploaded Files (if any):", req.files);

  // Parse the `data` field (which is a stringified JSON object)
  const parsedData = JSON.parse(req.body.data);

  const {
    supplierName,
    legalName,
    supplierEmail,
    supplierGstNumber,
    supplierPanNumber,
    products = [], // Default to empty array if undefined
    productLocations = {}, // Default to empty object if undefined
    contacts = [], // Default to empty array if undefined
    bankDetails = [], // Default to empty array if undefined
    activeStatus = true, // Default to true if undefined
  } = parsedData;

  try {
    // Retrieve the logo file path if uploaded, else null
    const supplierLogoPath = req.files?.supplierLogo?.[0]?.path || null;

    const supplier = await prisma.supplier.create({
      data: {
        name: supplierName,
        legalName,
        email: supplierEmail,
        gstNumber: supplierGstNumber,
        panNumber: supplierPanNumber,
        supplierLogo: supplierLogoPath,
        activeStatus, // Apply activeStatus to the supplier
        products: {
          create: products.map((product) => ({
            name: product.productName,
            code: product.productCode,
            activeStatus, // Apply activeStatus to each product
            locations: {
              create: productLocations[product._id]?.map((location) => ({
                location: location.location,
                zipCode: location.zipCode,
                activeStatus, // Apply activeStatus to each location
              })) || [], // Default to empty array if no locations found
            },
          })),
        },
        contacts: {
          create: contacts.map((contact) => ({
            name: contact.contactName,
            designation: contact.designation,
            email: contact.email,
            phoneNumber: contact.phoneNumber,
            activeStatus, // Apply activeStatus to each contact
          })),
        },
        bankDetails: {
          create: bankDetails.map((bank) => ({
            accountName: bank.accountName,
            productName: bank.productName,
            typeOfAccount: bank.typeOfAccount,
            bankName: bank.bankName,
            branchName: bank.branchName,
            ifscCode: bank.ifscCode,
            accountNumber: bank.accountNumber,
            preNumber: bank.preNumber,
            middleNumber: bank.middleNumber,
            postNumber: bank.postNumber,
            activeStatus: bank.activeStatus ?? true, // Default to true if not provided
          })),
        },
      },
    });

    // Respond with the created supplier data
    res.status(201).json(supplier);
  } catch (err) {
    console.error("Error creating supplier:", err.message);
    res.status(500).json({ error: "An error occurred while adding the supplier." });
  }
};


exports.addDoSo = async (req, res) => {
  try {
    const { supplierId, doso } = req.body;

    console.log(req.body);
    
    // Parse supplierId to ensure it's an integer
    const supplierIdInt = parseInt(supplierId);
    if (isNaN(supplierIdInt)) {
      return res.status(400).json({ message: "Invalid supplierId!" });
    }

    // Validate input
    if (!supplierIdInt || !Array.isArray(doso) || doso.length === 0) {
      return res.status(400).json({ message: "Invalid data format!" });
    }

    // Step 1: Remove existing DoSo records for this supplierId
    await prisma.doSo.deleteMany({
      where: { supplierId: supplierIdInt }, // Use parsed supplierId
    });

    // Step 2: Prepare data for insertion
    const newRecords = doso.map(item => ({
      supplierId: supplierIdInt, // Use parsed supplierId
      supplierName: item.supplierName,
      productName: item.productName,
      loadingPoint: item.loadingPoint,
      doSoNumber: String(item.doSoNumber), // Convert to string
      customerName: item.customerName,
      customerCode: String(item.customerCode),
      
      productCode: String(item.productCode)
    }));

    // Step 3: Insert new records into the database
    await prisma.doSo.createMany({
      data: newRecords,
    });

    return res.status(201).json({ message: "DoSo records updated successfully!" });
  } catch (error) {
    console.error("Error updating DoSo records:", error);
    return res.status(500).json({ message: "Internal server error!" });
  }
};



exports.getDoSoBySupplierId = async (req, res) => {
  try {
    const { id } = req.params;

    // Ensure supplierId is valid
    const supplierIdInt = parseInt(id);
    if (isNaN(supplierIdInt)) {
      return res.status(400).json({ message: "Invalid supplierId!" });
    }

    // Fetch the DoSo records for the supplierId
    const doSoRecords = await prisma.doSo.findMany({
      where: { supplierId: supplierIdInt }, // Query based on supplierId
    });

    if (doSoRecords.length === 0) {
      return res.status(404).json({ message: "No records found for this supplierId!" });
    }

    // Return the fetched records
    return res.status(200).json({
      message: "DoSo records fetched successfully!",
      data: doSoRecords, // Send the fetched records
    });
  } catch (error) {
    console.error("Error fetching DoSo records:", error);
    return res.status(500).json({ message: "Internal server error!" });
  }
};



exports.toggleActiveStatus = async (req, res) => {
  const { id } = req.params;
  const { activeStatus } = req.body; // true or false

  try {
    // Update supplier's active status
    const updatedSupplier = await prisma.supplier.update({
      where: { id: parseInt(id) },
      data: { activeStatus },
    });

    // Execute all related updates in parallel
    const updatePromises = [
      prisma.product.updateMany({
        where: { supplierId: updatedSupplier.id },
        data: { activeStatus },
      }),
      prisma.location.updateMany({
        where: { product: { supplierId: updatedSupplier.id } },
        data: { activeStatus },
      }),
      prisma.contact.updateMany({
        where: { supplierId: updatedSupplier.id },
        data: { activeStatus },
      }),
      prisma.supplierBankDetails.updateMany({
        where: { supplierId: updatedSupplier.id },
        data: { activeStatus },
      }),
    ];

    // Wait for all promises to resolve in parallel
    await Promise.all(updatePromises);

    // Return success response
    res.json({ success: true, data: updatedSupplier });
  } catch (err) {
    console.error("Error toggling active status:", err.message);
    res.status(500).json({ error: "An error occurred while toggling active status." });
  }
};

exports.getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await prisma.supplier.findMany({
      include: {
        products: {
          include: {
            locations: true,
          },
        },
        contacts: true,
        bankDetails: true,

      },
    });
    res.json(suppliers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while fetching suppliers." });
  }
};

exports.getSupplierById = async (req, res) => {
  const { id } = req.params;

  try {
    const supplier = await prisma.supplier.findUnique({
      where: { id: parseInt(id) },
      include: {
        products: {
          include: {
            locations: true,
          },
        },
        bankDetails:true,
        contacts: true,   
        bankDetails: true,   
      },
    });

    if (!supplier) {
      return res.status(404).json({ error: "Supplier not found." });
    }

    res.json(supplier);
  } catch (err) {
    console.error("Error fetching supplier:", err);
    res.status(500).json({ error: "An error occurred while fetching the supplier." });
  }
};

// exports.updateSupplierById = async (req, res) => {
//   const { id } = req.params;
//   const {
//     supplierName,
//     legalName, // Added legalName
//     supplierEmail,
//     supplierGstNumber,
//     supplierPanNumber,
//     products,
//     productLocations,
//     contacts,
//     bankDetails, // Added bankDetails
//     activeStatus, // New activeStatus field
//   } = req.body;

//   try {
//     // First transaction to update the supplier
//     const updatedSupplier = await prisma.supplier.update({
//       where: { id: parseInt(id) },
//       data: {
//         name: supplierName,
//         legalName, // Update legalName
//         email: supplierEmail,
//         gstNumber: supplierGstNumber,
//         panNumber: supplierPanNumber,
//         activeStatus, // Update activeStatus
//       },
//     });

//     // Second transaction for deleting existing data
//     await prisma.$transaction([
//       prisma.location.deleteMany({ where: { product: { supplierId: parseInt(id) } } }),
//       prisma.product.deleteMany({ where: { supplierId: parseInt(id) } }),
//       prisma.contact.deleteMany({ where: { supplierId: parseInt(id) } }),
//       prisma.supplierBankDetails.deleteMany({ where: { supplierId: parseInt(id) } }), // Delete bank details
//     ]);

//     // Third transaction for creating new products and locations
//     for (const product of products) {
//       const createdProduct = await prisma.product.create({
//         data: {
//           name: product.productName,
//           code: product.productCode,
//           supplierId: updatedSupplier.id,
//           activeStatus, // Apply activeStatus to products
//         },
//       });

//       const locations = productLocations[product._id] || [];
//       for (const location of locations) {
//         await prisma.location.create({
//           data: {
//             location: location.location,
//             zipCode: location.zipCode,
//             productId: createdProduct.id,
//             activeStatus, // Apply activeStatus to locations
//           },
//         });
//       }
//     }

//     // Fourth transaction for creating new contacts
//     for (const contact of contacts) {
//       await prisma.contact.create({
//         data: {
//           name: contact.contactName,
//           designation: contact.designation,
//           email: contact.email,
//           phoneNumber: contact.phoneNumber,
//           supplierId: updatedSupplier.id,
//           activeStatus, // Apply activeStatus to contacts
//         },
//       });
//     }

//     // Fifth transaction for creating new bank details
//     for (const bank of bankDetails) {
//       await prisma.supplierBankDetails.create({
//         data: {
//           accountName: bank.accountName,
//           typeOfAccount: bank.typeOfAccount,
//           bankName: bank.bankName,
//           branchName: bank.branchName,
//           ifscCode: bank.ifscCode,
//           accountNumber: bank.accountNumber,
//           preNumber: bank.preNumber,
//           middleNumber: bank.middleNumber,
//           postNumber: bank.postNumber,
//           activeStatus: bank.activeStatus ?? true, // Default to true if not provided
//           supplierId: updatedSupplier.id,
//         },
//       });
//     }

//     res.json({ success: true, data: updatedSupplier });
//   } catch (err) {
//     console.error("Error updating supplier:", err.message);
//     res.status(500).json({ error: "An error occurred while updating the supplier." });
//   }
// };


const fs = require("fs").promises; // For file system operations

exports.updateSupplierById = async (req, res) => {
  console.log("Request Body (form data):", req.body);
  console.log("Uploaded Files (if any):", req.files);

  const { id } = req.params;

  // Parse the `data` field (which is a stringified JSON object)
  const parsedData = JSON.parse(req.body.data);

  const {
    supplierName,
    legalName,
    supplierEmail,
    supplierGstNumber,
    supplierPanNumber,
    products = [],
    productLocations = {},
    contacts = [],
    bankDetails = [],
    activeStatus = true,
  } = parsedData;

  try {
    // Retrieve the new logo file path if uploaded, else null
    const newSupplierLogoPath = req.files?.supplierLogo?.[0]?.path || null;

    // Fetch existing supplier to get the old logo path
    const existingSupplier = await prisma.supplier.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingSupplier) {
      return res.status(404).json({ error: "Supplier not found." });
    }

    // Delete the old supplier logo file if a new one is uploaded
    if (newSupplierLogoPath && existingSupplier.supplierLogo) {
      await fs.unlink(existingSupplier.supplierLogo).catch((err) =>
        console.error("Error deleting old supplier logo:", err.message)
      );
    }

    // Update the supplier details
    const updatedSupplier = await prisma.supplier.update({
      where: { id: parseInt(id) },
      data: {
        name: supplierName,
        legalName,
        email: supplierEmail,
        gstNumber: supplierGstNumber,
        panNumber: supplierPanNumber,
        supplierLogo: newSupplierLogoPath || existingSupplier.supplierLogo,
        activeStatus,
      },
    });

    // Delete old related data (products, locations, contacts, and bank details)
    await prisma.$transaction([
      prisma.location.deleteMany({ where: { product: { supplierId: parseInt(id) } } }),
      prisma.product.deleteMany({ where: { supplierId: parseInt(id) } }),
      prisma.contact.deleteMany({ where: { supplierId: parseInt(id) } }),
      prisma.supplierBankDetails.deleteMany({ where: { supplierId: parseInt(id) } }),
    ]);

    // Add new products and locations
    const productPromises = products.map((product) =>
      prisma.product.create({
        data: {
          name: product.productName,
          code: product.productCode,
          supplierId: updatedSupplier.id,
          activeStatus,
          locations: {
            create: productLocations[product._id]?.map((location) => ({
              location: location.location,
              zipCode: location.zipCode,
              activeStatus,
            })) || [],
          },
        },
      })
    );

    // Add new contacts
    const contactPromises = contacts.map((contact) =>
      prisma.contact.create({
        data: {
          name: contact.contactName,
          designation: contact.designation,
          email: contact.email,
          phoneNumber: contact.phoneNumber,
          supplierId: updatedSupplier.id,
          activeStatus,
        },
      })
    );

    // Add new bank details
    const bankDetailsPromises = bankDetails.map((bank) =>
      prisma.supplierBankDetails.create({
        data: {
          accountName: bank.accountName,
          productName: bank.productName,
          typeOfAccount: bank.typeOfAccount,
          bankName: bank.bankName,
          branchName: bank.branchName,
          ifscCode: bank.ifscCode,
          accountNumber: bank.accountNumber,
          preNumber: bank.preNumber,
          middleNumber: bank.middleNumber,
          postNumber: bank.postNumber,
          activeStatus: bank.activeStatus ?? true,
          supplierId: updatedSupplier.id,
        },
      })
    );

    // Execute all creation promises
    await Promise.all([...productPromises, ...contactPromises, ...bankDetailsPromises]);

    res.status(200).json({ success: true, data: updatedSupplier });
  } catch (err) {
    console.error("Error updating supplier:", err.message);
    res.status(500).json({ error: "An error occurred while updating the supplier." });
  }
};


exports.deleteSupplierById = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.location.deleteMany({
      where: { product: { supplierId: parseInt(id) } },
    });
    await prisma.product.deleteMany({ where: { supplierId: parseInt(id) } });
    await prisma.contact.deleteMany({ where: { supplierId: parseInt(id) } });
    const deletedSupplier = await prisma.supplier.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Supplier deleted successfully", supplier: deletedSupplier });
  } catch (err) {
    console.error("Error deleting supplier:", err);
    res.status(500).json({ error: "An error occurred while deleting the supplier." });
  }
};
