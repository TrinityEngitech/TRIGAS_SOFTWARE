import React, { useState,useEffect } from "react";
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
import { useNavigate,Link } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import axiosInstance from "../../Authentication/axiosConfig";
import axios from "axios";

function AddCompany() {

  const [suppliers, setSuppliers] = useState([]);
  useEffect(() => {
    const fetchSuppliers = async () => {
      const response = await axiosInstance.get("/supplier"); // Update this with the actual API endpoint
      console.log(response.data || []);

      setSuppliers(response.data); // Set the data to state
    };

    fetchSuppliers(); // Call the function to fetch data
  }, []);
  console.log("suppliers",suppliers);

  const [formData, setFormData] = useState({
    companyName: "",
    supplierName: "",
    address: "",
    gstNumber: "",
    ownerName: "",
    country: "",
    state: "",
    district: "",
    city: "",
    pinCode: "",
  });

  console.log(formData);

  const [loading, setLoading] = useState(false); // For button state

  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const dataToSend = {
      companyName: formData.companyName,
      GSTNumber: formData.gstNumber,
      supplierName: formData.supplierName,
      ownerName: formData.ownerName,
      address: formData.address,
      country: formData.country,
      state: formData.state,
      district: formData.district,
      city: formData.city,
      pinCode: formData.pinCode,
      activeStatus: true, // Default value
    };

    try {
      const response = await axiosInstance.post(
        "/companies/",
        dataToSend
      );
      console.log("Response:", response.data);
      alert("Company added successfully!");
      navigate("/company");
    } catch (error) {
      console.error("Error adding company:", error);
      alert("Failed to add company. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();
  
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
         Add Company Listing
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
          / Add Company Listing
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
              {/* <FormControl fullWidth>
                <InputLabel>Supplier Name</InputLabel>
                <Select
                  label="Supplier Name"
                  name="supplierName"
                  value={formData.supplierName}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="Supplier 1">Supplier 1</MenuItem>
                  <MenuItem value="Supplier 2">Supplier 2</MenuItem>
                </Select>
              </FormControl> */}
              <FormControl fullWidth>
  <InputLabel>Supplier Name</InputLabel>
  <Select
    label="Supplier Name"
    name="supplierName"
                  value={formData.supplierName}
                  onChange={handleChange}
                  required
  >
    {suppliers.map((supplier) => (
      <MenuItem key={supplier.id} value={supplier.name}>
        {supplier.name}
      </MenuItem>
    ))}
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
                name="gstNumber"
                value={formData.gstNumber}
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
              <FormControl fullWidth>
                <InputLabel>Country</InputLabel>
                <Select
                  label="Country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="India">India</MenuItem>
                  {/* Add more countries as needed */}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>State</InputLabel>
                <Select
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="Gujarat">Gujarat</MenuItem>
                  {/* <MenuItem value="State 2">State 2</MenuItem> */}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>District</InputLabel>
                <Select
                  label="District"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="Rajkot">Rajkot</MenuItem>
                  <MenuItem value="Morbi">Morbi</MenuItem>
                  {/* <MenuItem value="District 2">District 2</MenuItem> */}
                </Select>
              </FormControl>
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
            {/* Action Buttons */}
            <Box >
            <Box mt={3} display="flex" justifyContent="center" gap={2}>
              <Button variant="contained" color="primary"  onClick={handleSubmit}>
                Save
              </Button>
              <Button variant="outlined" color="error">
                Cancel
              </Button>
            </Box>
            </Box>
         
        </form>
      </Box>
    </Box>
  );
}

export default AddCompany;
