import { DataSource, EntityRepository, Repository } from 'typeorm';
import { Soundtrack } from '../entity/Soundtrack';
import { injectable } from 'inversify';
import { AppDataSource } from '../data-source';

export interface ISoundtrackRepository {
    createNewSoundtrack(data: Soundtrack): Promise<Soundtrack>;
}

@injectable()
export default class SoundtrackRepository implements ISoundtrackRepository {

 public async createNewSoundtrack(data: Soundtrack): Promise<Soundtrack> {
    const soundtrackRepo = AppDataSource.getRepository(Soundtrack);
    const soundtrack = soundtrackRepo.create({
        ...data,
    });
    await soundtrackRepo.save(soundtrack);
    return soundtrack;
  }
}