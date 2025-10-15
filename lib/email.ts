import nodemailer from "nodemailer";

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendWelcomeEmail(
  email: string,
  name: string,
  password: string
) {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || "noreply@yourstore.com",
      to: email,
      subject: "Welcome to Our Store - Your Account Details",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to Our Store, ${name}!</h2>
          <p>Thank you for your order! We've created an account for you so you can track your order and manage your future purchases.</p>
          
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Your Login Details:</strong></p>
            <p>Email: <strong>${email}</strong></p>
            <p>Password: <strong>${password}</strong></p>
          </div>
          
          <p style="color: #666;">
            For security reasons, we recommend changing your password after your first login.
          </p>
          
          <p>
            <a href="${process.env.NEXTAUTH_URL}/login" 
               style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Login to Your Account
            </a>
          </p>
          
          <p>If you have any questions, please contact our support team.</p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px;">
            This email was sent because an order was placed with this email address.
            If you didn't place this order, please contact us immediately.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to: ${email}`);
  } catch (error) {
    console.error("❌ Failed to send welcome email:", error);
    // Don't throw error - order should still be created even if email fails
  }
}