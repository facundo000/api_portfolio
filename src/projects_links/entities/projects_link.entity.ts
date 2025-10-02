import { Link } from "src/links/entities/link.entity";
import { Project } from "src/projects/entities/project.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('Projects_Links')
export class ProjectsLink {
    @PrimaryGeneratedColumn('uuid')
    id_project_link: string

    @Column()
    project_id: string;
    
    @Column()
    link_id: string;

    @ManyToOne(() => Project, (project) => project.id_project)
    @JoinColumn({ name: 'project_id' })
    project: Project;

    @ManyToOne(() => Link, (link) => link.projectLinks)
    @JoinColumn({ name: 'link_id' })
    link: Link;
}
