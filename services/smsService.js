const africastalking = require('../config');

const sms = africastalking.SMS;
const sendSMS = async (to, message) => {
  try {
    const options = {
      to: [`+223${to}`],
      message: message,
      from: `5155`,
    };
    await sms
      .send(options)
      .then(console.log(`message envoyé avec succès:`, options))
      .catch((err) => console.log('err', err));
  } catch (error) {
    console.error("Erreur lors de l'envoi du SMS:", error);
    throw error;
  }
};

module.exports = sendSMS;
