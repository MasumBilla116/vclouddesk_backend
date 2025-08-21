// mailTemplate.js

function baseTemplate(subject, content) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          background-color: #f9f9f9;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: auto;
          background: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }
        .header {
          font-size: 20px;
          font-weight: bold;
          color: #333;
          margin-bottom: 15px;
        }
        .footer {
          margin-top: 20px;
          font-size: 12px;
          color: #888;
          text-align: center;
        }
        a {
          color: #007bff;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">${subject}</div>
        <div class="content">${content}</div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Pewdesk. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
}

// Specific templates
const MailTemplate = {
  welcome: (name) =>
    baseTemplate(
      "Welcome to Pewdesk 🎉",
      `<p>Hi ${name},</p>
       <p>We’re excited to have you on board. Start exploring our platform today!</p>`
    ),

  passwordReset: (name, code) =>
    baseTemplate(
      "Password Reset Request",
      `<p>Hi ${name},</p>
       <p>We received a request to reset your password. Your temporary Email OTP code is: <h2>${code}</h2></p> 
       <p>Remember this code is valid only for 5minutes</p>
       <p>If you didn’t request this, you can ignore this email.</p>`
    ),

  orderConfirmation: (name, orderId) =>
    baseTemplate(
      "Order Confirmation",
      `<p>Hi ${name},</p>
       <p>Thank you for your purchase! Your order <b>#${orderId}</b> has been confirmed.</p>
       <p>We’ll notify you once it’s shipped.</p>`
    ),

  custom: (subject, message) => baseTemplate(subject, `<p>${message}</p>`),
};

module.exports = MailTemplate;
