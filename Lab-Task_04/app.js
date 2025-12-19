const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const Product = require('./models/Product');
const mongoose = require('mongoose');
const pageRoutes = require('./routes/pageRoutes');
const adminRoutes = require('./routes/adminRoutes');

mongoose.connect('mongodb://127.0.0.1:27017/HandyMan')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Error:', err));



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use('/', pageRoutes);
app.use('/admin', adminRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
