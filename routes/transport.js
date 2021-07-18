const express = require('express')
const router = express.Router()
const Sequelize = require('sequelize')
const models = require( '../models/index');

// Might not be required in the final version
const db = require('../config/database')
const Op = Sequelize.Op

// Testing transport page for the first time
// router.get('/',(req,res)=>{
//     res.send('TRANSPORT')
// })

// Get all transports
router.get('/', (req, res) => {
    models.Transport.findAll()
        .then(transport => {
            // console.log(Object.keys(transport))
            // console.log(transport)
            // console.log(Object.entries(transport))
            res.render('transport', {
                transport,
            })
        })
        .catch(err => console.log(err))
})

// Display add transport form
router.get('/add', (req, res) => res.render('add'))

// Add transport (hardcoded to start with)
router.post('/add', (req, res) => {

    let { paket_id, paket_bez, fach_bez, zbs_bez, tour_bez, emp_name, emp_plz, abd_name, abd_plz } = req.body

    // Server-side validation
    let errors = [];

    // Validate Fields
    if (!paket_id) {
        errors.push({ text: 'Packet-ID hinzufügen!' })
    }
    if (!paket_bez) {
        errors.push({ text: 'Packet-Bezeichnung hinzufügen!' })
    }
    if (!fach_bez) {
        errors.push({ text: 'Fach-Bezeichnung hinzufügen!' })
    }
    if (!zbs_bez) {
        errors.push({ text: 'ZBS-Bezeichnung hinzufügen!' })
    }
    if (!tour_bez) {
        errors.push({ text: 'Tour-Bezeichnung hinzufügen!' })
    }
    // if (!tour) {
    //     errors.push({ text: 'Tour hinzufügen!' })
    // }
    if (!emp_name) {
        errors.push({ text: 'Empfänger hinzufügen!' })
    }
    if (!emp_plz) {
        errors.push({ text: 'Empfänger-PLZ hinzufügen!' })
    }
    if (!abd_name) {
        errors.push({ text: 'Absender hinzufügen!' })
    }
    if (!abd_plz) {
        errors.push({ text: 'Absender-PLZ hinzufügen!' })
    }

    // Check for errors
    if (errors.length > 0) {
        res.render('add', {
            errors,
            paket_id, paket_bez, fach_bez, zbs_bez, tour_bez, emp_name, emp_plz, abd_name, abd_plz
        })
    } else {
        // Prepare tour array for Sequelize
        // tour = tour.split(',')

        // Insert into table
        models.Transport.create({
            paket_id, paket_bez, fach_bez, zbs_bez, tour_bez, emp_name, emp_plz, abd_name, abd_plz
        })
        .then(transport => {
            // Since no errors where found push confirmation
            errors.push({ text: 'Transportauftrag erfolgreich hinzugefügt' })
            res.render('add',{
                errors
            })
        })
        .catch(err => console.log(err))
    }
})

router.get('/search', (req, res) => {
    let {term} = req.query
    // parte into integer
    term = parseInt(term)

    // let test = true;

    // let test = []
    // test.push({ boolean: true })

    models.Transport.findAll({
        where:{
            paket_id:term
        }
    })
    .then(transport => {
        console.log(transport)
        res.render('transport_id',{
            transport
        })
    })
    .catch(err => console.log(err))
})

module.exports = router
