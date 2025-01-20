const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create a new company
exports.create = async ({
  companyName,
  GSTNumber,
  supplierName,
  ownerName,
  address,
  country,
  state,
  district,
  city,
  pinCode,
  activeStatus,
}) => {
  return prisma.company.create({
    data: {
      companyName,
      GSTNumber,
      supplierName,
      ownerName,
      address,
      country,
      state,
      district,
      city,
      pinCode,
      activeStatus,
    },
  });
};

// Get all companies
exports.findAll = async () => {
  return prisma.company.findMany();
};

// Get company by ID
exports.findById = async (id) => {
  return prisma.company.findUnique({
    where: { id: parseInt(id) },
  });
};

// Update a company
exports.update = async (id, {
  companyName,
  GSTNumber,
  supplierName,
  ownerName,
  address,
  country,
  state,
  district,
  city,
  pinCode,
  activeStatus,
}) => {
  return prisma.company.update({
    where: { id: parseInt(id) },
    data: {
      companyName,
      GSTNumber,
      supplierName,
      ownerName,
      address,
      country,
      state,
      district,
      city,
      pinCode,
      activeStatus,
    },
  });
};

// Delete a company
exports.delete = async (id) => {
  return prisma.company.delete({
    where: { id: parseInt(id) },
  });
};
