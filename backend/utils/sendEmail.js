import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Events Platform" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
    ...(options.attachments && { attachments: options.attachments }),
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
