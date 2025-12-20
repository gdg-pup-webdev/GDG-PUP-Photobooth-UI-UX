// Christmas Theme Colors (matching UI/UX)
const colors = {
  green: "#165B33",      // Christmas green
  red: "#BB2528",        // Christmas red
  gold: "#F8B229",       // Christmas gold
  white: "#FFFFFF",
  darkGreen: "#0F3D22",
  lightRed: "#EA4630",
};

// GDG Brand Colors (for logo dots)
const gdgColors = {
  blue: "#4285F4",
  red: "#EA4335",
  yellow: "#FBBC04",
  green: "#34A853",
};

export function getEmailTemplate(recipientEmail: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>Santa Doesn't Know U Like I Do</title>
  <style>
    :root {
      color-scheme: light dark;
    }
    
    @media only screen and (max-width: 600px) {
      .main-table { width: 100% !important; }
      .content-padding { padding: 20px 16px !important; }
      .header-padding { padding: 24px 16px 16px 16px !important; }
      .section-padding { padding: 16px !important; }
      .footer-padding { padding: 20px 16px !important; }
    }
    
    /* Light mode styles (default) */
    .body-bg { background-color: #f5f5f5 !important; }
    .main-card { background: linear-gradient(145deg, #ffffff, #f8f9fa) !important; }
    .header-bg { background: linear-gradient(180deg, rgba(22, 91, 51, 0.08), transparent) !important; }
    .content-card { background: linear-gradient(145deg, rgba(22, 91, 51, 0.08), rgba(187, 37, 40, 0.05)) !important; }
    .heading-text { color: #1a1a1a !important; }
    .body-text { color: #333333 !important; }
    .muted-text { color: #666666 !important; }
    .footer-bg { background: #fafafa !important; }
    
    /* Dark mode styles */
    @media (prefers-color-scheme: dark) {
      .body-bg { background: linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #0f0f0f 100%) !important; }
      .main-card { background: linear-gradient(145deg, #1a1a2e, #0f0f0f) !important; border: 1px solid rgba(255, 255, 255, 0.1) !important; }
      .header-bg { background: linear-gradient(180deg, rgba(22, 91, 51, 0.15), transparent) !important; }
      .content-card { background: linear-gradient(145deg, rgba(22, 91, 51, 0.15), rgba(187, 37, 40, 0.1)) !important; border: 1px solid rgba(255, 255, 255, 0.08) !important; }
      .heading-text { color: #ffffff !important; }
      .body-text { color: rgba(255, 255, 255, 0.85) !important; }
      .muted-text { color: rgba(255, 255, 255, 0.6) !important; }
      .footer-bg { background: rgba(0, 0, 0, 0.3) !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: 'Google Sans', 'Segoe UI', Roboto, Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" class="body-bg" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 20px 12px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" class="main-table main-card" style="background: linear-gradient(145deg, #ffffff, #f8f9fa); border-radius: 24px; overflow: hidden; box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);">
          
          <!-- Header with GDG Colors -->
          <tr>
            <td style="padding: 0;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td width="25%" style="height: 6px; background-color: ${gdgColors.blue};"></td>
                  <td width="25%" style="height: 6px; background-color: ${gdgColors.red};"></td>
                  <td width="25%" style="height: 6px; background-color: ${gdgColors.yellow};"></td>
                  <td width="25%" style="height: 6px; background-color: ${gdgColors.green};"></td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Festive Header Section -->
          <tr>
            <td align="center" class="header-padding header-bg" style="padding: 32px 24px 16px 24px;">
              <p style="margin: 0; font-size: 40px; line-height: 1;">🎄</p>
              <h1 style="margin: 16px 0 0 0; font-size: 22px; font-weight: 800; color: ${colors.gold}; line-height: 1.3;">
                Santa Doesn't Know U Like I Do
              </h1>
              <p class="heading-text" style="margin: 8px 0 0 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; color: #1a1a1a;">
                A Design Jam
              </p>
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin-top: 12px;">
                <tr>
                  <td style="background: linear-gradient(135deg, ${colors.green}, ${colors.darkGreen}); padding: 6px 16px; border-radius: 20px;">
                    <p style="margin: 0; color: ${colors.white}; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                      UI/UX 2nd Study Jam
                    </p>
                  </td>
                </tr>
              </table>
              <p class="muted-text" style="margin: 12px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #666666;">
                GDG on Campus PUP
              </p>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td class="content-padding" style="padding: 16px 24px 24px 24px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" class="content-card" style="background: linear-gradient(145deg, rgba(22, 91, 51, 0.08), rgba(187, 37, 40, 0.05)); border-radius: 16px; border: 1px solid rgba(0, 0, 0, 0.08);">
                <tr>
                  <td class="section-padding" style="padding: 24px;">
                    <h2 class="heading-text" style="margin: 0 0 16px 0; font-size: 22px; font-weight: 700; color: #1a1a1a;">
                      Hey there, Sparkmate!
                    </h2>
                    <p class="body-text" style="margin: 0 0 12px 0; font-size: 15px; line-height: 1.6; color: #333333;">
                      Great job at the <strong style="color: ${colors.gold};">UI/UX 2nd Study Jam</strong>!
                    </p>
                    <p class="body-text" style="margin: 0 0 12px 0; font-size: 15px; line-height: 1.6; color: #333333;">
                      While Santa may not know the specifics of your design skills, <em style="color: ${colors.gold};">we definitely do!</em> Thanks for being part of our Design Jam and capturing these wonderful memories at the photobooth.
                    </p>
                    <p class="body-text" style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #333333;">
                      Your awesome photostrip is attached to this email. Share the holiday spirit with friends and family!
                    </p>
                    
                    <!-- Photo Attachment Notice -->
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center" style="padding: 16px 0;">
                          <table role="presentation" cellspacing="0" cellpadding="0" style="background: linear-gradient(135deg, ${colors.green}, ${colors.darkGreen}); border-radius: 12px; box-shadow: 0 8px 20px rgba(22, 91, 51, 0.3);">
                            <tr>
                              <td style="padding: 12px 24px;">
                                <p style="margin: 0; color: ${colors.white}; font-size: 14px; font-weight: 600;">
                                  Your Design Jam photostrip is attached!
                                </p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Hashtags Section -->
          <tr>
            <td class="content-padding" style="padding: 0 24px 24px 24px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: linear-gradient(135deg, rgba(248, 178, 41, 0.15), rgba(248, 178, 41, 0.05)); border-radius: 16px; border: 1px solid rgba(248, 178, 41, 0.2);">
                <tr>
                  <td style="padding: 20px;" align="center">
                    <p class="muted-text" style="margin: 0 0 8px 0; font-size: 13px; color: #666666;">
                      Share your design journey! Tag us:
                    </p>
                    <p style="margin: 0; font-size: 12px;">
                      <span style="display: inline-block; padding: 4px 10px; margin: 4px; background: ${colors.green}; color: ${colors.white}; border-radius: 20px; font-weight: 600;">#GDGPUP26</span>
                      <span style="display: inline-block; padding: 4px 10px; margin: 4px; background: ${colors.red}; color: ${colors.white}; border-radius: 20px; font-weight: 600;">#BeSuperWithGDG</span>
                      <span style="display: inline-block; padding: 4px 10px; margin: 4px; background: ${colors.gold}; color: #1a1a1a; border-radius: 20px; font-weight: 600;">#GDGDesignJam</span>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Seasonal Message -->
          <tr>
            <td class="content-padding" style="padding: 0 24px 24px 24px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" class="content-card" style="background: linear-gradient(135deg, rgba(187, 37, 40, 0.08), rgba(22, 91, 51, 0.05)); border-radius: 16px; border: 1px solid rgba(0, 0, 0, 0.08);">
                <tr>
                  <td style="padding: 20px;" align="center">
                    <p style="margin: 0; font-size: 28px;">✨</p>
                    <p style="margin: 12px 0 0 0; color: ${colors.gold}; font-size: 16px; font-weight: 700; font-style: italic;">
                      "Design like Santa's watching... but code like he isn't!"
                    </p>
                    <p class="muted-text" style="margin: 8px 0 0 0; font-size: 12px; color: #666666;">
                      - With love from Sparky & the GDG Team
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td class="footer-padding footer-bg" style="padding: 20px 24px; background: #fafafa; border-top: 1px solid rgba(0, 0, 0, 0.08);">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <table role="presentation" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="width: 10px; height: 10px; border-radius: 50%; background-color: ${gdgColors.blue};"></td>
                        <td style="width: 6px;"></td>
                        <td style="width: 10px; height: 10px; border-radius: 50%; background-color: ${gdgColors.red};"></td>
                        <td style="width: 6px;"></td>
                        <td style="width: 10px; height: 10px; border-radius: 50%; background-color: ${gdgColors.yellow};"></td>
                        <td style="width: 6px;"></td>
                        <td style="width: 10px; height: 10px; border-radius: 50%; background-color: ${gdgColors.green};"></td>
                      </tr>
                    </table>
                    <p class="muted-text" style="margin: 12px 0 0 0; font-size: 11px; color: #666666;">
                      Powered by <strong style="color: ${colors.gold};">GDG on Campus PUP</strong>
                    </p>
                    <p style="margin: 6px 0 0 0; color: #999999; font-size: 10px;">
                      Sent to ${recipientEmail}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Bottom Color Bar -->
          <tr>
            <td style="padding: 0;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td width="25%" style="height: 4px; background-color: ${gdgColors.blue};"></td>
                  <td width="25%" style="height: 4px; background-color: ${gdgColors.red};"></td>
                  <td width="25%" style="height: 4px; background-color: ${gdgColors.yellow};"></td>
                  <td width="25%" style="height: 4px; background-color: ${gdgColors.green};"></td>
                </tr>
              </table>
            </td>
          </tr>
          
        </table>
        
        <!-- Legal Footer -->
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" class="main-table">
          <tr>
            <td align="center" style="padding: 20px 16px;">
              <p style="margin: 0; color: #888888; font-size: 10px; line-height: 1.4;">
                © ${new Date().getFullYear()} Google Developer Groups on Campus PUP. All rights reserved.
              </p>
              <p style="margin: 6px 0 0 0; color: #aaaaaa; font-size: 10px;">
                UI/UX 2nd Study Jam • Santa Doesn't Know U Like I Do
              </p>
            </td>
          </tr>
        </table>
        
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
