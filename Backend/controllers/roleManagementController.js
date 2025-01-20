const roleManagementModel = require("../models/roleManagementModel");

// Create a new role
exports.createRole = async (req, res) => {
  try {
    const { role, description, activeStatus } = req.body;
    const newRole = await roleManagementModel.create({ role, description, activeStatus });
    res.status(201).json(newRole);
  } catch (error) {
    res.status(500).json({ error: "Failed to create role", details: error.message });
  }
};

// Get all roles
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await roleManagementModel.findAll();
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch roles", details: error.message });
  }
};

// Get role by ID
exports.getRoleById = async (req, res) => {
  try {
    const role = await roleManagementModel.findById(req.params.id);
    if (role) {
      res.status(200).json(role);
    } else {
      res.status(404).json({ error: "Role not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch role", details: error.message });
  }
};

// Update a role
exports.updateRole = async (req, res) => {
  try {
    const { role, description, activeStatus } = req.body;
    const updatedRole = await roleManagementModel.update(req.params.id, { role, description, activeStatus });
    res.status(200).json(updatedRole);
  } catch (error) {
    res.status(500).json({ error: "Failed to update role", details: error.message });
  }
};

// Toggle active status of a role
exports.toggleRoleStatus = async (req, res) => {
  try {
    console.log('Received request to toggle status for ID:', req.params.id);
    const roleId = req.params.id;

    const role = await roleManagementModel.findById(roleId);
    if (!role) {
      return res.status(404).json({ error: "Role not found" });
    }

    const updatedRole = await roleManagementModel.update(roleId, {
      activeStatus: !role.activeStatus
    });

    console.log('Role updated:', updatedRole);
    res.status(200).json(updatedRole);
  } catch (error) {
    console.error('Error in toggleRoleStatus:', error);
    res.status(500).json({ error: "Failed to toggle role status", details: error.message });
  }
};

// Delete a role
exports.deleteRole = async (req, res) => {
  try {
    await roleManagementModel.delete(req.params.id);
    res.status(200).json({ message: "Role deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete role", details: error.message });
  }
};
