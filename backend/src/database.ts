import mysql from "mysql2/promise";
import "reflect-metadata";
import { DataSource } from "typeorm";
import * as Models from "./models";

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
})

// to initialize the initial connection with the database, register all entities
// and "synchronize" database schema, call "initialize()" method of a newly created database
// once in your application bootstrap
export default {
    AppDataSource,
    InitDatabase: async function() {
        try {
            await createDatabaseIfNotExists();
            await AppDataSource.initialize()
        } catch (error) {
            console.log(error)
        }
    }
}
