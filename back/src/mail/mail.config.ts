import * as nodemailer from 'nodemailer';

export async function createMailTransporter() {
  if (process.env.MAIL_HOST === 'ethereal') {
    try {
      const testAccount = await nodemailer.createTestAccount();
      const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log('✅ Ethereal Email configured for testing');
      console.log(`📧 Test credentials: ${testAccount.user}`);
      return transporter;
    } catch (error) {
      console.error('❌ Error initializing Ethereal Email:', error);
      throw error;
    }
  }


  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT),
    secure: process.env.MAIL_SECURE === 'true',
    auth: process.env.MAIL_USER
      ? {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        }
      : undefined,
  });

  console.log(`✅ SMTP configured: ${process.env.MAIL_HOST}:${process.env.MAIL_PORT}`);
  return transporter;
}
