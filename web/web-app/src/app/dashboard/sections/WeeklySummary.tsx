import * as React from 'react';
import { MacrosSummaryChart, MacrosSummaryChartData } from '../components';

const data: MacrosSummaryChartData[] = [
  {
    name: '0',
    label: 'Mon',
    carbs: 200,
    protein: 100,
    fat: 50,
    calories: 1000,
  },
  {
    name: '1',
    label: 'Tue',
    carbs: 200,
    protein: 100,
    fat: 50,
    calories: 1200,
  },
  {
    name: '2',
    label: 'Wed',
    carbs: 300,
    protein: 150,
    fat: 75,
    calories: 900,
  },
  {
    name: '3',
    label: 'Thu',
    carbs: 320,
    protein: 160,
    fat: 80,
    calories: 800,
  },
  {
    name: '4',
    label: 'Fri',
    carbs: 200,
    protein: 100,
    fat: 50,
    calories: 1150,
  },
  {
    name: '5',
    label: 'Sat',
    carbs: 278,
    protein: 139,
    fat: 69.5,
    calories: 960,
  },
  {
    name: '6',
    label: 'Sun',
    carbs: 189,
    protein: 94.5,
    fat: 47.25,
    calories: 1040,
  },
];

export function WeeklySummary() {
  return (
    <div className='mealz-weekly-summary'>
      <MacrosSummaryChart data={data}/>
    </div>
  );
}