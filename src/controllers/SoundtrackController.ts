import express from 'express';
import { injectable, inject } from 'inversify';
import { RegistrableController } from './RegistrableController';
import TYPES from '../types';
import { Soundtrack } from '../entity';
import SoundtrackService from '../services/SoundtrackService';

@injectable()
export class SoundtrackController implements RegistrableController {
    constructor(@inject(TYPES.SoundtrackService) private service: SoundtrackService) {}

    public register(app: express.Application): void {
        app
        .route('/soundtrack')
        .post(async(req: express.Request, res: express.Response) => {
            const { link, categoryId } = req.body;
            try {
               const soundtrack = await this.service.saveSoundtrack({ link, categoryId });
               res.json(soundtrack); 
            } catch (err) {
                res.json({ 'message': `something wrong: ${err}` });
            }
        })
    }
}