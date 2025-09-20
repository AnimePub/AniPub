const PerChase = (name, info) => {
    const temp = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Premium Subscription Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f4f4f4;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(90deg, #ff4b5c, #4b0082); padding: 20px; text-align: center;">
              <img src="https://anipub.adnandluffy.site/luffy5.png" alt="AniPub Logo" style="max-width: 150px;">
              <h1 style="color: #ffffff; font-size: 28px; margin: 10px 0; text-transform: uppercase; letter-spacing: 2px;">Welcome to AniPub Premium!</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding: 30px; color: #333333; font-size: 16px; line-height: 1.6;">
              <h2 style="color: #ff4b5c; font-size: 22px; margin-bottom: 20px;">Thank You, ${name}!</h2>
              <p style="margin-bottom: 20px;">We’re absolutely thrilled to welcome you to the <strong>AniPub.AdnanDLuffy.site Premium</strong> community! Your subscription is being processed, and we’re grateful for your patronage. Get ready to dive into an epic anime adventure!</p>
              
              <h3 style="color: #4b0082; font-size: 18px; margin-bottom: 15px;">What’s Next?</h3>
              <p style="margin-bottom: 20px;">Your Premium Subscription will be fully activated within the next <strong>24 hours</strong>. Once activated, you’ll unlock:</p>
              <ul style="list-style: none; padding: 0; margin-bottom: 20px;">
                <li style="margin-bottom: 10px;">🎥 <strong>Ad-Free Streaming:</strong> Watch your favorite anime without interruptions.</li>
                <li style="margin-bottom: 10px;">🔥 <strong>Exclusive Content:</strong> Access premium episodes and early releases.</li>
                <li style="margin-bottom: 10px;">🌟 <strong>Badges</strong> Enjoy cool badges</li>
                <li style="margin-bottom: 10px;">📥 <strong>Security:</strong> Extra Security</li>
                <li style="margin-bottom: 10px;">🛠️ <strong>Priority Support:</strong> Get dedicated help whenever you need it.</li>
              </ul>
              <p style="margin-bottom: 20px;">You’ll receive a confirmation email once your subscription is fully active, so keep an eye on your inbox!</p>

              <p>Info We Found All Over the Internet and Saved About You:- (This can be used to appeal incase you lost your account) </p>
              
                <p>Name:- ${info.name}</p>
                <p>Email found with the Number :- ${info.email}</p>
                <p>Security Code:- ${info.codes[0]} , ${info.codes[1]} , ${info.codes[2]} , ${info.codes[3]} </p>
                <p> trxID :- ${info.trxID} </p>


              <em>But Note :- When recovering Please provide the info/codes bellow ... save them in a safe place </em>
              <em>if the Email We found doesn't match or you don't have access to that account please report it to us</em>
              <em> The Name may be different but save it just in case </em>


              <h3 style="color: #4b0082; font-size: 18px; margin-bottom: 15px;">Need Help?</h3>
              <p style="margin-bottom: 20px;">If you have any questions or need assistance during the activation process, our support team is here for you. Reach out at <a href="mailto:support@anipub.adnandluffy.site" style="color: #ff4b5c; text-decoration: none;">support@anipub.adnandluffy.site</a> or reply to this email.</p>

              <p style="margin-bottom: 20px;">Thank you again for choosing AniPub.AdnanDLuffy.site. We can’t wait for you to immerse yourself in the world of anime!</p>

              <a href="https://anipub.adnandluffy.site/premium" style="display: inline-block; background-color: #ff4b5c; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px;">Explore AniPub Now</a>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #4b0082; color: #ffffff; text-align: center; padding: 20px; font-size: 14px;">
              <p style="margin: 0 0 10px;">Follow us on <a href="https://github.com/AnimePub" style="color: #ff4b5c; text-decoration: none;">X</a> for the latest anime updates, exclusive content, and giveaways!</p>
              <p style="margin: 0;">Happy Watching, <br>The AniPub.AdnanDLuffy.site Team</p>
            </td>
          </tr>
        
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
 return temp;
}
module.exports = PerChase;