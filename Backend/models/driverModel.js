const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create a new driver

exports.create = async ({
  name,
  age,
  driverNumber,
  managerNumber,
  drivingLicense,
  drivingLicenseFile,
  aadharCardNumber,
  aadharCardFile,
  driverAdditionalNumber,
  driverAdditionalName,
  pccNumber,
  pccFile,
  activeStatus, // Can be undefined or null
}) => {
  // Ensure that empty strings for file paths are converted to null
  const finalDrivingLicenseFile = drivingLicenseFile && drivingLicenseFile !== "" ? drivingLicenseFile : null;
  const finalAadharCardFile = aadharCardFile && aadharCardFile !== "" ? aadharCardFile : null;
  const finalPccFile = pccFile && pccFile !== "" ? pccFile : null;

  // Set activeStatus to true by default if it's not provided 
  const finalActiveStatus = activeStatus === undefined || activeStatus === null ? true : activeStatus;


  return prisma.driver.create({
    data: {
      name,
      age,
      driverNumber,
      managerNumber,
      drivingLicense,
      drivingLicenseFile: finalDrivingLicenseFile,  // Will be null if no file is provided
      aadharCardNumber,
      aadharCardFile: finalAadharCardFile,  // Will be null if no file is provided
      pccNumber,
      driverAdditionalName,
      driverAdditionalNumber,
      pccFile: finalPccFile,  // Will be null if no file is provided
      activeStatus: finalActiveStatus,  // Default to true if not provided
    },
  });
};




// exports.createDriver = async (data) => {
//   try {
//     const driver = await prisma.driver.create({
//       data: {
//         name,
//         age: parsedAge,
//         driverNumber,
//         managerNumber,
//         drivingLicense,
//         aadharCardNumber,
//         pccNumber,
//         drivingLicenseFile: files.drivingLicenseFile,
//         aadharCardFile: files.aadharCardFile,
//         pccFile: files.pccFile,
//         activeStatus: isActive,
//       },
//     });
//     console.log('Driver created:', driver);
//   } catch (error) {
//     console.error('Error in Prisma query:', error);
//     throw error;
//   }
  
// };


// Get all drivers
exports.findAll = async () => {
  return prisma.driver.findMany();
};

// Get driver by ID
exports.findById = async (id) => {
  return prisma.driver.findUnique({
    where: { id: parseInt(id) },
  });
};

// Update a driver
// Assuming you are using Prisma ORM
exports.update = async (
  id,
  {
    name,
    age,
    driverNumber,
    managerNumber,
    aadharCardNumber,
    pccNumber,
    drivingLicense,
    driverAdditionalNumber,
    driverAdditionalName,
    activeStatus,
    drivingLicenseFile,
    aadharCardFile,
    pccFile,
  }
) => {
  // Ensure the ID is a number
  const driverId = parseInt(id);
  if (isNaN(driverId)) {
    throw new Error("Invalid driver ID");
  }

 // Ensure `age` is either a valid integer or null if not provided
let parsedAge = null;
if (age !== undefined && age !== null && age !== "") {
  parsedAge = parseInt(age, 10);
  if (isNaN(parsedAge)) {
    throw new Error("Invalid age");
  }
}


  // Parse activeStatus as a boolean (in case it's a string like "true" or "false")
  const parsedActiveStatus = (activeStatus === 'true') ? true : (activeStatus === 'false' ? false : activeStatus);
  if (typeof parsedActiveStatus !== 'boolean') {
    throw new Error("Invalid activeStatus");
  }

  // Prepare update data (you can also apply file handling logic here)
  const updateData = {
    name,
    driverNumber,
    aadharCardNumber,
    pccNumber,
    drivingLicense,
    activeStatus,
    drivingLicenseFile,
    driverAdditionalNumber,
    driverAdditionalName,
    aadharCardFile,
    pccFile,
    age: age !== "" && !isNaN(parseInt(age)) ? parseInt(age) : null,
    managerNumber: managerNumber || null,
  };
  

  if (age !== undefined && age !== null && age !== "") {
    const parsedAge = parseInt(age, 10);
    if (isNaN(parsedAge)) {
      throw new Error("Invalid age");
    }
    updateData.age = parsedAge;
  }
  
  if (managerNumber !== undefined && managerNumber !== null && managerNumber !== "") {
    updateData.managerNumber = managerNumber;
  }

  if (driverAdditionalNumber !== undefined && driverAdditionalNumber !== null && driverAdditionalNumber !== "") {
    updateData.driverAdditionalNumber = driverAdditionalNumber;
  }

  if (driverAdditionalName !== undefined && driverAdditionalName !== null && driverAdditionalName !== "") {
    updateData.driverAdditionalName = driverAdditionalName;
  }
//   If you want to handle files, you can do that in the controller before passing data to the model.

  // Update the driver record in the database using Prisma
  return prisma.driver.update({
    where: { id: driverId },
    data: updateData,
  });
};








// Delete a driver
exports.delete = async (id) => {
  return prisma.driver.delete({
    where: { id: parseInt(id) },
  });
};
