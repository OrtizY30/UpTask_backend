// Esta función genera un token aleatorio de 6 dígitos
export const generateToken = () => Math.floor(100000 + Math.random() * 900000).toString();