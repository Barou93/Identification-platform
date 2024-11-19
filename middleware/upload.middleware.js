const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
};

const generateUniqueFileName = (file) => {
  const timestamp = Date.now();
  const hash = nanoid();
  const extension = MIME_TYPES[file.mimetype];
  return `${timestamp}=${hash}.${extension}`;
};

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb('Veuillez sélectionner une image!', false);
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: {
    fileSize: {
      image: 5 * 1024 * 1024, // 5 Mo Max par image
    },
  },
});
