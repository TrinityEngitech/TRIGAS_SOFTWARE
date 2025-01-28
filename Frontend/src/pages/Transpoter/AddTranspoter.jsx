import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid"; // Import uuid library

import {
  Box,
  Tabs,
  Tab,
  TextField,
  Button,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  IconButton,
} from "@mui/material";

import { useNavigate, Link, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { Add } from "@mui/icons-material";
import { ArrowBack } from "@mui/icons-material";
import BusinessIcon from "@mui/icons-material/Business";
import PhoneIcon from "@mui/icons-material/Phone";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import DescriptionIcon from "@mui/icons-material/Description";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import axiosInstance from "../../Authentication/axiosConfig";

const AddTransporter = () => {
  // responsive
  
  const [tabIndex, setTabIndex] = useState(0);
  const tabRoutes = [
    "Company-Details",
    "Contact-Details",
    "Vehicle-Details",
    "Document-Details",
    "Bank-Details",
  ];

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
    navigate(`/add-transporter/${tabRoutes[newValue]}/${formData.uuid}`);
  };

  const { uuid } = useParams(); // Extract UUID from the URL
  useEffect(() => {
    // Generate UUID when the component mounts
    const newUuid = uuidv4();
    setFormData((prevData) => ({ ...prevData, uuid: newUuid }));
  }, []);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    uuid: "",
    transporterName: "",
    email: "",
    address1: "",
    address2: "",
    district: "",
    state: "",
    city: "",
    zipCode: "",
    typeOfCompany: "",
    panNumber: "",
    gstNumber: "",
  });
  // console.log("UUID:", uuid);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form refresh

    console.log("UUID:", formData.uuid); // Log UUID for debugging

    try {
      // Send data to the backend
      const response = await axiosInstance.post(
        "/transporters/createTransporterCompany/",
        formData
      );

      alert("Transporter company created successfully!");
      console.log(response);

      // Navigate to the contact details page with the UUID
      navigate(`/add-transporter/Contact-Details/${formData.uuid}`);
    } catch (error) {
      console.error("Error creating transporter company:", error);
      alert("An error occurred while creating the transporter company.");
    }
  };

  const location = useLocation();

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
    { contactName: "", role: "", phoneNumber: "", email: "" },
  ]);
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
      { contactName: "", role: "", phoneNumber: "", email: "" },
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
      companyUuid: uuid, // Include the UUID here
      contacts: contacts.map((contact) => ({
        uuid: contact.uuid || "", // Ensure each contact has a UUID (or empty string if not available)
        contactName: contact.contactName || "",
        role: contact.role || "",
        phoneNumber: contact.phoneNumber || "",
        email: contact.email || "",
      })),
    };

    // Log the payload before sending to debug
    console.log("Payload to be sent to backend:", payload);

    try {
      // Send the payload to the backend
      const response = await axiosInstance.post(
        "/transporters/saveContactDetails/",
        payload
      );

      // Handle success response
      console.log("Response from backend:", response);
      alert("Contact details saved successfully!");
      navigate(`/add-transporter/Vehicle-Details/${uuid}`); // Navigate to the next step
    } catch (error) {
      // Handle errors
      console.error("Error saving contact details:", error);
      alert("An error occurred while saving contact details.");
    }
  };

  const [fetchproducts, setFetchProducts] = useState([]);
  const [fetchdrivers, setFetchDrivers] = useState([]);

  console.log(fetchproducts);
  console.log(fetchdrivers);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, driversResponse] = await Promise.all([
          axiosInstance.get("/products/"),
          axiosInstance.get("/drivers/"),
        ]);

        console.log(driversResponse);

        // Validate and set products
        if (Array.isArray(productsResponse.data)) {
          setFetchProducts(productsResponse.data);
        } else {
          console.error("Products response data is not an array");
        }

        // Validate and set locations
        if (Array.isArray(driversResponse.data)) {
          setFetchDrivers(driversResponse.data);
        } else {
          console.error("drivers response data is not an array");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // State for tanker details
  const [tanker, setTanker] = useState([
    {
      tankerNumber: "",
      licenseCapacity: "",
      driverName: "",
      product: "",
      grossWeight: "",
      tareWeight: "",
      chassisNumber: "",
      engineNumber: "",
      numberOfAxle: "",
    },
  ]);
  // Handle change for tanker details
  const handleTankerChange = (index, field, value) => {
    const updatedTanker = [...tanker];
    updatedTanker[index][field] = value;
    setTanker(updatedTanker);
  };
  // Add a new tankerdetail
  const addTanker = () => {
    setTanker([
      ...tanker,
      {
        tankerNumber: "",
        licenseCapacity: "",
        driverName: "",
        product: "",
        grossWeight: "",
        tareWeight: "",
        chassisNumber: "",
        engineNumber: "",
        numberOfAxle: "",
      },
    ]);
  };
  // Remove a tanker detail
  const removeTanker = (index) => {
    const updatedTanker = tanker.filter((_, i) => i !== index);
    setTanker(updatedTanker);
  };

  const handleTankerSave = async (event) => {
    event.preventDefault(); // Prevent form submission reload

    // Prepare the payload in the desired format
    const payload = {
      companyUuid: uuid,
      tankerDetailsArray: tanker.map((tankerDetail) => ({
        tankerNumber: tankerDetail.tankerNumber,
        licenseCapacity: tankerDetail.licenseCapacity,
        driverName: tankerDetail.driverName,
        product: tankerDetail.product,
        grossWeight: parseFloat(tankerDetail.grossWeight), // Ensure correct data type
        tareWeight: parseFloat(tankerDetail.tareWeight), // Ensure correct data type
        chassisNumber: tankerDetail.chassisNumber,
        engineNumber: tankerDetail.engineNumber,
        numberOfAxle: tankerDetail.numberOfAxle,
      })),
    };

    try {
      // Send the payload to the backend via POST request
      const response = await axiosInstance.post(
        "/transporters/saveTankerDetails",
        payload
      );

      // Log the response for successful save
      console.log("Response from backend:", response);

      if (response.status === 201) {
        alert("Tanker details saved successfully!");

        navigate(`/add-transporter/Document-Details/${uuid}`);
      } else {
        alert("Error: Unable to save tanker details.");
      }
    } catch (error) {
      // Log detailed error information for debugging
      console.error("Error saving tanker details:", error);
      if (error.response) {
        console.error("Backend Error Response:", error.response);
        alert(
          `Error: ${error.response.data.message || "Something went wrong!"}`
        );
      } else if (error.request) {
        console.error("Error with request:", error.request);
        alert("Network error: Failed to send request.");
      } else {
        console.error("Unknown error:", error.message);
        alert("An unknown error occurred while saving tanker details.");
      }
    }
  };

  const [tankerNumberss, setTankerNumberss] = useState([]);

  useEffect(() => {
    const fetchTankerData = async () => {
      try {
        const response = await axiosInstance.get(
          `/transporters/${uuid}`
        );
        const tankers = response.data.tankers || [];
        const tankerNumbersList = tankers.map((tanker) => ({
          id: tanker.id,
          label: tanker.tankerNumber,
        }));
        setTankerNumberss(tankerNumbersList);
      } catch (error) {
        console.error("Error fetching tanker data:", error);
      }
    };

    fetchTankerData(); // Fetch data on component mount/update
  }, [uuid]); // Re-run if `uuid` changes

  console.log("setTankerNumberss", tankerNumberss);

  // State for Document details
  const [document, setDocument] = useState([
    {
      tankerNumber: "",
      documentType: "",
      validFrom: "",
      validUpto: "",
      documentFile: "",
    },
  ]);

  const documentValidityPeriods = {
    "PUC (Pollution Under Control)": ["6 months", "1 year"], // 6 months, 1 year
    Insurance: 12, // 1 year
    "CLL (Carriers Legal Liability)": 12, // 1 year
    "Road Tax": ["3 months", "6 months", "1 year", "lifetime"],
    Permit: ["5 years", "8 years"], // 5 years, 8 years (in months)
    "Fitness Certificate (Rule 62)": ["1 year", "2 years"], // 1 year, 2 years
    GPS: 12, // 1 year
    "RC Book (Registration Certificate)": "lifetime", // Lifetime validity
    "Rule 18": 12, // 1 year
    "Rule 9 (PESO Licence)": [
      "1 year",
      "2 years",
      "3 years",
      "4 years",
      "5 years",
    ], // 1 to 5 years (in months)
    "COC (Rule 13)": "lifetime", // Lifetime validity
    "Rule 43": "lifetime", // Lifetime validity
    "Rule 19": 60, // 5 year
    "Mounting Drawing": "lifetime", // Lifetime validity
    "Fabrication Drawing": "lifetime", // Lifetime validity
    "Fire Extinguisher": 12, // 1 year
  };

  const handleDocumentChangee = (index, field, value) => {
    if (index < 0 || index >= document.length) {
      console.warn("Invalid document index.");
      return;
    }

    const updatedDocuments = [...document];
    updatedDocuments[index] = {
      ...updatedDocuments[index],
      [field]: value, // Save the selected tanker's ID
    };

    setDocument(updatedDocuments);
  };

  const handleDocumentChange = (index, field, value) => {
    const updatedDocuments = [...document];
    const documentToUpdate = updatedDocuments[index];

    documentToUpdate[field] = value;

    const validity = documentValidityPeriods[documentToUpdate.documentType];

    // Handle "documentType" change
    if (field === "documentType") {
      if (
        [
          "PUC (Pollution Under Control)",
          "Fitness Certificate (Rule 62)",
          "Permit",
          "Rule 9 (PESO Licence)",
          "Road Tax",
        ].includes(value)
      ) {
        documentToUpdate.validityPeriod = ""; // Reset validity period for dropdown selection
        documentToUpdate.validUpto = ""; // Reset `validUpto`
      } else if (typeof validity === "number" && documentToUpdate.validFrom) {
        const validFromDate = new Date(documentToUpdate.validFrom);
        if (!isNaN(validFromDate.getTime())) {
          validFromDate.setMonth(validFromDate.getMonth() + validity);
          documentToUpdate.validUpto = validFromDate
            .toISOString()
            .split("T")[0];
        } else {
          console.warn(
            "Invalid 'validFrom' date for documentType calculation."
          );
        }
      } else {
        documentToUpdate.validUpto = "2999-12-31"; // Default for "lifetime"
      }
    }

    // Handle "validFrom" change
    if (field === "validFrom" && documentToUpdate.documentType) {
      if (typeof validity === "number") {
        const validFromDate = new Date(value);
        if (!isNaN(validFromDate.getTime())) {
          validFromDate.setMonth(validFromDate.getMonth() + validity);
          documentToUpdate.validUpto = validFromDate
            .toISOString()
            .split("T")[0];
        } else {
          console.warn("Invalid 'validFrom' date.");
          documentToUpdate.validUpto = ""; // Clear invalid date
        }
      }
    }

    // Handle validity period dropdown selection
    if (field === "validityPeriod") {
      if (value === "lifetime") {
        documentToUpdate.validUpto = "2999-12-31";
      } else {
        const validFromDate = new Date(documentToUpdate.validFrom);
        if (!isNaN(validFromDate.getTime())) {
          const [amount, unit] = value.split(" ");
          if (unit === "months") {
            validFromDate.setMonth(
              validFromDate.getMonth() + parseInt(amount, 10)
            );
          } else if (unit === "year" || unit === "years") {
            validFromDate.setFullYear(
              validFromDate.getFullYear() + parseInt(amount, 10)
            );
          }
          documentToUpdate.validUpto = validFromDate
            .toISOString()
            .split("T")[0];
        } else {
          console.warn(
            "Invalid 'validFrom' date for validityPeriod calculation."
          );
        }
      }
    }

    setDocument(updatedDocuments);
  };

  // Add a new bankdetail
  const addDocument = () => {
    setDocument([
      ...document,
      {
        tankerNumber: "",
        documentType: "",
        validFrom: "",
        validUpto: "",
        documentFile: "",
      },
    ]);
  };
  // Remove a Bank detail
  const removeDocument = (index) => {
    const updatedDocuments = document.filter((_, i) => i !== index);
    setDocument(updatedDocuments);
  };

  const handleDocumentSave = async (event) => {
    event.preventDefault(); // Prevent form submission reload

    try {
      const formData = new FormData();

      // Assuming `document` is an array of objects
      document.forEach((doc, index) => {
        if (doc.documentFile) {
          formData.append(
            `tankerDocumentsDetailsArray[${index}][tankerId]`,
            doc.tankerNumber
          ); // Assuming tankerNumber maps to tankerId
          formData.append(
            `tankerDocumentsDetailsArray[${index}][documentType]`,
            doc.documentType
          );
          formData.append(
            `tankerDocumentsDetailsArray[${index}][validFrom]`,
            doc.validFrom
          );
          formData.append(
            `tankerDocumentsDetailsArray[${index}][validUpto]`,
            doc.validUpto
          );
          formData.append(`documents`, doc.documentFile); // Ensure `documents` matches the backend field for the file
        } else {
          console.error(`Missing file for document at index ${index}`);
        }
      });

      // Log the FormData content
      console.log("FormData content:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value); // Logs each key-value pair
      }

      // Send data to the backend
      const response = await fetch(
        "http://localhost:3000/api/transporters/saveTankerDocumentsDetails",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        console.log("Successfully uploaded:", responseData);
        alert("Documents uploaded successfully!");
        navigate(`/add-transporter/Bank-Details/${uuid}`);

      } else {
        console.error("Failed to upload documents:", response.statusText);
        alert("Failed to upload documents.");
      }
    } catch (error) {
      console.error("Error processing documents:", error);
      alert("An unexpected error occurred while uploading the documents.");
    }
  };

  // Handle form submission
  const handleBankSave = async (e) => {
    e.preventDefault();
  
    // Prepare the payload with companyUuid and bank details
    const payload = {
      companyUuid: uuid, // Pass the company UUID dynamically
      bankDetails: bank.map((bankDetail) => ({
        accountName: bankDetail.accountName || "",
        natureOfAccount: bankDetail.typeOfAccount || "", // Ensure a fallback if typeOfAccount is missing
        bankName: bankDetail.bankName || "",
        branchName: bankDetail.branchName || "",
        ifscCode: bankDetail.ifscCode || "",
        accountNumber: bankDetail.accountNumber || "",
      })),
    };
  
    // Log the payload before sending to debug
    console.log("Payload to be sent to backend:", payload);
  
    try {
      // Send the payload to the backend
      const response = await axiosInstance.post(
        "/transporters/saveBankDetails", // Replace with your API endpoint
        payload
      );
  
      // Handle success response
      console.log("Response from backend:", response);
      alert("Bank details saved successfully!");
  
      // Redirect to the next step if necessary
      navigate(`/transporter`); // Adjust the next step as needed
    } catch (error) {
      // Handle errors
      console.error("Error saving bank details:", error);
      alert("Failed to save bank details. Please try again.");
    }
  };
  

  const [bank, setBank] = useState([
    {
      accountName: "",
      typeOfAccount: "",
      bankName: "",
      branchName: "",
      ifscCode: "",
      accountNumber: "",
    },
  ]);
  // Handle change for bank details
  const handleBankChange = (index, field, value) => {
    const updatedBanks = [...bank];
    updatedBanks[index][field] = value;
    setBank(updatedBanks);
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
      },
    ]);
  };
  // Remove a Bank detail
  const removeBank = (index) => {
    const updatedBanks = bank.filter((_, i) => i !== index);
    setBank(updatedBanks);
  };

  return (
    <>
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
            Add Transporter
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
            / Add Transporter
          </Typography>
        </Box>

        <Box sx={{ display: "flex", height: "100vh" }}>
          {/* Sidebar Tabs */}
          
          <Box
            sx={{
              minWidth: "20%",
              borderRight: 1,
              borderColor: "divider",
              bgcolor: "#fff",
            }}
          >
            <Tabs
              orientation="vertical"
              value={tabIndex}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              sx={{ marginTop: "10px" }}
            >
              <Tab
                icon={<BusinessIcon />}
                iconPosition="start"
                label="Company Details"
                sx={{
                  justifyContent: "start",
                  textAlign: "start",
                  // padding: "8px 12px",
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
                icon={<DirectionsCarIcon />}
                iconPosition="start"
                label="Vehicle Details"
                sx={{
                  justifyContent: "start",
                  textAlign: "start",
                  minHeight: "50px",
                }}
              />
              <Tab
                icon={<DescriptionIcon />}
                iconPosition="start"
                label="Document Details"
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

          {/* Content Section */}
          <Box sx={{ flexGrow: 1, p: 3 }}>
            {/* Render Company Details */}
            <Box
              sx={{
                background: "#fff",
                borderRadius: "0px",
                padding: "30px",
                marginTop: "-20px",
              }}
            >
              {tabIndex === 0 && (
                <form onSubmit={handleSubmit}>
                  <Typography
                    className="fs-4"
                    sx={{ marginBottom: "20px", fontWeight: "500" }}
                  >
                    Company Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Transporter Company Name"
                        variant="outlined"
                        name="transporterName"
                        value={formData.transporterName}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Address Street 1"
                        variant="outlined"
                        name="address1"
                        value={formData.address1}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Address Street 2"
                        variant="outlined"
                        name="address2"
                        value={formData.address2}
                        onChange={handleChange}
                      />
                    </Grid>
                   
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>State</InputLabel>
                        <Select
                          label="State"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                        >
                          <MenuItem value="Gujarat">Gujarat</MenuItem>
                          <MenuItem value="Rajsthan">Rajsthan</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>district</InputLabel>
                        <Select
                          label="district"
                          name="district"
                          value={formData.district}
                          onChange={handleChange}
                        >
                          <MenuItem value="Rajkot">Rajkot</MenuItem>
                          <MenuItem value="Junagadh">Junagadh</MenuItem>
                          <MenuItem value="Morbi">Morbi</MenuItem>
                          <MenuItem value="Ahmedabad">Ahmedabad</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="City"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Zip Code"
                        variant="outlined"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Type of Company</InputLabel>
                        <Select
                          label="Type of Company"
                          name="typeOfCompany"
                          value={formData.typeOfCompany}
                          onChange={handleChange}
                        >
                          <MenuItem value="Partnership">Partnership</MenuItem>
                          <MenuItem value="LLP">LLP</MenuItem>
                          <MenuItem value="Limited">Limited</MenuItem>
                          <MenuItem value="privateLimited">
                            Private Limited
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="PAN Number"
                        variant="outlined"
                        name="panNumber"
                        value={formData.panNumber}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="GST Number"
                        variant="outlined"
                        name="gstNumber"
                        value={formData.gstNumber}
                        onChange={handleChange}
                      />
                    </Grid>
                  </Grid>

                  <Box
                    sx={{ mt: 2, display: "flex", justifyContent: "center" }}
                  >
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

              {/* Render Contact Details */}
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
                          <FormControl fullWidth sx={{ flex: 1 }}>
                            <InputLabel>Role</InputLabel>
                            <Select
                              label="Role"
                              value={contact.role}
                              onChange={(e) =>
                                handleContactChange(
                                  index,
                                  "role",
                                  e.target.value
                                )
                              }
                              name="role"
                              required
                            >
                              <MenuItem value="Owner">Owner</MenuItem>
                              <MenuItem value="Manager1">Manager1</MenuItem>
                              <MenuItem value="Manager2">Manager2</MenuItem>
                            </Select>
                          </FormControl>
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
                            label="Email ID"
                            value={contact.email}
                            onChange={(e) =>
                              handleContactChange(
                                index,
                                "email",
                                e.target.value
                              )
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
                  <Box
                    sx={{ mt: 2, display: "flex", justifyContent: "center" }}
                  >
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

              {/* Render Vehicle Details */}
              {tabIndex === 2 && (
                <form onSubmit={handleTankerSave}>
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
                      Tanker Details
                    </Typography>
                    {/* {uuid} */}
                    <Button
                      variant="outlined"
                      startIcon={<Add />}
                      onClick={addTanker}
                      sx={{
                        height: "40px",
                        minWidth: "100px",
                        marginBottom: "20px",
                      }}
                    >
                      Add Tanker
                    </Button>
                  </Box>

                  {tanker.map((tankerDetail, index) => (
                    <Box
                      key={index}
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Grid
                        container
                        spacing={2}
                        sx={{ width: "98%", marginBottom: "30px" }}
                      >
                        {/* Add all the form fields like tankerNumber, licenseCapacity, driverName, etc. */}
                        {/* Same as your original form fields */}

                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            label="Tanker Number"
                            value={tankerDetail.tankerNumber}
                            onChange={(e) =>
                              handleTankerChange(
                                index,
                                "tankerNumber",
                                e.target.value
                              )
                            }
                            name="tankerNumber"
                            required
                          />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            label="License Capacity(Tons)"
                            value={tankerDetail.licenseCapacity}
                            onChange={(e) =>
                              handleTankerChange(
                                index,
                                "licenseCapacity",
                                e.target.value
                              )
                            }
                            name="licenseCapacity"
                            required
                          />
                        </Grid>

                        {/* More fields for Driver, Product, Gross Weight, Tare Weight, etc. */}

                        <Grid item xs={12} sm={4}>
                          <FormControl fullWidth>
                            <InputLabel>Driver</InputLabel>
                            <Select
                              label="Driver"
                              value={tankerDetail.driverName}
                              onChange={(e) =>
                                handleTankerChange(
                                  index,
                                  "driverName",
                                  e.target.value
                                )
                              }
                              name="driverName"
                              required
                            >
                              {fetchdrivers.map((drivers, index) => (
                                <MenuItem key={index} value={drivers.name}>
                                  {drivers.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                          <FormControl fullWidth>
                            <InputLabel>Product</InputLabel>
                            <Select
                              label="Product Name"
                              value={tankerDetail.product}
                              onChange={(e) =>
                                handleTankerChange(
                                  index,
                                  "product",
                                  e.target.value
                                )
                              }
                              name="product"
                              required
                            >
                              <MenuItem value="propane">Propane</MenuItem>
                              {/* {fetchproducts.map((product, index) => (
                                <MenuItem
                                  key={index}
                                  value={product.productName}
                                >
                                  {product.productName}
                                </MenuItem>
                              ))} */}
                            </Select>
                          </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            label="Laden/Gross Weight"
                            value={tankerDetail.grossWeight}
                            onChange={(e) =>
                              handleTankerChange(
                                index,
                                "grossWeight",
                                e.target.value
                              )
                            }
                            name="grossWeight"
                            required
                          />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            label="UnLaden/Tare Weight"
                            value={tankerDetail.tareWeight}
                            onChange={(e) =>
                              handleTankerChange(
                                index,
                                "tareWeight",
                                e.target.value
                              )
                            }
                            name="tareWeight"
                            required
                          />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            label="Chassis Number"
                            value={tankerDetail.chassisNumber}
                            onChange={(e) =>
                              handleTankerChange(
                                index,
                                "chassisNumber",
                                e.target.value
                              )
                            }
                            name="chassisNumber"
                            required
                          />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            label="Engine Number"
                            value={tankerDetail.engineNumber}
                            onChange={(e) =>
                              handleTankerChange(
                                index,
                                "engineNumber",
                                e.target.value
                              )
                            }
                            name="engineNumber"
                            required
                          />
                        </Grid>

                        {/* Other fields */}

                        <Grid item xs={12} sm={4}>
                          <FormControl fullWidth>
                            <InputLabel>Number of Axle</InputLabel>
                            <Select
                              label="Number of Axle"
                              value={tankerDetail.numberOfAxle}
                              onChange={(e) =>
                                handleTankerChange(
                                  index,
                                  "numberOfAxle",
                                  e.target.value
                                )
                              }
                              name="numberOfAxle"
                              required
                            >
                              <MenuItem value="2">2</MenuItem>
                              <MenuItem value="3">3</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                      </Grid>

                      {/* Close Button on the Right */}
                      <Grid item xs={12} sm={12}>
                        <IconButton
                          onClick={() => {
                            if (tanker.length > 1) {
                              removeTanker(index); // Only remove if there's more than one entry
                            }
                          }}
                          sx={{
                            backgroundColor: "#cf0202",
                            borderRadius: "50%",
                            width: "30px",
                            height: "30px",
                            display: tanker.length === 1 ? "none" : "flex", // Hide button when there's only one entry
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            marginLeft: "16px", // Space between the fields and the button
                            cursor: "pointer", // Always pointer when visible
                            "&:hover": {
                              backgroundColor: "#cf0202",
                            },
                          }}
                        >
                          <i className="bi bi-x"></i>
                        </IconButton>
                      </Grid>
                    </Box>
                  ))}

                  <Box
                    sx={{
                      mt: 1,
                      mb: 2,
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Button
                      variant="contained"
                      type="submit"
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

              {/* Render Document Details */}
              {tabIndex === 3 && (
                <form onSubmit={handleDocumentSave}>
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
                      Document Details
                    </Typography>
                    {/* {uuid} */}
                    <Button
                      variant="outlined"
                      startIcon={<Add />}
                      onClick={addDocument}
                      sx={{
                        height: "40px",
                        minWidth: "100px",
                        marginBottom: "20px",
                      }}
                    >
                      Add Document
                    </Button>
                  </Box>

                  {document.map((documents, index) => (
                    <Box
                      key={index}
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Grid container spacing={2} sx={{ marginBottom: "30px" }}>
                        <Grid item xs={12} sm={4}>
                          <FormControl fullWidth>
                            <InputLabel>Tanker Number</InputLabel>
                            <Select
                              label="Tanker Number"
                              value={document[index]?.tankerNumber || ""} // Display selected tanker's ID
                              onChange={(e) =>
                                handleDocumentChangee(
                                  index,
                                  "tankerNumber",
                                  e.target.value
                                )
                              } // Save ID
                              name="tankerNumber"
                              required
                              onBlur={async () => {
                                try {
                                  // Fetch updated data on blur
                                  const response = await axios.get(
                                    `http://localhost:3000/api/transporters/${uuid}`
                                  );
                                  const tankers = response.data.tankers || [];
                                  const tankerNumbersList = tankers.map(
                                    (tanker) => ({
                                      id: tanker.id,
                                      label: tanker.tankerNumber,
                                    })
                                  );
                                  setTankerNumberss(tankerNumbersList); // Update the options
                                } catch (error) {
                                  console.error(
                                    "Error fetching tanker data on blur:",
                                    error
                                  );
                                }
                              }}
                            >
                              {tankerNumberss.map((tanker) => (
                                <MenuItem key={tanker.id} value={tanker.id}>
                                  {tanker.label} {/* Display the name/label */}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                          <FormControl fullWidth sx={{ flex: 1 }}>
                            <InputLabel>Document Type</InputLabel>
                            <Select
                              label="Document Type"
                              name="documentType"
                              value={documents.documentType || ""} // Add optional chaining to avoid undefined errors
                              onChange={(e) =>
                                handleDocumentChange(
                                  index,
                                  "documentType",
                                  e.target.value
                                )
                              } // Update with the correct index
                            >
                              {Object.keys(documentValidityPeriods).map(
                                (type) => (
                                  <MenuItem key={type} value={type}>
                                    {type}
                                  </MenuItem>
                                )
                              )}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            label="Valid From"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            name="validFrom"
                            value={documents.validFrom || ""}
                            onChange={(e) =>
                              handleDocumentChange(
                                index,
                                "validFrom",
                                e.target.value
                              )
                            }
                          />
                        </Grid>

                        {documentValidityPeriods[documents.documentType] &&
                          Array.isArray(
                            documentValidityPeriods[documents.documentType]
                          ) && (
                            <Grid item xs={12} sm={4}>
                              <FormControl fullWidth sx={{ flex: 1 }}>
                                <InputLabel>Validity Period</InputLabel>
                                <Select
                                  label="Validity Period"
                                  name="validityPeriod"
                                  value={documents.validityPeriod || ""}
                                  onChange={(e) =>
                                    handleDocumentChange(
                                      index,
                                      "validityPeriod",
                                      e.target.value
                                    )
                                  }
                                >
                                  {documentValidityPeriods[
                                    documents.documentType
                                  ].map((option) => (
                                    <MenuItem key={option} value={option}>
                                      {option}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Grid>
                          )}

                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            label="Valid Upto"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            name="validUpto"
                            value={documents.validUpto || ""}
                            onChange={(e) =>
                              handleDocumentChange(
                                index,
                                "validUpto",
                                e.target.value
                              )
                            }
                            InputProps={{
                              readOnly: true,
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            type="file"
                            label="Document"
                            InputLabelProps={{
                              shrink: true, // Keeps the label visible when a file is selected
                            }}
                            name="documents"
                            onChange={(e) =>
                              handleDocumentChange(
                                index,
                                "documentFile",
                                e.target.files[0]
                              )
                            } // Use e.target.files[0] for File object
                          />
                        </Grid>
                      </Grid>

                      {/* Close Button on the Right */}
                      <Grid item xs={12} sm={12}>
                        <IconButton
                          onClick={() => {
                            if (document.length > 1) {
                              removeDocument(index); // Only remove if there's more than one bank entry
                            }
                          }}
                          sx={{
                            backgroundColor: "#cf0202",
                            borderRadius: "50%",
                            width: "30px",
                            height: "30px",
                            display: document.length === 1 ? "none" : "flex", // Hide button when there's only one bank entry
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            marginLeft: "16px", // Space between the fields and the button
                            cursor: "pointer", // Always pointer when visible
                            "&:hover": {
                              backgroundColor: "#cf0202",
                            },
                          }}
                        >
                          <i className="bi bi-x"></i>
                        </IconButton>
                      </Grid>
                    </Box>
                  ))}
                  <Box
                    sx={{ mt: 2, display: "flex", justifyContent: "center" }}
                  >
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

              {/* Render Bank Details */}
              {tabIndex === 4 && (
                <form onSubmit={handleBankSave}>
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
                      Bank Details
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<Add />}
                      onClick={addBank}
                      sx={{
                        height: "40px",
                        minWidth: "100px",
                        marginBottom: "20px",
                      }}
                    >
                      Add Bank
                    </Button>
                  </Box>

                  {bank.map((bankDetail, index) => (
                    <Box
                      key={index}
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Grid
                        container
                        spacing={2}
                        sx={{ width: "98%", marginBottom: "30px" }}
                      >
                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            label="Account name"
                            name="accountName"
                            value={bankDetail.accountName}
                            onChange={(e) =>
                              handleBankChange(
                                index,
                                "accountName",
                                e.target.value
                              )
                            }
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <FormControl fullWidth>
                            <InputLabel>Nature of account</InputLabel>
                            <Select
                              label="Nature of account"
                              name="typeOfAccount"
                              value={bankDetail.typeOfAccount}
                              onChange={(e) =>
                                handleBankChange(
                                  index,
                                  "typeOfAccount",
                                  e.target.value
                                )
                              }
                              required
                            >
                              <MenuItem value="Saving">Saving</MenuItem>
                              <MenuItem value="Current">Current</MenuItem>
                              <MenuItem value="Loan">Loan</MenuItem>
                              <MenuItem value="RTGS Collection">
                                RTGS Collection
                              </MenuItem>
                              <MenuItem value="Deposit Account">
                                Deposit Account
                              </MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            label="Bank name"
                            name="bankName"
                            value={bankDetail.bankName}
                            onChange={(e) =>
                              handleBankChange(
                                index,
                                "bankName",
                                e.target.value
                              )
                            }
                          />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            label="Branch name"
                            name="branchName"
                            value={bankDetail.branchName}
                            onChange={(e) =>
                              handleBankChange(
                                index,
                                "branchName",
                                e.target.value
                              )
                            }
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            label="IFSC Code"
                            name="ifscCode"
                            value={bankDetail.ifscCode}
                            onChange={(e) =>
                              handleBankChange(
                                index,
                                "ifscCode",
                                e.target.value
                              )
                            }
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            label="Transporter bank account number"
                            name="accountNumber"
                            value={bankDetail.accountNumber}
                            onChange={(e) =>
                              handleBankChange(
                                index,
                                "accountNumber",
                                e.target.value
                              )
                            }
                          />
                        </Grid>
                      </Grid>

                      {/* Close Button on the Right */}
                      <Grid item xs={12} sm={12}>
                        <IconButton
                          onClick={() => {
                            if (bank.length > 1) {
                              removeBank(index); // Only remove if there's more than one bank entry
                            }
                          }}
                          sx={{
                            backgroundColor: "#cf0202",
                            borderRadius: "50%",
                            width: "30px",
                            height: "30px",
                            display: bank.length === 1 ? "none" : "flex", // Hide button when there's only one bank entry
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            marginLeft: "16px", // Space between the fields and the button
                            cursor: "pointer", // Always pointer when visible
                            "&:hover": {
                              backgroundColor: "#cf0202",
                            },
                          }}
                        >
                          <i className="bi bi-x"></i>
                        </IconButton>
                      </Grid>
                    </Box>
                  ))}
                  <Box
                    sx={{ mt: 2, display: "flex", justifyContent: "center" }}
                  >
                    <Button type="submit" variant="contained" color="primary" sx={{ mr: 2 }}>
                      Save
                    </Button>
                    <Button variant="outlined" color="error">
                      Cancel
                    </Button>
                  </Box>
                </form>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default AddTransporter;
