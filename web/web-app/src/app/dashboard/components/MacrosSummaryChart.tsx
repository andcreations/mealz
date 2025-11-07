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

export function MacrosSummaryChart(props: MacrosSummaryChartProps) {
  return (
    <div className='mealz-macros-summary-chart'>
      <BarChart
        data={props.data}
        keys={['calories', 'carbs', 'protein', 'fat']}
        stackIds={{
          carbs: 'macros',
          protein: 'macros',
          fat: 'macros',
          calories: 'calories',
        }}
        style={{ width: '100%', height: 200 }}
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
          carbs: {
            label: 'Carbs',
            className: 'mealz-macros-summary-chart-bar-carbs-legend-item',
          },
          protein: {
            label: 'Protein',
            className: 'mealz-macros-summary-chart-bar-protein-legend-item',
          },
          fat: {
            label: 'Fat',
            className: 'mealz-macros-summary-chart-bar-fat-legend-item',
          },
          calories: {
            label: 'Calories',
            className: 'mealz-macros-summary-chart-bar-calories-legend-item',
          },
        }}
      />
    </div>
  );
}