import { useNavigate, Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  Button,
  Pagination,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import axiosInstance from "../../Authentication/axiosConfig";

function TankerNumber() {
  const navigate = useNavigate();
  const [tankerNumber, setTankerNumber] = useState(null); // Initialize as an array
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Fetch data from API
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(
          `/transporters/transporterId/${id}`
        );
        setTankerNumber(response.data.tankers || []); // Ensure data is an array
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

console.log(tankerNumber);

const groupByProduct = (data) => {

  if (!Array.isArray(data)) return {}; // Safeguard if data is not an array


  return data.reduce((acc, tanker) => {
    const product = tanker.product || "Unknown"; // Fallback for missing product
    if (!acc[product]) {
      acc[product] = [];
    }
    acc[product].push(tanker);
    return acc;
  }, {});
};

const groupedTankers = groupByProduct(tankerNumber);



  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!tankerNumber.length) {
    return <Typography>No data available.</Typography>;
  }


  // Handle search by tanker number
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredTankerNumbers = tankerNumber.filter((tanker) =>
    tanker.tankerNumber.toString().includes(searchQuery) // Assuming tankerNumber is a field in the response
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  
  // Handle toggle change (active status)
  const handleToggleActive = async (tankerId, currentStatus) => {
    try {
      const response = await axiosInstance.put(
        `/tankers/toggle/${tankerId}`
      );
      console.log("Tanker status toggled:", response.data);
      setTankerNumber((prevTanker) =>
        prevTanker.map((tanker) =>
          tanker.id === tankerId
            ? { ...tanker, activeStatus: !currentStatus }
            : tanker
        )
      );
    } catch (error) {
      console.error("Error toggling tanker status:", error);
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
          Tanker Numbers
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
          / Tanker Numbers
        </Typography>
      </Box>

        {/* Tanker Statistics Section */}
        <Typography variant="h6" gutterBottom>
        Tanker Statistics
      </Typography>

      {/* Accordion for Tanker Details */}
      <Grid container spacing={2}>
      {Object.keys(groupedTankers).map((product) => (
        <Grid item xs={12} md={4} key={product}>
          <Accordion
            sx={{
              border: "1px solid #0288d1",
            }}
          >
            <AccordionSummary
              expandIcon={
                <ExpandMoreIcon
                  sx={{ color: "#0288d1", border: "1px solid #0288d1" }}
                />
              }
              aria-controls={`${product}-content`}
              id={`${product}-header`}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 2,
              }}
            >
              <Box>
                <Typography sx={{fontSize:"18px"}}>{product}</Typography>
                <Typography
                  sx={{
                    color: "#0288d1",
                    fontWeight: "bold",
                    fontSize: "25px",
                  }}
                >
                  {groupedTankers[product].length}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell align="center">License Capacity</TableCell>
                    <TableCell align="center">Tanker Number</TableCell>
                  </TableRow>
                  {groupedTankers[product].map((tanker, index) => (
                    <TableRow key={index}>
                      <TableCell align="center">
                        {tanker.licenseCapacity || "N/A"}
                      </TableCell>
                      <TableCell align="center">
                        {tanker.tankerNumber || "N/A"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </AccordionDetails>
          </Accordion>
        </Grid>
      ))}
    </Grid>
      {/* Accordion for Tanker Details */}

      <Typography variant="h6" gutterBottom  sx={{ mt: 5 }}>
        Tanker Number Listing
      </Typography>

      <Box sx={{ background: "#fff", borderRadius: "20px", padding: "10px" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4} my={2}>
            <TextField
              placeholder="Search By Tanker Number"
              variant="outlined"
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{
                width: "100%",
                height: "40px",
                "& .MuiInputBase-root": { height: "40px" },
              }}
            />
          </Grid>
        </Grid>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Tanker Number
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Tanker Capacity
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Availability
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Product Name
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Status
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Geo Location
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTankerNumbers && filteredTankerNumbers.length > 0 ? (
                filteredTankerNumbers
                  .map((tanker) => (
                    <TableRow key={tanker.id}>
                      <TableCell align="center">{tanker.tankerNumber}</TableCell>
                      <TableCell align="center">{tanker.licenseCapacity}</TableCell>
                      <TableCell align="center">{tanker.availability}</TableCell>
                      <TableCell align="center">{tanker.product}</TableCell>
                      <TableCell align="center">
                      <Switch
                      checked={tanker.activeStatus}
                      onChange={() =>
                        handleToggleActive(
                          tanker.id,
                          tanker.activeStatus
                        )
                      }
                    />
                      </TableCell>
                      <TableCell align="center"><Button  variant="contained"
              
              color="primary"
              sx={{ p: 1 }}>GPS</Button></TableCell>
                      <TableCell align="center">
                        <Link to="#">
                          <IconButton color="error">
                            <DeleteIcon />
                          </IconButton>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No data found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box mt={3} display="flex" justifyContent="center">
          <Pagination
            count={Math.ceil(filteredTankerNumbers.length / rowsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            sx={{ mt: 3 }}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default TankerNumber;
