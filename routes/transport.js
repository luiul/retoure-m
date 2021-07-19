const express = require('express')
const router = express.Router()
const Sequelize = require('sequelize')
const models = require('../models/index');

// Might not be required in the final version
const db = require('../config/database');
const { truncate } = require('../config/database');
const Op = Sequelize.Op

// Testing transport page for the first time
// router.get('/',(req,res)=>{
//     res.send('TRANSPORT')
// })

// Get all transports
router.get('/', (req, res) => {
    models.Transport.findAll({ raw: true })
        .then(transport => {
            res.render('transport', {
                transport,
            })
        })
        .catch(err => console.log(err))
})

// Display add transport form; add transport
router.get('/add', (req, res) => res.render('add'))
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
        models.Transport.create({
            paket_id, paket_bez, fach_bez, zbs_bez, tour_bez, emp_name, emp_plz, abd_name, abd_plz
        })
            .then(transport => {
                // Since no errors where found push confirmation
                let confirmation = { text: 'Transportauftrag erfolgreich hinzugefügt' }
                // errors.push({ text: 'Transportauftrag erfolgreich hinzugefügt' })
                res.render('add', {
                    confirmation
                })
            })
            .catch(err => console.log(err))
    }
})

// Display and book pick up (ZBS)
router.get('/pickup', (req, res) => res.render('pickup'))
router.post('/pickup', (req, res) => {
    // read and assign request body
    let { paket_id } = req.body

    // set parameters
    let values = { transport_status: 'abgeholt 📭', fach_status: 'frei 🔓' }
    let selector_raw = { where: { paket_id: paket_id }, raw: true }
    let selector = { where: { paket_id: paket_id } }
    let errors = [];

    // parse into integer
    paket_id = parseInt(paket_id)

    if (isNaN(paket_id)) {
        errors.push({ text: 'Bitte Paket-ID im zulässigen Bereich eingeben' })
        res.render('pickup', { errors })
    }

    models.Transport.findAll(selector_raw)
        .then(transport => {
            if (transport.length == 0) {
                errors.push({ text: 'Paket-ID nicht vorhanden' })
                res.render('pickup', { errors })
            } else {
                models.Transport.update(values, selector)
                    .then(trans => {
                        let confirmation = { text: 'Paketabholung erfolgreich gebucht' }
                        res.render('pickup', { confirmation })

                    })

            }
        })
        .catch(err => console.log(err))
})

// Display and book return (ZBS)
router.get('/retoure', (req, res) => res.render('retoure'))
router.post('/retoure', (req, res) => {
    // read and assign request body
    let { paket_id } = req.body

    // set parameters
    let values = { transport_status: 'retouniert 📦', fach_status: 'frei 🔓' }
    let selector_raw = { where: { paket_id: paket_id }, raw: true }
    let selector = { where: { paket_id: paket_id } }
    let errors = [];

    // parse into integer
    paket_id = parseInt(paket_id)

    if (isNaN(paket_id)) {
        errors.push({ text: 'Bitte Paket-ID im zulässigen Bereich eingeben' })
        res.render('retoure', { errors })
    }

    models.Transport.findAll(selector_raw)
        .then(transport => {
            if (transport.length == 0) {
                errors.push({ text: 'Paket-ID nicht vorhanden' })
                res.render('retoure', { errors })
            } else {
                models.Transport.update(values, selector)
                    .then(trans => {
                        let confirmation = { text: 'Retoure erfolgreich gebucht' }
                        res.render('retoure', { confirmation })

                    })

            }
        })
        .catch(err => console.log(err))
})


// Search by package id in homepage
// Store paket_id outside the function scope to pass to other functions more easily
var p_id
router.get('/search', (req, res) => {
    // read and assign request body
    // store paket_id as a variable to make it available outside the scrope!
    let { paket_id } = req.query
    p_id = paket_id
    // console.log(paket_id)
    // console.log(p_id)


    // set parameters
    let selector = { where: { paket_id: paket_id }, raw: true }
    let errors = [];
    let reserve = [];
    let confirmation;

    // parse into integer
    paket_id = parseInt(paket_id)

    if (isNaN(paket_id)) {
        errors.push({ text: 'Bitte Paket-ID im zulässigen Bereich eingeben' })
        res.render('transport_id', { errors })
    }

    models.Transport.findAll(selector)
        .then(transport => {
            if (transport.length == 0) {
                errors.push({ text: 'Paket-ID nicht vorhanden' })
            }
            if (transport.length != 0 && transport[0].versuch > 3) {
                errors.push({ text: 'Max. Retoureversuche überschritten' })
            }
            if (transport.length != 0 && transport[0].alter > 14) {
                errors.push({ text: 'Bestellung außerhalb Retourefrist' })
            }
            if (transport.length != 0 && transport[0].transport_status == 'retouniert 📦') {
                confirmation = { text: 'Paket erfolgreich retouniert' }
            }
            if (transport.length != 0 && transport[0].transport_status == 'abholbereit 📬') {
                reserve.push(true)
            }
            res.render('transport_id', {
                confirmation,
                reserve,
                errors,
                transport
            })
        })
        .catch(err => console.log(err))
})

// Testing reserve page
router.get('/reserve', (req, res) => {
    res.send('p_id: ' + p_id)
    console.log(p_id)
})

module.exports = router
