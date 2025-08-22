const MailBody =(name,id,code) =>{
    const temp = `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email Change</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Arial', sans-serif;
      background-color: #1C2526;
      color: #E0E0E0;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      padding: 20px;
      background-color: #2E3B3E;
      border-radius: 10px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
    }
    .header {
      text-align: center;
      padding: 20px 0;
    }
    .header h1 {
      color: #00A3E0;
      font-size: 28px;
      margin: 0;
    }
    .header h2 {
      color: #E0E0E0;
      font-size: 20px;
      margin: 10px 0;
    }
    .content {
      padding: 20px;
      text-align: center;
    }
    .verification-code {
      display: inline-block;
      background-color: #1C2526;
      border: 2px solid #4B5EAA;
      padding: 15px 30px;
      border-radius: 8px;
      font-size: 24px;
      font-weight: bold;
      color: #00A3E0;
      margin: 20px 0;
    }
    .instructions {
      font-size: 16px;
      line-height: 1.5;
      color: #E0E0E0;
    }
    .instructions strong {
      color: #00A3E0;
    }
    .security-notice {
      margin-top: 20px;
      font-size: 14px;
      color: #B0B0B0;
    }
    .security-notice a {
      color: #00A3E0;
      text-decoration: none;
    }
    .security-notice a:hover {
      text-decoration: underline;
    }
    .footer {
      text-align: center;
      padding: 20px;
      font-size: 12px;
      color: #B0B0B0;
    }
    .footer a {
      color: #00A3E0;
      text-decoration: none;
      margin: 0 10px;
    }
    .footer a:hover {
      text-decoration: underline;
    }
      p {
      color:white;
      }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>AniPub</h1>
      <h2>Verify Your New Email Address</h2>
    </div>
    <div class="content">
      <h2>Hello, ${name}</h2>
      <p>You’ve requested to change the email address associated with your <strong>AniPub</strong> account. Please use the link below to verify your new email address.</p>
      <div class="verification-code">https://anipub.adnandluffy.site/verify-email-change/${id}/${code}</div>
      <p class="instructions">Click the link above to confirm your new email address. For security, this link will <strong>expire in 30 minutes</strong>.</p>
      <p class="security-notice">If you didn’t request this email change, please ignore this email or contact our support team at <a href="mailto:mail@adnandluffy.site">mail@adnandluffy.site</a>.</p>
    </div>
    <div class="footer">
      <p>&copy; 2025 AniPub. All rights reserved.</p>
      <p><a href="https://animehub.adnandluffy.site/Privacy-policy">Privacy Policy</a></p>
    </div>
  </div>
</body>
</html>
    
    `
return temp;

}
module.exports = MailBody;