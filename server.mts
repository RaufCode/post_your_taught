import express, {Request, Response} from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './src /routes/user.routes.mts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


app.use('/api/users', userRoutes);




app.use((req:Request, res:Response) => {
    res.status(404).json({message: 'Route not found'});
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

