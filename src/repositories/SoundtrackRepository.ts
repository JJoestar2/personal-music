import { DataSource, EntityRepository, Repository } from 'typeorm';
import { Soundtrack } from '../entity/Soundtrack';
import { injectable } from 'inversify';
import { AppDataSource } from '../data-source';
import { MusicCategories } from '../entity';

type SoundtrackData = {
  name: string,
  youtubeMP3Link: string,
  youTubeLink: string,
  musicVideoID: string,
  category: number,
};

export interface ISoundtrackRepository {
    getAllSoundtracks(): Promise<Soundtrack[]>;
    deleteSoundtrack(soundtrackId: number): Promise<void>;
    createNewSoundtrack(data: SoundtrackData): Promise<Soundtrack>;
}

@injectable()
export default class SoundtrackRepository implements ISoundtrackRepository {

  public async getAllSoundtracks(): Promise<Soundtrack[]> {
    const soundtrackRepo = AppDataSource.getRepository(Soundtrack);
    return await soundtrackRepo.find();
  }

 public async createNewSoundtrack(data: SoundtrackData): Promise<Soundtrack> {
    const soundtrackRepo = AppDataSource.getRepository(Soundtrack);
    const categoryRepo = AppDataSource.getRepository(MusicCategories);
    const { name, youTubeLink, youtubeMP3Link, musicVideoID, category: categoryId } = data;

    const category = await categoryRepo.findOne({ where: { id: categoryId } });

    //@ts-ignore
    const soundtrack = soundtrackRepo.create({
      name,
      youTubeLink,
      mp3FileLink: youtubeMP3Link,
      musicVideoID,
      category,
    });

    await soundtrackRepo.save(soundtrack);
    return soundtrack;
  }

  public async deleteSoundtrack(soundtrackId: number): Promise<void> {
    const soundtrackRepo = AppDataSource.getRepository(Soundtrack);
    await soundtrackRepo.delete(soundtrackId);
  }
}