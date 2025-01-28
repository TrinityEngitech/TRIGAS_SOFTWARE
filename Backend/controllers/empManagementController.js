const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create a new employee
// exports.createEmployee = async (req, res) => {
//   try {
//     const { empName, empEmail, empPhone, empRole, teamRole, teamId, activeStatus } = req.body;

//     // Fetch the team details by teamId
//     const team = await prisma.teamManagement.findUnique({
//       where: { id: teamId },
//     });

//     if (!team) {
//       return res.status(404).json({ error: "Team not found" });
//     }

//     // Check if the employee is a Team Leader
//     if (empRole === "Team Leader") {
//       // Update the teamLeaderName in the TeamManagement table
//       await prisma.teamManagement.update({
//         where: { id: teamId },
//         data: {
//           teamLeaderName: empName, // Assign the team leader name
//         },
//       });
//     }

//     // Prepare data for creating an employee
//     const employeeData = {
//       empName,
//       empEmail,
//       empPhone,
//       empRole,
//       teamRole,          // Include teamRole
//       teamName: team.teamName, // Use the teamName from the TeamManagement record
//       teamId,
//       activeStatus,
//     };

//     // If the employee is a "Team Member", set the teamLeaderName from TeamManagement
//     if (empRole === "Team Member" && team.teamLeaderName) {
//       employeeData.teamLeaderName = team.teamLeaderName; // Assign the current team leader name
//     }

//     // Create the employee in the EmployeeManagement table
//     const employee = await prisma.employeeManagement.create({
//       data: employeeData,
//     });

//     res.status(201).json(employee);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to create employee", details: error.message });
//   }
// };

exports.createEmployee = async (req, res) => {
  try {
    const { empName, empEmail, empPhone, empRole,empAadharNumber,empAdditionalNumber,
      empAdditionalName,joiningDate,
      relievingDate, teamRole, teamId, activeStatus } = req.body;
      console.log(req.body);

    // Fetch the team details by teamId
    const team = await prisma.teamManagement.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    // Prepare data for creating an employee
    const employeeData = {
      empName,
      empEmail,
      empPhone,
      empRole,
      empAadharNumber,
      empAdditionalNumber,
      empAdditionalName,
      joiningDate: new Date(joiningDate), // Ensure date is properly formatted
        relievingDate: relievingDate ? new Date(relievingDate) : null,
      teamRole,          // Include teamRole
      teamName: team.teamName, // Use the teamName from the TeamManagement record
      teamId,
      activeStatus,
    };

    // If the employee is a "Team Leader", set teamLeaderName in both TeamManagement and EmployeeManagement
    if (empRole === "Team Leader") {
      // Update the teamLeaderName in the TeamManagement table
      await prisma.teamManagement.update({
        where: { id: teamId },
        data: {
          teamLeaderName: empName, // Assign the team leader name
        },
      });

      // Set teamLeaderName in the employee data as well
      employeeData.teamLeaderName = empName; // Assign the team leader name to the employee record
    }

    // If the employee is a "Team Member", set the teamLeaderName from TeamManagement
    if (empRole === "Team Member" && team.teamLeaderName) {
      employeeData.teamLeaderName = team.teamLeaderName; // Assign the current team leader name
    }

    // Create the employee in the EmployeeManagement table
    const employee = await prisma.employeeManagement.create({
      data: employeeData,
    });

    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({ error: "Failed to create employee", details: error.message });
  }
};



// Get all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await prisma.employeeManagement.findMany();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch employees", details: error.message });
  }
};

// Get employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await prisma.employeeManagement.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (employee) {
      res.status(200).json(employee);
    } else {
      res.status(404).json({ error: "Employee not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch employee", details: error.message });
  }
};

// Update employee details


// exports.updateEmployee = async (req, res) => {
//   try {
//     const {
//       empName,
//       empEmail,
//       empPhone,
//       empRole,
//       teamName,
//       teamLeaderName,
//       teamId,
//       teamRole,
//       activeStatus,
//     } = req.body;

//     const employeeId = parseInt(req.params.id);

//     // Fetch existing employee details
//     const existingEmployee = await prisma.employeeManagement.findUnique({
//       where: { id: employeeId },
//     });

//     if (!existingEmployee) {
//       return res.status(404).json({ error: "Employee not found" });
//     }

//     // Update the selected employee's role to 'Team Leader'
//     const updatedEmployee = await prisma.employeeManagement.update({
//       where: { id: employeeId },
//       data: {
//         empName,
//         empEmail,
//         empPhone,
//         empRole: "Team Leader", // Force the role to Team Leader
//         teamName,
//         teamLeaderName: empName, // Set the new leader's name
//         teamId,
//         teamRole,
//         activeStatus,
//       },
//     });

//     // Update all other employees in the same team:
//     // - Set 'empRole' to 'Team Member'
//     // - Set 'teamLeaderName' to the new leader's name
//     await prisma.employeeManagement.updateMany({
//       where: {
//         teamId: teamId,
//       },
//       data: {
//         empRole: { set: "Team Member" }, // Update everyone to Team Member
//         teamLeaderName: empName, // Update teamLeaderName to the new leader's name
//       },
//     });

//     // Ensure the newly updated leader keeps their 'Team Leader' role
//     await prisma.employeeManagement.update({
//       where: { id: employeeId },
//       data: {
//         empRole: "Team Leader",
//       },
//     });

//     res.status(200).json({
//       message:
//         "Employee updated successfully, roles and team leader name updated for team members.",
//       updatedEmployee,
//     });
//   } catch (error) {
//     console.error("Error updating employee:", error);
//     res.status(500).json({ error: "Failed to update employee", details: error.message });
//   }
// };
exports.updateEmployee = async (req, res) => {
  try {
    const {
      empName,
      empEmail,
      empPhone,
      empRole,
      empAadharNumber,
      empAdditionalNumber,
      empAdditionalName,
      joiningDate,
      relievingDate,
      teamName,
      teamLeaderName,
      teamId,
      teamRole,
      activeStatus,
    } = req.body;

    const employeeId = parseInt(req.params.id);

    // Fetch existing employee details
    const existingEmployee = await prisma.employeeManagement.findUnique({
      where: { id: employeeId },
    });

    if (!existingEmployee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Update the selected employee's role to 'Team Leader'
    const updatedEmployee = await prisma.employeeManagement.update({
      where: { id: employeeId },
      data: {
        empName,
        empEmail,
        empPhone,
        empRole: "Team Leader", // Force the role to Team Leader
        teamName,
        empAadharNumber,
        empAdditionalNumber,
        empAdditionalName,
        joiningDate: new Date(joiningDate), // Ensure date is properly formatted
        relievingDate: relievingDate ? new Date(relievingDate) : null,
        teamLeaderName: empName, // Set the new leader's name
        teamId,
        teamRole,
        activeStatus,
      },
    });

    // Update all other employees in the same team:
    // - Set 'empRole' to 'Team Member'
    // - Set 'teamLeaderName' to the new leader's name
    await prisma.employeeManagement.updateMany({
      where: {
        teamId: teamId,
      },
      data: {
        empRole: "Team Member", // Update everyone to Team Member
        teamLeaderName: empName, // Update teamLeaderName to the new leader's name
      },
    });

    // Ensure the newly updated leader keeps their 'Team Leader' role
    await prisma.employeeManagement.update({
      where: { id: employeeId },
      data: {
        empRole: "Team Leader",
      },
    });

    // Now update the `TeamManagement` table with the new team leader
    const updatedTeam = await prisma.teamManagement.update({
      where: {
        id: teamId, // Assuming `teamId` exists in the TeamManagement table
      },
      data: {
        teamLeaderName: empName, // Set the new leader's name in the team management table
      },
    });

    res.status(200).json({
      message:
        "Employee and Team updated successfully, roles and team leader name updated for team members.",
      updatedEmployee,
      updatedTeam,
    });
  } catch (error) {
    console.error("Error updating employee and team:", error);
    res.status(500).json({ error: "Failed to update employee and team", details: error.message });
  }
};





// Toggle active status of an employee
exports.toggleEmployeeStatus = async (req, res) => {
  try {
    const employeeId = parseInt(req.params.id);

    const employee = await prisma.employeeManagement.findUnique({
      where: { id: employeeId },
    });
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Toggle active status
    const updatedEmployee = await prisma.employeeManagement.update({
      where: { id: employeeId },
      data: {
        activeStatus: !employee.activeStatus,
      },
    });

    res.status(200).json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ error: "Failed to toggle employee status", details: error.message });
  }
};

// Delete an employee
exports.deleteEmployee = async (req, res) => {
  try {
    await prisma.employeeManagement.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete employee", details: error.message });
  }
};
