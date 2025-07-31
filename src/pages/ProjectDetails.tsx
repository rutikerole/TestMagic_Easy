import {  useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/button';
import { ArrowLeftCircleIcon, Calendar1Icon, EyeIcon, Files, UserPenIcon, UsersRoundIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { getProjects } from '../utils/projectServices';
import type { Project } from '../utils/projectTypes';

const ProjectDetails = ({ role }: { role: 'admin' | 'tester' }) => {

  type TestCase = {
  id: string;
  title: string;
  status: 'Pending' | 'In Progress' | 'Passed' | 'Failed';
 };

  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [project, setProject] = useState<Project | null>(null);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
  const fetchProjects = async () => {
    try {
      const res = await getProjects();
      const projectData = res.data.find(
        (project) => String(project.id) === id && project.testers.includes("Rutik Erole")
      );
      if (!projectData) {
        toast.error("Project not found or not assigned to you");
        return;
      }

      setProject(projectData);


    } catch (error) {
      console.error("Failed to fetch project", error);
      toast.error("Failed to load project. Please try again.");
    }
  };

  fetchProjects();
}, [id]);


useEffect(() => {
  if (project) {
    console.log("✅ Project Loaded:", project.testers);
  }
}, [project]);

  useEffect(() => {
  const fetchTestCases = async () => {
    try {
      const resTestCases = await fetch(`http://localhost:5000/testCases`);
      const testCasesData = await resTestCases.json();
      setTestCases(testCasesData);
    } catch (error) {
      console.error("Failed to fetch Test Cases", error);
      toast.error("Failed to load Test Cases. Please try again.");
    }
  };
  fetchTestCases();
 }, [id]);

  // Status Counters
  const statusCounts = {
    Pending: testCases.filter(tc => tc.status === "Pending").length,
    "In Progress": testCases.filter(tc => tc.status === "In Progress").length,
    Passed: testCases.filter(tc => tc.status === "Passed").length,
    Failed: testCases.filter(tc => tc.status === "Failed").length,
  };

  const total = testCases.length;
  const completed = statusCounts.Passed + statusCounts.Failed;
  const progressPercent = total ? Math.round((completed / total) * 100) : 0;


  const handleStatusChange = (id: string, newStatus: TestCase["status"]) => {
  const updated = testCases.map(tc =>
    tc.id === id ? { ...tc, status: newStatus } : tc
  );
  setTestCases(updated);
};


  return (
   <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200">

     {/* Navbar */}
     <header className="bg-white shadow-sm border-b-gray-600 sticky top-0 z-20">
       <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
   
         {/* Back to Dashboard */}
         <div onClick={() => navigate(role === 'admin' ? '/admin' : '/tester')} className="flex items-center gap-2 cursor-pointer">
           <ArrowLeftCircleIcon className="h-6 w-6 text-green-600" />
           <h1 className="text-lg font-semibold text-gray-700">Back to Dashboard</h1>
         </div>
   
        
         {/* Generate Report */}
         <Button
           variant="outline"
           onClick={() => navigate(`/${role}/project/report/${id}`)}
           className="flex items-center bg-blue-500 gap-2 text-white hover:bg-blue-600 border"
         >
           <EyeIcon className="h-4 w-4" />
           View Report
         </Button>
       </div>
     </header>
   
     {/* Content Section */}
     <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">
   
    <section>
     <h2 className="text-2xl text-left font-bold text-gray-800 mb-6">  Project Information</h2>
   
     {/* Info Cards */}
     <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
       {/* Test Lead */}
       <div className="bg-white rounded-2xl shadow-md p-5 flex flex-col items-center text-center hover:shadow-lg transition-all">
         <UserPenIcon className="w-8 h-8 text-green-600 mb-3" />
         <h3 className="text-base font-semibold text-gray-700 mb-1">{project?.testLead}</h3>
         <p className="text-sm text-gray-500"></p>
       </div>
   
       {/* Testers */}
       <div className="bg-white rounded-2xl shadow-md p-5 flex flex-col items-center text-center hover:shadow-lg transition-all">
         <UsersRoundIcon className="w-8 h-8 text-green-600 mb-3" />
         <h3 className="text-base font-semibold text-gray-700 mb-1">{project?.testers?.join(', ')}</h3>
         <p className="text-sm text-gray-500"></p>
       </div>
   
       {/* Created At */}
       <div className="bg-white rounded-2xl shadow-md p-5 flex flex-col items-center text-center hover:shadow-lg transition-all">
         <Calendar1Icon className="w-8 h-8 text-green-600 mb-3" />
         <h3 className="text-base font-semibold text-gray-700 mb-1">{project?.createdAt}</h3>
         <p className="text-sm text-gray-500"></p>
       </div>
   
       {/* Test Cases */}
       <div className="bg-white rounded-2xl shadow-md p-5 flex flex-col items-center text-center hover:shadow-lg transition-all">
         <Files className="w-8 h-8 text-green-600 mb-3" />
         <h3 className="text-base font-semibold text-gray-700 mb-1">Test Cases</h3>
         <p className="text-sm text-gray-500">10 Linked</p>
       </div>
     </div>
   
     {/* Project Title + Description */}
     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
   
     {/* Project Title */}
     <div className="bg-green-100 border border-green-100 rounded-2xl p-4 shadow-sm flex items-center justify-center">
       <h3 className="text-2xl font-semibold text-green-600 text-center">{project?.name}</h3>
     </div>
   
     {/* Description */}
     <div className="bg-gray-50 rounded-2xl border border-gray-200 p-4 shadow-sm">
       <h4 className="text-sm font-semibold text-gray-700 mb-1">Description</h4>
       <p className="text-xs text-gray-600 leading-relaxed">
         Comprehensive testing of the new e-commerce platform including user authentication, product catalog, shopping cart, and payment processing.
       </p>
     </div>
    </div>
  </section>

    {/* Progress Overview */}
    <section>
        <div className="mt-6">
          <h3 className="text-md font-semibold text-gray-700 mb-1">
            Overall Completion Progress
          </h3>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="bg-green-500 h-4 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {progressPercent}% completed
          </p>
        </div>
      </section>

      {/* ✅ Test Case Cards */}
     <section>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Test Cases</h2>

      <div className="bg-white rounded-xl shadow divide-y divide-gray-200">
        {testCases.length === 0 ? (
          <p className="text-gray-500 px-4 py-6">No test cases found.</p>
        ) : (
          testCases.map((tc) => (
            <div key={tc.id} className="flex justify-between items-center px-4 py-3">
              {/* Left: Test Case Title */}
              <div>
                <h4 className="font-medium text-gray-800">{tc.title}</h4>
              </div>
    
              {/* Right: Status Selector */}
              <div>
                <select
                  value={tc.status}
                  onChange={(e) =>
                    handleStatusChange(tc.id, e.target.value as TestCase["status"])
                  }
                  className={`border px-3 py-2 rounded-md text-sm font-medium focus:outline-none 
                    ${
                      tc.status === 'Passed'
                        ? 'bg-green-100 text-green-800'
                        : tc.status === 'Failed'
                        ? 'bg-red-100 text-red-800'
                        : tc.status === 'In Progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }
                  `}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Passed">Passed</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  </main>
</div>

  );
};

export default ProjectDetails