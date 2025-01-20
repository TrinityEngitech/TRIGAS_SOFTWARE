const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create a new TrigasProduct
exports.create = async ({ productName, activeStatus, productSequence,NCV,productGST }) => {
  return prisma.trigasProduct.create({
    data: {
      productName,
      activeStatus,
      productSequence, // Include productSequence
      NCV,
      productGST
    },
  });
};

// Get all TrigasProducts
exports.findAll = async () => {
  return prisma.trigasProduct.findMany();
};

// Get TrigasProduct by ID
exports.findById = async (id) => {
  return prisma.trigasProduct.findUnique({
    where: { id: parseInt(id) },
  });
};

// Update a TrigasProduct
exports.update = async (id, { productName, activeStatus, productSequence,NCV,productGST }) => {
  return prisma.trigasProduct.update({
    where: { id: parseInt(id) },
    data: {
      productName,
      activeStatus,
      productSequence, // Include productSequence
      NCV,
      productGST
    },
  });
};

// Delete a TrigasProduct
exports.delete = async (id) => {
  return prisma.trigasProduct.delete({
    where: { id: parseInt(id) },
  });
};
