import React, { useState, useEffect } from "react";
import axios from "axios";
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
import { useNavigate, useParams,Link } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import AnimatedLogoLoader from '../../component/AnimatedLogoLoader';

function ViewEmp() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the employee ID from the URL parameters
  const [employee, setEmployee] = useState(null); // State to hold employee data

  useEffect(() => {
    // Fetch employee data by ID when the component mounts
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/employees/${id}`);
        console.log(response.data);
        
        setEmployee(response.data); // Set employee data to state

      } catch (err) {
        setError("Failed to fetch employee data"); // Set error message
      } finally {
        setLoading(false); // Set loading to false after the request is complete
      }
    };

    fetchEmployee();
  }, [id]);

  if (!employee) {
    return <AnimatedLogoLoader />;
  }

  return (
    <Box p={3} sx={{ height: "100vh" }}>
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
          View Employee
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
          / View Employee
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
              <strong>Employee Name:</strong> {employee.empName}
            </Typography>
            <Typography sx={{ marginBottom: 2 }}>
              <strong> Email:</strong> {employee.empEmail}
            </Typography>
            <Typography sx={{ marginBottom: 2 }}>
              <strong> Phone Number:</strong> {employee.empPhone}
            </Typography>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} sm={6}>
            <Typography sx={{ marginBottom: 2 }}>
              <strong>Employee Role:</strong> {employee.empRole}
            </Typography>
            <Typography sx={{ marginBottom: 2 }}>
              <strong>Team Name:</strong> {employee.teamName}
            </Typography>
            <Typography sx={{ marginBottom: 2 }}>
              <strong>Team Leader Name:</strong> {employee.teamLeaderName}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default ViewEmp;
