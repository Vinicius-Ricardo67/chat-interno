const express = require("express");
const router = express.Router();
const data = require("../data.json");

router.get("/users", (req, res) => {
    console.log('Dados do JSON aqui: ', data)
    res.json(data)
})

module.exports = router