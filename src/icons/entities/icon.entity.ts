import { ProjectsIcon } from "src/projects_icons/entities/projects_icon.entity";
import { TypesIcon } from "src/types_icons/entities/types_icon.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('Icons')
export class Icon {
    @PrimaryGeneratedColumn('uuid')
    id_icon: string

    @Column()
    type_icon_id: string;

    @ManyToOne(
        (type) => TypesIcon,
        (TypesIcon) => TypesIcon.id_type_icon,
         { 
            nullable: false,
            onDelete: 'CASCADE' 
        }
    )
    @JoinColumn({ name: 'type_icon_id' })
    type_icon: TypesIcon

    @Column()
    icon: string

     @OneToMany(
        (type) => ProjectsIcon,
        (ProjectsIcon) => ProjectsIcon.icon
    )
    projectsIcons: ProjectsIcon[]    
}
