import  { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Box,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
// import { FaEye } from "react-icons/fa";
import { Delete } from "@mui/icons-material";
import axios from "axios";
import axiosInstance from "../../Authentication/axiosConfig";

function TransportationCharge() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    supplierName: "",
    loadingPoint: "",
    product: "",
    cv: "",
    gst: "18",
    transportationCharge: "",
  });


  const [fetchproducts, setFetchProducts] = useState([]);
  const [fetchlocations, setFetchLocations] = useState([]);
  const [fetchsuppliers, setFetchSuppliers] = useState([]);


  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, locationsResponse , supplierResponse] = await Promise.all([
          axiosInstance.get("/products/"),
          axiosInstance.get(
            "/SupplyLocations/supply-locations"
          ),
          axiosInstance.get(
            "/supplier"
          ),
        ]);


        // Validate and set products
        if (Array.isArray(productsResponse.data)) {
          setFetchProducts(productsResponse.data);
        } else {
          console.error("Products response data is not an array");
        }

        // Validate and set locations
        if (Array.isArray(locationsResponse.data)) {
          const LocationName = locationsResponse.data.map((location) => location.LocationName); // Map to extract names

          setFetchLocations(LocationName);
        } else {
          console.error("Locations response data is not an array");
        }
        // supplier and set supplier
        if (Array.isArray(supplierResponse.data)) {
          const SupplierName = supplierResponse.data.map((supplier) => supplier.name); // Map to extract names
          setFetchSuppliers(SupplierName);
        } else {
          console.error("Supplier response data is not an array");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const [charges, setCharges] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    fetchCharges();
  }, []);

 // Fetch transportation charges
const fetchCharges = async () => {
  try {
    const response = await axiosInstance.get("/transportation-charges");
    // console.log("Fetched data:", response.data); // Log the response
    setCharges(response.data);
  } catch (error) {
    console.error("Error fetching charges:", error);
  }
};


  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };



  const handleSave = async () => {
    // Ensure all required fields are filled
    if (
      !formData.supplierName ||
      !formData.loadingPoint ||
      !formData.product ||
      !formData.productSequence ||
      !formData.cv ||
      !formData.gst ||
      !formData.transportationCharge
    ) {
      alert("Please fill in all required fields.");
      return;
    }
  
    console.log("Form data to be submitted:", formData);
  
    try {
      setIsLoading(true); // Start loading indicator
  
      // Send data to backend using axios
      const response = await axiosInstance.post(
        "/transportation-charges",
        formData
      );
  
      console.log("Save response:", response.data);
  
      // Reset form data
      setFormData({
        supplierName: "",
        loadingPoint: "",
        product: "",
        productSequence: "",
        cv: "",
        gst: "",
        transportationCharge: "",
      });
  
      // Fetch updated data after successful save
      await fetchCharges();
  
      alert("Transportation charge saved successfully!"); // Success message
      setIsLoading(false); // Stop loading indicator
    } catch (error) {
      console.error("Error saving charge:", error);
  
      setIsLoading(false);
  
      // Handle specific error response
      if (error.response) {
        // Backend returned an error
        if (error.response.status === 400) {
          alert(error.response.data.message); // Show backend error message
        } else if (error.response.status === 500) {
          alert("Internal server error. Please try again later.");
        } else {
          alert(`Unexpected error: ${error.response.status}`);
        }
      } else if (error.request) {
        // No response received
        alert("No response from the server. Please check your network connection.");
      } else {
        // Other errors
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };
  
  

  // Cancel form input
  const handleCancel = () => {
    setFormData({
      supplierName: "",
      loadingPoint: "",
      product: "",
      cv: "",
      gst: "",
      transportationCharge: "",
    });
  };


  // Delete a transportation charge
  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/transportation-charges/${id}`);
      setCharges((prev) => prev.filter((charge) => charge.id !== id));
    } catch (error) {
      console.error("Error deleting charge:", error);
    }
  };

  useEffect(() => {
    fetchCharges();
  }, []);

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
          Transportation Charge
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
          / Transportation Charge
        </Typography>
      </Box>

      <Box
        sx={{
          background: "#fff",
          borderRadius: "20px",
          padding: "20px 20px 30px 20px",
        }}
      >
        <Grid container spacing={2} mb={2}>
          <Grid item xs={4}>
            {/* <TextField
              label="Supplier Name"
              name="supplierName"
              value={formData.supplierName}
              onChange={handleChange}
              variant="outlined"
              fullWidth
            /> */}
            <FormControl fullWidth>
                      <InputLabel>Supplier Name</InputLabel>
                      <Select
                        label="Supplier Name"
                        name="supplierName"
                        value={formData.supplierName}
                        onChange={handleChange}
                        required
                      >
                        {fetchsuppliers.map((supplier) => (
            <MenuItem key={supplier.id} value={supplier}>
              {supplier}
            </MenuItem>
          ))}
                      </Select>
                    </FormControl>
          </Grid>
          
          <Grid item xs={4}>
            
           
                    <FormControl fullWidth>
  <InputLabel>Product Name</InputLabel>
  <Select
    label="Product Name"
    name="product"
    value={formData.product}
    onChange={(e) => {
      const selectedProductName = e.target.value;
      // Find the product by name
      const selectedProduct = fetchproducts.find(
        (product) => product.productName === selectedProductName
      );

      // Update both productName and productSequence in formData
      setFormData((prev) => ({
        ...prev,
        product: selectedProductName,  // Set productName
        productSequence: selectedProduct ? selectedProduct.productSequence : "", // Auto-set productSequence
      }));
    }}
    required
  >
    {fetchproducts.map((product) => (
      <MenuItem key={product.id} value={product.productName}>
        {product.productName}
      </MenuItem>
    ))}
  </Select>
</FormControl>

          </Grid>
          <Grid item xs={4}>
            <TextField
              label="CV"
              name="cv"
              value={formData.cv}
              onChange={handleChange}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
           
            <FormControl fullWidth>
                      <InputLabel>Loading Point</InputLabel>
                      <Select
                        label="Loading Point"
                        name="loadingPoint"
                        value={formData.loadingPoint}
                        onChange={handleChange}
                        required
                      >
                        {fetchlocations.map((location) => (
            <MenuItem key={location.id} value={location}>
              {location}
            </MenuItem>
          ))}
                      </Select>
                    </FormControl>
          </Grid>
          
          <Grid item xs={4}>
            <TextField
              label="GST(%)"
              name="gst"
              value={formData.gst}
              onChange={handleChange}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Transportation Charge"
              name="transportationCharge"
              value={formData.transportationCharge}
              onChange={handleChange}
              variant="outlined"
              fullWidth
            />
          </Grid>
        </Grid>
        <Box mt={3} display="flex" justifyContent="center" gap={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
          <Button variant="outlined" color="error" onClick={handleCancel}>
            Cancel
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          background: "#fff",
          borderRadius: "20px",
          padding: "20px 20px 30px 20px",
          marginTop: "20px",
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", marginBottom: 2, marginTop: "20px" }}
        >
          Details
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">
                  <strong>Supplier Name</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Product Name</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>CV</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Loading Point</strong>
                </TableCell>
                
              
                <TableCell align="center">
                  <strong>GST(%)</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Transportation Charge</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Action</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {charges.length > 0 ? (
                charges.map((charge) => (
                  <TableRow key={charge.id}>
                    <TableCell align="center">{charge.supplierName}</TableCell>
                    <TableCell align="center">{charge.product}</TableCell>
                    <TableCell align="center">{charge.cv}</TableCell>
                    <TableCell align="center">{charge.loadingPoint}</TableCell>
                    <TableCell align="center">{charge.gst}</TableCell>
                    <TableCell align="center">
                      {charge.transportationCharge}
                    </TableCell>
                    <TableCell align="center">
                      {/* <IconButton color="grey">
                        <FaEye />
                      </IconButton> */}
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(charge.id)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No charges available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

export default TransportationCharge;
