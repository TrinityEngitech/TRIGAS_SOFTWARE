import  { useState, useEffect } from "react";
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
} from "@mui/material";
import { Edit, Add } from "@mui/icons-material";
import { useNavigate, Link } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import { LuArrowDownUp } from "react-icons/lu";
import AnimatedLogoLoader from "../component/AnimatedLogoLoader";

import axiosInstance from "../Authentication/axiosConfig"; // Import the custom Axios instance


function Products() {
  // State for products data
  const [products, setProducts] = useState([]);
  const [statusFilter, setStatusFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Modal State for Add/Edit product
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [modalData, setModalData] = useState({
    id: null,
    productName: "",
    productSequence: "", // Add this field
    NCV: "", 
    productGST: "", 
    isActive: true,
  });

  const navigate = useNavigate();

  // Fetch products from the API
  useEffect(() => {
    axios
      // .get("http://localhost:3000/api/products/")
      axiosInstance.get("/products/")
      .then((response) => {
        console.log(response.data); // Check the structure of the response data
        if (Array.isArray(response.data)) {
          setProducts(response.data); // Set products if the response is an array
        } else {
          console.error("Received data is not an array");
        }
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleEdit = (product) => {
    setModalData(product); // Ensure product has productName, activeStatus
    setIsEditing(true);
    setModalOpen(true);
  };

  const handleSaveProduct = () => {
    // Prepare the product data for submission
    const newProduct = {
      productName: modalData.productName,
      activeStatus:
        modalData.isActive !== undefined ? modalData.isActive : true,
      // Convert productSequence to an integer
      productSequence:
        parseInt(modalData.productSequence, 10) || products.length + 1, // Ensure it defaults to an integer
        NCV:
        parseInt(modalData.NCV, 10) || products.length + 1, // Ensure it defaults to an integer
        productGST:
        parseInt(modalData.productGST, 10) || products.length + 1, // Ensure it defaults to an integer
    };

    console.log("Product Data:", newProduct); // Log the data being sent to the server

    // Ensure productName is provided
    if (!newProduct.productName) {
      console.error("Error: Missing product name");
      return;
    }

    // If there's an existing product ID, perform a PUT request to update it
    if (modalData.id) {
      axios
        .put(`http://localhost:3000/api/products/${modalData.id}`, newProduct)
        .then((response) => {
          console.log("Product updated:", response.data);
          setProducts((prev) =>
            prev.map((product) =>
              product.id === modalData.id ? response.data : product
            )
          );
        })
        .catch((error) => {
          console.error(
            "Error updating product:",
            error.response ? error.response.data : error.message
          );
        });
    } else {
      // Perform the POST request to add the new product
      axios
        .post("http://localhost:3000/api/products", newProduct)
        .then((response) => {
          console.log("Product added:", response.data);
          setProducts((prev) => [...prev, response.data]);
        })
        .catch((error) => {
          console.error(
            "Error adding product:",
            error.response ? error.response.data : error.message
          );
        });
    }

    // Close the modal after saving
    setModalOpen(false);
  };

  // Handle toggle change (active status)
  const handleToggleActive = async (productId, currentStatus) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/products/toggle/${productId}`
      );
      console.log("Product status toggled:", response.data);

      // Update the state directly
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId
            ? { ...product, activeStatus: !currentStatus } // Toggle status in the UI
            : product
        )
      );
    } catch (error) {
      console.error("Error toggling product status:", error);
    }
  };

  // Sorting states
  const [nameSortOrder, setNameSortOrder] = useState(null);
  const [dateSortOrder, setDateSortOrder] = useState(null);
  const [sequenceSortOrder, setSequenceSortOrder] = useState(null);

  const handleStatusFilter = (status) => {
    setStatusFilter(status); // Set the filter to active or inactive
  };

  // search-pagination
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredTankers = products
    .filter((product) => {
      const matchesSearchQuery =
        product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (products.createDate && products.createDate.includes(searchQuery));

      const matchesStatus =
        statusFilter === null || product.activeStatus === statusFilter;

      return matchesSearchQuery && matchesStatus; // Filter by search and status
    })

    .sort((a, b) => {
      // Apply name sorting
      if (nameSortOrder) {
        return nameSortOrder === "asc"
          ? a.productName.localeCompare(b.productName)
          : b.productName.localeCompare(a.productName);
      }
      if (sequenceSortOrder) {
        return sequenceSortOrder === "asc"
          ? a.productSequence - b.productSequence
          : b.productSequence - a.productSequence;
      }
      // Apply date sorting
      if (dateSortOrder) {
        return dateSortOrder === "asc"
          ? new Date(a.createDate) - new Date(b.createDate)
          : new Date(b.createDate) - new Date(a.createDate);
      }
      return 0; // No sorting
    });

  const paginatedProducts = filteredTankers.slice(
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

  const handleSortByNumber = () => {
    setSequenceSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    setNameSortOrder(null); // Reset name sorting
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
          Product Listing
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
          / Product Listing
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

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setModalData({ id: null, productName: "", isActive: true });
              setIsEditing(false);
              setModalOpen(true);
            }}
            color="primary"
            sx={{ p: 1 }}
          >
            Add New Product
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Name
                  <IconButton onClick={handleSortByName}>
                    {nameSortOrder === "asc" ? (
                      <LuArrowDownUp className="fs-6" />
                    ) : (
                      <LuArrowDownUp className="fs-6" />
                    )}
                  </IconButton>
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  CV
                  <IconButton onClick={handleSortByNumber}>
                    {sequenceSortOrder === "asc" ? (
                      <LuArrowDownUp className="fs-6" />
                    ) : (
                      <LuArrowDownUp className="fs-6" />
                    )}
                  </IconButton>
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  GST
                  <IconButton onClick={handleSortByNumber}>
                    {sequenceSortOrder === "asc" ? (
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
              {paginatedProducts.length === 0 ? (
                // Show loader when no products are available
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    {/* <AnimatedLogoLoader /> */}
                  </TableCell>
                </TableRow>
              ) : (
                // Render products when data is available
                paginatedProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell align="center">{product.productName}</TableCell>
                    <TableCell align="center">
                      {product.NCV}
                    </TableCell>
                    <TableCell align="center">
                      {product.productGST} %
                    </TableCell>
                    <TableCell align="center">
                      {formatDate(product.createDate)}
                    </TableCell>
                    <TableCell align="center">
                      <Switch
                        checked={product.activeStatus}
                        onChange={() =>
                          handleToggleActive(product.id, product.activeStatus)
                        }
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={() => handleEdit(product)}
                        color="primary"
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

        {/* Modal for Add/Edit Product */}
        <Dialog
          open={isModalOpen}
          onClose={handleModalClose}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {isEditing ? "Edit Product" : "Add Product"}
          </DialogTitle>
          <DialogContent sx={{ padding: "20px" }}>
            <TextField
              fullWidth
              label="Product Name"
              variant="outlined"
              value={modalData.productName}
              onChange={(e) =>
                setModalData((prev) => ({
                  ...prev,
                  productName: e.target.value.toUpperCase(), 
                }))
              }
              margin="normal"
              
            />
            <TextField
              fullWidth
              label="NCV"
              variant="outlined"
              value={modalData.NCV}
              onChange={(e) =>
                setModalData((prev) => ({
                  ...prev,
                  NCV: e.target.value,
                }))
              }
              margin="normal"
            />
            <TextField
              fullWidth
              label="GST (%)"
              variant="outlined"
              value={modalData.productGST}
              onChange={(e) =>
                setModalData((prev) => ({
                  ...prev,
                  productGST: e.target.value,
                }))
              }
              margin="normal"
            />
            <TextField
              fullWidth
              label="Sequence Number"
              variant="outlined"
              value={modalData.productSequence}
              onChange={(e) =>
                setModalData((prev) => ({
                  ...prev,
                  productSequence: e.target.value,
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
              onClick={handleSaveProduct}
              color="primary"
              variant="contained"
              disabled={!modalData.productName.trim()} // Change to productName
            >
              save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

export default Products;
