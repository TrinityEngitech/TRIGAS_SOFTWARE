const teamManagementModel = require("../models/teamManagementModel");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


// Create a new team
exports.createTeam = async (req, res) => {
  try {
    const { teamName, activeStatus } = req.body;
    const newTeam = await teamManagementModel.create({ teamName, activeStatus });
    res.status(201).json(newTeam);
  } catch (error) {
    res.status(500).json({ error: "Failed to create team", details: error.message });
  }
};

// Get all teams
exports.getAllTeams = async (req, res) => {
  try {
    const teams = await teamManagementModel.findAll();
    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch teams", details: error.message });
  }
};

// Get team by ID
exports.getTeamById = async (req, res) => {
  try {
    // Fetch the team by ID and include the related employees
    const team = await prisma.teamManagement.findUnique({
      where: { id: parseInt(req.params.id) }, // Use the correct ID type (parse to integer if needed)
      include: {
        employees: true, // This will include the employees related to the team
      },
    });

    if (team) {
      res.status(200).json(team);
    } else {
      res.status(404).json({ error: "Team not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch team", details: error.message });
  }
};

// Update a team
exports.updateTeam = async (req, res) => {
  try {
    const { teamName, activeStatus } = req.body;
    const updatedTeam = await teamManagementModel.update(req.params.id, { teamName, activeStatus });
    res.status(200).json(updatedTeam);
  } catch (error) {
    res.status(500).json({ error: "Failed to update team", details: error.message });
  }
};

// Toggle active status of a team
exports.toggleTeamStatus = async (req, res) => {
  try {
    console.log('Received request to toggle status for ID:', req.params.id);
    const teamId = req.params.id;

    const team = await teamManagementModel.findById(teamId);
    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    const updatedTeam = await teamManagementModel.update(teamId, {
      activeStatus: !team.activeStatus
    });

    console.log('Team updated:', updatedTeam);
    res.status(200).json(updatedTeam);
  } catch (error) {
    console.error('Error in toggleTeamStatus:', error);
    res.status(500).json({ error: "Failed to toggle team status", details: error.message });
  }
};

// Delete a team
exports.deleteTeam = async (req, res) => {
  try {
    await teamManagementModel.delete(req.params.id);
    res.status(200).json({ message: "Team deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete team", details: error.message });
  }
};
