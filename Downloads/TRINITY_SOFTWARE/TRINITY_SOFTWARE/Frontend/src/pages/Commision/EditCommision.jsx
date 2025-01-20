import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
  Card,
  CardContent,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { Add, Close } from "@mui/icons-material";

const EditCommission = () => {
  const [supplier, setSupplier] = useState("");
  const [company, setCompany] = useState("");
  const [products, setProducts] = useState([]);
  const [loadingPorts, setLoadingPorts] = useState([]);
  const [validFrom, setValidFrom] = useState("");
  const [validUntil, setValidUntil] = useState(""); // New state for "Valid Until"
  const [commissionCriteria, setCommissionCriteria] = useState("");
  const [commissionRanges, setCommissionRanges] = useState([]);
  const [flatRate, setFlatRate] = useState("");

  const navigate = useNavigate();

  // Mock data (changed name to avoid conflicts)
  const supplierList = ["Supplier 1", "Supplier 2", "Supplier 3"];
  const companyList = ["Company A", "Company B"];
  const productsList = ["Product 1", "Product 2", "Product 3"];
  const loadingPortsList = ["Port 1", "Port 2", "Port 3"];

  // Handle adding a new commission range
  const addCommissionRange = () => {
    setCommissionRanges([
      ...commissionRanges,
      { id: Date.now(), from: "", to: "", cost: "" },
    ]);
  };

  // Handle updating a specific commission range
  const handleRangeChange = (index, field, value) => {
    const updatedRanges = [...commissionRanges];
    updatedRanges[index][field] = value;
    setCommissionRanges(updatedRanges);
  };
  // Function to remove a specific commission range
  const removeCommissionRange = (id) => {
    setCommissionRanges(commissionRanges.filter((range) => range.id !== id));
  };

  // Handle form submission
  const handleSubmit = () => {
    const formData = {
      supplier,
      company,
      products,
      loadingPorts,
      validFrom,
      validUntil, // Added validUntil to formData
      commissionCriteria,
      commissionRanges,
      flatRate,
    };

    console.log("Form Data Submitted:", formData);
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
          Edit Commision
        </Typography>
      </Box>
      <Box>
        <Typography
          variant="subtitle1"
          sx={{ color: "grey.600", mb: 5, marginLeft: "60px" }}
        >
          Dashboard / Edit Commision
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
          {/* 1 */}
          <Grid item xs={12} sm={6}>
            <Card sx={{ display: "flex" }}>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    backgroundColor: "primary.dark",
                    color: "#fff",
                    padding: "5px 10px",
                    borderRadius: "4px",
                    textAlign: "center",
                    border: `1px solid`,
                    borderColor: (theme) => theme.palette.primary.dark,
                  }}
                >
                  IOCL
                </Typography>
                <Grid container spacing={2}>
                  {/* Supplier Products */}
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Supplier Products</InputLabel>
                      <Select
                        label="Supplier Products"
                        multiple
                        value={products}
                        onChange={(e) => setProducts(e.target.value)}
                        renderValue={(selected) => selected.join(", ")}
                      >
                        {productsList.map((product) => (
                          <MenuItem key={product} value={product}>
                            <Checkbox
                              checked={products.indexOf(product) > -1}
                            />
                            <ListItemText primary={product} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Loading Ports */}
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Loading Point</InputLabel>
                      <Select
                        label="Loading Point"
                        multiple
                        value={loadingPorts}
                        onChange={(e) => setLoadingPorts(e.target.value)}
                        renderValue={(selected) => selected.join(", ")}
                      >
                        {loadingPortsList.map((port) => (
                          <MenuItem key={port} value={port}>
                            <Checkbox
                              checked={loadingPorts.indexOf(port) > -1}
                            />
                            <ListItemText primary={port} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Valid From */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      type="date"
                      label="Valid From"
                      InputLabelProps={{ shrink: true }}
                      value={validFrom}
                      onChange={(e) => setValidFrom(e.target.value)}
                    />
                  </Grid>

                  {/* Valid Until */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      type="date"
                      label="Valid Until"
                      InputLabelProps={{ shrink: true }}
                      value={validUntil}
                      onChange={(e) => setValidUntil(e.target.value)}
                    />
                  </Grid>

                  {/* Commission Criteria */}
                  <Grid item xs={12} md={12}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Commission Criteria</InputLabel>
                      <Select
                        value={commissionCriteria}
                        onChange={(e) => setCommissionCriteria(e.target.value)}
                        label="Commission Criteria"
                      >
                        <MenuItem value="Telescopic Telescopic">
                          Telescopic Telescopic
                        </MenuItem>
                        <MenuItem value="Telescopic Flat">
                          Telescopic Flat
                        </MenuItem>
                        <MenuItem value="Flat">Flat</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Commission Ranges */}
                  {(commissionCriteria === "Telescopic Telescopic" ||
                    commissionCriteria === "Telescopic Flat") && (
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center", // Align items vertically
                          justifyContent: "space-between", // Space between text and button
                          marginBottom: "5px", // Add spacing below the box
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{
                            color: "text.secondary",
                            fontWeight: "500",
                          }}
                        >
                          Commission Ranges
                        </Typography>
                        <Button
                          variant="outlined"
                          onClick={addCommissionRange}
                          sx={{
                            minWidth: "24px",
                            width: "24px",
                            height: "24px",
                            padding: "0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "4px",
                            fontSize: "14px",
                            lineHeight: "1",
                            minHeight: "24px",
                          }}
                        >
                          <Add fontSize="small" /> {/* Smaller Add icon */}
                        </Button>
                      </Box>
                      {commissionRanges.map((range, index) => (
                        <Grid
                          container
                          spacing={1}
                          key={range.id}
                          alignItems="center"
                          sx={{ marginTop: "2px" }}
                        >
                          <Grid item xs={4}>
                            <TextField
                              fullWidth
                              size="small"
                              label="Range From"
                              type="text"
                              value={range.from}
                              onChange={(e) =>
                                handleRangeChange(index, "from", e.target.value)
                              }
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <TextField
                              fullWidth
                              size="small"
                              label="Range To"
                              type="text"
                              value={range.to}
                              onChange={(e) =>
                                handleRangeChange(index, "to", e.target.value)
                              }
                            />
                          </Grid>
                          <Grid item xs={4}>
                            <TextField
                              fullWidth
                              size="small"
                              label="Commission Cost/Ton"
                              type="text"
                              value={range.cost}
                              onChange={(e) =>
                                handleRangeChange(index, "cost", e.target.value)
                              }
                            />
                          </Grid>
                          {/* Close Button */}
                          <Grid item xs={1} display="flex" justifyContent="end">
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              onClick={() => removeCommissionRange(range.id)}
                              sx={{
                                minWidth: "24px",
                                width: "24px",
                                height: "24px",
                                padding: "0",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: "4px",
                              }}
                            >
                              <Close fontSize="small" />
                            </Button>
                          </Grid>
                        </Grid>
                      ))}
                    </Grid>
                  )}

                  {/* Flat Commission Cost */}
                  {commissionCriteria === "Flat" && (
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Flat Commission Cost (per ton)"
                        type="number"
                        value={flatRate}
                        onChange={(e) => setFlatRate(e.target.value)}
                      />
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Save and Cancel Buttons */}
        <Box mt={3} display="flex" justifyContent="center" gap={2}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Update
          </Button>
          <Button variant="outlined" color="error">
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default EditCommission;
