import { Icon } from 'src/icons/entities/icon.entity';
import { ProjectsIcon } from 'src/projects_icons/entities/projects_icon.entity';
import { PrimaryGeneratedColumn, Column, OneToMany, Entity } from 'typeorm';

@Entity('Types_Icons')
export class TypesIcon {
    @PrimaryGeneratedColumn('uuid')
    id_type_icon: string

    @Column()
    name: string

    @OneToMany(
        (type) => Icon,
        (Icon) => Icon.type_icon_id
    )
    icons: Icon[]
    
}
