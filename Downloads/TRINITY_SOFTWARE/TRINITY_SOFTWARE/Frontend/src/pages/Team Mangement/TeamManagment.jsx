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
} from "@mui/material";
import { Edit, Add } from "@mui/icons-material";
import { useNavigate, Link } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import { LuArrowDownUp } from "react-icons/lu";
import { FaEye } from "react-icons/fa";
import AnimatedLogoLoader from '../../component/AnimatedLogoLoader';

function TeamManagement() {
  const [teams, setTeams] = useState([]);
  const [statusFilter, setStatusFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [modalData, setModalData] = useState({
    id: null,
    teamName: "",
    isActive: true,
  });
  // const [roles, setRoles] = useState([]);

  const navigate = useNavigate();

  // Fetch products from the API
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/teams")
      .then((response) => {
        console.log(response.data); // Check the structure of the response data
        if (Array.isArray(response.data)) {
          setTeams(response.data); // Set products if the response is an array
        } else {
          console.error("Received data is not an array");
        }
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  const handleModalClose = () => setModalOpen(false);

  // Handle toggle change (active status)
  const handleToggleActive = async (teamId, currentStatus) => {
    try {
      // Toggle the status on the server
      const response = await axios.patch(
        `http://localhost:3000/api/teams/${teamId}/toggle`
      );
      console.log("team status toggled:", response.data);

      // Update the state directly to reflect the toggled status in the UI
      setTeams((prevTeams) =>
        prevTeams.map((team) =>
          team.id === teamId
            ? { ...team, activeStatus: !currentStatus } // Toggle the status in the UI
            : team
        )
      );
    } catch (error) {
      console.error("Error toggling team status:", error);
    }
  };

  const handleEdit = (team) => {
    setModalData(team);
    setIsEditing(true);
    setModalOpen(true);
  };

  const handleSaveTeam = () => {
    const newTeam = {
      teamName: modalData.teamName,
      activeStatus:
        modalData.isActive !== undefined ? modalData.isActive : true,
    };

    if (!newTeam.teamName) {
      console.error("Error: Missing team name");
      return;
    }

    const url = modalData.id
      ? `http://localhost:3000/api/teams/${modalData.id}`
      : "http://localhost:3000/api/teams/";

    const request = modalData.id
      ? axios.put(url, newTeam)
      : axios.post(url, newTeam);

    request
      .then((response) => {
        if (modalData.id) {
          setTeams((prev) =>
            prev.map((team) =>
              team.id === modalData.id ? response.data : team
            )
          );
        } else {
          setTeams((prev) => [...prev, response.data]);
        }
      })
      .catch((error) => {
        console.error(
          "Error saving team:",
          error.response ? error.response.data : error.message
        );
      });

    setModalOpen(false);
  };

  // Sorting states
  const [nameSortOrder, setNameSortOrder] = useState(null);
  const [dateSortOrder, setDateSortOrder] = useState(null);
  const [leaderSortOrder, setleaderSortOrder] = useState(null);

  const handleStatusFilter = (status) => {
    setStatusFilter(status); // Set the filter to active or inactive
  };

  // search-pagination
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredTeams = teams
    .filter((team) => {
      const matchesSearchQuery =
      team.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (teams.createDate && teams.createDate.includes(searchQuery));

      const matchesStatus =
        statusFilter === null || team.activeStatus === statusFilter;

      return matchesSearchQuery && matchesStatus; // Filter by search and status
    })

    .sort((a, b) => {
      // Apply name sorting
      if (nameSortOrder) {
        return nameSortOrder === "asc"
          ? a.teamName.localeCompare(b.teamName)
          : b.teamName.localeCompare(a.teamName);
      }
      if (leaderSortOrder) {
        return leaderSortOrder === "asc"
          ? a.teamLeaderName - b.teamLeaderName
          : b.teamLeaderName - a.teamLeaderName;
      }
      // Apply date sorting
      if (dateSortOrder) {
        return dateSortOrder === "asc"
          ? new Date(a.createDate) - new Date(b.createDate)
          : new Date(b.createDate) - new Date(a.createDate);
      }
      return 0; // No sorting
    });

    const paginatedProducts = filteredTeams.slice(
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
          Team Listing
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
          / Team Listing
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
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setModalData({ id: null, teamName: "", isActive: true });
              setIsEditing(false);
              setModalOpen(true);
            }}
            color="primary"
          >
            Add Team
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Name
                  <IconButton onClick={handleSortByName}>
                    {nameSortOrder === "asc" ? (
                      <LuArrowDownUp className="fs-6" />
                    ) : (
                      <LuArrowDownUp className="fs-6" />
                    )}
                  </IconButton>
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Leader Name
                  <IconButton onClick={handleSortByName}>
                    {leaderSortOrder === "asc" ? (
                      <LuArrowDownUp className="fs-6" />
                    ) : (
                      <LuArrowDownUp className="fs-6" />
                    )}
                  </IconButton>
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
              </TableRow>
            </TableHead>
            <TableBody>
            {paginatedProducts.length === 0 ? (
                // Show loader when no products are available
                <TableRow>
                  <TableCell colSpan={5} align="center">
                     {/* <AnimatedLogoLoader />    */}
                  </TableCell>
                </TableRow>
              ) : (
              paginatedProducts.map((team) => (
                <TableRow key={team.id}>
                  <TableCell align="center">{team.teamName}</TableCell>
                  {/* Use conditional rendering to handle null or undefined values */}
                  <TableCell align="center">
                    {team.teamLeaderName || "Not Available"}
                  </TableCell>

                  <TableCell align="center">
                    {formatDate(team.createDate)}
                  </TableCell>
                  <TableCell align="center">
                    <Switch
                      checked={team.activeStatus}
                      onChange={() =>
                        handleToggleActive(team.id, team.activeStatus)
                      }
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Link to={`/viewTeams/${team.id}`}>
                      {/* // {`/supplierdetalils/${supplier.id}`} */}
                      <IconButton color="dark">
                        <FaEye />
                      </IconButton>
                    </Link>
                    <IconButton onClick={() => handleEdit(team)}>
                      <Edit />
                    </IconButton>
                  </TableCell>
                </TableRow>
               ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box mt={3} display="flex" justifyContent="center">
          <Pagination
            count={Math.ceil(teams.length / rowsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            sx={{ mt: 3 }}
          />
        </Box>
      </Box>

      {/* Modal for Add/Edit team */}
      <Dialog
        open={isModalOpen}
        onClose={handleModalClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{isEditing ? "Edit Team" : "Add Team"}</DialogTitle>
        <DialogContent sx={{ padding: "24px" }}>
          {/* Team Name Field */}
          <TextField
            fullWidth
            label="Team name"
            variant="outlined"
            value={modalData.teamName} // Bind value to teamName
            onChange={(e) =>
              setModalData((prev) => ({
                ...prev,
                teamName: e.target.value, // Update teamName in modal data
              }))
            }
            margin="normal"
          />
        </DialogContent>
        <DialogActions sx={{ padding: "16px 24px" }}>
          <Button onClick={handleModalClose} color="error" variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleSaveTeam} // Assuming this function is responsible for saving
            color="primary"
            variant="contained"
            disabled={!modalData.teamName.trim()} // Disable save if teamName is empty
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default TeamManagement;
