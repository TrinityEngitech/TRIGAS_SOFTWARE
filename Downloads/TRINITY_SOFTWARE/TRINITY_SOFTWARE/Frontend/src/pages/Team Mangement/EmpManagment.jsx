import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Pagination,
  Box,
  Typography,
  IconButton,
  Switch,
} from "@mui/material";
import { Edit, Add} from "@mui/icons-material";
import { useNavigate, Link } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import { FaEye } from "react-icons/fa";
import { LuArrowDownUp } from "react-icons/lu";
import AnimatedLogoLoader from "../../component/AnimatedLogoLoader";

function EmpManagment() {
  // State for employees data
  const [employees, setEmployees] = useState([]);
  const [statusFilter, setStatusFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const navigate = useNavigate();

  // Fetch employees from the API
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/employees")
      .then((response) => {
        console.log(response.data); // Check the structure of the response data
        if (Array.isArray(response.data)) {
          setEmployees(response.data); // Set employees if the response is an array
        } else {
          console.error("Received data is not an array");
        }
      })
      .catch((error) => {
        console.error("Error fetching employees:", error);
      });
  }, []);

  // Handle toggle change (active status)
  const handleToggleActive = async (employeeId, currentStatus) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/employees/toggle/${employeeId}`
      );
      console.log("employee status toggled:", response.data);

      // Update the state directly
      setEmployees((prevemployees) =>
        prevemployees.map((employee) =>
          employee.id === employeeId
            ? { ...employee, activeStatus: !currentStatus } // Toggle status in the UI
            : employee
        )
      );
    } catch (error) {
      console.error("Error toggling employee status:", error);
    }
  };

  // filter/search/pagination/datetime format
  // Sorting states
  const [nameSortOrder, setNameSortOrder] = useState(null); // null | 'asc' | 'desc'
  const [dateSortOrder, setDateSortOrder] = useState(null); // null | 'asc' | 'desc'

  const handleStatusFilter = (status) => {
    setStatusFilter(status); // Set the filter to active or inactive
  };

  // search-pagination
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredTankers = employees
    .filter((employee) => {
      const matchesSearchQuery =
        employee.empName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (employees.createDate && employees.createDate.includes(searchQuery));

      const matchesStatus =
        statusFilter === null || employee.activeStatus === statusFilter;

      return matchesSearchQuery && matchesStatus; // Filter by search and status
    })

    .sort((a, b) => {
      // Apply name sorting
      if (nameSortOrder) {
        return nameSortOrder === "asc"
          ? a.empName.localeCompare(b.empName)
          : b.empName.localeCompare(a.empName);
      }
      // Apply date sorting
      if (dateSortOrder) {
        return dateSortOrder === "asc"
          ? new Date(a.createDate) - new Date(b.createDate)
          : new Date(b.createDate) - new Date(a.createDate);
      }
      return 0; // No sorting
    });

  const paginatedemployees = filteredTankers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Sorting logic
  const handleSortByName = () => {
    setNameSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    setDateSortOrder(null); // Reset date sorting
  };

  const handleSortByDate = () => {
    setDateSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    setNameSortOrder(null); // Reset name sorting
  };

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
          Employee Listing
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
          / Employee Listing
        </Typography>
      </Box>

      <Box
        sx={{
          background: "#fff",
          borderRadius: "20px",
          padding: "20px 20px 30px 20px",
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
          mt={5}
        >
          <Box display="flex" gap={2}>
            <TextField
              placeholder="Search"
              variant="outlined"
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{
                height: "40px", // Adjust the height
                "& .MuiInputBase-root": {
                  height: "40px", // Matches the parent height
                },
              }}
            />
            <Button
              variant="outlined"
              color="success"
              onClick={() => handleStatusFilter(true)}
            >
              Active
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleStatusFilter(false)}
            >
              Inactive
            </Button>
          </Box>

          <Link to="/addEmployee">
            <Button
              variant="contained"
              startIcon={<Add />}
              color="primary"
              sx={{ p: 1 }}
            >
              Add Employee
            </Button>
          </Link>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Employee Name
                  <IconButton onClick={handleSortByName}>
                    {nameSortOrder === "asc" ? (
                      <LuArrowDownUp className="fs-6" />
                    ) : (
                      <LuArrowDownUp className="fs-6" />
                    )}
                  </IconButton>
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Team Name
                  <IconButton onClick={handleSortByName}>
                    {nameSortOrder === "asc" ? (
                      <LuArrowDownUp className="fs-6" />
                    ) : (
                      <LuArrowDownUp className="fs-6" />
                    )}
                  </IconButton>
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Team Leader Name
                  <IconButton onClick={handleSortByName}>
                    {nameSortOrder === "asc" ? (
                      <LuArrowDownUp className="fs-6" />
                    ) : (
                      <LuArrowDownUp className="fs-6" />
                    )}
                  </IconButton>
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Role
                  <IconButton onClick={handleSortByName}>
                    {nameSortOrder === "asc" ? (
                      <LuArrowDownUp className="fs-6" />
                    ) : (
                      <LuArrowDownUp className="fs-6" />
                    )}
                  </IconButton>
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Created On
                  <IconButton onClick={handleSortByDate}>
                    {dateSortOrder === "asc" ? (
                      <LuArrowDownUp className="fs-6" />
                    ) : (
                      <LuArrowDownUp className="fs-6" />
                    )}
                  </IconButton>
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Is Active?
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {employees.length === 0 ? (
                  // Show loader when no suppliers are available
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                       {/* <AnimatedLogoLoader />    */}
                    </TableCell>
                  </TableRow>
                ) : (
              paginatedemployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell align="center">{employee.empName}</TableCell>
                  <TableCell align="center">{employee.teamName}</TableCell>
                  <TableCell align="center">
                    {employee.teamLeaderName || "Leader"}
                  </TableCell>
                  <TableCell align="center">{employee.teamRole}</TableCell>
                  <TableCell align="center">
                    {formatDate(employee.createDate)}
                  </TableCell>
                  <TableCell align="center">
                    <Switch
                      checked={employee.activeStatus}
                      onChange={() =>
                        handleToggleActive(employee.id, employee.activeStatus)
                      }
                    />
                  </TableCell>

                  <TableCell align="center">
                    <Link to={`/viewEmployee/${employee.id}`}>
                      <IconButton color="dark">
                        <FaEye />
                      </IconButton>
                    </Link>
                    <Link to={`/editEmployee/${employee.id}`}>
                      <IconButton color="dark">
                        <Edit />
                      </IconButton>
                    </Link>
                  </TableCell>
                </TableRow>
             ))
            )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* pagination */}
        <Box mt={3} display="flex" justifyContent="center">
          <Pagination
            count={Math.ceil(filteredTankers.length / rowsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            sx={{ mt: 3 }}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default EmpManagment;
