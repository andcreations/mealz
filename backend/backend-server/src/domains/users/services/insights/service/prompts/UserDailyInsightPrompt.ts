import { PromptBuilder } from '@mealz/backend-ai';
import { UserDailyInsightsInput } from '../types';

export class UserDailyInsightPrompt {
  private static moreLessSkipped(
    name: string | undefined,
    amount?: number,
    goalFrom?: number,
    goalTo?: number,
  ): string | undefined{
    if (amount == null || goalFrom == null || goalTo == null) {
      return undefined;
    }
    if (amount < goalFrom || amount > goalTo) {
      return `${name} outside goal`;
    }
    return `${name} on track`;
  }

  public static generate(input: UserDailyInsightsInput): string {
    let mealsStr = '';
    input.meals.forEach((meal, index) => {
      if (index > 0) {
        mealsStr += '\n';
      }
      mealsStr += `${meal.name}: `;

      if (meal.skipped) {
        mealsStr += 'skipped';
        return;
      }

      let amountsStr = '';
      const addAmount = (str?: string) => {
        if (str == null) {
          return;
        }
        if (amountsStr.length > 0) {
          amountsStr += ', ';
        }
        amountsStr += str;
      };

      const { amounts } = meal;
      addAmount(this.moreLessSkipped(
        'calories',
        amounts.calories,
        amounts.caloriesGoalFrom,
        amounts.caloriesGoalTo,
      ));
      addAmount(this.moreLessSkipped(
        'carbs',
        amounts.carbs,
        amounts.carbsGoalFrom,
        amounts.carbsGoalTo,
      ));
      addAmount(this.moreLessSkipped(
        'fat',
        amounts.fat,
        amounts.fatGoalFrom,
        amounts.fatGoalTo,
      ));
      addAmount(this.moreLessSkipped(
        'protein',
        amounts.protein,
        amounts.proteinGoalFrom,
        amounts.proteinGoalTo,
      ));
      mealsStr += amountsStr;
    });

    let dailyAmountsStr = (
      this.moreLessSkipped(
        'Calories:',
        input.overallAmounts.calories,
        input.overallAmounts.caloriesGoalFrom,
        input.overallAmounts.caloriesGoalTo,
      ) +
      '\n' +
      this.moreLessSkipped(
        'Carbs:',
        input.overallAmounts.carbs,
        input.overallAmounts.carbsGoalFrom,
        input.overallAmounts.carbsGoalTo,
      ) +
      '\n' +
      this.moreLessSkipped(
        'Fat:',
        input.overallAmounts.fat,
        input.overallAmounts.fatGoalFrom,
        input.overallAmounts.fatGoalTo,
      ) +
      '\n' +
      this.moreLessSkipped(
        'Protein:',
        input.overallAmounts.protein,
        input.overallAmounts.proteinGoalFrom,
        input.overallAmounts.proteinGoalTo,
      )
    );

    return PromptBuilder.build(
      PROMPT,
      { 
        meals: mealsStr,
        dailyAmounts: dailyAmountsStr,
      },
    );
  }
}

const PROMPT = `
You are a friendly diet coach inside a mobile/web app.
Generate a short, easy and encouraging daily nutrition summary based on the data below.

Input data:
* Daily nutrition goals: calories, carbs (g), fat (g), protein (g)
* List of meals (each meal has a name, whether it was eaten or skipped, and its calories/carbs/fat/protein if eaten)

What you must do:
* Compare intakes with the goals.
* Clearly say whether calories and each macro were too high, too low or on track.
* Highlight any skipped meals explicitly.
* Summarize the daily intake of calories and macros
* Do not repeat the same information.
* Use only the information provided.
* Do not mention meals others than in the <user-meals> tag. For example, if dessert is not included in <user-meals>, do not mention it.
* Daily intake is given in the <daily-intake> tag.
* Do not include goal values in the summary.
* The user meals are meals from yesterday.
* Do not mention the day (for example = today or tomorrow).

Style rules:
* Keep the summary brief and scannable.
* Use simple, non-technical language.
* Sound positive and non-judgmental.
* Do not shame the user.
* Avoid long explanations or nutrition theory.

Output:
* 2-3 sentences including:
  * Meals eaten + skipped meals highlighted
  * Overview of calories and macros vs goal only if there is anything to improve
* Do not use markdown.

<user-meals>
{{meals}}
</user-meals>

<daily-intake>
{{dailyAmounts}}
</daily-intake>
`;