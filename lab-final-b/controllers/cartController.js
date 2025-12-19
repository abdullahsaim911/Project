const Product = require('../models/Product');

exports.getCart = async (req, res) => {
    const cart = req.session.cart;
    const products = [];
    let totalPrice = 0;

    // Fetch product details for items in cart
    for (let item of cart.items) {
        const product = await Product.findById(item.productId);
        if (product) {
            products.push({ productData: product, quantity: item.quantity });
            totalPrice += product.price * item.quantity;
        }
    }

    res.render('cart', {
        title: 'Your Cart',
        products: products,
        totalPrice: totalPrice,
        page: 'cart'
    });
};

exports.postCart = async (req, res) => {
    const productId = req.body.productId;
    const cart = req.session.cart;

    const cartProductIndex = cart.items.findIndex(cp => {
        return cp.productId.toString() === productId.toString();
    });

    let newQuantity = 1;
    const updatedCartItems = [...cart.items];

    if (cartProductIndex >= 0) {
        newQuantity = cart.items[cartProductIndex].quantity + 1;
        updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
        updatedCartItems.push({
            productId: productId,
            quantity: newQuantity
        });
    }

    cart.items = updatedCartItems;

    // Explicitly save the session to ensure updates are persisted before redirect
    req.session.save(err => {
        if (err) console.log(err);
        res.redirect('/cart'); // Redirect to cart to show it was added
    });
};

exports.postCartDeleteProduct = (req, res) => {
    const productId = req.body.productId;
    const cart = req.session.cart;

    const updatedCartItems = cart.items.filter(item => {
        return item.productId.toString() !== productId.toString();
    });

    cart.items = updatedCartItems;
    req.session.save(err => {
        if (err) console.log(err);
        res.redirect('/cart');
    });
};
