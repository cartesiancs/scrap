import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn, ManyToOne } from "typeorm";
import { User } from './User.js'

@Entity({ name: "feeds" })
export class Feed {

    @PrimaryGeneratedColumn('increment')
    idx: number;

    @ManyToOne((type) => User, (user) => user.feeds)
    owner: User

    @Column({ type: "varchar", length: 1000 })
    thought: string;

    @Column({ type: "varchar", length: 1000 })
    quotationText: string;

    @Column({ type: "varchar", length: 200 })
    quotationOrigin: string;

    @Column({ type: "varchar", length: 50 })
    date: string;

    @Column()
    type: number;

} 