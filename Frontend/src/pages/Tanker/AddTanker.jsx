import { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Grid,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { ArrowBack, Add } from "@mui/icons-material";
import axiosInstance from "../../Authentication/axiosConfig";

function AddTanker() {
  const [fetchproducts, setFetchProducts] = useState([]);
  const [fetchdrivers, setFetchDrivers] = useState([]);
  const [fetchtransporters, setFetchTransporters] = useState([]);

  console.log(fetchproducts);
  console.log(fetchdrivers);
  console.log(fetchtransporters);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, driversResponse, transportersResponse] =
          await Promise.all([
            axiosInstance.get("/products/"),
            axiosInstance.get("/drivers/"),
            axiosInstance.get("/transporters/"),
          ]);

        console.log(driversResponse);

        // Validate and set products
        if (Array.isArray(productsResponse.data)) {
          setFetchProducts(productsResponse.data);
        } else {
          console.error("Products response data is not an array");
        }

        // Validate and set locations
        if (Array.isArray(driversResponse.data)) {
          setFetchDrivers(driversResponse.data);
        } else {
          console.error("drivers response data is not an array");
        }

        if (Array.isArray(transportersResponse.data)) {
          setFetchTransporters(transportersResponse.data);
        } else {
          console.error("Transporters response data is not an array");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const [document, setDocument] = useState([
    { documentType: "", validFrom: "", validUpto: "", documentFile: "" },
  ]);
  const [tankerData, setTankerData] = useState({
    transporterName: "",
    tankerNumber: "",
    licenseCapacity: "",
    driverName: "",
    product: "",
    grossWeight: "",
    tareWeight: "",
    chassisNumber: "",
    engineNumber: "",
    numberOfAxle: "",
  });

  // Handle change for tanker details
  const handleTankerChange = (field, value) => {
    setTankerData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const documentValidityPeriods = {
    "PUC (Pollution Under Control)": ["6 months", "1 year"], // 6 months, 1 year
    Insurance: 12, // 1 year
    "CLL (Carriers Legal Liability)": 12, // 1 year
    "Road Tax": ["3 months", "6 months", "1 year", "lifetime"],
    Permit: ["5 years", "8 years"], // 5 years, 8 years (in months)
    "Fitness Certificate (Rule 62)": ["1 year", "2 years"], // 1 year, 2 years
    GPS: 12, // 1 year
    "RC Book (Registration Certificate)": "lifetime", // Lifetime validity
    "Rule 18": 12, // 1 year
    "Rule 9 (PESO Licence)": [
      "1 year",
      "2 years",
      "3 years",
      "4 years",
      "5 years",
    ], // 1 to 5 years (in months)
    "COC (Rule 13)": "lifetime", // Lifetime validity
    "Rule 43": "lifetime", // Lifetime validity
    "Rule 19": 60, // 5 year
    "Mounting Drawing": "lifetime", // Lifetime validity
    "Fabrication Drawing": "lifetime", // Lifetime validity
    "Fire Extinguisher": 12, // 1 year
  };

  const handledocumentChange = (index, field, value) => {
    const updatedDocuments = [...document];
    const documentToUpdate = updatedDocuments[index];

    documentToUpdate[field] = value;

    const validity = documentValidityPeriods[documentToUpdate.documentType];

    // Handle "documentType" change
    if (field === "documentType") {
      if (
        [
          "PUC (Pollution Under Control)",
          "Fitness Certificate (Rule 62)",
          "Permit",
          "Rule 9 (PESO Licence)",
          "Road Tax",
        ].includes(value)
      ) {
        documentToUpdate.validityPeriod = ""; // Reset validity period for dropdown selection
        documentToUpdate.validUpto = ""; // Reset `validUpto`
      } else if (typeof validity === "number" && documentToUpdate.validFrom) {
        const validFromDate = new Date(documentToUpdate.validFrom);
        if (!isNaN(validFromDate.getTime())) {
          validFromDate.setMonth(validFromDate.getMonth() + validity);
          documentToUpdate.validUpto = validFromDate
            .toISOString()
            .split("T")[0];
        } else {
          console.warn(
            "Invalid 'validFrom' date for documentType calculation."
          );
        }
      } else {
        documentToUpdate.validUpto = "2999-12-31"; // Default for "lifetime"
      }
    }

    // Handle "validFrom" change
    if (field === "validFrom" && documentToUpdate.documentType) {
      if (typeof validity === "number") {
        const validFromDate = new Date(value);
        if (!isNaN(validFromDate.getTime())) {
          validFromDate.setMonth(validFromDate.getMonth() + validity);
          documentToUpdate.validUpto = validFromDate
            .toISOString()
            .split("T")[0];
        } else {
          console.warn("Invalid 'validFrom' date.");
          documentToUpdate.validUpto = ""; // Clear invalid date
        }
      }
    }

    // Handle validity period dropdown selection
    if (field === "validityPeriod") {
      if (value === "lifetime") {
        documentToUpdate.validUpto = "2999-12-31";
      } else {
        const validFromDate = new Date(documentToUpdate.validFrom);
        if (!isNaN(validFromDate.getTime())) {
          const [amount, unit] = value.split(" ");
          if (unit === "months") {
            validFromDate.setMonth(
              validFromDate.getMonth() + parseInt(amount, 10)
            );
          } else if (unit === "year" || unit === "years") {
            validFromDate.setFullYear(
              validFromDate.getFullYear() + parseInt(amount, 10)
            );
          }
          documentToUpdate.validUpto = validFromDate
            .toISOString()
            .split("T")[0];
        } else {
          console.warn(
            "Invalid 'validFrom' date for validityPeriod calculation."
          );
        }
      }
    }

    setDocument(updatedDocuments);
  };

  // Add a new document detail
  const adddocument = () => {
    setDocument([
      ...document,
      { documentType: "", validFrom: "", validUpto: "", documentFile: "" },
    ]);
  };

  // Remove a document detail
  const removedocument = (index) => {
    const updateddocument = document.filter((_, i) => i !== index);
    setDocument(updateddocument);
  };

  const navigate = useNavigate();

  const handleSave = async () => {
    const tankerDetails = {
      transporterName: tankerData.transporterName,
      tankerNumber: tankerData.tankerNumber,
      licenseCapacity: tankerData.licenseCapacity,
      driverName: tankerData.driverName,
      product: tankerData.product,
      grossWeight: tankerData.grossWeight,
      tareWeight: tankerData.tareWeight,
      chassisNumber: tankerData.chassisNumber,
      engineNumber: tankerData.engineNumber,
      numberOfAxle: tankerData.numberOfAxle,
      documents: document.map((doc) => ({
        documentType: doc.documentType,
        validFrom: doc.validFrom,
        validUpto: doc.validUpto,
        documentFile: doc.documentFile,
      })),
    };

    console.log("Structured Tanker Details (Before FormData):", tankerDetails);

    const formData = new FormData();

    // Add regular fields
    formData.append("transporterName", tankerData.transporterName);
    formData.append("tankerNumber", tankerData.tankerNumber);
    formData.append("licenseCapacity", tankerData.licenseCapacity);
    formData.append("driverName", tankerData.driverName);
    formData.append("product", tankerData.product);
    formData.append("grossWeight", tankerData.grossWeight);
    formData.append("tareWeight", tankerData.tareWeight);
    formData.append("chassisNumber", tankerData.chassisNumber);
    formData.append("engineNumber", tankerData.engineNumber);
    formData.append("numberOfAxle", tankerData.numberOfAxle);

    // Check if documents exist and are valid
    if (document.length > 0 && document.some((doc) => doc.documentFile)) {
      // Convert document metadata to JSON string and append
      const documentMetadata = document
        .filter((doc) => doc.documentType && doc.validFrom && doc.validUpto) // Filter out empty documents
        .map((doc) => ({
          documentType: doc.documentType,
          validFrom: doc.validFrom,
          validUpto: doc.validUpto,
        }));
      if (documentMetadata.length > 0) {
        formData.append("documents", JSON.stringify(documentMetadata));
      }

      // Add files under the same key ("documents")
      document.forEach((doc) => {
        if (doc.documentFile) {
          formData.append("documents", doc.documentFile);
        }
      });
    }

    // Log FormData entries
    console.log("FormData Entries:");
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]); // Log key-value pairs
    }

    // Send the request
    try {
      const response = await axiosInstance.post("/tankers", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/tanker");
      console.log("Response:", response.data);
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <Box p={3}>
      {/* Header Section */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Button variant="text" color="primary" onClick={() => navigate(-1)}>
          <ArrowBack />
        </Button>
        <Typography variant="h5" sx={{ fontWeight: "bold", ml: 1 }}>
          Add Tanker
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
          / Add Tanker
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
        <form>
          <Typography
            className="fs-4"
            sx={{ marginBottom: "25px", fontWeight: "500" }}
          >
            Tanker Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Transporter Name</InputLabel>
                <Select
                  label="Transporter Name"
                  value={tankerData.transporterName}
                  onChange={(e) =>
                    handleTankerChange("transporterName", e.target.value)
                  }
                  name="transporterName"
                >
                  {fetchtransporters.map((transporter, index) => (
                    <MenuItem key={index} value={transporter.transporterName}>
                      {transporter.transporterName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Tanker Number"
                value={tankerData.tankerNumber}
                onChange={(e) =>
                  handleTankerChange("tankerNumber", e.target.value)
                }
                name="tankerNumber"
                required
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="License Capacity(Tons)"
                value={tankerData.licenseCapacity}
                onChange={(e) =>
                  handleTankerChange("licenseCapacity", e.target.value)
                }
                name="licenseCapacity"
                required
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Driver</InputLabel>
                <Select
                  label="Driver"
                  value={tankerData.driverName}
                  onChange={(e) =>
                    handleTankerChange("driverName", e.target.value)
                  }
                  name="driverName"
                  required
                >
                  {fetchdrivers.map((drivers, index) => (
                    <MenuItem key={index} value={drivers.name}>
                      {drivers.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Product</InputLabel>
                <Select
                  label="Product Name"
                  value={tankerData.product}
                  onChange={(e) =>
                    handleTankerChange("product", e.target.value)
                  }
                  name="product"
                  required
                >
                  {fetchproducts.map((product, index) => (
                    <MenuItem key={index} value={product.productName}>
                      {product.productName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Laden/Gross Weight"
                value={tankerData.grossWeight}
                onChange={(e) =>
                  handleTankerChange("grossWeight", e.target.value)
                }
                name="grossWeight"
                required
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="UnLaden/Tare Weight"
                value={tankerData.tareWeight}
                onChange={(e) =>
                  handleTankerChange("tareWeight", e.target.value)
                }
                name="tareWeight"
                required
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Chassis Number"
                value={tankerData.chassisNumber}
                onChange={(e) =>
                  handleTankerChange("chassisNumber", e.target.value)
                }
                name="chassisNumber"
                required
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Engine Number"
                value={tankerData.engineNumber}
                onChange={(e) =>
                  handleTankerChange("engineNumber", e.target.value)
                }
                name="engineNumber"
                required
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Number of Axle</InputLabel>
                <Select
                  label="Number of Axle"
                  value={tankerData.numberOfAxle}
                  onChange={(e) =>
                    handleTankerChange("numberOfAxle", e.target.value)
                  }
                  name="numberOfAxle"
                  required
                >
                  <MenuItem value="2">2</MenuItem>
                  <MenuItem value="3">3</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Document Details Section */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "50px",
              marginBottom: "10px",
            }}
          >
            <Typography
              className="fs-4"
              sx={{ marginBottom: "20px", fontWeight: "500" }}
            >
              Document Details
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={adddocument}
              sx={{
                height: "40px",
                minWidth: "100px",
              }}
            >
              Add Document
            </Button>
          </Box>
          {document.map((tanker, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 2 }} // Adds spacing between dynamically rendered fields
            >
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flex: 1,
                }}
              >
                <FormControl fullWidth sx={{ flex: 1 }}>
                  <InputLabel>Document Type</InputLabel>
                  <Select
                    label="Document Type"
                    name="documentType"
                    value={tanker.documentType || ""}
                    onChange={(e) =>
                      handledocumentChange(
                        index,
                        "documentType",
                        e.target.value
                      )
                    }
                  >
                    {Object.keys(documentValidityPeriods).map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  type="date"
                  label="Valid From"
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) =>
                    handledocumentChange(index, "validFrom", e.target.value)
                  }
                  value={document[index]?.validFrom || ""}
                  sx={{ flex: 1 }}
                />

                {documentValidityPeriods[tanker.documentType] &&
                  Array.isArray(
                    documentValidityPeriods[tanker.documentType]
                  ) && (
                    <FormControl fullWidth sx={{ flex: 1 }}>
                      <InputLabel>Validity Period</InputLabel>
                      <Select
                        label="Validity Period"
                        name="validityPeriod"
                        value={tanker.validityPeriod || ""}
                        onChange={(e) =>
                          handledocumentChange(
                            index,
                            "validityPeriod",
                            e.target.value
                          )
                        }
                      >
                        {documentValidityPeriods[tanker.documentType].map(
                          (option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          )
                        )}
                      </Select>
                    </FormControl>
                  )}

                <TextField
                  label="Valid Upto"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  // value={document[index]?.validUpto || ""}
                  value={tanker.validUpto || ""}
                  onChange={(e) =>
                    handledocumentChange(index, "validUpto", e.target.value)
                  }
                  name="validUpto"
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{ flex: 1 }}
                />

                <TextField
                  type="file"
                  label="Document"
                  InputLabelProps={{
                    shrink: true, // Ensures the label remains visible when a file is selected
                  }}
                  onChange={(e) => {
                    const file = e.target.files[0]; // Get the file
                    handledocumentChange(index, "documentFile", file); // Update the state with the file
                  }}
                  sx={{ flex: 1 }}
                  name="documentFile"
                />
              </Box>

              {/* Remove Button */}
              <IconButton
                onClick={() => {
                  removedocument(index); // Only remove if there's more than one bank entry
                }}
                sx={{
                  backgroundColor: "#cf0202",
                  borderRadius: "50%",
                  width: "30px",
                  height: "30px",
                  display: document.length === 1 ? "none" : "flex", // Hide button when there's only one bank entry
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  marginLeft: "16px", // Space between the fields and the button
                  cursor: "pointer", // Always pointer when visible
                  "&:hover": {
                    backgroundColor: "#cf0202",
                  },
                }}
              >
                <i className="bi bi-x"></i>
              </IconButton>
            </Box>
          ))}
        </form>
        {/* Action Buttons */}
        <Box mt={3} display="flex" justifyContent="center" gap={2}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
          <Button variant="outlined" color="error">
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default AddTanker;

{
  /* <FormControl fullWidth sx={{ flex: 1 }}>
                  <InputLabel>Document Type</InputLabel>
                  <Select
                    value={document[index]?.documentType || ""}
                    onChange={(e) =>
                      handledocumentChange(
                        index,
                        "documentType",
                        e.target.value
                      )
                    }
                    label="Document Type"
                    name="documentType"
                  >
                    <MenuItem value="PUC (Pollution Under Control)">
                      PUC (Pollution Under Control)
                    </MenuItem>
                    <MenuItem value="Insurance">Insurance</MenuItem>
                    <MenuItem value="CLL (Carriers Legal Liability)">
                      CLL (Carriers Legal Liability)
                    </MenuItem>
                    <MenuItem value="Road Tax">Road Tax</MenuItem>
                    <MenuItem value="Permit">Permit</MenuItem>
                    <MenuItem value="Fitness Certificate (Rule 62)">
                      Fitness Certificate (Rule 62)
                    </MenuItem>

                    <MenuItem value="GPS">GPS</MenuItem>
                    <MenuItem value="RC Book (Registration Certificate)">
                      RC Book (Registration Certificate)
                    </MenuItem>
                    <MenuItem value="Rule 18">Rule 18</MenuItem>
                    <MenuItem value="Rule 9 (PESO Licence)">
                      Rule 9 (PESO Licence)
                    </MenuItem>
                    <MenuItem value="COC (Rule 13)">COC (Rule 13)</MenuItem>
                    <MenuItem value="Rule 43">Rule 43</MenuItem>
                    <MenuItem value="Rule 19">Rule 19</MenuItem>
                    <MenuItem value="Mounting Drawing">
                      Mounting Drawing
                    </MenuItem>
                    <MenuItem value="Fabrication Drawing">
                      Fabrication Drawing
                    </MenuItem>
                    <MenuItem value="Fire Extinguisher">
                      Fire Extinguisher
                    </MenuItem>
                  </Select>
                </FormControl> */
}
{
  /* <FormControl fullWidth sx={{ flex: 1 }}>
            <InputLabel>Document Type</InputLabel>
            <Select
             label="Document Type"
              name="documentType"
              value={tanker.documentType || ""}
              onChange={(e) =>
                handledocumentChange(index, "documentType", e.target.value)
              }
            >
              {Object.keys(documentValidityPeriods).map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl> */
}
