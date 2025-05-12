import jwt from 'jsonwebtoken'
import { Types } from 'mongoose'

type UserPayload = {
    id: Types.ObjectId
}
export const generateJWT = (payload : UserPayload) => {
    const data = {
        name: 'juan',
        credict_card: '1234567890',
        password: 'password'    
    }

const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '1d', // El token expira en un dia 
} )
return token
}
 





