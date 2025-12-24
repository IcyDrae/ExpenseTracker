import { MigrationInterface, QueryRunner } from "typeorm"

export default class MigrateCategories1678901234567 implements MigrationInterface {
    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `INSERT INTO category (name) VALUES
            ('Food'),
            ('Transport'),
            ('Utilities'),
            ('Entertainment'),
            ('Healthcare'),
            ('Education'),
            ('Shopping'),
            ('Travel'),
            ('Miscellaneous');`
        )
    }

    async down(queryRunner: QueryRunner): Promise<void> {
    }
}
