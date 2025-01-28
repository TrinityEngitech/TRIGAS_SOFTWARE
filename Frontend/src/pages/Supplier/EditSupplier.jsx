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
import { Add, Delete } from "@mui/icons-material";
import { useNavigate, Link, useParams } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import axios from "axios";
import AnimatedLogoLoader from "../../component/AnimatedLogoLoader";
import axiosInstance from "../../Authentication/axiosConfig";

const EditSupplier = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);

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
    { _id: "1", productName: "", productCode: "" },
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
        setLoading(true); 
        const [productsResponse, locationsResponse] = await Promise.all([
          axiosInstance.get("/products/"),
          axiosInstance.get(
            "/SupplyLocations/supply-locations"
          ),
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
      finally {
        setLoading(false); // Hide loader after fetch
      }
    };

    fetchData();
  }, []);

  // Handle change for supplier details
  // const handleSupplierChange = (e) => {
  //   const { name, value } = e.target;
  //   setSupplierDetails({ ...supplierDetails, [name]: value });
  // };

  const handleSupplierChange = (e) => {
    const { name, files } = e.target;
  
    if (files) {
      console.log("Logo File Selected:", files[0]);  // Log the selected file
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

  useEffect(() => {
    if (!id) {
      console.log("No supplier id provided");
      return; // If no id is passed, we can return early.
    }

    // Fetch supplier data when the component loads
    axiosInstance
      .get(`/supplier/${id}`)
      .then((response) => {
        const data = response.data;

        // Check if data exists
        if (!data) {
          console.error("Data not found");
          return;
        }

        console.log("Fetched Data:", data); // Log the fetched data to the console

        // Set the supplier details state
        setSupplierDetails({
          supplierName: data.name,
          legalName: data.legalName,
          supplierEmail: data.email,
          supplierGstNumber: data.gstNumber,
          supplierPanNumber: data.panNumber,
          supplierLogo: data.supplierLogo,
        });

        // Format products and set state
        const formattedProducts =
          data.products?.map((product) => ({
            _id: product.id || "",
            productName: product.name || "",
            productCode: product.code || "",
            locations:
              product.locations?.map((location) => ({
                locationName: location.location || "",
                zipCode: location.zipCode || "",
              })) || [],
          })) || [];

        setProducts(formattedProducts);

        // Initialize product locations state
        const initialProductLocations = formattedProducts.reduce(
          (acc, product) => {
            acc[product._id] = product.locations.map((loc) => ({
              location: loc.locationName || "",
              zipCode: loc.zipCode || "",
            })) || [{ location: "", zipCode: "" }];
            return acc;
          },
          {}
        );

        setProductLocations(initialProductLocations);

        // Set the bank details, fallback to empty array if not available
        setBank(data.bankDetails || []);

        // Set the contacts, fallback to empty array if not available
        // Format contacts and set state
        const formattedContacts =
          data.contacts?.map((contact) => ({
            contactName: contact.name || "", // Map `name` to `contactName`
            phoneNumber: contact.phoneNumber || "",
            designation: contact.designation || "",
            email: contact.email || "",
          })) || [];

        setContacts(formattedContacts);
      })
      .catch((error) => {
        console.error("Error fetching supplier data:", error);
      });
  }, [id]); // Effect depends on the `id`

  // const handleSave = async () => {
  //   setLoading(true);
  //   console.log("Supplier Details:", supplierDetails);
  //   console.log("Products:", products);
  //   console.log("Product Locations:", productLocations);
  //   console.log("Contacts:", contacts);
  //   console.log("Bank Details:", bank);

  //   const dataToSend = {
  //     supplierName: supplierDetails.supplierName,
  //     legalName: supplierDetails.legalName,
  //     supplierEmail: supplierDetails.supplierEmail,
  //     supplierGstNumber: supplierDetails.supplierGstNumber,
  //     supplierPanNumber: supplierDetails.supplierPanNumber,
  //     products: products,
  //     productLocations: productLocations,
  //     contacts: contacts,
  //     bankDetails: bank,
  //     activeStatus: true,
  //   };

  //   console.log("Data to be sent to the backend:", dataToSend);

  //   try {
  //     // Assuming you are editing an existing supplier, use the supplier ID to update it.
  //     const supplierId = id; // Ensure the supplier ID is available for editing

  //     // PUT request to update the supplier data
  //     const response = await axios.put(
  //       `http://localhost:3000/api/supplier/${supplierId}`,
  //       dataToSend
  //     );

  //     console.log("Response from backend:", response);

  //     if (response.status >= 200 && response.status < 300) {
  //       alert("Data updated successfully!");
  //       navigate("/supplier"); // Redirect to supplier list or details page
  //     } else {
  //       alert("Failed to update data!");
  //     }
  //   } catch (error) {
  //     console.error(
  //       "Error updating data:",
  //       error.response ? error.response.data : error
  //     );
  //     alert(
  //       `Error updating data: ${
  //         error.response ? error.response.data : error.message
  //       }`
  //     );
  //   }finally {
  //     setLoading(false); // Hide loader after save
  //   }
  // };


  const handleSave = async () => {
    setLoading(true);

    console.log("Supplier Details:", supplierDetails);
    console.log("Products:", products);
    console.log("Product Locations:", productLocations);
    console.log("Contacts:", contacts);
    console.log("Bank Details:", bank);

    // Create FormData object for file and data
    const formData = new FormData();

    // Append the logo file if it exists
    if (supplierDetails.supplierLogo) {
        formData.append("supplierLogo", supplierDetails.supplierLogo); // Field name must match backend
    }

    // Prepare the rest of the data
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

    // Append JSON data to FormData
    formData.append("data", JSON.stringify(dataToSend));

    console.log("FormData being sent:", formData);

    try {
        // Ensure the supplier ID is available for updating
        const supplierId = id; // Replace `id` with the actual supplier ID variable

        // Send a PUT request to update the supplier
        const response = await axiosInstance.put(
            `/supplier/${supplierId}`, // Backend URL for updating
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data", // Important for file uploads
                },
            }
        );

        console.log("Response from backend:", response);

        if (response.status >= 200 && response.status < 300) {
            alert("Data updated successfully!");
            navigate("/supplier"); // Redirect to the supplier page
        } else {
            alert("Failed to update data!");
        }
    } catch (error) {
        console.error(
            "Error updating data:",
            error.response ? error.response.data : error
        );
        alert(
            `Error updating data: ${
                error.response ? error.response.data : error.message
            }`
        );
    } finally {
        setLoading(false); // Hide loader after save
    }
};


  const handleCancel = () => {};
  if (loading) {
    return <AnimatedLogoLoader />;
  }
  

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
          Edit Supplier
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
          / Edit Supplier
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
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Supplier legal Name"
              name="legalName"
              value={supplierDetails.legalName}
              onChange={handleSupplierChange}
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
              sx={{ justifyContent: "flex-start",height:"55px" }}
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
          Update
        </Button>
        <Button variant="outlined" color="error" onClick={handleCancel}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default EditSupplier;
