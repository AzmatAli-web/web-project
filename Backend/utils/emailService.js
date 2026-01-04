const nodemailer = require('nodemailer');

// Configure Nodemailer transporter
// Using Gmail with app-specific password for development
// For production, use environment variables with your email service
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-app-password'
  }
});

// Fallback to Ethereal (test) service if Gmail credentials not available
const getTransporter = async () => {
  try {
    // Try to verify Gmail connection
    await transporter.verify();
    return transporter;
  } catch (error) {
    console.warn('Gmail credentials not configured, using test email service...');
    // Use Ethereal test email for development
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
  }
};

// Send verification email
const sendVerificationEmail = async (email, token, userName) => {
  try {
    const emailTransporter = await getTransporter();
    
    // Build verification URL - adjust based on your frontend URL
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${token}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@campusmarketplace.com',
      to: email,
      subject: '📧 Verify Your Campus Marketplace Email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
          <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h2 style="color: #667eea; margin-bottom: 20px;">Welcome to Campus Marketplace, ${userName}! 🎓</h2>
            
            <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Thank you for signing up! To complete your registration and start buying and selling on Campus Marketplace, 
              please verify your email address.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="display: inline-block; padding: 12px 30px; background-color: #667eea; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
                Verify Email Address
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-bottom: 15px;">
              Or copy and paste this link in your browser:
            </p>
            <p style="color: #667eea; word-break: break-all; background-color: #f0f0f0; padding: 10px; border-radius: 5px;">
              ${verificationUrl}
            </p>
            
            <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px;">
              This verification link will expire in 24 hours. If you didn't create this account, please ignore this email.
            </p>
            
            <p style="color: #999; font-size: 12px; margin-top: 10px;">
              Best regards,<br>
              Campus Marketplace Team 🏫
            </p>
          </div>
        </div>
      `,
      text: `Verify your email at: ${verificationUrl}`
    };

    const info = await emailTransporter.sendMail(mailOptions);
    console.log('✅ Verification email sent:', info.messageId);
    
    // Log test email URL if using Ethereal
    if (info.response?.includes('250')) {
      console.log('📧 Test email URL:', nodemailer.getTestMessageUrl(info));
    }
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
};

// Send resend verification email
const sendResendVerificationEmail = async (email, token, userName) => {
  return sendVerificationEmail(email, token, userName);
};

// Send password reset email
const sendPasswordResetEmail = async (email, token, userName) => {
  try {
    const emailTransporter = await getTransporter();
    
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@campusmarketplace.com',
      to: email,
      subject: '🔐 Reset Your Campus Marketplace Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h2 style="color: #667eea; margin-bottom: 20px;">Password Reset Request</h2>
            <p style="color: #333; font-size: 16px; margin-bottom: 20px;">
              Hi ${userName}, we received a request to reset your password. Click the button below to create a new password.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="display: inline-block; padding: 12px 30px; background-color: #667eea; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Reset Password
              </a>
            </div>
            <p style="color: #999; font-size: 12px; margin-top: 30px;">
              This link will expire in 1 hour. If you didn't request this, please ignore this email.
            </p>
          </div>
        </div>
      `
    };

    const info = await emailTransporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

module.exports = {
  sendVerificationEmail,
  sendResendVerificationEmail,
  sendPasswordResetEmail
};
