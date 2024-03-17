import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    ManyToMany,
    JoinTable,
    BaseEntity,
} from "typeorm";
import { MusicCategories, MusicCollection } from ".";


@Entity()
export class Soundtrack extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column({
        length: 100,
    })
    name: string

    @Column()
    youTubeLink: string

    @Column()
    mp3FileLink: string

    @Column()
    musicVideoID: string

    @ManyToOne(() => MusicCategories, (category) => category.soundtracks)
    category: MusicCategories

    @ManyToMany(() => MusicCollection, collection => collection.soundtracks)
    @JoinTable()
    collections: MusicCollection[];
}