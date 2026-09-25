import nodemailer from "nodemailer";

export async function sendInvoiceEmail(invoiceData) {
  try {
    const {
      invoiceId = "INV-2026-0001",
      userName = "Valued Customer",
      userEmail,
      userId = "N/A",
      planName = "Pro Unlimited Subscription",
      originalAmount = 4999,
      discountAmount = 0,
      amountPaid = 4999,
      couponCode = null,
      paymentId = "pay_live",
      orderId = "order_live",
      paymentMethod = "Razorpay (Online Payment)",
      billingCycle = "monthly",
      billingAddress = "India",
      createdAt = new Date().toISOString(),
      planExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    } = invoiceData;

    if (!userEmail) {
      console.warn("[Email Service] Cannot send invoice email: userEmail is missing.");
      return { success: false, error: "Recipient email is missing" };
    }

    // SMTP Transporter configuration
    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);
    const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER || "ansarisaifuddin732@gmail.com";
    const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS || "";

    let transporter;

    if (smtpPass) {
      transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });
    } else {
      // Fallback transport for development / logging
      transporter = nodemailer.createTransport({
        jsonTransport: true
      });
    }

    const formattedDate = new Date(createdAt).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    const formattedExpiryDate = new Date(planExpiresAt).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    // Premium UI HTML Template with Welcome Banner & Application Branding
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Welcome to Postfly & Official Payment Receipt</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; color: #0f172a; margin: 0; padding: 24px;">
      
      <div style="max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 24px; overflow: hidden; border: 1px solid #cbd5e1; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08);">
        
        <!-- Welcome Hero Banner Header -->
        <div style="background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%); padding: 36px 32px; color: #ffffff;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td>
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                  <div style="width: 42px; height: 42px; background: #ffffff; color: #4f46e5; border-radius: 12px; text-align: center; line-height: 42px; font-weight: 900; font-size: 22px; display: inline-block;">P</div>
                  <span style="font-size: 24px; font-weight: 900; letter-spacing: -0.5px; color: #ffffff; vertical-align: middle; margin-left: 8px;">Postfly Social Automation</span>
                </div>
                <h1 style="font-size: 22px; font-weight: 800; margin: 16px 0 8px 0; color: #ffffff;">🎉 Welcome to Postfly, ${userName}!</h1>
                <p style="font-size: 14px; color: #e0e7ff; margin: 0; line-height: 1.6; font-weight: 500;">
                  Thank you for subscribing to <strong>Postfly Technologies</strong>! Your <strong>${planName}</strong> is now live & fully active.
                </p>
              </td>
            </tr>
          </table>
        </div>

        <!-- Welcome Feature Highlights Callout -->
        <div style="background: #eef2ff; border-bottom: 1px solid #e0e7ff; padding: 20px 32px; font-size: 13px; color: #3730a3; line-height: 1.6;">
          <strong style="color: #1e1b4b; font-size: 14px; display: block; margin-bottom: 6px;">🚀 What's Unlocked in your Postfly Workspace:</strong>
          <ul style="margin: 0; padding-left: 20px; color: #312e81;">
            <li><strong>All Social Channels Connected:</strong> Facebook Pages, Instagram Professional, Threads, YouTube Shorts, X/Twitter, LinkedIn & Pinterest.</li>
            <li><strong>AI Content Generation:</strong> Instant Title, Caption & Hashtag expansion with custom length controls.</li>
            <li><strong>Meta Ads Manager:</strong> Link Ad accounts, create campaigns, and track real-time ROAS & performance.</li>
            <li><strong>ImageKit Media Storage:</strong> Direct CDN media uploads & publishing previews.</li>
          </ul>
        </div>

        <!-- Invoice Receipt Body -->
        <div style="padding: 32px;">
          
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
            <tr>
              <td>
                <h2 style="font-size: 16px; font-weight: 800; color: #0f172a; margin: 0;">Official SaaS Tax Invoice & Receipt</h2>
                <span style="font-size: 12px; color: #64748b;">Postfly Technologies • Tax & Billing Department</span>
              </td>
              <td align="right" valign="top">
                <span style="background: #dcfce7; color: #15803d; border: 1px solid #86efac; padding: 5px 14px; border-radius: 9999px; font-size: 11px; font-weight: 800; display: inline-block;">
                  VERIFIED & PAID ✓
                </span>
                <span style="display: block; font-family: monospace; font-weight: 700; color: #475569; font-size: 13px; margin-top: 6px;">${invoiceId}</span>
              </td>
            </tr>
          </table>

          <!-- Billed To & Payment Meta Grid -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
            <tr>
              <td width="48%" valign="top" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 18px;">
                <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8; display: block; margin-bottom: 6px;">BILLED TO (SUBSCRIBER)</span>
                <div style="font-size: 14px; font-weight: 800; color: #0f172a;">${userName}</div>
                <div style="font-size: 12px; color: #475569; margin-top: 3px;">${userEmail}</div>
                <div style="font-size: 11px; color: #64748b; margin-top: 3px;"><strong>User ID:</strong> ${userId}</div>
                <div style="font-size: 11px; color: #64748b; margin-top: 3px;">${billingAddress}</div>
              </td>
              <td width="4%"></td>
              <td width="48%" valign="top" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 18px;">
                <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8; display: block; margin-bottom: 6px;">PAYMENT METADATA</span>
                <div style="font-size: 11px; color: #475569; margin-top: 3px;"><strong>App Name:</strong> Postfly Platform</div>
                <div style="font-size: 11px; color: #475569; margin-top: 2px;"><strong>Payment ID:</strong> <span style="font-family: monospace; font-weight: 700;">${paymentId}</span></div>
                <div style="font-size: 11px; color: #475569; margin-top: 2px;"><strong>Order ID:</strong> <span style="font-family: monospace;">${orderId}</span></div>
                <div style="font-size: 11px; color: #475569; margin-top: 2px;"><strong>Gateway:</strong> ${paymentMethod}</div>
                <div style="font-size: 11px; color: #475569; margin-top: 2px;"><strong>Payment Date:</strong> ${formattedDate}</div>
                <div style="font-size: 11px; color: #475569; margin-top: 2px;"><strong>Next Renewal:</strong> ${formattedExpiryDate}</div>
              </td>
            </tr>
          </table>

          <!-- Line Items Table -->
          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; border: 1px solid #e2e8f0; border-radius: 14px; overflow: hidden; margin-bottom: 24px;">
            <thead>
              <tr style="background: #f1f5f9; color: #64748b; font-size: 11px; font-weight: 800; text-transform: uppercase;">
                <th style="padding: 14px 16px; text-align: left;">Item Description & License</th>
                <th style="padding: 14px 16px; text-align: right;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 16px; border-bottom: 1px solid #f1f5f9;">
                  <strong style="color: #0f172a; font-size: 14px; display: block;">${planName}</strong>
                  <span style="font-size: 12px; color: #64748b;">${billingCycle === "yearly" ? "12 Months Unlimited License" : "1 Month Recurring SaaS License"}</span>
                </td>
                <td style="padding: 16px; text-align: right; font-weight: bold; color: #0f172a; border-bottom: 1px solid #f1f5f9; font-size: 14px;">₹${originalAmount}</td>
              </tr>
              ${
                discountAmount > 0
                  ? `<tr style="background: #fffbeb;">
                      <td style="padding: 14px 16px; color: #92400e; font-weight: bold; border-bottom: 1px solid #f1f5f9; font-size: 13px;">
                        Promo Discount (${couponCode ? couponCode.toUpperCase() : "PROMO"})
                      </td>
                      <td style="padding: 14px 16px; text-align: right; font-weight: bold; color: #b45309; border-bottom: 1px solid #f1f5f9; font-size: 14px;">
                        -₹${discountAmount}
                      </td>
                    </tr>`
                  : ""
              }
              <tr style="background: #eef2ff;">
                <td style="padding: 18px 16px; font-weight: 900; font-size: 15px; color: #312e81;">Total Amount Charged</td>
                <td style="padding: 18px 16px; text-align: right; font-weight: 900; font-size: 17px; color: #4338ca;">₹${amountPaid}</td>
              </tr>
            </tbody>
          </table>

          <!-- Footer / Support Notice -->
          <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; text-align: center; font-size: 12px; color: #64748b; line-height: 1.5;">
            <p style="margin: 0 0 6px 0;">This tax invoice receipt was automatically sent to <strong>${userEmail}</strong> upon subscription activation.</p>
            <p style="margin: 0; font-weight: 600; color: #334155;">Postfly Technologies Platform • Need help? Contact <a href="mailto:ansarisaifuddin732@gmail.com" style="color: #4f46e5; text-decoration: none;">ansarisaifuddin732@gmail.com</a></p>
          </div>

        </div>

      </div>

    </body>
    </html>
    `;

    const mailOptions = {
      from: `"Postfly Technologies" <${smtpUser}>`,
      to: userEmail,
      subject: `🎉 Welcome to Postfly! Tax Invoice ${invoiceId} - ${planName}`,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email Service] Welcome & Invoice Email ${invoiceId} sent to ${userEmail}:`, info.messageId || "sent via transport");
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error("[Email Service] Exception sending invoice email:", err);
    return { success: false, error: err.message };
  }
}
