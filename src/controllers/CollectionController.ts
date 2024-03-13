import express from 'express';
import { injectable, inject } from "inversify";
import { RegistrableController } from "./RegistrableController";

@injectable()
class CollectionController implements RegistrableController {
    public register(app: express.Application): void {
        app
        .route('/collection')
        .post(async(req: express.Request, res: express.Response) => {
            // todo add saving logic 
        })
    }
}

export default CollectionController;