import {Container} from 'inversify';
import TYPES from './types';
import { RegistrableController } from './controllers/RegistrableController';
import { SoundtrackController } from './controllers/SoundtrackController';

const container = new Container();
container.bind<RegistrableController>(TYPES.Controller).to(SoundtrackController);

export default container;