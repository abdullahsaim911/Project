const getHome = (req, res) => {
    res.render('index', { title: 'BeHandyman', page: 'home' });
};

const getWorks = (req, res) => {
    res.render('works', { title: 'Our Works - BeHandyman', page: 'works', css: ['works.css'] });
};

const getAbout = (req, res) => {
    res.render('about', { title: 'About Us - BeHandyman', page: 'about', css: ['about.css'] });
};

const getContact = (req, res) => {
    res.render('contact', { title: 'Contact Us - BeHandyman', page: 'contact', css: ['contact.css'] });
};

module.exports = {
    getHome,
    getWorks,
    getAbout,
    getContact
};
