import { useState } from "react";
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
import { useNavigate, Link } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";

import axios from "axios";

function AddOrder() {
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
      const response = await axios.post(
        "http://localhost:3000/api/order/",
        dataToSend
      );
      console.log("Response:", response.data);
      alert("Order added successfully!");
      navigate("/order");
    } catch (error) {
      console.error("Error adding Order:", error);
      alert("Failed to add Order. Please try again.");
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
          Booking Info
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
          / Create New Order
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
              <FormControl fullWidth>
                <InputLabel>Customer</InputLabel>
                <Select
                  label="Supplier Name"
                  name=""
                  value={formData.supplierName}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="Customer 1">Customer 1</MenuItem>
                  <MenuItem value="Customer 1">Customer 1</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Supplier</InputLabel>
                <Select
                  label="Supplier"
                  name=""
                  value={formData.supplierName}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="Supplier 1">Supplier 1</MenuItem>
                  <MenuItem value="Supplier 2">Supplier 2</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Supply Location</InputLabel>
                <Select
                  label="Supply Location"
                  name=""
                  value={formData.supplierName}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="Supply Location 1">
                    Supply Location 1
                  </MenuItem>
                  <MenuItem value="Supply Location 1">
                    Supply Location 1
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Product</InputLabel>
                <Select
                  label="Product"
                  name=""
                  value={formData.supplierName}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="Product 1">Product 1</MenuItem>
                  <MenuItem value="Product 1">Product 1</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Quantity(MT)"
                name=""
                value={formData.address}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Team</InputLabel>
                <Select
                  label="Team"
                  name=""
                  value={formData.supplierName}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="Team 1">Team 1</MenuItem>
                  <MenuItem value="Team 1">Team 1</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Created by</InputLabel>
                <Select
                  label="Created by"
                  name=""
                  value={formData.supplierName}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="Created by 1">Created by 1</MenuItem>
                  <MenuItem value="Created by 1">Created by 1</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Order Number"
                name=""
                value={formData.gstNumber}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="datetime-local"
                label="Order Date & Time"
                name=""
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
          {/* Action Buttons */}
          <Box>
            <Box mt={3} display="flex" justifyContent="center" gap={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Book Order
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

export default AddOrder;
