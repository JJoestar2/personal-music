import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { AppDataSource } from './data-source';
import { RegistrableController } from './controllers/RegistrableController';
import TYPES from './types';
import container from './inversify.config';
import { createAxiosInstance } from './axiosClient';

dotenv.config();

const PORT = process.env.SRV_PORT || 3000;

const corsOptions = {
    origin: '*'
}

const app: express.Application = express();

export const client = createAxiosInstance({
    headers: {
        'X-RapidAPI-Key': process.env.YOUTUBE_MP3_API_KEY,
        'X-RapidAPI-Host': 'youtube-mp36.p.rapidapi.com'
    }
});

const main = () => {
    app.use(cors(corsOptions));
    app.use(express.json());
    
    // grabs the Controller from IoC container and registers all the endpoints
    const controllers: RegistrableController[] = container.getAll<RegistrableController>(TYPES.Controller);
    controllers.forEach(controller => controller.register(app));
    
    AppDataSource.initialize()
        .then(() => console.log('started db'))
        .catch((error) => console.log(error))
    
    app.use(function (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) {
        res.status(500).send('Internal Server Error');
    });
        
    
    app.listen(PORT, () => console.log(`Server running at: ${PORT}`));
};

main();
