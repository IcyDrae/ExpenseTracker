import mysql from "mysql2/promise";
import "reflect-metadata";
import { DataSource } from "typeorm";
import * as Models from "../models";
import MigrateCategories from "./1678901234567-migrate-categories";

const dbName = "expense_tracker";

// Step 1: ensure database exists
async function createDatabaseIfNotExists() {
    const connection = await mysql.createConnection({
        host: "localhost",
        port: 3306,
        user: "admin",
        password: "admin",
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    await connection.end();
}

const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "admin",
    password: "admin",
    database: "expense_tracker",
    entities: Object.values(Models),
    synchronize: true,
    logging: false,
    migrations: [MigrateCategories],
})

// to initialize the initial connection with the database, register all entities
// and "synchronize" database schema, call "initialize()" method of a newly created database
// once in your application bootstrap
export default {
    AppDataSource,
    InitDatabase: async function() {
        try {
            await createDatabaseIfNotExists();
            await AppDataSource.initialize();
            await AppDataSource.runMigrations();
        } catch (error) {
            console.log(error)
        }
    }
}
