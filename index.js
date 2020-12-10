const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const csrf = require('csurf');
const flash = require('connect-flash');
const exphbs = require('express-handlebars');
const app = express();
const helmet  = require('helmet');
const compress = require('compression');
const homeRoutes = require('./routes/home');
const addRoutes = require('./routes/add');
const coursesRoutes = require('./routes/courses');
const addCard = require('./routes/card');
const orders = require('./routes/orders');
const authForm = require('./routes/auth');
const session = require('express-session');
const profileRouter = require('./routes/profile');
const MongoStore = require('connect-mongodb-session')(session);
const varMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user');

const keys = require('./keys');
const hbs = require('handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const errorHendler = require('./middleware/error');
const fileMiddleware = require('./middleware/file');

// const hbs = exphbs.create({
//     defaultLayout: 'main',
//     extname: 'hbs'
// });

app.engine('hbs', exphbs({
    handlebars: allowInsecurePrototypeAccess(hbs),
    extname: 'hbs',
    layoutsDir: "views/layouts", 
    defaultLayout: "main",
    helpers: require('./utils/hbs-helper')
    
}));
app.set('view engine', 'hbs');
app.set('views', 'views');

const store = new MongoStore({
    collection: 'sessions',
    uri: keys.MONOGDB_URL,

    
});


// app.engine('hbs', hbs.engine);
// app.set('view engine', 'hbs');

// app.use( async (req, res, next) => {
//     try {
//         const user = await User.findById('5fc1f677aa352a523080c723');
//         req.user = user;
//         next();
//     } catch (error) {
//         console.log('error: ', error);
//     }
// });

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store
}));

app.use(fileMiddleware.single('avatar'));

app.use(csrf());
app.use(flash());
app.use(helmet());
app.use(compress());
app.use(varMiddleware);
app.use(userMiddleware );

app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', coursesRoutes);
app.use('/card', addCard);
app.use('/orders', orders);
app.use('/auth', authForm);
app.use('/profile', profileRouter);

app.use(errorHendler);


const PORT = process.env.PORT || 3000;

async function start () {
    try {
        await mongoose.connect(keys.MONOGDB_URL, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        
        });

        // const candidate = await User.findOne();

        // if (!candidate){
        //     const user = new User({
        //         email: "kolyahliuk@gmail.com",
        //         name: "Mykola",
        //         cart: {items: []}
        //     });
        //     await user.save();
        // }

        app.listen(PORT, () => {
        console.log(`Server is runnig on ${PORT}!!!`);
    });
    } catch (error) {
        console.log(error);
    }

}

start();




