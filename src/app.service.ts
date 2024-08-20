import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Sagara MSIB Batch 7 Study Case';
  }
}
