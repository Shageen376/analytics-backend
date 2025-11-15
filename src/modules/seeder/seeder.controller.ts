import { Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SeederResponseDto } from '../../swagger dto/seeder-response.dto';

@ApiTags('Seeder')
@Controller('seeder')
export class SeederController {
  constructor(private readonly seederService: SeederService) {}

  @Post('run')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Run Seeder',
    description: 'Runs OS, Device, and Browser seeders if items do not exist.'
  })
  @ApiResponse({
    status: 200,
    description: 'Seeder executed successfully.',
    type: SeederResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Unexpected server error',
  })
  async runSeeder() {
    return await this.seederService.seed();
  }
}

