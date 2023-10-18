import express from "express"; // ES modules
// const express = require('express') -> common js

const router = express.Router();

router.get('/', (_req, res) =>{
    res.send("Fetching all mails");
})

router.post('/', (_req, res) => {
    res.send('Saving a new mail.');
})

export default router;