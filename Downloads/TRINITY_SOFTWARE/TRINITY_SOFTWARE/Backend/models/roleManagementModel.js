const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create a new role
exports.create = async ({ role, description, activeStatus }) => {
  return prisma.roleManagement.create({
    data: {
      role,
      description,
      activeStatus,
    },
  });
};

// Get all roles
exports.findAll = async () => {
  return prisma.roleManagement.findMany();
};

// Get role by ID
exports.findById = async (id) => {
  return prisma.roleManagement.findUnique({
    where: { id: parseInt(id) },
  });
};

// Update a role
exports.update = async (id, { role, description, activeStatus }) => {
  return prisma.roleManagement.update({
    where: { id: parseInt(id) },
    data: {
      role,
      description,
      activeStatus,
    },
  });
};

// Delete a role
exports.delete = async (id) => {
  return prisma.roleManagement.delete({
    where: { id: parseInt(id) },
  });
};
