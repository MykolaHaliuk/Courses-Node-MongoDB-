const {Router} = require("express");
const Course = require("../models/course");
const router = Router();
const auth = require('../middleware/auth');
const {courseValidator} = require('../utils/validators');
const {validationResult} = require('express-validator');

router.get('/', auth, (req, res) => {
    res.render('add', {
        title: 'Add courses',
        isAdd: true
    });   
});

router.post('/',  auth, courseValidator, async (req, res) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(422).render('add', {
            title: 'Додати курс',
            isAdd: true,
            error: errors.array()[0].msg,
            data: {
                title: req.body.title,
                price: req.body.price,
                img: req.body.img,
            }
        });
    }

    const course = new Course({
        title: req.body.title,
        price: req.body.price,
        img: req.body.img,
        userId: req.user

    });

    try {
        await course.save();
        res.redirect('/courses');
        
    } catch (error) {
        console.log(error);
    }
   
});




module.exports = router;