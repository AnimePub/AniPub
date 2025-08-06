function mailBody(name,code) {
    const temp = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Account</title>
  <style>
  p {
    color:white;
  }
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
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>AniPub</h1>
      <h2>Verify Your Account</h2>
    </div>
    <div class="content">
      <p>Welcome, ${name}</p>
      <p>You're one step away from unlocking the full experience on <strong>AniPub</strong>. Use the link below to confirm your account.</p>
      <div class="verification-code">https://anipub.adnandluffy.site/verify/${code}</div>
      <p class="instructions">Enter this code on our website to verify your account. For security, this code will <strong>expire in 30 minutes</strong>.</p>
      <p class="security-notice">If you didn’t request this code, please ignore this email or contact our support team at <a href="mailto:mail@adnandluffy.site">mail@adnandluffy.site</a>.</p>
    </div>
    <div class="footer">
      <p>&copy; 2025 AniPub. All rights reserved.</p>
       <a href="https://anipub.adnandluffy.site/Privacy-policy">Privacy Policy</a></p>
    </div>
  </div>
</body>
</html>
`
return temp ;
}

module.exports = mailBody;