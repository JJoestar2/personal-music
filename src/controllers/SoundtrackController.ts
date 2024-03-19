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
        app.route('/soundtrack')
        .get(async (req: express.Request, res: express.Response) => {
            try {
                const { page, limit } = req.query;
                const result = await this.service.getSoundtracks(Number(page || 1), Number(limit || 10));
                result.success ? res.json(result) : res.status(404).json(result);
            } catch (error) {
                console.error('Error retrieving soundtrack:', error);
                res.status(500).json({ success: false, message: 'Error retrieving soundtrack' });
            }
        })
        .post(async (req: express.Request, res: express.Response) => {
            const { link, categoryId } = req.body;
            try {
                const result = await this.service.createSoundtrack({ link, categoryId });
                if (result.success) {
                    res.json(result);
                } else {
                    res.status(400).json(result);
                }
            } catch (error) {
                console.error('Soundtrack creation failed:', error);
                res.status(500).json({ success: false, message: 'Soundtrack creation failed', data: null });
            }
        })


        app.route('/soundtrack/:id')
        .get(async (req: express.Request, res: express.Response) => {
            const { id } = req.params;
            try {
                const result = await this.service.getSoundtrackById(parseInt(id));
                result.success ? res.json(result) : res.status(404).json(result);
            } catch (error) {
                console.error('Error retrieving soundtrack:', error);
                res.status(500).json({ success: false, message: 'Error retrieving soundtrack' });
            }
        })
        .put(async (req: express.Request, res: express.Response) => {
            const { id } = req.params;
            try {
                const result = await this.service.updateSoundtrack(parseInt(id), req.body);
                result.success ? res.json(result) : res.status(400).json(result);
            } catch (error) {
                console.error('Error updating soundtrack:', error);
                res.status(500).json({ success: false, message: 'Error updating soundtrack' });
            }
        })
        .delete(async (req: express.Request, res: express.Response) => {
            const { id } = req.params;
            try {
                const result = await this.service.deleteSoundtrack(parseInt(id));
                result.success ? res.json(result) : res.status(404).json(result);
            } catch (error) {
                console.error('Error deleting soundtrack:', error);
                res.status(500).json({ success: false, message: 'Error deleting soundtrack' });
            }
        });
    }
}