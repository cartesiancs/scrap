import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn, ManyToOne } from "typeorm";
import { User } from './User.js'

@Entity({ name: "feeds" })
export class Feed {
    @PrimaryGeneratedColumn('increment')
    idx: number;

    @Column({ type: "varchar", length: 1000 })
    content: string;

    @ManyToOne((type) => User, (user) => user.feeds)
    owner: User

    @Column({ type: "varchar", length: 50 })
    date: string;


    @Column()
    type: number;

} 