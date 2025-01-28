import React, { useState, useEffect } from "react";
import {
  Button,
  Box,
  Typography,
  Grid,
} from "@mui/material";
import axios from "axios";
import { useNavigate, Link, useParams } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import axiosInstance from "../../Authentication/axiosConfig";
import AnimatedLogoLoader from "../../component/AnimatedLogoLoader";

function ViewCompany() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [company, setCompany] = useState(null); // Store a single company object
  const [loading, setLoading] = useState(true); // Track loading state

  // Fetch company from the API
  useEffect(() => {
    axiosInstance
      .get(`/companies/${id}`)
      .then((response) => {
        console.log("API Response:", response.data); // Log the response to inspect it
        if (response.data) {
          setCompany(response.data); // Set the company object if the response is valid
        } else {
          console.error("Received data is not a valid company object.");
        }
      })
      .catch((error) => {
        console.error("Error fetching company:", error);
      })
      .finally(() => {
        setLoading(false); // Stop loading when API call completes
      });
  }, [id]);

  return (
    <Box p={3} sx={{ height: "100vh" }}>
      {/* Back Button and Page Title */}
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
          View Company Listing
        </Typography>
      </Box>

      {/* Breadcrumb Navigation */}
      <Box>
        <Typography
          variant="subtitle1"
          sx={{ color: "grey.600", mb: 5, marginLeft: "60px" }}
        >
          <Link to="/" style={{ textDecoration: "none" }}>
            Dashboard
          </Link>{" "}
          / View Company Listing
        </Typography>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          background: "#fff",
          borderRadius: "20px",
          padding: "30px",
          marginTop: "30px",
        }}
      >
        {/* Show Loader While Loading */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "300px" }}>
            <AnimatedLogoLoader />
          </Box>
        ) : company ? (
          <Grid container spacing={2}>
            {/* Left Column */}
            <Grid item xs={12} sm={6}>
              <Typography sx={{ marginBottom: 2 }}>
                <strong>Company Name:</strong> {company.companyName}
              </Typography>
              <Typography sx={{ marginBottom: 2 }}>
                <strong>Supplier Name:</strong> {company.supplierName}
              </Typography>
              <Typography sx={{ marginBottom: 2 }}>
                <strong>Created Date:</strong> {company.createDate}
              </Typography>
              <Typography sx={{ marginBottom: 2 }}>
                <strong>Address:</strong> {company.address}
              </Typography>
              <Typography sx={{ marginBottom: 2 }}>
                <strong>State:</strong> {company.state}
              </Typography>
              <Typography>
                <strong>City:</strong> {company.city}
              </Typography>
            </Grid>

            {/* Right Column */}
            <Grid item xs={12} sm={6}>
              <Typography sx={{ marginBottom: 2 }}>
                <strong>GST Number:</strong> {company.GSTNumber}
              </Typography>
              <Typography sx={{ marginBottom: 2 }}>
                <strong>Owner Name:</strong> {company.ownerName}
              </Typography>
              <Typography sx={{ marginBottom: 2 }}>
                <strong>Updated Date:</strong> {company.updatedDate}
              </Typography>
              <Typography sx={{ marginBottom: 2 }}>
                <strong>Country:</strong> {company.country}
              </Typography>
              <Typography sx={{ marginBottom: 2 }}>
                <strong>District:</strong> {company.district}
              </Typography>
              <Typography sx={{ marginBottom: 2 }}>
                <strong>Pin Code:</strong> {company.pinCode}
              </Typography>
            </Grid>
          </Grid>
        ) : (
          <Typography>No company data available.</Typography>
        )}
      </Box>
    </Box>
  );
}

export default ViewCompany;
