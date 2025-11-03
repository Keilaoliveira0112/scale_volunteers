module.exports = function sendNotification(email, subject, message) {
  // implementação real: enviar email/SMS/Push
  console.log('NOTIFY', { to: email, subject, message });
};