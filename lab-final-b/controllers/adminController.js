const Product = require('../models/Product');
const Order = require('../models/Order');


exports.getAdminOrders = async (req, res) => {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.render('admin/orders', {
        orders: orders,
        title: 'Manage Orders'
    });
};


exports.postUpdateStatus = async (req, res) => {
    const { orderId, nextStatus } = req.body;
    const order = await Order.findById(orderId);

    const currentStatus = order.status;
    let isAllowed = false;

    // Task 4 Logic: Prevent skipping states
    if (currentStatus === 'Placed' && nextStatus === 'Processing') isAllowed = true;
    if (currentStatus === 'Processing' && nextStatus === 'Delivered') isAllowed = true;

    if (isAllowed) {
        order.status = nextStatus;
        await order.save();
        res.redirect('/admin/orders');
    } else {
        res.status(400).send(`Error: Cannot move from ${currentStatus} to ${nextStatus}`);
    }
};


exports.getDashboard = async (req, res) => {
    try {
        const products = await Product.find();
        res.render('admin/dashboard', {
            title: 'Admin Dashboard',
            products: products
        });
    } catch (err) {
        res.status(500).send("Error fetching products: " + err.message);
    }
};


exports.getAddProduct = (req, res) => {
    res.render('admin/product-form', {
        title: 'Add New Product',
        editing: false,
        product: null
    });
};


exports.postAddProduct = async (req, res) => {
    try {
        const { name, price, category, description, image } = req.body;
        const newProduct = new Product({
            name,
            price,
            category,
            description,
            image
        });
        await newProduct.save();
        res.redirect('/admin');
    } catch (err) {
        res.status(500).send("Error saving product: " + err.message);
    }
};


exports.getEditProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.redirect('/admin');
        }
        res.render('admin/product-form', {
            title: 'Edit Product',
            editing: true,
            product: product
        });
    } catch (err) {
        res.status(500).send("Error fetching product: " + err.message);
    }
};


exports.postEditProduct = async (req, res) => {
    try {
        const { name, price, category, description, image } = req.body;
        await Product.findByIdAndUpdate(req.params.id, {
            name,
            price,
            category,
            description,
            image
        });
        res.redirect('/admin');
    } catch (err) {
        res.status(500).send("Error updating product: " + err.message);
    }
};


exports.deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.redirect('/admin');
    } catch (err) {
        res.status(500).send("Error deleting product: " + err.message);
    }
};
