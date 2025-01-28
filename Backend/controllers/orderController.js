const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Generate a unique order number (Example: ORD-123456)
const generateOrderNumber = () => `ORD-${Date.now().toString().slice(-6)}`;
// Update order with tanker allocation

const createOrder = async (req, res) => {
  try {
    const {
      customerId,
      customerName,
      supplierName,
      supplyLoadingPoint,
      productName,
      productQuantity,
      teamName,
      orderCreatedBy,
      orderDateTime, // Input from request
    } = req.body;

    // Validate and parse productQuantity
    const productQuantityFloat = parseFloat(productQuantity);
    if (isNaN(productQuantityFloat)) {
      return res.status(400).json({ message: 'Invalid productQuantity. It must be a valid number.' });
    }

    // Validate and parse orderDateTime
    const parsedOrderDateTime = new Date(orderDateTime);
    if (isNaN(parsedOrderDateTime.getTime())) {
      return res.status(400).json({ message: 'Invalid orderDateTime. It must be a valid ISO-8601 DateTime string.' });
    }

    // Fetch supplierId from supplierName
    const supplier = await prisma.supplier.findFirst({
      where: { name: supplierName }, // Assuming 'name' is the field for supplierName in your Supplier table
    });

    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found.' });
    }

    const supplierId = supplier.id;

    // Trim whitespace and apply case-insensitive search for DoSo
    const doSoRecord = await prisma.doSo.findFirst({
      where: {
        supplierId: supplierId,
        productName: productName.trim(),
        loadingPoint: supplyLoadingPoint.trim(),
        customerName: customerName.trim(),
      },
    });

    const dosoNumber = doSoRecord ? doSoRecord.doSoNumber : null; // Use null if DoSo record is not found

    // Generate a unique order number
    const orderNumber = generateOrderNumber();

    // Save the order in the database
    const newOrder = await prisma.order.create({
      data: {
        customerId,
        customerName,
        supplierName,
        supplyLoadingPoint,
        productName,
        productQuantity: productQuantityFloat,
        teamName,
        orderCreatedBy,
        orderDateTime: parsedOrderDateTime, // Save as a valid DateTime
        dosoNumber, // Save the value, which could be null
        orderNumber,
      },
    });

    res.status(201).json({ message: 'Order created successfully.', order: newOrder });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};




const allocateTankerToOrder = async (req, res) => {
  try {
    const { orderId, tankerId } = req.body;

    // Update the order with tankerId
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { tankerId },
    });

    res.status(200).json({ message: 'Tanker allocated successfully.', order: updatedOrder });
  } catch (error) {
    console.error('Error allocating tanker:', error);
    res.status(500).json({ message: 'Internal server error.', error });
  }
};

// Update additional fields later
const updateOrderAdditionalFields = async (req, res) => {
  try {
    const { orderId, orderBookDateTime, orderReferenceNumber, orderRemark } = req.body;

    // Update the order with additional fields
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        orderBookDateTime,
        orderReferenceNumber,
        orderRemark,
      },
    });

    res.status(200).json({ message: 'Order updated successfully.', order: updatedOrder });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Internal server error.', error });
  }
};

// Update orderBookDateTime and set status to "Approved"
const updateOrderBookDateTime = async (req, res) => {
  const { id } = req.params; // Order ID from URL
  const { orderBookDateTime } = req.body; // New orderBookDateTime from request body

  try {
    // Validate input
    if (!orderBookDateTime) {
      return res.status(400).json({ message: "orderBookDateTime is required." });
    }

    // Update the order with the provided orderBookDateTime and change status to "Approved"
    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(id) },
      data: {
        orderBookDateTime: new Date(orderBookDateTime), // Ensure the date is in proper format
        status: "Approved", // Set status to "Approved"
      },
    });

    res.status(200).json({
      message: "Order updated successfully. Status changed to 'Approved'.",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating orderBookDateTime and status:", error);
    res.status(500).json({
      message: "Failed to update orderBookDateTime and status.",
      error: error.message,
    });
  }
};



const getOrderById = async (req, res) => {
  const { id } = req.params; // Get the order ID from request parameters

  try {
    // Fetch the order with all related data by ID
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) }, // Convert `id` to an integer
      include: {
        Customer: true,         // Include customer details
        Tanker: true,           // Include tanker details (optional)
        payments: true,         // Include order payments
        orderTankers: true,     // Include order tankers
      },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    res.status(500).json({ message: "Error fetching order by ID", error });
  }
};


const getAllOrders = async (req, res) => {
  try {
    // Fetch orders with all related data
    const orders = await prisma.order.findMany({
      include: {
        Customer: true, // Include customer details
        Tanker: true,   // Include tanker details (optional)
        payments: true, // Include order payments
        orderTankers: true, // Include order tankers
      },
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Error fetching orders", error });
  }
};



module.exports = {
  createOrder,
  updateOrderBookDateTime,
  allocateTankerToOrder,
  updateOrderAdditionalFields,
  getAllOrders,
  getOrderById
};




