import bcrypt from "bcrypt"

// Esta funcion hashea el password que se le pasa como argumento y lo devuelve encriptado
export const hashPassword = async(password: string) => {
// salt es un valor aleatorio que se genera para cada password, esto hace que el hash sea único
// y no se pueda usar una tabla de hash para desencriptar el password
    const salt = await bcrypt.genSalt(10)
    // esta funsion retorna el hash del password, el primer argumento es el password y el segundo es el salt
   return await bcrypt.hash(password, salt)
}


// Esta funcion compara el password que se le pasa como argumento con el hash que se le pasa como argumento
export const checkPassword = async (enteredPassword: string , storedHas: string) => {
return  await bcrypt.compare(enteredPassword, storedHas)
}


