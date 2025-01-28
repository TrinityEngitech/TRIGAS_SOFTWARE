import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid"; // Install using `npm install uuid`
import {
  Tabs,
  Tab,
  Typography,
  Button,
  TextField,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  Chip,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ListItemText,
  Checkbox,
} from "@mui/material";
// import OutlinedInput from "@mui/material/OutlinedInput";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Add } from "@mui/icons-material";
import axios from "axios";
import _ from "lodash";
import axiosInstance from "../../Authentication/axiosConfig"; // Import the custom Axios instance

// import { FormControl, InputLabel, Select, MenuItem, OutlinedInput, Box, Chip } from '@mui/material';
import { useMediaQuery, useTheme } from "@mui/material";
import { useNavigate, Link, useParams } from "react-router-dom";

// import { Add } from "@mui/icons-material";
import { ArrowBack } from "@mui/icons-material";
import BusinessIcon from "@mui/icons-material/Business";
import PhoneIcon from "@mui/icons-material/Phone";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

function AddTransporter() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const navigate = useNavigate();

  const [suppliers, setSuppliers] = useState([]); // State to store supplier data
  // assocate supplier
  const [selectedSuppliers, setSelectedSuppliers] = useState([]);
  const [selectAllSuppliers, setSelectAllSuppliers] = useState(false);
  useEffect(() => {
    const fetchSuppliers = async () => {
      const response = await axiosInstance.get("/supplier"); 
      console.log(response.data || []);

      setSuppliers(response.data); // Set the data to state
    };

    fetchSuppliers(); // Call the function to fetch data
  }, []);
  console.log("suppliers", suppliers);

  const [product, setProduct] = useState([]); // State to store supplier data


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("/products/");
        console.log(response.data); // Check the structure of the response data
        
        if (Array.isArray(response.data)) {
          setProduct(response.data); // Set products if the response is an array
        } else {
          console.error("Received data is not an array");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
  
    fetchProducts(); // Call the async function
  }, []);
  

  // Track "Select All" state

  // // Mock Supplier Data
  const [teamDetails, setTeamDetails] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(""); // State to store the selected team
  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        const response = await axiosInstance.get(`/teams/`);
        setTeamDetails(response.data || []); // Set the response data to the state
      } catch (error) {
        console.error("Error fetching team details:", error);
      }
    };

    fetchTeamDetails();
  }, []); // Fetch when the `id` changes
  console.log(teamDetails);
  const [companies, setCompanies] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [selectAllCompanies, setSelectAllCompanies] = useState([]);
  console.log(companies);
  useEffect(() => {
    axiosInstance
      .get("/companies/")
      // .get("http://localhost:3000/api/companies/")
      .then((response) => {
        console.log(response.data); // Check the structure of the response data
        if (Array.isArray(response.data)) {
          setCompanies(response.data); // Set companies if the response is an array
        } else {
          console.error("Received data is not an array");
        }
      })
      .catch((error) => {
        console.error("Error fetching companies:", error);
      });
  }, []);
  const [transporter, setTransporter] = useState([]);
  const [selectedTransporter, setSelectedTransporter] = useState(""); // State for selected transporter
  console.log(transporter);
  useEffect(() => {
    axiosInstance
      .get("/transporters/")
      .then((response) => {
        console.log(response.data); // Check the structure of the response data
        if (Array.isArray(response.data)) {
          setTransporter(response.data); // Set companies if the response is an array
        } else {
          console.error("Received data is not an array");
        }
      })
      .catch((error) => {
        console.error("Error fetching driver:", error);
      });
  }, []);

  const { uuid } = useParams();
  // const { customerId } = useParams(); // Get the `customerId` from the URL
  const [customerDetails, setCustomerDetails] = useState(null);
  const [error, setError] = useState("");

  const [bankDetails, setBankDetails] = useState([]); // State to store bank details
  // const [sapDetails, setSapDetails] = useState([]);  // State to store bank details

  console.log(uuid);
  console.log("bankDetails", bankDetails);
  // console.log("sapDetails",sapDetails);

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        const response = await axiosInstance.get(
          `/customers/${uuid}`
        );
        setCustomerDetails(response.data); // Store customer details
        setBankDetails(response.data.bankDetails || []); // Store bankDetails
        // setSapDetails(response.data.sapCodesDetails || []);  // Store bankDetails
      } catch (err) {
        console.error("Error fetching customer details:", err);
        setError("Failed to fetch customer details. Please try again.");
      }
    };

    if (uuid) {
      fetchCustomerDetails();
    } else {
      setError("Customer UUID is missing.");
    }
  }, [uuid]);

  console.log("customerDetails", customerDetails);

  const [tabIndex, setTabIndex] = useState(0);
  const tabRoutes = [
    "Company-Details",
    "Contact-Details",
    "General-Details",
    "Sapcode-Details",
    "Bank-Details",
  ];

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
    navigate(`/add-customer/${tabRoutes[newValue]}/${formData.uuid}`);
  };
  useEffect(() => {
    // Generate UUID when the component mounts
    const newUuid = uuidv4();
    setFormData((prevData) => ({ ...prevData, uuid: newUuid }));
  }, []);
  // ---------------------------------------------------------------------------

  const [formData, setFormData] = useState({
    uuid: "",
    companyName: "",
    email: "",
    primaryPhoneNumber: "",
    secondaryPhoneNumber: "",
    address1: "",
    address2: "",
    state: "",
    district: "",
    city: "",
    zipcode: "",
    // associatedSupplier: "",
    team: "",
    typeOfCompany: "",
    licenseNumber: "",
    // ourCompany: "",
    tanNumber: "",
    gstNumber: "",
    panNumber: "",
    licenseValidTill: "",
    licenseCapacity: "",
    latitude: "",
    longitude: "",
    transporter: "",
    competitorSupplier: "",
  });

  const handleChange = (event, type) => {
    // const value = event.target.value;

    const { name, value } = event.target;
    if (type === "suppliers") {
      if (Array.isArray(value) && value.includes("all")) {
        if (selectAllSuppliers) {
          // Uncheck "Select All" -> Clear all selections for suppliers
          setSelectedSuppliers([]);
          setSelectAllSuppliers(false);
        } else {
          // Check "Select All" -> Select all suppliers
          setSelectedSuppliers(suppliers.map((supplier) => supplier.name)); // Assuming suppliers have a `name` field
          setSelectAllSuppliers(true);
        }
      } else {
        // Update selected suppliers
        setSelectedSuppliers(value);
        setSelectAllSuppliers(value.length === suppliers.length); // Update "Select All" state for suppliers
      }
    } else if (type === "companies") {
      if (Array.isArray(value) && value.includes("all")) {
        if (selectAllCompanies) {
          // Uncheck "Select All" -> Clear all selections for companies
          setSelectedCompanies([]);
          setSelectAllCompanies(false);
        } else {
          // Check "Select All" -> Select all companies
          setSelectedCompanies(companies.map((company) => company.companyName)); // Assuming companies have a `name` field
          setSelectAllCompanies(true);
        }
      } else {
        // Update selected companies
        setSelectedCompanies(value);
        setSelectAllCompanies(value.length === companies.length); // Update "Select All" state for companies
      }
    } else if (type === "team") {
      // Update selected team
      setSelectedTeam(value);
    } else if (type === "transporter") {
      // Update selected team
      setSelectedTransporter(value); // Update selected transporter state
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedFormData = {
      ...formData,
      licenseCapacity: formData.licenseCapacity
        ? parseFloat(formData.licenseCapacity)
        : null, // Convert to float or null
      latitude: formData.latitude ? parseFloat(formData.latitude) : null, // Convert to float or null
      longitude: formData.longitude ? parseFloat(formData.longitude) : null, // Convert to float or null
      associatedSuppliers: selectedSuppliers,
      ourCompanies: selectedCompanies,
      team: selectedTeam,
      transporter: selectedTransporter,
    };

    // Log updatedFormData before sending the API request
    console.log("Updated Form Data:", updatedFormData);

    try {
      const response = await axiosInstance.post(
        "/customers/createCustomerDetails",
        updatedFormData
      );
      console.log("Response:", response.data);
      alert("Customer details saved successfully!");
      navigate(`/add-customer/Contact-Details/${formData.uuid}`);
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      alert("Failed to save customer details.");
    }
  };

  useEffect(() => {
    const currentTab = tabRoutes.findIndex((route) =>
      location.pathname.includes(route)
    );
    if (currentTab !== -1) {
      setTabIndex(currentTab);
    }
  }, [location.pathname]);

  // State for contact details
  const [contacts, setContacts] = useState([
    { contactName: "", phoneNumber: "", role: "", remark: "" },
  ]);

  console.log(contacts);

  // Handle change for contact details
  const handleContactChange = (index, field, value) => {
    const updatedContacts = [...contacts];
    updatedContacts[index][field] = value;
    setContacts(updatedContacts);
  };
  // Add a new contact detail
  const addContact = () => {
    setContacts([
      ...contacts,
      { contactName: "", phoneNumber: "", role: "", remark: "" },
    ]);
  };
  // Remove a contact detail
  const removeContact = (index) => {
    const updatedContacts = contacts.filter((_, i) => i !== index);
    setContacts(updatedContacts);
  };

  const handleContactSave = async (e) => {
    e.preventDefault();

    // Prepare the payload with companyUuid and contact details
    const payload = {
      customerId: uuid, // Include the UUID here
      contacts: contacts.map((contact) => ({
        contactName: contact.contactName || "",
        role: contact.role || "",
        phoneNumber: contact.phoneNumber || "",
        commentRemark: contact.remark || "",
      })),
    };

    // Log the payload before sending to debug
    console.log("Payload to be sent to backend:", payload);

    try {
      // Send the payload to the backend
      const response = await axiosInstance.post(
        "/customers/customerContactDetails",
        payload
      );

      // Handle success response
      console.log("Response from backend:", response);
      alert("Contact details saved successfully!");
      navigate(`/add-customer/General-Details/${uuid}`); // Navigate to the next step
    } catch (error) {
      // Handle errors
      console.error("Error saving contact details:", error);
      alert("An error occurred while saving contact details.");
    }
  };

  const [generalDetalis, setgeneralDetalis] = useState({
    productSegment: "",
    noOfKiln: "",
    lengthOfKiln: "",
    dailyNaturalGasConsumption: "",
    dailyConsumption: "",
    hourlyConsumption: "",
    monthlyConsumption: "",
    startingStock: "",
    startingStockDateTime: "",
    newPurchase: "",
    newPurchaseDateTime: "",
    updatedTotalStock: "",
    remainingHoursOfStock: "",
  });

  // Handle form input change
  const handleChangeGeneralDetalis = (e) => {
    const { name, value } = e.target;
    setgeneralDetalis((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submit
  const handleSubmitGeneralDetalis = async (e) => {
    e.preventDefault();

    console.log("generalDetalis to be sent to backend:", generalDetalis);

    try {
      const response = await axiosInstance.post(
        "/customers/customerGeneralDetails",
        {
          customerId: uuid,
          ...generalDetalis, // Sending all the form data
        }
      );

      // Handle success (e.g., show success message)
      console.log("Response from backend:", response);
      alert("customerGeneralDetails saved successfully!");
      navigate(`/add-customer/Sapcode-Details/${uuid}`);
    } catch (error) {
      console.error("Error submitting form:", error);
      // Handle error (e.g., show error message)
    }
  };

  // State for SAP details
  // State for SAP details
  const [SAP, setSAP] = useState([
    {
      supplierId: "", // To store the unique identifier for the supplier
      supplierName: "", // To store the name of the supplier
      product:"", // To store the product name
      sapcode: "", // To store the SAP code
    },
  ]);

  console.log(SAP);

  const handleSAPChange = (index, field, value) => {
    const updatedSAP = [...SAP];
    
  if (field === "product") {
    updatedSAP[index].product = value.join(", "); // Convert selected products to a string
  } else
    if (field === "supplier") {
      const selectedSupplier = suppliers.find(
        (supplier) => supplier.id === value
      );
      updatedSAP[index].supplierId = selectedSupplier?.id || ""; // Set supplierId
      updatedSAP[index].supplierName = selectedSupplier?.legalName || ""; // Set supplierName
      updatedSAP[index].supplierLogo = selectedSupplier?.supplierLogo || ""; // Set supplierLogo
    } else {
      updatedSAP[index][field] = value;
    }
    setSAP(updatedSAP);
  };

  const handleSelectAll = (index, isChecked) => {
    const updatedSAP = [...SAP];
    updatedSAP[index].product = isChecked
      ? product.map((p) => p.productName).join(", ")  // Select all products
      : ""; // Deselect all products
    setSAP(updatedSAP);
  };


  // Add a new contact detail
  const addSAP = () => {
    setSAP([
      ...SAP,
      { supplierId: "", supplier: "", product: "", sapcode: "" },
    ]);
  };
  // Remove a contact detail
  const removeSAP = (index) => {
    const updatedSAP = SAP.filter((_, i) => i !== index);
    setSAP(updatedSAP);
  };

  const handleSAPSave = async (e) => {
    e.preventDefault();

    // Prepare the payload for customer SAP codes
    const payload = {
      customerId: uuid, // Include the UUID here
      sapCodesDetails: SAP.map((item) => ({
        supplierName: item.supplierName || "", // Ensure supplier name is passed
        productName: item.product || "", // Ensure product name is passed
        // productName: item.product.split(", ").filter((p) => p) || "",
        sapCode: item.sapcode || "", // Ensure SAP code is passed
      })),
    };

    // Prepare the payloads for creating multiple virtual accounts
    const virtualAccountPayloads = SAP.map((item) => ({
      customerId: uuid, // Same UUID for the customer
      customerName: customerDetails.companyName, // Correct customer name
      customerCode: item.sapcode || "", // Use the sapCode for this entry
      supplierId: item.supplierId || "", // Use the supplierId for this entry
      supplierName: item.supplierName || "", // Ensure supplierName is passed
      productName: item.product || "", // Ensure productName is passed
      // productName: item.product.split(", ").filter((p) => p) || "",
      sapCode: item.sapcode || "", // Ensure sapCode is passed
      supplierLogo: item.supplierLogo || "", // Ensure sapCode is passed
    }));

    // Log the prepared payloads before making API calls
    console.log("Payload for SAP codes:", payload);
    console.log("Virtual account payloads:", virtualAccountPayloads);

    try {
      // API call for customer SAP codes
      const sapCodesResponse = await fetch(
        "http://localhost:3000/api/customers/customerSAPCodesDetails",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!sapCodesResponse.ok) {
        throw new Error("Failed to save SAP Codes details");
      }

      const sapCodesResult = await sapCodesResponse.json();
      console.log("SAP Codes details saved successfully:", sapCodesResult);

      // API calls for virtual accounts (one for each SAP entry)
      const virtualAccountPromises = virtualAccountPayloads.map(
        (accountPayload) =>
          fetch("http://localhost:3000/api/customers/createVirtualAccount", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(accountPayload),
          })
      );

      // Resolve all virtual account API calls
      const virtualAccountResponses = await Promise.all(virtualAccountPromises);

      // Check for any errors in the virtual account responses
      for (const response of virtualAccountResponses) {
        if (!response.ok) {
          throw new Error("Failed to create one or more virtual accounts");
        }
      }

      console.log("All virtual accounts created successfully!");

      // Success alert
      alert("SAP codes and virtual accounts saved successfully!");
      navigate(`/add-customer/Bank-Details/${uuid}`);
    } catch (error) {
      console.error("Error saving data:", error.message);
      alert(
        "An error occurred while saving the data. Please check the console for details."
      );
    }
  };



  // Group bankDetails by supplierName
const groupedBankDetails = _.groupBy(bankDetails, "supplierName");

  return (
    <Box p={1}>
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
          Add Customer
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
          / Add Customer
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: isSmallScreen ? "column" : "row",
          minHeight: "100vh",
          height: "auto",
        }}
      >
        {!isSmallScreen && (
          <Box
            sx={{
              minWidth: "20%",
              borderRight: 1,
              borderColor: "divider",
              bgcolor: "background.paper",
            }}
          >
            <Tabs
              orientation="vertical"
              value={tabIndex}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab
                icon={<BusinessIcon />}
                iconPosition="start"
                label="Company Details"
                sx={{
                  justifyContent: "start",
                  textAlign: "start",

                  minHeight: "50px", // Set minimum height
                }}
              />
              <Tab
                icon={<PhoneIcon />}
                iconPosition="start"
                label="Contact Details"
                sx={{
                  justifyContent: "start",
                  textAlign: "start",
                  minHeight: "50px",
                }}
              />
              <Tab
                icon={<AssignmentIcon />}
                iconPosition="start"
                label="General Details"
                sx={{
                  justifyContent: "start",
                  textAlign: "start",
                  minHeight: "50px",
                }}
              />
              <Tab
                icon={<CheckCircleOutlineIcon />}
                iconPosition="start"
                label="SAP Codes"
                sx={{
                  justifyContent: "start",
                  textAlign: "start",
                  minHeight: "50px",
                }}
              />
              <Tab
                icon={<AccountBalanceIcon />}
                iconPosition="start"
                label="Bank Details"
                sx={{
                  justifyContent: "start",
                  textAlign: "start",
                  minHeight: "50px",
                }}
              />
            </Tabs>
          </Box>
        )}

        {/* Horizontal Tabs for Small Screens */}
        {isSmallScreen && (
          <Box sx={{ width: "100%", borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tabIndex}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="Company Details" />
              <Tab label="Contact Details" />
              <Tab label="General Details" />
              <Tab label="SAP Codes" />
              <Tab label="Bank Details" />
            </Tabs>
          </Box>
        )}

        {/* Tab Content */}
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Box
            sx={{
              background: "#fff",
              borderRadius: "8px",
              padding: "30px",
              marginTop: "-20px",
            }}
          >
            {/* compant Detalis */}
            {tabIndex === 0 && (
              <form onSubmit={handleSubmit}>
                <Typography
                  className="fs-4"
                  sx={{ marginBottom: "20px", fontWeight: "500" }}
                >
                  Company Details
                </Typography>
                <Grid container spacing={2}>
                  {/* 1 */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Company Name"
                      variant="outlined"
                      name="companyName"
                      type="text"
                      value={formData.companyName}
                      onChange={handleChange}
                      sx={{
                        "& .MuiInputBase-input": {
                          textTransform: "uppercase",
                        },
                      }}
                    />
                  </Grid>
                  {/* 2 */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      variant="outlined"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </Grid>
                  {/* 3 */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Primary Phone Number"
                      variant="outlined"
                      name="primaryPhoneNumber"
                      value={formData.primaryPhoneNumber}
                      onChange={handleChange}
                    />
                  </Grid>
                  {/* 4 */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Secondary Phone Number"
                      variant="outlined"
                      name="secondaryPhoneNumber"
                      value={formData.secondaryPhoneNumber}
                      onChange={handleChange}
                    />
                  </Grid>
                  {/* 5 */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Address 1"
                      variant="outlined"
                      name="address1"
                      value={formData.address1}
                      onChange={handleChange}
                    />
                  </Grid>
                  {/* 6 */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Address 2"
                      variant="outlined"
                      name="address2"
                      value={formData.address2}
                      onChange={handleChange}
                    />
                  </Grid>
                  {/* 7 */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="State"
                      variant="outlined"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                    />
                  </Grid>
                  {/* 8 */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="District"
                      variant="outlined"
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                    />
                  </Grid>
                  {/* 9 */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="City"
                      variant="outlined"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </Grid>
                  {/* 10 */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Zip Code"
                      variant="outlined"
                      name="zipcode"
                      value={formData.zipcode}
                      onChange={handleChange}
                    />
                  </Grid>
                  {/* 11 */}
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Associated Supplier</InputLabel>
                      <Select
                        label="Associated Supplier"
                        multiple
                        name="associatedSupplier"
                        value={selectedSuppliers}
                        onChange={(e) => handleChange(e, "suppliers")}
                        renderValue={(selected) => (
                          <Box
                            sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                          >
                            {selected.map((value) => (
                              <Chip key={value} label={value} />
                            ))}
                          </Box>
                        )}
                      >
                        <MenuItem value="all">
                          <Checkbox checked={selectAllSuppliers} />
                          <ListItemText primary="Select All" />
                        </MenuItem>
                        {suppliers.length > 0 ? (
                          suppliers.map((supplier) => (
                            <MenuItem key={supplier.id} value={supplier.name}>
                              <Checkbox
                                checked={
                                  selectedSuppliers.indexOf(supplier.name) > -1
                                }
                              />
                              <ListItemText primary={supplier.name} />
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem disabled>No Suppliers Available</MenuItem>
                        )}
                      </Select>
                    </FormControl>
                  </Grid>
                  {/* 12 */}
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel id="team-label">Team</InputLabel>
                      <Select
                        labelId="team-label"
                        value={selectedTeam}
                        name="team"
                        onChange={(e) => setSelectedTeam(e.target.value)}
                        label="Team" // Adding the label directly to the Select component
                      >
                        {teamDetails.length > 0 ? (
                          teamDetails.map((team) => (
                            <MenuItem key={team.id} value={team.teamName}>
                              {team.teamName}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem disabled>No Teams Available</MenuItem>
                        )}
                      </Select>
                    </FormControl>
                  </Grid>
                  {/* 13  */}
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Type of Company</InputLabel>
                      <Select
                        label="Type of Company"
                        value={formData.typeOfCompany}
                        onChange={handleChange}
                        name="typeOfCompany"
                        required
                      >
                        <MenuItem value="Partnership">Partnership</MenuItem>
                        <MenuItem value="LLP">LLP</MenuItem>
                        <MenuItem value="Limited">Limited</MenuItem>
                        <MenuItem value="Private Limited">
                          Private Limited
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  {/* 14 */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="License number"
                      variant="outlined"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                    />
                  </Grid>
                  {/* 15 */}
                  <Grid item xs={12} sm={6}>
  <FormControl fullWidth>
    <InputLabel>BA(Business Associated)</InputLabel>
    <Select
      label="BA(Business Associated)"
      multiple
      name="ourCompany"
      value={selectedCompanies}
      onChange={(e) => handleChange(e, "companies")}
      renderValue={(selected) => (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          {selected.length > 0 ? (
            selected.map((value) => (
              <Chip key={value} label={value} />
            ))
          ) : (
            <Chip label="No companies selected" color="default" />
          )}
        </Box>
      )}
    >
      {/* Select All Option */}
      <MenuItem value="all">
        <Checkbox checked={selectAllCompanies} />
        <ListItemText primary="Select All" />
      </MenuItem>

      {/* Company Options */}
      {companies.length > 0 ? (
        companies.map((company) => {
          const combinedValue = `${company.companyName} (${company.supplierName})`; // Combine companyName and supplierName

          return (
            <MenuItem key={company.id} value={combinedValue}>
              {/* <Checkbox
                checked={selectedCompanies.indexOf(combinedValue) > -1}
              /> */}
              <Checkbox
                checked={selectedCompanies.indexOf(combinedValue) > -1 || selectAllCompanies}
              />
              {/* Display companyName and supplierName */}
              <ListItemText primary={`${company.companyName} (${company.supplierName})`} />
            </MenuItem>
          );
        })
      ) : (
        <MenuItem disabled>No Companies Available</MenuItem>
      )}
    </Select>
  </FormControl>
</Grid>

                  {/* 16 */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="TAN Number"
                      variant="outlined"
                      name="tanNumber"
                      value={formData.tanNumber}
                      onChange={handleChange}
                    />
                  </Grid>
                  {/* 17 */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="GST Number"
                      variant="outlined"
                      value={formData.gstNumber}
                      onChange={handleChange}
                      name="gstNumber"
                    />
                  </Grid>
                  {/* 18 */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="PAN Number"
                      variant="outlined"
                      value={formData.panNumber}
                      onChange={handleChange}
                      name="panNumber"
                    />
                  </Grid>
                  {/* 19 */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="License Valid Till"
                      variant="outlined"
                      value={formData.licenseValidTill}
                      onChange={handleChange}
                      name="licenseValidTill"
                    />
                  </Grid>
                  {/* 20 */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="License Capacity"
                      variant="outlined"
                      value={formData.licenseCapacity}
                      onChange={handleChange}
                      name="licenseCapacity"
                    />
                  </Grid>
                  {/* 21 */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Latitude (HARDSTAND)"
                      value={formData.latitude}
                      onChange={handleChange}
                      variant="outlined"
                      name="latitude"
                    />
                  </Grid>
                  {/* 22 */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Longitude (HARDSTAND)"
                      value={formData.longitude}
                      onChange={handleChange}
                      variant="outlined"
                      name="longitude"
                    />
                  </Grid>
                  {/* 23 */}
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Transporter</InputLabel>
                      <Select
                        label="Transporter"
                        value={selectedTransporter}
                        name="transporter"
                        onChange={(e) => handleChange(e, "transporter")} // Update to call handleChange with "transporter"
                        required
                      >
                        {/* Default empty option */}
                        <MenuItem value="Other">
                          <em>Other</em>
                        </MenuItem>

                        {/* Transporter options dynamically generated from the fetched data */}
                        {transporter.length > 0 ? (
                          transporter.map((item) => (
                            <MenuItem
                              key={item.id}
                              value={item.transporterName}
                            >
                              {" "}
                              {/* Assuming `transporterName` is a field */}
                              {item.transporterName}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem disabled>
                            No Transporters Available
                          </MenuItem>
                        )}
                      </Select>
                    </FormControl>
                  </Grid>
                  {/* 24 */}
                  <Grid item xs={12} sm={6}>
                    {/* <TextField
                      fullWidth
                      label="Competitor"
                      variant="outlined"
                      name="competitorSupplier"
                      value={formData.competitorSupplier}
                      onChange={handleChange}
                    /> */}
                    <FormControl fullWidth>
                      <InputLabel>Competitor</InputLabel>
                      <Select
                        label="Competitor"
                        name="competitorSupplier"
                        value={formData.competitorSupplier}
                        onChange={handleChange}
                        required
                      >
                        <MenuItem value="Green Gas">Green Gas</MenuItem>
                        <MenuItem value="Green Energy">Green Energy</MenuItem>
                        <MenuItem value="KBC">KBC</MenuItem>
                        <MenuItem value="Direct">Direct</MenuItem>
                        <MenuItem value="Nilkanth Varni">
                          Nilkanth Varni
                        </MenuItem>
                        <MenuItem value="Uma fuels">Uma fuels</MenuItem>
                        <MenuItem value="Patidar">Patidar</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                        {/* <MenuItem value="District 2">District 2</MenuItem> */}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                {/* Action Buttons */}
                <Box>
                  <Box mt={3} display="flex" justifyContent="center" gap={2}>
                    <Button type="submit" variant="contained" color="primary">
                      Save
                    </Button>
                    <Button variant="outlined" color="error">
                      Cancel
                    </Button>
                  </Box>
                </Box>
              </form>
            )}
            {/* compant Detalis */}

            {/* Contact Detalis */}
            {tabIndex === 1 && (
              <form onSubmit={handleContactSave}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    className="fs-4"
                    sx={{ marginBottom: "20px", fontWeight: "500" }}
                  >
                    Contact Details
                  </Typography>
                  {/* <p>UUID: {uuid}</p> */}
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={addContact}
                    sx={{
                      height: "40px",
                      minWidth: "100px",
                      marginBottom: "20px",
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
                          name="contactName"
                          value={contact.contactName}
                          onChange={(e) =>
                            handleContactChange(
                              index,
                              "contactName",
                              e.target.value
                            )
                          }
                          sx={{ flex: 1 }} // Allows the field to grow/shrink as needed
                        />
                        <TextField
                          label="Phone Number"
                          name="phoneNumber"
                          value={contact.phoneNumber}
                          onChange={(e) =>
                            handleContactChange(
                              index,
                              "phoneNumber",
                              e.target.value
                            )
                          }
                          sx={{ flex: 1 }}
                        />

                        <TextField
                          label="Role"
                          // value={contact.role}
                          onChange={(e) =>
                            handleContactChange(index, "role", e.target.value)
                          }
                          sx={{ flex: 1 }}
                        />

                        <TextField
                          label="Remark"
                          value={contact.remark}
                          onChange={(e) =>
                            handleContactChange(index, "remark", e.target.value)
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
                          cursor:
                            contacts.length === 1 ? "not-allowed" : "pointer",
                          pointerEvents:
                            contacts.length === 1 ? "none" : "auto",
                          visibility:
                            contacts.length === 1 ? "hidden" : "visible",
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
                <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ mr: 2 }}
                  >
                    Save
                  </Button>
                  <Button variant="outlined" color="error">
                    Cancel
                  </Button>
                </Box>
              </form>
            )}
            {/* Contact Detalis */}

            {/* General Detalis  */}
            {tabIndex === 2 && (
              <form onSubmit={handleSubmitGeneralDetalis}>
                {/* Section: General Details */}
                <Typography
                  className="fs-4"
                  sx={{ marginBottom: "20px", fontWeight: "500" }}
                >
                  General Details
                </Typography>
                <Grid container spacing={2}>
                  {/* Product Segment */}
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Product Segment</InputLabel>
                      <Select
                        label="Product Segment"
                        name="productSegment"
                        value={generalDetalis.productSegment}
                        onChange={handleChangeGeneralDetalis}
                        required
                      >
                        <MenuItem value="Transporter 1">1</MenuItem>
                        <MenuItem value="Transporter 2">2</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* No. Kiln */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="No. Kiln"
                      variant="outlined"
                      type="text"
                      name="noOfKiln"
                      value={generalDetalis.noOfKiln}
                      onChange={handleChangeGeneralDetalis}
                      required
                    />
                  </Grid>

                  {/* Length of kiln */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Length of kiln (Meters)"
                      variant="outlined"
                      type="text"
                      name="lengthOfKiln"
                      value={generalDetalis.lengthOfKiln}
                      onChange={handleChangeGeneralDetalis}
                      required
                    />
                  </Grid>

                  {/* Daily Natural Gas Consumption */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Daily Natural Gas Consumption (Scm)"
                      variant="outlined"
                      type="text"
                      name="dailyNaturalGasConsumption"
                      value={generalDetalis.dailyNaturalGasConsumption}
                      onChange={handleChangeGeneralDetalis}
                    />
                  </Grid>

                  {/* Daily Consumption */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Daily Consumption (MT)"
                      variant="outlined"
                      type="text"
                      name="dailyConsumption"
                      value={generalDetalis.dailyConsumption}
                      onChange={handleChangeGeneralDetalis}
                    />
                  </Grid>

                  {/* Hourly Consumption */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Hourly Consumption (Kg)"
                      variant="outlined"
                      type="text"
                      name="hourlyConsumption"
                      value={generalDetalis.hourlyConsumption}
                      onChange={handleChangeGeneralDetalis}
                    />
                  </Grid>

                  {/* Monthly Consumption */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Monthly Consumption (MT)"
                      variant="outlined"
                      type="text"
                      name="monthlyConsumption"
                      value={generalDetalis.monthlyConsumption}
                      onChange={handleChangeGeneralDetalis}
                    />
                  </Grid>
                </Grid>

                {/* Section: Stock Details */}
                <Typography
                  className="fs-4"
                  sx={{ margin: "30px 0 20px", fontWeight: "500" }}
                >
                  Stock Details
                </Typography>
                <Grid container spacing={2}>
                  {/* Starting Stock */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Starting Stock (MT)"
                      variant="outlined"
                      type="text"
                      name="startingStock"
                      value={generalDetalis.startingStock}
                      onChange={handleChangeGeneralDetalis}
                    />
                  </Grid>

                  {/* Starting Stock Date and Time */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="datetime-local"
                      label="Starting Stock Date and Time"
                      name="startingStockDateTime"
                      value={generalDetalis.startingStockDateTime}
                      onChange={handleChangeGeneralDetalis}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>

                  {/* New Purchase */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="New Purchase (MT)"
                      variant="outlined"
                      type="text"
                      name="newPurchase"
                      value={generalDetalis.newPurchase}
                      onChange={handleChangeGeneralDetalis}
                    />
                  </Grid>

                  {/* New Purchase Date and Time */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="datetime-local"
                      label="New Purchase Date and Time"
                      name="newPurchaseDateTime"
                      value={generalDetalis.newPurchaseDateTime}
                      onChange={handleChangeGeneralDetalis}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>

                  {/* Updated Stock */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Total Stock"
                      variant="outlined"
                      type="text"
                      name="updatedTotalStock"
                      value={generalDetalis.updatedTotalStock}
                      onChange={handleChangeGeneralDetalis}
                    />
                  </Grid>

                  {/* Remaining Hours of Stock */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Remaining Hours of Stock"
                      variant="outlined"
                      type="text"
                      name="remainingHoursOfStock"
                      value={generalDetalis.remainingHoursOfStock}
                      onChange={handleChangeGeneralDetalis}
                    />
                  </Grid>
                </Grid>

                {/* Action Buttons */}
                <Box mt={3} display="flex" justifyContent="center" gap={2}>
                  <Button type="submit" variant="contained" color="primary">
                    Save
                  </Button>
                  <Button variant="outlined" color="error">
                    Cancel
                  </Button>
                </Box>
              </form>
            )}
            {/* General Detalis  */}

            {/* SAP code */}
            {tabIndex === 3 && (
              <form onSubmit={handleSAPSave}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    className="fs-4"
                    sx={{ marginBottom: "20px", fontWeight: "500" }}
                  >
                    SAP Codes Details
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={addSAP}
                    sx={{
                      height: "40px",
                      minWidth: "100px",
                      marginBottom: "20px",
                    }}
                  >
                    Add SAP
                  </Button>
                </Box>
                {SAP.map((SAPCode, index) => (
  <Box key={index} p={2}>
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
    >
      {/* Left Side Fields */}
      <Box
        sx={{
          display: "flex",
          gap: 2, // Space between fields
          flex: 1, // Ensures the fields occupy the maximum available space
        }}
      >
        {/* Supplier Name Field */}
        <FormControl sx={{ flex: 1 }}>
          <InputLabel>Supplier Name</InputLabel>
          <Select
            label="Supplier Name"
            value={SAPCode.supplierId || ""} // Use supplierId for the dropdown value
            onChange={(e) =>
              handleSAPChange(index, "supplier", e.target.value)
            } // Pass supplierId on change
          >
            {suppliers.map((supplier) => (
              <MenuItem key={supplier.id} value={supplier.id}>
                {supplier.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Product Name Field */}
        <FormControl sx={{ flex: 1 }}>
          <InputLabel>Product Name</InputLabel>
          <Select
            label="Product Name"
            multiple
            value={SAPCode.product.split(", ").filter((item) => item) || []}
            onChange={(e) =>
              handleSAPChange(index, "product", e.target.value)
            }
            renderValue={(selected) => selected.join(", ")} // Display selected products
          >
            <MenuItem>
              <Checkbox
                checked={
                  SAPCode.product.split(", ").filter((item) => item).length === product.length &&
                  product.length > 0
                }
                onChange={(e) => handleSelectAll(index, e.target.checked)}
              />
              <ListItemText primary="Select All" />
            </MenuItem>
            {product.map((p, idx) => (
              <MenuItem key={idx} value={p.productName}>
                <Checkbox checked={SAPCode.product.includes(p.productName)} />
                <ListItemText primary={p.productName} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* SAP Code Field */}
        <TextField
          label="SAP Code"
          value={SAPCode.sapcode}
          onChange={(e) =>
            handleSAPChange(index, "sapcode", e.target.value)
          }
          sx={{ flex: 1 }}
        />
      </Box>

      {/* Close Button on the Right */}
      <IconButton
        onClick={() => {
          if (SAP.length > 1) {
            removeSAP(index);
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
          marginLeft: "16px", // Space between fields and button
          cursor: SAP.length === 1 ? "not-allowed" : "pointer",
          pointerEvents: SAP.length === 1 ? "none" : "auto",
          visibility: SAP.length === 1 ? "hidden" : "visible",
          "&:hover": {
            backgroundColor: "#a80202",
          },
        }}
      >
        <i className="bi bi-x"></i>
      </IconButton>
    </Box>
  </Box>
))}

                <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ mr: 2 }}
                  >
                    Save
                  </Button>
                  <Button variant="outlined" color="error">
                    Cancel
                  </Button>
                </Box>
              </form>
            )}
            {/* SAP code */}

            {/* Bank Details */}
            {tabIndex === 4 && (
              <form action="">
                <Typography
                  className="fs-4"
                  sx={{ marginBottom: "20px", fontWeight: "500" }}
                >
                  Bank Details
                </Typography>
                {Object.keys(groupedBankDetails).map((supplierName, index) => (
      <Accordion key={index}>
        {/* Accordion Header */}
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            backgroundColor: "#f0f5fc",
            borderRadius: "4px 4px 0 0",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Typography>
              <strong>Supplier:</strong> {supplierName || "N/A"}
            </Typography>
          </Box>
        </AccordionSummary>

        {/* Accordion Content */}
        <AccordionDetails>
          {groupedBankDetails[supplierName].map((detail, detailIndex) => (
            <Box key={detailIndex} sx={{ marginBottom: "20px" }}>
              <Typography
                className="fs-5"
                sx={{ marginBottom: "10px", fontWeight: "500" }}
              >
                {detail.bankName || "N/A"}
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 2,
                }}
              >
                <TextField
                  label="Account Name"
                  variant="outlined"
                  type="text"
                  value={detail.accountName || ""}
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  label="Nature of Account"
                  variant="outlined"
                  type="text"
                  value={detail.natureOfAccount || ""}
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  label="Bank Name"
                  variant="outlined"
                  type="text"
                  value={detail.bankName || ""}
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  label="Branch Name"
                  variant="outlined"
                  type="text"
                  value={detail.branchName || ""}
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  label="IFSC Code"
                  variant="outlined"
                  type="text"
                  value={detail.ifscCode || ""}
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  label="Account Number"
                  variant="outlined"
                  type="text"
                  value={detail.accountNumber || ""}
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Box>
            </Box>
          ))}
        </AccordionDetails>
      </Accordion>
    ))}
              </form>
            )}
            {/* Bank Details */}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default AddTransporter;
