import type { Request, Response } from "express";
import User from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";
import { generateToken } from "../utils/token";
import Token from "../models/Token";
import { AuthEmail } from "../emails/AuthEmail";
import { generateJWT } from "../utils/jwt";

export class AuthController {
  // esta clase se encarga de manejar las peticiones relacionadas a la autenticacion de usuarios
  // en este caso, se encarga de crear una cuenta de usuario, confirmar la cuenta y logear al usuario
  static createAccount = async (req: Request, res: Response) => {
    try {
      // se extraen los datos del body de la peticion, en este caso el password e email
      const { password, email } = req.body;

      //   Prevenir duplicados de email
      const userExists = await User.findOne({ email });
      if (userExists) {
        const error = new Error("Email ya registrado");
        res.status(409).json({ error: error.message });
        return;
      }
      //   user es una instancia de la clase User, que es un modelo de mongoose
      const user = new User(req.body);

      //   hashea el password que se le pasa como argumento y lo devuelve encriptado
      user.password = await hashPassword(password);

      //   genera un token para el usuario, que se usara para confirmar la cuenta
      const token = new Token();
      token.token = generateToken();
      token.user = user.id;

      AuthEmail.sendConfirmationEmail({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      //   luego de hashear el password, se guarda el usuario en la base de datos
      //   y se guarda el token en la base de datos
      //   se usa Promise.allSettled es nativo de javascript y no debe ser importado para guardar ambos objetos en la base de datos al mismo timepo

      await Promise.allSettled([user.save(), token.save()]);

      res.send("Cuenta creada, revisa tu email para confirmarla");
    } catch (error) {
      console.error("Error en createAccount:", error); // 👈 esto imprime el error real
      // si hay un error, se envia una respuesta con el status 500 y el error
      res.status(500).json({ error: "Error al crear la cuenta" });
    }
  };

  //   esta funcion se encarga de confirmar la cuenta del usuario, se le pasa el token que se le envio al email
  //   si el token es valido, se busca el usuario al que pertenece el token y se le cambia el estado de confirmed a true
  //   si el token no es valido, se lanza un error
  //   si el token es valido, se elimina el token de la base de datos y se le envia un mensaje al usuario confirmando su cuenta
  //   si el token no existe, se lanza un error
  static confirmAccount = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      // esta consulta busca el token en la base de datos, si no existe, se lanza un error
      const tokenExists = await Token.findOne({ token });
      if (!tokenExists) {
        const error = new Error("Token no válido");
        res.status(404).json({ error: error.message });
        return;
      }

      // si el token existe, se busca el usuario al que pertenece el token
      const user = await User.findById(tokenExists.user);
      user.confirmed = true;

      await Promise.allSettled([user.save(), tokenExists.deleteOne()]);

      res.send("Felicidades, tu cuenta ha sido confirmada exitosamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  //   esta funcion se encarga de logear al usuario, se le pasa el email y el password
  //   si el email y el password son correctos, se le envia un mensaje de login exitoso
  //   si el email o el password son incorrectos, se lanza un error
  //   si el usuario no ha confirmado su cuenta, se lanza un error
  //   si el usuario no existe, se lanza un error
  static login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        const error = new Error("Usuario incorrecto");
        res.status(404).json({ error: error.message });
        return;
      }

      // si el usuario no ha confirmado su cuenta, se le genera un nuevo token y se le envia un email para confirmar la cuenta
      if (!user.confirmed) {
        // Elimina tokens anteriores del usuario
        await Token.deleteMany({ user: user.id });

        const token = new Token();
        token.user = user.id;
        token.token = generateToken();

        // se guarda el token en la base de datos
        await token.save();

        // se le envia un email al usuario con el token para confirmar la cuenta
        AuthEmail.sendConfirmationEmail({
          email: user.email,
          name: user.name,
          token: token.token,
        });

        const error = new Error(
          "Tu cuenta no ha sido confirmada, te hemos enviado un email de confirmación."
        );
        res.status(404).json({ error: error.message });
        return;
      }

      //   Revisar si el password recibido del body es igual al password guardado en la base de datos por medio de la funcion checkPassword que valida el password hashaedo
      const isPasswordCurrect = await checkPassword(password, user.password);

      if (!isPasswordCurrect) {
        const error = new Error("La contraseña es incorrecta.");
        res.status(401).json({ error: error.message });
        return;
      }
      const token = generateJWT({ id: user.id });

      res.send(token);
    } catch (error) {
      console.error("Error en login:", error); // 👈 esto imprime el error real
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  // esta funcion se encarga de reenviar un nuevo codigo de confirmacion al email del usuario
  // se le pasa el email del usuario y se busca en la base de datos si existe un usuario con ese email
  // si existe, se le genera un nuevo token y se le envia un email para confirmar la cuenta
  static requestConfirmationCode = async (req: Request, res: Response) => {
    try {
      // se extraen los datos del body de la peticion, en este caso el password e email
      const { email } = req.body;

      //   verifica si el email existe en la base de datos
      const user = await User.findOne({ email });

      //   si el email no existe, se lanza un error
      if (!user) {
        const error = new Error("El usuario no esta registrado");
        res.status(404).json({ error: error.message });
        return;
      }

      if (user.confirmed) {
        const error = new Error("El usuario ya ha confirmado su cuenta");
        res.status(403).json({ error: error.message });
        return;
      }
      // Elimina tokens anteriores del usuario
      await Token.deleteMany({ user: user.id });

      //   genera un token para el usuario, que se usara para confirmar la cuenta
      const token = new Token();
      token.token = generateToken();
      token.user = user.id;

      AuthEmail.sendConfirmationEmail({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      // Se guarda el token en la base de datos
      await token.save();

      res.send("Se ha enviado un nuevo token de confirmación a tu email");
    } catch (error) {
      console.error("Error en createAccount:", error); // 👈 esto imprime el error real
      // si hay un error, se envia una respuesta con el status 500 y el error
      res.status(500).json({ error: "Error al crear la cuenta" });
    }
  };

  static forgotPassword = async (req: Request, res: Response) => {
    try {
      // se extraen los datos del body de la peticion, en este caso el password e email
      const { email } = req.body;

      //   verifica si el email existe en la base de datos
      const user = await User.findOne({ email });

      //   si el email no existe, se lanza un error
      if (!user) {
        const error = new Error("El usuario no esta registrado");
        res.status(404).json({ error: error.message });
        return;
      }

      // Elimina tokens anteriores del usuario
      await Token.deleteMany({ user: user.id });

      //   genera un token para el usuario, que se usara para confirmar la cuenta
      const token = new Token();
      token.token = generateToken();
      token.user = user.id;

      AuthEmail.sendPasswordRestToken({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      // Se guarda el token en la base de datos
      await token.save();

      res.send("Se ha enviado un nuevo token de confirmación a tu email");
    } catch (error) {
      console.error("Error en createAccount:", error); // 👈 esto imprime el error real
      // si hay un error, se envia una respuesta con el status 500 y el error
      res.status(500).json({ error: "Error al crear la cuenta" });
    }
  };

  static validateToken = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      // esta consulta busca el token en la base de datos, si no existe, se lanza un error
      const tokenExists = await Token.findOne({ token });
      if (!tokenExists) {
        const error = new Error("Token no válido");
        res.status(404).json({ error: error.message });
        return;
      }

      res.send("Token válido, define tu nueva contraseña");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static updatePasswordWithToken = async (req: Request, res: Response) => {
    try {
      const { token } = req.params;

      const { password } = req.body;
      // esta consulta busca el token en la base de datos, si no existe, se lanza un error
      const tokenExists = await Token.findOne({ token });
      if (!tokenExists) {
        const error = new Error("Token no válido");
        res.status(404).json({ error: error.message });
        return;
      }

      // si el token existe, se busca el usuario al que pertenece el token
      const user = await User.findById(tokenExists.user);

      user.password = await hashPassword(password);

      await Promise.allSettled([user.save(), tokenExists.deleteOne()]);

      res.send("Contraseña actualizada correctamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static user = async (req: Request, res: Response) => {
    res.json(req.user);
    return;
  };

  static updateProfilel = async (req: Request, res: Response) => {
    const { name, email } = req.body;

    const userExist = await User.findOne({ email });
    if (userExist && userExist.id.toString() !== req.user.id.toString()) {
      const error = new Error("Email no disponible");
      res.status(409).json({ error: error.message });
      return;
    }
    req.user.name = name;
    req.user.email = email;

    try {
      await req.user.save();
      res.send("Perfil actualizado correctamente");
    } catch (error) {
      res.status(500).send("Hubo un error");
    }
  };

  static updateCurrentUserPassword = async (req: Request, res: Response) => {
    const { current_password, password } = req.body;

    const user = await User.findById(req.user.id);
    const isPasswordCorrect = await checkPassword(
      current_password,
      user.password
    );

    if (!isPasswordCorrect) {
      const error = new Error("La contraseña actual es incorrecta");
      res.status(401).json({ error: error.message });
      return;
    }

    try {
      user.password = await hashPassword(password);
      await user.save();
      res.send("Contraseña actualizada correctamente");
    } catch (error) {
      res.status(500).send("Hubo un error");
    }
  };


    static checkPassword = async (req: Request, res: Response) => {
 const { password } = req.body;

  const user = await User.findById(req.user.id);
  const isPasswordCorrect = await checkPassword(password, user.password)
  if(!isPasswordCorrect) {
     const error = new Error("La contraseña es incorrecta");
      res.status(401).json({ error: error.message });
      return;
  }
  res.send('Contraseña correcta')
    }

}
