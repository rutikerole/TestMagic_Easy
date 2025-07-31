import { Card, CardContent } from './card';

const StatsCard = ({ icon, label, value, iconColor }: {
  icon: React.ReactNode,
  label: string,
  value: number,
  iconColor: string
}) => (
  <Card className="shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 rounded-xl h-full">
    <CardContent className="p-6 flex flex-col justify-between h-full">
      <div className="flex items-center gap-4">
        <div className={`h-12 w-12 rounded-full flex items-center justify-center bg-gray-100 ${iconColor}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </CardContent>
  </Card>
)

export default StatsCard;
