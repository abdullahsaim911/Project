const Product = require('../models/Product');

// Fetch all products with filtering and pagination
exports.getProducts = async (req, res) => {
    try {
        let { category, page = 1, limit = 6 } = req.query;

        // 1. Build Filter object
        let filter = {};
        if (category) filter.category = category;

        // 2. Fetch Data from MongoDB
        // limit*1 converts string to number; skip calculates the offset
        const products = await Product.find(filter)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        // 3. Get total count for pagination calculation
        const count = await Product.countDocuments(filter);

        // 4. Render the EJS view with the data
        res.render('shop', {
            title: 'Shop - BeHandyman',
            page: 'shop',
            css: ['shop.css'],
            products: products,
            totalPages: Math.ceil(count / limit),
            currentPage: Number(page),
            selectedCategory: category || ''
        });
    } catch (err) {
        console.error("Shop Page Error:", err);
        res.status(500).send("Database Error: " + err.message + "<br><pre>" + err.stack + "</pre>");
    }
};