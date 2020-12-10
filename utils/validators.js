const {body} = require('express-validator');
const User = require('../models/user');

exports.registerValidators = [
    body('email')
    .isEmail()
    .withMessage('Введіть коректну пошту')
    .custom( async (value, {req}) => {
        try {
            const user = await User.findOne({email: value});
            if(user) {
                return Promise.reject('Користувач уже зареєстрований');
            }
        } catch (e) {
            console.log('e: ', e);

        }
    })
    .normalizeEmail(),
    body('password', 'Хриновий пароль')
    .isLength({min: 6, max: 56})
    .isAlphanumeric()
    .trim(),
    body('confirm')
    .custom((value, {req}) => {
        if(value !== req.body.password) {
            throw new Error('Пароллі не співпадають');
        }
        return true;
    })
    .trim(),
    body('name')
    .isLength({min:3})
    .withMessage(`Ім'я повинно бути більше трьох символів`)
    .trim()
];

exports.courseValidator = [
    body('title').isLength({min: 3}).withMessage("Мінімальна довжина 3 символа").trim(),
    body('price').isNumeric().withMessage("Ведіть коректну ціну"),
    // body('img', 'Ведіть коректний шлях картинки').isURL()
];

