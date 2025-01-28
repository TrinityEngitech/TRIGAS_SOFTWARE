import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { useNavigate, Link } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import axios from "axios";
import axiosInstance from "../../Authentication/axiosConfig"; // Import the custom Axios instance

const AddSupplier = () => {
  const navigate = useNavigate();
  // State for supplier details
  const [supplierDetails, setSupplierDetails] = useState({
    supplierName: "",
    legalName: "",
    supplierEmail: "",
    supplierGstNumber: "",
    supplierPanNumber: "",
    supplierLogo: null,
  });

  // State for products and product locations
  const [products, setProducts] = useState([
    { _id: "1", productName: "Product A", productCode: "" },
  ]);

  const [trigasProduct, setTrigasProduct] = useState([]);
  console.log(trigasProduct);

  const [productLocations, setProductLocations] = useState(
    products.reduce((acc, product) => {
      acc[product._id] = [{ location: "", zipCode: "" }];
      return acc;
    }, {})
  );

  // State for Bank details
  const [bank, setBank] = useState([
    {
      accountName: "",
      productName: "",
      typeOfAccount: "",
      bankName: "",
      branchName: "",
      ifscCode: "",
      accountNumber: "",
      preNumber: "",
      middleNumber: "",
      postNumber: "",
      activeStatus: true,
    },
  ]);
  console.log(bank);

  // State for contact details
  const [contacts, setContacts] = useState([
    { contactName: "", phoneNumber: "", designation: "", email: "" },
  ]);

  const [fetchproducts, setFetchProducts] = useState([]);
  const [fetchlocations, setFetchLocations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, locationsResponse] = await Promise.all([
          axiosInstance.get("products/"),
          axiosInstance.get("SupplyLocations/supply-locations"),
        ]);

        console.log(locationsResponse);

        // Validate and set products
        if (Array.isArray(productsResponse.data)) {
          setFetchProducts(productsResponse.data);
        } else {
          console.error("Products response data is not an array");
        }

        // Validate and set locations
        if (Array.isArray(locationsResponse.data)) {
          setFetchLocations(locationsResponse.data);
        } else {
          console.error("Locations response data is not an array");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);



  const handleSupplierChange = (e) => {
    const { name, files } = e.target;

    if (files) {
      console.log("Logo File Selected:", files[0]); // Log the selected file
      setSupplierDetails((prevDetails) => ({
        ...prevDetails,
        [name]: files[0], // Store the file object
      }));
    } else {
      setSupplierDetails((prevDetails) => ({
        ...prevDetails,
        [name]: e.target.value,
      }));
    }
  };

  // Handle change for product name and product code
  const handleProductChange = (productId, field, value) => {
    const updatedProducts = products.map((product) =>
      product._id === productId ? { ...product, [field]: value } : product
    );
    setProducts(updatedProducts);
  };

  // Handle change for product locations
  const handleLocationChange = (productId, index, field, value) => {
    const updatedLocations = [...productLocations[productId]];
    updatedLocations[index][field] = value;
    setProductLocations({ ...productLocations, [productId]: updatedLocations });
  };

  const handleBankChange = (index, field, value) => {
    console.log(
      `Updating index ${index}, field ${field}, with value: ${value}`
    );
    const updatedBanks = [...bank];
    updatedBanks[index][field] = value;
    setBank(updatedBanks);
  };

  // Handle change for contact details
  const handleContactChange = (index, field, value) => {
    const updatedContacts = [...contacts];
    updatedContacts[index][field] = value;
    setContacts(updatedContacts);
  };

  // Add a new location field for a product
  const addLocation = (productId) => {
    const updatedLocations = [
      ...productLocations[productId],
      { location: "", zipCode: "" },
    ];
    setProductLocations({ ...productLocations, [productId]: updatedLocations });
  };

  // Remove a location field for a product
  const removeLocation = (productId, index) => {
    const updatedLocations = [...productLocations[productId]];
    updatedLocations.splice(index, 1);
    setProductLocations({ ...productLocations, [productId]: updatedLocations });
  };

  // Add a new product dynamically
  const addProduct = () => {
    const newProductId = (products.length + 1).toString(); // Generate a new ID
    const newProduct = {
      _id: newProductId,
      productName: `Product ${newProductId}`,
      productCode: "",
    };

    setProducts([...products, newProduct]);
    setProductLocations({
      ...productLocations,
      [newProductId]: [{ location: "", zipCode: "" }],
    });
  };

  // Remove a product dynamically
  const removeProduct = (productId) => {
    const updatedProducts = products.filter(
      (product) => product._id !== productId
    );
    const updatedLocations = { ...productLocations };
    delete updatedLocations[productId];

    setProducts(updatedProducts);
    setProductLocations(updatedLocations);
  };

  // Add a new bankdetail
  const addBank = () => {
    setBank([
      ...bank,
      {
        accountName: "",
        productName: "",
        typeOfAccount: "",
        bankName: "",
        branchName: "",
        ifscCode: "",
        accountNumber: "",
        preNumber: "",
        middleNumber: "",
        postNumber: "",
        activeStatus: true,
      },
    ]);
  };

  // Remove a Bank detail
  const removeBank = (index) => {
    const updatedBanks = bank.filter((_, i) => i !== index);
    setBank(updatedBanks);
  };

  const options = ["SAP Code"]; // Sample options for the Autocomplete fields

  // Add a new contact detail
  const addContact = () => {
    setContacts([
      ...contacts,
      { contactName: "", phoneNumber: "", designation: "", email: "" },
    ]);
  };

  // Remove a contact detail
  const removeContact = (index) => {
    const updatedContacts = contacts.filter((_, i) => i !== index);
    setContacts(updatedContacts);
  };

  const handleSave = async () => {
    console.log("Supplier Details:", supplierDetails);
    // Log supplierDetails to check if logo is set correctly
    console.log("Logo File in SupplierDetails:", supplierDetails.supplierLogo);

    // Create FormData object for file upload
    const formData = new FormData();

    // Ensure the logo file is being appended with the correct field name
    if (supplierDetails.supplierLogo) {
      formData.append("supplierLogo", supplierDetails.supplierLogo); // Make sure the field name matches 'supplierLogo' in multer
    } else {
      console.error("No logo file found");
    }

    // Prepare the other data
    const dataToSend = {
      supplierName: supplierDetails.supplierName,
      legalName: supplierDetails.legalName,
      supplierEmail: supplierDetails.supplierEmail,
      supplierGstNumber: supplierDetails.supplierGstNumber,
      supplierPanNumber: supplierDetails.supplierPanNumber,
      products,
      productLocations,
      contacts,
      bankDetails: bank,
      activeStatus: true,
    };

    // Append the data as JSON string
    formData.append("data", JSON.stringify(dataToSend));

    console.log("FormData being sent:", formData);

    try {
      const response = await axiosInstance.post("supplier", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Important for file uploads
        },
      });

      console.log("Response from backend:", response);

      if (response.status >= 200 && response.status < 300) {
        alert("Supplier data saved successfully!");
        navigate("/supplier");
      } else {
        alert("Failed to save supplier data!");
      }
    } catch (error) {
      console.error(
        "Error saving supplier data:",
        error.response ? error.response.data : error
      );
      alert(
        `Error saving supplier data: ${
          error.response ? error.response.data : error.message
        }`
      );
    }
  };

  const handleCancel = () => {};

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
          Add Supplier
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
          / Add Supplier
        </Typography>
      </Box>

      {/* Supplier Details Section */}
      <Box
        sx={{
          background: "#fff",
          borderRadius: "20px",
          padding: "20px",
          marginTop: "30px",
        }}
      >
        <Typography
          className="fs-4"
          sx={{ marginBottom: "25px", fontWeight: "500" }}
        >
          Supplier Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Supplier Name"
              name="supplierName"
              value={supplierDetails.supplierName}
              onChange={handleSupplierChange}
              sx={{
                "& .MuiInputBase-input": {
                  textTransform: "uppercase",
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Supplier legal Name"
              name="legalName"
              value={supplierDetails.legalName}
              onChange={handleSupplierChange}
              sx={{
                "& .MuiInputBase-input": {
                  textTransform: "uppercase",
                },
              }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Supplier Email"
              name="supplierEmail"
              value={supplierDetails.supplierEmail}
              onChange={handleSupplierChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Supplier GST Number"
              name="supplierGstNumber"
              value={supplierDetails.supplierGstNumber}
              onChange={handleSupplierChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Supplier PAN Number"
              name="supplierPanNumber"
              value={supplierDetails.supplierPanNumber}
              onChange={handleSupplierChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ justifyContent: "flex-start", height: "55px" }}
            >
              {supplierDetails.supplierLogo?.name || "Upload Supplier Logo"}
              <input
                type="file"
                name="supplierLogo"
                hidden
                accept="image/*"
                onChange={handleSupplierChange}
              />
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Product and Locations Section */}
      <Box
        sx={{
          background: "#fff",
          borderRadius: "20px",
          padding: "20px",
          marginTop: "30px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            className="fs-4"
            sx={{ marginBottom: "25px", fontWeight: "500" }}
          >
            Products Details
          </Typography>

          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={addProduct}
            sx={{
              height: "40px",
              minWidth: "100px",
            }}
          >
            Add Product
          </Button>
        </Box>

        {products.map((product) => (
          <Box key={product._id} mb={2} p={2}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Product Name</InputLabel>
                  <Select
                    label="Product Name"
                    name="productName"
                    value={product.productName}
                    onChange={(e) =>
                      handleProductChange(
                        product._id,
                        "productName",
                        e.target.value
                      )
                    }
                    required
                  >
                    {fetchproducts.map((product, index) => (
                      <MenuItem key={index} value={product.productName}>
                        {product.productName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Product Code"
                  value={product.productCode}
                  onChange={(e) =>
                    handleProductChange(
                      product._id,
                      "productCode",
                      e.target.value
                    )
                  }
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={4}
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  // alignItems: "center",      // Optional: Align it vertically in case of varying heights
                }}
              >
                <IconButton
                  onClick={() => {
                    if (products.length > 1) {
                      removeProduct(product._id);
                    }
                  }}
                  sx={{
                    marginLeft: "8px",
                    backgroundColor: "#cf0202",
                    borderRadius: "50%",
                    width: "30px",
                    height: "30px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: products.length === 1 ? "#fff" : "#fff",
                    cursor: products.length === 1 ? "not-allowed" : "pointer",
                    pointerEvents: products.length === 1 ? "none" : "auto",
                    visibility: products.length === 1 ? "hidden" : "visible",
                    "&:hover": {
                      backgroundColor: "#cf0202",
                    },
                  }}
                >
                  <i className="bi bi-x"></i>
                </IconButton>
              </Grid>
            </Grid>

            {productLocations[product._id]?.map((loc, index) => (
              <Box key={index} mt={1}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <InputLabel>Location</InputLabel>
                      <Select
                        label="Location"
                        name="location"
                        value={loc.location}
                        onChange={(e) =>
                          handleLocationChange(
                            product._id,
                            index,
                            "location",
                            e.target.value
                          )
                        }
                        required
                      >
                        {fetchlocations.map((loc, index) => (
                          <MenuItem key={index} value={loc.LocationName}>
                            {loc.LocationName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Zip Code"
                      value={loc.zipCode}
                      onChange={(e) =>
                        handleLocationChange(
                          product._id,
                          index,
                          "zipCode",
                          e.target.value
                        )
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} sx={{ display: "flex" }}>
                    <IconButton
                      onClick={() => addLocation(product._id)}
                      sx={{
                        backgroundColor: "#4caf50",
                        marginRight: "5px",
                        borderRadius: "50%",
                        width: "30px",
                        height: "30px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: "#4caf50",
                        },
                      }}
                    >
                      <i className="bi bi-plus"></i>
                    </IconButton>

                    <IconButton
                      onClick={() => removeLocation(product._id, index)}
                      disabled={productLocations[product._id].length === 1}
                      sx={{
                        backgroundColor: "#cf0202",
                        borderRadius: "50%",
                        width: "30px",
                        height: "30px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: "#cf0202",
                        },
                      }}
                    >
                      <i className="bi bi-x"></i>
                    </IconButton>
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Box>
        ))}
      </Box>

      {/* Bank Details Section */}
      <Box
        sx={{
          background: "#fff",
          borderRadius: "20px",
          padding: "20px",
          marginTop: "30px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            className="fs-4"
            sx={{ marginBottom: "25px", fontWeight: "500" }}
          >
            Bank Details
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={addBank}
            sx={{
              height: "40px",
              minWidth: "100px",
            }}
          >
            Add Bank
          </Button>
        </Box>

        {bank.map((bankDetail, index) => (
          <Box
            key={index}
            p={2}
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Grid container spacing={2} sx={{ width: "98%" }}>
              {/* product Name */}
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Product Name"
                  value={bankDetail.productName}
                  onChange={(e) =>
                    handleBankChange(index, "productName", e.target.value)
                  }
                />
              </Grid>
              {/* Account Name */}
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Account name"
                  value={bankDetail.accountName}
                  onChange={(e) =>
                    handleBankChange(index, "accountName", e.target.value)
                  }
                />
              </Grid>

              {/* Nature of Account */}
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Nature of account</InputLabel>
                  <Select
                    label="Nature of account"
                    value={bankDetail.typeOfAccount}
                    onChange={(e) =>
                      handleBankChange(index, "typeOfAccount", e.target.value)
                    }
                  >
                    <MenuItem value="Saving">Saving</MenuItem>
                    <MenuItem value="Current">Current</MenuItem>
                    <MenuItem value="Loan">Loan</MenuItem>
                    <MenuItem value="RTGS Collection">RTGS Collection</MenuItem>
                    <MenuItem value="Deposit Account">Deposit Account</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Bank Name */}
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Bank name"
                  value={bankDetail.bankName}
                  onChange={(e) =>
                    handleBankChange(index, "bankName", e.target.value)
                  }
                />
              </Grid>

              {/* Branch Name */}
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Branch name"
                  value={bankDetail.branchName}
                  onChange={(e) =>
                    handleBankChange(index, "branchName", e.target.value)
                  }
                />
              </Grid>

              {/* IFSC Code */}
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="IFSC Code"
                  value={bankDetail.ifscCode}
                  onChange={(e) =>
                    handleBankChange(index, "ifscCode", e.target.value)
                  }
                />
              </Grid>

              {/* Supplier Bank Account Number */}
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Supplier bank account number"
                  value={bankDetail.accountNumber}
                  onChange={(e) =>
                    handleBankChange(index, "accountNumber", e.target.value)
                  }
                />
              </Grid>

              {/* Pre, Middle, and Post Numbers */}
              <Grid item xs={12} sm={4}>
                <Autocomplete
                  freeSolo
                  options={options}
                  value={bank[index]?.preNumber || ""}
                  onChange={
                    (_, newValue) =>
                      handleBankChange(index, "preNumber", newValue) // For dropdown selection
                  }
                  onInputChange={
                    (_, newInputValue) =>
                      handleBankChange(index, "preNumber", newInputValue) // For manual input
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Previous Number"
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Autocomplete
                  freeSolo
                  options={options}
                  value={bankDetail.middleNumber || ""}
                  onChange={(_, newValue) =>
                    handleBankChange(index, "middleNumber", newValue)
                  } // For dropdown selection
                  onInputChange={(_, newValue) =>
                    handleBankChange(index, "middleNumber", newValue)
                  } // For manual input
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Middle Number"
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Autocomplete
                  freeSolo
                  options={options}
                  value={bankDetail.postNumber || ""}
                  onChange={
                    (_, newValue) =>
                      handleBankChange(index, "postNumber", newValue) // Handles dropdown selection
                  }
                  onInputChange={
                    (_, newInputValue) =>
                      handleBankChange(index, "postNumber", newInputValue) // Handles manual input
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Post Number"
                      variant="outlined"
                    />
                  )}
                />
              </Grid>

              {/* Buttons */}
              <Grid item xs={12} sm={4} sx={{ display: "flex" }}>
                
                
              </Grid>
            </Grid>

            {/* Remove Button */}
            <Grid item xs={12} sm={12}>
              <IconButton
                onClick={() => bank.length > 1 && removeBank(index)}
                sx={{
                  backgroundColor: "#cf0202",
                  borderRadius: "50%",
                  width: "30px",
                  height: "30px",
                  display: bank.length === 1 ? "none" : "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  marginLeft: "16px",
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "#cf0202" },
                }}
              >
                <i className="bi bi-x"></i>
              </IconButton>
            </Grid>
          </Box>
        ))}
      </Box>

      {/* Contact Details Section */}
      <Box
        sx={{
          background: "#fff",
          borderRadius: "20px",
          padding: "20px",
          marginTop: "30px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            className="fs-4"
            sx={{ marginBottom: "25px", fontWeight: "500" }}
          >
            Contact Details
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={addContact}
            sx={{
              height: "40px",
              minWidth: "100px",
            }}
          >
            Add Contact
          </Button>
        </Box>

        {contacts.map((contact, index) => (
          <Box key={index} p={2}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box
                sx={{
                  display: "flex",
                  gap: 2, // Space between fields
                  flex: 1, // Ensures the fields occupy the maximum available space
                }}
              >
                <TextField
                  label="Contact Name"
                  value={contact.contactName}
                  onChange={(e) =>
                    handleContactChange(index, "contactName", e.target.value)
                  }
                  sx={{ flex: 1 }} // Allows the field to grow/shrink as needed
                />

                <TextField
                  label="Phone Number"
                  value={contact.phoneNumber}
                  onChange={(e) =>
                    handleContactChange(index, "phoneNumber", e.target.value)
                  }
                  sx={{ flex: 1 }}
                />

                <TextField
                  label="Designation"
                  value={contact.designation}
                  onChange={(e) =>
                    handleContactChange(index, "designation", e.target.value)
                  }
                  sx={{ flex: 1 }}
                />

                <TextField
                  label="Email ID"
                  value={contact.email}
                  onChange={(e) =>
                    handleContactChange(index, "email", e.target.value)
                  }
                  sx={{ flex: 1 }}
                />
              </Box>

              {/* Close Button on the Right */}
              <IconButton
                onClick={() => {
                  if (contacts.length > 1) {
                    removeContact(index);
                  }
                }}
                sx={{
                  backgroundColor: "#cf0202",
                  borderRadius: "50%",
                  width: "30px",
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  marginLeft: "16px", // Space between the fields and the button
                  cursor: contacts.length === 1 ? "not-allowed" : "pointer",
                  pointerEvents: contacts.length === 1 ? "none" : "auto",
                  visibility: contacts.length === 1 ? "hidden" : "visible",
                  "&:hover": {
                    backgroundColor: "#cf0202",
                  },
                }}
              >
                <i className="bi bi-x"></i>
              </IconButton>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Action Buttons */}
      <Box mt={3} display="flex" justifyContent="center" gap={2}>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
        <Button variant="outlined" color="error" onClick={handleCancel}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default AddSupplier;
