import * as React from 'react';
import { useState } from 'react';
import * as classNames from 'classnames';
import { 
  YAxis,
  Bar,
  BarChart as RechartsBarChart,
  XAxis,
} from 'recharts';

import { ChartLegend, ChartLegendItem } from './ChartLegend';

export interface BarChartData {
  name: string;
  [K: string]: number | string;
}

export interface BarChartProps {
  data: BarChartData[];
  keys: string[];
  stackIds: Record<string, string>;
  style: React.CSSProperties;
  barClassNames: Record<string, string>;
  inactiveBarClassNames: Record<string, string>;
  xAxis?: boolean;
  xAxisClassName?: string;
  xAxisKey?: string;
  yAxis?: boolean;
  yAxisClassName?: string;
  margin?: number;
  barSize?: number;
  barCategoryGap?: number | string;
  gapBetweenStackedBars?: number;
  legendItems?: Record<string, ChartLegendItem>;
}

export function BarChart(props: BarChartProps) {
  const { margin = 0, gapBetweenStackedBars = 0, barSize = 10 } = props;
  const [activeName, setActiveName] = useState<string | null>(null);

  const onChartClick = (payload: any) => {
    if (payload.activeIndex != null) {
      const name = props.data[payload.activeIndex].name;
      if (name === activeName) {
        setActiveName(null);
      }
      else {  
        setActiveName(name);
      }
    }
    else {
      setActiveName(null);
    }
  }
  
  const BarShape = (barShapeProps) => {
    const { x, y, width, height, fill, dataKey, name } = barShapeProps;

    const radius = width / 4;
    const barHeight = Math.max(0, height - gapBetweenStackedBars);

    const hasActive = activeName !== null;
    const isActive = activeName === name;

    const barClassNames = classNames(
      {
        [props.barClassNames[dataKey]]: !hasActive || isActive,
      },
      {
        [props.inactiveBarClassNames[dataKey]]: hasActive && !isActive,
      },
    );

    return (
      <rect
        className={barClassNames}
        x={x}
        y={y + gapBetweenStackedBars / 2}
        width={width}
        height={barHeight}
        fill={fill}
        rx={radius}
        ry={radius}
      />
    );    
  }

  const renderBar = (key: string) => {
    return <Bar
      dataKey={key}
      stackId={props.stackIds[key]}
      maxBarSize={barSize}
      shape={(barShapeProps) => <BarShape {...barShapeProps} dataKey={key}/>}
    />;
  }
  
  const renderBars = () => {
    return props.keys.map((key) => {
      return renderBar(key);
    });
  }

  const buildLegendItems = () => {
    if (!props.legendItems) {
      return;
    }
    return props.keys.map((key) => {
      const data = activeName
        ? props.data.find((item) => item.name === activeName)
        : undefined;
      const value = data?.[key];
      return {
        ...props.legendItems[key],
        value: typeof value === 'number' ? value : undefined,
      };
    });
  }
  const legendItems = buildLegendItems();

  return (
    <div className='mealz-bar-chart-wrapper'>
      <RechartsBarChart
        className='mealz-bar-chart'
        data={props.data}
        style={props.style}
        margin={{ top: margin, right: margin, left: margin, bottom: margin }}
        barCategoryGap={props.barCategoryGap}
        onClick={onChartClick}
      >
        { renderBars() }
        { props.xAxis && props.xAxisKey &&
          <XAxis
            className={props.xAxisClassName}
            dataKey={props.xAxisKey}
            axisLine={false}
            tickLine={false}
            tick={{ pointerEvents: 'none' }}
            tickFormatter={(value) => value.toString()}
            pointerEvents='none'
          />
        }
        { props.yAxis &&
          <YAxis
            className={props.yAxisClassName}
            width='auto'
            axisLine={false}
            tickLine={false}
          />
        }
      </RechartsBarChart>
      { !!legendItems &&
        <ChartLegend items={legendItems}/>
      }    
    </div>
  );
}