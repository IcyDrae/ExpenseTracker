import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany } from "typeorm"
import { User } from "./User"
import { Expense } from "./Expense"

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({nullable: false})
    name!: string

    @ManyToMany(() => Expense, expense => expense.categories)
    expenses!: Expense[]
}
