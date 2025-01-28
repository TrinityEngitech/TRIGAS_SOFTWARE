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
} from "@mui/material";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import axios from "axios";
import AnimatedLogoLoader from "../../component/AnimatedLogoLoader";
import axiosInstance from "../../Authentication/axiosConfig";

function EditEmp() {
   const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    empName: "",
    empEmail: "",
    empPhone: "",
    empAadharNumber:"",
    empAdditionalNumber:"",
    empAdditionalName:"",
    joiningDate:"",
    relievingDate:"",
    teamRole: "",
    teamId: "",
    empRole: "",
    activeStatus: true,
  });

  const [roles, setRoles] = useState([]);
  const [teams, setTeams] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams(); // Get the ID from the route params

  // Determine if this is Edit Mode
  const isEdit = Boolean(id);

  // Fetch Roles and Teams
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamsResponse, rolesResponse] = await Promise.all([
          axiosInstance.get("/teams"),
          axiosInstance.get("/roles"),
        ]);

        if (Array.isArray(teamsResponse.data)) setTeams(teamsResponse.data);
        if (Array.isArray(rolesResponse.data)) setRoles(rolesResponse.data);
      } catch (error) {
        console.error("Error fetching roles and teams:", error);
      }

    };

    fetchData();
  }, []);

  // Fetch Employee Data for Edit
  useEffect(() => {
    if (isEdit) {
      const fetchEmployeeData = async () => {
        try {
          const response = await axiosInstance.get(`/employees/${id}`);
          setFormData(response.data);
        } catch (error) {
          console.error("Error fetching employee data:", error);
        }
        finally {
          setLoading(false); // Set loading to false once data is fetched
        }
      };

      fetchEmployeeData();
    }
    else {
      setLoading(false); // No need to fetch employee data when adding new
    }

  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        // Update Employee
        await axiosInstance.put(`/employees/${id}`, formData);
        console.log("Employee updated successfully!");
      } else {
        // Add Employee
        await axiosInstance.post("/employees", formData);
        console.log("Employee added successfully!");
      }

      navigate("/employeeManagement"); // Navigate back to the employee list
    } catch (error) {
      console.error(isEdit ? "Error updating employee:" : "Error adding employee:", error);
    }
    finally {
      setLoading(false); // Hide loader after submission
    }
  };
  if (loading) {
    return <AnimatedLogoLoader />;
  }

  return (
    <Box p={3} sx={{ height: "100vh" }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Button variant="text" color="primary" onClick={() => navigate(-1)}>
          <ArrowBack />
        </Button>
        <Typography variant="h5" sx={{ fontWeight: "bold", ml: 1 }}>
          {isEdit ? "Edit Employee" : "Add Employee"}
        </Typography>
      </Box>
      <Typography
        variant="subtitle1"
        sx={{ color: "grey.600", mb: 5, marginLeft: "60px" }}
      >
        <Link to="/" style={{ textDecoration: "none" }}>
          Dashboard
        </Link>{" "}
        / {isEdit ? "Edit Employee" : "Add Employee"}
      </Typography>
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
                  value={formData.teamRole || ""}
                  onChange={handleChange}
                  required
                >
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
                <InputLabel>Team Leader or Member?</InputLabel>
                <Select
                  label="Team Leader or Member?"
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
              {isEdit ? "Update" : "Save"}
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

export default EditEmp;
