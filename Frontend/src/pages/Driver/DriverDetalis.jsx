import React, { useState, useEffect } from "react";
import axios from "axios";
import {

  Button,
  Grid,
  Box,
  Typography,
} from "@mui/material";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import AnimatedLogoLoader from "../../component/AnimatedLogoLoader";
import axiosInstance from "../../Authentication/axiosConfig";

function DriverDetalis() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the driver ID from the URL parameters
  const [driver, setDriver] = useState(null); // State to hold driver dat

  useEffect(() => {
    // Fetch driver data by ID when the component mounts
    const fetchDriver = async () => {
      try {
        const response = await axiosInstance.get(`/drivers/${id}`);
        console.log(response.data);
        setDriver(response.data); // Set driver data to state
      } catch (err) {
        setError("Failed to fetch Driver data"); // Set error message
      }
    };

    fetchDriver();
  }, [id]);

    if (!driver) {
      return <AnimatedLogoLoader />
    }

  return (
    <Box p={3} >
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
          View Driver
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
          / View Driver
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
          <Grid item xs={12} sm={6}>
            <Typography sx={{ marginBottom: 2 }}>
              <strong>Driver Name:</strong> {driver.name}
            </Typography>
            <Typography sx={{ marginBottom: 2 }}>
              <strong>Age:</strong> {driver.age}
            </Typography>
            <Typography sx={{ marginBottom: 2 }}>
              <strong>Driver Number:</strong> {driver.driverNumber}
            </Typography>
            <Typography sx={{ marginBottom: 2 }}>
              <strong>Manager Number:</strong> {driver.managerNumber}
            </Typography>
            <Typography sx={{ marginBottom: 2 }}>
              <strong>Additional Number</strong> {driver.driverAdditionalNumber}
            </Typography>
            <Typography sx={{ marginBottom: 2 }}>
              <strong>Additional Number Person Name</strong> {driver.driverAdditionalName}
            </Typography>
            <Typography sx={{ marginBottom: 2 }}>
              <strong>Status:</strong> {driver.activeStatus ? "Active" : "Inactive"}
            </Typography>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} sm={6}>
          <Typography sx={{ marginBottom: 2 }}>
              <strong>Create Date:</strong> {new Date(driver.createDate).toLocaleString()}
            </Typography>
            <Typography sx={{ marginBottom: 2 }}>
              <strong>Updated Date:</strong> {new Date(driver.updatedDate).toLocaleString()}
            </Typography>
            <Typography sx={{ marginBottom: 2 }}>
              <strong>Driving License Number:</strong> {driver.drivingLicense}
            </Typography>
            <Typography sx={{ marginBottom: 2 }}>
              <strong>Aadhar Card Number:</strong> {driver.aadharCardNumber}
            </Typography>
            <Typography sx={{ marginBottom: 2 }}>
              <strong>PCC Number:</strong> {driver.pccNumber}
            </Typography>

            {/* File Links */}
            {driver.drivingLicenseFile && (
              <Typography sx={{ marginBottom: 2 }}>
                <strong>Driving License File:</strong>{" "}
                <a href={`http://localhost:3000/${driver.drivingLicenseFile}`} target="_blank" rel="noopener noreferrer">
                  View Driving License PDF
                </a>
              </Typography>
            )}
            {driver.aadharCardFile && (
              <Typography sx={{ marginBottom: 2 }}>
                <strong>Aadhar Card File:</strong>{" "}
                <a href={`http://localhost:3000/${driver.aadharCardFile}`} target="_blank" rel="noopener noreferrer">
                  View Aadhar Card PDF
                </a>
              </Typography>
            )}
            {driver.pccFile && (
              <Typography sx={{ marginBottom: 2 }}>
                <strong>PCC File:</strong>{" "}
                <a href={`http://localhost:3000/${driver.pccFile}`} target="_blank" rel="noopener noreferrer">
                  View PCC PDF
                </a>
              </Typography>
            )}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default DriverDetalis;
