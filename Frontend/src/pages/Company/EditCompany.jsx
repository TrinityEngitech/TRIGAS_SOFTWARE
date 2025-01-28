import React, { useState, useEffect } from "react";
import {
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Grid,
  Box,
  Typography,
} from "@mui/material";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import axios from "axios";
import axiosInstance from "../../Authentication/axiosConfig";
import AnimatedLogoLoader from "../../component/AnimatedLogoLoader";

function EditCompany() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the company ID from the route
  const [formData, setFormData] = useState({
    companyName: "",
    supplierName: "",
    address: "",
    GSTNumber: "",
    ownerName: "",
    country: "India",
    state: "",
    district: "",
    city: "",
    pinCode: "",
  });

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true); // Loader for initial data fetch

  // Fetch company data by ID when the component loads
  useEffect(() => {
    axiosInstance
      .get(`/companies/${id}`)
      .then((response) => {
        if (response.data) {
          setFormData(response.data); // Populate the form with fetched data
        } else {
          console.error("No data received");
        }
      })
      .catch((error) => {
        console.error("Error fetching company:", error);
      })
      .finally(() => {
        setInitialLoading(false); // Stop initial loading
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true while updating
    axiosInstance
      .put(`/companies/${id}`, formData)
      .then((response) => {
        console.log("Update Response:", response.data);
        alert("Company updated successfully!");
        navigate("/company"); // Redirect to the listing page
      })
      .catch((error) => {
        console.error("Error updating company:", error);
        alert("Failed to update the company!");
      })
      .finally(() => {
        setLoading(false); // Set loading back to false
      });
  };

  if (initialLoading) {
    return <AnimatedLogoLoader />; // Show loader while fetching initial data
  }

  return (
    <Box p={3}>
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
          Edit Company Listing
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
          / Edit Company Listing
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
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company Name"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Supplier Name</InputLabel>
                <Select
                  label="Supplier Name"
                  name="supplierName"
                  value={formData.supplierName}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value={formData.supplierName}>
                    {formData.supplierName}
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="GST Number"
                name="GSTNumber"
                value={formData.GSTNumber}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Owner Name"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Pin Code"
                name="pinCode"
                value={formData.pinCode}
                onChange={handleChange}
                required
              />
            </Grid>
          </Grid>
          <Box mt={3} display="flex" justifyContent="center" gap={2}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update"}
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <AnimatedLogoLoader />
        </Box>
      )}
    </Box>
  );
}

export default EditCompany;
