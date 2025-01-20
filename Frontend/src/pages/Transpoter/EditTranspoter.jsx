import { useState, useEffect } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
} from "@mui/material";
import { useNavigate, Link, useParams } from "react-router-dom";
import axios from "axios";
import { FaEye } from "react-icons/fa";
import { Add, Delete } from "@mui/icons-material";
import { ArrowBack } from "@mui/icons-material";
import BusinessIcon from "@mui/icons-material/Business";
import PhoneIcon from "@mui/icons-material/Phone";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import DescriptionIcon from "@mui/icons-material/Description";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

const EditTranspoter = () => {
  const navigate = useNavigate();
  const [tabIndex, setTabIndex] = useState(0);

  // Handle tab change
  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  const { id } = useParams(); // Extract the ID from the URL
  const [data, setData] = useState(null); // State to store fetched data

  const [loading, setLoading] = useState(true);

  // State for Document details
  const [document, setDocument] = useState([
    {
      tankerNumber: "",
      documentType: "",
      validFrom: "",
      vaidUpto: "",
      documentFile: "",
    },
  ]);

  // State for tanker details
  const [tanker, setTanker] = useState([
    {
      tankerNumber: "",
      capacity: "",
      driverName: "",
      product: "",
      grossWeight: "",
      tareWeight: "",
      chassisNumber: "",
      engineNumber: "",
      numberOfAxle: "",
    },
  ]);
  const [documentData, setDocumentData] = useState([
    {
      tankerNumber: "",
      documentType: "",
      validFrom: "",
      vaidUpto: "",
      documentFile: "",
    },
  ]);

 

  // Pagination State

  const [documentrowsPerPage, setdocumentRowsPerPage] = useState(5);

  // const [tankerTable, setTankerTable] = useState(initialTankers);

  // Pagination State
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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

  const [bank, setBank] = useState([
    {
      accountName: "",
      natureOfAccount: "",
      bankName: "",
      branchName: "",
      ifscCode: "",
      accountNumber: "",
    },
  ]);
  // Handle change for bank details
  const handleBankChange = (index, field, value) => {
    const updatedBankData = [...bank];
    updatedBankData[index][field] = value;
    setBank(updatedBankData);
  };

  // Add a new bankdetail
  const addBank = () => {
    setBank([
      ...bank,
      {
        accountName: "",
        natureOfAccount: "",
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
  const [fetchproducts, setFetchProducts] = useState([]);
  const [fetchdrivers, setFetchDrivers] = useState([]);

  console.log(fetchproducts);
  console.log(fetchdrivers);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, driversResponse] = await Promise.all([
          axios.get("http://localhost:3000/api/products/"),
          axios.get("http://localhost:3000/api/drivers/"),
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


  const [tankerData, setTankerData] = useState([
    {
      tankerNumber: "",
      capacity: "",
      driverName: "",
      product: "",
      grossWeight: "",
      tareWeight: "",
      chassisNumber: "",
      engineNumber: "",
      numberOfAxle: "",
    },
  ]);

  useEffect(() => {
    // Fetch data from API
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/transporters/transporterId/${id}`
        ); // Replace with your API endpoint
        setData(response.data); // Set the fetched data
        console.log(response.data);
        if (response.data.contacts && response.data.contacts.length > 0) {
          setContacts(
            response.data.contacts.map((contact) => ({
              contactName: contact.contactName || "",
              role: contact.role || "",
              phoneNumber: contact.phoneNumber || "",
              email: contact.email || "",
            }))
          );
        }

        if (response.data.tankers && response.data.tankers.length > 0) {
          setTankerData(response.data.tankers); // Assuming tankers is the key for tanker details in the response
        }
        console.log("tankerData", tankerData);

        if (response.data.tankers && response.data.tankers.length > 0) {
          const allDocuments = response.data.tankers.flatMap((tanker) =>
            tanker.documents.map((doc) => ({
              id: doc.id, // Assuming 'id' is the unique identifier for each document
              tankerNumber: tanker.tankerNumber,
              documentType: doc.documentType,
              validFrom: doc.validFrom,
              validUpto: doc.validUpto,
              documentFile: doc.documentFile,
            }))
          );
          setDocumentData(allDocuments);
        }

        console.log("documentData", documentData);

        if (response.data.bankDetails && response.data.bankDetails.length > 0) {
          setBank(
            response.data.bankDetails.map((bank) => ({
              accountName: bank.accountName || "",
              natureOfAccount: bank.natureOfAccount || "",
              bankName: bank.bankName || "",
              branchName: bank.branchName || "",
              ifscCode: bank.ifscCode || "",
              accountNumber: bank.accountNumber || "",
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Set loading to false once fetch is complete
      }
    };

    fetchData();
  }, [id]);

  console.log(data);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // Update the company details via PUT request
      const response = await axios.put(
        `http://localhost:3000/api/transporters/transporterCompany/${id}`,
        data
      );
      console.log("Company updated:", response.data);
      // navigate(`/edit-transporter/Contact-Details/${id}`);
      setTabIndex(1);
    } catch (error) {
      console.error("Error updating company:", error);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!data) {
    return <Typography>No data available.</Typography>;
  }

  console.log("Company ID:", id); // Log companyId to check if it's being retrieved

  const handlecontactupdate = async (e) => {
    e.preventDefault();

    if (!id) {
      console.error("Company ID is missing");
      alert("Company ID is missing");
      return;
    }

    // Log the structured data to ensure it matches the expected format
    const payload = {
      contacts: contacts.map((contact) => ({
        contactName: contact.contactName,
        role: contact.role,
        phoneNumber: contact.phoneNumber,
        email: contact.email,
      })),
    };

    console.log("Payload being sent to backend:", payload);

    try {
      const response = await axios.put(
        `http://localhost:3000/api/transporters/transporterCompany/${id}/contact`,
        payload
      );
      console.log("Contacts updated successfully:", response.data);
      alert("Contacts updated successfully!");
      setTabIndex(2); // Assuming you want to switch tabs after success
    } catch (error) {
      console.error("Error updating contacts:", error);
      alert("Failed to update contacts.");
    }
  };

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
        capacity: "",
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
      companyUuid: data.uuid,
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
      const response = await axios.post(
        "http://localhost:3000/api/transporters/saveTankerDetails",
        payload
      );

      // Log the response for successful save
      console.log("Response from backend:", response);

      if (response.status === 201) {
        alert("Tanker details saved successfully!");
        setTabIndex(3); // Assuming you want to switch tabs after success

        // navigate(`/add-transporter/Document-Details/${uuid}`);
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

  const handleDelete = async (tankerId) => {
    console.log(tankerId);
  
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this tanker?"
      );
      if (!confirmDelete) return;
  
      const response = await axios.delete(
        `http://localhost:3000/api/transporters/deleteTanker/${tankerId}`
      );
  
      if (response.status === 200) {
        alert("Tanker deleted successfully!");
        // Dynamically update the tanker list state
        setTankerData((prevList) => prevList.filter((tanker) => tanker.id !== tankerId));
        setTabIndex(3)
      } else {
        alert("Failed to delete the tanker. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting tanker:", error);
      alert("Failed to delete the tanker. Please try again.");
    }
  };
  



  // Pagination Handlers
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Paginated Data
  // const paginatedTankers = tankerTable.slice(
  //   page * rowsPerPage,
  //   page * rowsPerPage + rowsPerPage
  // );

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

    // Default value for validUpto if not already set
    if (!documentToUpdate.validUpto) {
      documentToUpdate.validUpto =
        typeof validity === "number" && documentToUpdate.validFrom
          ? (() => {
              const validFromDate = new Date(documentToUpdate.validFrom);
              validFromDate.setMonth(validFromDate.getMonth() + validity);
              return validFromDate.toISOString().split("T")[0];
            })()
          : "2999-12-31"; // Default for lifetime or missing validFrom
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
        vaidUpto: "",
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
        // navigate(`/add-transporter/Bank-Details/${uuid}`);
        setTabIndex(4); // Assuming you want to switch tabs after success
      } else {
        console.error("Failed to upload documents:", response.statusText);
        alert("Failed to upload documents.");
      }
    } catch (error) {
      console.error("Error processing documents:", error);
      alert("An unexpected error occurred while uploading the documents.");
    }
  };

  const handledocumentDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/tankers/documents/${id}`
      );

      if (response.status === 200) {
        alert("Document deleted successfully");

        // Dynamically update the state to remove the deleted document
        setDocumentData((prevList) => prevList.filter((doc) => doc.id !== id));
      } else {
        alert("Failed to delete the document. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting document:", error);
      alert("Failed to delete the document.");
    }
  };

  // Pagination Handlers
  const documenthandleChangePage = (event, newPage) => setPage(newPage);
  const documenthandleChangeRowsPerPage = (event) => {
    setdocumentRowsPerPage(parseInt(event.target.value, 10));
    // setdocumentPage(0);
  };

  // Paginated Data
  // const paginatedDocument = documentTable.slice(
  //   documentpage * documentrowsPerPage,
  //   documentpage * documentrowsPerPage + documentrowsPerPage
  // );

  const handleBankUpdate = async (e) => {
    e.preventDefault();

    if (!id) {
      console.error("Company ID is missing");
      alert("Company ID is missing");
      return;
    }

    // Log the structured data to ensure it matches the expected format
    const payload = {
      bankDetails: bank.map((bank) => ({
        accountName: bank.accountName,
        natureOfAccount: bank.natureOfAccount,
        bankName: bank.bankName,
        branchName: bank.branchName,
        ifscCode: bank.ifscCode,
        accountNumber: bank.accountNumber,
      })),
    };

    console.log("Payload being sent to backend:", payload);

    try {
      const response = await axios.put(
        `http://localhost:3000/api/transporters/transporterCompany/${id}/bank`,
        payload
      );
      console.log("Bank details updated successfully:", response.data);
      alert("Bank details updated successfully!");
      navigate("/transporter"); // Assuming you want to switch tabs after success
    } catch (error) {
      console.error("Error updating bank details:", error);
      alert("Failed to update bank details.");
    }
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
            Edit Transporter
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
            / Edit Transporter
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
                <form onSubmit={handleUpdate}>
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
                        value={data.transporterName || ""}
                        onChange={(e) =>
                          setData({ ...data, transporterName: e.target.value })
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        value={data.email || ""}
                        onChange={(e) =>
                          setData({ ...data, email: e.target.value })
                        }
                        name="email"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Address Street 1"
                        variant="outlined"
                        name="address1"
                        value={data.address1 || ""}
                        onChange={(e) =>
                          setData({ ...data, address1: e.target.value })
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        name="address2"
                        label="Address Street 2"
                        variant="outlined"
                        value={data.address2 || ""}
                        onChange={(e) =>
                          setData({ ...data, address2: e.target.value })
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>State</InputLabel>
                        <Select
                          label="State"
                          name="state"
                          value={data.state || ""}
                          onChange={(e) =>
                            setData({ ...data, state: e.target.value })
                          }
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
                          name="district"
                          label="district"
                          value={data.district || ""}
                          onChange={(e) =>
                            setData({ ...data, district: e.target.value })
                          }
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
                        name="city"
                        value={data.city || ""}
                        onChange={(e) =>
                          setData({ ...data, city: e.target.value })
                        }
                        fullWidth
                        label="City"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        name="zipcode"
                        label="Zip Code"
                        variant="outlined"
                        value={data.zipCode || ""}
                        onChange={(e) =>
                          setData({ ...data, zipCode: e.target.value })
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Type of Company</InputLabel>
                        <Select
                          name="typeOfCompany"
                          value={data.typeOfCompany || ""}
                          onChange={(e) =>
                            setData({ ...data, typeOfCompany: e.target.value })
                          }
                          label="Type of Company"
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
                        value={data.panNumber || ""}
                        onChange={(e) =>
                          setData({ ...data, panNumber: e.target.value })
                        }
                        name="panNumber"
                        label="PAN Number"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        name="gstNumber"
                        label="GST Number"
                        variant="outlined"
                        value={data.gstNumber || ""}
                        onChange={(e) =>
                          setData({ ...data, gstNumber: e.target.value })
                        }
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
                      Update
                    </Button>
                    <Button variant="outlined" color="error">
                      Cancel
                    </Button>
                  </Box>
                </form>
              )}

              {/* Render Contact Details */}
              {tabIndex === 1 && (
                <form onSubmit={handlecontactupdate}>
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
                            value={contact.phoneNumber}
                            name="phoneNumber"
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
                            name="email"
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
                      Update
                    </Button>
                    <Button variant="outlined" color="error">
                      Cancel
                    </Button>
                  </Box>
                </form>
              )}

              {/* Render Vehicle Details */}
              {tabIndex === 2 && (
                // <form >
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
                              {/* <MenuItem value="propane">Propane</MenuItem> */}
                              {fetchproducts.map((product, index) => (
                                <MenuItem
                                  key={index}
                                  value={product.productName}
                                >
                                  {product.productName}
                                </MenuItem>
                              ))}
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
                      type="submit"
                      variant="contained"
                      color="primary"
                      sx={{ mr: 2 }}
                    >
                      Update
                    </Button>
                    <Button variant="outlined" color="error">
                      Cancel
                    </Button>
                  </Box>

                  <Box sx={{ mt: 3 }}>
                    <TableContainer component={Paper}>
                      <Table>
                        {/* Table Head */}
                        <TableHead>
                          <TableRow>
                            <TableCell
                              align="center"
                              sx={{ fontWeight: "bold" }}
                            >
                              Tanker Number
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ fontWeight: "bold" }}
                            >
                              Tanker Capacity
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ fontWeight: "bold" }}
                            >
                              Product
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ fontWeight: "bold" }}
                            >
                              Action
                            </TableCell>
                          </TableRow>
                        </TableHead>

                        {/* Table Body */}
                        <TableBody>
                          {tankerData.length > 0 ? (
                            tankerData.map((tankerDetail, index) => (
                              <TableRow key={index}>
                                <TableCell align="center">
                                  {tankerDetail.tankerNumber}
                                </TableCell>
                                <TableCell align="center">
                                  {tankerDetail.licenseCapacity}
                                </TableCell>
                                <TableCell align="center">
                                  {tankerDetail.product}
                                </TableCell>
                                <TableCell align="center">
                                  {/* Conditionally render the delete icon */}
                                  {tankerDetail.id && (
                                    <IconButton
                                      color="error"
                                      onClick={() => handleDelete(tankerDetail.id)}
                                    >
                                      <Delete />
                                    </IconButton>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell align="center" colSpan={4}>
                                No data available
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    {/* Pagination Controls */}
                    <TablePagination
                      component="div"
                      rowsPerPageOptions={[5, 10, 15, 20]}
                      // count={tankerTable.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </Box>
                </form>
              )}

              {/* Render Document Details */}
              {tabIndex === 3 && (
                <form action="" onSubmit={handleDocumentSave}>
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
                    <Button
                      variant="outlined"
                      startIcon={<Add />}
                      onClick={addDocument}
                      sx={{
                        height: "40px",
                        minWidth: "100px",
                        marginBottom: "30px",
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
                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth sx={{ flex: 1 }}>
                            <InputLabel>Tanker Number</InputLabel>
                            <Select
                              label="Tanker Number"
                              name="tankerNumber"
                              value={documents.tankerNumber || ""} // Use the value from documents
                              onChange={(e) =>
                                handleDocumentChange(
                                  index,
                                  "tankerNumber",
                                  e.target.value
                                )
                              } // Update tankerNumber with the selected value
                            >
                              {tankerData.map((tanker) => (
                                <MenuItem
                                  key={tanker.tankerNumber}
                                  value={tanker.id}
                                >
                                  {tanker.tankerNumber}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
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

                        <Grid item xs={12} sm={6}>
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
                            <Grid item xs={12} sm={6}>
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
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Valid Upto"
                            type="date"
                            InputProps={{
                              readOnly: true,
                            }}
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
                            
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            type="file"
                            label="Document"
                            InputLabelProps={{
                              shrink: true, // Ensures the label remains visible when a file is selected
                            }}
                            name="documents"
                            // value={documents.documentUpload}
                            onChange={(e) =>
                              handleDocumentChange(
                                index,
                                "documentFile",
                                e.target.files[0]
                              )
                            }
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
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      sx={{ mr: 2 }}
                    >
                      Update
                    </Button>
                    <Button variant="outlined" color="error">
                      Cancel
                    </Button>
                  </Box>

                  <Box sx={{ mt: 3 }}>
                    <TableContainer component={Paper}>
                      <Table>
                        {/* Table Head */}
                        <TableHead>
                          <TableRow>
                            {/* <TableCell
                              align="center"
                              sx={{ fontWeight: "bold" }}
                            >
                              Document id
                            </TableCell> */}
                            <TableCell
                              align="center"
                              sx={{ fontWeight: "bold" }}
                            >
                              Tanker Number
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ fontWeight: "bold" }}
                            >
                              DocumentType
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ fontWeight: "bold" }}
                            >
                              Valid From
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ fontWeight: "bold" }}
                            >
                              Valid UpTo
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ fontWeight: "bold" }}
                            >
                              DocumentFile
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ fontWeight: "bold" }}
                            >
                              Action
                            </TableCell>
                          </TableRow>
                        </TableHead>

                        {/* Table Body */}
                        <TableBody>
                          {documentData.length > 0 ? (
                            documentData.map((document, index) => (
                              <TableRow key={index}>
                                {/* <TableCell align="center">{document.id}</TableCell> */}
                                <TableCell align="center">
                                  {document.tankerNumber}
                                </TableCell>
                                <TableCell align="center">
                                  {document.documentType}
                                </TableCell>

                                <TableCell align="center">
                                  {new Date(
                                    document.validFrom
                                  ).toLocaleDateString()}
                                </TableCell>
                                <TableCell align="center">
                                  {new Date(
                                    document.validUpto
                                  ).toLocaleDateString()}
                                </TableCell>
                                <TableCell align="center">
                                  <a
                                    href={`http://localhost:3000/${document.documentFile}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <FaEye className="fs-5" />
                                  </a>
                                </TableCell>
                                <TableCell align="center">
                                  <IconButton
                                    color="error"
                                    onClick={() =>
                                      handledocumentDelete(document.id)
                                    }
                                  >
                                    <Delete />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell align="center" colSpan={6}>
                                No data available
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    {/* Pagination Controls */}
                    <TablePagination
                      component="div"
                      rowsPerPageOptions={[5, 10, 15, 20]}
                      // count={documentTable.length}
                      rowsPerPage={documentrowsPerPage}
                      page={page}
                      onPageChange={documenthandleChangePage}
                      onRowsPerPageChange={documenthandleChangeRowsPerPage}
                    />
                  </Box>
                </form>
              )}

              {/* Render Bank Details */}
              {tabIndex === 4 && (
                <form onSubmit={handleBankUpdate}>
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
                            name="accountName"
                            label="Account name"
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
                              name="natureOfAccount"
                              label="Nature of account"
                              value={bankDetail.natureOfAccount}
                              onChange={(e) =>
                                handleBankChange(
                                  index,
                                  "natureOfAccount",
                                  e.target.value
                                )
                              }
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
                            name="accountNumber"
                            label="Transporter bank account number"
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
                      <IconButton
                        onClick={() => {
                          if (bank.length > 1) {
                            removeBank(index);
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
                          cursor: bank.length === 1 ? "not-allowed" : "pointer",
                          pointerEvents: bank.length === 1 ? "none" : "auto",
                          visibility: bank.length === 1 ? "hidden" : "visible",
                          "&:hover": {
                            backgroundColor: "#cf0202",
                          },
                        }}
                      >
                        <i className="bi bi-x"></i>
                      </IconButton>
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
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default EditTranspoter;
