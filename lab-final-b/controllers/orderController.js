const Order = require('../models/Order');
const Product = require('../models/Product');

exports.getOrderPreview = async (req, res) => {
    const cart = req.session.cart || { items: [] };
    if (cart.items.length === 0) return res.redirect('/cart');

    const orderItems = [];
    let subtotal = 0;

    for (let item of cart.items) {
        const product = await Product.findById(item.productId);
        if (product) {
            orderItems.push({
                productData: product,
                name: product.name,
                price: product.price,
                quantity: item.quantity
            });
            subtotal += product.price * item.quantity;
        }
    }

    // Calculate Discount logic using res.locals from middleware
    console.log('CONTROLLER: res.locals.discountRate:', res.locals.discountRate);
    console.log('CONTROLLER: Subtotal:', subtotal);

    const discountAmount = subtotal * (res.locals.discountRate || 0);
    const finalTotal = subtotal - discountAmount;

    res.render('order-preview', {
        pageTitle: 'Order Preview',
        products: orderItems,
        totalPrice: finalTotal,      // This is the discounted total
        subtotal: subtotal,         // Original price
        discount: discountAmount,    // How much was saved
        couponCode: res.locals.couponCode
    });
};

exports.getMyOrdersSearch = (req, res) => {
    res.render('my-orders-search', {
        pageTitle: 'Search Order History',
        path: '/my-orders'
    });
};

exports.postMyOrdersResults = async (req, res) => {
    try {
        const { email } = req.body;

        // Find all orders matching the email, sorted by newest first
        const orders = await Order.find({ email: email }).sort({ createdAt: -1 });

        res.render('my-orders-list', {
            pageTitle: 'My Orders',
            path: '/my-orders',
            orders: orders,
            searchEmail: email
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error retrieving orders.");
    }
};


exports.postConfirmOrder = async (req, res) => {
    try {
        const email = req.body.email;
        const cart = req.session.cart;
        if (!cart || cart.items.length === 0) return res.redirect('/cart');

        if (!email) {
            return res.status(400).send("Email is required to place an order.");
        }

        const orderItems = [];
        let subtotal = 0;

        // Fetch fresh data to ensure price integrity
        for (let item of cart.items) {
            const product = await Product.findById(item.productId);
            if (product) {
                orderItems.push({
                    productId: product._id,
                    name: product.name,
                    price: product.price,
                    quantity: item.quantity
                });
                subtotal += product.price * item.quantity;
            }
        }

        // Apply middleware discount rate to the final save
        const discountAmount = subtotal * (res.locals.discountRate || 0);
        const finalTotal = subtotal - discountAmount;

        const order = new Order({
            items: orderItems,
            totalAmount: finalTotal, // SAVE THE DISCOUNTED PRICE
            status: 'Placed',
            email: email
        });

        await order.save();

        // Clear session data
        req.session.cart = { items: [] };

        res.render('order-success', {
            order: order,
            pageTitle: 'Order Placed'
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error confirming order: " + err.message);
    }
};