function passwordMsge (name,email, key ) {
    const temp =`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Changed</title>
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background-color: #121212;
      color: #e0e0e0;
      margin: 0;
      padding: 0;
      line-height: 1.6;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #1e1e1e;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
      border: 1px solid #333;
    }
    .header {
      text-align: center;
      padding: 20px 0;
    }
    .header img {
      max-width: 140px;
      filter: brightness(1.2);
    }
    .content {
      padding: 20px;
      text-align: center;
    }
    .content h2 {
      font-size: 24px;
      color: #ffffff;
      margin-bottom: 20px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .content p {
      font-size: 16px;
      color: #b0b0b0;
      margin: 15px 0;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      margin: 20px 0;
      background: linear-gradient(90deg, #00e3ebff, #1129b3ff);
      color: #ffffff;
      text-decoration: none;
      border-radius: 8px;
      font-weight: bolder;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(98, 0, 234, 0.4);
    }
    .footer {
      text-align: center;
      padding: 15px;
      font-size: 12px;
      color: #666;
      border-top: 1px solid #333;
      margin-top: 20px;
    }
    .footer a {
      color: #bb86fc;
      text-decoration: none;
    }
    .footer a:hover {
      text-decoration: underline;
    }
    @media (max-width: 600px) {
      .container {
        padding: 15px;
        margin: 10px;
      }
      .content h2 {
        font-size: 20px;
      }
      .button {
        padding: 10px 20px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://animehub.adnandluffy.site/luffy5.png" alt="AniPub Logo">
    </div>
    <div class="content">
      <h2>Password Updated!</h2>
      <p>Hey ${name},</p>
      <p>Your AniPub account (${email}) password has been successfully updated. You're all set now!</p>
      <p>Didn't make this change? Act fast and click the button below within 3-4 days to report it:</p>
      <a href="https://animehub.adnandluffy.site/password/change/?key=${key}" class="button">Report Unauthorized Change</a>
      <p>If the link has expired, reach out to our admin at <a href="mailto:mail@adnandluffy.site">mail@adnandluffy.site</a>.</p>
    </div>
    <div class="footer">
      <p>&copy; 2025 AniPub. All rights reserved.</p>
      <p>AniPub, 123 Anime Lane, Fictional City, FC 12345</p>
       <a href="https://animehub.adnandluffy.site/Privacy-policy">Privacy Policy</a></p>
    </div>
  </div>
</body>
</html>
`
     return temp;
}

module.exports =  passwordMsge;