import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Button,
  Box,
  Grid,
  Typography,
  Paper,
  TableHead,
} from "@mui/material";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import Logo from "../../assets/Logo/black.png";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { handleDownloadImage } from "./imageUtils";
// import AnimatedLogoLoader from "../../component/AnimatedLogoLoader";

function ViewCustomerBank() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the 'id' from the URL
  const [bankDetails, setBankDetails] = useState([]); // State to hold fetched data
  const [loading, setLoading] = useState(true); // Loading state
  const sheetRef = useRef(null); // Always define this at the top level

  console.log(bankDetails);

  useEffect(() => {
    if (sheetRef.current) {
      console.log("Sheet reference is working:", sheetRef.current);
    }
  }, []);

  useEffect(() => {
    // Fetch data from the backend
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/customers/ViewCustomerBank/${id}`
        ); // Adjust the endpoint
        setBankDetails(response.data); // Update state with fetched data
        setLoading(false);
      } catch (error) {
        console.error("Error fetching customer bank details:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  console.log(bankDetails.supplierLogo); // Check if the correct URL is being passed

  return (
    <Box p={3}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box>
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
              Customer Bank Detali
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
              / Customer Bank Detali
            </Typography>
          </Box>
        </Box>

        <Box>
          <Box mt={5} display="flex" justifyContent="center" gap={2}>
            <Button
              variant="outlined"
              color="primary"
              sx={{ bgcolor: "#fff" }}
              onClick={() => handleDownloadImage(sheetRef)}
            >
              <FileDownloadIcon className="fs-5" /> Download
            </Button>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          background: "#fff",
          borderRadius: "20px",
          // padding: "20px 20px 30px 20px",
        }}
        ref={sheetRef}
      >
        <Box sx={{ p: 4 }}>
          {/* Header with logo */}
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 4 }}
          >
            <img src={Logo} alt="Logo" style={{ height: 80 }} />
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", textAlign: "center", flexGrow: 1 }}
            >
              <u>{bankDetails.accountName}</u>
            </Typography>
            <img
              // src={`/uploads/${bankDetails.supplierLogo}`} // Assuming supplierLogo is the filename
              src={`http://localhost:3000/${bankDetails.supplierLogo}`} // Assuming supplierLogo is the filename
              alt="Supplier Logo"
              style={{ width: "150px", height: "150px", objectFit: "contain" }}
            />
          </Grid>

          {loading ? (
            <Typography variant="body1" align="center">
              Loading...
            </Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table
                sx={{ minWidth: 650, border: "1px solid #ddd" }}
                aria-label="bank details table"
              >
                {/* Table Head */}
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        border: "1px solid #ddd",
                        textAlign: "center",
                      }}
                    >
                      SR NO.
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        border: "1px solid #ddd",
                        textAlign: "center",
                      }}
                    >
                      PARTICULARS
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        border: "1px solid #ddd",
                        textAlign: "center",
                      }}
                    >
                      DETALIS
                    </TableCell>
                  </TableRow>
                </TableHead>
                {/* Table Body */}
                <TableBody>
                  {[
                    // { label: "ID", value: bankDetails.id },
                    
                    { label: "Customer Code", value: <b>{bankDetails.sapCode}</b> },

                    // {
                    //   label: "Customer",
                    //   value: bankDetails.customer
                    //     ? bankDetails.customer.companyName
                    //     : "N/A",
                    // },
                    { label: "Account Name", value: bankDetails.supplierName  },
                    // {
                    //   label: "Nature of Account",
                    //   value: bankDetails.natureOfAccount,
                    // },
                    { label: "Bank Name", value: bankDetails.bankName },
                    { label: "Branch Name", value: bankDetails.branchName },
                    { label: "IFSC Code", value: bankDetails.ifscCode },
                    {
                      label: "Account Number",
                      value: <b>{bankDetails.accountNumber}</b>,
                    },
                    // { label: "Supplier Name", value: bankDetails.supplierName },
                    { label: "Product Name", value: bankDetails.productName },
                  ].map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        "&:nth-of-type(even)": { backgroundColor: "#fafafa" },
                      }}
                    >
                      <TableCell
                        sx={{
                          fontWeight: 500,
                          border: "1px solid #ddd",
                          textAlign: "center",
                        }}
                      >
                        {index + 1}
                      </TableCell>
                      <TableCell
                        variant="title"
                        sx={{
                          fontWeight: 500,
                          border: "1px solid #ddd",
                          textAlign: "center",
                        }}
                      >
                        {row.label}
                      </TableCell>
                      <TableCell
                        variant="title"
                        sx={{ border: "1px solid #ddd", textAlign: "center" }}
                      >
                        {row.value || "N/A"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default ViewCustomerBank;
