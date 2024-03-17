import { DataSource, EntityRepository, Repository } from 'typeorm';
import { Soundtrack } from '../entity/Soundtrack';
import { injectable } from 'inversify';
import { AppDataSource } from '../data-source';
import { MusicCategories } from '../entity';

export type SoundtrackData = {
  name: string,
  youtubeMP3Link: string,
  youTubeLink: string,
  musicVideoID: string,
  category: number,
};

export interface ISoundtrackRepository {
  getAllSoundtracks(): Promise<{ success: boolean; data?: Soundtrack[]; message?: string }>;
  getSoundtrackById(soundtrackId: number): Promise<{ success: boolean; data?: Soundtrack; message?: string }>;
  createNewSoundtrack(data: SoundtrackData): Promise<{ success: boolean; data?: Soundtrack; message?: string }>;
  updateSoundtrack(soundtrackId: number, data: SoundtrackData): Promise<{ success: boolean; message?: string; data?: Soundtrack }>;
  deleteSoundtrack(soundtrackId: number): Promise<{ success: boolean; message?: string }>;
}

@injectable()
export default class SoundtrackRepository implements ISoundtrackRepository {

  public async getAllSoundtracks(): Promise<{ success: boolean; data?: Soundtrack[]; message?: string }> {
    try {
      const soundtrackRepo = AppDataSource.getRepository(Soundtrack);
      const soundtracks = await soundtrackRepo.find({ relations: { category: true } });
      return { success: true, data: soundtracks };
    } catch (error) {
      console.error('Error getting all soundtracks:', error);
      return { success: false, message: 'Error getting all soundtracks' };
    }
  }

  public async getSoundtrackById(soundtrackId: number): Promise<{ success: boolean; data?: Soundtrack; message?: string }> {
    try {
      const soundtrackRepo = AppDataSource.getRepository(Soundtrack);
      const soundtrack = await soundtrackRepo.findOne({
        where: { id: soundtrackId },
        relations: { category: true }
      });
  
      if (!soundtrack) {
        return { success: false, message: "Soundtrack not found" };
      }
  
      return { success: true, data: soundtrack };
    } catch (error) {
      console.error('Error getting soundtrack by id:', error);
      return { success: false, message: 'Error getting soundtrack by id' };
    }
  }

  public async createNewSoundtrack(data: SoundtrackData): Promise<{ success: boolean; data?: Soundtrack; message?: string }> {
    try {
      const soundtrackRepo = AppDataSource.getRepository(Soundtrack);
      const categoryRepo = AppDataSource.getRepository(MusicCategories);
      const category = await categoryRepo.findOne({ where: { id: data.category } });

      if (!category) {
        return { success: false, message: 'Category not found' };
      }

      const soundtrack = soundtrackRepo.create({
        ...data,
        category,
      });

      if (!soundtrack) {
        return { success: false, message: 'Error creating new soundtrack' };
      }

      await soundtrackRepo.save(soundtrack);
      return { success: true, data: soundtrack };
    } catch (error) {
      console.error('Error creating new soundtrack:', error);
      return { success: false, message: 'Error creating new soundtrack' };
    }
  }

  public async updateSoundtrack(soundtrackId: number, data: SoundtrackData): Promise<{ success: boolean; message?: string; data?: Soundtrack }> {
    try {
      const soundtrackRepo = AppDataSource.getRepository(Soundtrack);
      const categoryRepo = AppDataSource.getRepository(MusicCategories);
  
      const soundtrack = await soundtrackRepo.findOne({ where: { id: soundtrackId } });
      if (!soundtrack) {
        return { success: false, message: "Soundtrack not found" };
      }
  
      const updatedCategory = await categoryRepo.findOne({ where: { id: data.category } });
      if (!updatedCategory) {
        return { success: false, message: "Category not found" };
      }
  
      soundtrack.name = data.name;
      // soundtrack.youTubeLink = data.youTubeLink;
      // soundtrack.mp3FileLink = data.youtubeMP3Link;
      // soundtrack.musicVideoID = data.musicVideoID;
      soundtrack.category = updatedCategory;
  
      await soundtrackRepo.save(soundtrack);
  
      return { success: true, message: "Soundtrack updated successfully", data: soundtrack };
    } catch (error) {
      console.error('Error updating soundtrack:', error);
      return { success: false, message: 'Error updating soundtrack' };
    }
  }

  public async deleteSoundtrack(soundtrackId: number): Promise<{ success: boolean; message?: string }> {
    try {
      const soundtrackRepo = AppDataSource.getRepository(Soundtrack);
      const deleteResult = await soundtrackRepo.delete(soundtrackId);
      if (deleteResult.affected === 0) {
        return { success: false, message: 'Soundtrack not found' };
      }
      return { success: true, message: 'Soundtrack successfully deleted' };
    } catch (error) {
      console.error('Error deleting soundtrack:', error);
      return { success: false, message: 'Error deleting soundtrack' };
    }
  }
}