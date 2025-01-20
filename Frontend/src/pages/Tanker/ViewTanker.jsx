import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  IconButton,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { ArrowBack,Delete } from "@mui/icons-material";
import { FaEye } from "react-icons/fa";

function ViewTanker() {
  const { id } = useParams(); // Extract the ID from the URL
  const [tanker, setTanker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [documentList, setDocumentList] = useState([
    { documentType: "", validFrom: "", validUpto: "", documentFile: "" },
  ]);
  console.log(documentList)
  const navigate = useNavigate();

  // Fetch tanker details by ID
  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/tankers/${id}`)
      .then((response) => {
        setTanker(response.data); // Set the fetched data to state
        setLoading(false); // Set loading to false once data is fetched
      })
      .catch((err) => {
        setError("Error fetching tanker details"); // Set error if there's an issue
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <Typography>Loading...</Typography>; // Show loading text while data is being fetched
  }

  if (error) {
    return <Typography color="error">{error}</Typography>; // Show error if something goes wrong
  }

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:3000/api/tankers/documents/${id}`);
      if (response.status === 200) {
        alert("Document deleted successfully");
        // Update your state to remove the deleted document
        setDocumentList((prevList) => prevList.filter((doc) => doc.id !== id));
      }
    } catch (error) {
      console.error("Error deleting document:", error);
      alert("Failed to delete the document.");
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
          View Tanker
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
          / View Tanker
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
        <Grid container spacing={2}>
          {/* Left Column */}
          <Grid item xs={12} sm={6}>
          <Typography sx={{ marginBottom: 2 }}>
              <strong>Transporter Name:</strong>
              {tanker.transporterName}
            </Typography>
            <Typography sx={{ marginBottom: 2 }}>
              <strong>Tanker Number:</strong>
              {tanker.tankerNumber}
            </Typography>
            <Typography sx={{ marginBottom: 2 }}>
              <strong>Chassis Number:</strong>
              {tanker.chassisNumber}
            </Typography>
            <Typography sx={{ marginBottom: 2 }}>
              <strong>Driver Name:</strong>
              {tanker.driverName}
            </Typography>
            <Typography sx={{ marginBottom: 2 }}>
              <strong>Engine Number:</strong>
              {tanker.engineNumber}
            </Typography>
            <Typography sx={{ marginBottom: 2 }}>
              <strong>License Capacity (Tons):</strong>
              {tanker.licenseCapacity}
            </Typography>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} sm={6}>
            <Typography sx={{ marginBottom: 2 }}>
              <strong>Gross Weight:</strong>
              {tanker.grossWeight}
            </Typography>
            <Typography sx={{ marginBottom: 2 }}>
              <strong>Product:</strong>
              {tanker.product}
            </Typography>
            <Typography sx={{ marginBottom: 2 }}>
              <strong>Tare Weight:</strong> {tanker.tareWeight}
            </Typography>
            <Typography sx={{ marginBottom: 2 }}>
              <strong>Created On:</strong>
              {new Date(tanker.createDate).toLocaleString()}
            </Typography>
            <Typography sx={{ marginBottom: 2 }}>
              <strong>Status:</strong>
              {tanker.activeStatus ? "Active" : "Inactive"}
            </Typography>
          </Grid>
        </Grid>

        <Typography  variant="h6"  sx={{ fontWeight: "bold",marginBottom: 2, marginTop: "20px" }}>
          Documents
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            {/* Table Header */}
            <TableHead>
              <TableRow>
                <TableCell align="center">
                  <strong>Document Type</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Valid From</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Valid Upto</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>View</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Action</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            {/* Table Body */}
            <TableBody>
              {tanker.documents && tanker.documents.length > 0 ? (
                tanker.documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell align="center">{doc.documentType}</TableCell>
                    <TableCell align="center">
                      {new Date(doc.validFrom).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center">
                      {new Date(doc.validUpto).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center">
                      {" "}
                      <a
                        href={`http://localhost:3000/${doc.documentFile}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaEye className="fs-5" />
                      </a>
                    </TableCell>
                    <TableCell align="center">
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(doc.id)}
                    >
                      <Delete />
                    </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <Typography>No documents available</Typography>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

    
    </Box>
  );
}

export default ViewTanker;
