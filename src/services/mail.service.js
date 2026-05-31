import nodemailer from 'nodemailer';

class MailService {
    constructor() {
        this.transporter = null;
    }

    getTransporter() {
        if (this.transporter) return this.transporter;

        if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
            return null;
        }

        this.transporter = nodemailer.createTransport({
            service: process.env.MAIL_SERVICE || 'gmail',
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        return this.transporter;
    }

    async sendPasswordResetEmail(email, resetLink) {
        const transporter = this.getTransporter();

        const html = `
            <h1>Restablecer contraseña</h1>
            <p>El enlace expira en una hora.</p>
            <a href="${resetLink}" style="display:inline-block;padding:12px 18px;background:#0b5;color:#fff;text-decoration:none;border-radius:6px;">
                Restablecer contraseña
            </a>
        `;

        if (!transporter) {
            console.log(`Mail no configurado. Link de recuperacion para ${email}: ${resetLink}`);
            return;
        }

        await transporter.sendMail({
            from: process.env.MAIL_FROM || process.env.MAIL_USER,
            to: email,
            subject: 'Recuperacion de contraseña',
            html
        });
    }
}

export default new MailService();
