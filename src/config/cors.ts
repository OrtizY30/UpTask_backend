import { CorsOptions } from "cors";

// export const corsConfig: CorsOptions = {
//     // origin es una funcion que recibe el origen de la peticion y un callback
//     // el callback recibe dos parametros, el primero es un error y el segundo es un booleano
//     // si el origen es permitido, se llama al callback con null y true, si no es permitido, se llama al callback con un error
//   origin: function (origin, callback) {

//     // Si no hay origen, se permite la peticion (esto es para las peticiones desde Postman o Insomnia)
//     // whitelist es un array de origenes permitidos
//     // en este caso, solo se permite el origen de la variable de entorno FRONTEND_URL
//     const whitelist = [process.env.FRONTEND_URL];
   
// //  whiteList.push es una funcion que permite agregar un origen a la lista de origenes permitidos
//     // si el origen es undefined, se permite la peticion (esto es para las peticiones desde Postman o Insomnia)

//     if (process.argv[2] === "--api") {
//       whitelist.push(undefined);
//     }

// // si el origen incluye la variable de entorno FRONTEND_URL, se llama al callback con null y true
//     // si no, se llama al callback con un error
//     if (whitelist.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Error de CORS"));
//     }
//   },
// };

export const corsConfig: CorsOptions = {
  origin: function (origin, callback) {
    const whitelist = [process.env.FRONTEND_URL?.trim()];

    // Permitir peticiones sin origin (Postman, Insomnia, servidores internos, etc)
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Error de CORS"));
    }
  },
   credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

