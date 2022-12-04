import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, VersionColumn } from 'typeorm';

@Entity({
    synchronize: true
})
export class File {
    @PrimaryGeneratedColumn('uuid')
    public id!: string;

    @Column()
    public name!: string;

    @Column()
    public path!: string;

    @Column({ default: 'file' })
    public type!: string;

    @Column({ type: 'json' })
    public additionalData!: any;

    @CreateDateColumn({
        type: 'datetime',
        nullable: false,
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'datetime',
        nullable: false,
    })
    updatedAt: Date;

    @DeleteDateColumn({
        type: 'datetime',
        nullable: true,
    })
    deletedAt: Date;

    @VersionColumn()
    version: number;

}