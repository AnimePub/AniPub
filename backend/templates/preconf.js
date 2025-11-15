const PerChaseC = (name,info) => {
    const temp = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Premium Account Activated!</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f4f4f4;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(90deg, #ff4b5c, #4b0082); padding: 30px 20px; text-align: center;">
              <img src="https://www.anipub.xyz/luffy5.png" alt="AniPub Logo" style="max-width: 140px; margin-bottom: 15px;">
              <h1 style="color: #ffffff; font-size: 32px; margin: 0; text-transform: uppercase; letter-spacing: 2px;">PREMIUM ACTIVATED!</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 35px; color: #333333; font-size: 16px; line-height: 1.6; text-align: center;">
              
              <h2 style="color: #ff4b5c; font-size: 26px; margin: 0 0 20px;">Congratulations, ${name}!</h2>
              
              <p style="font-size: 20px; font-weight: bold; color: #4b0082; margin: 25px 0;">
                Your <strong>AniPub Premium</strong> account is now <span style="color: #ff4b5c;">FULLY ACTIVE</span>!
              </p>

              <div style="background-color: #f9f9fb; border-left: 5px solid #ff4b5c; padding: 20px; margin: 25px 0; text-align: left; border-radius: 0 8px 8px 0;">
                <p style="margin: 0; font-size: 16px;"><strong>Activated On:</strong> November 15, 2025</p>
                <p style="margin: 8px 0 0; font-size: 16px;"><strong>Transaction ID:</strong> ${info.trxID}</p>
              </div>

              <h3 style="color: #4b0082; font-size: 20px; margin: 30px 0 15px;">Your Premium Perks Are LIVE!</h3>
              <ul style="list-style: none; padding: 0; margin: 0 auto 30px; max-width: 480px; text-align: left;">
                <li style="margin-bottom: 12px; font-size: 16px;">Ad-Free Streaming (No interruptions!)</li>
                <li style="margin-bottom: 12px; font-size: 16px;">Exclusive Episodes & Early Access</li>
                <li style="margin-bottom: 12px; font-size: 16px;">Premium Badges on Profile</li>
                <li style="margin-bottom: 12px; font-size: 16px;">Enhanced Account Security</li>
                <li style="margin-bottom: 12px; font-size: 16px;">Priority Support (24/7)</li>
              </ul>

              <a href="https://www.anipub.xyz/Home" style="display: inline-block; background: linear-gradient(90deg, #ff4b5c, #ff1b6b); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 18px; box-shadow: 0 4px 15px rgba(255, 75, 92, 0.4);">
                Start Watching Now
              </a>

              <p style="margin-top: 30px; font-size: 14px; color: #777;">
                <em>Logged in from: Bangladesh (BD) • Time: 03:29 PM +06</em>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #4b0082; color: #ffffff; text-align: center; padding: 25px 20px; font-size: 14px;">
              <p style="margin: 0 0 12px;">Keep up with the latest anime drops — follow us on <a href="https://github.com/AnimePub" style="color: #ff4b5c; text-decoration: none; font-weight: bold;">X</a></p>
              <p style="margin: 0;">Welcome to the Premium Side,<br><strong>The AniPub Team</strong></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`}

module.exports = PerChaseC;