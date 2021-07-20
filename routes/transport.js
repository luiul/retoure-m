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
    let values = { transport_status: 'abgeholt 📭', fach_status: 'frei 📥' }
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
    let values = { transport_status: 'retouniert 📦', fach_status: 'belegt 🔒' }
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
var p_id            // int (185)
var p_bez           // string (220)
var pickup_state    // boolean (213 - 215)
var t_status        // string (221)
var emp_name        // string (222)
var emp_plz         // string (223)
var abd_name        // string (224)
var abd_plz         // string (225)

router.get('/search', (req, res) => {
    // read and assign request body
    let { paket_id } = req.query

    // set parameters relevant in the scope
    let selector = { where: { paket_id: paket_id }, raw: true }
    let errors = [];
    let confirmation;
    var fach = true

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
            // check if package exists
            if (transport.length == 0) {
                errors.push({ text: 'Paket-ID nicht vorhanden' })
            }
            // check versuch condition
            if (transport.length != 0 && transport[0].versuch > 3) {
                errors.push({ text: 'Max. Retoureversuche überschritten' })
            }
            // check alter condition
            if (transport.length != 0 && transport[0].alter > 14) {
                errors.push({ text: 'Bestellung außerhalb Retourefrist' })
            }
            // upate confirmation
            if (transport.length != 0 && transport[0].transport_status == 'retouniert 📦') {
                confirmation = { text: 'Paket erfolgreich retouniert' }
            }
            // update pickup_state
            if (transport.length != 0 && transport[0].transport_status == 'abgeholt 📭') {
                pickup_state = true
            } else { pickup_state = false }

            // show container / fach
            if(transport.length != 0 && (transport[0].transport_status == 'abgeholt 📭' || transport[0].transport_status == 'retouniert 📦')) {
                fach = false
            }

            // store p_bez and t_status outside scope
            p_bez = transport[0].paket_bez
            t_status = transport[0].transport_status
            emp_name = transport[0].emp_name
            emp_plz = transport[0].emp_plz
            abd_name = transport[0].abd_name
            abd_plz = transport[0].abd_plz

            console.log(transport)

            // render result
            res.render('transport_id', {
                confirmation,
                pickup_state,
                errors,
                transport,
                fach
            })
        })
        .catch(err => console.log(err))
})

// Confirm return wish and book it
router.get('/reserve', (req, res) => {
    res.render('reserve', {
        p_id,
        p_bez,
        pickup_state,
        t_status
    })
})
router.post('/reserve', (req, res) => {
    // read and assign request body
    let { paket_id } = req.body

    // set parameters
    let values = { transport_status: 'retouniert 📦', fach_status: 'belegt 🔒' }
    let selector_raw = { where: { paket_id: paket_id }, raw: true }
    let selector = { where: { paket_id: paket_id } }
    let errors = [];

    // parse into integer
    paket_id = parseInt(paket_id)

    // check if input was an integer
    if (isNaN(paket_id)) {
        errors.push({ text: 'Bitte Paket-ID im zulässigen Bereich eingeben' })
        res.render('reserve', { errors })
    }

    // query, check if record exists and update record
    models.Transport.findAll(selector_raw)
        .then(transport => {
            if (transport.length == 0) {
                errors.push({ text: 'Paket-ID nicht vorhanden' })
                res.render('reserve', { errors })
            } else {
                models.Transport.update(values, selector)
                    .then(trans => {
                        let confirmation = { text: 'Retoure erfolgreich gebucht' }
                        t_status = 'retouniert 📦'
                        res.render('reserve', {
                            confirmation,
                            p_id,
                            p_bez,
                            // pickup_state,
                            t_status
                        })

                    })

            }
        })
        .catch(err => console.log(err))
})

// Search by plz after searching by id
// store variables outside the function scope to pass it to other functions more easily
var options = []
router.get('/reserve/search', (req, res) => {
    // read and assign request body
    let { plz } = req.query

    // set parameters relevant in the scope
    let selector = { where: { fach_status: 'frei 📥' }, raw: true }
    let errors = [];

    // check if input is string of integers
    if (isNaN(parseInt(plz))) {
        errors.push({ text: 'Bitte PLZ im zulässigen Bereich eingeben' })
        res.render('reserve_plz', {
            errors,
            p_id,
            p_bez,
            // pickup_state,
            t_status
        })
    }
    // check if input has right length
    if (plz.length < 5 || plz.length > 5) {
        errors.push({ text: 'PLZ muss eine Länge von fünf Zeichen haben' })
        res.render('reserve_plz', {
            errors,
            p_id,
            p_bez,
            // pickup_state,
            t_status
        })
    }
    models.Transport.findAll(selector)
        .then(transport => {
            // populate options array
            for (let i = 0; i < transport.length; i++) {
                for (let j = 0; j < transport[i].tour.length; j++) {
                    if (transport[i].tour[j] == plz) {
                        options.push({
                            id: transport[i].id,
                            fach_bez: transport[i].fach_bez,
                            fach_status: transport[i].fach_status,
                            zbs_bez: transport[i].zbs_bez,
                            tour_bez: transport[i].tour_bez,
                            tour_zeit: transport[i].tour_zeit[j]
                        })
                    }
                }
            }
            res.render('reserve_plz', {
                plz,
                options,
                p_id,
                p_bez,
                t_status
            })
            console.log(options)
        })
        .catch(err => console.log(err))
})
router.post('/reserve_plz', (req, res) => {
    // read and assign request body
    let { id } = req.body
    console.log(id)
    console.log(p_id)

    for(let i = 0; i < options.length;i++){
        if(options[i].id==id){
            var fach_bez = options[i].fach_bez
            var zbs_bez = options[i].zbs_bez
            var tour_bez = options[i].tour_bez
        }
    }

    // set parameters
    let values = { transport_status: 'Retoure begonnen 🚚', fach_status: 'reserviert 🔐', fach_bez, zbs_bez, tour_bez}
    // ad the user data!
    let selector_raw = { where: { paket_id : p_id }, raw: true }
    let selector = { where: { paket_id: p_id } }
    let errors = [];

    // parse into integer
    id = parseInt(id)

    // check if input was an integer
    if (isNaN(id)) {
        errors.push({ text: 'Bitte Paket-ID im zulässigen Bereich eingeben' })
        res.render('reserve_plz', { errors })
    }

    // query, check if record exists and update record
    models.Transport.findAll(selector_raw)
        .then(transport => {
            if (transport.length == 0) {
                errors.push({ text: 'Paket-ID nicht vorhanden' })
                res.render('reserve_plz', { errors })
            } else {
                models.Transport.update(values, selector)
                    .then(trans => {
                        let confirmation = { text: 'Retourefach reserviert' }
                        t_status = 'Retoure begonnen 🚚'
                        res.render('reserve_plz', {
                            confirmation,
                            p_id,
                            p_bez,
                            t_status
                        })

                    })

            }
        })
        .catch(err => console.log(err))
})


module.exports = router
