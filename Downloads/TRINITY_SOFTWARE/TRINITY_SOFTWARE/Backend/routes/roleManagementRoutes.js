const express = require("express");
const roleController = require("../controllers/roleManagementController");
const router = express.Router();

router.post("/", roleController.createRole);
router.get("/", roleController.getAllRoles);
router.get("/:id", roleController.getRoleById);
router.put("/:id", roleController.updateRole);
router.patch("/:id/toggle", roleController.toggleRoleStatus);
router.delete("/:id", roleController.deleteRole);

module.exports = router;


// Get / Post
// http://localhost:3000/api/roles
// Dummy Data
// {
//     "role": "Admin",
//     "description": "Administrator with full access",
//     "activeStatus": true
//   }

// Get By Id
// http://localhost:3000/api/roles/:id
  
// Put 
// http://localhost:3000/api/roles/:id

// Toggle Role Status
// PATCH /roles/:id/toggle
// http://localhost:3000/api/roles/:id/toggle

//  Delete a Role
// DELETE /roles/:id
// http://localhost:3000/api/roles/:id