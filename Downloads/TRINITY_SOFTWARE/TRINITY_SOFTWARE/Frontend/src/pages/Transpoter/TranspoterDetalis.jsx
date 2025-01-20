import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,

  Paper,
  Button,
} from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate, Link, useParams } from "react-router-dom";
import axios from "axios";
import { ArrowBack,Delete } from "@mui/icons-material";
import { FaEye } from "react-icons/fa";


const TranspoterDetalis = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Extract the ID from the URL
  const [data, setData] = useState(null); // State to store fetched data

  const [loading, setLoading] = useState(true); // State to manage loading state
  const [tankerList, setTankerList] = useState([]);

  const [documentList, setDocumentList] = useState([
    { documentType: "", validFrom: "", validUpto: "", documentFile: "" },
  ]);

  console.log(documentList);
  
  useEffect(() => {
    // Fetch data from API
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/transporters/transporterId/${id}`); // Replace with your API endpoint
        setData(response.data); // Set the fetched data
        console.log(response.data);
        
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Set loading to false once fetch is complete
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!data) {
    return <Typography>No data available.</Typography>;
  }


  
  
console.log(tankerList);


  const handleDelete = async (tankerId) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this tanker?");
      if (!confirmDelete) return;
  
      await axios.delete(`http://localhost:3000/api/transporters/deleteTanker/${tankerId}`);
  
      alert("Tanker deleted successfully!");
      // Remove the deleted tanker from the state
      setTankerList((prev) => prev.filter((tanker) => tanker.id !== tankerId));
      window.location.reload();

    } catch (error) {
      console.error("Error deleting tanker:", error);
      alert("Failed to delete the tanker. Please try again.");
    }
  };
  


  const handledocumentDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:3000/api/tankers/documents/${id}`);
      if (response.status === 200) {
        alert("Document deleted successfully");
        // Update your state to remove the deleted document
        setDocumentList((prevList) => prevList.filter((doc) => doc.id !== id));
      }
      window.location.reload();

    } catch (error) {
      console.error("Error deleting document:", error);
      alert("Failed to delete the document.");
    }
  };


  return (
    <Box sx={{ padding: 3 }}>
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
          Transporter Details
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
          / Transporter Details
        </Typography>
      </Box>

      {/* Transporter Details */}
      <Box
        sx={{
          background: "#fff",
          borderRadius: "20px",
          marginBottom: "30px",
          padding: "20px",
        }}
      >
        <Typography
        
          sx={{ fontWeight: "500", marginBottom: "30px",fontSize:"27px" }}
        >
          {data?.transporterName}
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Typography sx={{ marginBottom: 2 }}>
              <strong>Email:</strong> {data?.email}
            </Typography>
            <Typography sx={{ marginBottom: 2 }}>
              <strong>Address 1:</strong> {data?.address1}
            </Typography>
            <Typography sx={{ marginBottom: 2 }}>
              <strong>Address 2:</strong> {data?.address2}
            </Typography>
            <Typography sx={{ marginBottom: 2 }}>
              <strong>Zip Code:</strong> {data?.zipCode}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography sx={{ marginBottom: 2 }}>
              <strong>State:</strong> {data?.state}
            </Typography>
            <Typography sx={{ marginBottom: 2 }}>
              <strong>District:</strong> {data?.district}
            </Typography>
            <Typography sx={{ marginBottom: 2 }}>
              <strong>City:</strong> {data?.city}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography sx={{ marginBottom: 2 }}>
              <strong>Type of Company:</strong> {data?.typeOfCompany}
            </Typography>
            <Typography sx={{ marginBottom: 2 }}>
              <strong>PAN Number:</strong> {data?.panNumber}
            </Typography>
            <Typography sx={{ marginBottom: 2 }}>
              <strong>GST Number:</strong> {data?.gstNumber}
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Contact Details */}
      <Box
        sx={{
          background: "#fff",
          borderRadius: "20px",
          marginBottom: "30px",
          padding: "20px",
        }}
      >
        <Typography
          sx={{ fontWeight: "500", marginBottom: "30px" ,fontSize:"25px"}}
        >
          Contact Details
        </Typography>

        {data.contacts?.map((contact, index) => (
          <Grid container spacing={2} key={index}>
            <Grid
              item
              xs={12}
              sm={9}
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <Typography sx={{ marginBottom: 2 }}>
                <strong>Name:</strong> {contact.contactName}
              </Typography>
              <Typography sx={{ marginBottom: 2 }}>
                <strong>Role:</strong> {contact.role}
              </Typography>
              <Typography sx={{ marginBottom: 2 }}>
                <strong>Email:</strong> {contact.email}
              </Typography>
              <Typography sx={{ marginBottom: 2 }}>
                <strong>Phone Number:</strong> {contact.phoneNumber}
              </Typography>
            </Grid>
          </Grid>
        ))}
      </Box>

      {/* Bank Details */}
      <Box
        sx={{
          background: "#fff",
          borderRadius: "20px",
          marginBottom: "30px",
          padding: "20px",
        }}
      >
        <Typography
          
          sx={{ fontWeight: "500", marginBottom: "30px" ,fontSize:"25px"}}
        >
          Bank Details
        </Typography>

        {data.bankDetails?.map((bank, index) => (
          <Grid container spacing={2} key={index}>
            <Grid item xs={12} sm={4}>
              <Typography sx={{ marginBottom: 2 }}>
                <strong>Account Name:</strong> {bank.accountName}
              </Typography>
              <Typography sx={{ marginBottom: 2 }}>
                <strong>Nature Of Account:</strong> {bank.natureOfAccount}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography sx={{ marginBottom: 2 }}>
                <strong>Bank Name:</strong> {bank.bankName}
              </Typography>
              <Typography sx={{ marginBottom: 2 }}>
                <strong>Branch Name:</strong> {bank.branchName}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography sx={{ marginBottom: 2 }}>
                <strong>IFSC Code:</strong> {bank.ifscCode}
              </Typography>
              <Typography sx={{ marginBottom: 2 }}>
                <strong>Bank Account Number:</strong> {bank.accountNumber}
              </Typography>
            </Grid>
          </Grid>
        ))}
      </Box>

      {/* Tanker Details */}
      <Box
        sx={{
          background: "#fff",
          borderRadius: "20px",
          marginBottom: "35px",
          padding: "20px",
        }}
      >
        <Typography
         
          sx={{ fontWeight: "500", marginBottom: "30px",fontSize:"25px" }}
        >
          Tanker Details
        </Typography>
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Tanker Number</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Tanker Capacity</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Product</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Action</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.tankers?.map((tanker, index) => (
                  <TableRow key={index}>
                    <TableCell>{tanker.tankerNumber}</TableCell>
                    <TableCell>{tanker.grossWeight}</TableCell>
                    <TableCell>{tanker.product}</TableCell>
                    <TableCell>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(tanker.id)} // Pass the tanker ID to handleDelete
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
      <Box sx={{
          background: "#fff",
          borderRadius: "20px",
          marginBottom: "30px",
          padding: "20px",
        }}>
      <Typography  sx={{ fontWeight: "bold", mb: 3,fontSize:"25px" }}>
        Transporter Tanker Documents
      </Typography>

      {data.tankers.map((tanker, index) => (
        <Box key={index} sx={{ mb: 4 }}>
          <Typography sx={{fontWeight: "bold"}}>
            Tanker: {tanker.tankerNumber} ({tanker.product})
          </Typography>

          {tanker.documents && tanker.documents.length > 0 ? (
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Document Type</strong></TableCell>
                    <TableCell><strong>Document File</strong></TableCell>
                    <TableCell><strong>Valid From</strong></TableCell>
                    <TableCell><strong>Valid Upto</strong></TableCell>
                    <TableCell><strong>Created Date</strong></TableCell>
                    <TableCell><strong>Action</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tanker.documents.map((doc, docIndex) => (
                    <TableRow key={docIndex}>
                      <TableCell>{doc.documentType}</TableCell>
                      <TableCell>
                        
                        <a
                                                href={`http://localhost:3000/${doc.documentFile}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                              >
                                                <FaEye className="fs-5" />
                                              </a>
                      </TableCell>
                      <TableCell>{new Date(doc.validFrom).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(doc.validUpto).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(doc.createDate).toLocaleDateString()}</TableCell>
                      <TableCell>                   
                      <IconButton
                      color="error"
                      onClick={() => handledocumentDelete(doc.id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography sx={{ mt: 2 }}>No documents available for this tanker.</Typography>
          )}
        </Box>
      ))}
    </Box>
    </Box>

  );
};

export default TranspoterDetalis;
