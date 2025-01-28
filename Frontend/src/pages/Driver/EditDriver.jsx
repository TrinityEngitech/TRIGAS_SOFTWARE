import React, { useState, useEffect } from "react";
import { TextField, Grid, Button, Box, Typography } from "@mui/material";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import axios from "axios";
import AnimatedLogoLoader from "../../component/AnimatedLogoLoader";
import axiosInstance from "../../Authentication/axiosConfig";

function EditDriver() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get driver ID from URL (for edit)

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false); // Track if we're in edit mode

  // Fetch driver data for editing
  useEffect(() => {
    if (id) {
      setIsEditing(true);
      const fetchDriverData = async () => {
        try {
          const response = await axiosInstance.get(
            `/drivers/${id}`
          );
          setFormData({
            name: response.data.name,
            age: response.data.age,
            driverNumber: response.data.driverNumber,
            managerNumber: response.data.managerNumber,
            aadharCardNumber: response.data.aadharCardNumber,
            driverAdditionalNumber:response.data.driverAdditionalNumber,
            driverAdditionalName:response.data.driverAdditionalName,
            pccNumber: response.data.pccNumber,
            drivingLicense: response.data.drivingLicense,
          });
        } catch (err) {
          setError("Failed to fetch driver details.");
          console.log(err);
          
        } finally {
          setLoading(false); // Hide loader
        }
      };
      fetchDriverData();
    }
  }, [id]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0],
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // // Handle form submission for Add or Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const url = isEditing
      ? `http://localhost:3000/api/drivers/${id}`
      : "http://localhost:3000/api/drivers/";
  
    const method = isEditing ? "PUT" : "POST";
  
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name || "");
      formDataToSend.append("driverNumber", formData.driverNumber || "");
      formDataToSend.append("aadharCardNumber", formData.aadharCardNumber || "");
      formDataToSend.append("pccNumber", formData.pccNumber || "");
      formDataToSend.append("drivingLicense", formData.drivingLicense || "");
      formDataToSend.append("activeStatus", true); // Always true
  
      // Handle age and managerNumber (send null if empty)
      formDataToSend.append("age", formData.age || "");
      formDataToSend.append("driverAdditionalNumber", formData.driverAdditionalNumber || "");
      formDataToSend.append("driverAdditionalName", formData.driverAdditionalName || "");
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
  
      const response = await axios({
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
  
  if (loading) {
    return <AnimatedLogoLoader />;
  }

  return (
    <Box p={3} sx={{ height: "100vh" }}>
      {/* Header Section */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Button variant="text" color="primary" onClick={() => navigate(-1)}>
          <ArrowBack />
        </Button>
        <Typography variant="h5" sx={{ fontWeight: "bold", ml: 1 }}>
          {isEditing ? "Edit Driver" : "Add Driver"}
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
          / {isEditing ? "Edit Driver" : "Add Driver"}
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
                value={formData.driverAdditionalNumber || ""}
                name="driverAdditionalNumber"
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Additional Number Person Name"
                value={formData.driverAdditionalName || ""}
                name="driverAdditionalName"
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

export default EditDriver;
