const Africastalking = require('africastalking');

const credentials = {
  apiKey: process.env.AFRICA_SEND_API_KEY,
  username: process.env.AFRICA_SEND_USERNAME,
};

const africastalking = Africastalking(credentials);
module.exports = africastalking;
