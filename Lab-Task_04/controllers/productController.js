const Product = require('../models/Product');


exports.getProducts = async (req, res) => {
    try {
        let { category, page = 1, limit = 6 } = req.query;

        
        let filter = {};
        if (category) filter.category = category;

        
        const products = await Product.find(filter)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        
        const count = await Product.countDocuments(filter);

        
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