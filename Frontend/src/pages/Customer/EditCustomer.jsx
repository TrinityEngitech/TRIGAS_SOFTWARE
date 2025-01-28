import { useState, useEffect } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Add, Delete } from "@mui/icons-material";

// import { FormControl, InputLabel, Select, MenuItem, OutlinedInput, Box, Chip } from '@mui/material';
import { useMediaQuery, useTheme } from "@mui/material";
import { useNavigate, Link, useParams } from "react-router-dom";
import axios from "axios";
// import { Add } from "@mui/icons-material";
import { ArrowBack } from "@mui/icons-material";
import BusinessIcon from "@mui/icons-material/Business";
import PhoneIcon from "@mui/icons-material/Phone";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import axiosInstance from "../../Authentication/axiosConfig";

function EditCustomer() {
  const { id } = useParams(); // Extract the ID from the URL
  const { uuid } = useParams();

  console.log(uuid);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };


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

  const [product, setProduct] = useState([]); // State to store supplier data
  useEffect(() => {
    const fetchSuppliers = async () => {
      const response = await axiosInstance.get("/products"); // Update this with the actual API endpoint
      console.log(response.data || []);

      setProduct(response.data); // Set the data to state
    };

    fetchSuppliers(); // Call the function to fetch data
  }, []);
  console.log("product", product);

  // const [data,setData]=useState(null)
  const [loading, setLoading] = useState(true);

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


  const [bankDetails, setBankDetails] = useState([]); // State to store bank details
  console.log("bankDetails", bankDetails);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/customers/${uuid}`);
        const fetchedData = response.data;

        fetchedData.associatedSuppliers = Array.isArray(
          fetchedData.associatedSuppliers
        )
          ? fetchedData.associatedSuppliers
          : JSON.parse(fetchedData.associatedSuppliers || "[]");

        fetchedData.ourCompanies = Array.isArray(fetchedData.ourCompanies)
          ? fetchedData.ourCompanies
          : JSON.parse(fetchedData.ourCompanies || "[]");

        // Check if 'contactDetails' exists and is an array
        if (
          fetchedData.contactDetails &&
          Array.isArray(fetchedData.contactDetails)
        ) {
          setContacts(fetchedData.contactDetails); // Set contacts in state
        }
        if (
          fetchedData.generalDetails &&
          Array.isArray(fetchedData.generalDetails)
        ) {
          setgeneralDetalis(fetchedData.generalDetails); // Set contacts in state
        }

        // Set SAP codes data
        if (
          fetchedData.sapCodesDetails &&
          Array.isArray(fetchedData.sapCodesDetails)
        ) {
          setSAPData(fetchedData.sapCodesDetails); // Set SAP details in state
        }

        // Set bankDetails codes data
        if (fetchedData.bankDetails && Array.isArray(fetchedData.bankDetails)) {
          setBankDetails(fetchedData.bankDetails); // Set SAP details in state
        }

        // setFormData(fetchedData);
        setFormData({
          ...fetchedData,
          team: fetchedData.team || "",
          transporter: fetchedData.transporter || "",
        });
        console.log("fetchedData", fetchedData);
        // Update the state with the fetched data
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Set loading to false regardless of success or failure
      }
    };

    fetchData(); // Call the fetch function
  }, [id]); // Dependency on `id` ensures this runs when `id` changes

  // const handleUpdate = async (e) => {
  //   e.preventDefault(); // Prevent form submission

  //   try {
  //     // Update the data before sending (e.g., converting licenseValidTill to a date)
  //     formData.licenseValidTill = new Date(formData.licenseValidTill); // Example for date handling

  //     // Send the updated data to the backend
  //     const response = await axiosInstance.put(
  //       "/customers/updateCustomerDetails",
  //       formData
  //     );
  //     console.log("Customer details updated:", response.data);
  //     alert("customer update");
  //   } catch (error) {
  //     console.error("Error updating customer details:", error);
  //   }
  // };

  // State for contact details
  
  const handleUpdate = async (e) => {
    e.preventDefault(); // Prevent form submission
  
    // Prepare the updated form data
    const updatedFormData = {
      ...formData,
      licenseCapacity: formData.licenseCapacity
        ? parseFloat(formData.licenseCapacity)
        : null, // Convert to float or null
      latitude: formData.latitude ? parseFloat(formData.latitude) : null, // Convert to float or null
      longitude: formData.longitude ? parseFloat(formData.longitude) : null, // Convert to float or null
      associatedSuppliers: selectedSuppliers, // Array of associated suppliers
      ourCompanies: selectedCompanies,       // Array of associated companies
      team: selectedTeam,                    // Selected team details
      transporter: selectedTransporter,      // Selected transporter details
      licenseValidTill: formData.licenseValidTill
        ? new Date(formData.licenseValidTill) // Convert to Date object
        : null,
    };
  
    // Log the updated data before sending the API request
    console.log("Updated Form Data for Update:", updatedFormData);
  
    try {
      // Send the updated data to the backend
      const response = await axiosInstance.put(
        "/customers/updateCustomerDetails",
        updatedFormData
      );
      console.log("Customer details updated:", response.data);
      alert("Customer details updated successfully!");
      // navigate(`/view-customer/${formData.uuid}`); // Navigate to a view page after update
    } catch (error) {
      console.error("Error updating customer details:", error.response?.data || error.message);
      alert("Failed to update customer details.");
    }
  };
  

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

  const handlecontactupdate = async (e) => {
    e.preventDefault();

    // Assuming 'data.contactDetails' holds the updated contact details
    const updatedContacts = formData.contactDetails;

    // Access the customerId from the first object in the array
    const customerId =
      updatedContacts.length > 0 ? updatedContacts[0].customerId : null;

    if (!customerId) {
      console.error("Customer ID is missing from the contact details");
      alert("Customer ID is missing. Cannot proceed.");
      return;
    }

    // Construct the payload
    const payload = {
      customerId: customerId,
      contacts: updatedContacts.map((contact) => ({
        contactName: contact.contactName,
        phoneNumber: contact.phoneNumber,
        role: contact.role,
        commentRemark: contact.commentRemark,
      })),
    };

    // Log the payload to verify its structure
    console.log("Payload to be sent to backend:", payload);

    try {
      // Send PUT request to the API
      const response = await axiosInstance.put(
        "/customers/updateCustomerContactDetails",
        payload
      );

      // Directly log the response or show an alert
      console.log("Contacts updated successfully:", response.data);
      alert("Contacts updated successfully!");
    } catch (error) {
      console.error("Error updating contacts:", error);
      alert(
        "An error occurred while updating contacts. Please try again later."
      );
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

  console.log("generalDetalis", generalDetalis);

  // Handle form input change
  const handleChangeGeneralDetalis = (e, index) => {
    const { name, value } = e.target;
    setgeneralDetalis((prevState) => {
      const updatedDetails = [...prevState];
      updatedDetails[index][name] = value;
      return updatedDetails;
    });
  };

  const handleUpdateGeneralDetalis = async (e) => {
    e.preventDefault();

    // Check if the data is an array and access the first item
    const dataToSend =
      generalDetalis.length > 0 ? generalDetalis[0] : generalDetalis; // Adjust this if needed

    // Log the data to ensure it's structured correctly
    console.log("Data to be sent to backend:", dataToSend);

    const API_URL =
      "http://localhost:3000/api/customers/updateCustomerGeneralDetails";

    // Prepare the data for sending to the backend
    const dataToSendBackend = {
      customerId: dataToSend.customerId,
      productSegment: dataToSend.productSegment,
      noOfKiln: dataToSend.noOfKiln,
      lengthOfKiln: dataToSend.lengthOfKiln,
      dailyNaturalGasConsumption: dataToSend.dailyNaturalGasConsumption,
      dailyConsumption: dataToSend.dailyConsumption,
      hourlyConsumption: dataToSend.hourlyConsumption,
      monthlyConsumption: dataToSend.monthlyConsumption,
      startingStock: dataToSend.startingStock,
      startingStockDateTime: dataToSend.startingStockDateTime,
      newPurchaseDateTime: dataToSend.newPurchaseDateTime,
      newPurchase: dataToSend.newPurchase,
      updatedTotalStock: dataToSend.updatedTotalStock,
      remainingHoursOfStock: dataToSend.remainingHoursOfStock,
    };

    console.log("Data being sent to the backend:", dataToSendBackend);

    try {
      // Send the PUT request using axios
      const response = await axios.put(API_URL, dataToSendBackend);

      // Log the response from the backend
      console.log("Response from backend:", response.data);

      // Show a success message
      alert("General details updated successfully!");
    } catch (error) {
      // Handle errors
      console.error("Error updating general details:", error);

      // Show an error message
      alert("Failed to update general details. Please try again.");
    }
  };

  const [SAP, setSAP] = useState([{ supplier: "", product: "", SAPCode: "" }]);
  const [SAPData, setSAPData] = useState([
    { supplier: "", product: "", SAPCode: "" },
  ]);
  // Handle change for contact details
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
  console.log("sap code", SAP);

  // const handleSelectAll = (index, isChecked) => {
  //   const updatedSAP = [...SAP];
  //   updatedSAP[index].product = isChecked
  //     ? product.map((p) => p.productName).join(", ")  // Select all products
  //     : ""; // Deselect all products
  //   setSAP(updatedSAP);
  // };
 
  const handleSelectAll = (index, isChecked) => {
    const updatedSAP = [...SAP];
    updatedSAP[index].product = isChecked
      ? product.map((p) => p.productName).join(", ") // Select all products
      : ""; // Deselect all products
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
        sapCode: item.sapcode || "", // Ensure SAP code is passed
      })),
    };

    // Prepare the payloads for creating multiple virtual accounts
    const virtualAccountPayloads = SAP.map((item) => ({
      customerId: uuid, // Same UUID for the customer
      customerName: formData.companyName, // Correct customer name
      customerCode: item.sapcode || "", // Use the sapCode for this entry
      supplierId: item.supplierId || "", // Use the supplierId for this entry
      supplierName: item.supplierName || "", // Ensure supplierName is passed
      productName: item.product || "", // Ensure productName is passed
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
      // navigate(`/add-customer/Bank-Details/${uuid}`);
    } catch (error) {
      console.error("Error saving data:", error.message);
      alert(
        "An error occurred while saving the data. Please check the console for details."
      );
    }
  };

  const handleDelete = async (SAPDataId) => {
    console.log(SAPDataId); // Log SAPId to ensure it's correct

    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this SAP code?"
      );
      if (!confirmDelete) return;

      // Send DELETE request to your custom API endpoint
      const response = await axiosInstance.delete(
        `/customers/deleteCustomerSAPCode`,
        { data: { sapCodeId: SAPDataId } } // Send SAPId in request body
      );

      if (response.status === 200) {
        alert("SAP Code and related bank details deleted successfully!");
        // Dynamically update the SAP list state
        setSAPData((prevList) =>
          prevList.filter((sap) => sap.id !== SAPDataId)
        );
        // You can update tabIndex or perform other actions if needed
      } else {
        alert("Failed to delete the SAP code. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting SAP code:", error);
      alert("Failed to delete the SAP code. Please try again.");
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

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
          Edit Customer
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
          / Edit Customer
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: isSmallScreen ? "column" : "row",
          height: "100vh",
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
              value={activeTab}
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
              value={activeTab}
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
            {activeTab === 0 && (
              // <form onSubmit={handleUpdate}>
              //   <Typography
              //     className="fs-4"
              //     sx={{ marginBottom: "20px", fontWeight: "500" }}
              //   >
              //     Company Details
              //   </Typography>
              //   <Grid container spacing={2}>
              //     {/* 1 */}
              //     <Grid item xs={12} sm={6}>
              //       <TextField
              //         fullWidth
              //         label="Company Name"
              //         variant="outlined"
              //         name="companyName"
              //         type="text"
              //         value={data.companyName || ""}
              //         onChange={(e) =>
              //           setData({ ...data, companyName: e.target.value })
              //         }
              //         sx={{
              //           "& .MuiInputBase-input": {
              //             textTransform: "uppercase",
              //           },
              //         }}
              //       />
              //     </Grid>
              //     {/* 2 */}
              //     <Grid item xs={12} sm={6}>
              //       <TextField
              //         fullWidth
              //         label="Email"
              //         variant="outlined"
              //         name="email"
              //         type="email"
              //         value={data.email || ""}
              //         onChange={(e) =>
              //           setData({ ...data, email: e.target.value })
              //         }
              //       />
              //     </Grid>
              //     {/* 3 */}
              //     <Grid item xs={12} sm={6}>
              //       <TextField
              //         fullWidth
              //         label="Primary Phone Number"
              //         variant="outlined"
              //         name="primaryPhoneNumber"
              //         value={data.primaryPhoneNumber || ""}
              //         onChange={(e) =>
              //           setData({ ...data, primaryPhoneNumber: e.target.value })
              //         }
              //       />
              //     </Grid>
              //     {/* 4 */}
              //     <Grid item xs={12} sm={6}>
              //       <TextField
              //         fullWidth
              //         label="Secondary Phone Number"
              //         variant="outlined"
              //         name="secondaryPhoneNumber"
              //         value={data.secondaryPhoneNumber || ""}
              //         onChange={(e) =>
              //           setData({
              //             ...data,
              //             secondaryPhoneNumber: e.target.value,
              //           })
              //         }
              //       />
              //     </Grid>
              //     {/* 5 */}
              //     <Grid item xs={12} sm={6}>
              //       <TextField
              //         fullWidth
              //         label="Address 1"
              //         variant="outlined"
              //         name="address1"
              //         value={data.address1 || ""}
              //         onChange={(e) =>
              //           setData({ ...data, address1: e.target.value })
              //         }
              //       />
              //     </Grid>
              //     {/* 6 */}
              //     <Grid item xs={12} sm={6}>
              //       <TextField
              //         fullWidth
              //         label="Address 2"
              //         variant="outlined"
              //         name="address2"
              //         value={data.address2 || ""}
              //         onChange={(e) =>
              //           setData({ ...data, address2: e.target.value })
              //         }
              //       />
              //     </Grid>
              //     {/* 7 */}
              //     <Grid item xs={12} sm={6}>
              //       <TextField
              //         fullWidth
              //         label="State"
              //         variant="outlined"
              //         name="state"
              //         value={data.state || ""}
              //         onChange={(e) =>
              //           setData({ ...data, state: e.target.value })
              //         }
              //       />
              //     </Grid>
              //     {/* 8 */}
              //     <Grid item xs={12} sm={6}>
              //       <TextField
              //         fullWidth
              //         label="District"
              //         variant="outlined"
              //         name="district"
              //         value={data.district || ""}
              //         onChange={(e) =>
              //           setData({ ...data, district: e.target.value })
              //         }
              //       />
              //     </Grid>
              //     {/* 9 */}
              //     <Grid item xs={12} sm={6}>
              //       <TextField
              //         fullWidth
              //         label="City"
              //         variant="outlined"
              //         name="city"
              //         value={data.city || ""}
              //         onChange={(e) =>
              //           setData({ ...data, city: e.target.value })
              //         }
              //       />
              //     </Grid>
              //     {/* 10 */}
              //     <Grid item xs={12} sm={6}>
              //       <TextField
              //         fullWidth
              //         label="Zip Code"
              //         variant="outlined"
              //         name="zipcode"
              //         value={data.zipcode || ""}
              //         onChange={(e) =>
              //           setData({ ...data, zipcode: e.target.value })
              //         }
              //       />
              //     </Grid>
              //     {/* 11 */}
              //     <Grid item xs={12} sm={6}>
              //       <FormControl fullWidth>
              //         <InputLabel>Associated Supplier</InputLabel>
              //         <Select
              //           label="Associated Supplier"
              //           name="associatedSupplier"
              //           value={data.associatedSuppliers || []} // Bind the value to state
              //           onChange={(e) => {
              //             setData({
              //               ...data,
              //               associatedSuppliers: e.target.value, // Update the associatedSuppliers in state
              //             });
              //           }}
              //           multiple // Enable multiple selection
              //           renderValue={(selected) => (
              //             <Box
              //               sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
              //             >
              //               {selected.map((value) => (
              //                 <Chip key={value} label={value} />
              //               ))}
              //             </Box>
              //           )}
              //         >
              //           {data.associatedSuppliers &&
              //           data.associatedSuppliers.length > 0 ? (
              //             data.associatedSuppliers.map((supplier, index) => (
              //               <MenuItem key={index} value={supplier}>
              //                 <Checkbox
              //                   checked={
              //                     data.associatedSuppliers.indexOf(supplier) >
              //                     -1
              //                   }
              //                 />
              //                 <ListItemText primary={supplier} />
              //               </MenuItem>
              //             ))
              //           ) : (
              //             <MenuItem disabled>No Suppliers Available</MenuItem>
              //           )}
              //         </Select>
              //       </FormControl>
              //     </Grid>
              //     {/* 12 */}
              //     <Grid item xs={12} sm={6}>
              //       <FormControl fullWidth>
              //         <InputLabel id="team-label">Team</InputLabel>
              //         <Select
              //           labelId="team-label"
              //           name="team"
              //           value={data.team || ""} // Bind the value to state
              //           onChange={(e) => {
              //             setData({
              //               ...data,
              //               team: e.target.value, // Update the team in state
              //             });
              //           }}
              //           required
              //         >
              //           {/* Dynamically render the options */}
              //           {data.team ? (
              //             <MenuItem value={data.team}>{data.team}</MenuItem>
              //           ) : (
              //             <MenuItem disabled>No Team Available</MenuItem>
              //           )}
              //         </Select>
              //       </FormControl>
              //     </Grid>
              //     {/* 13  */}
              //     <Grid item xs={12} sm={6}>
              //       <FormControl fullWidth>
              //         <InputLabel>Type of Company</InputLabel>
              //         <Select
              //           label="Type of Company"
              //           name="typeOfCompany"
              //           required
              //           value={data.typeOfCompany || ""}
              //           onChange={(e) =>
              //             setData({ ...data, typeOfCompany: e.target.value })
              //           }
              //         >
              //           <MenuItem value="Partnership">Partnership</MenuItem>
              //           <MenuItem value="LLP">LLP</MenuItem>
              //           <MenuItem value="Limited">Limited</MenuItem>
              //           <MenuItem value="Private Limited">
              //             Private Limited
              //           </MenuItem>
              //         </Select>
              //       </FormControl>
              //     </Grid>
              //     {/* 14 */}
              //     <Grid item xs={12} sm={6}>
              //       <TextField
              //         fullWidth
              //         label="License number"
              //         variant="outlined"
              //         name="licenseNumber"
              //         value={data.licenseNumber || ""}
              //         onChange={(e) =>
              //           setData({ ...data, licenseNumber: e.target.value })
              //         }
              //       />
              //     </Grid>
              //     {/* 15 */}
              //     <Grid item xs={12} sm={6}>
              //       <FormControl fullWidth>
              //         <InputLabel>Our Company</InputLabel>
              //         <Select
              //           label="Our Company"
              //           name="ourCompanies"
              //           value={data.ourCompanies || []} // Bind the value to state
              //           onChange={(e) => {
              //             setData({
              //               ...data,
              //               ourCompanies: e.target.value, // Update the ourCompanies in state
              //             });
              //           }}
              //           multiple // Enable multiple selection
              //           renderValue={(selected) => (
              //             <Box
              //               sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
              //             >
              //               {selected.map((value) => (
              //                 <Chip key={value} label={value} />
              //               ))}
              //             </Box>
              //           )}
              //         >
              //           {data.ourCompanies && data.ourCompanies.length > 0 ? (
              //             data.ourCompanies.map((company, index) => (
                            
              //               <MenuItem key={index} value={company}>
              //                 <Checkbox
              //                   checked={
              //                     data.ourCompanies.indexOf(company) > -1
              //                   }
              //                 />
              //                 <ListItemText primary={company} />
              //               </MenuItem>
              //             ))
              //           ) : (
              //             <MenuItem disabled>No Companies Available</MenuItem>
              //           )}
                        


              //         </Select>
              //       </FormControl>
              //     </Grid>
              //     {/* 16 */}
              //     <Grid item xs={12} sm={6}>
              //       <TextField
              //         fullWidth
              //         label="TAN Number"
              //         variant="outlined"
              //         name="tanNumber"
              //         value={data.tanNumber || ""}
              //         onChange={(e) =>
              //           setData({ ...data, tanNumber: e.target.value })
              //         }
              //       />
              //     </Grid>
              //     {/* 17 */}
              //     <Grid item xs={12} sm={6}>
              //       <TextField
              //         fullWidth
              //         label="GST Number"
              //         variant="outlined"
              //         name="gstNumber"
              //         value={data.gstNumber || ""}
              //         onChange={(e) =>
              //           setData({ ...data, gstNumber: e.target.value })
              //         }
              //       />
              //     </Grid>
              //     {/* 18 */}
              //     <Grid item xs={12} sm={6}>
              //       <TextField
              //         fullWidth
              //         label="PAN Number"
              //         variant="outlined"
              //         name="panNumber"
              //         value={data.panNumber || ""}
              //         onChange={(e) =>
              //           setData({ ...data, panNumber: e.target.value })
              //         }
              //       />
              //     </Grid>
              //     {/* 19 */}
              //     <Grid item xs={12} sm={6}>
              //       <TextField
              //         fullWidth
              //         label="License Valid Till"
              //         variant="outlined"
              //         name="licenseValidTill"
              //         value={data.licenseValidTill || ""}
              //         onChange={(e) =>
              //           setData({ ...data, licenseValidTill: e.target.value })
              //         }
              //       />
              //     </Grid>
              //     {/* 20 */}
              //     <Grid item xs={12} sm={6}>
              //       <TextField
              //         fullWidth
              //         label="License Capacity"
              //         variant="outlined"
              //         name="licenseCapacity"
              //         value={data.licenseCapacity || ""}
              //         onChange={(e) =>
              //           setData({ ...data, licenseCapacity: e.target.value })
              //         }
              //       />
              //     </Grid>
              //     {/* 21 */}
              //     <Grid item xs={12} sm={6}>
              //       <TextField
              //         fullWidth
              //         label="Latitude (HARDSTAND)"
              //         variant="outlined"
              //         name="latitude"
              //         value={data.latitude || ""}
              //         onChange={(e) =>
              //           setData({ ...data, latitude: e.target.value })
              //         }
              //       />
              //     </Grid>
              //     {/* 22 */}
              //     <Grid item xs={12} sm={6}>
              //       <TextField
              //         fullWidth
              //         label="Longitude (HARDSTAND)"
              //         variant="outlined"
              //         name="longitude"
              //         value={data.longitude || ""}
              //         onChange={(e) =>
              //           setData({ ...data, longitude: e.target.value })
              //         }
              //       />
              //     </Grid>
              //     {/* 23 */}
              //     <Grid item xs={12} sm={6}>
              //       <FormControl fullWidth>
              //         <InputLabel id="transporter-label">
              //           Transporter
              //         </InputLabel>
              //         <Select
              //           labelId="transporter-label"
              //           name="transporter"
              //           value={data.transporter || ""} // Bind the value to the state
              //           onChange={(e) => {
              //             setData({
              //               ...data,
              //               transporter: e.target.value, // Update the 'transporter' field in the state
              //             });
              //           }}
              //           required
              //         >
              //           <MenuItem value={data.transporter}>
              //             {data.transporter}
              //           </MenuItem>
              //         </Select>
              //       </FormControl>
              //     </Grid>
              //     {/* 24 */}
              //     <Grid item xs={12} sm={6}>
              //       <TextField
              //         fullWidth
              //         label="Competitor"
              //         variant="outlined"
              //         name="competitorSupplier"
              //         value={data.competitorSupplier || ""}
              //         onChange={(e) =>
              //           setData({ ...data, competitorSupplier: e.target.value })
              //         }
              //       />
              //     </Grid>
              //   </Grid>
              //   {/* Action Buttons */}
              //   <Box>
              //     <Box mt={3} display="flex" justifyContent="center" gap={2}>
              //       <Button type="submit" variant="contained" color="primary">
              //         Update
              //       </Button>
              //       <Button variant="outlined" color="error">
              //         Cancel
              //       </Button>
              //     </Box>
              //   </Box>
              // </form>
              <form onSubmit={handleUpdate}>
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
                      <MenuItem value="Other">
                        <em>Other</em>
                      </MenuItem>

                      {transporter.length > 0 ? (
                        transporter.map((item) => (
                          <MenuItem
                            key={item.id}
                            value={item.transporterName}
                          >
                           
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
            {activeTab === 1 && (
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
                          name="role"
                          value={contact.role}
                          onChange={(e) =>
                            handleContactChange(index, "role", e.target.value)
                          }
                          sx={{ flex: 1 }}
                        />

                        <TextField
                          label="Remark"
                          name="commentRemark"
                          value={contact.commentRemark}
                          onChange={(e) =>
                            handleContactChange(
                              index,
                              "commentRemark",
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

                <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
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
            {/* Contact Detalis */}

            {/* General Detalis  */}
            {activeTab === 2 && (
              <form onSubmit={handleUpdateGeneralDetalis}>
                {generalDetalis.map((details, index) => (
                  <Box key={index}>
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
                            value={details.productSegment || ""}
                            onChange={(e) =>
                              handleChangeGeneralDetalis(e, index)
                            }
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
                          value={details.noOfKiln || ""}
                          onChange={(e) => handleChangeGeneralDetalis(e, index)}
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
                          value={details.lengthOfKiln || ""}
                          onChange={(e) => handleChangeGeneralDetalis(e, index)}
                          required
                        />
                      </Grid>

                      {/* Other Fields */}
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Daily Natural Gas Consumption (Scm)"
                          variant="outlined"
                          type="text"
                          name="dailyNaturalGasConsumption"
                          value={details.dailyNaturalGasConsumption || ""}
                          onChange={(e) => handleChangeGeneralDetalis(e, index)}
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
                          value={details.dailyConsumption || ""}
                          onChange={(e) => handleChangeGeneralDetalis(e, index)}
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
                          value={details.hourlyConsumption || ""}
                          onChange={(e) => handleChangeGeneralDetalis(e, index)}
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
                          value={details.monthlyConsumption || ""}
                          onChange={(e) => handleChangeGeneralDetalis(e, index)}
                        />
                      </Grid>
                    </Grid>

                    {/* Stock Details Section */}
                    <Typography
                      className="fs-4"
                      sx={{ margin: "30px 0 20px", fontWeight: "500" }}
                    >
                      Stock Details
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Starting Stock (MT)"
                          variant="outlined"
                          type="text"
                          name="startingStock"
                          value={details.startingStock || ""}
                          onChange={(e) => handleChangeGeneralDetalis(e, index)}
                        />
                      </Grid>
                      {/* Starting Stock Date and Time */}
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          type="datetime-local"
                          label="Starting Stock Date and Time"
                          name="startingStockDateTime"
                          value={details.startingStockDateTime}
                          onChange={(e) => handleChangeGeneralDetalis(e, index)}
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
                          value={details.newPurchase}
                          onChange={(e) => handleChangeGeneralDetalis(e, index)}
                        />
                      </Grid>

                      {/* New Purchase Date and Time */}
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          type="datetime-local"
                          label="New Purchase Date and Time"
                          name="newPurchaseDateTime"
                          value={details.newPurchaseDateTime}
                          onChange={(e) => handleChangeGeneralDetalis(e, index)}
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
                          value={details.updatedTotalStock}
                          onChange={(e) => handleChangeGeneralDetalis(e, index)}
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
                          value={details.remainingHoursOfStock}
                          onChange={(e) => handleChangeGeneralDetalis(e, index)}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                ))}

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
            {activeTab === 3 && (
              <form onSubmit={handleSAPSave}>
                {/* {uuid} */}
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
                {/* {SAP.map((SAPCode, index) => (
                  <Box key={index} p={2}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box
                        sx={{
                          display: "flex",
                          gap: 2,
                          flex: 1, 
                        }}
                      >
                        <FormControl sx={{ flex: 1 }}>
                          <InputLabel>Supplier Name</InputLabel>
                          <Select
                            label="Supplier Name"
                            value={SAP[index]?.supplierId || ""} 
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

                        
{SAP.map((SAPCode, index) => (
  <FormControl sx={{ flex: 1, marginBottom: 2 }} key={index}>
    <InputLabel>Product Name</InputLabel>
    <Select
      label="Product Name"
      multiple
      value={SAPCode.product.split(", ").filter((item) => item) || []} 
      onChange={(e) =>
        handleSAPChange(index, "product", e.target.value)
      }
      renderValue={(selected) => selected.join(", ")} 
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
))}




                        <TextField
                          label=" SAP Code"
                          value={SAPCode.sapcode}
                          onChange={(e) =>
                            handleSAPChange(index, "sapcode", e.target.value)
                          }
                          sx={{ flex: 1 }}
                        />
                      </Box>

                  
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
                          marginLeft: "16px", 
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
                ))} */}

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
                          <TableCell align="center" sx={{ fontWeight: "bold" }}>
                            Supplier Name
                          </TableCell>
                          <TableCell align="center" sx={{ fontWeight: "bold" }}>
                            Product
                          </TableCell>
                          <TableCell align="center" sx={{ fontWeight: "bold" }}>
                            SAP Code
                          </TableCell>
                          <TableCell align="center" sx={{ fontWeight: "bold" }}>
                            Action
                          </TableCell>
                        </TableRow>
                      </TableHead>

                      {/* Table Body */}
                      <TableBody>
                        {/* {SAP.map((SAPCode, index) => ( */}
                        {SAPData.length > 0 ? (
                          SAPData.map((SAPCode, index) => (
                            <TableRow key={index}>
                              <TableCell align="center">
                                {SAPCode.supplierName}
                              </TableCell>
                              <TableCell align="center">
                                {SAPCode.productName}
                              </TableCell>
                              <TableCell align="center">
                                {SAPCode.sapCode}
                              </TableCell>
                              <TableCell align="center">
                                {SAPCode.id && (
                                  <IconButton
                                    color="error"
                                    onClick={() => handleDelete(SAPCode.id)}
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
                        {/* ))} */}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {/* Pagination Controls */}
                </Box>
              </form>
            )}
            {/* SAP code */}

            {/* Bank Details */}
            {activeTab === 4 && (
              <form action="">
                <Typography
                  className="fs-4"
                  sx={{ marginBottom: "20px", fontWeight: "500" }}
                >
                  Bank Details
                </Typography>
                {bankDetails.map((detail, index) => (
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
                          <strong>Supplier:</strong>{" "}
                          {detail.supplierName || "N/A"}
                        </Typography>{" "}
                        |
                        <Typography>
                          <strong>Product:</strong>{" "}
                          {detail.productName || "N/A"}
                        </Typography>{" "}
                        |
                        <Typography>
                          <strong>SAP Code:</strong> {detail.sapCode || "N/A"}
                        </Typography>
                      </Box>
                    </AccordionSummary>

                    {/* Accordion Content */}
                    <AccordionDetails>
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

export default EditCustomer;
