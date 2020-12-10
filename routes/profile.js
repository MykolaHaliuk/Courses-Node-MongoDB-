const {Router} = require('express');
const auth = require('../middleware/auth');
const User = require('../models/user');
const router = Router();



router.get('/', auth, async (req, res) => [
    res.render('profile', {
        title: 'Профіль',
        isProfile: true,
        user: req.user.toObject()

    })
]);

router.post('/', auth, async (req, res) => {
    console.log("req.user");
    try {
        console.log("at");
        const user = await User.findById(req.user._id);
        console.log(user);
        const toChange = {
            name: req.body.name,    
        };
        if(req.file){
            toChange.avatarUrl = req.file.path;
        }

        Object.assign(user, toChange);
        await user.save();
        res.redirect('/profile');
    } catch (error) {
        console.log('error: ', error);
    }
});











module.exports = router;