const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create a new employee
exports.create = async ({ empName, empEmail, empPhone, empRole, teamName, teamLeaderName, teamId, teamRole, activeStatus }) => {
  return prisma.employeeManagement.create({
    data: {
      empName,
      empEmail,
      empPhone,
      empRole,
      teamName,
      teamLeaderName,
      teamId,
      teamRole, // New field added
      activeStatus,
    },
  });
};

// Get all employees
exports.findAll = async () => {
  return prisma.employeeManagement.findMany();
};

// Get employee by ID
exports.findById = async (id) => {
  return prisma.employeeManagement.findUnique({
    where: { id: parseInt(id) },
  });
};

// Update an employee
exports.update = async (id, { empName, empEmail, empPhone, empRole, teamName, teamLeaderName, teamId, teamRole }) => {
  return prisma.employeeManagement.update({
    where: { id: parseInt(id) },
    data: {
      empName,
      empEmail,
      empPhone,
      empRole,
      teamName,
      teamLeaderName,
      teamId,
      teamRole, // New field added
    },
  });
};

// Delete an employee
exports.delete = async (id) => {
  return prisma.employeeManagement.delete({
    where: { id: parseInt(id) },
  });
};
