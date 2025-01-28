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
import { Edit, Add } from "@mui/icons-material";
import { useNavigate, Link } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import { LuArrowDownUp } from "react-icons/lu";
import { FaEye } from "react-icons/fa";
import AnimatedLogoLoader from "../../component/AnimatedLogoLoader";
import axiosInstance from "../../Authentication/axiosConfig";

function Driver() {
  const [driver, setDriver] = useState([]);
  const [statusFilter, setStatusFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  console.log("Drivers", driver);

  // Fetch companies from the API
  useEffect(() => {
    axiosInstance
      .get("/drivers/")
      .then((response) => {
        console.log(response.data); // Check the structure of the response data
        if (Array.isArray(response.data)) {
          setDriver(response.data); // Set companies if the response is an array
        } else {
          console.error("Received data is not an array");
        }
      })
      .catch((error) => {
        console.error("Error fetching driver:", error);
      });
  }, []);

  // Handle toggle change (active status)
  const handleToggleActive = async (driverId, currentStatus) => {
    try {
      const response = await axiosInstance.put(
        `/drivers/toggle/${driverId}`
      );
      console.log("driver status toggled:", response.data);

      // Update the state directly
      setDriver((prevdriver) =>
        prevdriver.map((driver) =>
          driver.id === driverId
            ? { ...driver, activeStatus: !currentStatus } // Toggle status in the UI
            : driver
        )
      );
    } catch (error) {
      console.error("Error toggling driver status:", error);
    }
  };

  const navigate = useNavigate();

  // filter/search/pagination/datetime format
  // Sorting states
  const [nameSortOrder, setNameSortOrder] = useState(null);
  const [dateSortOrder, setDateSortOrder] = useState(null);

  const handleStatusFilter = (status) => {
    setStatusFilter(status); // Set the filter to active or inactive
  };

  // search-pagination
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredDriver = driver
    .filter((driver) => {
      const matchesSearchQuery =
        driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (driver.createDate && driver.createDate.includes(searchQuery));

      const matchesStatus =
        statusFilter === null || driver.activeStatus === statusFilter;

      return matchesSearchQuery && matchesStatus; // Filter by search and status
    })

    .sort((a, b) => {
      // Apply name sorting
      if (nameSortOrder) {
        return nameSortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      // Apply date sorting
      if (dateSortOrder) {
        return dateSortOrder === "asc"
          ? new Date(a.createDate) - new Date(b.createDate)
          : new Date(b.createDate) - new Date(a.createDate);
      }
      return 0; // No sorting
    });

  const paginatedDriver = filteredDriver.slice(
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
    if (!dateString) return "N/A"; // Handle missing date
    const date = new Date(dateString);
    if (isNaN(date)) return "Invalid Date"; // Handle invalid date formats
  
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
  
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
          Driver Listing
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
          / Driver Listing
        </Typography>
      </Box>
      <Box sx={{ background: "#fff", borderRadius: "20px", padding: "20px" }}>
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
                height: "40px",
                "& .MuiInputBase-root": { height: "40px" },
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
          <Link to="/addDriver">
            <Button
              variant="contained"
              startIcon={<Add />}
              color="primary"
              sx={{ p: 1 }}
            >
              Add Driver
            </Button>
          </Link>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Driver Name
                  <IconButton onClick={handleSortByName}>
                    {nameSortOrder === "asc" ? (
                      <LuArrowDownUp className="fs-6" />
                    ) : (
                      <LuArrowDownUp className="fs-6" />
                    )}
                  </IconButton>
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Driver Number
                </TableCell>
                {/* <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Manager Number
                </TableCell> */}
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
            {driver.length === 0 ? (
                  // Show loader when no suppliers are available
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                       {/* <AnimatedLogoLoader />    */}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedDriver.map((driver) => (
                <TableRow key={driver.id}>
                  <TableCell align="center">{driver.name}</TableCell>
                  <TableCell align="center">{driver.driverNumber}</TableCell>
                  {/* <TableCell align="center">{driver.managerNumber}</TableCell> */}

                  <TableCell align="center">{formatDate(driver.createDate)}</TableCell>

                  <TableCell align="center">
                    <Switch
                      checked={driver.activeStatus}
                      onChange={() =>
                        handleToggleActive(driver.id, driver.activeStatus)
                      }
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Link to={`/viewDriver/${driver.id}`}>
                      <IconButton color="dark">
                        <FaEye />
                      </IconButton>
                    </Link>
                    <Link to={`/editDriver/${driver.id}`}>
                      <IconButton>
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

        <Box mt={3} display="flex" justifyContent="center">
          <Pagination
            count={Math.ceil(driver.length / rowsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            sx={{ mt: 3 }}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default Driver;
