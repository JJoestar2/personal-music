import { DataSource, EntityRepository, Repository } from 'typeorm';
import { Soundtrack, MusicCollection } from '../entity';
import { injectable } from 'inversify';
import { AppDataSource } from '../data-source';

export interface ICollectionRepository {
    createNewCollection(data: MusicCollection): Promise<MusicCollection>;
    getCollections(): Promise<MusicCollection[]>;
    getCollection(collectionId: number): Promise<MusicCollection | null>;
    deleteCollection(collectionId: number): Promise<void>;
}

@injectable()
export default class CollectionRepository implements ICollectionRepository {

 public async createNewCollection(data: MusicCollection): Promise<MusicCollection> {
    const collectionRepo = AppDataSource.getRepository(MusicCollection);
    const collection = collectionRepo.create({
        ...data,
    });
    await collectionRepo.save(collection);
    return collection;
  }

  public async getCollections(): Promise<MusicCollection[]> {
    const collectionRepo = AppDataSource.getRepository(MusicCollection);
    return await collectionRepo.find({relations: { soundtrack: true }});
  }

  public async getCollection(collectionId: number): Promise<MusicCollection | null> {
    const collectionRepo = AppDataSource.getRepository(MusicCollection);
    return await collectionRepo.findOne({ where: { id: collectionId }, relations: { soundtrack: true }});
  }

  public async deleteCollection(collectionId: number): Promise<void> {
    const collectionRepo = AppDataSource.getRepository(MusicCollection);
    await collectionRepo.delete(collectionId);
  }
}