import { Icon } from "src/icons/entities/icon.entity";
import { Project } from "src/projects/entities/project.entity";
import { TypesIcon } from "src/types_icons/entities/types_icon.entity";
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('Projects_Icons')
export class ProjectsIcon {
    @PrimaryGeneratedColumn('uuid')
    id_project_icon: string

    @ManyToOne(
        (type) => Project,
        (Project) => Project.id_project
    )
    @JoinColumn({ name: 'project_id' })
    project_id: string

    @ManyToOne(
        (type) => Icon,
        (Icon) => Icon.id_icon
    )
    @JoinColumn({ name: 'icon_id' })
    icon_id: string
}
