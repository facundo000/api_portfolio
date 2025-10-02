import { ProjectsLink } from "src/projects_links/entities/projects_link.entity";
import { TypesLink } from "src/types_links/entities/types_link.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('Links')
export class Link {
    @PrimaryGeneratedColumn('uuid')
    id_link: string;

    @Column({ type: 'varchar', length: 500 })
    link: string;

    @ManyToOne(
        () => TypesLink,
        (typesLink) => typesLink.links,
        { 
            nullable: false,
            onDelete: 'CASCADE' 
        }
    )
    @JoinColumn({ name: 'type_id' })
    type: TypesLink;

    @Column()
    type_id: string;

    // Relación con ProjectsLinks (OneToMany)
    @OneToMany(
        () => ProjectsLink,
        (projectLink) => projectLink.link,
        { 
            cascade: true,
            lazy: false 
        }
    )
    projectLinks: ProjectsLink[];
}
