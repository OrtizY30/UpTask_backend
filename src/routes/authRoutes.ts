import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { authenticate } from "../middleware/auth";

const router = Router();

// Esta ruta se encarga de crear una cuenta de usuario
// Se le pasa el middleware de express-validator para validar los datos que se envian en el body de la peticion
router.post(
  "/create-account",
  body("name").notEmpty().withMessage("El nombre no puede ir vacío"),
  body("password")
    //   verifica que el password tenga al menos 8 caracteres
    .isLength({ min: 8 })
    .withMessage("El password no es seguro, mínimo 8 caracteres"),
  body("password_confirmation").custom((value, { req }) => {
    // chequea si el password y el password_confirmation son iguales
    if (value !== req.body.password) {
      throw new Error("Las contraseñas no coinciden");
    }
    return true;
  }),
  body("email").isEmail().withMessage("El email no es válido"),
  //   handleInputErrors es un middleware que se encarga de manejar los errores de validación
  //   si hay errores, se envía una respuesta con el status 422 y los errores
  handleInputErrors,
  AuthController.createAccount
);

router.post(
  "/confirm-account",
  body("token").notEmpty().withMessage("El Token no puede ir vacío"),
  handleInputErrors,
  AuthController.confirmAccount
);

router.post(
  "/login",
  body("email").isEmail().withMessage("Email incorrecto"),
  body("password").notEmpty().withMessage("La contraseña es obligatoria"),
  handleInputErrors,
  AuthController.login
);

// esta ruta se encarga de enviar un nuevo token al email del usuario
router.post(
  "/request-code",
  body("email").isEmail().withMessage("Email no válido"),
  handleInputErrors,
  AuthController.requestConfirmationCode
);

// esta ruta se encarga de enviar un nuevo token al email del usuario
// se le pasa el email del usuario y se busca en la base de datos si existe un usuario con ese email
router.post(
  "/forgot-password",
  body("email").isEmail().withMessage("Email no válido"),
  handleInputErrors,
  AuthController.forgotPassword
);

// esta ruta se encarga de validar el token que se le pasa por el body de la peticion
// se le pasa el token y se busca en la base de datos si existe un usuario con ese token
router.post(
  "/validate-token",
  body("token").notEmpty().withMessage("El token no puede ir vacío"),
  handleInputErrors,
  AuthController.validateToken
);

// esta ruta se encarga de actualizar la contraseña del usuario
// recibe el token por medio de la url y el password por el body de la peticion
router.post(
  "/update-password/:token",
  param("token").isNumeric().withMessage("Token no válido"),
  body("password")
    //   verifica que el password tenga al menos 8 caracteres
    .isLength({ min: 8 })
    .withMessage("El password no es seguro, mínimo 8 caracteres"),
  body("password_confirmation").custom((value, { req }) => {
    // chequea si el password y el password_confirmation son iguales
    if (value !== req.body.password) {
      throw new Error("Las contraseñas no coinciden");
    }
    return true;
  }),
  handleInputErrors,
  AuthController.updatePasswordWithToken
);

router.get("/user", authenticate, AuthController.user);

// Profile Route

router.put(
  "/profile",
  authenticate,
  body("name").notEmpty().withMessage("El nombre no puede ir vacío"),
  body("email").isEmail().withMessage("El email no es válido"),
  handleInputErrors,
  AuthController.updateProfilel
);

router.post(
  "/update-password",
  authenticate,
  body("current_password")
    .notEmpty()
    .withMessage("El password actual no puede ir vacío"),
  body("password")
    //   verifica que el password tenga al menos 8 caracteres
    .isLength({ min: 8 })
    .withMessage("El password no es seguro, mínimo 8 caracteres"),
  body("password_confirmation").custom((value, { req }) => {
    // chequea si el password y el password_confirmation son iguales
    if (value !== req.body.password) {
      throw new Error("Las contraseñas no coinciden");
    }
    return true;
  }),
  handleInputErrors,
  AuthController.updateCurrentUserPassword
);


router.post('/check-password',
   authenticate,
  body("password")
    .notEmpty()
    .withMessage("El password actual no puede ir vacío"),
    handleInputErrors,
    AuthController.checkPassword
)
export default router;
