import { PromptBuilder } from '@mealz/backend-ai';
import { UserDailyInsightsInput } from '../types';

const GOAL_ERROR_PERCENTAGE = 5;

export class UserDailyInsightPrompt {
  private static moreLessSkipped(
    name: string | undefined,
    amount?: number,
    goal?: number,
  ): string | undefined{
    if (amount == null || goal == null) {
      return undefined;
    }
    const percent = (amount / goal) * 100 - 100;
    if (Math.abs(percent) <= GOAL_ERROR_PERCENTAGE) {
      return `${name} on track`;
    }
    return (
      `${name} ` + (percent > 0 ? 'more than goal' : 'less than goal')  
    );
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
        amounts.caloriesGoal,
      ));
      addAmount(this.moreLessSkipped(
        'carbs',
        amounts.carbs,
        amounts.carbsGoal,
      ));
      addAmount(this.moreLessSkipped(
        'fat',
        amounts.fat,
        amounts.fatGoal,
      ));
      addAmount(this.moreLessSkipped(
        'protein',
        amounts.protein,
        amounts.proteinGoal,
      ));
      mealsStr += amountsStr;
    });

    let dailyAmountsStr = (
      this.moreLessSkipped(
        'Calories:',
        input.overallAmounts.calories,
        input.overallAmounts.caloriesGoal,
      ) +
      '\n' +
      this.moreLessSkipped(
        'Carbs:',
        input.overallAmounts.carbs,
        input.overallAmounts.carbsGoal,
      ) +
      '\n' +
      this.moreLessSkipped(
        'Fat:',
        input.overallAmounts.fat,
        input.overallAmounts.fatGoal,
      ) +
      '\n' +
      this.moreLessSkipped(
        'Protein:',
        input.overallAmounts.protein,
        input.overallAmounts.proteinGoal,
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
* Include:
  * What went well (1-2 short sentences)
  * What wasn’t ideal (1-2 short sentences)
  * What to improve (1-2 short sentences)
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
* Sound positive, supportive, and non-judgmental.
* Do not shame the user.
* Avoid long explanations or nutrition theory.

Output format (example structure):
* 2-4 paragraphs including:
  * Meals eaten + skipped meals highlighted
  * Overview of calories and macros vs goal only if there is anything to improve
  * What went well
  * What to improve only if there is something to improve
* Do not use markdown.

<user-meals>
{{meals}}
</user-meals>

<daily-intake>
{{dailyAmounts}}
</daily-intake>
`;