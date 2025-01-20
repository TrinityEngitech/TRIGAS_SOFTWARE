import React, { useState, useEffect } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from "@mui/material";
import { Edit, Add } from "@mui/icons-material";
import { useNavigate, Link } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import { LuArrowDownUp } from "react-icons/lu";
import AnimatedLogoLoader from "../component/AnimatedLogoLoader";
import OutlinedInput from "@mui/material/OutlinedInput";

function SupplierLocation() {
  const [selectedRows, setSelectedRows] = useState([]);

  // State for locations data
  const [locations, setLocations] = useState([]);
  const [statusFilter, setStatusFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Modal State for Add/Edit location
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [modalData, setModalData] = useState({
    id: null,
    LocationName: "",
    latitude: "",
    longitude: "",
    isActive: true,
  });

  const navigate = useNavigate();

  // Fetch locations from the API
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/SupplyLocations/supply-locations")
      .then((response) => {
        console.log(response.data); // Check the structure of the response data
        if (Array.isArray(response.data)) {
          setLocations(response.data); // Set locations if the response is an array
        } else {
          console.error("Received data is not an array");
        }
      })
      .catch((error) => {
        console.error("Error fetching locations:", error);
      });
  }, []);

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleEdit = (location) => {
    setModalData(location); // Ensure location has LocationName, activeStatus
    setIsEditing(true);
    setModalOpen(true);
  };

  const handleSavelocation = () => {
    // Prepare the location data for submission
    const newlocation = {
      LocationName: modalData.LocationName, // Corrected reference here
      latitude: modalData.latitude || 0, // Default to 0 if not provided
      longitude: modalData.longitude || 0, // Default to 0 if not provided
      activeStatus:
        modalData.isActive !== undefined ? modalData.isActive : true, // Default to true if not provided
    };

    console.log("location Data:", newlocation); // Log the data being sent to the server

    // Ensure LocationName is provided
    if (!newlocation.LocationName) {
      console.error("Error: Missing location name");
      return; // Stop execution if location name is missing
    }

    // If there's an existing location ID, perform a PUT request to update it
    if (modalData.id) {
      // Perform the PUT request to update the location
      axios
        .put(
          `http://localhost:3000/api/SupplyLocations/supply-locations/${modalData.id}`,
          newlocation
        )
        .then((response) => {
          console.log("location updated:", response.data); // Log the response from the server
          // Update the state with the updated location
          setLocations((prev) =>
            prev.map((location) =>
              location.id === modalData.id ? response.data : location
            )
          );
        })
        .catch((error) => {
          console.error(
            "Error updating location:",
            error.response ? error.response.data : error.message
          );
        });
    } else {
      console.log(newlocation);

      // Perform the POST request to add the new location
      axios
        .post(
          "http://localhost:3000/api/SupplyLocations/supply-locations",
          newlocation
        )
        .then((response) => {
          console.log("location added:", response.data); // Log the response from the server
          // Update the state with the new location
          setLocations((prev) => [...prev, response.data]);
        })
        .catch((error) => {
          console.error(
            "Error adding location:",
            error.response ? error.response.data : error.message
          );
        });
    }

    // Close the modal after saving
    setModalOpen(false);
  };

  // Handle toggle change (active status)
  const handleToggleActive = async (locationId, currentStatus) => {
    try {
      const response = await axios.put(
        // `http://localhost:3000/api/SupplyLocations/supply-locations${locationId}`
        `http://localhost:3000/api/SupplyLocations/supply-locations/${locationId}`
      );
      console.log("location status toggled:", response.data);

      // Update the state directly
      setLocations((prevlocations) =>
        prevlocations.map((location) =>
          location.id === locationId
            ? { ...location, activeStatus: !currentStatus } // Toggle status in the UI
            : location
        )
      );
    } catch (error) {
      console.error("Error toggling location status:", error);
    }
  };

  // filter/search/pagination/datetime format
  // Sorting states
  const [nameSortOrder, setNameSortOrder] = useState(null); // null | 'asc' | 'desc'
  const [dateSortOrder, setDateSortOrder] = useState(null); // null | 'asc' | 'desc'

  const handleStatusFilter = (status) => {
    setStatusFilter(status); // Set the filter to active, inactive, or null
  };

  // search-pagination
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredTankers = locations
    .filter((location) => {
      const matchesSearchQuery = location.LocationName.toLowerCase().includes(
        searchQuery.toLowerCase()
      );

      const matchesStatus =
        statusFilter === null || location.activeStatus === statusFilter;

      return matchesSearchQuery && matchesStatus;
    })
    .sort((a, b) => {
      if (nameSortOrder) {
        return nameSortOrder === "asc"
          ? a.LocationName.localeCompare(b.LocationName)
          : b.LocationName.localeCompare(a.LocationName);
      }
      if (dateSortOrder) {
        return dateSortOrder === "asc"
          ? new Date(a.createDate) - new Date(b.createDate)
          : new Date(b.createDate) - new Date(a.createDate);
      }
      return 0;
    });

  const paginatedlocations = filteredTankers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Sorting logic
  const handleSortByName = () => {
    setNameSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    setDateSortOrder(null); // Reset date sorting
  };

  const handleSortByDate = () => {
    setDateSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    setNameSortOrder(null); // Reset name sorting
  };

  // datetime
  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const day = ("0" + date.getDate()).slice(-2); // Adds leading zero if day is single digit
    const month = ("0" + (date.getMonth() + 1)).slice(-2); // Adds leading zero if month is single digit
    const year = date.getFullYear();
    const hours = ("0" + date.getHours()).slice(-2); // Adds leading zero if hours are single digit
    const minutes = ("0" + date.getMinutes()).slice(-2); // Adds leading zero if minutes are single digit

    return `${day}/${month}/${year} | ${hours}:${minutes}`;
  };

  // // assocate supplier
  // const [product, setProduct] = useState([]);

  // // // Mock Supplier Data
  // const productOptions = ["PROPANE", "LPG", "BUTANE", ""];

  // const handleProductChange = (event) => {
  //   const {
  //     target: { value },
  //   } = event;
  //   setProduct(typeof value === "string" ? value.split(",") : value);
  // };

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
          Supply Location Listing
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
          / Supply Location Listing
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
          mt={5}
        >
          <Box display="flex" gap={2}>
            <TextField
              placeholder="Search"
              variant="outlined"
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{
                height: "40px", // Adjust the height
                "& .MuiInputBase-root": {
                  height: "40px", // Matches the parent height
                },
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

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setModalData({ id: null, LocationName: "", isActive: true });
              setIsEditing(false);
              setModalOpen(true);
            }}
            color="primary"
            sx={{ p: 1 }}
          >
            Add New location
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Location Name
                  <IconButton onClick={handleSortByName}>
                    {nameSortOrder === "asc" ? (
                      <LuArrowDownUp className="fs-6" />
                    ) : (
                      <LuArrowDownUp className="fs-6" />
                    )}
                  </IconButton>
                </TableCell>
                {/* <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Product Name
                  <IconButton onClick={handleSortByName}>
                    {nameSortOrder === "asc" ? (
                      <LuArrowDownUp className="fs-6" />
                    ) : (
                      <LuArrowDownUp className="fs-6" />
                    )}
                  </IconButton>
                </TableCell> */}
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Latitude
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Longitude
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
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Avaliblity
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedlocations.length === 0 ? (
                // Show loader when there are no locations
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    {/* <AnimatedLogoLoader /> */}
                  </TableCell>
                </TableRow>
              ) : (
                // Render locations if available
                paginatedlocations.map((location) => (
                  <TableRow key={location.id}>
                    <TableCell align="center">
                      {location.LocationName}
                    </TableCell>
                    <TableCell align="center">{location.latitude}</TableCell>
                    <TableCell align="center">{location.longitude}</TableCell>
                    {/* <TableCell align="center">
                      {location.ProdductName}
                    </TableCell> */}
                    <TableCell align="center">
                      {formatDate(location.createDate)}
                    </TableCell>
                    <TableCell align="center">
                      <Switch
                        checked={location.activeStatus}
                        onChange={() =>
                          handleToggleActive(location.id, location.activeStatus)
                        }
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={() => handleEdit(location)}
                        color="primary"
                      >
                        <Edit />
                      </IconButton>
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <Link
                        to="/manageAvaliblity"
                        style={{
                          textDecoration: "none",
                        }}
                      >
                        Manage Availability
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* pagination */}
        <Box mt={3} display="flex" justifyContent="center">
          <Pagination
            count={Math.ceil(filteredTankers.length / rowsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            sx={{ mt: 3 }}
          />
        </Box>

        {/* Modal for Add/Edit location */}
        <Dialog
          open={isModalOpen}
          onClose={handleModalClose}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {isEditing ? "Edit Location" : "Add Location"}
          </DialogTitle>
          <DialogContent sx={{ padding: "24px" }}>
            <TextField
              fullWidth
              label="Loading Point(location Name)"
              variant="outlined"
              value={modalData.LocationName} // Ensure it's bound to the state
              onChange={(e) =>
                setModalData((prev) => ({
                  ...prev,
                  LocationName: e.target.value.toUpperCase(), // Convert to uppercase
                }))
              }
              sx={{ margin: "8px 0" }}
            />

            {/* <FormControl fullWidth>
              <InputLabel id="Produtcs">Produtcs</InputLabel>
              <Select
                labelId="Produtcs"
                multiple
                value={product}
                onChange={handleProductChange}
                input={<OutlinedInput label="Produtcs" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {productOptions.map((product) => (
                  <MenuItem key={product} value={product}>
                    {product}
                  </MenuItem>
                ))}
              </Select>
            </FormControl> */}

            <TextField
              fullWidth
              label="Latitude"
              variant="outlined"
              value={modalData.latitude} // Change to LocationName
              onChange={
                (e) =>
                  setModalData((prev) => ({
                    ...prev,
                    latitude: e.target.value,
                  })) // Change to LocationName
              }
              sx={{ margin: "8px 0" }}
            />
            <TextField
              fullWidth
              label="Longitude"
              variant="outlined"
              value={modalData.longitude} // Change to LocationName
              onChange={
                (e) =>
                  setModalData((prev) => ({
                    ...prev,
                    longitude: e.target.value,
                  })) // Change to LocationName
              }
              sx={{ margin: "8px 0" }}
            />
          </DialogContent>
          <DialogActions sx={{ padding: "16px 24px" }}>
            <Button onClick={handleModalClose} color="error" variant="outlined">
              Cancel
            </Button>
            <Button
              onClick={handleSavelocation}
              color="primary"
              variant="contained"
              disabled={!modalData.LocationName.trim()} // Change to LocationName
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

export default SupplierLocation;
