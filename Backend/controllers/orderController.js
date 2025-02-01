const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Generate a unique order number (Example: ORD-123456)
const generateOrderNumber = () => `ORD-${Date.now().toString().slice(-6)}`;
// Update order with tanker allocation

exports.createOrder = async (req, res) => {
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
    console.log(req.body);

    // Validate and parse productQuantity
    const productQuantityFloat = parseFloat(productQuantity);
    if (isNaN(productQuantityFloat)) {
      return res.status(400).json({
        message: "Invalid productQuantity. It must be a valid number.",
      });
    }

    // Validate and convert orderDateTime to UTC
    const parsedOrderDateTime = new Date(orderDateTime);
    const utcOrderDateTime = new Date(
      parsedOrderDateTime.getTime() -
        parsedOrderDateTime.getTimezoneOffset() * 60000
    ).toISOString();

    // Fetch supplierId from supplierName
    const supplier = await prisma.supplier.findFirst({
      where: { name: supplierName },
    });

    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found." });
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

    const dosoNumber = doSoRecord ? doSoRecord.doSoNumber : null;

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
        orderDateTime: utcOrderDateTime, // Save in UTC
        dosoNumber,
        orderNumber,
      },
    });

    res
      .status(201)
      .json({ message: "Order created successfully.", order: newOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};

// Update orderBookDateTime and set status to "Approved"
exports.updateOrderBookDateTime = async (req, res) => {
  const { id } = req.params; // Order ID from URL
  const { orderBookDateTime } = req.body; // New orderBookDateTime from request body

  try {
    // Validate input
    if (!orderBookDateTime) {
      return res
        .status(400)
        .json({ message: "orderBookDateTime is required." });
    }

    // Parse the orderBookDateTime and convert to UTC
    const parsedOrderBookDateTime = new Date(orderBookDateTime);
    if (isNaN(parsedOrderBookDateTime.getTime())) {
      return res
        .status(400)
        .json({
          message:
            "Invalid orderBookDateTime format. Please provide a valid ISO-8601 DateTime string.",
        });
    }

    // Adjust to UTC
    const utcOrderBookDateTime = new Date(
      parsedOrderBookDateTime.getTime() -
        parsedOrderBookDateTime.getTimezoneOffset() * 60000
    );

    // Update the order with the provided orderBookDateTime and change status to "Approved"
    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(id) },
      data: {
        orderBookDateTime: utcOrderBookDateTime, // Ensure UTC time is stored
        status: "Order Booked", // Set status to "Approved"
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

// ----------------------------------------

// exports.createPayment = async (req, res) => {
//   const {
//     paymentUTR,
//     paymentDateTime,
//     paymentAmount,
//     customerName,
//     customerId,
//   } = req.body;
//   const { id } = req.params; // Extract order ID from URL params
//   const paymentSlipImage = req.file ? req.file.path : null; // Handle file upload

//   console.log(id);
//   console.log(req.body);
//   console.log(req.file);

//   try {
//     // Validate input fields
//     if (
//       !id ||
//       !paymentUTR ||
//       !paymentDateTime ||
//       !paymentAmount ||
//       !customerName ||
//       !customerId ||
//       !paymentSlipImage
//     ) {
//       return res
//         .status(400)
//         .json({
//           message:
//             "All payment details, including the payment slip image, are required.",
//         });
//     }

//     // Ensure paymentUTR is an integer
//     const parsedPaymentUTR = parseInt(paymentUTR.replace(/\D/g, ""), 10); // Remove any non-numeric characters and parse as integer

//     // Check if parsedPaymentUTR is a valid integer
//     if (isNaN(parsedPaymentUTR)) {
//       return res.status(400).json({ message: "Invalid paymentUTR provided." });
//     }

//     // Create a new payment record
//     const newPayment = await prisma.orderPayment.create({
//       data: {
//         paymentUTR: parsedPaymentUTR, // Ensure it's parsed correctly
//         paymentSlipImage,
//         paymentDateTime: new Date(paymentDateTime),
//         paymentAmount: parseFloat(paymentAmount),
//         paymentStatus: "Payment Pending", // Default status
//         customerName,

//         // Use the correct relational reference for `Customer` and `Order`
//         Order: {
//           connect: { id: parseInt(id) }, // Connect the existing order by its ID
//         },
//         Customer: {
//           connect: { id: parseInt(customerId) }, // Connect the existing customer by their ID
//         },
//       },
//     });

//     res.status(201).json({
//       message: "Payment created successfully with status 'Pending'.",
//       payment: newPayment,
//     });
//   } catch (error) {
//     console.error("Error creating payment:", error);
//     res.status(500).json({
//       message: "Failed to create payment.",
//       error: error.message,
//     });
//   }
// };

exports.createPayment = async (req, res) => {
  const {
    paymentUTR,
    paymentDateTime,
    paymentAmount,
    customerName,
    customerId,
  } = req.body;
  const { id } = req.params; // Extract order ID from URL params
  const paymentSlipImage = req.file ? req.file.path : null; // Handle file upload

  console.log(id);
  console.log(req.body);
  console.log(req.file);

  try {
    // Validate input fields
    if (
      !id ||
      !paymentUTR ||
      !paymentDateTime ||
      !paymentAmount ||
      !customerName ||
      !customerId ||
      !paymentSlipImage
    ) {
      return res.status(400).json({
        message:
          "All payment details, including the payment slip image, are required.",
      });
    }

    // Ensure paymentUTR is an integer
    const parsedPaymentUTR = parseInt(paymentUTR.replace(/\D/g, ""), 10); // Remove any non-numeric characters and parse as integer

    // Check if parsedPaymentUTR is a valid integer
    if (isNaN(parsedPaymentUTR)) {
      return res.status(400).json({ message: "Invalid paymentUTR provided." });
    }

    // Parse the paymentDateTime and convert it to UTC
    const parsedPaymentDateTime = new Date(paymentDateTime);
    if (isNaN(parsedPaymentDateTime.getTime())) {
      return res
        .status(400)
        .json({
          message:
            "Invalid paymentDateTime format. Please provide a valid ISO-8601 DateTime string.",
        });
    }

    const utcPaymentDateTime = new Date(
      parsedPaymentDateTime.getTime() -
        parsedPaymentDateTime.getTimezoneOffset() * 60000
    );

    // Create a new payment record
    const newPayment = await prisma.orderPayment.create({
      data: {
        paymentUTR: parsedPaymentUTR, // Ensure it's parsed correctly
        paymentSlipImage,
        paymentDateTime: utcPaymentDateTime, // Store in UTC format
        paymentAmount: parseFloat(paymentAmount),
        paymentStatus: "Payment Pending", // Default status
        customerName,

        // Use the correct relational reference for `Customer` and `Order`
        Order: {
          connect: { id: parseInt(id) }, // Connect the existing order by its ID
        },
        Customer: {
          connect: { id: parseInt(customerId) }, // Connect the existing customer by their ID
        },
      },
    });

    res.status(201).json({
      message: "Payment created successfully with status 'Pending'.",
      payment: newPayment,
    });
  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).json({
      message: "Failed to create payment.",
      error: error.message,
    });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  const { id, paymentStatus } = req.body; // Capture id (orderId) and paymentStatus from request body

  try {
    // Validate input
    if (paymentStatus === undefined) {
      return res.status(400).json({ message: "Payment status is required." });
    }

    // Check if paymentStatus is true (Payment Credited) or false (Payment Rejected)
    let updatedPaymentStatus;
    if (paymentStatus === true) {
      updatedPaymentStatus = "Payment Credited";
    } else if (paymentStatus === false) {
      updatedPaymentStatus = "Payment Rejected";
    } else {
      return res
        .status(400)
        .json({ message: "Invalid value for payment status." });
    }

    // Find the first OrderPayment by orderId (id)
    const existingPayment = await prisma.orderPayment.findFirst({
      where: { orderId: parseInt(id) }, // Check if an OrderPayment exists for this orderId
    });

    if (!existingPayment) {
      return res
        .status(404)
        .json({ message: "No payment record found for this orderId." });
    }

    // If OrderPayment exists, update the payment status
    const updatedPayment = await prisma.orderPayment.update({
      where: { id: existingPayment.id }, // Use the id of the existing OrderPayment record
      data: { paymentStatus: updatedPaymentStatus }, // Set the new payment status
    });

    // Also, update the related order status if payment is credited or rejected
    let orderStatus;
    if (updatedPaymentStatus === "Payment Credited") {
      orderStatus = "Payment Credited";
    } else if (updatedPaymentStatus === "Payment Rejected") {
      orderStatus = "Payment Rejected";
    }

    // Update the order status based on the payment status
    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(id) }, // Use orderId to update the related order
      data: { status: orderStatus }, // Set the new order status
    });

    res.status(200).json({
      message: `Payment status updated to '${updatedPaymentStatus}' and order status updated to '${orderStatus}'.`,
      payment: updatedPayment,
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating payment and order status:", error);
    res.status(500).json({
      message: "Failed to update payment and order status.",
      error: error.message,
    });
  }
};

// ------------------------------------

// POST: Create Tanker Allocation and Update Order Status
exports.createTankerAllocation = async (req, res) => {
  const { id } = req.params;
  const orderId = parseInt(id, 10); // Ensure it's a number

  const {
    transporterName,
    tankerCapacity,
    tankerNumber,
    driverName,
    driverNumber,
    tankerGPS,
  } = req.body;

  console.log(req.body);

  try {
    // Start a transaction to ensure both the tanker allocation and order update happen together
    const result = await prisma.$transaction(async (prisma) => {
      // Step 1: Create the tanker allocation
      const newTanker = await prisma.orderTanker.create({
        data: {
          orderId,
          transporterName,
          tankerCapacity,
          tankerNumber,
          driverName,
          driverNumber,
          tankerGPS,
          tankerStatus: "Pending", // Default status
          tankerDosoNumber: null, // Initially set to null
        },
      });

      // Step 2: Update the order status to 'tankerAllocated'
      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "Tanker Allocated",
        },
      });

      // Return both the new tanker and the updated order
      return { newTanker, updatedOrder };
    });

    // Send success response
    res.status(201).json({
      message: "Tanker allocated successfully, order status updated.",
      tanker: result.newTanker,
      order: result.updatedOrder,
    });
  } catch (error) {
    console.error(
      "Error creating tanker allocation and updating order:",
      error
    );
    res
      .status(500)
      .json({ error: "Error creating tanker allocation and updating order" });
  }
};

exports.updateTankerDosoNumber = async (req, res) => {
  try {
    const { id, tankerNumber } = req.params; // Extract orderId and tankerNumber from params
    const { tankerDosoNumber } = req.body; // Extract new DO/SO number from request body

    console.log(id);
    console.log(tankerNumber);
    console.log(tankerDosoNumber);

    // Check if the tanker exists and belongs to the given order
    const tankerExists = await prisma.orderTanker.findFirst({
      where: {
        orderId: Number(id), // Ensure the tanker belongs to the correct order
        tankerNumber: tankerNumber, // Match the given tanker number
      },
    });

    if (!tankerExists) {
      return res
        .status(404)
        .json({ message: "Tanker not found for this order" });
    }

    // ✅ Update only the tankerDosoNumber field in orderTanker
    const updatedTanker = await prisma.orderTanker.update({
      where: { id: tankerExists.id }, // Use the tanker's ID for updating
      data: { tankerDosoNumber },
    });

    // ✅ Update the tankerStatus in the Order table
    await prisma.order.update({
      where: { id: Number(id) }, // Match the order ID
      data: { status: "DO/SO Generated" },
    });

    return res.status(200).json({
      message:
        "Tanker DO/SO Number updated successfully and Order status changed to 'DO/SO Generated'",
      tanker: {
        id: updatedTanker.id,
        tankerNumber: updatedTanker.tankerNumber,
        orderId: updatedTanker.orderId,
        tankerDosoNumber: updatedTanker.tankerDosoNumber,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating tanker DO/SO number",
      error: error.message,
    });
  }
};

exports.updateTankerReportingDateTime = async (req, res) => {
  try {
    const { id, tankerNumber } = req.params; // Extract orderId and tankerNumber from params
    const { reportingDateTime } = req.body; // Extract reportingDateTime from request body

    // Check if the tanker exists and belongs to the given order
    const tankerExists = await prisma.orderTanker.findFirst({
      where: {
        orderId: Number(id), // Ensure the tanker belongs to the correct order
        tankerNumber: tankerNumber, // Match the given tanker number
      },
    });

    if (!tankerExists) {
      return res
        .status(404)
        .json({ message: "Tanker not found for this order" });
    }

    // ✅ Update only the reportingDateTime field in orderTanker
    const updatedTanker = await prisma.orderTanker.update({
      where: { id: tankerExists.id }, // Use the tanker's ID for updating
      data: { reportingDateTime: new Date(reportingDateTime) },
    });

    // ✅ Update the tankerStatus in the Order table
    await prisma.order.update({
      where: { id: Number(id) }, // Match the order ID
      data: { status: "Tanker Reported" },
    });

    return res.status(200).json({
      message:
        "Tanker reporting DateTime updated successfully and Order status changed to 'Tanker Reported'",
      tanker: {
        id: updatedTanker.id,
        tankerNumber: updatedTanker.tankerNumber,
        orderId: updatedTanker.orderId,
        reportingDateTime: updatedTanker.reportingDateTime,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating tanker reporting DateTime",
      error: error.message,
    });
  }
};

exports.updateTankerLoadingDateTime = async (req, res) => {
  try {
    const { id, tankerNumber } = req.params; // Extract orderId and tankerNumber from params
    const { loadingDateTime } = req.body; // Extract loadingDateTime from request body

    // Check if the tanker exists and belongs to the given order
    const tankerExists = await prisma.orderTanker.findFirst({
      where: {
        orderId: Number(id), // Ensure the tanker belongs to the correct order
        tankerNumber: tankerNumber, // Match the given tanker number
      },
    });

    if (!tankerExists) {
      return res
        .status(404)
        .json({ message: "Tanker not found for this order" });
    }

    // ✅ Update only the loadingDateTime field in orderTanker
    const updatedTanker = await prisma.orderTanker.update({
      where: { id: tankerExists.id }, // Use the tanker's ID for updating
      data: { loadingDateTime: new Date(loadingDateTime) },
    });

    // ✅ Update the tankerStatus in the Order table
    await prisma.order.update({
      where: { id: Number(id) }, // Match the order ID
      data: { status: "Tanker Loaded" },
    });

    return res.status(200).json({
      message:
        "Tanker loading DateTime updated successfully and Order status changed to 'Tanker Loaded'",
      tanker: {
        id: updatedTanker.id,
        tankerNumber: updatedTanker.tankerNumber,
        orderId: updatedTanker.orderId,
        loadingDateTime: updatedTanker.loadingDateTime,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating tanker loading DateTime",
      error: error.message,
    });
  }
};

exports.updateTankerStatusWithRemark = async (req, res) => {
  try {
    const { id, tankerNumber } = req.params; // Extract orderId and tankerNumber from params
    const { remarkStatus, tankerStatus } = req.body; // Extract remarkStatus (string) and tankerStatus (boolean) from request body

    // Validate tankerStatus as a boolean
    if (typeof tankerStatus !== "boolean") {
      return res.status(400).json({
        message: "Invalid tankerStatus value. Expected true or false.",
      });
    }

    // Validate remarkStatus as a string (it can be an empty string if no reason is provided)
    if (typeof remarkStatus !== "string") {
      return res
        .status(400)
        .json({ message: "Invalid remarkStatus value. Expected a string." });
    }

    // Check if the tanker exists and belongs to the given order
    const tankerExists = await prisma.orderTanker.findFirst({
      where: {
        orderId: Number(id), // Ensure the tanker belongs to the correct order
        tankerNumber: tankerNumber, // Match the given tanker number
      },
    });

    if (!tankerExists) {
      return res
        .status(404)
        .json({ message: "Tanker not found for this order" });
    }

    // Prepare the tanker status value based on the boolean input
    const updatedTankerStatus = tankerStatus
      ? "Tanker Loaded"
      : "Tanker Rejected"; // If true, set "Loaded", otherwise "Rejected"

    // ✅ Update tankerStatus and remarkStatus fields in orderTanker
    const updatedTanker = await prisma.orderTanker.update({
      where: { id: tankerExists.id }, // Use the tanker's ID for updating
      data: {
        tankerStatus: updatedTankerStatus, // Set the tanker status to Loaded/Rejected
        remarkStatus: remarkStatus, // Set the remark with the provided reason
      },
    });

    // ✅ Optionally update the status in the Order table
    await prisma.order.update({
      where: { id: Number(id) }, // Match the order ID
      data: {
        status: updatedTankerStatus, // Optionally set order status to match tankerStatus
      },
    });

    return res.status(200).json({
      message: `Tanker status updated successfully. Tanker is ${updatedTankerStatus} and Remark is: ${remarkStatus}`,
      tanker: {
        id: updatedTanker.id,
        tankerNumber: updatedTanker.tankerNumber,
        orderId: updatedTanker.orderId,
        tankerStatus: updatedTanker.tankerStatus,
        remarkStatus: updatedTanker.remarkStatus, // Return the remark status (reason)
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating tanker status and remark",
      error: error.message,
    });
  }
};

exports.updateInvoiceWeightAndDispatchedDateTime = async (req, res) => {
  try {
    const { id, tankerNumber } = req.params; // Extract orderId and tankerNumber from params
    const { invoiceWeight, tankerDispatchedDateTime } = req.body; // Extract invoiceWeight and tankerDispatchedDateTime from request body

    // Validate invoiceWeight as a number
    if (typeof invoiceWeight !== "number") {
      return res
        .status(400)
        .json({ message: "Invalid invoiceWeight value. Expected a number." });
    }

    // Validate tankerDispatchedDateTime as a valid Date
    if (isNaN(new Date(tankerDispatchedDateTime))) {
      return res.status(400).json({
        message:
          "Invalid tankerDispatchedDateTime value. Expected a valid date.",
      });
    }

    // Check if the tanker exists and belongs to the given order
    const tankerExists = await prisma.orderTanker.findFirst({
      where: {
        orderId: Number(id), // Ensure the tanker belongs to the correct order
        tankerNumber: tankerNumber, // Match the given tanker number
      },
    });

    if (!tankerExists) {
      return res
        .status(404)
        .json({ message: "Tanker not found for this order" });
    }

    // ✅ Update invoiceWeight and tankerDispatchedDateTime fields in orderTanker
    const updatedTanker = await prisma.orderTanker.update({
      where: { id: tankerExists.id }, // Use the tanker's ID for updating
      data: {
        invoiceWeight: invoiceWeight, // Set the invoice weight
        tankerDispatchedDateTime: new Date(tankerDispatchedDateTime), // Set the dispatched date-time
      },
    });

    // ✅ Optionally update the status in the Order table
    await prisma.order.update({
      where: { id: Number(id) }, // Match the order ID
      data: {
        status: "Tanker Dispatched", // Optionally set order status to match dispatched
      },
    });

    return res.status(200).json({
      message: "Invoice weight and dispatched date updated successfully.",
      tanker: {
        id: updatedTanker.id,
        tankerNumber: updatedTanker.tankerNumber,
        orderId: updatedTanker.orderId,
        invoiceWeight: updatedTanker.invoiceWeight,
        tankerDispatchedDateTime: updatedTanker.tankerDispatchedDateTime,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating invoice weight and tanker dispatched date",
      error: error.message,
    });
  }
};

exports.updateTankerDeliverDateTime = async (req, res) => {
  try {
    const { id, tankerNumber } = req.params; // Extract orderId and tankerNumber from params
    const { tankerDeliverDateTime } = req.body; // Extract tankerDeliverDateTime from request body

    // Check if the tanker exists and belongs to the given order
    const tankerExists = await prisma.orderTanker.findFirst({
      where: {
        orderId: Number(id), // Ensure the tanker belongs to the correct order
        tankerNumber: tankerNumber, // Match the given tanker number
      },
    });

    if (!tankerExists) {
      return res
        .status(404)
        .json({ message: "Tanker not found for this order" });
    }

    // ✅ Update only the tankerDeliverDateTime field in orderTanker
    const updatedTanker = await prisma.orderTanker.update({
      where: { id: tankerExists.id }, // Use the tanker's ID for updating
      data: { tankerDeliverDateTime: new Date(tankerDeliverDateTime) },
    });

    // ✅ Optionally update the tanker status in the Order table if needed
    await prisma.order.update({
      where: { id: Number(id) }, // Match the order ID
      data: { status: "Tanker Delivered" }, // You can adjust the status as needed
    });

    return res.status(200).json({
      message:
        "Tanker delivery DateTime updated successfully and Order status changed to 'Tanker Dispatched'",
      tanker: {
        id: updatedTanker.id,
        tankerNumber: updatedTanker.tankerNumber,
        orderId: updatedTanker.orderId,
        tankerDeliverDateTime: updatedTanker.tankerDeliverDateTime,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating tanker delivery DateTime",
      error: error.message,
    });
  }
};

exports.updateTankerUnloadedDateTime = async (req, res) => {
  try {
    const { id, tankerNumber } = req.params; // Extract orderId and tankerNumber from params
    const { tankerUnloadedDateTime } = req.body; // Extract tankerUnloadedDateTime from request body

    // Check if the tanker exists and belongs to the given order
    const tankerExists = await prisma.orderTanker.findFirst({
      where: {
        orderId: Number(id), // Ensure the tanker belongs to the correct order
        tankerNumber: tankerNumber, // Match the given tanker number
      },
    });

    if (!tankerExists) {
      return res
        .status(404)
        .json({ message: "Tanker not found for this order" });
    }

    // ✅ Update only the tankerUnloadedDateTime field in orderTanker
    const updatedTanker = await prisma.orderTanker.update({
      where: { id: tankerExists.id }, // Use the tanker's ID for updating
      data: { tankerUnloadedDateTime: new Date(tankerUnloadedDateTime) },
    });

    // ✅ Optionally update the tanker status in the Order table if needed
    await prisma.order.update({
      where: { id: Number(id) }, // Match the order ID
      data: { status: "Tanker Unloaded" }, // You can adjust the status as needed
    });

    return res.status(200).json({
      message:
        "Tanker unloaded DateTime updated successfully and Order status changed to 'Tanker Unloaded'",
      tanker: {
        id: updatedTanker.id,
        tankerNumber: updatedTanker.tankerNumber,
        orderId: updatedTanker.orderId,
        tankerUnloadedDateTime: updatedTanker.tankerUnloadedDateTime,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating tanker unloaded DateTime",
      error: error.message,
    });
  }
};

exports.updateOrderCompletion = async (req, res) => {
  try {
    const { id } = req.params; // Extract orderId from params
    const { referenceNumber, remark } = req.body; // Extract referenceNumber and remark from the request body

    // Validate the input
    if (!referenceNumber || !remark) {
      return res
        .status(400)
        .json({ message: "Reference number and remark are required." });
    }

    // Check if the order exists
    const orderExists = await prisma.order.findUnique({
      where: {
        id: Number(id), // Match the order ID
      },
    });

    if (!orderExists) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update the order's referenceNumber, remark, and status to "Completed"
    const updatedOrder = await prisma.order.update({
      where: { id: Number(id) }, // Use the order ID for updating
      data: {
        orderReferenceNumber: referenceNumber, // Set the reference number
        orderRemark: remark, // Set the remark
        status: "Order completed", // Update the status to "Completed"
      },
    });

    return res.status(200).json({
      message: "Order marked as completed successfully.",
      order: {
        id: updatedOrder.id,
        orderReferenceNumber: updatedOrder.orderReferenceNumber,
        orderRemark: updatedOrder.orderRemark,
        status: updatedOrder.status,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating order completion",
      error: error.message,
    });
  }
};

// ------------------------------------

// ____________________________________________________

exports.getOrderById = async (req, res) => {
  const { id } = req.params; // Get the order ID from request parameters

  try {
    // Fetch the order with all related data by ID
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) }, // Convert `id` to an integer
      include: {
        Customer: true, // Include customer details
        Tanker: true, // Include tanker details (optional)
        payments: true, // Include order payments
        orderTankers: true, // Include order tankers
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
exports.getAllOrders = async (req, res) => {
  try {
    // Fetch orders with all related data
    const orders = await prisma.order.findMany({
      include: {
        Customer: true, // Include customer details
        Tanker: true, // Include tanker details (optional)
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
// ____________________________________________________
