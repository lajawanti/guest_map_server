const express = require('express');
const Joi = require('@hapi/joi')
const router = express.Router();

const db = require('../db.js');
const messages = db.get('messages');

const schema = Joi.object({
    name: Joi.string()
             //.regex(/^[A-Za-zÀ-ÖØ-öø-ÿ -_]{1, 100}$/)
             .min(1)
             .max(100)
             .required(),

    message: Joi.string()
                .min(1)
                .max(500)
                .required(),

    latitude : Joi.number().min(-90).max(90).required(),
    longitude: Joi.number().min(-180).max(180).required(),
});

//GET ROUTE
router.get('/messages', (req, res) => {
    messages.find()
            .then(allMessages => {
                res.json(allMessages);
            })
})

//POST ROUTE
router.post('/messages', (req, res, next) => {
    console.log("req.body ... : ", req.body)
    const {name, message, latitude, longitude} = req.body;
    const result = schema.validate({ name: name,
                                                message : message,
                                                latitude : latitude,
                                                longitude : longitude
                                              });
                                              console.log("RESULT  : ***************  ", result)
    if(result.error == null) {
        const userMessage = {
                    name :name, 
                    message : message, 
                    latitude : latitude, 
                    longitude : longitude,
                    date: new Date()
        };
        messages.insert(userMessage)
                .then(insertedMessage => {
                    console.log("userInserted.......... :  ", insertedMessage)
                    res.json(insertedMessage);
                })
    } else {
        next(result.error)
    }   
    
})

module.exports = router;