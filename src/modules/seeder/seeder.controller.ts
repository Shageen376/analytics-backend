import { Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { SeederService } from './seeder.service';

@Controller('seeder')
export class SeederController {
  constructor(private readonly seederService: SeederService) {}
  @Post('run')
  @HttpCode(HttpStatus.OK)
  async runSeeder() {
    return await this.seederService.seed()
  }
}
