const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create a new tanker
exports.create = async ({
  tankerNumber,
  licenseCapacity,
  driverName,
  product,
  grossWeight,
  tareWeight,
  chassisNumber,
  engineNumber,
  numberOfAxle,
  activeStatus, // Can be undefined or null
  documents // Array of documents to be associated with the tanker
}) => {
  // Set activeStatus to true by default if it's not provided
  const finalActiveStatus = activeStatus === undefined || activeStatus === null ? true : activeStatus;

  // Create the tanker and its documents in a transaction
  return await prisma.tankerDetails.create({
    data: {
      tankerNumber,
      licenseCapacity,
      driverName,
      product,
      grossWeight,
      tareWeight,
      chassisNumber,
      engineNumber,
      numberOfAxle,
      activeStatus: finalActiveStatus,
      documents: {
        create: documents.map((doc) => ({
          documentType: doc.documentType,
          validFrom: doc.validFrom,
          validUpto: doc.validUpto,
          documentFile: doc.documentFile || null, // Optional file
        })),
      },
    },
  });
};

// Get all tankers
exports.findAll = async () => {
  return prisma.tankerDetails.findMany({
    include: {
      documents: true, // Include related documents
    },
  });
};

// Get tanker by ID with its documents
exports.findById = async (id) => {
  return prisma.tankerDetails.findUnique({
    where: { id: parseInt(id) },
    include: {
      documents: true, // Include related documents
    },
  });
};

// Update a tanker
exports.update = async (
  id,
  {
    tankerNumber,
    licenseCapacity,
    driverName,
    product,
    grossWeight,
    tareWeight,
    chassisNumber,
    engineNumber,
    numberOfAxle,
    activeStatus,
    documents // Updated documents array
  }
) => {
  // Ensure the ID is a number
  const tankerId = parseInt(id);
  if (isNaN(tankerId)) {
    throw new Error("Invalid tanker ID");
  }

  // Set activeStatus to true by default if it's not provided
  const parsedActiveStatus = activeStatus === undefined || activeStatus === null ? true : activeStatus;

  // Update tanker with its documents in a transaction
  return prisma.tankerDetails.update({
    where: { id: tankerId },
    data: {
      tankerNumber,
      licenseCapacity,
      driverName,
      product,
      grossWeight,
      tareWeight,
      chassisNumber,
      engineNumber,
      numberOfAxle,
      activeStatus: parsedActiveStatus,
      documents: {
        create: documents.map((doc) => ({
          documentType: doc.documentType,
          validFrom: doc.validFrom,
          validUpto: doc.validUpto,
          documentFile: doc.documentFile || null,
        })),
      },
    },
  });
};

// Delete a tanker and its associated documents
exports.delete = async (id) => {
  return prisma.tankerDetails.delete({
    where: { id: parseInt(id) },
    include: {
      documents: true, // Delete associated documents as well
    },
  });
};
