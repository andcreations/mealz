import * as React from 'react';
import { useState } from 'react';
import * as classNames from 'classnames';
import {
  YAxis,
  CartesianGrid,
  Line,
  LineChart as RechartsLineChart,
} from 'recharts';

import { ChartLegend, ChartLegendItem } from './ChartLegend';

export interface LineChartData {
  name: string;
  [K: string]: number | string;
}

export interface LineChartProps {
  data: LineChartData[];
  keys: string[];
  style: React.CSSProperties;
  lineClassNames: Record<string, string>;
  yAxisClassName: string;
  dotClassName: string;
  dotClassNames?: Record<string, string>;
  activeDotClassName: string;
  activeDotClassNames?: Record<string, string>;
  margin?: number;
  legendItems?: Record<string, ChartLegendItem>;
}

interface DotProps {
  dataKey: string;
  isActive: boolean;
  [key: string]: any;
}

export function LineChart(props: LineChartProps) {
  const { margin = 0 } = props;
  const [activeName, setActiveName] = useState<string | null>(null);

  const onChartClick = (payload: any) => {
    if (payload.activeLabel != null) {
      const name = props.data[payload.activeLabel].name;
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

  const LineChartDot = (dotProps: DotProps) => {
    const { dataKey, isActive } = dotProps;
    const dotClassNames = classNames(
      props.dotClassName,
      props.dotClassNames?.[dataKey],
      {
        [props.activeDotClassName]: isActive,
        [props.activeDotClassNames?.[dataKey]]: isActive,
      },
      isActive,
    );
    return (
      <circle
        className={dotClassNames}
        cx={dotProps.cx}
        cy={dotProps.cy}
      />
    );
  }  

  const renderLine = (key: string) => {
    return (
      <Line
        className={props.lineClassNames[key]}
        dataKey={key}
        type='monotone'
        dot={(dotProps) =>
          <LineChartDot
            {...dotProps}
            key={`dot-${key}-${dotProps.index}`}
            dataKey={key}
            isActive={activeName === dotProps.payload.name}
          />
        }
        activeDot={false}
        isAnimationActive={false}
      />
    );
  }

  const renderLines = () => {
    return props.keys.map((key) => {
      return renderLine(key);
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
    <div className='mealz-line-chart-wrapper'>
      <RechartsLineChart
        className='mealz-line-chart'
        data={props.data}
        style={props.style}
        margin={{ top: margin, right: margin, left: margin, bottom: margin }}
        onClick={onChartClick}
      >
        <YAxis
          className={props.yAxisClassName}
          width='auto'
          axisLine={false}
          tickLine={false}
        />
        <CartesianGrid className='mealz-line-chart-grid'/>
        { renderLines() }
      </RechartsLineChart>
      { !!legendItems &&
        <ChartLegend items={legendItems}/>
      }
    </div>
  );
}