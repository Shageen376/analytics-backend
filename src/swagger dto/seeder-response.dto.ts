import { ApiProperty } from '@nestjs/swagger';

export class SeederResponseDto {
  @ApiProperty({ example: 'Seeder executed successfully.' })
  message: string;

  @ApiProperty({
    example: ['OS:Windows', 'Browser:Chrome'],
    description: 'List of items inserted'
  })
  inserted: string[];

  @ApiProperty({ example: 5, description: 'Total number of inserted records' })
  totalInserted: number;
}
