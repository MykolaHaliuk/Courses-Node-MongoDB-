// const multer = require('multer');
// //куда і як зберігати файли
// const storage = multer.diskStorage({
//     // куда загружаємо файли
//     destination(req, file, cb){
//         cb(null, 'img');
//     },
//     // назва файлу після загрузки
//     filename(req, file, cb) {
//         cb(null, new Date().toISOString() + '-' + file.originalname);
//     }
// });

// const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];

// const fileFilter = (req, file, cb) => {
//     if(allowedTypes.includes(file.mimetype)) {
//         cb(null, true);
//     } else {
//         cb(null, true);
//     }
// };

// module.exports = multer({
//     storage, fileFilter
// });
const multer = require('multer');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'images');
  },
  filename(req, file, cb) {
    // cb(null, new Date().toISOString() + '-' + file.originalname);
    cb(null, new Date().toISOString().replace(/:/gi,'-') +'-'+file.originalname);
  }
});

const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];

const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

module.exports = multer({
  storage, fileFilter
});