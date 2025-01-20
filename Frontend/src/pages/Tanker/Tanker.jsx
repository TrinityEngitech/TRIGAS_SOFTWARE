import { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Pagination,
  Box,
  Typography,
  IconButton,
  Switch,
} from "@mui/material";
import { Edit, Add } from "@mui/icons-material";
import { useNavigate, Link } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import { LuArrowDownUp } from "react-icons/lu";
import { FaEye } from "react-icons/fa";

function Tanker() {
  const [tanker, setTanker] = useState([]);
  const [statusFilter, setStatusFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  console.log(tanker);
  // const handleUpdate = async (e) => {
  //   e.preventDefault();
  //   try {
  //     // Update the company details via PUT request
  //     console.log("Sending PUT request with data:", data); // Log the data being sent
  //     const response = await axios.put(
  //       `http://localhost:3000/api/transporters/transporterCompany/${id}`,
  //       data
  //     );
  //     console.log("Company updated:", response.data);
  
  //     // Check if the PUT request was successful
  //     if (response.status === 200) {
  //       // Re-fetch tanker data to reflect updated transporterName
  //       console.log("Fetching tankers after update...");
  //       const tankerData = await fetchTankers();
  //       if (tankerData) {
  //         console.log("Tankers fetched:", tankerData);
  //         setTanker(tankerData); // Update state with the fetched tanker data
  //       }
  //     } else {
  //       console.error("Failed to update company, response status:", response.status);
  //     }
  //   } catch (error) {
  //     console.error("Error updating company:", error);
  //   }
  // };
  
  // // Fetch Tanker Data Function
  // const fetchTankers = async () => {
  //   try {
  //     console.log("Fetching tankers...");
  //     const response = await axios.get("http://localhost:3000/api/tankers/");
  //     if (response.data && Array.isArray(response.data.data)) {
  //       return response.data.data; // Return tanker data
  //     } else {
  //       console.error("Unexpected response format:", response.data);
  //       return null;
  //     }
  //   } catch (error) {
  //     console.error("Error fetching tankers:", error);
  //     return null;
  //   }
  // };
  
  
  

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/tankers/")
      .then((response) => {
        console.log("Full response:", response); // Log the full response to check its structure

        // Assuming the array of tankers is inside 'data'
        if (Array.isArray(response.data)) {
          setTanker(response.data); // If the data is directly an array
        } else if (response.data && Array.isArray(response.data.data)) {
          setTanker(response.data.data); // If the array is inside 'data' field
        } else {
          console.error("Received data is not an array:", response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching tankers:", error);
      });
  }, []);

  const handleToggleActive = async (tankerId, currentStatus) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/tanker/toggle/${tankerId}`
      );
      console.log("Tanker status toggled:", response.data);
      setTanker((prevTanker) =>
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

  const navigate = useNavigate();

  const [nameSortOrder, setNameSortOrder] = useState(null);
  const [dateSortOrder, setDateSortOrder] = useState(null);

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredTanker = tanker
    .filter((tanker) => {
      const matchesSearchQuery =
        tanker.tankerNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tanker.createDate && tanker.createDate.includes(searchQuery));

      const matchesStatus =
        statusFilter === null || tanker.activeStatus === statusFilter;

      return matchesSearchQuery && matchesStatus;
    })
    .sort((a, b) => {
      if (nameSortOrder) {
        return nameSortOrder === "asc"
          ? a.tankerNumber.localeCompare(b.tankerNumber)
          : b.tankerNumber.localeCompare(a.tankerNumber);
      }
      if (dateSortOrder) {
        return dateSortOrder === "asc"
          ? new Date(a.createDate) - new Date(b.createDate)
          : new Date(b.createDate) - new Date(a.createDate);
      }
      return 0;
    });

  const paginatedTanker = filteredTanker.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleSortByName = () => {
    setNameSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    setDateSortOrder(null);
  };

  const handleSortByDate = () => {
    setDateSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    setNameSortOrder(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);

    return `${day}/${month}/${year} | ${hours}:${minutes}`;
  };

  return (
    <Box p={3}>
      {/* Header */}
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
          Tanker Listing
        </Typography>
      </Box>
      <Box>
        <Typography
          variant="subtitle1"
          sx={{ color: "grey.600", mb: 5, marginLeft: "60px" }}
        >
          Dashboard / Tanker Listing
        </Typography>
      </Box>

      <Box sx={{ background: "#fff", borderRadius: "20px", padding: "20px" }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
          mt={5}
        >
          <Box display="flex" gap={2}>
            <TextField
              placeholder="Search"
              variant="outlined"
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{
                height: "40px",
                "& .MuiInputBase-root": { height: "40px" },
              }}
            />
            <Button
              variant="outlined"
              color="success"
              onClick={() => handleStatusFilter(true)}
            >
              Active
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleStatusFilter(false)}
            >
              Inactive
            </Button>
          </Box>
          <Link to="/addTanker">
            <Button
              variant="contained"
              startIcon={<Add />}
              color="primary"
              sx={{ p: 1 }}
            >
              Add Tanker
            </Button>
          </Link>
        </Box>

        {/* Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
             
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Tanker Name
                  <IconButton onClick={handleSortByName}>
                    {nameSortOrder === "asc" ? (
                      <LuArrowDownUp className="fs-6" />
                    ) : (
                      <LuArrowDownUp className="fs-6" />
                    )}
                  </IconButton>
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  License Capacity(Tons)
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Driver
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Created On
                  <IconButton onClick={handleSortByDate}>
                    {dateSortOrder === "asc" ? (
                      <LuArrowDownUp className="fs-6" />
                    ) : (
                      <LuArrowDownUp className="fs-6" />
                    )}
                  </IconButton>
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Is Active?
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Action
                </TableCell>
                {/* <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Documents
                </TableCell> */}
              </TableRow>
            </TableHead>

            {/* Table Body */}
            <TableBody>
              {paginatedTanker.map((tanker) => (
                <TableRow key={tanker.id}>
                  
                  <TableCell align="center">{tanker.tankerNumber}</TableCell>
                  <TableCell align="center">{tanker.licenseCapacity}</TableCell>
                  <TableCell align="center">{tanker.driverName}</TableCell>
                  <TableCell align="center">
                    {formatDate(tanker.createdAt)}
                  </TableCell>
                  <TableCell align="center">
                    <Switch
                      checked={tanker.activeStatus}
                      onChange={() =>
                        handleToggleActive(tanker.id, tanker.activeStatus)
                      }
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Link to={`/viewTanker/${tanker.id}`}>
                      <IconButton color="dark">
                        <FaEye />
                      </IconButton>
                    </Link>
                    <Link to={`/editTanker/${tanker.id}`}>
                      <IconButton>
                        <Edit />
                      </IconButton>
                    </Link>
                  </TableCell>
                  {/* Display Documents */}
                  {/* <TableCell align="center">
                    {tanker.documents && tanker.documents.length > 0 ? (
                      tanker.documents.map((doc, index) => (
                        <Box key={index}>
                          <Typography variant="body2">{doc.documentType}</Typography>
                          <a
                            href={`http://localhost:3000/uploads/${doc.documentFile}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                          >
                            {doc.documentFile}
                          </a>
                        </Box>
                      ))
                    ) : (
                      <Typography>No Documents</Typography>
                    )}
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Box mt={3} display="flex" justifyContent="center">
          <Pagination
            count={Math.ceil(tanker.length / rowsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            sx={{ mt: 3 }}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default Tanker;
