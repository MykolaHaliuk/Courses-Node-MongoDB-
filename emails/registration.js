const keys = require('../keys');

module.exports = function(email) {
    return{
        to: email,
        from: keys.EMAIL_FROM,
        subject: 'Акаунт створений',
        html: `
            <h1>Вітаю у нашому магазині</h1>
            <p>ви успішно створили акаунт - ${email}</p>
            <a href="${keys.BASE_URL}/">Силка на сайт</a>
        `    
    };
};