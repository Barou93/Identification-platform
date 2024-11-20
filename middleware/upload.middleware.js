const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const sharp = require('sharp');

const {
  storage,
  ref,
  getDownloadURL,
  uploadBytes,
  deleteObject,
} = require('../config.firebase');

const writeFileAsync = promisify(fs.writeFile);
const readFileAsync = promisify(fs.readFile);
const unlinkAsync = promisify(fs.unlink);
const rmdirAsync = promisify(fs.rmdir);

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
};

const tempDir = path.join(__dirname, 'temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

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

const uploadToFirebase = async (file, destination) => {
  const filename = generateUniqueFileName(file);
  const inputFilePath = path.join(tempDir, filename);
  const fileRef = ref(storage, `${destination}/${filename}`);
  const compressedBuffer = await sharp(file.buffer)
    .resize(500, 500)
    .jpeg({ quality: 90 })
    .toBuffer();
  const metadata = { contentType: file.mimetype };
  const snapshot = await uploadBytes(fileRef, compressedBuffer, metadata);
  await saveUnlink(inputFilePath);
  return await getDownloadURL(snapshot.ref);
};

const deleteFromFirebase = async (fileUrl) => {
  try {
    const fileRef = ref(storage, fileUrl);
    await deleteObject(fileRef);
    console.log(`Fichierr supprimé de Firebase Storage: ${fileUrl}`);
  } catch (error) {
    console.error(`Erreur lors de la suppression du fichier: ${error.message}`);
  }
};

module.exports = {
  upload,
  uploadToFirebase,
  deleteFromFirebase,
};
