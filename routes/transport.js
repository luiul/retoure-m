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
    // query
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
    // server-side validation
    let errors = [];

    // validate fields of the form
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
    // check for errors and create record
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
                // if no errors were found, push confirmation
                let confirmation = { text: 'Transportauftrag erfolgreich hinzugefügt' }
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

    // check if input was an integer
    if (isNaN(paket_id)) {
        errors.push({ text: 'Bitte Paket-ID im zulässigen Bereich eingeben' })
        res.render('pickup', { errors })
    }

    // query, check if record exists and update record
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

    // check if input was an integer
    if (isNaN(paket_id)) {
        errors.push({ text: 'Bitte Paket-ID im zulässigen Bereich eingeben' })
        res.render('retoure', { errors })
    }

    // query, check if record exists and update record
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
// store variables outside the function scope to pass it to other functions more easily
var p_id    // int
var p_bez   // string
var p_status  // dictionary

router.get('/search', (req, res) => {
    // read and assign request body
    let { paket_id } = req.query

    // set parameters relevant in the scope
    let selector = { where: { paket_id: paket_id }, raw: true }
    let errors = [];
    let confirmation;

    // parse paket_id into integer
    paket_id = parseInt(paket_id)

    // store p_id outside scope
    p_id = paket_id

    // check if input was an integer
    if (isNaN(paket_id)) {
        errors.push({ text: 'Bitte Paket-ID im zulässigen Bereich eingeben' })
        res.render('transport_id', { errors })
    }

    // query, check for errors and conditions (versuch, alter, transport_status)
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

            // check status of package
            if (transport.length != 0 && transport[0].transport_status == 'abholbereit 📬') {
                p_status = { text: 'Retoure beantragen' }
            }
            else { p_status = { text: 'Retourefach reservieren' } }

            // store p_bez outside scope
            p_bez = transport[0].paket_bez

            // render result
            res.render('transport_id', {
                confirmation,
                p_status,
                errors,
                transport
            })
        })
        .catch(err => console.log(err))
})

// Reserve container / Confirm return wish
// we pass the stored
router.get('/reserve', (req, res) => {
    console.log(p_id)
    console.log(p_bez)
    console.log(p_status)
    // determine package status
    var p_status
    if (p_status[0]) {
        p_status = { text: 'abholbereit 📬' }
    } else {
        p_status = { text: 'abgeholt 📭' }
    }
    res.render('reserve', {
        p_status,
        p_id,
        p_bez,
        p_status
    })
})

module.exports = router
