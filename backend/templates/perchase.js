const escapeHtml = (str = "") =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const PerChase = (name, info = {}) => {
  const safeName = escapeHtml(name);
  const trxID = escapeHtml(info.trxID || "N/A");
  const codes = (Array.isArray(info.codes) ? info.codes : []).slice(0, 4);
  const year = new Date().getFullYear();

  const codeCells = codes
    .map(
      (c) => `
                      <td align="center" style="padding:4px;">
                        <div class="code-chip" style="background-color:#FFFFFF;border:1px solid #D8E0E4;border-radius:6px;padding:10px 6px;font-family:Consolas,Menlo,monospace;font-size:15px;font-weight:700;letter-spacing:1px;color:#111A1D;">${escapeHtml(c)}</div>
                      </td>`
    )
    .join("");

  const benefit = (icon, title, text) => `
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
  <title>Welcome to AniPub Premium</title>
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    body { margin: 0 !important; padding: 0 !important; width: 100% !important; }
    a { text-decoration: none; }
    @media only screen and (max-width: 620px) {
      .container { width: 100% !important; }
      .px { padding-left: 20px !important; padding-right: 20px !important; }
      .btn a { display: block !important; }
      .code-chip { font-size: 13px !important; }
    }
    @media (prefers-color-scheme: dark) {
      .body-bg { background-color: #0F1417 !important; }
      .card { background-color: #1A2226 !important; }
      .text { color: #D5DBDE !important; }
      .heading { color: #FFFFFF !important; }
      .muted { color: #8F9BA0 !important; }
      .divider { border-color: #2B373C !important; }
      .info-box { background-color: #11181B !important; border-color: #2B373C !important; }
      .code-chip { background-color: #1A2226 !important; border-color: #2B373C !important; color: #FFFFFF !important; }
      .note-box { background-color: #2A2414 !important; border-color: #5A4A1E !important; }
    }
  </style>
</head>
<body class="body-bg" style="margin:0;padding:0;background-color:#F2F5F7;">

  <!-- Preheader -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
    Thanks for subscribing! Your Premium will be active within 24 hours. Save your recovery details.
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
                Subscription confirmation
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
                Thank you, ${safeName}!
              </h1>

              <p class="text" style="margin:0 0 24px 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:26px;color:#3B4A50;">
                Welcome to the <strong>AniPub Premium</strong> community. Your payment has been received and your subscription is being processed.
                It will be fully activated within <strong>24 hours</strong>, and we&rsquo;ll email you as soon as it&rsquo;s live.
              </p>

              <!-- Benefits -->
              <h2 class="heading" style="margin:0 0 8px 0;font-family:Arial,Helvetica,sans-serif;font-size:18px;line-height:26px;font-weight:700;color:#111A1D;">
                What you&rsquo;ll unlock
              </h2>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                ${benefit("&#127909;", "Ad-free streaming", "Watch your favorite anime without interruptions.")}
                ${benefit("&#128293;", "Exclusive content", "Access premium episodes and early releases.")}
                ${benefit("&#127775;", "Premium badges", "Show off your supporter status on your profile.")}
                ${benefit("&#128274;", "Extra account security", "Additional protection and recovery options.")}
                ${benefit("&#128736;&#65039;", "Priority support", "Get dedicated help whenever you need it.")}
              </table>

              <!-- Divider -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:28px 0;">
                <tr><td class="divider" style="border-top:1px solid #E1E8EB;font-size:0;line-height:0;">&nbsp;</td></tr>
              </table>

              <!-- Recovery details -->
              <h2 class="heading" style="margin:0 0 8px 0;font-family:Arial,Helvetica,sans-serif;font-size:18px;line-height:26px;font-weight:700;color:#111A1D;">
                Your account recovery details
              </h2>
              <p class="text" style="margin:0 0 16px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:22px;color:#3B4A50;">
                If you ever lose access to your account, these details can be used to verify ownership and file an appeal.
              </p>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td class="info-box" style="background-color:#F6F9FA;border:1px solid #E1E8EB;border-radius:8px;padding:18px;">
                    ${
                      codes.length
                        ? `<div class="muted" style="font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#6B7A80;margin-bottom:8px;">Security codes</div>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 -4px 16px -4px;width:calc(100% + 8px);">
                      <tr>${codeCells}
                      </tr>
                    </table>`
                        : ""
                    }
                    <div class="muted" style="font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#6B7A80;margin-bottom:6px;">Transaction ID</div>
                    <div class="heading" style="font-family:Consolas,Menlo,monospace;font-size:15px;font-weight:700;color:#111A1D;word-break:break-all;">${trxID}</div>
                  </td>
                </tr>
              </table>

              <!-- Important note -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:20px;">
                <tr>
                  <td class="note-box" style="background-color:#FFF8E6;border:1px solid #F1DDA6;border-left:4px solid #F5B301;border-radius:8px;padding:16px 18px;">
                    <p class="heading" style="margin:0 0 8px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;color:#8A6500;">
                      &#128274; Keep these details safe
                    </p>
                    <p class="text" style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:21px;color:#3B4A50;">
                      Save the codes and transaction ID somewhere secure, and don&rsquo;t share them with anyone. When recovering your account, provide them to our team.
                      If the email we find doesn&rsquo;t match, or you no longer have access to it, please report it to us. The account name may differ, so keep it just in case.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" class="btn" style="margin:32px auto 8px auto;">
                <tr>
                  <td align="center" bgcolor="#00A3E0" style="border-radius:8px;">
                    <a href="https://www.anipub.org/premium" target="_blank"
                       style="display:inline-block;padding:15px 36px;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:700;color:#FFFFFF;background-color:#00A3E0;border-radius:8px;">
                      Explore AniPub
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
                Contact our support team at <a href="mailto:support@anipub.org" style="color:#0086B8;">support@anipub.org</a>
                if you have any questions about activation.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="card px" align="center" style="background-color:#FFFFFF;border-top:1px solid #E1E8EB;border-radius:0 0 12px 12px;padding:24px 40px 28px 40px;">
              <p class="text" style="margin:0 0 12px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:20px;color:#3B4A50;">
                Happy watching,<br><strong>The AniPub Team</strong>
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

module.exports = PerChase;