import dotenv from 'dotenv'
import { env } from '../env'
// import fs from 'fs'

dotenv.config()

// var privateKEY = fs.readFileSync('./private.key', 'utf8'); // to sign JWT
// var publicKEY = fs.readFileSync('./public.key', 'utf8'); 	// to verify JWT


export default {
    // symmetric 對稱的, 唔安全的!
    // 真正 production 請用 asymmetric (public key/private key)

    privateKEY: env.PRIVATE_KEY.replace(/\\n/g, '\n'),
    publicKEY: env.PUBLIC_KEY.replace(/\\n/g, '\n'),
    jwtSession: {
        session: false
    }
}