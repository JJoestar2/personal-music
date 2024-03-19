import { injectable, inject } from 'inversify';
import CollectionRepository from '../repositories/CollectionRepository';
import { MusicCollection } from '../entity';
import TYPES from '../types';

interface IServiceResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
}  

export interface ICollectionService {
    findAll(page: number, limit: number): Promise<IServiceResponse<MusicCollection[]>>;
    findById(id: number): Promise<IServiceResponse<MusicCollection>>;
    createCollection(collectionData: Partial<MusicCollection>): Promise<IServiceResponse<MusicCollection>>;
    updateCollection(id: number, collectionData: Partial<MusicCollection>): Promise<IServiceResponse<MusicCollection | null>>;
    addSoundtrackToCollection(collectionId: number, soundtrackId: number): Promise<IServiceResponse<null>>;
    removeSoundtrackFromCollection(collectionId: number, soundtrackId: number): Promise<IServiceResponse<null>>;
    deleteCollection(id: number): Promise<IServiceResponse<null>>;
}

@injectable()
export default class CollectionService implements ICollectionService {
    constructor(@inject(TYPES.CollectionRepository) private repository: CollectionRepository) {}

  public async findAll(page: number = 1, limit: number = 10): Promise<IServiceResponse<MusicCollection[]>> {
    try {
      const collections = await this.repository.findAll(page, limit);
      return { ...collections };
    } catch (error) {
      console.error('Error finding collections:', error);
      return { success: false, message: 'Error finding collections' };
    }
  }

  public async findById(id: number): Promise<IServiceResponse<MusicCollection>> {
    try {
      const collection = await this.repository.findById(id);
      if (!collection) {
        return { success: false, message: 'Collection not found' };
      }
      return { ...collection };
    } catch (error) {
      console.error('Error finding collection by id:', error);
      return { success: false, message: 'Error finding collection by id' };
    }
  }

  public async createCollection(collectionData: Partial<MusicCollection>): Promise<IServiceResponse<MusicCollection>> {
    try {
      const newCollection = await this.repository.createCollection(collectionData);
      return { ...newCollection };
    } catch (error) {
      console.error('Error creating collection:', error);
      return { success: false, message: 'Error creating collection' };
    }
  }

  public async addSoundtrackToCollection(collectionId: number, soundtrackId: number): Promise<IServiceResponse<null>> {
    try {
        const response = await this.repository.addSoundtrackToCollection(collectionId, soundtrackId);
        return { ...response, data: null };
    } catch (error) {
        console.error('Error adding soundtrack to collection:', error);
        return { success: false, message: 'Failed to add soundtrack to collection', data: null };
    }
}

public async removeSoundtrackFromCollection(collectionId: number, soundtrackId: number): Promise<IServiceResponse<null>> {
    try {
        const response = await this.repository.removeSoundtrackFromCollection(collectionId, soundtrackId);
        return { ...response, data: null };
    } catch (error) {
        console.error('Error removing soundtrack from collection:', error);
        return { success: false, message: 'Failed to remove soundtrack from collection', data: null };
    }
}

  public async updateCollection(id: number, collectionData: Partial<MusicCollection>): Promise<IServiceResponse<MusicCollection | null>> {
    const updateResult = await this.repository.updateCollection(id, collectionData);
    if (!updateResult.success) {
      return { success: false, message: updateResult.message || 'Error updating collection' };
    }
    return { ...updateResult };
  }

  public async deleteCollection(id: number): Promise<IServiceResponse<null>> {
    const deleteResult = await this.repository.deleteCollection(id);
    if (!deleteResult.success) {
      return { success: false, message: 'No collection found with the provided ID.' };
    }
    return { success: true, message: 'Collection successfully deleted' };
  }
}