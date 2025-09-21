import { Link } from "src/links/entities/link.entity";
import { Project } from "src/projects/entities/project.entity";
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('Projects_Links')
export class ProjectsLink {
    @PrimaryGeneratedColumn('uuid')
    id_project_link: string

    @ManyToOne(
        (type) => Project,
        (Project) => Project.id_project
    )
    @JoinColumn({ name: 'project_id' })
    project_id: string
    
    @ManyToOne(
        (type) => Link,
        (Link) => Link.id_link
    )
    @JoinColumn({ name: 'link_id' })
    link_id: string
}
