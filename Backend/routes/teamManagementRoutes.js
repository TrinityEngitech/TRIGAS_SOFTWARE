const express = require("express");
const teamController = require("../controllers/teamManagementController");
const router = express.Router();

router.post("/", teamController.createTeam);
router.get("/", teamController.getAllTeams);
router.get("/:id", teamController.getTeamById);
router.put("/:id", teamController.updateTeam);
router.patch("/:id/toggle", teamController.toggleTeamStatus);
router.delete("/:id", teamController.deleteTeam);

module.exports = router;

// Get / Post
// http://localhost:3000/api/teams
// Dummy Data
// {
//     "teamName": "Development",
//     "activeStatus": true
//   }

// Get By Id
// http://localhost:3000/api/teams/:id
  
// Put 
// http://localhost:3000/api/teams/:id

// Toggle Team Status
// PATCH /teams/:id/toggle
// http://localhost:3000/api/teams/:id/toggle

//  Delete a Team
// DELETE /teams/:id
// http://localhost:3000/api/teams/:id
