const driverModel = require("../models/driverModel");

const fs = require('fs');
const path = require('path');


exports.createDriver = async (req, res) => {
  try {
    const {
      name,
      age,
      driverNumber,
      managerNumber,
      drivingLicense,
      aadharCardNumber,
      pccNumber,
      driverAdditionalNumber,
      driverAdditionalName,
      activeStatus, // This can be optional
    } = req.body;

    console.log(req.body);

    // Check if required fields are provided (text fields)
    if (!name ||  !driverNumber  || !drivingLicense || !aadharCardNumber || !pccNumber) {
      return res.status(400).json({
        error: "Name, Driver Number, Driving License, aadharCardNumber and pccNumber are required.",
      });
    }

    // Validate that age is a valid number
    const parsedAge = age ? parseInt(age) : undefined;
    if (age && isNaN(parsedAge)) {
      return res.status(400).json({ error: "Age must be a valid number if provided." });
    }

    // Validate that activeStatus is a boolean (true or false), if it's provided
    const isActive = activeStatus === undefined ? undefined : (activeStatus === "true" || activeStatus === true);

    // Process files (use optional chaining to avoid errors if files are not uploaded)
    const aadharFilePath = req.files?.aadharCardFile?.[0]?.path || '';
    const pccFilePath = req.files?.pccFile?.[0]?.path || '';
    const licenseFilePath = req.files?.drivingLicenseFile?.[0]?.path || '';

    // Ensure file paths are set to empty string if not provided
    const files = {
      drivingLicenseFile: licenseFilePath || '',
      aadharCardFile: aadharFilePath || '',
      pccFile: pccFilePath || '',
    };

    // Create a new driver record
    const driver = await driverModel.create({
      name,
      age: parsedAge, // Ensure age is an integer
      driverNumber,
      managerNumber,
      drivingLicense, // Ensure this is required
      aadharCardNumber, // Allow aadharCardNumber to be optional
      pccNumber, // Allow pccNumber to be optional
      driverAdditionalName,
      driverAdditionalNumber,
      activeStatus: isActive, // If not provided, Prisma will default it to true
      drivingLicenseFile: files.drivingLicenseFile, // Optional file (empty string if not provided)
      aadharCardFile: files.aadharCardFile, // Optional file (empty string if not provided)
      pccFile: files.pccFile, // Optional file (empty string if not provided)
    });

    res.status(201).json(driver); // Return the created driver as a response
  } catch (error) {
    console.error(error); // Log error for debugging purposes
    res.status(500).json({ error: "Failed to create driver", details: error.message });
  }
};


// Get all drivers
exports.getAllDrivers = async (req, res) => {
  try {
    const drivers = await driverModel.findAll();
    res.status(200).json(drivers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch drivers", details: error.message });
  }
};

// Get driver by ID
exports.getDriverById = async (req, res) => {
  try {
    const driver = await driverModel.findById(req.params.id);
    if (driver) {
      res.status(200).json(driver);
    } else {
      res.status(404).json({ error: "Driver not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch driver", details: error.message });
  }
};

// Update a driver


// exports.updateDriver = async (req, res) => {
//   try {
//     const driverId = parseInt(req.params.id); // Ensure ID is an integer

//     // Fetch the driver using the correct method (findById)
//     const driver = await driverModel.findById(driverId);
//     if (!driver) {
//       return res.status(404).json({ error: 'Driver not found' });
//     }

//     // Get data from the request body
//     const { name, age, driverNumber, managerNumber, aadharCardNumber, pccNumber, drivingLicense, activeStatus } = req.body;

//     // Get uploaded files from the request
//     const drivingLicenseFile = req.files && req.files['drivingLicenseFile'] ? req.files['drivingLicenseFile'][0] : null;
//     const aadharCardFile = req.files && req.files['aadharCardFile'] ? req.files['aadharCardFile'][0] : null;
//     const pccFile = req.files && req.files['pccFile'] ? req.files['pccFile'][0] : null;

//     // File removal logic (if needed) for old files
//     if (drivingLicenseFile && driver.drivingLicenseFile) {
//       const oldFilePath = path.join(__dirname, 'uploads', driver.drivingLicenseFile);
//       if (fs.existsSync(oldFilePath)) {
//         fs.unlinkSync(oldFilePath); // Delete old file
//       }
//     }

//     // Call the update model method with new data and files
//     const updatedDriver = await driverModel.update(driverId, {
//       name,
//       age,
//       driverNumber,
//       managerNumber,
//       aadharCardNumber,
//       pccNumber,
//       drivingLicense,
//       activeStatus,
//       drivingLicenseFile: drivingLicenseFile ? drivingLicenseFile.filename : driver.drivingLicenseFile, // If a new file is provided, use it
//       aadharCardFile: aadharCardFile ? aadharCardFile.filename : driver.aadharCardFile,
//       pccFile: pccFile ? pccFile.filename : driver.pccFile,
//     });

//     // Respond with the updated driver
//     res.status(200).json(updatedDriver);
//   } catch (error) {
//     console.error('Error updating driver:', error);
//     res.status(500).json({ error: 'Failed to update driver', details: error.message });
//   }
// };

// exports.updateDriver = async (req, res) => {
//   try {
//     const driverId = parseInt(req.params.id); // Ensure ID is an integer

//     // Fetch the driver using the correct method (findById)
//     const driver = await driverModel.findById(driverId);
//     if (!driver) {
//       return res.status(404).json({ error: 'Driver not found' });
//     }

//     // Get data from the request body
//     const { name, age, driverNumber, managerNumber, aadharCardNumber, pccNumber, drivingLicense, activeStatus } = req.body;

//     // Get uploaded files from the request
//     const drivingLicenseFile = req.files?.drivingLicenseFile ? req.files['drivingLicenseFile'][0] : null;
//     const aadharCardFile = req.files?.aadharCardFile ? req.files['aadharCardFile'][0] : null;
//     const pccFile = req.files?.pccFile ? req.files['pccFile'][0] : null;

//     // File removal logic (if needed) for old files
//     if (drivingLicenseFile && driver.drivingLicenseFile) {
//       const oldFilePath = path.join(__dirname, 'uploads', driver.drivingLicenseFile);
//       if (fs.existsSync(oldFilePath)) {
//         fs.unlinkSync(oldFilePath); // Delete old file
//       }
//     }
//     if (aadharCardFile && driver.aadharCardFile) {
//       const oldAadharFilePath = path.join(__dirname, 'uploads', driver.aadharCardFile);
//       if (fs.existsSync(oldAadharFilePath)) {
//         fs.unlinkSync(oldAadharFilePath); // Delete old file
//       }
//     }
//     if (pccFile && driver.pccFile) {
//       const oldPccFilePath = path.join(__dirname, 'uploads', driver.pccFile);
//       if (fs.existsSync(oldPccFilePath)) {
//         fs.unlinkSync(oldPccFilePath); // Delete old file
//       }
//     }

//     // Process files and set paths
//     const files = {
//       drivingLicenseFile: drivingLicenseFile ? drivingLicenseFile.filename : driver.drivingLicenseFile,
//       aadharCardFile: aadharCardFile ? aadharCardFile.filename : driver.aadharCardFile,
//       pccFile: pccFile ? pccFile.filename : driver.pccFile,
//     };

//     // Validate that age is a valid number
//     const parsedAge = parseInt(age);
//     if (isNaN(parsedAge)) {
//       return res.status(400).json({ error: "Age must be a valid number." });
//     }

//     // Validate that activeStatus is a boolean (true or false), if it's provided
//     const isActive = activeStatus === undefined ? undefined : (activeStatus === "true" || activeStatus === true);

//     // Call the update model method
//     const updatedDriver = await driverModel.update(driverId, {
//       name,
//       age: parsedAge,
//       driverNumber,
//       managerNumber,
//       drivingLicense,
//       aadharCardNumber,
//       pccNumber,
//       activeStatus: isActive,
//       drivingLicenseFile: files.drivingLicenseFile, // Updated file path
//       aadharCardFile: files.aadharCardFile, // Updated file path
//       pccFile: files.pccFile, // Updated file path
//     });

//     // Respond with the updated driver
//     res.status(200).json(updatedDriver);
//   } catch (error) {
//     console.error('Error updating driver:', error);
//     res.status(500).json({ error: 'Failed to update driver', details: error.message });
//   }
// };

// exports.updateDriver = async (req, res) => {
//   try {
//     const driverId = parseInt(req.params.id); // Ensure ID is an integer

//     // Fetch the driver using the correct method (findById)
//     const driver = await driverModel.findById(driverId);
//     if (!driver) {
//       return res.status(404).json({ error: 'Driver not found' });
//     }

//     // Get data from the request body
//     const { name, age, driverNumber, managerNumber, aadharCardNumber, pccNumber, drivingLicense, activeStatus } = req.body;

//     // Get uploaded files from the request
//     const drivingLicenseFile = req.files?.drivingLicenseFile ? req.files['drivingLicenseFile'][0] : null;
//     const aadharCardFile = req.files?.aadharCardFile ? req.files['aadharCardFile'][0] : null;
//     const pccFile = req.files?.pccFile ? req.files['pccFile'][0] : null;

//     // File removal logic (if needed) for old files
//     if (drivingLicenseFile && driver.drivingLicenseFile) {
//       const oldFilePath = path.join(__dirname, 'uploads', driver.drivingLicenseFile);
//       if (fs.existsSync(oldFilePath)) {
//         fs.unlinkSync(oldFilePath); // Delete old file
//       }
//     }
//     if (aadharCardFile && driver.aadharCardFile) {
//       const oldAadharFilePath = path.join(__dirname, 'uploads', driver.aadharCardFile);
//       if (fs.existsSync(oldAadharFilePath)) {
//         fs.unlinkSync(oldAadharFilePath); // Delete old file
//       }
//     }
//     if (pccFile && driver.pccFile) {
//       const oldPccFilePath = path.join(__dirname, 'uploads', driver.pccFile);
//       if (fs.existsSync(oldPccFilePath)) {
//         fs.unlinkSync(oldPccFilePath); // Delete old file
//       }
//     }

//     // Process files and set paths
//     const files = {
//       drivingLicenseFile: drivingLicenseFile ? drivingLicenseFile.filename : null,
//       aadharCardFile: aadharCardFile ? aadharCardFile.filename : null,
//       pccFile: pccFile ? pccFile.filename : null,
//     };

//     // Validate that age is a valid number
//     const parsedAge = parseInt(age);
//     if (isNaN(parsedAge)) {
//       return res.status(400).json({ error: "Age must be a valid number." });
//     }

//     // Validate that activeStatus is a boolean (true or false), if it's provided
//     const isActive = activeStatus === undefined ? undefined : (activeStatus === "true" || activeStatus === true);

//     // Call the update model method
//     const updatedDriver = await driverModel.update(driverId, {
//       name,
//       age: parsedAge,
//       driverNumber,
//       managerNumber,
//       drivingLicense,
//       aadharCardNumber,
//       pccNumber,
//       activeStatus: isActive,
//       drivingLicenseFile: files.drivingLicenseFile, // Updated file path or null
//       aadharCardFile: files.aadharCardFile, // Updated file path or null
//       pccFile: files.pccFile, // Updated file path or null
//     });

//     // Respond with the updated driver
//     res.status(200).json(updatedDriver);
//   } catch (error) {
//     console.error('Error updating driver:', error);
//     res.status(500).json({ error: 'Failed to update driver', details: error.message });
//   }
// };

// Update driver function
// exports.updateDriver = async (req, res) => {
//   try {
//     const driverId = parseInt(req.params.id);

//     const driver = await driverModel.findById(driverId);
//     if (!driver) {
//       return res.status(404).json({ error: 'Driver not found' });
//     }

//     const {
//       name,
//       age,
//       driverNumber,
//       managerNumber,
//       aadharCardNumber,
//       pccNumber,
//       drivingLicense,
//       activeStatus,
//     } = req.body;

//     const drivingLicenseFile = req.files?.drivingLicenseFile?.[0]?.filename || null;
//     const aadharCardFile = req.files?.aadharCardFile?.[0]?.filename || null;
//     const pccFile = req.files?.pccFile?.[0]?.filename || null;

//     // Handle nullable fields
//     const updateData = {
//       ...(name && { name }),
//       ...(age && !isNaN(parseInt(age)) && { age: parseInt(age) }),
//       ...(driverNumber && { driverNumber }),
//       ...(managerNumber !== undefined ? { managerNumber: managerNumber || null } : {}),
//       ...(aadharCardNumber && { aadharCardNumber }),
//       ...(pccNumber && { pccNumber }),
//       ...(drivingLicense && { drivingLicense }),
//       ...(activeStatus !== undefined && { activeStatus: activeStatus === "true" || activeStatus === true }),
//       ...(drivingLicenseFile && { drivingLicenseFile: `uploads/${drivingLicenseFile}` }),
//       ...(aadharCardFile && { aadharCardFile: `uploads/${aadharCardFile}` }),
//       ...(pccFile && { pccFile: `uploads/${pccFile}` }),
//     };

//     const updatedDriver = await driverModel.update(driverId, updateData);

//     res.status(200).json(updatedDriver);
//   } catch (error) {
//     console.error('Error updating driver:', error);
//     res.status(500).json({ error: 'Failed to update driver', details: error.message });
//   }
// };


exports.updateDriver = async (req, res) => {
  try {
    const driverId = parseInt(req.params.id);

    const driver = await driverModel.findById(driverId);
    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    const {
      name,
      age,
      driverNumber,
      managerNumber,
      aadharCardNumber,
      pccNumber,
      driverAdditionalNumber,
      driverAdditionalName,
      drivingLicense,
      activeStatus,
    } = req.body;

    const drivingLicenseFile = req.files?.drivingLicenseFile?.[0]?.filename || null;
    const aadharCardFile = req.files?.aadharCardFile?.[0]?.filename || null;
    const pccFile = req.files?.pccFile?.[0]?.filename || null;

    // Handle nullable fields and ensure valid age
    const updateData = {
      ...(name && { name }),
      ...(age !== undefined && age !== null && age !== "" && !isNaN(parseInt(age)) && { age: parseInt(age) }) || { age: null },
      ...(driverNumber && { driverNumber }),
      ...(managerNumber !== undefined ? { managerNumber: managerNumber || null } : {}),
      ...(aadharCardNumber && { aadharCardNumber }),
      ...(pccNumber && { pccNumber }),
      ...(driverAdditionalNumber !== undefined ? { driverAdditionalNumber: driverAdditionalNumber || null } : {}),
      ...(driverAdditionalName !== undefined ? { driverAdditionalName: driverAdditionalName || null } : {}),
      ...(drivingLicense && { drivingLicense }),
      ...(activeStatus !== undefined && { activeStatus: activeStatus === "true" || activeStatus === true }),
      ...(drivingLicenseFile && { drivingLicenseFile: `uploads/${drivingLicenseFile}` }),
      ...(aadharCardFile && { aadharCardFile: `uploads/${aadharCardFile}` }),
      ...(pccFile && { pccFile: `uploads/${pccFile}` }),
    };

    const updatedDriver = await driverModel.update(driverId, updateData);

    res.status(200).json(updatedDriver);
  } catch (error) {
    console.error('Error updating driver:', error);
    res.status(500).json({ error: 'Failed to update driver', details: error.message });
  }
};









// Toggle active status of a driver
exports.toggleDriverStatus = async (req, res) => {
  try {
    console.log("Received request to toggle status for ID:", req.params.id);
    const driverId = req.params.id;

    const driver = await driverModel.findById(driverId);
    if (!driver) {
      return res.status(404).json({ error: "Driver not found" });
    }

    const updatedDriver = await driverModel.update(driverId, {
      activeStatus: !driver.activeStatus,
    });

    console.log("Driver updated:", updatedDriver);
    res.status(200).json(updatedDriver);
  } catch (error) {
    console.error("Error in toggleDriverStatus:", error);
    res.status(500).json({ error: "Failed to toggle driver status", details: error.message });
  }
};

// Delete a driver
exports.deleteDriver = async (req, res) => {
  try {
    await driverModel.delete(req.params.id);
    res.status(200).json({ message: "Driver deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete driver", details: error.message });
  }
};
