import { useState, useEffect } from "react";
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
import axiosInstance from "../../Authentication/axiosConfig";

function Transpoter() {
  const [transpoter, setTranspoter] = useState([]);
  const [statusFilter, setStatusFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  console.log("transpoter", transpoter);

  // Fetch companies from the API
  // useEffect(() => {
  //   axios
  //     .get("http://localhost:3000/api/transporters/")
  //     .then((response) => {
  //       console.log(response.data); // Check the structure of the response data
  //       if (Array.isArray(response.data)) {
  //         setTranspoter(response.data); // Set companies if the response is an array
  //       } else {
  //         console.error("Received data is not an array");
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching driver:", error);
  //     });
  // }, []);

  useEffect(() => {
    axiosInstance
      .get("/transporters/")
      .then((response) => {
        console.log(response.data); // Check the structure of the response data
        if (Array.isArray(response.data)) {
          // Add tanker count to each transporter
          const updatedTransporters = response.data.map((transporter) => ({
            ...transporter,
            tankerCount: transporter.tankers.length, // Count tankers
          }));
          setTranspoter(updatedTransporters); // Set updated transporters
        } else {
          console.error("Received data is not an array");
        }
      })
      .catch((error) => {
        console.error("Error fetching transporters:", error);
      });
  }, []);
  

  // Handle toggle change (active status)
  const handleToggleActive = async (transpoterId, currentStatus) => {
    try {
      const response = await axiosInstance.put(
        `/transporters/toggle/${transpoterId}`
      );
      console.log("transpoter status toggled:", response.data);

      // Update the state directly
      setTranspoter((prevtranspoter) =>
        prevtranspoter.map((transpoter) =>
          transpoter.id === transpoterId
            ? { ...transpoter, activeStatus: !currentStatus } // Toggle status in the UI
            : transpoter
        )
      );
    } catch (error) {
      console.error("Error toggling transporter status:", error);
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

  const filteredTranspoter = transpoter
    .filter((transpoter) => {
      const matchesSearchQuery =
        transpoter.transporterName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (transpoter.createDate && transpoter.createDate.includes(searchQuery));

      const matchesStatus =
        statusFilter === null || transpoter.activeStatus === statusFilter;

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

  const paginatedTranspoter = filteredTranspoter.slice(
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
          Transporter Listing
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
          / Transporter Listing
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
          <Link to="/addTranspoter">
            <Button
              variant="contained"
              startIcon={<Add />}
              color="primary"
              sx={{ p: 1 }}
            >
              Add Transporter
            </Button>
          </Link>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Transporter Name
                  <IconButton onClick={handleSortByName}>
                    {nameSortOrder === "asc" ? (
                      <LuArrowDownUp className="fs-6" />
                    ) : (
                      <LuArrowDownUp className="fs-6" />
                    )}
                  </IconButton>
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Created By
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
                  Number of Tanker
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
              {paginatedTranspoter.map((transpoter) => (
                <TableRow key={transpoter.id}>
                  <TableCell align="center">
                    {transpoter.transporterName}
                  </TableCell>
                  <TableCell align="center">Admin</TableCell>

                  <TableCell align="center">
                    {formatDate(transpoter.createdAt)}
                  </TableCell>
                  <TableCell align="center">
                    <Link
                      to={`/tankerNumber/${transpoter.id}`}
                      style={{
                        display: "inline-block",
                        width: "40px",
                        height: "40px",
                        lineHeight: "40px",
                        borderRadius: "50%",
                        backgroundColor: "primary",
                        textAlign: "center",
                        textDecoration: "none",
                        color: "primary",
                        border: "1px solid #067bc2", // Optional: adds a border
                      }}
                    >
                      {transpoter.tankerCount}
                    </Link>
                  </TableCell>

                  <TableCell align="center">
                    <Switch
                      checked={transpoter.activeStatus}
                      onChange={() =>
                        handleToggleActive(
                          transpoter.id,
                          transpoter.activeStatus
                        )
                      }
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Link to={`/viewTranspoter/${transpoter.id}`}>
                      <IconButton color="dark">
                        <FaEye />
                      </IconButton>
                    </Link>
                    <Link to={`/editTranspoter/${transpoter.id}`}>
                      <IconButton>
                        <Edit />
                      </IconButton>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box mt={3} display="flex" justifyContent="center">
          <Pagination
            count={Math.ceil(transpoter.length / rowsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            sx={{ mt: 3 }}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default Transpoter;
