import * as React from 'react';
import { labelToId } from '../../utils';

export interface ChartLegendItem {
  label: string;
  value?: number;
  unit?: string;
  className?: string;
}

export interface ChartLegendProps {
  items: ChartLegendItem[];
}

export function ChartLegend(props: ChartLegendProps) {
  const { items } = props;

  const renderItems = () => {
    return items.map((item) => {
      return (
        <div
          key={labelToId(item.label)}
          className='mealz-chart-legend-item'
        >
          <div className={item.className}>
            {item.label}
          </div>
          { item.value &&
            <div className='mealz-chart-legend-item-value'>
              <span className='mealz-chart-legend-item-amount'>
                { item.value.toFixed(0) }
              </span>
              { item.unit &&
                <span className='mealz-chart-legend-item-unit'>
                  { item.unit }
                </span>
              }
            </div>
          }
        </div>
      );
    });
  }

  return (
    <div className='mealz-chart-legend'>
      { renderItems() }
    </div>
  );
}