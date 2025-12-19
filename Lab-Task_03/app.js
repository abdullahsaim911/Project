const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const pageRoutes = require('./routes/pageRoutes');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));


app.use('/', pageRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
