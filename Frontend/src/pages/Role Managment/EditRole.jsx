import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  Box,
  Typography,
} from "@mui/material";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { ArrowBack } from "@mui/icons-material";
import AnimatedLogoLoader from "../../component/AnimatedLogoLoader";

function EditRole() {
  const { id } = useParams(); 
  const [loading, setLoading] = useState(true); // State for loader
  const [formData, setFormData] = useState({
    role: "",
    description: "",
    activeStatus: true,
  });

  const navigate = useNavigate();

  // Fetch role data by ID when the component mounts
  useEffect(() => {
    const fetchRoleData = async () => {
      try {
        setLoading(true); // Show loader
        const response = await axios.get(`http://localhost:3000/api/roles/${id}`);
        setFormData(response.data); // Populate the form with the fetched data
      } catch (error) {
        console.error("Error fetching role data:", error);
        alert("Error fetching role data");
      } finally {
        setLoading(false); // Hide loader
      }
    };

    fetchRoleData();
  }, [id]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission (update role)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loader during submission
    try {
      const response = await axios.put(
        `http://localhost:3000/api/roles/${id}`,
        formData
      );
      console.log("Role updated successfully:", response.data);
      navigate("/roleManagement"); // Redirect to roles page
    } catch (error) {
      console.error("Error updating role:", error);
      alert("Error updating role");
    } finally {
      setLoading(false); // Hide loader
    }
  };

  // Display loader while data is being fetched or submitted
  if (loading) {
    return <AnimatedLogoLoader />;
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
          Edit Role Listing
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
          / Edit Role Listing
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

          {/* Action Buttons */}
          <Box>
            <Box mt={3} display="flex" justifyContent="center" gap={2}>
              <Button variant="contained" color="primary" type="submit">
                Update
              </Button>
              <Button variant="outlined" color="error" onClick={() => navigate("/roles")}>
                Cancel
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
    </Box>
  );
}

export default EditRole;
