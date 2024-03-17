import 'reflect-metadata';
import {Container} from 'inversify';
import TYPES from './types';
import { RegistrableController } from './controllers/RegistrableController';
import { SoundtrackController } from './controllers/SoundtrackController';
import SoundtrackService, { ISoundtrackService } from './services/SoundtrackService';
import SoundtrackRepository, { ISoundtrackRepository } from './repositories/SoundtrackRepository';
import CategoryRepository, { ICategoryRepository } from './repositories/CategoryRepository';
import CollectionRepository, { ICollectionRepository } from './repositories/CollectionRepository';
import CategoryController from './controllers/CategoryController';
import CategoryService, { ICategoryService } from './services/CategoryService';
import CollectionController from './controllers/CollectionController';
import CollectionService, { ICollectionService } from './services/CollectionService';

const container = new Container();

container.bind<RegistrableController>(TYPES.Controller).to(SoundtrackController);
container.bind<RegistrableController>(TYPES.Controller).to(CategoryController);
container.bind<RegistrableController>(TYPES.Controller).to(CollectionController);

container.bind<ISoundtrackService>(TYPES.SoundtrackService).to(SoundtrackService);
container.bind<ICategoryService>(TYPES.CategoryService).to(CategoryService);
container.bind<ICollectionService>(TYPES.CollectionService).to(CollectionService);

container.bind<ISoundtrackRepository>(TYPES.SoundtrackRepository).to(SoundtrackRepository);
container.bind<ICollectionRepository>(TYPES.CollectionRepository).to(CollectionRepository);
container.bind<ICategoryRepository>(TYPES.CategoryRepository).to(CategoryRepository);

export default container;