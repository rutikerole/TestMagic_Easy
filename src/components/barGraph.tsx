// components/BarGraph.tsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
  Tooltip,
} from "recharts";

type StatusCounts = { [key: string]: number };
type BarGraphProps = { statusCounts: StatusCounts };

type TriangleBarProps = {
  fill: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

const getPath = (
  x: number,
  y: number,
  width: number,
  height: number
): string => {
  return `M${x},${y + height}
    C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3}
    ${x + width / 2},${y}
    C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} 
    ${x + width},${y + height}
    Z`;
};

const TriangleBar = ({
  fill,
  x,
  y,
  width,
  height,
}: TriangleBarProps) => {
  return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
};

export const BarGraph = ({ statusCounts }: BarGraphProps) => {
  const barColors = ["#facc15", "#60a5fa", "#22c55e", "#ef4444"];

  const testStatusData = Object.entries(statusCounts).map(([name, count]) => ({
    name,
    count,
  }));

  return (
    <section className="mt-10 bg-white rounded-2xl shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-700 mb-4">
        Test Case Status Overview (Bar)
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={testStatusData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
         <Bar
           dataKey="count"
           shape={(props: unknown) => <TriangleBar {...(props as TriangleBarProps)} />}
           label={{ position: "top" }}
         >
          {testStatusData.map((_, i) => (
           <Cell key={`cell-${i}`} fill={barColors[i % barColors.length]} />
          ))}
         </Bar>
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
};
