const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create a new supply location
exports.create = async ({ LocationName, activeStatus, latitude, longitude }) => {
  return prisma.supplyLocations.create({
    data: {
      LocationName,
      activeStatus,
      latitude,
      longitude,
    },
  });
};

// Get all supply locations
exports.findAll = async () => {
  return prisma.supplyLocations.findMany();
};

// Get all supply locations
exports.findAll = async () => {
  return prisma.supplyLocations.findMany();
};

// Get a supply location by ID
exports.findById = async (id) => {
  return prisma.supplyLocations.findUnique({
    where: { id: parseInt(id) },
  });
};

// Update a supply location
exports.update = async (id, { LocationName, activeStatus,latitude,longitude }) => {
  return prisma.supplyLocations.update({
    where: { id: parseInt(id) },
    data: {
      LocationName,
      activeStatus,
      latitude,
      longitude
    },
  });
};



// Delete a supply location
exports.delete = async (id) => {
  return prisma.supplyLocations.delete({
    where: { id: parseInt(id) },
  });
};
