const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const Product = require('./models/Product');
const mongoose = require('mongoose');
const pageRoutes = require('./routes/pageRoutes');
const adminRoutes = require('./routes/adminRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
const applyDiscount = require('./middleware/discount');

mongoose.connect('mongodb://127.0.0.1:27017/HandyMan')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Error:', err));



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const store = new MongoDBStore({
    uri: 'mongodb://127.0.0.1:27017/HandyMan',
    collection: 'sessions'
});

app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
}));

// Middleware to initialize cart in session if it doesn't exist
app.use((req, res, next) => {
    if (!req.session.cart) {
        req.session.cart = { items: [] };
    }
    next();
});

// Middleware to make cart available to all views
app.use((req, res, next) => {
    res.locals.cart = req.session.cart;
    next();
});


app.use('/', pageRoutes);
app.use('/admin', adminRoutes);

app.use('/cart', cartRoutes);

app.use('/order', applyDiscount, orderRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
