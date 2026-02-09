import { applyDecorators } from '@nestjs/common'
import { WithActiveSpan } from './WithActiveSpan'

export const WithJobSpan = (jobName: string): MethodDecorator => {
  return applyDecorators(WithActiveSpan(`${jobName} JOB`));
}