const escapeHtml = (str = "") =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

function resetCode(name, email, code) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeCode = escapeHtml(code);
  const year = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>Your password reset code</title>
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    body { margin: 0 !important; padding: 0 !important; width: 100% !important; }
    a { text-decoration: none; }
    @media only screen and (max-width: 620px) {
      .container { width: 100% !important; }
      .px { padding-left: 20px !important; padding-right: 20px !important; }
      .code { font-size: 28px !important; letter-spacing: 6px !important; padding: 16px 12px !important; }
    }
    @media (prefers-color-scheme: dark) {
      .body-bg { background-color: #0F1417 !important; }
      .card { background-color: #1A2226 !important; }
      .text { color: #D5DBDE !important; }
      .heading { color: #FFFFFF !important; }
      .muted { color: #8F9BA0 !important; }
      .divider { border-color: #2B373C !important; }
      .code { background-color: #11181B !important; border-color: #00A3E0 !important; color: #FFFFFF !important; }
      .warn-box { background-color: #2A1B1B !important; border-color: #5A2A2A !important; }
    }
  </style>
</head>
<body class="body-bg" style="margin:0;padding:0;background-color:#F2F5F7;">

  <!-- Preheader -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
    Your AniPub password reset code is ${safeCode}. It expires in 30 minutes.
    &#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;
  </div>

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" class="body-bg" style="background-color:#F2F5F7;">
    <tr>
      <td align="center" style="padding:32px 12px;">

        <table role="presentation" class="container" width="600" cellspacing="0" cellpadding="0" border="0" style="width:600px;max-width:600px;">

          <!-- Header -->
          <tr>
            <td align="center" style="background-color:#111A1D;border-radius:12px 12px 0 0;padding:32px 24px;">
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:30px;font-weight:700;letter-spacing:1px;color:#FFFFFF;">
                Ani<span style="color:#00A3E0;">Pub</span>
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
                Reset your password
              </h1>

              <p class="text" style="margin:0 0 16px 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:26px;color:#3B4A50;">
                Hi ${safeName},
              </p>

              <p class="text" style="margin:0 0 28px 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:26px;color:#3B4A50;">
                We received a request to reset the password for your <strong>AniPub</strong> account
                (<strong>${safeEmail}</strong>). Enter the code below on the password reset page to continue.
              </p>

              <!-- Code -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center">
                    <div class="code" style="display:inline-block;background-color:#F6F9FA;border:2px dashed #00A3E0;border-radius:10px;padding:18px 36px;font-family:Consolas,Menlo,monospace;font-size:34px;line-height:40px;font-weight:700;letter-spacing:10px;color:#111A1D;">${safeCode}</div>
                  </td>
                </tr>
              </table>

              <p class="text" style="margin:20px 0 28px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:22px;color:#3B4A50;text-align:center;">
                &#9201; This code will expire in <strong>30 minutes</strong> and can only be used once.
              </p>

              <!-- Warning box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td class="warn-box" style="background-color:#FDF1F1;border:1px solid #F3CACA;border-left:4px solid #D93636;border-radius:8px;padding:16px 18px;">
                    <p class="heading" style="margin:0 0 6px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;color:#B42323;">
                      &#128274; Never share this code
                    </p>
                    <p class="text" style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:21px;color:#3B4A50;">
                      AniPub staff will never ask you for this code. Anyone who has it can reset your password.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:32px 0 24px 0;">
                <tr><td class="divider" style="border-top:1px solid #E1E8EB;font-size:0;line-height:0;">&nbsp;</td></tr>
              </table>

              <!-- Security notice -->
              <p class="muted" style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:21px;color:#6B7A80;">
                <strong style="color:#3B4A50;">Didn&rsquo;t request a reset?</strong>
                You can safely ignore this email &mdash; your password will not be changed.
                If you keep receiving these emails, contact us at
                <a href="mailto:support@anipub.org" style="color:#0086B8;">support@anipub.org</a>.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="card px" align="center" style="background-color:#FFFFFF;border-top:1px solid #E1E8EB;border-radius:0 0 12px 12px;padding:24px 40px 28px 40px;">
              <p class="muted" style="margin:0 0 10px 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;color:#8A979C;">
                <a href="https://anipub.org" style="color:#6B7A80;">Website</a>
                &nbsp;&bull;&nbsp;
                <a href="https://anipub.org/Privacy-policy" style="color:#6B7A80;">Privacy Policy</a>
                &nbsp;&bull;&nbsp;
                <a href="mailto:support@anipub.org" style="color:#6B7A80;">Support</a>
              </p>
              <p class="muted" style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;color:#8A979C;">
                &copy; ${year} AniPub. All rights reserved.<br>
                This is an automated security message &mdash; please do not reply directly.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;
}

module.exports = resetCode;