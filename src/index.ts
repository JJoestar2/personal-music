import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { AppDataSource } from './data-source';

dotenv.config();

const PORT = process.env.SRV_PORT || 3000;

const corsOptions = {
    origin: '*'
}

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send({ message: 'Runnig' });
});

app.listen(PORT, () => console.log(`Server running at: ${PORT}`));

AppDataSource.initialize()
    .then(() => console.log('started db'))
    .catch((error) => console.log(error))
