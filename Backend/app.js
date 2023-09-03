import express from 'express';
import productRoute from './routes/productRoute.js'

const app = express();

// Using middleware
app.use(express.json());


// Using routes
app.use('/api/v1', productRoute)


export default app