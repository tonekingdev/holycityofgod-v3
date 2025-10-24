import { CHURCH_INFO } from "@/constants"

interface EventApprovalData {
  eventTitle: string
  eventDate: string
  eventTime?: string
  eventLocation?: string
  eventDescription?: string
  recipientName: string
  approverName: string
  approverComments?: string
  siteUrl?: string
}

interface EventRejectionData {
  eventTitle: string
  recipientName: string
  rejectionReason: string
  approverName: string
  siteUrl?: string
}

export function generateEventApprovedTemplate(data: EventApprovalData): { html: string; text: string } {
  const {
    eventTitle,
    eventDate,
    eventTime,
    eventLocation,
    eventDescription,
    recipientName,
    approverName,
    approverComments,
    siteUrl = "https://holycityofgod.org",
  } = data

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Event Approved - ${eventTitle}</title>
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
      <!-- Preheader text -->
      <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
        Great news! Your event "${eventTitle}" has been approved and is now published.
      </div>
      
      <!-- Main container -->
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8f9fa;">
        <tr>
          <td align="center" style="padding: 20px 0;">
            
            <!-- Email wrapper -->
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="container" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
              
              <!-- Updated header with Holy City of God branding and purple color scheme -->
              <tr>
                <td align="center" style="background: linear-gradient(135deg, #7c2d92 0%, #6b2580 100%); padding: 40px 20px; color: #ffffff;">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                      <td align="center">
                        <!-- Church Logo -->
                        <div style="width: 80px; height: 80px; border-radius: 50%; background-color: #ffffff; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                          <div style="width: 60px; height: 60px; border-radius: 50%; background-color: #7c2d92;"></div>
                        </div>
                        
                        <!-- Church Name -->
                        <h1 style="margin: 0 0 5px 0; font-size: 28px; font-weight: bold; color: #ffffff; text-align: center; line-height: 1.2;">
                          Holy City of God
                        </h1>
                        <p style="margin: 0 0 20px 0; font-size: 18px; color: #ffffff; opacity: 0.9; text-align: center;">
                          Christian Fellowship Inc.
                        </p>
                        <p style="margin: 0 0 20px 0; font-size: 16px; color: #ffffff; opacity: 0.8; text-align: center; font-style: italic;">
                          Sharing the love of Jesus
                        </p>
                        
                        <!-- Success Banner -->
                        <div style="background-color: #dc3545; padding: 15px 30px; border-radius: 25px; margin: 0 auto;">
                          <p style="margin: 0; font-size: 18px; color: #ffffff; font-weight: bold; text-align: center;">
                            🙏 Your event has been approved
                          </p>
                        </div>
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
                    Dear ${recipientName},
                  </h2>
                  
                  <!-- Main message -->
                  <div style="background-color: #f8f9fa; padding: 25px; border-radius: 8px; border-left: 4px solid #ffc107; margin-bottom: 25px;">
                    <p style="margin: 0 0 15px 0; font-size: 16px; line-height: 1.6; color: #333;">
                      <strong>Thank you for trusting us with your event request.</strong> We are honored that you've reached out to our church family during this time.
                    </p>
                    <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #333;">
                      Your event has been approved and will be published on our church calendar. We believe in the power of community and that God hears every request made in faith.
                    </p>
                  </div>
                  
                  <!-- Event Details -->
                  <div style="background-color: #faf7fc; padding: 25px; border-radius: 8px; border-left: 4px solid #ffc107; margin-bottom: 25px;">
                    <h3 style="margin: 0 0 20px 0; font-size: 20px; color: #7c2d92; font-weight: bold;">
                      📅 Event Details
                    </h3>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #333; width: 120px;">Title:</td>
                        <td style="padding: 8px 0; color: #555; font-weight: bold; font-size: 18px;">${eventTitle}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #333;">Date:</td>
                        <td style="padding: 8px 0; color: #555;">${eventDate}</td>
                      </tr>
                      ${
                        eventTime
                          ? `
                      <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #333;">Time:</td>
                        <td style="padding: 8px 0; color: #555;">${eventTime}</td>
                      </tr>
                      `
                          : ""
                      }
                      ${
                        eventLocation
                          ? `
                      <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #333;">Location:</td>
                        <td style="padding: 8px 0; color: #555;">${eventLocation}</td>
                      </tr>
                      `
                          : ""
                      }
                      ${
                        eventDescription
                          ? `
                      <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #333; vertical-align: top;">Description:</td>
                        <td style="padding: 8px 0; color: #555; line-height: 1.6;">${eventDescription}</td>
                      </tr>
                      `
                          : ""
                      }
                    </table>
                  </div>
                  
                  ${
                    approverComments
                      ? `
                  <!-- Approver Comments -->
                  <div style="background-color: #ffffff; border: 2px solid #e9ecef; border-radius: 8px; padding: 25px; margin-bottom: 25px;">
                    <h3 style="margin: 0 0 15px 0; font-size: 18px; color: #7c2d92; font-weight: bold;">
                      💬 Comments from ${approverName}
                    </h3>
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; border-left: 4px solid #7c2d92;">
                      <p style="white-space: pre-wrap; line-height: 1.6; margin: 0; color: #333; font-size: 16px;">
                        ${approverComments}
                      </p>
                    </div>
                  </div>
                  `
                      : ""
                  }
                  
                  <!-- What happens next -->
                  <div style="background-color: #ffffff; border: 2px solid #e9ecef; border-radius: 8px; padding: 25px; margin-bottom: 25px;">
                    <h3 style="margin: 0 0 15px 0; font-size: 20px; color: #7c2d92; font-weight: bold;">
                      What happens next:
                    </h3>
                    <ul style="margin: 0; padding-left: 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                      <li style="margin-bottom: 8px;">Your event is now visible on the church calendar</li>
                      <li style="margin-bottom: 8px;">Members can view event details and register if applicable</li>
                      <li style="margin-bottom: 8px;">You'll receive any registration notifications or updates</li>
                      <li style="margin-bottom: 0;">We encourage you to continue in prayer and trust God's perfect timing</li>
                    </ul>
                  </div>
                  
                  <!-- Updated contact information with Holy City of God details -->
                  <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 25px;">
                    <h3 style="margin: 0 0 15px 0; font-size: 18px; color: #7c2d92; font-weight: bold;">
                      Need additional support?
                    </h3>
                    <p style="margin: 0 0 10px 0; font-size: 14px; color: #666666;">
                      📧 Email: <a href="mailto:info@holycityofgod.org" style="color: #7c2d92; text-decoration: none;">info@holycityofgod.org</a>
                    </p>
                    <p style="margin: 0 0 10px 0; font-size: 14px; color: #666666;">
                      📞 Phone: <a href="tel:(586)307-3043" style="color: #7c2d92; text-decoration: none;">(586) 307-3043</a>
                    </p>
                    <p style="margin: 0; font-size: 14px; color: #666666;">
                      📍 28333 Marcia Ave, Warren, MI 48093
                    </p>
                  </div>
                  
                  <!-- Call to action buttons -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                      <td align="center" style="padding: 20px 0;">
                        <a href="${siteUrl}/events" style="display: inline-block; background-color: #ffc107; color: #7c2d92; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; margin: 0 10px;">
                          Join Our Services
                        </a>
                        <a href="${siteUrl}/about" style="display: inline-block; background-color: transparent; color: #7c2d92; padding: 12px 25px; text-decoration: none; border: 2px solid #7c2d92; border-radius: 6px; font-weight: bold; font-size: 16px; margin: 0 10px;">
                          Learn about HCOG
                        </a>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Closing -->
                  <div style="text-align: center; margin-top: 30px;">
                    <p style="margin: 0 0 10px 0; font-size: 16px; color: #333333; font-style: italic;">
                      Blessings and peace,
                    </p>
                    <p style="margin: 0; font-size: 18px; color: #7c2d92; font-weight: bold;">
                      The Holy City of God Event Team
                    </p>
                  </div>
                  
                </td>
              </tr>
              
              <!-- Updated footer with Holy City of God branding -->
              <tr>
                <td style="background-color: #f8f9fa; padding: 30px 20px; text-align: center; border-top: 1px solid #e9ecef;">
                  <p style="margin: 0 0 10px 0; font-size: 14px; color: #666666;">
                    <strong>Holy City of God Christian Fellowship Inc.</strong>
                  </p>
                  <p style="margin: 0 0 10px 0; font-size: 12px; color: #666666;">
                    28333 Marcia Ave, Warren, MI 48093
                  </p>
                  <p style="margin: 0 0 15px 0; font-size: 12px; color: #666666;">
                    Phone: (586) 307-3043 | Email: info@holycityofgod.org
                  </p>
                  
                  <p style="margin: 15px 0 0 0; font-size: 11px; color: #999999; line-height: 1.4;">
                    This email was sent because your event was approved through our church management system. 
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
Dear ${recipientName},

Thank you for trusting us with your event request. We are honored that you've reached out to our church family during this time.

Your event has been approved and will be published on our church calendar. We believe in the power of community and that God hears every request made in faith.

EVENT DETAILS:
- Title: ${eventTitle}
- Date: ${eventDate}
${eventTime ? `- Time: ${eventTime}` : ""}
${eventLocation ? `- Location: ${eventLocation}` : ""}
${eventDescription ? `- Description: ${eventDescription}` : ""}

${approverComments ? `COMMENTS FROM ${approverName.toUpperCase()}:\n${approverComments}\n\n` : ""}

WHAT HAPPENS NEXT:
• Your event is now visible on the church calendar
• Members can view event details and register if applicable
• You'll receive any registration notifications or updates
• We encourage you to continue in prayer and trust God's perfect timing

NEED ADDITIONAL SUPPORT?
Email: info@holycityofgod.org
Phone: (586) 307-3043
Address: 28333 Marcia Ave, Warren, MI 48093

Join Our Services: ${siteUrl}/events
Learn about HCOG: ${siteUrl}/about

Blessings and peace,
The Holy City of God Event Team

---
Holy City of God Christian Fellowship Inc.
28333 Marcia Ave, Warren, MI 48093
Phone: (586) 307-3043 | Email: info@holycityofgod.org

This email was sent because your event was approved through our church management system.
If you have any questions, please contact us at info@holycityofgod.org
  `

  return { html, text }
}

export function generateEventRejectedTemplate(data: EventRejectionData): { html: string; text: string } {
  const { eventTitle, recipientName, rejectionReason, approverName, siteUrl = "https://holycityofgod.org" } = data

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Event Requires Revision - ${eventTitle}</title>
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
      <!-- Preheader text -->
      <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
        Your event "${eventTitle}" requires some revisions before it can be approved.
      </div>
      
      <!-- Main container -->
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8f9fa;">
        <tr>
          <td align="center" style="padding: 20px 0;">
            
            <!-- Email wrapper -->
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="container" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
              
              <!-- Updated header with Holy City of God branding -->
              <tr>
                <td align="center" style="background: linear-gradient(135deg, #7c2d92 0%, #6b2580 100%); padding: 40px 20px; color: #ffffff;">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                      <td align="center">
                        <!-- Church Logo -->
                        <div style="width: 80px; height: 80px; border-radius: 50%; background-color: #ffffff; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                          <div style="width: 60px; height: 60px; border-radius: 50%; background-color: #7c2d92;"></div>
                        </div>
                        
                        <!-- Church Name -->
                        <h1 style="margin: 0 0 5px 0; font-size: 28px; font-weight: bold; color: #ffffff; text-align: center; line-height: 1.2;">
                          Holy City of God
                        </h1>
                        <p style="margin: 0 0 20px 0; font-size: 18px; color: #ffffff; opacity: 0.9; text-align: center;">
                          Christian Fellowship Inc.
                        </p>
                        <p style="margin: 0 0 20px 0; font-size: 16px; color: #ffffff; opacity: 0.8; text-align: center; font-style: italic;">
                          Sharing the love of Jesus
                        </p>
                        
                        <!-- Revision Banner -->
                        <div style="background-color: #dc3545; padding: 15px 30px; border-radius: 25px; margin: 0 auto;">
                          <p style="margin: 0; font-size: 18px; color: #ffffff; font-weight: bold; text-align: center;">
                            📝 Your event requires revision
                          </p>
                        </div>
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
                    Dear ${recipientName},
                  </h2>
                  
                  <!-- Main message -->
                  <div style="background-color: #fff3cd; padding: 25px; border-radius: 8px; border-left: 4px solid #ffc107; margin-bottom: 25px;">
                    <p style="margin: 0 0 15px 0; font-size: 16px; line-height: 1.6; color: #856404;">
                      <strong>Your event "${eventTitle}" requires some revisions</strong> before it can be approved and published to the church calendar.
                    </p>
                    <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #856404;">
                      Please review the feedback below, make the necessary changes, and resubmit your event for approval.
                    </p>
                  </div>
                  
                  <!-- Feedback Section -->
                  <div style="background-color: #ffffff; border: 2px solid #e9ecef; border-radius: 8px; padding: 25px; margin-bottom: 25px;">
                    <h3 style="margin: 0 0 20px 0; font-size: 20px; color: #7c2d92; font-weight: bold;">
                      📋 Feedback from ${approverName}
                    </h3>
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; border-left: 4px solid #dc3545;">
                      <p style="white-space: pre-wrap; line-height: 1.8; margin: 0; color: #333; font-size: 16px;">
                        ${rejectionReason}
                      </p>
                    </div>
                  </div>
                  
                  <!-- Next Steps -->
                  <div style="background-color: #faf7fc; padding: 25px; border-radius: 8px; border-left: 4px solid #ffc107; margin-bottom: 25px;">
                    <h3 style="margin: 0 0 15px 0; font-size: 20px; color: #7c2d92; font-weight: bold;">
                      Next steps:
                    </h3>
                    <ul style="margin: 0; padding-left: 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                      <li style="margin-bottom: 8px;">Review the feedback provided above</li>
                      <li style="margin-bottom: 8px;">Make the necessary changes to your event</li>
                      <li style="margin-bottom: 8px;">Resubmit your event through the church system</li>
                      <li style="margin-bottom: 0;">Contact the church office if you need clarification</li>
                    </ul>
                  </div>
                  
                  <!-- Contact information -->
                  <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 25px;">
                    <h3 style="margin: 0 0 15px 0; font-size: 18px; color: #7c2d92; font-weight: bold;">
                      Need help or clarification?
                    </h3>
                    <p style="margin: 0 0 10px 0; font-size: 14px; color: #666666;">
                      📧 Email: <a href="mailto:info@holycityofgod.org" style="color: #7c2d92; text-decoration: none;">info@holycityofgod.org</a>
                    </p>
                    <p style="margin: 0; font-size: 14px; color: #666666;">
                      📞 Phone: <a href="tel:3133978240" style="color: #7c2d92; text-decoration: none;">${CHURCH_INFO.contact.phone}</a>
                    </p>
                  </div>
                  
                  <!-- Call to action buttons -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                      <td align="center" style="padding: 20px 0;">
                        <a href="${siteUrl}/events/create" style="display: inline-block; background-color: #ffc107; color: #7c2d92; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; margin: 0 10px;">
                          Revise & Resubmit Event
                        </a>
                        <a href="mailto:info@holycityofgod.org?subject=Event Revision Question - ${eventTitle}" style="display: inline-block; background-color: transparent; color: #7c2d92; padding: 12px 25px; text-decoration: none; border: 2px solid #7c2d92; border-radius: 6px; font-weight: bold; font-size: 16px; margin: 0 10px;">
                          Ask Questions
                        </a>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Closing -->
                  <div style="text-align: center; margin-top: 30px;">
                    <p style="margin: 0 0 10px 0; font-size: 16px; color: #333333; font-style: italic;">
                      We're here to help you succeed,
                    </p>
                    <p style="margin: 0; font-size: 18px; color: #7c2d92; font-weight: bold;">
                      PC BRAINIACS LLC d.b.a. Tone King Development Team
                    </p>
                  </div>
                  
                </td>
              </tr>
              
              <!-- Updated footer with Holy City of God branding -->
              <tr>
                <td style="background-color: #f8f9fa; padding: 30px 20px; text-align: center; border-top: 1px solid #e9ecef;">
                  <p style="margin: 0 0 10px 0; font-size: 14px; color: #666666;">
                    <strong>Holy City of God Christian Fellowship Inc.</strong>
                  </p>
                  <p style="margin: 0 0 10px 0; font-size: 12px; color: #666666;">
                    28333 Marcia Ave, Warren, MI 48093
                  </p>
                  <p style="margin: 0 0 15px 0; font-size: 12px; color: #666666;">
                    Phone: (586) 307-3043 | Email: info@holycityofgod.org
                  </p>
                  
                  <p style="margin: 15px 0 0 0; font-size: 11px; color: #999999; line-height: 1.4;">
                    This email was sent because your event required revision through our church management system. 
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
Dear ${recipientName},

Your event "${eventTitle}" requires some revisions before it can be approved and published to the church calendar.

Please review the feedback below, make the necessary changes, and resubmit your event for approval.

FEEDBACK FROM ${approverName.toUpperCase()}:
${rejectionReason}

NEXT STEPS:
• Review the feedback provided above
• Make the necessary changes to your event
• Resubmit your event through the church system
• Contact the church office if you need clarification

NEED HELP OR CLARIFICATION?
Email: info@holycityofgod.org
Phone: ${CHURCH_INFO.contact.phone}

Revise & Resubmit Event: ${siteUrl}/events/create
Ask Questions: mailto:info@holycityofgod.org?subject=Event Revision Question - ${eventTitle}

We're here to help you succeed,
PC BRAINIACS LLC d.b.a. Tone King Development Team

---
PC BRAINIACS LLC d.b.a. Tone King Development
${CHURCH_INFO.contact.address.full}
Phone: ${CHURCH_INFO.contact.phone} | Email: info@holycityofgod.org

This email was sent because your event required revision through our church management system.
If you have any questions, please contact us at info@holycityofgod.org
  `

  return { html, text }
}

export function generateEventAwaitingApprovalTemplate(data: EventApprovalData): { html: string; text: string } {
  const {
    eventTitle,
    eventDate,
    eventTime,
    eventLocation,
    eventDescription,
    approverComments,
  } = data

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Event Awaiting Final Approval - ${eventTitle}</title>
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
              
              <!-- Updated header with Holy City of God branding -->
              <tr>
                <td align="center" style="background: linear-gradient(135deg, #7c2d92 0%, #6b2580 100%); padding: 30px 20px; color: #ffffff;">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                      <td align="center">
                        <!-- Church Logo -->
                        <div style="width: 60px; height: 60px; border-radius: 50%; background-color: #ffffff; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center;">
                          <div style="width: 45px; height: 45px; border-radius: 50%; background-color: #7c2d92;"></div>
                        </div>
                        
                        <!-- Title -->
                        <h1 style="margin: 0 0 5px 0; font-size: 24px; font-weight: bold; color: #ffffff; text-align: center;">
                          ⏳ Event Awaiting Final Approval
                        </h1>
                        <p style="margin: 0; font-size: 16px; color: #ffffff; opacity: 0.9; text-align: center;">
                          Holy City of God Christian Fellowship Inc.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Main content -->
              <tr>
                <td style="padding: 30px;" class="mobile-padding">
                  
                  <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #333333;">
                    An event has been approved by First Lady Kiana King and is now awaiting your final approval.
                  </p>
                  
                  <!-- Event Details -->
                  <div style="background-color: #faf7fc; padding: 25px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #ffc107;">
                    <h2 style="color: #7c2d92; margin: 0 0 20px 0; font-size: 20px; font-weight: bold;">
                      📅 Event Details
                    </h2>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #333; width: 120px;">Title:</td>
                        <td style="padding: 8px 0; color: #555; font-weight: bold; font-size: 18px;">${eventTitle}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #333;">Date:</td>
                        <td style="padding: 8px 0; color: #555;">${eventDate}</td>
                      </tr>
                      ${
                        eventTime
                          ? `
                      <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #333;">Time:</td>
                        <td style="padding: 8px 0; color: #555;">${eventTime}</td>
                      </tr>
                      `
                          : ""
                      }
                      ${
                        eventLocation
                          ? `
                      <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #333;">Location:</td>
                        <td style="padding: 8px 0; color: #555;">${eventLocation}</td>
                      </tr>
                      `
                          : ""
                      }
                      ${
                        eventDescription
                          ? `
                      <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #333; vertical-align: top;">Description:</td>
                        <td style="padding: 8px 0; color: #555; line-height: 1.6;">${eventDescription}</td>
                      </tr>
                      `
                          : ""
                      }
                    </table>
                  </div>

                  ${
                    approverComments
                      ? `
                  <!-- First Approver Comments -->
                  <div style="background-color: #ffffff; padding: 25px; border: 2px solid #e9ecef; border-radius: 8px; margin-bottom: 25px;">
                    <h2 style="color: #7c2d92; margin: 0 0 20px 0; font-size: 20px; font-weight: bold;">
                      💬 First Approver Comments
                    </h2>
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; border-left: 4px solid #7c2d92;">
                      <p style="white-space: pre-wrap; line-height: 1.8; margin: 0; color: #333; font-size: 16px;">
                        ${approverComments}
                      </p>
                    </div>
                  </div>
                  `
                      : ""
                  }

                  <p style="margin: 20px 0 0 0; font-size: 16px; line-height: 1.6; color: #333333;">
                    Please review and provide final approval.
                  </p>
                  
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
                  <p style="margin: 0 0 5px 0; font-size: 14px; color: #666666;">
                    <strong>Holy City of God Christian Fellowship Inc.</strong>
                  </p>
                  <p style="margin: 0 0 5px 0; font-size: 12px; color: #666666;">
                    28333 Marcia Ave, Warren, MI 48093
                  </p>
                  <p style="margin: 0; font-size: 11px; color: #999999;">
                    This is an automated message from the church management system.
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
Event Awaiting Final Approval
Holy City of God Christian Fellowship Inc.

An event has been approved by First Lady Kiana King and is now awaiting your final approval.

EVENT DETAILS:
- Title: ${eventTitle}
- Date: ${eventDate}
${eventTime ? `- Time: ${eventTime}` : ""}
${eventLocation ? `- Location: ${eventLocation}` : ""}
${eventDescription ? `- Description: ${eventDescription}` : ""}

${approverComments ? `FIRST APPROVER COMMENTS:\n${approverComments}\n\n` : ""}

Please review and provide final approval.

---
Holy City of God Christian Fellowship Inc.
28333 Marcia Ave, Warren, MI 48093
This is an automated message from the church management system.
  `

  return { html, text }
}
