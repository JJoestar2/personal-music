import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";
import { MusicCategories, MusicCollection } from ".";


@Entity()
export class Soundtrack {

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

    @OneToMany(() => MusicCollection, (collection) => collection.soundtrack)
    collection: MusicCollection
}