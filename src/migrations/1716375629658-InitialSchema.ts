import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1716375629658 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`users\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`identifier\` varchar(255) NOT NULL COMMENT 'Email or phone number',
                \`password\` varchar(255) NOT NULL,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                UNIQUE INDEX \`IDX_4fc5989d43c219ede0a6001059\` (\`identifier\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        await queryRunner.query(`
            CREATE TABLE \`refresh_tokens\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`token\` varchar(500) NOT NULL,
                \`user_id\` int NOT NULL,
                \`device_id\` varchar(255) NOT NULL COMMENT 'Unique device identifier',
                \`is_valid\` tinyint NOT NULL DEFAULT 1,
                \`expires_at\` datetime NOT NULL,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                UNIQUE INDEX \`IDX_7d8bee0204106019fb0c6dc43e\` (\`token\`),
                INDEX \`IDX_7d8bee0204106019fb0c6dc43f\` (\`token\`),
                INDEX \`IDX_refresh_tokens_user_device\` (\`user_id\`, \`device_id\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        await queryRunner.query(`
            CREATE TABLE \`files\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`name\` varchar(255) NOT NULL COMMENT 'Original file name',
                \`extension\` varchar(50) NOT NULL,
                \`mime_type\` varchar(100) NOT NULL,
                \`size\` int NOT NULL COMMENT 'File size in bytes',
                \`path\` varchar(500) NOT NULL COMMENT 'File path on disk',
                \`user_id\` int NOT NULL,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                INDEX \`IDX_a7435dbb7583938d5e7d1376ff\` (\`user_id\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        await queryRunner.query(`
            ALTER TABLE \`refresh_tokens\`
            ADD CONSTRAINT \`FK_refresh_tokens_user\`
            FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`)
            ON DELETE CASCADE ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE \`files\`
            ADD CONSTRAINT \`FK_files_user\`
            FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`)
            ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`files\` DROP FOREIGN KEY \`FK_files_user\``);
        await queryRunner.query(`ALTER TABLE \`refresh_tokens\` DROP FOREIGN KEY \`FK_refresh_tokens_user\``);

        await queryRunner.query(`DROP INDEX \`IDX_a7435dbb7583938d5e7d1376ff\` ON \`files\``);
        await queryRunner.query(`DROP TABLE \`files\``);

        await queryRunner.query(`DROP INDEX \`IDX_refresh_tokens_user_device\` ON \`refresh_tokens\``);
        await queryRunner.query(`DROP INDEX \`IDX_7d8bee0204106019fb0c6dc43f\` ON \`refresh_tokens\``);
        await queryRunner.query(`DROP INDEX \`IDX_7d8bee0204106019fb0c6dc43e\` ON \`refresh_tokens\``);
        await queryRunner.query(`DROP TABLE \`refresh_tokens\``);

        await queryRunner.query(`DROP INDEX \`IDX_4fc5989d43c219ede0a6001059\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
    }
}
