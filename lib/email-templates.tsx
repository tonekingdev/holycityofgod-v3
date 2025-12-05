import { CHURCH_INFO } from "@/constants"

interface EmailTemplateData {
  name: string
  message?: string
  currentDate?: string
  siteUrl?: string
}

interface ChurchNotificationData {
  name: string
  email: string
  phone: string
  message: string
  currentDate: string
  siteUrl?: string
}

export function generateAutoReplyTemplate(data: EmailTemplateData): { html: string; text: string } {
  const { name, siteUrl = "https://holycityofgod.org" } = data

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Prayer Request Confirmation - Holy City of God</title>
      <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
      <![endif]-->
      <style>
        /* Reset styles */
        body, table, td, p, a, li, blockquote {
          -webkit-text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
        }
        table, td {
          mso-table-lspace: 0pt;
          mso-table-rspace: 0pt;
        }
        img {
          -ms-interpolation-mode: bicubic;
          border: 0;
          height: auto;
          line-height: 100%;
          outline: none;
          text-decoration: none;
        }
        
        /* Client-specific styles */
        body {
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          min-width: 100% !important;
          height: 100% !important;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f8f9fa;
        }
        
        /* Prevent auto-linking */
        .appleLinks a {
          color: inherit !important;
          text-decoration: none !important;
        }
        
        /* Media queries */
        @media screen and (max-width: 600px) {
          .container {
            width: 100% !important;
            max-width: 100% !important;
          }
          .mobile-padding {
            padding: 20px !important;
          }
          .mobile-center {
            text-align: center !important;
          }
          .mobile-hide {
            display: none !important;
          }
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8f9fa;">
      <!-- Preheader text -->
      <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
        Thank you for your prayer request. We're here for you and will be praying.
      </div>
      
      <!-- Main container -->
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8f9fa;">
        <tr>
          <td align="center" style="padding: 20px 0;">
            
            <!-- Email wrapper -->
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="container" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
              
              <!-- Header with logo and gradient -->
              <tr>
                <td align="center" style="background: linear-gradient(135deg, #7c2d92 0%, #6b2580 100%); padding: 40px 20px; color: #ffffff;">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                      <td align="center">
                        <!-- Church Logo -->
                        <img src="${siteUrl}/img/church-logo.png" alt="Holy City of God Christian Fellowship" width="80" height="80" style="display: block; border-radius: 50%; background-color: #ffffff; padding: 8px; margin-bottom: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">
                        
                        <!-- Church Name -->
                        <h1 style="margin: 0 0 10px 0; font-size: 28px; font-weight: bold; color: #ffffff; text-align: center; line-height: 1.2;">
                          Holy City of God
                        </h1>
                        <p style="margin: 0 0 10px 0; font-size: 18px; color: #ffffff; opacity: 0.9; text-align: center;">
                          Christian Fellowship Inc.
                        </p>
                        <p style="margin: 0; font-size: 14px; color: #ffffff; opacity: 0.8; text-align: center; font-style: italic;">
                          Sharing the love of Jesus
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Main content -->
              <tr>
                <td style="padding: 40px 30px;" class="mobile-padding">
                  
                  <!-- Greeting -->
                  <h2 style="margin: 0 0 20px 0; font-size: 24px; color: #7c2d92; font-weight: bold; text-align: center;">
                    Dear ${name},
                  </h2>
                  
                  <!-- Main message -->
                  <div style="background-color: #faf7fc; padding: 25px; border-radius: 8px; border-left: 4px solid #ffc107; margin-bottom: 25px;">
                    <p style="margin: 0 0 15px 0; font-size: 16px; line-height: 1.6; color: #333333;">
                      <strong>Thank you for trusting us with your prayer request.</strong> We are honored that you've reached out to our church family during this time.
                    </p>
                    <p style="margin: 0 0 15px 0; font-size: 16px; line-height: 1.6; color: #333333;">
                      Your request has been received and will be lifted up in prayer by our pastoral team and prayer ministry. We believe in the power of prayer and that God hears every request made in faith.
                    </p>
                    <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #333333;">
                      <em>"And this is the confidence that we have toward him, that if we ask anything according to his will he hears us." - 1 John 5:14</em>
                    </p>
                  </div>
                  
                  <!-- Next steps -->
                  <div style="background-color: #ffffff; border: 2px solid #e9ecef; border-radius: 8px; padding: 25px; margin-bottom: 25px;">
                    <h3 style="margin: 0 0 15px 0; font-size: 20px; color: #7c2d92; font-weight: bold;">
                      What happens next:
                    </h3>
                    <ul style="margin: 0; padding-left: 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                      <li style="margin-bottom: 8px;">Our pastoral team will pray for your request during our weekly prayer meetings</li>
                      <li style="margin-bottom: 8px;">Our prayer team will also be praying for you</li>
                      <li style="margin-bottom: 8px;">You may receive a personal follow-up from one of our pastors or prayer team members</li>
                      <li style="margin-bottom: 0;">We encourage you to continue in prayer and trust God's perfect timing</li>
                    </ul>
                  </div>
                  
                  <!-- Contact information -->
                  <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 25px;">
                    <h3 style="margin: 0 0 15px 0; font-size: 18px; color: #7c2d92; font-weight: bold;">
                      Need additional support?
                    </h3>
                    <p style="margin: 0 0 10px 0; font-size: 14px; color: #666666;">
                      📧 Email: <a href="mailto:info@holycityofgod.org" style="color: #7c2d92; text-decoration: none;">info@holycityofgod.org</a>
                    </p>
                    <p style="margin: 0 0 10px 0; font-size: 14px; color: #666666;">
                      📞 Phone: <a href="tel:3133978240" style="color: #7c2d92; text-decoration: none;">${CHURCH_INFO.contact.phone}</a>
                    </p>
                    <p style="margin: 0; font-size: 14px; color: #666666;">
                      📍 ${CHURCH_INFO.contact.address.full}
                    </p>
                  </div>
                  
                  <!-- Call to action buttons -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                      <td align="center" style="padding: 20px 0;">
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                          <tr>
                            <td style="padding: 0 10px;">
                              <a href="${siteUrl}/services" style="display: inline-block; background-color: #ffc107; color: #7c2d92; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                                Join Our Services
                              </a>
                            </td>
                            <td style="padding: 0 10px;">
                              <a href="${siteUrl}/about" style="display: inline-block; background-color: transparent; color: #7c2d92; padding: 12px 25px; text-decoration: none; border: 2px solid #7c2d92; border-radius: 6px; font-weight: bold; font-size: 16px;">
                                Learn about HCOG
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Closing -->
                  <div style="text-align: center; margin-top: 30px;">
                    <p style="margin: 0 0 10px 0; font-size: 16px; color: #333333; font-style: italic;">
                      Blessings and peace,
                    </p>
                    <p style="margin: 0; font-size: 18px; color: #7c2d92; font-weight: bold;">
                      The Holy City of God Prayer Team
                    </p>
                  </div>
                  
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f8f9fa; padding: 30px 20px; text-align: center; border-top: 1px solid #e9ecef;">
                  <p style="margin: 0 0 10px 0; font-size: 14px; color: #666666;">
                    <strong>Holy City of God Christian Fellowship Inc.</strong>
                  </p>
                  <p style="margin: 0 0 10px 0; font-size: 12px; color: #666666;">
                    ${CHURCH_INFO.contact.address.full}
                  </p>
                  <p style="margin: 0 0 15px 0; font-size: 12px; color: #666666;">
                    Phone: ${CHURCH_INFO.contact.phone} | Email: info@holycityofgod.org
                  </p>
                  
                  <!-- Social links (if you have them) -->
                  <div style="margin: 15px 0;">
                    <a href="${siteUrl}" style="color: #7c2d92; text-decoration: none; font-size: 12px; margin: 0 10px;">
                      Visit Our Website
                    </a>
                  </div>
                  
                  <p style="margin: 15px 0 0 0; font-size: 11px; color: #999999; line-height: 1.4;">
                    This email was sent because you submitted a prayer request through our website. 
                    If you have any questions, please contact us at info@holycityofgod.org
                  </p>
                </td>
              </tr>
              
            </table>
            
          </td>
        </tr>
      </table>
    </body>
    </html>
  `

  const text = `
Dear ${name},

Thank you for trusting us with your prayer request. We are honored that you've reached out to our church family during this time.

Your request has been received and will be lifted up in prayer by our pastoral team and prayer ministry. We believe in the power of prayer and that God hears every request made in faith.

"And this is the confidence that we have toward him, that if we ask anything according to his will he hears us." - 1 John 5:14

WHAT HAPPENS NEXT:
• Our pastoral team will pray for your request during our weekly prayer meetings
• Our prayer team will also be praying for you  
• You may receive a personal follow-up from one of our pastors or prayer team members
• We encourage you to continue in prayer and trust God's perfect timing

NEED ADDITIONAL SUPPORT?
Email: info@holycityofgod.org
Phone: ${CHURCH_INFO.contact.phone}
Address: ${CHURCH_INFO.contact.address.full}

Visit our website: ${siteUrl}
Learn about our services: ${siteUrl}/services

Blessings and peace,
The Holy City of God Prayer Team

---
Holy City of God Christian Fellowship Inc.
${CHURCH_INFO.contact.address.full}
Phone: ${CHURCH_INFO.contact.phone} | Email: info@holycityofgod.org

This email was sent because you submitted a prayer request through our website.
If you have any questions, please contact us at info@holycityofgod.org
  `

  return { html, text }
}

export function generateChurchNotificationTemplate(data: ChurchNotificationData): { html: string; text: string } {
  const { name, email, phone, message, currentDate, siteUrl = "https://holycityofgod.org" } = data

  const phoneText = phone ? phone : "Not provided"

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Prayer Request - Holy City of God</title>
      <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
      <![endif]-->
      <style>
        /* Reset styles */
        body, table, td, p, a, li, blockquote {
          -webkit-text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
        }
        table, td {
          mso-table-lspace: 0pt;
          mso-table-rspace: 0pt;
        }
        img {
          -ms-interpolation-mode: bicubic;
          border: 0;
          height: auto;
          line-height: 100%;
          outline: none;
          text-decoration: none;
        }
        
        /* Client-specific styles */
        body {
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          min-width: 100% !important;
          height: 100% !important;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f8f9fa;
        }
        
        /* Media queries */
        @media screen and (max-width: 600px) {
          .container {
            width: 100% !important;
            max-width: 100% !important;
          }
          .mobile-padding {
            padding: 20px !important;
          }
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8f9fa;">
      <!-- Main container -->
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8f9fa;">
        <tr>
          <td align="center" style="padding: 20px 0;">
            
            <!-- Email wrapper -->
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="container" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
              
              <!-- Header with logo and gradient -->
              <tr>
                <td align="center" style="background: linear-gradient(135deg, #7c2d92 0%, #6b2580 100%); padding: 30px 20px; color: #ffffff;">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                      <td align="center">
                        <!-- Church Logo -->
                        <img src="${siteUrl}/img/church-logo.png" alt="Holy City of God Christian Fellowship" width="60" height="60" style="display: block; border-radius: 50%; background-color: #ffffff; padding: 6px; margin-bottom: 15px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">
                        
                        <!-- Title -->
                        <h1 style="margin: 0 0 5px 0; font-size: 24px; font-weight: bold; color: #ffffff; text-align: center;">
                          🙏 New Prayer Request
                        </h1>
                        <p style="margin: 0; font-size: 16px; color: #ffffff; opacity: 0.9; text-align: center;">
                          Holy City of God Christian Fellowship
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Main content -->
              <tr>
                <td style="padding: 30px;" class="mobile-padding">
                  
                  <!-- Contact Information -->
                  <div style="background-color: #faf7fc; padding: 25px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #ffc107;">
                    <h2 style="color: #7c2d92; margin: 0 0 20px 0; font-size: 20px; font-weight: bold;">
                      📋 Contact Information
                    </h2>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #333; width: 120px;">Name:</td>
                        <td style="padding: 8px 0; color: #555;">${name}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #333;">Email:</td>
                        <td style="padding: 8px 0; color: #555;">
                          <a href="mailto:${email}" style="color: #7c2d92; text-decoration: none;">${email}</a>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #333;">Phone:</td>
                        <td style="padding: 8px 0; color: #555;">${phoneText}</td>
                      </tr>
                    </table>
                  </div>

                  <!-- Prayer Request Content -->
                  <div style="background-color: #ffffff; padding: 25px; border: 2px solid #e9ecef; border-radius: 8px; margin-bottom: 25px;">
                    <h2 style="color: #7c2d92; margin: 0 0 20px 0; font-size: 20px; font-weight: bold;">
                      🙏 Prayer Request
                    </h2>
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; border-left: 4px solid #7c2d92;">
                      <p style="white-space: pre-wrap; line-height: 1.8; margin: 0; color: #333; font-size: 16px;">
                        ${message}
                      </p>
                    </div>
                  </div>

                  <!-- Footer Information -->
                  <div style="background-color: #e9ecef; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 25px;">
                    <p style="margin: 0 0 10px 0; font-size: 14px; color: #6c757d;">
                      📅 <strong>Submitted:</strong> ${currentDate} (Detroit Time)
                    </p>
                    <p style="margin: 0; font-size: 12px; color: #6c757d;">
                      This prayer request was submitted through the Holy City of God website prayer form.
                    </p>
                  </div>

                  <!-- Action Buttons -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                      <td align="center" style="padding: 20px 0;">
                        <a href="mailto:${email}?subject=Re: Your Prayer Request" 
                           style="display: inline-block; background-color: #7c2d92; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 0 10px;">
                          📧 Reply to ${name}
                        </a>
                      </td>
                    </tr>
                  </table>
                  
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
                  <p style="margin: 0 0 5px 0; font-size: 14px; color: #666666;">
                    <strong>Holy City of God Christian Fellowship Inc.</strong>
                  </p>
                  <p style="margin: 0 0 5px 0; font-size: 12px; color: #666666;">
                    ${CHURCH_INFO.contact.address.full}
                  </p>
                  <p style="margin: 0; font-size: 11px; color: #999999;">
                    This is an automated message from the church website.
                  </p>
                </td>
              </tr>
              
            </table>
            
          </td>
        </tr>
      </table>
    </body>
    </html>
  `

  const text = `
New Prayer Request
Holy City of God Christian Fellowship

Contact Information:
- Name: ${name}
- Email: ${email}
- Phone: ${phoneText}

Prayer Request:
${message}

Submitted: ${currentDate} (Detroit Time)
This prayer request was submitted through the Holy City of God website.

Reply to ${name}: mailto:${email}?subject=Re: Your Prayer Request

---
Holy City of God Christian Fellowship Inc.
${CHURCH_INFO.contact.address.full}
This is an automated message from the church website.
  `

  return { html, text }
}