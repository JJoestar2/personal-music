import express from 'express';
import { injectable, inject } from "inversify";
import { RegistrableController } from "./RegistrableController";
import CollectionService from '../services/CollectionService';
import TYPES from '../types';

@injectable()
class CollectionController implements RegistrableController {
    constructor(@inject(TYPES.CollectionService) private service: CollectionService) {}

    public register(app: express.Application): void {
        app.route('/collection')
        .get(async (req: express.Request, res: express.Response) => {
            try {
                const result = await this.service.findAll();
                result.success ? res.json(result) : res.status(404).json(result);
            } catch (error) {
                console.error('Error getting collections:', error);
                res.status(500).json({ success: false, message: 'Error getting collections' });
            }
        })
        .post(async (req: express.Request, res: express.Response) => {
            const { name, poster } = req.body;
            try {
                const result = await this.service.createCollection({ name, poster });
                result.success ? res.status(201).json(result) : res.status(400).json(result);
            } catch (error) {
                console.error('Error adding collection:', error);
                res.status(500).json({ success: false, message: 'Error adding collection' });
            }
        });

        app.route('/collection/:id')
            .get(async (req: express.Request, res: express.Response) => {
                const { id } = req.params;
                try {
                    const result = await this.service.findById(parseInt(id));
                    result.success ? res.json(result) : res.status(404).json(result);
                } catch (error) {
                    console.error('Error retrieving collection:', error);
                    res.status(500).json({ success: false, message: 'Error retrieving collection' });
                }
            })
            .put(async (req: express.Request, res: express.Response) => {
                const { id } = req.params;
                const collectionData = req.body;
                try {
                    const result = await this.service.updateCollection(parseInt(id), collectionData);
                    result.success ? res.json(result) : res.status(400).json(result);
                } catch (error) {
                    console.error('Error updating collection:', error);
                    res.status(500).json({ success: false, message: 'Error updating collection' });
                }
            })
            .delete(async (req: express.Request, res: express.Response) => {
                const { id } = req.params;
                try {
                    const result = await this.service.deleteCollection(parseInt(id));
                    result.success ? res.json(result) : res.status(404).json(result);
                } catch (error) {
                    console.error('Error deleting collection:', error);
                    res.status(500).json({ success: false, message: 'Error deleting collection' });
                }
            });

        app.route('/collection/:collectionId/soundtrack/:soundtrackId')
            .put(async (req: express.Request, res: express.Response) => {
                const { collectionId, soundtrackId } = req.params;
                try {
                    const result = await this.service.addSoundtrackToCollection(parseInt(collectionId), parseInt(soundtrackId));
                    if (result.success) {
                        res.json(result);
                    } else {
                        res.status(400).json(result);
                    }
                } catch (error) {
                    console.error('Adding soundtrack to collection failed:', error);
                    res.status(500).json({ success: false, message: 'Adding soundtrack to collection failed', data: null });
                }
            })
            .delete(async (req: express.Request, res: express.Response) => {
                const { collectionId, soundtrackId } = req.params;
                try {
                    const result = await this.service.removeSoundtrackFromCollection(parseInt(collectionId), parseInt(soundtrackId));
                    if (result.success) {
                        res.json(result);
                    } else {
                        res.status(400).json(result);
                    }
                } catch (error) {
                    console.error('Removing soundtrack from collection failed:', error);
                    res.status(500).json({ success: false, message: 'Removing soundtrack from collection failed', data: null });
                }
            });

    }
}

export default CollectionController;