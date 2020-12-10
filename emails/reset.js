const keys = require('../keys');
module.exports = function(email, token) {
    return{
        to: email,
        from: keys.EMAIL_FROM,
        subject: 'Скидання пароля',
        html: `
            <h1>Ви забули пароль?</h1>
            <p>Якщо ні, проігнуруйте даний лист</p>
            <p>Інакше натисніть на силку нижче:</p>
            <a href="${keys.BASE_URL}/auth/password/${token}">Відновити доступ</a>
        `    
    };
};