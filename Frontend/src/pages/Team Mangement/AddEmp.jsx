import React, { useState, useEffect } from "react";
import {
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
  Button,
  Box,
  Typography,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import axios from "axios";
import axiosInstance from "../../Authentication/axiosConfig";

function AddEmp() {
  const [formData, setFormData] = useState({
    empName: "",
    empEmail: "",
    empPhone: "",
    empAadharNumber:"",
    empAdditionalNumber:"",
    empAdditionalName:"",
    joiningDate:"",
    relievingDate:"",
    teamRole:"",
    teamId: "",
    empRole: "",
    activeStatus:true
  });

  const [roles, setRoles] = useState([]);
  const [teams, setTeams] = useState([]);

  console.log(roles);
  console.log(teams);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamsResponse, rolesResponse] = await Promise.all([
          axiosInstance.get("/teams"),
          axiosInstance.get("/roles"),
        ]);
  
        // Handle teams data
        if (Array.isArray(teamsResponse.data)) {
          setTeams(teamsResponse.data);
        } else {
          console.error("Teams data is not an array");
        }
  
        // Handle roles data
        if (Array.isArray(rolesResponse.data)) {
          setRoles(rolesResponse.data);
        } else {
          console.error("Roles data is not an array");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, []);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("employee data",formData);
    try {
      const response = await axiosInstance.post("/employees", formData);
      
      console.log("Employee added successfully:", response.data);
      // Optional: Navigate back or show a success message
      navigate("/employeeManagement");
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };
  

  const navigate = useNavigate();

  return (
    <Box p={3} sx={{ height: "100vh" }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Button variant="text" color="primary" onClick={() => navigate(-1)}>
          <ArrowBack />
        </Button>
        <Typography variant="h5" sx={{ fontWeight: "bold", ml: 1 }}>
          Add Employee
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
        / Add Employee
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
                label="Employee Name"
                name="empName"
                value={formData.empName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="empEmail"
                value={formData.empEmail}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Aadhar Card"
                name="empAadharNumber"
                value={formData.empAadharNumber}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="empPhone"
                value={formData.empPhone}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Additional Number"
                name="empAdditionalNumber"
                value={formData.empAdditionalNumber}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Additional Number Person Name"
                name="empAdditionalName"
                value={formData.empAdditionalName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Joing Date"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Relieving Date"
                name="relievingDate"
                value={formData.relievingDate}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  label="Role"
                  name="teamRole"
                  value={formData.teamRole}
                  onChange={handleChange}
                  required
                >
                  {/* <MenuItem value={roles.role}>{roles.role}</MenuItem> */}
                  {roles.map((role, index) => (
                    <MenuItem key={index} value={role.role}>
                      {role.role}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Team</InputLabel>
                <Select
                  label="Team Name"
                  name="teamId"
                  value={formData.teamId || ""}
                  onChange={handleChange}
                  required
                >
                  {/* <MenuItem value="Team 1">Team 1</MenuItem> */}
                  {teams.map((team, index) => (
                    <MenuItem key={index} value={team.id}>
                      {team.teamName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Team Leader Or Member ?</InputLabel>
                <Select
                  label="Team Leader Or Member ?"
                  name="empRole"
                  value={formData.empRole || ""}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="Team Leader">Team Leader</MenuItem>
                  <MenuItem value="Team Member">Team Member</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Box mt={3} display="flex" justifyContent="center" gap={2}>
            <Button type="submit" variant="contained" color="primary">
              Save
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

export default AddEmp;
