import { injectable, inject } from 'inversify';
import url from 'url';
import TYPES from '../types';
import SoundtrackRepository from '../repositories/SoundtrackRepository';
import { client } from '..';
import { Soundtrack } from '../entity';


export type SoundtrackData = {
    link: string;
    name?: string;
    categoryId: number; 
}

export interface ISoundtrackService {
    saveSoundtrack(soundtrackData: SoundtrackData): Promise<Soundtrack>;
}

@injectable()
class SoundtrackService implements ISoundtrackService {
    constructor(@inject(TYPES.SoundtrackRepository) private repository: SoundtrackRepository) {}

    private async fetchMusicData(link: string) {
        const { v: videoId } = url.parse(link, true).query; // v - youtube video indetificator
        const { data } = await client.get('https://youtube-mp36.p.rapidapi.com/dl', { params: { id: videoId } });
        const { title, link: youtubeMP3Link } = data;
        return {
            title,
            youtubeMP3Link,
            videoId,
        };
    }

    public async saveSoundtrack(soundtrackData: SoundtrackData): Promise<Soundtrack> {
        const { link, categoryId } = soundtrackData;
        const {
            title,
            youtubeMP3Link,
            videoId,
        } = await this.fetchMusicData(link);
        const newSoundtrack = await this.repository.createNewSoundtrack({
            name: title,
            youTubeLink: link,
            youtubeMP3Link,
            //@ts-ignore
            musicVideoID: videoId,
            category: categoryId,
        });
        return newSoundtrack;
    }
}

export default SoundtrackService;