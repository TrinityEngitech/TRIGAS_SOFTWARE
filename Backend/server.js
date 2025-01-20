const express = require("express");
const cors = require("cors"); // Import the cors package
const path=require('path')
const app = express();
const productRoutes = require("./routes/productRoutes");
// const supplierRoutes = require('./routes/supplierRoutes');
// const tankercapacityRoutes = require('./routes/tankercapacityRoutes');
const supplierRoutes = require('./routes/supplierRoutes');

const SupplyLocationsRoutes = require('./routes/SupplyLocationsRoutes');
const companyRoutes = require('./routes/companyRoutes');
const roleManagementRoutes = require('./routes/roleManagementRoutes');
const teamManagementRoutes = require('./routes/teamManagementRoutes');
const empManagementRoutes = require('./routes/empManagementRoutes');
const driverRoutes = require('./routes/driverRoutes');
const tankerRoutes = require('./routes/tankerRoutes');
const transpoterRoutes = require('./routes/transporterRoutes');
const customerRoutes = require('./routes/customerRoutes');

const transportationChargeRoutes = require('./routes/transportationChargeRoutes');
const priceSheetRoutes = require('./routes/priceSheetRoutes');
const authRoutes = require('./routes/authRoutes');


// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json());
app.use('/uploads',express.static(path.join(__dirname,'uploads')))

// Routes
app.use("/api", authRoutes);

app.use("/api/products", productRoutes);

app.use('/api/supplier', supplierRoutes);

app.use('/api/SupplyLocations', SupplyLocationsRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/roles', roleManagementRoutes);
app.use('/api/teams', teamManagementRoutes);
app.use('/api/employees', empManagementRoutes);
app.use('/api/drivers', driverRoutes); 
app.use('/api/tankers', tankerRoutes); 
app.use('/api/transporters', transpoterRoutes); 
app.use('/api/customers', customerRoutes); 

// Transportation Charges Routes
app.use('/api/transportation-charges', transportationChargeRoutes);
// Price Sheet Routes
app.use('/api/price-sheets', priceSheetRoutes);



// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



