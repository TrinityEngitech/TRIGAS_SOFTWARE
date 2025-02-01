import { useState, useEffect } from "react";
// import axios from "axios";
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
  // Switch,
} from "@mui/material";
import { Edit, Add } from "@mui/icons-material";
import { useNavigate, Link } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
// import { FaEye } from "react-icons/fa";
import { LuArrowDownUp } from "react-icons/lu";
import axiosInstance from "../../Authentication/axiosConfig";
// import AnimatedLogoLoader from "../../component/AnimatedLogoLoader";

// satus
const getStatusStyles = (status) => {
  switch (status) {
    case "Pending":
      return { bg: "#FFECC8", color: "#E65100", border: "#FF9800" }; // Very Light Orange with Darker Border
    case "Order Booked":
      return { bg: "#F1F8E8", color: "#1B5E20", border: "#4CAF50" }; // Very Light Green with Darker Border
    case "Payment Pending":
      return { bg: "#F7CFD8", color: "#AE445A", border: "#AE445A" }; // Very Light Red with Darker Border
    case "Payment Credited":
      return { bg: "#DAF5FF", color: "#1976D2", border: "#2196F3" }; // Very Light Blue with Darker Border
    case "Payment Rejected":
      return { bg: "#FFACAC", color: "#8E1616", border: "#8E1616" }; // Very Light Purple with Darker Border
    case "Tanker Allocated":
      return { bg: "#FEFAE0", color: "#FFD65A", border: "#FFD65A" }; // Very Light Brown with Darker Border
    case "DO/SO Generated":
      return { bg: "#C5CAE9", color: "#1A237E", border: "#3F51B5" }; // Very Light Indigo with Darker Border
    case "Tanker Reported":
      return { bg: "#B2DFDB", color: "#00796B", border: "#009688" }; // Very Light Teal with Darker Border
    case "Tanker Loaded":
      return { bg: "#B2DFDB", color: "#00796B", border: "#009688" }; // Very Light Teal with Darker Border
    case "Tanker Rejected":
      return { bg: "#FFACAC", color: "#8E1616", border: "#8E1616" }; // Very Light Red with Darker Border
    case "Tanker Dispatched":
      return { bg: "#FFEB3B", color: "#F57F17", border: "#FF9800" }; // Very Light Yellow with Darker Border
    case "Tanker Delivered":
      return { bg: "#C8E6C9", color: "#388E3C", border: "#4CAF50" }; // Very Light Green with Darker Border
    case "Tanker Unloaded":
      return { bg: "#B2DFDB", color: "#004D40", border: "#009688" }; // Very Light Teal with Darker Border
    default:
      return { bg: "#CFD8DC", color: "#37474F", border: "#607D8B" }; // Very Light Gray with Darker Border
  }
};



function Order() {
  // State for order data
  const [order, setOrder] = useState([]);
  const [statusFilter, setStatusFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const navigate = useNavigate();
  useEffect(() => {
    axiosInstance
      .get("/orders")
      .then((response) => {
        if (Array.isArray(response.data)) {
          setOrder(response.data);
        } else {
          console.error("Received data is not an array");
        }
      })
      .catch((error) => {
        console.error("Error fetching Customer:", error);
      });
  }, []);

  console.log(order);

  // filter/search/pagination/datetime format
  // Sorting states
  const [nameSortOrder, setNameSortOrder] = useState(null); // null | 'asc' | 'desc'
  const [dateSortOrder, setDateSortOrder] = useState(null); // null | 'asc' | 'desc'
  // search-pagination
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const handleStatusFilter = (status) => {
    setStatusFilter(status); // Set the filter to active or inactive
  };
  const filteredTankers = order
    .filter((orders) => {
      const matchesSearchQuery =
        (orders.companyName || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (order.createDate && order.createDate.includes(searchQuery));

      const matchesStatus =
        statusFilter === null || orders.activeStatus === statusFilter;

      return matchesSearchQuery && matchesStatus; // Filter by search and status
    })

    .sort((a, b) => {
      // Apply name sorting
      if (nameSortOrder) {
        return nameSortOrder === "asc"
          ? a.companyName.localeCompare(b.companyName)
          : b.companyName.localeCompare(a.companyName);
      }
      // Apply date sorting
      if (dateSortOrder) {
        return dateSortOrder === "asc"
          ? new Date(a.createDate) - new Date(b.createDate)
          : new Date(b.createDate) - new Date(a.createDate);
      }
      return 0; // No sorting
    });

  const paginatedorder = filteredTankers.slice(
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
          Order Listing
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
          / Order Listing
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
              color="primary"
              onClick={() => handleStatusFilter(true)}
            >
              pending order
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleStatusFilter(false)}
            >
              complete order
            </Button>
          </Box>

          <Link to="/addOrder">
            <Button
              variant="contained"
              startIcon={<Add />}
              color="primary"
              sx={{ p: 1 }}
            >
              Add New Order
            </Button>
          </Link>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Order Number
                  <IconButton onClick={handleSortByName}>
                    {nameSortOrder === "asc" ? (
                      <LuArrowDownUp className="fs-6" />
                    ) : (
                      <LuArrowDownUp className="fs-6" />
                    )}
                  </IconButton>
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Order Date
                  <IconButton onClick={handleSortByDate}>
                    {dateSortOrder === "asc" ? (
                      <LuArrowDownUp className="fs-6" />
                    ) : (
                      <LuArrowDownUp className="fs-6" />
                    )}
                  </IconButton>
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Customer
                  <IconButton onClick={handleSortByName}>
                    {nameSortOrder === "asc" ? (
                      <LuArrowDownUp className="fs-6" />
                    ) : (
                      <LuArrowDownUp className="fs-6" />
                    )}
                  </IconButton>
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Supplier(Vender)
                  <IconButton onClick={handleSortByName}>
                    {nameSortOrder === "asc" ? (
                      <LuArrowDownUp className="fs-6" />
                    ) : (
                      <LuArrowDownUp className="fs-6" />
                    )}
                  </IconButton>
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Product
                  <IconButton onClick={handleSortByName}>
                    {nameSortOrder === "asc" ? (
                      <LuArrowDownUp className="fs-6" />
                    ) : (
                      <LuArrowDownUp className="fs-6" />
                    )}
                  </IconButton>
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Stage
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="subtitle1" color="textSecondary">
                      No orders available.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedorder.map((orders) => (
                  <TableRow key={orders.id}>
                    <TableCell align="center">
                      {orders.orderNumber || "N/A"}
                    </TableCell>
                    <TableCell align="center">
                      {orders.orderDateTime
                        ? formatDate(orders.orderDateTime)
                        : "N/A"}
                    </TableCell>
                    <TableCell align="center">
                      {orders.customerName || "N/A"}
                    </TableCell>
                    <TableCell align="center">
                      {orders.supplierName || "N/A"}
                    </TableCell>
                    <TableCell align="center">
                      {orders.productName || "N/A"}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                      }}
                    >
                      <Box
                        sx={{
                          backgroundColor: getStatusStyles(orders.status).bg, // Light BG
                          color: getStatusStyles(orders.status).color,
                          border: `1px solid ${
                            getStatusStyles(orders.status).border
                          }`,
                          padding: "8px",
                          borderRadius: "20px",
                          minWidth: "50px",
                          textAlign: "center",
                        }}
                      >
                        {orders.status || "N/A"}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      {/* <IconButton
            color="primary"
            onClick={() => navigate(`/viewOrder/${orders.id}`)}
          >
            <FaEye />
          </IconButton> */}
                      <IconButton
                        color="primary"
                        onClick={() => navigate(`/editOrder/${orders.id}`)}
                      >
                        <Edit />
                      </IconButton>
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

export default Order;
