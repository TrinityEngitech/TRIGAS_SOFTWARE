import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress,
  CardContent,
  Card,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { styled } from "@mui/material/styles";
import _ from "lodash"; // Import lodash for easy grouping
import axiosInstance from "../../Authentication/axiosConfig";

const IOSSwitch = styled("label")`
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${(props) => (props.checked ? "#47a54b" : "#dd0505")};
    border-radius: 20px;
    transition: background-color 0.3s ease;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
  }

  .slider:before {
    content: "";
    position: absolute;
    height: 16px;
    width: 16px;
    left: ${(props) => (props.checked ? "22px" : "2px")};
    top: 50%;
    transform: translateY(-50%);
    background-color: #fff;
    border: 1px solid ${(props) => (props.checked ? "#47a54b" : "#dd0505")};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: bold;
    transition: left 0.3s ease;
  }

  .slider:after {
    // content: "${(props) => (props.checked ? "ON" : "OFF")}";s
    position: absolute;
    right: ${(props) => (props.checked ? "5px" : "unset")};
    left: ${(props) => (props.checked ? "unset" : "5px")};
    top: 50%;
    transform: translateY(-50%);
    font-size: 10px;
    color: #fff;
    font-weight: bold;
    transition: all 0.3s ease;
  }
`;

function AddPricesheet() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    city: "",
    effectiveDate: "",
    effectiveTime: "",
    remark: "",
  });

  const [supplierDetails, setSupplierDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log(supplierDetails);

  useEffect(() => {
    fetchCharges();
  }, []);

  const fetchCharges = async () => {
    try {
      const response = await axiosInstance.get(
        "/transportation-charges"
      );
      const details = response.data.map((item) => ({
        supplierName: item.supplierName,
        loadingPoint: item.loadingPoint,
        product: item.product,
        cv: item.cv,
        transportCharge: item.transportationCharge,
        gst: item.gst,
        basicPrice: "",
        productSequence: item.productSequence, // Include productSequence here
        availableStatus: item.availableStatus || false,
      }));
      setSupplierDetails(details);
    } catch (error) {
      console.error("Error fetching charges:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleBasicPriceChange = (index, value) => {
    const updatedDetails = [...supplierDetails];
    updatedDetails[index].basicPrice = value;
    setSupplierDetails(updatedDetails);
  };

  const handleAvailableStatusChange = (
    supplierName,
    loadingPoint,
    product,
    transportCharge,
    checked
  ) => {
    setSupplierDetails((prevDetails) =>
      prevDetails.map((supplier) =>
        supplier.supplierName === supplierName &&
        supplier.loadingPoint === loadingPoint &&
        supplier.product === product &&
        supplier.transportCharge === transportCharge
          ? { ...supplier, availableStatus: checked }
          : supplier
      )
    );
  };

  const handleSave = async () => {
    // Prepare data to save, including availableStatus for each supplier
    const dataToSave = {
      ...formData,
      data: supplierDetails
        .filter((supplier) => supplier.basicPrice) // Only include suppliers with basicPrice
        .map((supplier) => ({
          supplierName: supplier.supplierName,
          productName: supplier.product,
          productSequence: supplier.productSequence,
          loadingPoint: supplier.loadingPoint,
          basicPrice: supplier.basicPrice,
          cv: supplier.cv,
          transportCharge: supplier.transportCharge,
          gst: supplier.gst,
          availableStatus: supplier.availableStatus, // Include availableStatus
        })),
    };

    try {
      const response = await axiosInstance.post(
        "/price-sheets",
        dataToSave
      );
      alert("Pricesheet successfully saved!");
      console.log(response.data);

      navigate("/pricesheet"); // Replace '/dashboard' with the path you want to navigate to
    } catch (error) {
      console.error("Error saving pricesheet:", error);
      alert("Failed to save pricesheet. Please try again.");
    }
  };

  const groupedSuppliers = _.groupBy(supplierDetails, "supplierName");

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
          Add Pricesheet
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
          / Add Pricesheet
        </Typography>
      </Box>

      {/* General Inputs */}
      <Box
        sx={{
          background: "#fff",
          borderRadius: "20px",
          padding: "20px",
          marginTop: "30px",
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            ml: 2,
            color: "error.main",
            mb: 4,
          }}
        >
          📌 Price added for each company and selected products is{" "}
          <b>Per Ton</b>.
        </Typography>
        <Grid container spacing={3}>
          {["name", "city"].map((field) => (
            <Grid item xs={12} sm={3} key={field}>
              <TextField
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                variant="outlined"
                fullWidth
                name={field}
                value={formData[field]}
                onChange={handleInputChange}
              />
            </Grid>
          ))}
          <Grid item xs={12} sm={3}>
            <TextField
              type="date"
              label="Effective Date"
              InputLabelProps={{ shrink: true }}
              fullWidth
              name="effectiveDate"
              value={formData.effectiveDate}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              type="time"
              label="Effective Time"
              InputLabelProps={{ shrink: true }}
              fullWidth
              name="effectiveTime"
              value={formData.effectiveTime}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Remark"
              variant="outlined"
              fullWidth
              name="remark"
              value={formData.remark}
              onChange={handleInputChange}
            />
          </Grid>
        </Grid>
      </Box>

      <Box
        sx={{
          background: "#fff",
          borderRadius: "20px",
          marginTop: "30px",
          padding: "20px",
        }}
      >
        {loading ? (
          <Box textAlign="center" mt={5}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={2}>
            {Object.keys(groupedSuppliers).map((supplierName) => (
              <Grid item xs={12} md={6} lg={4} key={supplierName}>
                <Card
                  sx={{
                    border: `1px solid`, // Adding border width
                    borderColor: (theme) => theme.palette.primary.dark, // Set the color to primary.dark from theme
                    // "&:hover": {
                    //   boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)", // Hover effect
                    // },
                  }}
                >
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
                      }}
                    >
                      {supplierName}
                    </Typography>

                    {groupedSuppliers[supplierName].map((supplier, index) => (
                      <Box
                        key={index}
                        sx={{
                          border: "1px solid #e0e0e0",
                          borderRadius: 1,
                          p: 1,
                          mb: 1,
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            color: "text.dark",
                            fontWeight: "500",
                          }}
                        >
                          {supplier.product} | {supplier.loadingPoint} | {supplier.transportCharge}
                        </Typography>

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center", // Aligning items vertically center
                            justifyContent: "space-between", // Distribute space between elements
                            gap: 2, // Adds space between elements
                          }}
                        >
                          <Box mt={2} sx={{ flex: 1 }}>
                            <TextField
                              label="Basic Price"
                              type="text"
                              value={supplier.basicPrice}
                              onChange={(e) =>
                                handleBasicPriceChange(
                                  supplierDetails.indexOf(supplier),
                                  e.target.value
                                )
                              }
                              variant="outlined"
                              size="small"
                              fullWidth
                            />
                          </Box>

                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <IOSSwitch
                              checked={supplier.availableStatus || false}
                              onChange={(e) =>
                                handleAvailableStatusChange(
                                  supplier.supplierName,
                                  supplier.loadingPoint,
                                  supplier.product,
                                  supplier.transportCharge,
                                  e.target.checked
                                )
                              }
                            >
                              <input
                                type="checkbox"
                                style={{ opacity: 0, width: 0, height: 0 }}
                              />
                              <span className="slider"></span>
                            </IOSSwitch>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
        <Box textAlign="center" mt={5} padding={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            sx={{ px: 4, py: 1.5, fontWeight: "bold" }}
          >
            Save
          </Button>
          <Button
            variant="outlined"
            color="error"
            sx={{ ml: 2, px: 4, py: 1.5, fontWeight: "bold" }}
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default AddPricesheet;
