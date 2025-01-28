import React, { useState, useEffect } from "react";
import {
  Box,
  Tab,
  Tabs,
  Typography,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
} from "@mui/material";
// import axios from "axios";

import { ArrowBack } from "@mui/icons-material";
import { useNavigate, Link, useParams } from "react-router-dom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import VisibilityIcon from "@mui/icons-material/Visibility";
import axiosInstance from "../../Authentication/axiosConfig";
// import { useNavigate } from "react-router-dom";

function ViewCustomer() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const { id } = useParams(); // Extract the ID from the URL

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true); // State to manage loading state

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/customers/${id}`);
        setData(response.data);
        console.log(response.data);
        // Update the state with the fetched data
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Set loading to false regardless of success or failure
      }
    };

    fetchData(); // Call the fetch function
  }, [id]); // Dependency on `id` ensures this runs when `id` changes

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!data) {
    return <Typography>No data available.</Typography>;
  }
  // bank filter

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const day = ("0" + date.getDate()).slice(-2); // Adds leading zero if day is single digit
    const month = ("0" + (date.getMonth() + 1)).slice(-2); // Adds leading zero if month is single digit
    const year = date.getFullYear();
    const hours = ("0" + date.getHours()).slice(-2); // Adds leading zero if hours are single digit
    const minutes = ("0" + date.getMinutes()).slice(-2); // Adds leading zero if minutes are single digit

    return `${day}/${month}/${year} | ${hours}:${minutes}`;
  };

  // const navigate = useNavigate();

  // const handleViewClick = (bankId) => {
  //   // Redirect to the specific bank details page
  //   navigate(`/ViewCustomerBank/${bankId}`);
  //   // ViewCustomerBank/:id
  // };

  return (
    <Box p={3}>
      <Box sx={{ display: "flex" }}>
        <Button onClick={() => navigate(-1)} sx={{ mb: 2 }}>
          <ArrowBack />
        </Button>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
          Customer Detalis
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
          / Customer Detalis
        </Typography>
      </Box>

      {/* Customer Summary */}
      <Box
        sx={{
          background: "#fff",
          borderRadius: "8px",
          padding: "30px",
        }}
      >
        <Grid container spacing={2}>
          {/* Replace these with dynamic data */}
          <Grid item xs={4}>
            <b>Company Name:</b> {data.companyName}
          </Grid>
          <Grid item xs={4}>
            <b>Email Address:</b> {data.email}
          </Grid>
          <Grid item xs={4}>
            <b>Primary Phone Number:</b> {data.primaryPhoneNumber}
          </Grid>
          <Grid item xs={4}>
            <b>Secondary Phone Number:</b> {data.secondaryPhoneNumber}
          </Grid>
          <Grid item xs={4}>
            <b>Address 1:</b> {data.address1}
          </Grid>
          <Grid item xs={4}>
            <b>Address 2:</b> {data.address2}
          </Grid>
          <Grid item xs={4}>
            <b>State:</b> {data.state}
          </Grid>
          <Grid item xs={4}>
            <b>District:</b> {data.district}
          </Grid>
          <Grid item xs={4}>
            <b>City:</b> {data.city}
          </Grid>
          <Grid item xs={4}>
            <b>Zip Code:</b> {data.zipcode}
          </Grid>
          {/* <Grid item xs={4}>
  <b>Associated Supplier:</b>{" "}
  {data.associatedSuppliers && Array.isArray(data.associatedSuppliers)
    ? data.associatedSuppliers.join(", ")
    : "No Suppliers Available"}
</Grid> */}
          {/* <Grid item xs={4}>
            <b>Associated Supplier:</b>{" "}
            {data.associatedSuppliers
              ? JSON.parse(data.associatedSuppliers).join(", ")
              : "No Suppliers Available"}
          </Grid> */}
          <Grid item xs={4}>
            <b>Associated Supplier:</b>
            {data.associatedSuppliers}
          </Grid>

          <Grid item xs={4}>
            <b>Team:</b> {data.team}
          </Grid>
          <Grid item xs={4}>
            <b>Type of Company:</b> {data.typeOfCompany}
          </Grid>
          <Grid item xs={4}>
            <b>License number:</b> {data.licenseNumber}
          </Grid>

          {/* <Grid item xs={4}>
            <b>Our Company:</b>{" "}
            {data.ourCompanies
              ? JSON.parse(data.ourCompanies)
                  .map((company) => {
                    const match = company.match(/^(.*?)\s*\((.*?)\)$/);
                    if (match) {
                      const initials = match[1] // Extracts "HARIKRISHNA COMMERCIAL BHARAT GAS AGENCY"
                        .split(" ") // Splits into words
                        .map((word) => word.charAt(0)) // Gets the first letter of each word
                        .join(""); // Joins them together
                      return `${initials} (${match[2]})`; // HCBGA (BPCL)
                    }
                    return company; // Fallback in case format is different
                  })
                  .join(", ")
              : "No Companies Available"}
          </Grid> */}
          <Grid item xs={4}>
            <b>BA(Business Associated):</b>
            {data.ourCompanies}
          </Grid>

          <Grid item xs={4}>
            <b>TAN Number:</b> {data.tanNumber}
          </Grid>
          <Grid item xs={4}>
            <b>GST Number:</b> {data.gstNumber}
          </Grid>
          <Grid item xs={4}>
            <b>PAN Number:</b> {data.panNumber}
          </Grid>
          <Grid item xs={4}>
            <b>License Valid Till:</b> {formatDate(data.licenseValidTill)}
          </Grid>
          <Grid item xs={4}>
            <b>License Capacity:</b> {data.licenseCapacity}
          </Grid>
          <Grid item xs={4}>
            <b>Latitude:</b> {data.latitude}
          </Grid>
          <Grid item xs={4}>
            <b>Longitude:</b> {data.longitude}
          </Grid>
          <Grid item xs={4}>
            <b>Transporter:</b> {data.transporter}
          </Grid>
          <Grid item xs={4}>
            <b>Competitor:</b> {data.competitorSupplier}
          </Grid>
          <Grid item xs={4}>
            <b>Status:</b>
            {data.activeStatus ? "Active" : "Inactive"}
          </Grid>
        </Grid>
      </Box>

      {/* Tabs for Details */}
      <Box
        sx={{
          background: "#fff",
          borderRadius: "8px",
          padding: "30px",
          marginTop: "50px",
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          sx={{ mb: 4 }}
        >
          <Tab label="Contact Details" />
          <Tab label="General Details" />
          <Tab label="SAP Codes" />
          <Tab label="Bank Details" />
        </Tabs>

        {/* Content for each tab */}
        {activeTab === 0 && (
          <ContactDetails contactDetails={data.contactDetails} />
        )}
        {activeTab === 1 && (
          <GeneralDetails generalDetails={data.generalDetails} />
        )}
        {activeTab === 2 && <SAPCodes sapCodesDetails={data.sapCodesDetails} />}
        {activeTab === 3 && <BankDetails bankDetails={data.bankDetails} />}
      </Box>
    </Box>
  );
}

function ContactDetails({ contactDetails }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center" sx={{ fontWeight: "bold" }}>
              S.No.
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold" }}>
              Contact Detalis
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold" }}>
              Role
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold" }}>
              Phone Number
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {contactDetails.map((contact, index) => (
            <TableRow key={index}>
              <TableCell align="center">{index + 1}</TableCell>
              <TableCell align="center">{contact.contactName}</TableCell>
              <TableCell align="center">{contact.role}</TableCell>
              <TableCell align="center">{contact.phoneNumber}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function GeneralDetails({ generalDetails }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center" sx={{ fontWeight: "bold" }}>
              Field Name
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold" }}>
              Field Value
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {generalDetails.map((detail, index) => (
            // <TableRow key={index}>
            //   <TableCell align="center">Product Segment</TableCell>
            //   <TableCell align="center">{detail.productSegment}</TableCell>
            // </TableRow>
            <React.Fragment key={index}>
              <TableRow>
                <TableCell align="center">Product Segment</TableCell>
                <TableCell align="center">
                  {detail.productSegment || "N/A"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="center">Length of kiln (Meters)</TableCell>
                <TableCell align="center">
                  {detail.lengthOfKiln || "N/A"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="center">
                  Daily Natural Gas Consumption (Scm)
                </TableCell>
                <TableCell align="center">
                  {detail.dailyNaturalGasConsumption || "N/A"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="center">Daily Consumption (MT)</TableCell>
                <TableCell align="center">
                  {detail.dailyConsumption || "N/A"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="center">Hourly Consumption (Kg)</TableCell>
                <TableCell align="center">
                  {detail.hourlyConsumption || "N/A"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="center">Monthly Consumption (MT)</TableCell>
                <TableCell align="center">
                  {detail.monthlyConsumption || "N/A"}
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function SAPCodes({ sapCodesDetails }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center" sx={{ fontWeight: "bold" }}>
              S.No.
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold" }}>
              Supplier Name
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold" }}>
              Product
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold" }}>
              SAP Code
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sapCodesDetails.map((sap, index) => (
            <TableRow key={index}>
              <TableCell align="center">{index + 1}</TableCell>
              <TableCell align="center">{sap.supplierName}</TableCell>
              <TableCell align="center">{sap.productName}</TableCell>
              <TableCell align="center">{sap.sapCode}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function BankDetails({ bankDetails }) {
  // Group bank details by supplierName
  const groupedBanks = bankDetails.reduce((acc, bank) => {
    if (!acc[bank.supplierName]) {
      acc[bank.supplierName] = [];
    }
    acc[bank.supplierName].push(bank);
    return acc;
  }, {});
  return (
    <div>
      {Object.entries(groupedBanks).map(([supplierName, banks], index) => (
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
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Typography>
                  <strong>Supplier:</strong> {supplierName}
                </Typography>
              </Box>
            </Box>
          </AccordionSummary>

          {/* Accordion Content */}
          <AccordionDetails>
            {banks.map((bank, idx) => (
              <Box key={idx} sx={{ marginBottom: "20px" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography
                    className="fs-5"
                    sx={{ marginBottom: "10px", fontWeight: "500", mt: 3 }}
                  >
                    <b>{bank.bankName}</b> | {bank.sapCode} | {bank.productName}
                  </Typography>
                  <Link
                    to={`/ViewCustomerBank/${bank.id}`}
                    onClick={(e) => e.stopPropagation()} // Prevents the accordion from toggling
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <IconButton>
                      <VisibilityIcon />
                    </IconButton>
                  </Link>
                </Box>
                <hr />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    Name of Account: {bank.accountName}
                  </Grid>
                  <Grid item xs={6}>
                    Bank Name: {bank.bankName}
                  </Grid>
                  <Grid item xs={6}>
                    Account Number: {bank.accountNumber}
                  </Grid>
                  <Grid item xs={6}>
                    Type of Account: {bank.natureOfAccount}
                  </Grid>
                  <Grid item xs={6}>
                    IFSC: {bank.ifscCode}
                  </Grid>
                  <Grid item xs={6}>
                    Branch: {bank.branchName}
                  </Grid>
                  <Grid item xs={12}></Grid>
                </Grid>
              </Box>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}

export default ViewCustomer;
