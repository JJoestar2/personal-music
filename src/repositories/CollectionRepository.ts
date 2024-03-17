import { MusicCollection, Soundtrack } from '../entity';
import { injectable } from 'inversify';
import { AppDataSource } from '../data-source';

export type CollectionData = {
  name: string;
  poster?: string;
}

type CollectionResponse = {
  success: boolean;
  message?: string;
  collection?: MusicCollection | MusicCollection[] | null
};

export interface ICollectionRepository {
  findAll(): Promise<CollectionResponse>;
  findById(collectionId: number): Promise<CollectionResponse>;
  createCollection(data: { name: string, poster: string }): Promise<CollectionResponse>;
  addSoundtrackToCollection(collectionId: number, soundtrackId: number): Promise<CollectionResponse>;
  removeSoundtrackFromCollection(collectionId: number, soundtrackId: number): Promise<CollectionResponse>;
  updateCollection(id: number, collectionData: Partial<MusicCollection>): Promise<CollectionResponse>;
  deleteCollection(collectionId: number): Promise<CollectionResponse>;
}

@injectable()
export default class CollectionRepository implements ICollectionRepository {
  public async findAll(): Promise<CollectionResponse> {
    try {
      const collectionRepo = AppDataSource.getRepository(MusicCollection);
      return { success: true, collection: await collectionRepo.find({ relations: ['soundtracks'] }) };
    } catch (err) {
      return { success: false, message: 'Error fetching collections' };
    }
  }

  public async findById(collectionId: number): Promise<CollectionResponse> {
    try {
      const collectionRepo = AppDataSource.getRepository(MusicCollection);
      const collection = await collectionRepo.findOne({
        where: { id: collectionId },
        relations: ['soundtracks'],
      });

      if (!collection) return { success: false, message: `Collection not found` };

      return { success: true, collection };
    } catch (err) {
      return { success: false, message: `Error fetching collection by id: ${collectionId}` };
    }
  }

  public async createCollection(collectionData: Partial<MusicCollection>): Promise<CollectionResponse> {
    try {
      const collectionRepo = AppDataSource.getRepository(MusicCollection);
      const collection = collectionRepo.create(collectionData);
      await collectionRepo.save(collection);
      return { success: true,  message: 'Successfully created collection', collection };
    } catch (err) {
      return { success: false, message: 'Error of creating collection' };
    }
  }

  public async updateCollection(id: number, collectionData: Partial<MusicCollection>): Promise<CollectionResponse> {
    try {
      const collectionRepo = AppDataSource.getRepository(MusicCollection);
      const collection = await collectionRepo.findOne({ where: { id: id }});
      if (!collection) {
        return { success: false };
      };
      await collectionRepo.save({ ...collection, ...collectionData });
      return { success: true, message: 'Updated collection', collection: await collectionRepo.findOne({ where: { id: id }}) };
    } catch (err) {
      console.error(`Error updating collection by id ${id}:`, err);
      return { success: false, message: 'Error updating collection' };
    }
  }

  public async addSoundtrackToCollection(collectionId: number, soundtrackId: number): Promise<CollectionResponse> {
    try {
      const collectionRepo = AppDataSource.getRepository(MusicCollection);
      const soundtrackRepository = AppDataSource.getRepository(Soundtrack);

      const collection = await collectionRepo.findOne({
        where: { id: collectionId },
        relations: ['soundtracks']
      });
      const soundtrack = await soundtrackRepository.findOneBy({ id: soundtrackId });

      if (!collection) {
        return { success: false, message: 'Collection not found' };
      }
      if (!soundtrack) {
        return { success: false, message: 'Soundtrack not found' };
      }

      collection.soundtracks.push(soundtrack);
      await collectionRepo.save(collection);
      return { success: true, message: 'Soundtrack added to collection successfully' };
    } catch (error) {
      console.error('Error adding soundtrack to collection:', error);
      return { success: false, message: 'Failed to add soundtrack to collection' };
    }
  }

  public async removeSoundtrackFromCollection(collectionId: number, soundtrackId: number): Promise<CollectionResponse> {
    try {
      const collectionRepo = AppDataSource.getRepository(MusicCollection);
      const collection = await collectionRepo.findOne({
        where: { id: collectionId },
        relations: ['soundtracks']
      });
      if (!collection) {
        return { success: false, message: 'Collection not found' };
      }

      const soundtrackExists = collection.soundtracks.some(s => s.id === soundtrackId);
      if (!soundtrackExists) {
        return { success: false, message: 'Soundtrack not found in collection' };
      }

      collection.soundtracks = collection.soundtracks.filter(s => s.id !== soundtrackId);
      await collectionRepo.save(collection);
      return { success: true, message: 'Soundtrack removed from collection successfully' };
    } catch (error) {
      console.error('Error removing soundtrack from collection:', error);
      return { success: false, message: 'Failed to remove soundtrack from collection' };
    }
  }

  public async deleteCollection(collectionId: number): Promise<CollectionResponse> {
    try {
      const collectionRepo = AppDataSource.getRepository(MusicCollection);
      const deletedResponse = await collectionRepo.delete(collectionId);
      if (deletedResponse.affected === 0) {
        return { success: false, message: 'Collection not found' };
      }
      return { success: true, message: 'Successfully deleted' };
    } catch (err) {
      return { success: false, message: 'Error deleting collection' };
    }
  }
}