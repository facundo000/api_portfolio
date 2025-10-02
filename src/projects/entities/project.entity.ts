import { ProjectsIcon } from "src/projects_icons/entities/projects_icon.entity";
import { ProjectsLink } from "src/projects_links/entities/projects_link.entity";
import { User } from "src/user/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('Projects')
export class Project {
    @PrimaryGeneratedColumn('uuid')
    id_project: string

    @Column()
    title_en: string

    @Column()
    title_es: string

    @Column()
    description_en: string

    @Column()
    description_es: string

    @Column({ nullable: true })
    gif?: string

    @Column({ nullable: true })
    img?: string

    @Column()
    user_id: string;

    @ManyToOne(
        () => User,
        (user) => user.projects,
        { 
            nullable: false,
            onDelete: 'CASCADE' 
        }
    )
    @JoinColumn({ name: 'user_id' })
    user: User

    @OneToMany(
        (type) => ProjectsLink,
        (ProjectsLink) => ProjectsLink.project
    )
    projects_links: ProjectsLink[]

    @OneToMany(
        (type) => ProjectsIcon,
        (ProjectsIcon) => ProjectsIcon.project
    )
    projects_icons: ProjectsIcon[]
}
