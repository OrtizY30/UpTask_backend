import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './config/db';
import cors from 'cors'
import morgan from 'morgan'
import authRoutes from './routes/authRoutes'
import projectRoutes from './routes/projectRoutes'
import { corsConfig } from './config/cors';

dotenv.config()

connectDB()

const app = express();
app.use(cors(corsConfig))

// Logging
app.use(morgan('dev'))

// Middlewares que permite la lectura de req.body
app.use(express.json())


// Routes

app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)


export default app
