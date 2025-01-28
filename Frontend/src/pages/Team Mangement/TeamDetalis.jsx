import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Grid
} from "@mui/material";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import axios from "axios";
import AnimatedLogoLoader from '../../component/AnimatedLogoLoader';
import axiosInstance from "../../Authentication/axiosConfig";

function TeamDetails() {
  const navigate = useNavigate();
  const { id } = useParams(); // To get the team ID from URL
  const [teamDetails, setTeamDetails] = useState(null);

  // Fetch the team data when the component mounts
  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        const response = await axiosInstance.get(`/teams/${id}`);
        setTeamDetails(response.data); // Set the response data to the state
      } catch (error) {
        console.error("Error fetching team details:", error);
      }
    };

    fetchTeamDetails();
  }, [id]); // Fetch when the `id` changes

  if (!teamDetails) {
    return <AnimatedLogoLoader />;
  }

  return (
    <Box p={3} sx={{ height: "100vh" }}>
      <Box sx={{ display: "flex" }}>
        <Button
          variant="text"
          color="primary"
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          <ArrowBack />
        </Button>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
          View Team
        </Typography>
      </Box>
      <Box>
        <Typography
          variant="subtitle1"
          sx={{ color: "grey.600", mb: 5, marginLeft: "60px" }}
        >
          <Link to="/" style={{ textDecoration: "none" }}>
            Dashboard
          </Link>{" "}
          / View Team
        </Typography>
      </Box>

      <Box
        sx={{
          background: "#fff",
          borderRadius: "20px",
          padding: "20px 20px 30px 20px",
        }}
      >
        <Grid container spacing={2} sx={{ marginBottom: 5 }}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">
              <strong>Team Name:</strong> {teamDetails.teamName}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography sx={{ marginBottom: 2 }} variant="h6">
              <strong>Team Leader Name:</strong> {teamDetails.teamLeaderName || "N/A"}
            </Typography>
          </Grid>
        </Grid>

        <Typography sx={{ marginBottom: 2, marginTop: "20px" }} variant="h6">
          Team Members
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            {/* Table Header */}
            <TableHead>
              <TableRow>
                <TableCell align="center"><strong>Name</strong></TableCell>
                <TableCell align="center"><strong>Email</strong></TableCell>
                <TableCell align="center"><strong>Phone Number</strong></TableCell>
                <TableCell align="center"><strong>Role</strong></TableCell>
                <TableCell align="center"><strong>status</strong></TableCell>
              </TableRow>
            </TableHead>
            {/* Table Body */}
            <TableBody>
              {teamDetails.employees && teamDetails.employees.length > 0 ? (
                teamDetails.employees.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell align="center">{member.empName}</TableCell>
                    <TableCell align="center">{member.empEmail}</TableCell>
                    <TableCell align="center">{member.empPhone}</TableCell>
                    <TableCell align="center">{member.teamRole}</TableCell>
                    <TableCell align="center">
          {member.activeStatus ? "Active" : "Inactive"}
        </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">No members found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

export default TeamDetails;
