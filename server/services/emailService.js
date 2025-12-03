
const transporter = require("../config/email");

async function sendMail(to, subject, text) {
  await transporter.sendMail({
    from: '"Head of Department" <your_hod_email@gmail.com>', //HOD Mail
    to,
    subject,
    text,
  });
}

module.exports = sendMail;
