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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Switch,
  Skeleton,
} from "@mui/material";
import { Edit, Add } from "@mui/icons-material";
import { useNavigate, Link } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import { LuArrowDownUp } from "react-icons/lu";
import { FaEye } from "react-icons/fa";
import EmailIcon from "@mui/icons-material/Email";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import SimCardDownloadIcon from "@mui/icons-material/SimCardDownload";
import axiosInstance from "../../Authentication/axiosConfig";
import * as XLSX from "xlsx";

function Pricesheet() {
  // State for pricesheet data
  const [loading, setLoading] = useState(true); // Loading state
  // const [paginatedPricesheet, setPaginatedPricesheet] = useState([]); // Assume this is used for pagination
  const [error, setError] = useState(null); // Error state to handle fetch errors

  const [pricesheet, setPricesheet] = useState([]);
  const [statusFilter, setStatusFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const [isModalOpen, setModalOpen] = useState(false); // State for modal visibility
  const [modalData, setModalData] = useState({ email: "" }); // State for email input

  // Close the modal
  const handleModalClose = () => {
    setModalOpen(false);
    setModalData({ email: "" }); // Reset email field when closing
  };

  // Handle save action
  const handleSaveEmail = () => {
    console.log("Email Address:", modalData.email);

    // Example: Send the email to the server
    axiosInstance
      .post("/email", { email: modalData.email })
      .then((response) => {
        console.log("Email saved:", response.data);
      })
      .catch((error) => {
        console.error("Error saving email:", error);
      });

    // Close the modal
    setModalOpen(false);
  };

  const navigate = useNavigate();

  // Fetch pricesheets from the API
  useEffect(() => {
    setLoading(true); // Start loading
    axiosInstance
      .get("/price-sheets")
      .then((response) => {
        if (Array.isArray(response.data)) {
          setPricesheet(response.data); // Set pricesheets if the response is an array
          console.log(response.data);

          setError(null); // Clear previous errors if any
        } else {
          setError("Received data is not an array");
          console.error("Received data is not an array");
        }
      })
      .catch((error) => {
        setError("Error fetching pricesheets");
        console.error("Error fetching pricesheets:", error);
      })
      .finally(() => {
        setLoading(false); // End loading
      });
  }, []);

  const handleDownload = () => {
    // Transform `pricesheet` data into a flat array
    const dataToExport = pricesheet.flatMap((sheet) =>
      sheet.data.map((row) => ({
        "Price Sheet Name": sheet.name,
        City: sheet.city,
        "Effective Date": sheet.effectiveDate,
        "Effective Time": sheet.effectiveTime,
        "Supplier Name": row.supplierName,
        "Product Name": row.productName,
        "Loading Point": row.loadingPoint,
        "Basic Price": row.basicPrice,
        CV: row.cv,
        "Transport Charge": row.transportCharge,
        "Basic Landed": row.basicLanded,
        GST: row.gst,
        Total: row.total,
      }))
    );

    // Create a new worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Price Sheets");

    // Trigger Excel download
    XLSX.writeFile(workbook, "PriceSheets.xlsx");
  };

  // Handle toggle change (active status)
  const handleToggleActive = async (id, currentStatus) => {
    try {
      const updatedStatus = !currentStatus; // Toggle the status
      // Call the API
      const response = await axiosInstance.patch(
        `/price-sheets/${id}/active-status`,
        { activeStatus: updatedStatus }
      );

      if (response.status === 200) {
        console.log(
          `Status updated successfully: ${response.data.updatedPriceSheet}`
        );
        // Optionally update your local state if necessary
        setPricesheet((prev) =>
          prev.map((sheet) =>
            sheet.id === id ? { ...sheet, activeStatus: updatedStatus } : sheet
          )
        );
      }
    } catch (error) {
      console.error("Error updating active status:", error);
      alert("Failed to update active status. Please try again.");
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

  const filteredPricesheet = pricesheet
    .filter((pricesheet) => {
      const matchesSearchQuery =
        pricesheet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (pricesheet.createDate && pricesheet.createDate.includes(searchQuery));

      const matchesStatus =
        statusFilter === null || pricesheet.activeStatus === statusFilter;

      return matchesSearchQuery && matchesStatus; // Filter by search and status
    })

    .sort((a, b) => {
      // Apply name sorting
      if (nameSortOrder) {
        return nameSortOrder === "asc"
          ? a.pricesheetName.localeCompare(b.pricesheetName)
          : b.pricesheetName.localeCompare(a.pricesheetName);
      }
      // Apply date sorting
      if (dateSortOrder) {
        return dateSortOrder === "asc"
          ? new Date(a.createdAt) - new Date(b.createdAt)
          : new Date(b.createdAt) - new Date(a.createdAt);
      }
      return 0; // No sorting
    });

  const paginatedPricesheet = filteredPricesheet.slice(
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
          Pricesheet Listing
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
          / Pricesheet Listing
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
            {/* Email Button */}
            <IconButton
              onClick={() => setModalOpen(true)}
              color="primary"
              sx={{
                p: 1,
                border: "1px solid #1976d2",
                borderRadius: "50%",
              }}
            >
              <EmailIcon />
            </IconButton>
            {/* WhatsApp Button */}
            <IconButton
              onClick={handleDownload}
              color="primary"
              sx={{
                p: 1,
                border: "1px solid #1976d2",
                borderRadius: "50%",
              }}
            >
              <SimCardDownloadIcon />
            </IconButton>
          </Box>

          <Box>
            <Link to="/addPricesheet">
              <Button
                variant="contained"
                startIcon={<Add />}
                color="primary"
                sx={{ p: 1, mr: 2 }}
              >
                Add Pricesheet
              </Button>
            </Link>
            <Link to="/transpotationCharge">
              <Button
                variant="contained"
                startIcon={<Add />}
                color="primary"
                sx={{ p: 1 }}
              >
                Transportation Charges
              </Button>
            </Link>
          </Box>
        </Box>

        <TableContainer>
          {loading ? (
            // Show loading skeleton while fetching data
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">
                    <Skeleton width={200} />
                  </TableCell>
                  <TableCell align="center">
                    <Skeleton width={200} />
                  </TableCell>
                  <TableCell align="center">
                    <Skeleton width={200} />
                  </TableCell>
                  <TableCell align="center">
                    <Skeleton width={200} />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">
                      <Skeleton width={200} />
                    </TableCell>
                    <TableCell align="center">
                      <Skeleton width={200} />
                    </TableCell>
                    <TableCell align="center">
                      <Skeleton width={200} />
                    </TableCell>
                    <TableCell align="center">
                      <Skeleton width={200} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            // Actual table after loading
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    PricesheetName
                    <IconButton>
                      <LuArrowDownUp className="fs-6" />
                    </IconButton>
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Created On
                    <IconButton>
                      <LuArrowDownUp className="fs-6" />
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
                {paginatedPricesheet.map((pricesheet) => (
                  <TableRow key={pricesheet.id}>
                    <TableCell align="center">{pricesheet.name}</TableCell>
                    <TableCell align="center">
                      {formatDate(pricesheet.createdAt)}
                    </TableCell>
                    <TableCell align="center">
                      <Switch
                        checked={pricesheet.activeStatus}
                        onChange={() =>
                          handleToggleActive(
                            pricesheet.id,
                            pricesheet.activeStatus
                          )
                        }
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Link to={`/viewPricesheet/${pricesheet.id}`}>
                        <IconButton color="dark" aria-label="View">
                          <FaEye />
                        </IconButton>
                      </Link>
                      <Link to={`/editPricesheet/${pricesheet.id}`}>
                        <IconButton color="dark" aria-label="Edit">
                          <Edit />
                        </IconButton>
                      </Link>
                      
                      <IconButton color="dark" aria-label="Share via WhatsApp">
                        <WhatsAppIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>

        {/* pagination */}
        <Box mt={3} display="flex" justifyContent="center">
          <Pagination
            count={Math.ceil(filteredPricesheet.length / rowsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            sx={{ mt: 3 }}
          />
        </Box>

        {/* Modal for Enter Email Address */}
        <Dialog
          open={isModalOpen}
          onClose={handleModalClose}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Email Address</DialogTitle>
          <DialogContent sx={{ padding: "24px" }}>
            <TextField
              fullWidth
              type="email"
              label="Email Address"
              variant="outlined"
              value={modalData.email} // Updated to use 'email' field
              onChange={(e) =>
                setModalData((prev) => ({
                  ...prev,
                  email: e.target.value, // Capture the email address
                }))
              }
              margin="normal"
            />
          </DialogContent>
          <DialogActions sx={{ padding: "16px 24px" }}>
            <Button onClick={handleModalClose} color="error" variant="outlined">
              Cancel
            </Button>
            <Button
              onClick={handleSaveEmail} // Save the email address
              color="primary"
              variant="contained"
              disabled={!modalData.email.trim()} // Disable if email is empty
            >
              Send
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

export default Pricesheet;
