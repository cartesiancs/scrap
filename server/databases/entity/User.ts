import { Entity, PrimaryGeneratedColumn, Column, OneToMany, PrimaryColumn } from "typeorm";
import { Feed } from './Feed.js'

@Entity({ name: "users" })
export class User {

    @PrimaryColumn({ type: "varchar", length: 20 })
    userId: string;

    @Column({ type: "varchar", length: 20 })
    userDisplayName: string;

    @Column({ type: "varchar", length: 400 })
    userPassword: string;

    @Column({ nullable: false })
    userEmail: string;

    @Column()
    userAuthLevel: number;

    @OneToMany((type) => Feed, (feed) => feed.owner)
    feeds: Feed[]

    @Column({ type: "varchar", length: 30 })
    provider: string;

    @Column({ type: 'timestamp' })
    createAt: Date;

}