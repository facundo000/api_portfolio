import { Link } from "src/links/entities/link.entity"
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"

@Entity('Types_Links')
export class TypesLink {
    @PrimaryGeneratedColumn('uuid')
    type_id: string

    @Column({ type: 'varchar', length: 255, unique: true })
    name: string;

    
    @OneToMany(
        () => Link, 
        (link) => link.type, 
        { 
            cascade: true, 
            lazy: false 
        }
    )
    links: Link[];
}
