import { injectable, inject } from 'inversify';
import url from 'url';
import TYPES from '../types';
import SoundtrackRepository, { SoundtrackData } from '../repositories/SoundtrackRepository';
import { client } from '..';
import { Soundtrack } from '../entity';


export type SoundtrackNewData = {
    link: string;
    name?: string;
    categoryId: number; 
}

interface IServiceResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
}

export interface ISoundtrackService {
    createSoundtrack(soundtrackData: SoundtrackNewData): Promise<IServiceResponse<Soundtrack>>;
    getSoundtracks(): Promise<IServiceResponse<Soundtrack[]>>;
    getSoundtrackById(soundtrackId: number): Promise<IServiceResponse<Soundtrack>>;
    updateSoundtrack(soundtrackId: number, soundtrackData: SoundtrackData): Promise<IServiceResponse<Soundtrack>>;
    deleteSoundtrack(soundtrackId: number): Promise<IServiceResponse<null>>;
}

@injectable()
class SoundtrackService implements ISoundtrackService {
    constructor(@inject(TYPES.SoundtrackRepository) private repository: SoundtrackRepository) {}

    private async fetchMusicData(link: string) {
        const { v: videoId } = url.parse(link, true).query; // v - youtube video indetificator
        try {
            const { data } = await client.get('https://youtube-mp36.p.rapidapi.com/dl', { params: { id: videoId } });
            const { title, link: youtubeMP3Link } = data;
            return {
                title,
                youtubeMP3Link,
                videoId,
            };
        } catch (err) {
            throw new Error('Error when fetching video infop')
        }
    }

    public async createSoundtrack(soundtrackData: SoundtrackNewData): Promise<IServiceResponse<Soundtrack>> {
        try {
            const { link, categoryId } = soundtrackData;
            const {
                title,
                youtubeMP3Link,
                videoId,
            } = await this.fetchMusicData(link);
            const newSoundtrack = await this.repository.createNewSoundtrack({
                name: title,
                youTubeLink: link,
                mp3FileLink: youtubeMP3Link,
                //@ts-ignore
                musicVideoID: videoId,
                category: categoryId,
            });
            return { success: true, data: newSoundtrack.data };
        } catch (error) {
            console.error('Error saving soundtrack:', error);
            return { success: false, message: 'Error saving soundtrack' };
        }
    }

    public async getSoundtracks(): Promise<IServiceResponse<Soundtrack[]>> {
        try {
            const response = await this.repository.getAllSoundtracks();
            return response;
        } catch (error) {
            console.error('Error getting soundtracks:', error);
            return { success: false, message: 'Error getting soundtracks' };
        }
    }

    public async getSoundtrackById(soundtrackId: number): Promise<IServiceResponse<Soundtrack>> {
        try {
            const response = await this.repository.getSoundtrackById(soundtrackId);
            return response;
        } catch (error) {
            console.error('Error getting soundtrack by ID:', error);
            return { success: false, message: 'Error getting soundtrack by ID' };
        }
    }

    public async updateSoundtrack(soundtrackId: number, soundtrackData: SoundtrackData): Promise<IServiceResponse<Soundtrack>> {
        try {
            const response = await this.repository.updateSoundtrack(soundtrackId, soundtrackData);
            return response;
        } catch (error) {
            console.error('Error updating soundtrack:', error);
            return { success: false, message: 'Error updating soundtrack' };
        }
    }

    public async deleteSoundtrack(soundtrackId: number): Promise<IServiceResponse<null>> {
        try {
            const response = await this.repository.deleteSoundtrack(soundtrackId);
            return response;
        } catch (error) {
            console.error('Error deleting soundtrack:', error);
            return { success: false, message: 'Error deleting soundtrack' };
        }
    }
}

export default SoundtrackService;