import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/button';
import { ArrowLeftCircleIcon, DownloadIcon,Calendar1Icon,Files,UserPenIcon,UsersRoundIcon,} from 'lucide-react';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { getProjects } from '../utils/projectServices';
import type { Project } from '../utils/projectTypes';
import { PieCharts } from '../components/pieCharts';
import { BarGraph } from '../components/barGraph';

type TestCase = {
  id: string;
  title: string;
  status: 'Pending' | 'In Progress' | 'Passed' | 'Failed';
  priority: 'Low' | 'Medium' | 'High';
  tester: string;
  project: string;
};


function ReportPage({ role }: { role: 'admin' | 'tester' }) {
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    (async () => {
      try {
        const res = await getProjects();
        const projectData = res.data.find(
          (project) => String(project.id) === id && project.testers.includes("Rutik Erole")
        );
        if (!projectData) return toast.error("Project not found or not assigned to you");
        setProject(projectData);
      } catch {
        toast.error("Failed to load project. Please try again.");
      }
    })();
  }, [id]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`http://localhost:5000/testCases`);
        const data = await res.json();
        setTestCases(data);
      } catch {
        toast.error("Failed to load Test Cases.");
      }
    })();
  }, [id]);

  const statusCounts = {
    Pending: testCases.filter(tc => tc.status === "Pending").length,
    'In Progress': testCases.filter(tc => tc.status === "In Progress").length,
    Passed: testCases.filter(tc => tc.status === "Passed").length,
    Failed: testCases.filter(tc => tc.status === "Failed").length,
  };

  type ColorKey = 'green' | 'blue' | 'yellow' | 'purple';

  const colorMap: Record<ColorKey, string> = {
    green: 'bg-green-500 from-green-100 to-green-50',
    blue: 'bg-blue-500 from-blue-100 to-blue-50',
    yellow: 'bg-yellow-500 from-yellow-100 to-yellow-50',
    purple: 'bg-purple-500 from-purple-100 to-purple-50',
  };


 

  const progressPercent = testCases.length
    ? Math.round(((statusCounts.Passed + statusCounts.Failed) / testCases.length) * 100)
    : 0;

  const handleDownload = () => {};

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200">
      {/* Nav Bar */}
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div onClick={() => navigate(role === 'admin' ? `/admin/project/${id}` : `/tester/project/${id}`)} className="flex items-center gap-2 cursor-pointer">
            <ArrowLeftCircleIcon className="h-6 w-6 text-green-600" />
            <h1 className="text-lg font-semibold text-gray-700">Back to Dashboard</h1>
          </div>
          <Button variant="outline" onClick={handleDownload} className="flex items-center bg-green-700 gap-2 text-white hover:bg-green-500 border">
            <DownloadIcon className="h-4 w-4" /> Generate Report
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-2 py-4 space-y-10">

        {/* Info Cards */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{project?.name}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {[
            { icon: <UserPenIcon className="text-white w-5 h-5" />, label: 'Test Lead', value: project?.testLead, color: 'green'}, 
            { icon: <UsersRoundIcon className="text-white w-5 h-5" />, label: 'Testers', value: project?.testers?.join(', '), color: 'blue'}, 
            { icon: <Calendar1Icon className="text-white w-5 h-5" />, label: 'Created On', value: project?.createdAt && new Date(project.createdAt).toLocaleDateString(), color: 'yellow'}, 
            { icon: <Files className="text-white w-5 h-5" />, label: 'Test Cases', value: testCases.length, color: 'purple'}
            ].map((card, i) => { 
              const colors = colorMap[card.color as ColorKey];
              return (
                <div key={i} className={`bg-gradient-to-tr ${colors.split(' ').slice(1).join(' ')} rounded-xl p-4 shadow-md`}>
                  <div className={`w-10 h-10 rounded-full ${colors.split(' ')[0]} flex items-center justify-center mb-2`}>
                    {card.icon}
                  </div>
                  <p className="text-sm text-gray-600">{card.label}</p>
                  <h3 className="text-base font-semibold text-gray-800 truncate w-full">{card.value}</h3>
                </div>
               );
            })}
          </div>
        </section>

        {/* Progress Bar */}
        <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Progress Overview</h3>
        <div className="grid grid-cols-2  md:grid-cols-4 gap-6">
          {[
            { label: "Pending", color: "bg-yellow-100 text-yellow-700 border-yellow-300" },
            { label: "In Progress", color: "bg-blue-100 text-blue-700 border-blue-300" },
            { label: "Passed", color: "bg-green-100 text-green-700 border-green-300" },
            { label: "Failed", color: "bg-red-100 text-red-700 border-red-300" },
          ].map(({ label, color }) => (
            <div className='bg-white p-5 rounded-2xl shadow-xl'>
            <div
              key={label}
              className={`w-24 h-24 mx-auto rounded-full border-4 flex flex-col items-center justify-center shadow ${color}`}
            >
              <p className="text-xl font-bold leading-tight">
                {statusCounts[label as keyof typeof statusCounts] || 0}
              </p>
              <p className="text-[10px] font-medium text-center leading-none">{label}</p>
            </div>
            </div>
          ))}
        </div>

        {/* Completion Progress */}
        <div className="mt-6">  
          <h3 className="text-md font-semibold text-gray-700 mb-2">Overall Completion Progress</h3>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div className="bg-green-500 h-4" style={{ width: `${progressPercent}%` }}></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">{progressPercent}% completed</p>
        </div>

        {/* Graph Charts */}
        <div>
          <PieCharts />                                 {/* Pie Charts */}
          <BarGraph statusCounts={statusCounts} />      {/* Bar Chart */}
        </div>

        {/* Summary */}
       {/* Executive Summary */}
{/* Executive Summary */}
<div className="my-10">
  <h2 className="text-2xl text-left font-bold text-gray-800 mb-6">Executive Summary</h2>

  {/* Key Achievements */}
  <div className="rounded-xl bg-gradient-to-br from-green-100 via-emerald-100 to-green-200 border border-green-300 shadow-md p-6 mb-6">
    <h3 className="text-xl text-left font-semibold text-green-800 mb-3">✅ Key Achievements</h3>
    <ul className="list-disc text-left list-inside text-gray-700 space-y-1">
      <li>{statusCounts.Passed} test cases executed successfully ({progressPercent}% completion rate)</li>
      <li>High pass rate indicating good application quality</li>
      <li>Consistent daily progress maintained by the team</li>
    </ul>
  </div>

  {/* Areas of Concern */}
  <div className="rounded-xl bg-gradient-to-br from-red-100 via-rose-100 to-red-200 border border-red-300 shadow-md p-6 mb-6">
    <h3 className="text-xl text-left font-semibold text-red-800 mb-3">⚠️ Areas of Concern</h3>
    <ul className="list-disc text-left list-inside text-gray-700 space-y-1">
      <li>{statusCounts.Passed} test cases failed requiring developer attention</li>
      <li>{statusCounts.Failed} test cases blocked due to environment issues</li>
      <li>{statusCounts.Pending} test cases still pending execution</li>
    </ul>
  </div>

  {/* Next Steps */}
  <div className="rounded-xl bg-gradient-to-br from-blue-100 via-sky-100 to-blue-200 border border-blue-300 shadow-md p-6">
    <h3 className="text-xl text-left font-semibold text-blue-800 mb-3">🚀 Next Steps</h3>
    <ul className="list-disc text-left list-inside text-gray-700 space-y-1">
      <li>Address failed test cases with development team</li>
      <li>Resolve blocked issues to unblock pending test cases</li>
      <li>Complete remaining test case execution</li>
    </ul>
  </div>
</div>



        
      </main>
    </div>
  );
}

export default ReportPage;
