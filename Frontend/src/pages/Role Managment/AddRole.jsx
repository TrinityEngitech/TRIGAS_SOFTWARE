import React, { useState } from "react";
import {
  TextField,
  Grid,
  Button,
  Box,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useNavigate,Link } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";

function AddRole() {
  // Default activeStatus is true, no user interaction needed
  const [formData, setFormData] = useState({
    role: "",
    description: "",
    activeStatus: true, // Default is true
  });

  const navigate = useNavigate();

  // Handle input field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/roles", formData);
      console.log("Response from server:", response.data);
      // Redirect or show success
      navigate("/roleManagement");  // Adjust the redirect path as needed
    } catch (error) {
      console.error("Error response:", error.response.data);
      alert(`Error: ${error.response.data.error || "Something went wrong!"}`);
    }
  };

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
          Add Role Listing
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
          / Add Role Listing
        </Typography>
      </Box>

      <Box sx={{ background: "#fff", borderRadius: "20px", padding: "30px", marginTop: "30px" }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Role Name"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Grid>
          </Grid>

          <Box mt={3} display="flex" justifyContent="center" gap={2}>
            <Button variant="contained" color="primary" type="submit">
              Save
            </Button>
            <Button variant="outlined" color="error" onClick={() => navigate("/roles")}>
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
}

export default AddRole;
