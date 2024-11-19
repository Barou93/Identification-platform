const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');
const port = process.env.PORT || 3000;

app.listen(process.env.PORT, () => {
  console.log(`Listenning on port ${port}`);
});
