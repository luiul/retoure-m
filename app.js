const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const dotenv = require('dotenv')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const Handlebars = require('handlebars')

dotenv.config({ path: "./.env" })

// Start server on localhost:5000
const app = express()
const PORT = process.env.PORT || 5000
app.listen(PORT, console.log(`Server started on port ${PORT}`))

// Connect to database and authenticate connection
const db = require('./config/database')
try {
    db.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

// Express-Handlebars router middleware (https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/routes)
app.engine('.hbs', exphbs({ extname: '.hbs', defaultLayout: 'main', handlebars: allowInsecurePrototypeAccess(Handlebars) }));
app.set('view engine', '.hbs');
// Set static folder for css style
app.use(express.static(path.join(__dirname, 'public')))

// Body parser
app.use(express.urlencoded({ extended: false }));

// INDEX ROUTE
app.get('/', (req, res) => {
    res.render('index', { layout: 'landing' })
})

// TRANSPORT ROUTE
app.use('/transport', require('./routes/transport'))

// RESERVE ROUTE
app.use('/reserve', require('./routes/reserve'))
