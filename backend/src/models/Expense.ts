import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from "typeorm"
import { User } from "./User"
import { Category } from "./Category"

@Entity()
export class Expense {
    @PrimaryGeneratedColumn()
    id!: number

    @ManyToOne(() => User, user => user.expenses, { nullable: false })
    user_id!: User

    @Column({nullable: false})
    name!: string

    @Column({ nullable: false, type: "double" })
    price!: number

    @Column({ nullable: false, type: "date" })
    date!: string

    @ManyToMany(() => Category, category => category.expenses)
    @JoinTable()  // creates expense_categories join table
    categories!: Category[]
}
