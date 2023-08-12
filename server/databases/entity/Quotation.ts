
import { Entity, PrimaryColumn, Column, OneToMany, OneToOne, JoinColumn, ManyToOne } from "typeorm";
import { Feed } from './Feed.js'

@Entity({ name: "quotation" })
export class Quotation {

    @PrimaryColumn({ type: "varchar", length: 36 })
    uuid: string;

    @OneToMany((type) => Feed, (feed) => feed.quotation)
    feeds: Feed[]

    @Column({ type: "varchar", length: 100 })
    title: string;

    @Column({ type: "varchar", length: 400 })
    description: string;

    @Column({ type: "varchar", length: 50 })
    author: string;

    @Column({ type: "varchar", length: 5 })
    publishYear: string;

    @Column({ type: "varchar", length: 500 })
    coverImage: string;

    @Column({ type: "varchar", length: 600 })
    url: string;

    @Column()
    type: number;
} 
