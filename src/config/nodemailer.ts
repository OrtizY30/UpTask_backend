import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const config = () => {
    return {
        host: process.env.SMTP_HOST ,
        port: +process.env.SMTP_PORT ,
        auth: {
          user: process.env.SMTP_USER ,
          pass: process.env.SMTP_PASS
        }
    }
}



// Looking to send emails in production? Check out our Email API/SMTP product!
export const transport = nodemailer.createTransport(config());

// Verifica conexión al servidor SMTP
transport.verify((error, success) => {
  if (error) {
    console.error("❌ Error de conexión SMTP:", error);
  } else {
    console.log("✅ Conectado a Mailtrap correctamente");
  }
});