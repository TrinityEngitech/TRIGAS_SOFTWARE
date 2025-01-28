import React, { useState } from "react";
import { TextField, Grid, Button, Box, Typography } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import axios from "axios";
import axiosInstance from "../../Authentication/axiosConfig";

function AddDriver() {
  const navigate = useNavigate();

  // Form data state
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    driverNumber: "",
    managerNumber: "",
    aadharCardNumber: "",
    pccNumber: "",
    driverAdditionalNumber:"",
    driverAdditionalName:"",
    drivingLicense: "",
  });

  // File state
  const [files, setFiles] = useState({
    drivingLicenseFile: null,
    aadharCardFile: null,
    pccFile: null,
  });

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      // Handle file inputs
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0], // Store the selected file
      }));
    } else {
      // Handle text inputs
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

   const [isEditing, setIsEditing] = useState(false); 
   
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const url = isEditing
      ? `http://localhost:3000/api/drivers/${id}`
      : "http://localhost:3000/api/drivers/";
  
    const method = isEditing ? "PUT" : "POST";
  console.log(formData);
  
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name || "");
      formDataToSend.append("driverNumber", formData.driverNumber || "");
      formDataToSend.append("aadharCardNumber", formData.aadharCardNumber || "");
      formDataToSend.append("pccNumber", formData.pccNumber || "");
      formDataToSend.append("driverAdditionalNumber", formData.driverAdditionalNumber || "");
      formDataToSend.append("driverAdditionalName", formData.driverAdditionalName || "");
      formDataToSend.append("drivingLicense", formData.drivingLicense || "");
      formDataToSend.append("activeStatus", true); // Always true
  
      // Handle age and managerNumber (send null if empty)
      formDataToSend.append("age", formData.age || "");
      formDataToSend.append("managerNumber", formData.managerNumber || "");
  
      // Handle files
      if (formData.drivingLicenseFile) {
        formDataToSend.append("drivingLicenseFile", formData.drivingLicenseFile);
      }
      if (formData.aadharCardFile) {
        formDataToSend.append("aadharCardFile", formData.aadharCardFile);
      }
      if (formData.pccFile) {
        formDataToSend.append("pccFile", formData.pccFile);
      }
  
      const response = await axiosInstance({
        method,
        url,
        data: formDataToSend,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      if (response.status === 200 || response.status === 201) {
        navigate("/driver");
      }
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to save driver. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Box p={3} sx={{ height: "100vh" }}>
      {/* Header Section */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Button variant="text" color="primary" onClick={() => navigate(-1)}>
          <ArrowBack />
        </Button>
        <Typography variant="h5" sx={{ fontWeight: "bold", ml: 1 }}>
          Add Driver
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
          / Add Driver
        </Typography>
      </Box>

      {/* Form Section */}
      <Box
        sx={{
          background: "#fff",
          borderRadius: "20px",
          padding: "30px",
          marginTop: "30px",
        }}
      >
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Driver Name"
                value={formData.name}
                onChange={handleChange}
                name="name"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Age"
                value={formData.age || ""}
                onChange={handleChange}
                name="age"
                placeholder="Enter age or leave blank"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Driver Number"
                value={formData.driverNumber}
                onChange={handleChange}
                name="driverNumber"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Manager Number"
                value={formData.managerNumber || ""}
                onChange={handleChange}
                name="managerNumber"
                placeholder="Enter manager number or leave blank"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Additional Number"
                name="driverAdditionalNumber"
                onChange={handleChange}
                value={formData.driverAdditionalNumber || ""}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Additional Number Person Name"
                name="driverAdditionalName"
                value={formData.driverAdditionalName || ""}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Driving License Number"
                value={formData.drivingLicense}
                onChange={handleChange}
                name="drivingLicense"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                type="file"
                label="Driving License"
                fullWidth
                InputLabelProps={{ shrink: true }}
                name="drivingLicenseFile"
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Aadhar Card Number"
                value={formData.aadharCardNumber}
                onChange={handleChange}
                name="aadharCardNumber"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                type="file"
                label="Aadhar Card"
                fullWidth
                InputLabelProps={{ shrink: true }}
                name="aadharCardFile"
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="PCC Number"
                value={formData.pccNumber}
                onChange={handleChange}
                name="pccNumber"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                type="file"
                label="PCC"
                fullWidth
                InputLabelProps={{ shrink: true }}
                name="pccFile"
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          {/* Error message */}
          {error && (
            <Box sx={{ mt: 2, color: "red", textAlign: "center" }}>
              <Typography variant="body2">{error}</Typography>
            </Box>
          )}

          {/* Buttons Section */}
          <Box mt={3} display="flex" justifyContent="center" gap={2}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </Button>
            <Button
              type="button"
              variant="outlined"
              color="error"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
}

export default AddDriver;
