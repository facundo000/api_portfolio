import { Icon } from "src/icons/entities/icon.entity";
import { Project } from "src/projects/entities/project.entity";
import { TypesIcon } from "src/types_icons/entities/types_icon.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('Projects_Icons')
export class ProjectsIcon {
    @PrimaryGeneratedColumn('uuid')
    id_project_icon: string

    @Column()
    project_id?: string

    @Column()
    icon_id?: string

    @ManyToOne(() => Project, (project) => project.projects_icons)
    @JoinColumn({ name: 'project_id' })
    project?: Project;

    @ManyToOne(() => Icon, (icon) => icon.projectsIcons)
    @JoinColumn({ name: 'icon_id' })
    icon?: Icon;
}
