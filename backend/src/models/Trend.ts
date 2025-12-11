import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, Double } from "typeorm"
import { User } from "./User"

@Entity()
export class Trend {
    @PrimaryGeneratedColumn()
    id!: number

    @ManyToOne(() => User, user => user.trends, { nullable: false })
    user_id!: User

    @Column({nullable: false})
    period_type!: string

    @Column({nullable: false, type: 'date'})
    period_value!: Date

    @Column({nullable: false, type: 'double precision'})
    total_spent!: Double

    @Column({nullable: false, type: 'json'})
    category_breakdown!: JSON

    @Column({nullable: false})
    highest_category!: string

    @Column({nullable: false})
    created_at!: Date

    @Column({nullable: false})
    updated_at!: Date
}
