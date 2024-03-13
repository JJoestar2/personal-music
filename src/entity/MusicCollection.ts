import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
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

    @ManyToOne(() => Soundtrack, (soundtrack) => soundtrack.collection)
    soundtrack: Soundtrack[]
}