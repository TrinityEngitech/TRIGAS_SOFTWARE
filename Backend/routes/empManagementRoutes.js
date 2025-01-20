const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/empManagementController");  // Import the employee controller

// CRUD routes
router.post("/", employeeController.createEmployee);  // Create a new employee
router.get("/", employeeController.getAllEmployees);  // Get all employees

router.get("/:id", employeeController.getEmployeeById);  // Get employee by ID
router.put("/:id", employeeController.updateEmployee);  // Update employee by ID
router.delete("/:id", employeeController.deleteEmployee);  // Delete employee by ID

router.put("/toggle/:id", employeeController.toggleEmployeeStatus);  // Toggle employee active status

module.exports = router;


// Example Routes:
// Create Employee:
// POST /api/employees/
// URL: http://localhost:3000/api/employees/

// Get All Employees:
// GET /api/employees/
// URL: http://localhost:3000/api/employees/

// Get Employee by ID:
// GET /api/employees/:id
// Example URL: http://localhost:3000/api/employees/1

// Update Employee:
// PUT /api/employees/:id
// Example URL: http://localhost:3000/api/employees/1

// Delete Employee:
// DELETE /api/employees/:id
// Example URL: http://localhost:3000/api/employees/1

// Toggle Employee Status:
// PUT /api/employees/toggle/:id
// Example URL: http://localhost:3000/api/employees/toggle/1

// Dummy data

// {
//     "empName": "Jake Thompson",
//     "empEmail": "jake.thompson@example.com",
//     "empPhone": "9876543210",
// "teamRole": "Software Engineer",
//     "empRole": "Team Leader",
//     "teamId": 1,
//     "activeStatus": true
//   }
  
// {
//     "empName": "Sophia Martinez",
//     "empEmail": "sophia.martinez@example.com",
//     "empPhone": "5556667777",
//     "empRole": "Team Member",
//     "teamId": 1,
//     "activeStatus": true
//   }