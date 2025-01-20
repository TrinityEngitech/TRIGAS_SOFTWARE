const supplyLocationModel = require("../models/SupplyLocationsModel");

// Create a new supply location
exports.createSupplyLocation = async (req, res) => {
  console.log(req.body);

  try {
    const { LocationName, activeStatus, latitude, longitude } = req.body;

    // Call the create method from the repository
    const supplyLocation = await supplyLocationModel.create({
      LocationName,
      activeStatus: activeStatus !== undefined ? activeStatus : true, // Default to true if not provided
      latitude: parseFloat(latitude) || 0, // Default to 0 if not provided
      longitude: parseFloat(longitude) || 0, // Default to 0 if not provided
    });

    res.status(201).json(supplyLocation);
  } catch (error) {
    console.error("Error creating supply location:", error);
    res.status(500).json({ error: "Failed to create supply location", details: error.message });
  }
};



// Get all supply locations
exports.getAllSupplyLocations = async (req, res) => {
  try {
    const supplyLocations = await supplyLocationModel.findAll();
    res.status(200).json(supplyLocations);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch supply locations", details: error.message });
  }
};

// Get a supply location by ID
exports.getSupplyLocationById = async (req, res) => {
  try {
    const supplyLocation = await supplyLocationModel.findById(req.params.id);
    if (supplyLocation) {
      res.status(200).json(supplyLocation);
    } else {
      res.status(404).json({ error: "Supply location not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch supply location", details: error.message });
  }
};

// Update a supply location
// exports.updateSupplyLocation = async (req, res) => {
//   try {
//     const { LocationName, activeStatus, latitude,longitude } = req.body;
//     const updatedSupplyLocation = await supplyLocationModel.update(req.params.id, { LocationName, activeStatus,latitude,longitude });
//     res.status(200).json(updatedSupplyLocation);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to update supply location", details: error.message });
//   }
// };
exports.updateSupplyLocation = async (req, res) => {
  try {
    const { LocationName, activeStatus, latitude, longitude } = req.body;

    // Call the update method in the model
    const updatedSupplyLocation = await supplyLocationModel.update(req.params.id, {
      LocationName,
      activeStatus,
      latitude: latitude !== undefined ? parseFloat(latitude) : undefined,
      longitude: longitude !== undefined ? parseFloat(longitude) : undefined,
    });

    res.status(200).json(updatedSupplyLocation);
  } catch (error) {
    console.error("Error updating supply location:", error);
    res.status(500).json({ error: "Failed to update supply location", details: error.message });
  }
};


// Toggle active status of a supply location
exports.toggleSupplyLocationStatus = async (req, res) => {
  try {
    console.log("Received request to toggle status for ID:", req.params.id);
    const supplyLocationId = req.params.id;

    const supplyLocation = await supplyLocationModel.findById(supplyLocationId);
    if (!supplyLocation) {
      return res.status(404).json({ error: "Supply location not found" });
    }

    const updatedSupplyLocation = await supplyLocationModel.update(supplyLocationId, {
      activeStatus: !supplyLocation.activeStatus,
    });

    console.log("Supply location updated:", updatedSupplyLocation);
    res.status(200).json(updatedSupplyLocation);
  } catch (error) {
    console.error("Error in toggleSupplyLocationStatus:", error);
    res.status(500).json({ error: "Failed to toggle supply location status", details: error.message });
  }
};

// Delete a supply location
exports.deleteSupplyLocation = async (req, res) => {
  try {
    await supplyLocationModel.delete(req.params.id);
    res.status(200).json({ message: "Supply location deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete supply location", details: error.message });
  }
};
