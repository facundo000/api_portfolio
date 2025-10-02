import { Project } from 'src/projects/entities/project.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('Users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id_user: string;
    
    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @Column()
    role: string;

    @OneToMany(() => Project, (project) => project.user)
    projects: Project[];
}

