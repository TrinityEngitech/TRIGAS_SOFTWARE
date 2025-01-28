import { useState, useEffect } from "react";
// import axios from "axios";
import {
 
  Button,
  Grid,
  Box,
  Typography,
} from "@mui/material";
import { useNavigate, useParams,Link } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import AnimatedLogoLoader from '../../component/AnimatedLogoLoader';
import axiosInstance from "../../Authentication/axiosConfig";

function ViewEmp() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the employee ID from the URL parameters
  const [employee, setEmployee] = useState(null); // State to hold employee data

  useEffect(() => {
    // Fetch employee data by ID when the component mounts
    const fetchEmployee = async () => {
      try {
        const response = await axiosInstance.get(`/employees/${id}`);
        console.log(response.data);
        
        setEmployee(response.data); // Set employee data to state

      } catch (err) {
        // setError("Failed to fetch employee data"); // Set error message
        console.log(err);
        
      } finally {
        // setLoading(false); // Set loading to false after the request is complete
      }
    };

    fetchEmployee();
  }, [id]);

  if (!employee) {
    return <AnimatedLogoLoader />;
  }

    // datetime
    const formatDate = (dateString) => {
      const date = new Date(dateString);
  
      const day = ("0" + date.getDate()).slice(-2); // Adds leading zero if day is single digit
      const month = ("0" + (date.getMonth() + 1)).slice(-2); // Adds leading zero if month is single digit
      const year = date.getFullYear();
      const hours = ("0" + date.getHours()).slice(-2); // Adds leading zero if hours are single digit
      const minutes = ("0" + date.getMinutes()).slice(-2); // Adds leading zero if minutes are single digit
  
      return `${day}/${month}/${year} | ${hours}:${minutes}`;
    };


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
              <strong> Aadhar Card:</strong> {employee.empAadharNumber}
            </Typography>
            <Typography sx={{ marginBottom: 2 }}>
              <strong> Phone Number:</strong> {employee.empPhone}
            </Typography>
            <Typography sx={{ marginBottom: 2 }}>
              <strong>Additional Number:</strong> {employee.empAdditionalNumber}
            </Typography>
            <Typography sx={{ marginBottom: 2 }}>
              <strong>Additional Number Person Name:</strong> {employee.empAdditionalName}
            </Typography>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} sm={6}>
          <Typography sx={{ marginBottom: 2 }}>
              <strong> Joing Date:</strong> {formatDate(employee.joiningDate)}
            </Typography>
            <Typography sx={{ marginBottom: 2 }}>
              <strong> Relieving Date:</strong> {formatDate(employee.relievingDate)}
            </Typography>
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
