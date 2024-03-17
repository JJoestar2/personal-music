import { BaseEntity, Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Soundtrack } from ".";

@Entity()
export class MusicCollection extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column({
        length: 100
    })
    name: string

    @Column()
    poster: string

    @ManyToMany(() => Soundtrack, soundtrack => soundtrack.collections)
    soundtracks: Soundtrack[];
}