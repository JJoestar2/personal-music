import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Soundtrack } from ".";


@Entity()
export class MusicCategories extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column({
        length: 100,
    })
    name: string

    @OneToMany(() => Soundtrack, (soudtrack) => soudtrack.category)
    soundtracks: Soundtrack[]
}