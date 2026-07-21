# Charts (UI-018)

Data visualization powered by Recharts.

## Chart Types

| Type | Component |
|------|-----------|
| `line` | LineChart with multiple series |
| `area` | AreaChart with fill |
| `bar` | BarChart with rounded tops |
| `pie` | PieChart |
| `donut` | PieChart with inner radius |

## Series Config

| Prop | Type |
|------|------|
| key | `string` (data key) |
| name | `string` (legend label) |
| color | `string` (hex color) |

## Props

| Prop | Type | Default |
|------|------|---------|
| type | `ChartType` | required |
| data | `Record<string, any>[]` | required |
| series | `ChartSeries[]` | required |
| xKey | `string` | `'name'` |
| height | `number` | `300` |
| showLegend | `boolean` | `true` |
| showGrid | `boolean` | `true` |
| showTooltip | `boolean` | `true` |

## Default Colors

`#2563eb` · `#f59e0b` · `#10b981` · `#ef4444` · `#8b5cf6` · `#06b6d4` · `#f97316` · `#ec4899`

## Implementation

`src/components/ui/chart/chart.tsx`
