import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { Expense } from "./Expense"
import { Category } from "./Category"
import { Trend } from "./Trend"

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ nullable: false })
    first_name!: string

    @Column({ nullable: false })
    last_name!: string

    @Column({ nullable: false})
    password!: string

    @Column({ nullable: false })
    created_at!: Date

    @Column({ nullable: false })
    last_login!: Date

    @OneToMany(() => Expense, expense => expense.user_id)
    expenses!: Expense[]

    @OneToMany(() => Category, category => category.user_id)
    categories!: Category[]

    @OneToMany(() => Trend, trend => trend.user_id)
    trends!: Category[]
}
