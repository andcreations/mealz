import * as React from 'react';
import { BarChart, BarChartData } from '../../components';

export interface MacrosSummaryChartData extends BarChartData {
  name: string;
  label: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
}

export interface MacrosSummaryChartProps {
  data: MacrosSummaryChartData[];
}

const MACROS_TO_CALORIES_RATIO = 0.8;

export function MacrosSummaryChart(props: MacrosSummaryChartProps) {
  const calculateMacrosScale = () => {
    const caloriesMax = Math.max(...props.data.map((item) => item.calories));
    const macrosMax = Math.max(...props.data.map((item) => {
      return item.carbs + item.protein + item.fat;
    }));
    const dstMacrosMax = caloriesMax * MACROS_TO_CALORIES_RATIO;
    return dstMacrosMax / macrosMax;
  }
  const macrosScale = calculateMacrosScale();

  return (
    <div className='mealz-macros-summary-chart'>
      <BarChart
        data={props.data}
        keys={['calories', 'carbs', 'protein', 'fat']}
        scale={{
          carbs: macrosScale,
          protein: macrosScale,
          fat: macrosScale,
        }}
        stackIds={{
          calories: 'calories',
          carbs: 'macros',
          protein: 'macros',
          fat: 'macros',
        }}
        style={{ width: '100%', aspectRatio: 3.236 }}
        barClassNames={{
          carbs: 'mealz-macros-summary-chart-bar-carbs',
          protein: 'mealz-macros-summary-chart-bar-protein',
          fat: 'mealz-macros-summary-chart-bar-fat',
          calories: 'mealz-macros-summary-chart-bar-calories',
        }}
        inactiveBarClassNames={{
          carbs: 'mealz-macros-summary-chart-bar-carbs-inactive',
          protein: 'mealz-macros-summary-chart-bar-protein-inactive',
          fat: 'mealz-macros-summary-chart-bar-fat-inactive',
          calories: 'mealz-macros-summary-chart-bar-calories-inactive',
        }}
        gapBetweenStackedBars={4}
        barSize={10}
        barCategoryGap='30%'
        xAxis={true}
        xAxisKey='label'
        xAxisClassName='mealz-macros-summary-chart-x-axis'
        legendItems={{
          calories: {
            label: 'Calories',
            className: 'mealz-macros-summary-chart-bar-calories-legend-item',
            unit: 'kcal',
          },
          carbs: {
            label: 'Carbs',
            className: 'mealz-macros-summary-chart-bar-carbs-legend-item',
            unit: 'g',
          },
          protein: {
            label: 'Protein',
            className: 'mealz-macros-summary-chart-bar-protein-legend-item',
            unit: 'g',
          },
          fat: {
            label: 'Fat',
            className: 'mealz-macros-summary-chart-bar-fat-legend-item',
            unit: 'g',
          },
        }}
      />
    </div>
  );
}