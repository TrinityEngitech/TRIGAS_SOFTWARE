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
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { styled } from "@mui/material/styles";
import _ from "lodash"; // Import lodash for easy grouping


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

function EditPricesheet() {
  const navigate = useNavigate();
  const { id } = useParams();  // Fetch the price sheet ID from the URL

  const [formData, setFormData] = useState({
    name: "",
    city: "",
    effectiveDate: "",
    effectiveTime: "",
    remark: "",
  });
  
  const [supplierDetails, setSupplierDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPricesheet();
    // fetchData();
  }, [id]);

  // Fetch the existing price sheet data for the given ID
  const fetchPricesheet = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/price-sheets/${id}`);
      const data = response.data;

      // console.log(data);
      

      setFormData({
        name: data.name,
        city: data.city,
        effectiveDate: data.effectiveDate,
        effectiveTime: data.effectiveTime,
        remark: data.remark,
      });

      const details = data.data.map((item) => ({
        supplierName: item.supplierName,
        loadingPoint: item.loadingPoint,
        product: item.productName,
        productSequence: item.productSequence,
        cv: item.cv,
        transportCharge: item.transportCharge,
        gst: item.gstPercentage,
        basicPrice: item.basicPrice,
        availableStatus:item.availableStatus
      }));

      console.log(details);
      

      setSupplierDetails(details);
    } catch (error) {
      console.error("Error fetching pricesheet:", error);
      alert("Failed to fetch pricesheet data.");
    } finally {
      setLoading(false);
    }
  };

  // const fetchData = async () => {
  //   setLoading(true); // Start loading state
  
  //   try {
  //     // Fetch both APIs simultaneously
  //     const [pricesheetResponse, chargesResponse] = await Promise.all([
  //       axios.get(`http://localhost:3000/api/price-sheets/${id}`),
  //       axios.get("http://localhost:3000/api/transportation-charges"),
  //     ]);

  //     console.log("pricesheetResponse",pricesheetResponse.data);
  //     const data = pricesheetResponse.data;

  //     setFormData({
  //             name: data.name,
  //             city: data.city,
  //             effectiveDate: data.effectiveDate,
  //             effectiveTime: data.effectiveTime,
  //             remark: data.remark,
  //           });
  
  //     // Extract and map Pricesheet data
  //     const pricesheetDetails = pricesheetResponse.data?.data?.map((item) => ({
  //       supplierName: item.supplierName || '',
  //       loadingPoint: item.loadingPoint || '',
  //       product: item.productName || '',
  //       cv: item.cv || '',
  //       transportCharge: item.transportCharge || '',
  //       gst: item.gstPercentage || '',
  //       basicPrice: item.basicPrice || '',
  //       productSequence: item.productSequence || '',
  //       availableStatus: item.availableStatus || false,
  //     })) || [];
  
  //     // Extract and map Charges data
  //     const chargesDetails = chargesResponse.data?.map((item) => ({
  //       supplierName: item.supplierName || '',
  //       loadingPoint: item.loadingPoint || '',
  //       product: item.product || '',
  //       cv: item.cv || '',
  //       transportCharge: item.transportationCharge || '',
  //       gst: item.gst || '',
  //       basicPrice: '', // Default empty if not provided by API
  //       productSequence: item.productSequence || '',
  //       availableStatus: item.availableStatus || false,
  //     })) || [];
  
  //     // Merge both datasets
  //     const mergedDetails = [...pricesheetDetails, ...chargesDetails];
  
  //     console.log('Merged Supplier Details:', mergedDetails);
  //     setSupplierDetails(mergedDetails); // Set merged data
  
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //     alert('Failed to fetch data. Please try again later.');
  //   } finally {
  //     setLoading(false); // End loading state
  //   }
  // };
  

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
  

  // Save the updated pricesheet
  const handleSave = async () => {
    const dataToSave = {
      ...formData,
      data: supplierDetails.map((supplier, index) => ({
        supplierName: supplier.supplierName,
        productName: supplier.product,
        productSequence: supplier.productSequence,
        loadingPoint: supplier.loadingPoint,
        basicPrice: supplier.basicPrice,
        cv: supplier.cv,
        transportCharge: supplier.transportCharge,
        gst: supplier.gst,
        availableStatus: supplier.availableStatus, // Add availableStatus here
      })),
    };
  
    // Log the data to be saved
    console.log("Data to save:", dataToSave);
  
    try {
      const response = await axios.put(`http://localhost:3000/api/price-sheets/${id}`, dataToSave);
      alert("Pricesheet successfully updated!");
      console.log(response.data);
      navigate("/pricesheet"); // Redirect to another page (e.g., dashboard or price sheet list) after save
    } catch (error) {
      console.error("Error updating pricesheet:", error);
      alert("Failed to update pricesheet. Please try again.");
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
          Edit Pricesheet
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
          / Edit Pricesheet
        </Typography>
      </Box>

      {/* General Inputs */}
      <Box
        sx={{
          background: "#fff",
          borderRadius: "20px",
          padding: "30px",
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
          📌 Price added for each company and selected products is <b>Per Ton</b>.
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

      {/* Supplier Details Table */}
      <Box
        sx={{
          background: "#fff",
          borderRadius: "20px",
          marginTop: "30px",
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
      </Box>

      {/* Actions */}
      <Box textAlign="center" mt={5}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          sx={{ px: 4, py: 1.5, fontWeight: "bold" }}
        >
          Save Changes
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
  );
}

export default EditPricesheet;
