import { Injectable, OnModuleInit } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { createMailTransporter } from './mail.config';

@Injectable()
export class MailService implements OnModuleInit {
    private transporter: nodemailer.Transporter;

    async onModuleInit() {
        this.transporter = await createMailTransporter();
    }

    async sendShareLink(recipientEmail: string, shareLink: string, senderName?: string) {
        const mailOptions = {
            from: process.env.MAIL_FROM || 'noreply@todo-app.com',
            to: recipientEmail,
            subject: 'Shared Todo List',
            html: `
        <h2>Ви отримали доступ до списку задач</h2>
        <p>${senderName ? `${senderName} поділився(-лась) з вами своїм списком задач` : 'Вам поділилися списком задач'}.</p>
        <p>
          <a href="${shareLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Переглянути список
          </a>
        </p>
        <p>Це посилання активне протягом 7 днів.</p>
      `,
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);

          
            if (process.env.MAIL_HOST === 'ethereal') {
                const previewUrl = nodemailer.getTestMessageUrl(info);
                console.log('📧 Preview URL:', previewUrl);
            }

            return info;
        } catch (error) {
            console.error('❌ Помилка при відправленні email:', error);
            throw error;
        }
    }
}
