// components/PieCharts.tsx
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS1 = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const RADIAN = Math.PI / 180;

const renderLabel1 = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const needle = ({ value, data, cx, cy, iR, oR, color }: any) => {
  const total = data.reduce((sum: number, entry: any) => sum + entry.value, 0);
  const ang = 180.0 * (1 - value / total);
  const length = (iR + 2 * oR) / 3;
  const sin = Math.sin(-RADIAN * ang);
  const cos = Math.cos(-RADIAN * ang);
  const r = 5;
  const x0 = cx;
  const y0 = cy;
  const xba = x0 + r * sin;
  const yba = y0 - r * cos;
  const xbb = x0 - r * sin;
  const ybb = y0 + r * cos;
  const xp = x0 + length * cos;
  const yp = y0 + length * sin;

  return [
    <circle key="needle-circle" cx={x0} cy={y0} r={r} fill={color} stroke="none" />,
    <path key="needle-path" d={`M${xba} ${yba}L${xbb} ${ybb} L${xp} ${yp} Z`} fill={color} />,
  ];
};

export const PieCharts = () => {

    const chartData2 = [
  { name: 'A', value: 80, color: '#ff0000' },
  { name: 'B', value: 45, color: '#00ff00' },
  { name: 'C', value: 25, color: '#0000ff' },
];

  return (
    <section className="bg-white rounded-2xl shadow-md p-6 mt-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Project Summary Charts</h3>
        <div className="flex flex-col lg:flex-row justify-center items-center gap-10">
            
            {/* First Pie Chart */}
            <div className="w-full md:w-[400px] h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[{ name: 'Group A', value: 400 }, { name: 'Group B', value: 300 }, { name: 'Group C', value: 300 }, { name: 'Group D', value: 200 }]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderLabel1}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {COLORS1.map((fill, i) => <Cell key={i} fill={fill} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
     
            <div className="w-full md:w-[400px] h-[300px]">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    dataKey="value"
                    startAngle={180}
                    endAngle={0}
                    data={chartData2}
                    cx={150}
                    cy={150}
                    innerRadius={70}
                    outerRadius={120}
                  >
                    {chartData2.map(entry => <Cell key={entry.name} fill={entry.color} />)}
                  </Pie>
                  {needle({ value: 50, data: chartData2, cx: 150, cy: 150, iR: 50, oR: 90, color: '#d0d000' })}
                </PieChart>
              </ResponsiveContainer>
            </div>
        </div>
    </section>
  );
};