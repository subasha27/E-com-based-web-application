import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();


class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // e.g., 'Gmail'
      auth: {
        user: process.env.user as string,
        pass: process.env.pass as string,
      },
    });
  }

  async sendEmail(to: string,subject: string, text: string) {
    const mailOptions = {
      from: process.env.user as string,
      to: to,
      subject: subject,
      text: text,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent: ' + info.response);
    } catch (error) {
      console.error('Email sending failed:', error);
      throw new Error('Failed to send reset email');
    }
  }
}

export default new EmailService();