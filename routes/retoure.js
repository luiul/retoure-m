const express = require('express')
const router = express.Router()
const Sequelize = require('sequelize')
const models = require( '../models/index');

// Might not be required in the final version
const db = require('../config/database')
const Op = Sequelize.Op

// Testing transport page for the first time
router.get('/', (req, res) => res.send('RETOURE'))

module.exports = router
