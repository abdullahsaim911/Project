const mongoose = require('mongoose');
const Product = require('./models/Product'); // Ensure the path to your model is correct

// 1. Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/HandyMan')
    .then(() => console.log('Connected to MongoDB for seeding...'))
    .catch(err => console.error('Connection error:', err));

const seedProducts = [
    {
        name: "Classic Oak Chair",
        price: 120,
        category: "Chairs",
        image: "/assets/home_handyman_slider_slide_3.png",
        description: "Handcrafted from solid white oak with a natural finish."
    },
    {
        name: "Modern Curved Chair",
        price: 250,
        category: "Chairs",
        image: "/assets/home_handyman_slider_slide_2.png",
        description: "A statement piece featuring ergonomic wooden curves."
    },
    {
        name: "Artisan Coffee Table",
        price: 450,
        category: "Furniture",
        image: "/assets/home_handyman_works1.jpg",
        description: "Large walnut coffee table with hand-carved joinery."
    },
    {
        name: "Minimalist Cabinet",
        price: 890,
        category: "Furniture",
        image: "/assets/home_handyman_works2.jpg",
        description: "Spacious storage solution with sleek wooden handles."
    },
    {
        name: "Wooden Wall Decor",
        price: 45,
        category: "Decor",
        image: "/assets/home_handyman_icon1.png",
        description: "Small decorative wooden icon for wall mounting."
    },
    {
        name: "Hardwood Floor Sample",
        price: 15,
        category: "Renovations",
        image: "/assets/home_handyman_works4.jpg",
        description: "Premium ash wood flooring sample with matte coating."
    }
];

const seedDB = async () => {
    try {
        // 2. Clear existing products so you don't double up
        await Product.deleteMany({});
        console.log('Database cleared.');

        // 3. Insert the sample data
        await Product.insertMany(seedProducts);
        console.log('Sample products added successfully!');

        // 4. Close the connection
        mongoose.connection.close();
        console.log('Connection closed.');
    } catch (err) {
        console.error('Error seeding data:', err);
    }
};

seedDB();