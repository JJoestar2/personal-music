import express from 'express';
import { injectable, inject } from 'inversify';
import { RegistrableController } from './RegistrableController';
import TYPES from '../types';
import { Soundtrack } from '../entity';

// todo implement service for working with soundtrack
// add routing for Controller

@injectable()
export class SoundtrackController implements RegistrableController {
    public register(app: express.Application): void {
        
    }
}