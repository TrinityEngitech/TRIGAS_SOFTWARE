const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create a new team
exports.create = async ({ teamName, activeStatus }) => {
  return prisma.teamManagement.create({
    
    data: {
      teamName,
      activeStatus,
    },
  });
};

// Get all teams
exports.findAll = async () => {
  return prisma.teamManagement.findMany();
};

// Get team by ID
exports.findById = async (id) => {
  return prisma.teamManagement.findUnique({
    where: { id: parseInt(id) },
  });
};

// Update a team
exports.update = async (id, { teamName, activeStatus }) => {
  return prisma.teamManagement.update({
    where: { id: parseInt(id) },
    data: {
      teamName,
      activeStatus,
    },
  });
};

// Delete a team
exports.delete = async (id) => {
  return prisma.teamManagement.delete({
    where: { id: parseInt(id) },
  });
};
