import React, { useEffect, useState } from "react";
import {
  Grid,
  Box,
  Typography,
  Button,
} from "@mui/material";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import axios from "axios";
import AnimatedLogoLoader from "../../component/AnimatedLogoLoader";
import axiosInstance from "../../Authentication/axiosConfig";

function ViewRole() {
  const { id } = useParams(); // Get the role ID from the URL
  const [roleData, setRoleData] = useState(null); // State to hold role data
  const navigate = useNavigate();

  // Fetch role data by ID when the component mounts
  useEffect(() => {
    const fetchRoleData = async () => {
      try {
        const response = await axiosInstance.get(`/roles/${id}`);
        setRoleData(response.data);  // Set role data in state
      } catch (error) {
        console.error("Error fetching role data:", error);
        alert("Error fetching role data");
      }
    };

    fetchRoleData();
  }, [id]);

  // If roleData is null (still loading), show a loading message
  if (!roleData) {
    return <AnimatedLogoLoader />;
  }

  return (
    <Box p={3}>
      <Box sx={{ display: "flex" }}>
        <Button
          variant="text"
          color="primary"
          onClick={() => navigate(-1)} // Go back to the previous page
          sx={{ mb: 2 }}
        >
          <ArrowBack />
        </Button>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
          View Role Listing
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
          / View Role Listing
        </Typography>
      </Box>

      <Box
        sx={{
          background: "#fff",
          borderRadius: "20px",
          padding: "30px",
          marginTop: "30px",
        }}
      >
        <Grid container spacing={2}>
          {/* Left Column */}
          <Grid item xs={12} sm={4}>
            <Typography sx={{ marginBottom: 2 }}>
              <strong>Role Name:</strong> {roleData.role}
            </Typography>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} sm={4}>
            <Typography sx={{ marginBottom: 2 }}>
              <strong>Description:</strong> {roleData.description}
            </Typography>
          </Grid>

          {/* Active Status */}
          <Grid item xs={12} sm={4}>
            <Typography sx={{ marginBottom: 2 }}>
              <strong>Status:</strong> {roleData.activeStatus ? "Active" : "Inactive"}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default ViewRole;
