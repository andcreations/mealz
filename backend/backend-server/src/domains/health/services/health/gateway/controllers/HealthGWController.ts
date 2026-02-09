import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

@Controller('/api/v1/health')
export class HealthGWController {
  @Get()
  @HttpCode(HttpStatus.OK)
  public async getHealth(): Promise<void> {}
}