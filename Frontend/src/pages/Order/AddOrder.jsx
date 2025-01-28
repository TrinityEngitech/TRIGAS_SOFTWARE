import { useState, useEffect } from "react";
import {
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Grid,
  Box,
  Typography,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";

import AnimatedLogoLoader from "../../component/AnimatedLogoLoader";
import axiosInstance from "../../Authentication/axiosConfig"; // Import the custom Axios instance

function AddOrder() {
 
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      const response = await axiosInstance.get("/customers/");
      console.log(response.data || []);

      setCustomers(response.data); // Set the data to state
    };

    fetchSuppliers(); // Call the function to fetch data
  }, []);
  console.log("customers", customers);

  const [supplierLocation, setSupplierLocation] = useState([]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      const response = await axiosInstance.get(
        "/SupplyLocations/supply-locations"
      );
      console.log(response.data || []);

      setSupplierLocation(response.data); // Set the data to state
    };

    fetchSuppliers(); // Call the function to fetch data
  }, []);
  console.log("supplierLocation", supplierLocation);

  const [product, setProduct] = useState([]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      const response = await axiosInstance.get("/products/");
      console.log(response.data || []);

      setProduct(response.data); // Set the data to state
    };

    fetchSuppliers(); // Call the function to fetch data
  }, []);
  console.log("product", product);

 

  useEffect(() => {
    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData && userData.name && userData.role) {
      // Combine name and role in the desired format
      const formattedUser = `${userData.name} (${userData.role})`;

      // Set the formatted name and role in the form data
      setFormData((prev) => ({
        ...prev,
        orderCreatedBy: formattedUser,
      }));
    }
  }, []);

  const [formData, setFormData] = useState({
    customerId: "",
    customerName: "",
    supplierName: "",
    supplyLoadingPoint: "",
    productName: "",
    productQuantity: "",
    teamName: "",
    orderCreatedBy: "",
    orderDateTime: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Check if the field being updated is 'customerName'
    if (name === "customerName") {
      const selectedCustomer = customers.find(
        (customer) => customer.companyName === value
      );

      setFormData((prev) => ({
        ...prev,
        [name]: value, // Update customerName
        customerId: selectedCustomer ? selectedCustomer.id : "", // Set customerId
        supplierName: "", // Reset supplierName if customer changes
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value, // Update other fields
      }));
    }
  };

  // Get associated suppliers for the selected customer
  const selectedCustomer = customers.find(
    (customer) => customer.companyName === formData.customerName
  );

  
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false); // For button state

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
    setLoading(true); // Show loader

    try {
      const response = await axiosInstance.post("/orders/create", formData);
      console.log("Response:", response.data);

      setLoading(false); // Hide loader
      navigate("/order"); // Navigate to order page
    } catch (error) {
      console.error("Error:", error);
      setLoading(false); // Hide loader on error
      // Handle the error, maybe show an error message to the user
    }
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
          Booking Info
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
          / Create New Order
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
        {loading ? (
        <AnimatedLogoLoader /> // Display loader when loading
      ) : (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
             
              <FormControl fullWidth>
                <InputLabel>Customer</InputLabel>
                <Select
                  label="Customer"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  required
                >
                  {customers.map((customer) => (
                    <MenuItem key={customer.id} value={customer.companyName}>
                      {customer.companyName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* companyName */}
            </Grid>

            <Grid item xs={12} sm={6}>
            
              <FormControl fullWidth>
                <InputLabel>Supplier</InputLabel>
                <Select
                  label="Supplier"
                  name="supplierName"
                  value={formData.supplierName}
                  onChange={handleChange}
                  required
                  disabled={!formData.customerName} // Disable if no customer is selected
                >
                  {selectedCustomer?.associatedSuppliers.map(
                    (supplier, index) => (
                      <MenuItem key={index} value={supplier}>
                        {supplier}
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Supply Location</InputLabel>
                <Select
                  label="Supply Location"
                  name="supplyLoadingPoint"
                  value={formData.supplyLoadingPoint}
                  onChange={handleChange}
                  required
                >
                  {supplierLocation.map((supplierLocation) => (
                    <MenuItem
                      key={supplierLocation.id}
                      value={supplierLocation.LocationName}
                    >
                      {supplierLocation.LocationName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* LocationName */}
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Product</InputLabel>
                <Select
                  label="Product"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  required
                >
                  {product.map((product) => (
                    <MenuItem key={product.id} value={product.productName}>
                      {product.productName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              

              {/* productName */}
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Quantity(MT)"
                name="productQuantity"
                value={formData.productQuantity}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
             
              <FormControl fullWidth>
                <InputLabel>Team</InputLabel>
                <Select
                  label="Team"
                  name="teamName"
                  value={formData.teamName}
                  onChange={handleChange}
                  required
                  disabled={!formData.customerName} // Disable if no customer is selected
                >
                  {selectedCustomer?.team && (
                    <MenuItem
                      key={selectedCustomer.id}
                      value={selectedCustomer.team}
                    >
                      {selectedCustomer.team}
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Created By"
                name="orderCreatedBy"
                value={formData.orderCreatedBy}
                onChange={handleChange}
                required
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="datetime-local"
                label="Order Date & Time"
                name="orderDateTime"
                value={formData.orderDateTime}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />
            </Grid>
          </Grid>
          {/* Action Buttons */}
          <Box mt={3} display="flex" justifyContent="center" gap={2}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? "Loading..." : "Book Order"}
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
          </Box>
        </form>
         )}
      </Box>
    </Box>
  );
}

export default AddOrder;
