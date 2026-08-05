const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendResetPasswordEmail(email, resetToken, userName) {
    try {
      const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

      const htmlContent = `
        <h2>Solicitação de Reset de Senha</h2>
        <p>Olá ${userName},</p>
        <p>Você solicitou um reset de senha. Clique no link abaixo para redefinir sua senha:</p>
        <p><a href="${resetLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Resetar Senha
        </a></p>
        <p>Este link expira em 1 hora.</p>
        <p>Se você não solicitou este reset, ignore este e-mail.</p>
        <hr>
        <p><small>Sistema de Autenticação com JWT</small></p>
      `;

      const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: email,
        subject: '🔑 Reset de Senha - Login System JWT',
        html: htmlContent,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Email de reset enviado para ${email}`);
      return true;
    } catch (error) {
      console.error('❌ Erro ao enviar email:', error.message);
      throw error;
    }
  }

  async sendWelcomeEmail(email, userName) {
    try {
      const htmlContent = `
        <h2>Bem-vindo ao Sistema de Login!</h2>
        <p>Olá ${userName},</p>
        <p>Sua conta foi criada com sucesso! 🎉</p>
        <p>Você agora pode fazer login com suas credenciais.</p>
        <hr>
        <p><small>Sistema de Autenticação com JWT</small></p>
      `;

      const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: email,
        subject: '👋 Bem-vindo ao Sistema de Login!',
        html: htmlContent,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Email de boas-vindas enviado para ${email}`);
      return true;
    } catch (error) {
      console.error('❌ Erro ao enviar email de boas-vindas:', error.message);
      throw error;
    }
  }
}

module.exports = new EmailService();
