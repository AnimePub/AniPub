const escapeHtml = (str = "") =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const PerChaseC = (name) => {
  const safeName = escapeHtml(name);
  const now = new Date();
  const year = now.getFullYear();
  const activatedOn = now.toUTCString().replace("GMT", "UTC");

  const perk = (icon, title, text) => `
                <tr>
                  <td width="40" valign="top" style="padding:8px 0;font-size:22px;line-height:28px;">${icon}</td>
                  <td valign="top" class="text" style="padding:8px 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:24px;color:#3B4A50;">
                    <strong class="heading" style="color:#111A1D;">${title}</strong><br>${text}
                  </td>
                </tr>`;

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>Your Premium account is active</title>
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    body { margin: 0 !important; padding: 0 !important; width: 100% !important; }
    a { text-decoration: none; }
    @media only screen and (max-width: 620px) {
      .container { width: 100% !important; }
      .px { padding-left: 20px !important; padding-right: 20px !important; }
      .btn a { display: block !important; }
    }
    @media (prefers-color-scheme: dark) {
      .body-bg { background-color: #0F1417 !important; }
      .card { background-color: #1A2226 !important; }
      .text { color: #D5DBDE !important; }
      .heading { color: #FFFFFF !important; }
      .muted { color: #8F9BA0 !important; }
      .divider { border-color: #2B373C !important; }
      .info-box { background-color: #11181B !important; border-color: #2B373C !important; }
      .ok-box { background-color: #12261B !important; border-color: #1F5033 !important; }
    }
  </style>
</head>
<body class="body-bg" style="margin:0;padding:0;background-color:#F2F5F7;">

  <!-- Preheader -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
    Your AniPub Premium is now active. Enjoy ad-free streaming and exclusive perks.
    &#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;
  </div>

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" class="body-bg" style="background-color:#F2F5F7;">
    <tr>
      <td align="center" style="padding:32px 12px;">

        <table role="presentation" class="container" width="600" cellspacing="0" cellpadding="0" border="0" style="width:600px;max-width:600px;">

          <!-- Header -->
          <tr>
            <td align="center" style="background-color:#111A1D;border-radius:12px 12px 0 0;padding:36px 24px 30px 24px;">
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:30px;font-weight:700;letter-spacing:1px;color:#FFFFFF;">
                Ani<span style="color:#00A3E0;">Pub</span>
                <span style="display:inline-block;vertical-align:middle;margin-left:8px;padding:4px 10px;background-color:#F5B301;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:1.5px;color:#111A1D;">PREMIUM</span>
              </div>
              <div style="margin-top:14px;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#9FB0B6;">
                Account activated
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color:#00A3E0;height:4px;line-height:4px;font-size:0;">&nbsp;</td>
          </tr>

          <!-- Body -->
          <tr>
            <td class="card px" style="background-color:#FFFFFF;padding:40px 40px 32px 40px;">

              <h1 class="heading" style="margin:0 0 16px 0;font-family:Arial,Helvetica,sans-serif;font-size:24px;line-height:32px;font-weight:700;color:#111A1D;">
                Congratulations, ${safeName}! &#127881;
              </h1>

              <p class="text" style="margin:0 0 24px 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:26px;color:#3B4A50;">
                Your <strong>AniPub Premium</strong> account is now fully active. All of your Premium perks are available right away.
              </p>

              <!-- Status box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td class="ok-box" style="background-color:#EAF7EF;border:1px solid #BFE5CC;border-left:4px solid #2E9E5B;border-radius:8px;padding:16px 18px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:22px;">
                      <tr>
                        <td class="muted" width="100" style="color:#6B7A80;padding:3px 0;">Status</td>
                        <td style="padding:3px 0;color:#1F7A44;"><strong>&#9679; Active</strong></td>
                      </tr>
                      <tr>
                        <td class="muted" style="color:#6B7A80;padding:3px 0;">Activated on</td>
                        <td class="text" style="padding:3px 0;color:#111A1D;">${activatedOn}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Perks -->
              <h2 class="heading" style="margin:32px 0 8px 0;font-family:Arial,Helvetica,sans-serif;font-size:18px;line-height:26px;font-weight:700;color:#111A1D;">
                Your Premium perks
              </h2>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                ${perk("&#127909;", "Ad-free streaming", "Watch without any interruptions.")}
                ${perk("&#128293;", "Exclusive episodes &amp; early access", "See premium releases before everyone else.")}
                ${perk("&#127775;", "Premium badges", "Show off your supporter status on your profile.")}
                ${perk("&#128274;", "Enhanced account security", "Extra protection for your account.")}
                ${perk("&#128736;&#65039;", "Priority support", "Dedicated help whenever you need it.")}
              </table>

              <!-- Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" class="btn" style="margin:32px auto 8px auto;">
                <tr>
                  <td align="center" bgcolor="#00A3E0" style="border-radius:8px;">
                    <a href="https://www.anipub.org/Home" target="_blank"
                       style="display:inline-block;padding:15px 36px;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:700;color:#FFFFFF;background-color:#00A3E0;border-radius:8px;">
                      Start Watching
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:28px 0 24px 0;">
                <tr><td class="divider" style="border-top:1px solid #E1E8EB;font-size:0;line-height:0;">&nbsp;</td></tr>
              </table>

              <p class="muted" style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:21px;color:#6B7A80;">
                <strong style="color:#3B4A50;">Need help?</strong>
                Contact us anytime at <a href="mailto:support@anipub.org" style="color:#0086B8;">support@anipub.org</a>.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="card px" align="center" style="background-color:#FFFFFF;border-top:1px solid #E1E8EB;border-radius:0 0 12px 12px;padding:24px 40px 28px 40px;">
              <p class="text" style="margin:0 0 12px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:20px;color:#3B4A50;">
                Welcome to the Premium side,<br><strong>The AniPub Team</strong>
              </p>
              <p class="muted" style="margin:0 0 10px 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;color:#8A979C;">
                <a href="https://anipub.org" style="color:#6B7A80;">Website</a>
                &nbsp;&bull;&nbsp;
                <a href="https://github.com/AnimePub" style="color:#6B7A80;">GitHub</a>
                &nbsp;&bull;&nbsp;
                <a href="https://anipub.org/Privacy-policy" style="color:#6B7A80;">Privacy Policy</a>
                &nbsp;&bull;&nbsp;
                <a href="mailto:support@anipub.org" style="color:#6B7A80;">Support</a>
              </p>
              <p class="muted" style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;color:#8A979C;">
                &copy; ${year} AniPub. All rights reserved.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;
};

module.exports = PerChaseC;