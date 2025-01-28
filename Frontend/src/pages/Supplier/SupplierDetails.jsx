import { useState, useEffect } from "react";
import {
  Box,
  CardContent,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from "@mui/material";
import { useNavigate, Link, useParams } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import axios from "axios";
import AnimatedLogoLoader from "../../component/AnimatedLogoLoader";
import axiosInstance from "../../Authentication/axiosConfig";

const SupplierDetails = () => {
  const { id } = useParams(); // Fetch supplier ID from route params
  const navigate = useNavigate();

  const [supplierDetails, setSupplierDetails] = useState({});
  const [contactDetails, setContactDetails] = useState([]);
  const [products, setProducts] = useState([]);
  const [banks, setBanks] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  // Fetch supplier and product data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true); // Start loading

        const response = await axiosInstance.get(
          `/supplier/${id}`
        );
        const supplier = response.data;

        console.log("fetch", supplier);

        setSupplierDetails({
          supplierName: supplier.name,
          email: supplier.email,
          supplierLocations: Array.isArray(supplier.locations)
            ? supplier.locations
            : [],
          zipCode: supplier.zipCode,
          gstNumber: supplier.gstNumber,
          panNumber: supplier.panNumber,
          supplierLogo: supplier.supplierLogo,
          isActive: supplier.activeStatus,
        });

        setContactDetails(supplier.contacts || []);
        setProducts(supplier.products || []);
        setBanks(supplier.bankDetails || []);
      } catch (error) {
        console.error("Error fetching supplier details:", error);
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    fetchData();
  }, [id]);

  // ✅ Display Loader if still fetching data
  if (isLoading) {
    return <AnimatedLogoLoader />;
  }

  return (
    <Box sx={{ padding: 3 }}>
      {/* Header Section */}
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
          Supplier Details
        </Typography>
      </Box>

      {/* Breadcrumb Navigation */}
      <Box>
        <Typography
          variant="subtitle1"
          sx={{ color: "grey.600", mb: 5, marginLeft: "60px" }}
        >
          <Link to="/" style={{ textDecoration: "none" }}>
            Dashboard
          </Link>{" "}
          / Supplier Details
        </Typography>
      </Box>

      {/* Supplier Main Details */}
      <Box
        sx={{
          background: "#fff",
          borderRadius: "20px",
          marginBottom: "30px",
          padding: "20px",
        }}
      >
         <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
    }}
  >
    <Typography sx={{ fontWeight: "500", fontSize: "1.5rem" }}>
      {supplierDetails.supplierName}
    </Typography>

    {supplierDetails.supplierLogo && (
      <img
        src={`http://localhost:3000/${supplierDetails.supplierLogo}`}
        alt="Supplier Logo"
        style={{ width: "200px", height: "100px", objectFit:"contain" }}
      />
    )}
  </Box>
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell fontWeight="bold">Email Address</TableCell>
                <TableCell>{supplierDetails.email}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell fontWeight="bold">GST No.</TableCell>
                <TableCell>{supplierDetails.gstNumber}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell fontWeight="bold">PAN No.</TableCell>
                <TableCell>{supplierDetails.panNumber}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell fontWeight="bold">Status</TableCell>
                <TableCell>
                  <Chip
                    label={supplierDetails.isActive ? "Active" : "Inactive"}
                    color={supplierDetails.isActive ? "success" : "error"}
                    variant="outlined"
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* product detalis */}
      <Box
        sx={{
          background: "#fff",
          borderRadius: "20px",
          marginBottom: "30px",
        }}
      >
        <CardContent>
          <Typography
            className="fs-4"
            sx={{ marginBottom: "20px", fontWeight: "500" }}
          >
            Product Details
          </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Product Name
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Product Code
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Location</TableCell>
                  {/* <TableCell sx={{ fontWeight: "bold" }}>Zip Code</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {products.length > 0 ? (
                  products.map((product, index) => (
                    <TableRow key={index}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.code}</TableCell>
                      <TableCell>
                        {product.locations
                          ?.map((loc) => loc.location)
                          .join(", ") || "N/A"}
                      </TableCell>
                      {/* <TableCell>
                        {product.locations
                          ?.map((loc) => loc.zipCode)
                          .join(", ") || "N/A"}
                      </TableCell> */}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No product details available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Box>

      {/* bank detalis */}
      <Box
        sx={{
          background: "#fff",
          borderRadius: "20px",
          marginBottom: "30px",
        }}
      >
        <CardContent>
          <Typography
            className="fs-4"
            sx={{ marginBottom: "20px", fontWeight: "500" }}
          >
            Bank Details
          </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Account Name
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Account Number
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Nature of Account
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Bank Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Branch Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>IFSC Code</TableCell>
                  {/* <TableCell sx={{ fontWeight: "bold" }}>
                    Account Number
                  </TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {banks.length > 0 ? (
                  banks.map((bank, index) => (
                    <TableRow key={index}>
                      <TableCell>{bank.accountName}</TableCell>
                      <TableCell>{bank.accountNumber}</TableCell>
                      <TableCell>{bank.typeOfAccount}</TableCell>
                      <TableCell>{bank.bankName}</TableCell>
                      <TableCell>{bank.branchName}</TableCell>
                      <TableCell>{bank.ifscCode}</TableCell>
                      {/* <TableCell>{bank.accountNumber}</TableCell> */}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No bank details available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Box>

      {/* Contact Details */}
      <Box
        sx={{
          background: "#fff",
          borderRadius: "20px",
          marginBottom: "30px",
        }}
      >
        <CardContent>
          <Typography
            className="fs-4"
            sx={{ marginBottom: "20px", fontWeight: "500" }}
          >
            Contact Details
          </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Email Address
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Phone Number
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contactDetails.length > 0 ? (
                  contactDetails.map((contact, index) => (
                    <TableRow key={index}>
                      <TableCell>{contact.name}</TableCell>
                      <TableCell>{contact.email}</TableCell>
                      <TableCell>{contact.phoneNumber}</TableCell>
                      <TableCell>
                        <Chip
                          label={contact.activeStatus ? "Active" : "Inactive"}
                          color={contact.activeStatus ? "success" : "error"}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No contact details available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Box>
    </Box>
  );
};

export default SupplierDetails;
