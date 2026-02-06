export const EMAIL_CONFIG = {
  // EmailJS Configuration
  // Get these from https://www.emailjs.com/
  EMAILJS_PUBLIC_KEY: 'YOUR_PUBLIC_KEY', // Replace with your EmailJS public key
  EMAILJS_SERVICE_ID: 'YOUR_SERVICE_ID', // Replace with your EmailJS service ID  
  EMAILJS_TEMPLATE_ID: 'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
  
  // Email Templates
  OTP_TEMPLATE: {
    subject: '🔐 Your OTP Code - Verification Required',
    from_name: 'Your Project Name'
  },
  
  // OTP Settings
  OTP_EXPIRY_MINUTES: 5,
  OTP_LENGTH: 6
};

// EmailJS Template Variables (for reference)
// Use these variable names in your EmailJS template:
// {{to_email}} - Recipient email
// {{to_name}} - Recipient name  
// {{otp_code}} - Generated OTP
// {{generated_time}} - When OTP was generated
// {{from_name}} - Sender name