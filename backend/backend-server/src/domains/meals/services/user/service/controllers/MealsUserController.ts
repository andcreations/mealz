import { RequestHandler, TransportController } from '@mealz/backend-transport';
import { MealsUserService } from '../services';


@TransportController()
export class MealsUserController {
  public constructor(private readonly mealsUserService: MealsUserService) {
  }
}