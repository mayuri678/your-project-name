import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SmtpEmailService {

  // SMTP configuration for Gmail
  private smtpConfig = {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'your-email@gmail.com', // Your Gmail address
      pass: 'your-app-password'     // Your Gmail App Password
    }
  };

  // Send email using EmailJS (free service)
  async sendEmailViaEmailJS(to: string, subject: string, htmlContent: string, textContent: string): Promise<boolean> {
    try {
      // EmailJS configuration
      const serviceId = 'your_service_id';
      const templateId = 'your_template_id';
      const publicKey = 'your_public_key';

      const templateParams = {
        to_email: to,
        subject: subject,
        html_content: htmlContent,
        text_content: textContent,
        from_name: 'Your Project Name'
      };

      // Load EmailJS if not already loaded
      if (!(window as any).emailjs) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
        document.head.appendChild(script);
        
        await new Promise((resolve) => {
          script.onload = resolve;
        });
        
        (window as any).emailjs.init(publicKey);
      }

      const response = await (window as any).emailjs.send(serviceId, templateId, templateParams);
      console.log('✅ Email sent successfully via EmailJS:', response);
      return true;
    } catch (error) {
      console.error('❌ Failed to send email via EmailJS:', error);
      return false;
    }
  }

  // Send OTP email using multiple methods
  async sendOTPEmail(userEmail: string, otp: string, userName?: string): Promise<{ success: boolean, method: string }> {
    const displayName = userName || userEmail.split('@')[0];
    
    // HTML content for email
    const htmlContent = this.generateOTPEmailHTML(userEmail, otp, userName);
    
    // Text content for email
    const textContent = `Hello ${displayName},

Your One-Time Password (OTP) for account verification is: ${otp}

⏰ This OTP will expire in 5 minutes

🔒 Security Notice:
• Do not share this OTP with anyone
• Use this OTP only on the official website
• If you didn't request this OTP, please ignore this email

Generated at: ${new Date().toLocaleString()}

This is an automated message from Your Project Name.
© 2024 Your Project Name. All rights reserved.`;

    const subject = '🔐 Your OTP Code - Verification Required';

    // Try EmailJS first
    try {
      const emailJSSuccess = await this.sendEmailViaEmailJS(userEmail, subject, htmlContent, textContent);
      if (emailJSSuccess) {
        return { success: true, method: 'EmailJS' };
      }
    } catch (error) {
      console.log('EmailJS failed, trying mailto...');
    }

    // Fallback to mailto
    try {
      const mailtoSuccess = await this.sendViaMailto(userEmail, subject, textContent, htmlContent);
      return { success: mailtoSuccess, method: 'Mailto' };
    } catch (error) {
      console.error('All email methods failed:', error);
      return { success: false, method: 'None' };
    }
  }

  // Send via mailto (opens user's email client)
  private async sendViaMailto(to: string, subject: string, textContent: string, htmlContent: string): Promise<boolean> {
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(textContent);
    
    const mailtoLink = `mailto:${to}?subject=${encodedSubject}&body=${encodedBody}`;
    
    // Open email client
    window.open(mailtoLink, '_blank');
    
    // Show preview window
    const emailWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
    
    if (emailWindow) {
      emailWindow.document.write(htmlContent);
      emailWindow.document.close();
      emailWindow.document.title = 'OTP Email Preview';
    }
    
    console.log('📧 EMAIL OPENED IN CLIENT');
    console.log('📧 TO:', to);
    console.log('📧 SUBJECT:', subject);
    console.log('📧 MAILTO LINK:', mailtoLink);
    
    return true;
  }

  // Generate OTP email HTML
  private generateOTPEmailHTML(userEmail: string, otp: string, userName?: string): string {
    const displayName = userName || userEmail.split('@')[0];
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your OTP Code - Your Project Name</title>
    <style>
        body { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background: white; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 28px; }
        .content { padding: 40px 30px; text-align: center; }
        .content h2 { color: #333; margin: 0 0 20px 0; }
        .content p { color: #666; line-height: 1.6; margin: 0 0 20px 0; }
        .otp-box { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 20px; border-radius: 10px; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 30px 0; display: inline-block; }
        .warning { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 5px; color: #92400e; margin: 20px 0; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px; }
        .timer { background: #fee2e2; border: 1px solid #fca5a5; padding: 10px; border-radius: 5px; color: #991b1b; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔐 Your OTP Code</h1>
        </div>
        
        <div class="content">
            <h2>Hello ${displayName},</h2>
            
            <p>Your One-Time Password (OTP) for account verification is:</p>
            
            <div class="otp-box">
                ${otp}
            </div>
            
            <div class="timer">
                ⏰ This OTP will expire in <strong>5 minutes</strong>
            </div>
            
            <div class="warning">
                <strong>🔒 Security Notice:</strong><br>
                • Do not share this OTP with anyone<br>
                • Use this OTP only on the official website<br>
                • If you didn't request this OTP, please ignore this email
            </div>
            
            <p>Enter this OTP on the verification page to complete your action.</p>
            
            <p>Generated at: <strong>${new Date().toLocaleString()}</strong></p>
        </div>
        
        <div class="footer">
            <p>This is an automated message from Your Project Name</p>
            <p>For security reasons, please do not reply to this email.</p>
            <p>© 2024 Your Project Name. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
  }

  // Setup instructions for Gmail SMTP
  getGmailSetupInstructions(): string {
    return `
📧 Gmail SMTP Setup Instructions:

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Copy the 16-character password

3. Update SMTP configuration in this service:
   - Replace 'your-email@gmail.com' with your Gmail address
   - Replace 'your-app-password' with the generated app password

4. For EmailJS setup:
   - Go to https://www.emailjs.com/
   - Create free account
   - Get Service ID, Template ID, and Public Key
   - Update the configuration in sendEmailViaEmailJS method

⚠️ Security Note: Never commit real credentials to version control!
Use environment variables for production.
`;
  }
}