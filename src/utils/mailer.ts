import nodemailer from 'nodemailer';
import { mailInterafce } from '../types/interfaces';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    auth: {
        user: 'tometo12341@gmail.com',
        pass: process.env.SENDER_PASS
    },
})

export async function sendMail(toMail: string, subject: string, text: string, message: string) {
  try {
  const info = await transporter.sendMail({
          from: process.env.SENDER_EMAIL, 
          to: toMail, 
          subject: subject, 
          html: `${text}, ${message}`
  })
    console.log(`Message sent: ${toMail}`);
  } catch (e) {
    console.log(e);
  }
}

export async function sendMailWithAttachment(toMail: string, subject: string, text: string, message: string) {
    try {
    const info = await transporter.sendMail({
            from: process.env.SENDER_EMAIL, 
            to: toMail, 
            subject: subject, 
            html: `${message}`,
            attachments: [
              {
                  filename: `${text}`,
                  path: `${text}`,
              }
          ]
    })
      console.log(`Message sent: ${toMail}`);
    } catch (e) {
      console.log(e);
    }
}