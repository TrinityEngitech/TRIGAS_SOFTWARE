import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  IconButton,
  Button,
  TextField,
  Pagination,
  Box,
  Typography,
  Tooltip,
} from "@mui/material";
import { Edit, Add } from "@mui/icons-material";
import { useNavigate, Link } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import { FaEye } from "react-icons/fa";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { LuArrowDownUp } from "react-icons/lu";
import axios from "axios"; // Import axios for API calls
import AnimatedLogoLoader from "../../component/AnimatedLogoLoader";
import axiosInstance from "../../Authentication/axiosConfig";

function Supplier() {
  const navigate = useNavigate();

  const [suppliers, setSuppliers] = useState([]); // State to store supplier data
  const [statusFilter, setStatusFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Fetch supplier data from API
  useEffect(() => {
    const fetchSuppliers = async () => {
      const response = await axiosInstance.get("/supplier"); // Update this with the actual API endpoint
      console.log(response.data);

      setSuppliers(response.data); // Set the data to state
    };

    fetchSuppliers(); // Call the function to fetch data
  }, []); // Empty dependency array means this effect runs only once when the component mounts

  const handleToggleActive = async (suppliersId, currentStatus) => {
    try {
      // Toggle the activeStatus in the request body
      const response = await axiosInstance.put(
        `h/supplier/toggle-status/${suppliersId}`,
        { activeStatus: !currentStatus } // Send the toggled status in the request body
      );

      console.log("supplier status toggled:", response.data);

      // Update the suppliers state with the updated activeStatus from the response
      setSuppliers((prevSuppliers) =>
        prevSuppliers.map((supplier) =>
          supplier.id === suppliersId
            ? { ...supplier, activeStatus: response.data.data.activeStatus } // Update activeStatus from backend response
            : supplier
        )
      );
    } catch (error) {
      console.error("Error toggling supplier status:", error);
    }
  };

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

  const filteredsuppliers = suppliers
    .filter((suppliers) => {
      const matchesSearchQuery =
        suppliers.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (suppliers.createDate && suppliers.createDate.includes(searchQuery));

      const matchesStatus =
        statusFilter === null || suppliers.activeStatus === statusFilter;

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

  const paginatedsuppliers = filteredsuppliers.slice(
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
    <div>
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
            Supplier Listing
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
            / Supplier Listing
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

            <Link to="/addsupplier">
              <Button
                variant="contained"
                startIcon={<Add />}
                // onClick={}
                color="primary"
                sx={{ p: 1 }}
              >
                Add New Supplier
              </Button>
            </Link>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Supplier Name{" "}
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
                {suppliers.length === 0 ? (
                  // Show loader when no suppliers are available
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      {/* <AnimatedLogoLoader /> */}
                    </TableCell>
                  </TableRow>
                ) : (
                  // Render suppliers when data is available
                  paginatedsuppliers.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell align="center">{supplier.name}</TableCell>
                      <TableCell align="center">
                        {formatDate(supplier.createDate)}
                      </TableCell>

                      <TableCell align="center">
                        <Switch
                          checked={supplier.activeStatus}
                          onChange={() =>
                            handleToggleActive(
                              supplier.id,
                              supplier.activeStatus
                            )
                          }
                        />
                      </TableCell>

                      <TableCell align="center">
                        <Link to={`/supplierdetalils/${supplier.id}`}>
                          <IconButton color="dark">
                            <FaEye />
                          </IconButton>
                        </Link>
                        <Link to={`/editsupplier/${supplier.id}`}>
                          <IconButton>
                            <Edit />
                          </IconButton>
                          </Link>
                          <Link to={`/DOSO_Number/${supplier.id}`}>
                          {/* <Link to="/DOSO_Number"> */}
                            <Tooltip title="DOSO Number" arrow>
                              <IconButton color="dark">
                                <InsertDriveFileIcon />
                              </IconButton>
                            </Tooltip>
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
              count={Math.ceil(suppliers.length / rowsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
            />
          </Box>
        </Box>
      </Box>
    </div>
  );
}

export default Supplier;
