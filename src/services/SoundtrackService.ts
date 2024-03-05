import { injectable, inject } from 'inversify';
import { Repository } from 'typeorm';
import { Soundtrack } from '../entity';
import TYPES from '../types';
import SoundtrackRepository from '../repositories/SoundtrackRepository';

export interface ISoundtrackService {
    saveSoundtrack(soundtrack: Soundtrack): Promise<void>;
}

@injectable()
class SoundtrackService implements ISoundtrackService {
    constructor(@inject(TYPES.SoundtrackRepository) private repository: SoundtrackRepository) {}

    public async fetchMusicData(youTubeLink: string) {
        const url = require('url');
        const { v } = url.parse(youTubeLink, true).query; // v - youtube video indetificator
    }

    public async saveSoundtrack(soundtrack: Soundtrack) {
        // todo add work with rapid api to get soundtrack info
    }
}

export default SoundtrackService;