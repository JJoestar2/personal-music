import 'reflect-metadata';
import {Container} from 'inversify';
import TYPES from './types';
import { RegistrableController } from './controllers/RegistrableController';
import { SoundtrackController } from './controllers/SoundtrackController';
import SoundtrackService, { ISoundtrackService } from './services/SoundtrackService';
import SoundtrackRepository, { ISoundtrackRepository } from './repositories/SoundtrackRepository';

const container = new Container();
container.bind<RegistrableController>(TYPES.Controller).to(SoundtrackController);
container.bind<ISoundtrackService>(TYPES.SoundtrackService).to(SoundtrackService);
container.bind<ISoundtrackRepository>(TYPES.SoundtrackRepository).to(SoundtrackRepository);

export default container;