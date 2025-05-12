
import mongoose, { Schema, Document, Types} from "mongoose";


export interface IToken extends Document  {
    token: string,
    user: Types.ObjectId,
    createAt: string
}

const tokenSchema : Schema = new Schema({
token: {
    type: String,
    required: true,

},
user: {
    type: String,
    ref: 'User'
},
// createAt es la fecha en la que se crea el token, y se le asigna un valor por defecto de la fecha actual
// y se le asigna un tiempo de expiracion de 10 minutos, es decir, el token expirara en 10 minutos
expiresAt: {
    type: Date,
    default: Date.now(),
    expires: '10m' // el token expirara en 10 minutos
    
}

})

const Token = mongoose.model<IToken>("Token", tokenSchema)
export default Token



