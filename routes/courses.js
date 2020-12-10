const {Router} = require("express");
const router = Router();
const Course = require('../models/course');
const auth = require('../middleware/auth');
const {courseValidator} = require('../utils/validators');
const {validationResult} = require('express-validator');
function isOwner(course, req) {
    return course.userId.toString() === req.user._id.toString()
}
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find()
        .populate('userId', 'email name')
        .select('price title img');

        res.render('courses', {
            title: "Курси",
            isCourses: true,
            userId: req.user ? req.user._id.toString() : null,
            courses
    }); 
    } catch (error) {
        console.log('error: ', error);
    }
});

router.get('/:id/edit', auth,  async(req, res) => {
    try {
        if (!req.query.allow) {
            return res.redicrect('/');
        }
        const course = await Course.findById(req.params.id);

        res.render('course-edit', {
            title: `Редагувати ${course.title}`,
            course
        });
    } catch (error) {
        console.log('error: ', error);
        
    }
    
});

router.post('/edit', auth, courseValidator, async(req, res) =>{
    const errors = validationResult(req);
    console.log(req.body);
    if(!errors.isEmpty()) {
        return res.status(422).render('course-edit', {
            title: `Редагувати ${req.body.title}`,
            error: errors.array()[0].msg,
            course: {
                title: req.body.title,
                price: req.body.price,
                img: req.body.img,
                id: req.body.id
            }
        });
    }

    try {
        const {id} = req.body;
        delete req.body.id;
        const course = await Course.findById(id);
        if(!isOwner(course,req)){
            return res.redirect('/couses');
        }
        Object.assign(course, req.body);
        await course.save();
        console.log("=????}}}}}?}?}?}?}?}?}?}?",course);
        // await Course.findByIdAndUpdate(id, req.body);
        res.redirect('/courses');
        
    } catch (error) {
        console.log('error: ', error); 
    }

    
});

router.get('/:id',  async (req, res) =>{
    try {
        const course = await Course.findById(req.params.id);
        res.render('course', {
            layout: 'empty',
            title: `Курс ${course.title}`,
            course
    });
    } catch (error) {
        console.log('error: ', error);
        
    }
});

router.post('/remove', auth, async (req, res) => {
    try {
        await Course.deleteOne({
            _id: req.body.id,
            userId: req.user._id
        });
        res.redirect('/courses');
    } catch (error) {
        console.log(error);
    }
  
   
});

module.exports = router;