import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  IconButton,
  Button,
  TextField,
  Pagination,
  Box,
  Typography,
} from "@mui/material";
import * as XLSX from "xlsx";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import { useNavigate, Link, useParams } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import { LuArrowDownUp } from "react-icons/lu";
import AnimatedLogoLoader from "../../component/AnimatedLogoLoader";
import axiosInstance from "../../Authentication/axiosConfig";

function DoSoNumber() {
  const navigate = useNavigate();

  const { id } = useParams();

  console.log(id);

  // States to handle data, search, pagination, sorting, and file import
  const [number, setNumber] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const [nameSortOrder, setNameSortOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle file import

  // Fetching data from the API
  useEffect(() => {
    const fetchDoSoRecords = async () => {
      try {
        // Make the API call using the provided id
        const response = await fetch(
          `http://localhost:3000/api/supplier/addDoso/${id}`
        );
        const result = await response.json();

        if (response.ok) {
          setNumber(result.data); // Store the fetched data in state
        } else {
          //   alert(result.message || "Failed to fetch records.");
        }
      } catch (error) {
        console.error("Error fetching data from the server:", error);
        alert("There was an error while fetching the data.");
      } finally {
        setLoading(false); // Stop loading after data fetch is complete
      }
    };

    fetchDoSoRecords(); // Call the function to fetch data when the component mounts
  }, [id]); // Re-fetch data when the id changes


  const handleFileImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const data = event.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      // Define the required columns
      const requiredColumns = [
        "Supplier Name",
        "Customer Name",
        "Customer Code",
        "Product Code",
        "Product",
        "Loading Point",
        "DO/SO Number",
      ];

      // Check if the uploaded file matches the required columns
      const fileColumns = Object.keys(jsonData[0] || {});
      const isValidFormat = requiredColumns.every((col) =>
        fileColumns.includes(col)
      );

      if (!isValidFormat) {
        alert(
          "Invalid file format. Please upload a file with the correct structure."
        );
        setLoading(false);
        return;
      }

      // Process the data to match the expected format
      const formattedData = jsonData.map((item) => ({
        supplierName: item["Supplier Name"],
        customerName: item["Customer Name"],
        customerCode: item["Customer Code"],
        productCode: item["Product Code"],
        productName: item["Product"],
        loadingPoint: item["Loading Point"],
        doSoNumber: item["DO/SO Number"],
      }));

      // Log the formatted data
      console.log("Formatted Data:", formattedData);

      // Now, send the data to your API after logging
      try {
        const response = await fetch(
          "http://localhost:3000/api/supplier/addDoso",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              supplierId: id, // Set your supplierId or get from your state/context
              doso: formattedData,
            }),
          }
        );

        if (response.ok) {
          const responseData = await response.json();
          alert("Data successfully uploaded!");
          console.log("Response:", responseData);

          // Refresh the page after successful data upload
          window.location.reload(); // This will reload the page
        } else {
          alert("Failed to upload data");
          console.error("Error:", response.statusText);
        }
      } catch (error) {
        alert("Error sending data");
        console.error("Error:", error);
      }

      setLoading(false);
    };

    reader.readAsBinaryString(file);
  };

  // Filtering and sorting
  const filterednumber = number
    .filter((item) => {
      const matchesSearchQuery =
        item.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.customerCode.includes(searchQuery) ||
        item.productCode.includes(searchQuery) ||
        item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.loadingPoint.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.doSoNumber.includes(searchQuery);

      return matchesSearchQuery;
    })
    .sort((a, b) => {
      if (nameSortOrder) {
        return nameSortOrder === "asc"
          ? a.supplierName.localeCompare(b.supplierName)
          : b.supplierName.localeCompare(a.supplierName);
      }
      return 0;
    });

  const paginatednumber = filterednumber.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleSortByName = () => {
    setNameSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  return (
    <div>
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
            DO/SO Number Listing
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
            / DO/SO Number Listing
          </Typography>
        </Box>

        <Box
          sx={{
            background: "#fff",
            borderRadius: "20px",
            padding: "20px 20px 30px 20px",
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  placeholder="Search"
                  sx={{
                    width: "100%",
                    height: "40px",
                    "& .MuiInputBase-root": { height: "40px" },
                  }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </Grid>
            </Grid>

            <Button
              variant="contained"
              startIcon={<SaveAltIcon />}
              color="primary"
              sx={{ p: 1 }}
              component="label"
            >
              Import
              <input
                type="file"
                accept=".xlsx,.xls"
                style={{ display: "none" }}
                onChange={handleFileImport}
              />
            </Button>
          </Box>

          {loading ? (
            <AnimatedLogoLoader /> // Show loading spinner while data is being imported
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      Supplier Name{" "}
                      <IconButton onClick={handleSortByName}>
                        {nameSortOrder === "asc" ? (
                          <LuArrowDownUp className="fs-6" />
                        ) : (
                          <LuArrowDownUp className="fs-6" />
                        )}
                      </IconButton>
                    </TableCell>
                    
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      Customer Name
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      Customer Code
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      Product Code
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      Product
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      Loading Point
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      DO/SO Number
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {number.length > 0 ? (
                    paginatednumber.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell align="center">
                          {item.supplierName}
                        </TableCell>
                        <TableCell align="center">
                          {item.customerName}
                        </TableCell>
                        <TableCell align="center">
                          {item.customerCode}
                        </TableCell>
                        <TableCell align="center">
                          {item.productCode}
                        </TableCell>
                        <TableCell align="center">{item.productName}</TableCell>
                        <TableCell align="center">
                          {item.loadingPoint}
                        </TableCell>
                        <TableCell align="center">{item.doSoNumber}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography variant="h6" color="textSecondary">
                          No data found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <Box mt={3} display="flex" justifyContent="center">
            <Pagination
              count={Math.ceil(filterednumber.length / rowsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
            />
          </Box>
        </Box>
      </Box>
    </div>
  );
}

export default DoSoNumber;
