import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class AdminService {
    constructor(@InjectDataSource() private dataSource: DataSource) { }
    async truncateAllTables() {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            await queryRunner.query(`SET session_replication_role = 'replica';`);
            const tables = ['analytics', 'os', 'browser', 'device', 'app', 'user'];
            for (const table of tables)
                await queryRunner.query(`TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE;`);
            await queryRunner.query(`SET session_replication_role = 'origin';`);
            return { message: 'All tables truncated and identities reset.' };
        } finally {
            await queryRunner.release();
        }
    }
}
