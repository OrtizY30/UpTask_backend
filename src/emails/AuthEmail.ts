import { transport } from "../config/nodemailer";

interface IEmail {
  email: string;
  name: string;
  token: string;
}
export class AuthEmail {
  static sendConfirmationEmail = async (user: IEmail) => {
   const info = await transport.sendMail({
      from: "UpTask <admin@uptask.com>",
      to: user.email,
      subject: "UpTask - Confirma tu cuenta",
      text: "Confirma tu cuenta en UpTask",
      html: `<div style="background-color:#f3f4f6; padding:24px; display:flex; justify-content:center; align-items:center; min-height:100vh;">
    <div style="background-color:#ffffff; padding:32px; border-radius:16px; box-shadow:0 4px 12px rgba(0,0,0,0.05); max-width:480px; width:100%; color:#1f2937; font-family:sans-serif;">
      <h2 style="font-size:24px; text-transform: capitalize; font-weight:bold; color:#4f46e5; margin-bottom:16px;">
        ¡Hola ${user.name} 👋!
      </h2>
      <p style="margin-bottom:8px;">Nos alegra muchísimo tenerte por aquí. ¡Ya casi terminas!</p>
      <p style="margin-bottom:16px;">Para empezar a sacarle todo el jugo a <strong>UpTask</strong>, solo falta un pequeño paso:</p>
      
     <div style="text-align:center; margin:24px 0;">
        <a
          href="${process.env.FRONTEND_URL}/auth/confirm-account"
          style="background-color:#4f46e5; color:white; font-weight:bold; padding:12px 24px; text-decoration:none; border-radius:8px; display:inline-block; min-width:180px; text-align:center;"
        >
          Confirmar mi cuenta ✨
        </a>
      </div>

      <p style="margin-bottom:12px;">Utiliza este código para confirmar tu cuenta:</p>
      <p style="font-size:20px; font-weight:bold; background-color:#eef2ff; color:#4f46e5; padding:12px; border-radius:8px; text-align:center;">
        ${user.token}
      </p>

      <p style="margin-bottom:16px; color:#dc2626; font-weight:600; text-align:center;">
  ⏳ ¡Apresúrate! Este código solo es válido por 10 minutos.
      </p>

      <p style="font-size:12px; text-align:center; color:#6b7280;">¿No creaste esta cuenta? No pasa nada, solo ignora este correo 😊</p>

      <hr style="margin:24px 0; border:none; border-top:1px solid #e5e7eb;" />

      <p style="font-size:12px; color:#9ca3af; text-align:center;">Este mensaje fue enviado con cariño por el equipo de UpTask 💜</p>
    </div>
  </div>`,
    });
    console.log('Mensaje enviado', info.messageId)
  };


  static sendPasswordRestToken = async (user: IEmail) => {
    const info = await transport.sendMail({
       from: "UpTask <admin@uptask.com>",
       to: user.email,
       subject: "UpTask - Reestablece tu password",
       text: "Reestablece tu password en UpTask",
       html: `<div style="background-color:#f3f4f6; padding:24px; display:flex; justify-content:center; align-items:center; min-height:100vh;">
     <div style="background-color:#ffffff; padding:32px; border-radius:16px; box-shadow:0 4px 12px rgba(0,0,0,0.05); max-width:480px; width:100%; color:#1f2937; font-family:sans-serif;">
       <h2 style="font-size:24px; text-transform: capitalize; font-weight:bold; color:#4f46e5; margin-bottom:16px;">
         ¡Hola ${user.name} 👋!
       </h2>
       <p style="margin-bottom:8px;">Haz solicitado reestablecer tu contraseña</p>
       <p style="margin-bottom:16px;">Para reestablecer tu contraseña de <strong>UpTask</strong>, dale al boton de acá abajo:</p>
       
      <div style="text-align:center; margin:24px 0;">
         <a
           href="${process.env.FRONTEND_URL}/auth/new-password"
           style="background-color:#4f46e5; color:white; font-weight:bold; padding:12px 24px; text-decoration:none; border-radius:8px; display:inline-block; min-width:180px; text-align:center;"
         >
           Reestablecer Contraseña
         </a>
       </div>
 
       <p style="margin-bottom:12px;">Utiliza este código para reestablecer tu contraseña:</p>
       <p style="font-size:20px; font-weight:bold; background-color:#eef2ff; color:#4f46e5; padding:12px; border-radius:8px; text-align:center;">
         ${user.token}
       </p>
 
       <p style="margin-bottom:16px; color:#dc2626; font-weight:600; text-align:center;">
   ⏳ ¡Apresúrate! Este código solo es válido por 10 minutos.
       </p>
 
       <p style="font-size:12px; text-align:center; color:#6b7280;">¿No haz solicitado reestablecer tu contraseña? No pasa nada, solo ignora este correo 😊</p>
 
       <hr style="margin:24px 0; border:none; border-top:1px solid #e5e7eb;" />
 
       <p style="font-size:12px; color:#9ca3af; text-align:center;">Este mensaje fue enviado con cariño por el equipo de UpTask 💜</p>
     </div>
   </div>`,
     });
     console.log('Mensaje enviado', info.messageId)
   };
}
