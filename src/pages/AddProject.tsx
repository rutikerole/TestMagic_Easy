import { ArrowBigLeft, FileBadge, NotebookPen, Users,  FileText,  } from 'lucide-react';
import { Button } from '../components/button';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { addProject } from '../utils/projectServices';
import type { ProjectStatus } from '../utils/projectTypes';

function AddProject() {
  const navigate = useNavigate();
  const [showTesterDropdown, setShowTesterDropdown] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectStatus, setProjectStatus] = useState('Triggered');
  const [projectDescription, setProjectDescription] = useState('');
  const [testLead, setTestLead] = useState('');
  const [testers, setTesters] = useState<string[]>([]);
  const [testCases, setTestCases] = useState<File | null>(null);
  const [endDate, setEndDate] = useState('');

  const testLeads = ['Shraddha Chaudhari', 'Varsha Patil', 'Namrata Shinde'];
  const testersList = ['Rutik Erole', 'Shweta Pardeshi', 'Parth Supekar', 'Mayur Bidkar', 'Shruti Sancheti'];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTestCases(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!projectName || !projectStatus || !testLead) {
      toast.error("Please fill in all mandatory fields.");
      return;
    }
  
    const newProject = {
      name: projectName,
      status: projectStatus.toLowerCase() as ProjectStatus,
      description: projectDescription,
      testLead,
      testers,
      totalTestCases: 0,
      completedTestCases: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };
  
    try {
      await addProject(newProject);
      toast.success("Project added successfully!");
      navigate("/admin");
    } catch (error) {
      console.error("Error adding project:", error);
      toast.error("Something went wrong. Please try again.");
    }
};


  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <FileBadge className="h-7 w-7 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800">Create New Project</h1>
          </div>
          <Button variant="outline" onClick={() => navigate('/admin')} className="flex items-center gap-2">
            <ArrowBigLeft className="h-5 w-5 text-blue-600" /> Back
          </Button>
        </div>
      </header>

      <div className="max-w-3xl mx-auto p-6 space-y-8">

        {/* Project Info */}
        <div className="bg-white border rounded-xl p-6 space-y-5">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
            <FileBadge className="h-5 w-5 text-blue-500" /> Project Info
          </h2>

          {/* Project Name */}
          <div>
            <label className="block text-left text-sm font-medium text-gray-700 mb-1">Project Name <span className="text-red-600">*</span></label>
            <input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name"
              className="h-11 w-full rounded-lg border border-gray-300 px-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>

          <div className="flex flex-wrap md:flex-nowrap gap-4">
             {/* Status */}
             <div className="flex-1">
               <label className="block text-left text-[15px] font-semibold text-gray-800 mb-2">Status <span className="text-red-600">*</span></label>
               <select value={projectStatus} onChange={(e) => setProjectStatus(e.target.value)} className="h-11 w-full rounded-lg border border-gray-300 px-3 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition">
                 <option value="Trigger">Triggered</option>
                 <option value="Ongoing">Ongoing</option>
                 <option value="Complete">Complete</option>
               </select>
             </div>
           
             {/* End Date */}
             <div className="flex-1">
               <label className="block text-left text-[15px] font-semibold text-gray-800 mb-2">Estimated End Date</label>
               <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="h-11 w-full rounded-lg border border-gray-300 px-3 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition"/>
             </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-left text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="Brief project description..."
              className="w-full h-24 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>
        </div>

        {/* Team Assignment */}
        <div className="bg-white border rounded-xl p-6 space-y-5">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
            <Users className="h-5 w-5 text-blue-500" /> Team Assignment
          </h2>

        {/* Test Lead */}
        <div className="w-full">
          <label className="block text-left text-sm font-medium text-gray-700 mb-1">
            Test Lead <span className="text-red-600">*</span>
          </label>
        
          <select
            value={testLead}
            onChange={(e) => setTestLead(e.target.value)}
            className="h-11 w-full px-4 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-800"
          >
            <option value="" className="text-gray-400">Select Test Lead</option>
            {testLeads.map((lead) => (
              <option key={lead} value={lead}>
                {lead}
              </option>
            ))}
          </select>
        </div>
        
        
        {/* Testers */}
        <div className="relative w-full">
          <label className="block text-left text-sm font-medium text-gray-700 mb-1">
            Testers <span className="text-red-600">*</span>
          </label>
        
          <button
            type="button"
            onClick={() => setShowTesterDropdown(!showTesterDropdown)}
            className="w-full h-11 px-4 flex justify-between items-center bg-white border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-150"
          >
            <span className={`${testers.length === 0 ? 'text-gray-400' : 'text-gray-800'}`}>
              {testers.length > 0 ? testers.join(', ') : 'Select Testers'}
            </span>
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${showTesterDropdown ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showTesterDropdown && (
            <div className="absolute z-30 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto animate-fadeIn">
              {testersList.map((tester) => (
                <label
                  key={tester}
                  className="flex items-center px-4 py-2 hover:bg-gray-50 transition cursor-pointer text-sm text-gray-700"
                >
                  <input
                    type="checkbox"
                    className="mr-3 rounded border-gray-300 focus:ring-blue-500"
                    checked={testers.includes(tester)}
                    onChange={() =>
                      setTesters(testers.includes(tester)
                        ? testers.filter((t) => t !== tester)
                        : [...testers, tester])
                    }
                  />
                  {tester}
                </label>
              ))}
            </div>
          )}
         </div>
        </div>

        {/* Test Cases */}
        <div className="bg-white border rounded-xl p-6 space-y-5">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
            <FileText className="h-5 w-5 text-blue-500" /> Test Cases
          </h2>

          <div>
            <label className="block text-left text-sm font-medium text-gray-700 mb-1">Upload File <span className="text-red-600">*</span></label>
            <div className="flex items-center gap-3">
              <input type="file" onChange={handleFileUpload} className="flex-1 border rounded-lg p-2 text-sm" />
              {testCases && <span className="text-sm truncate">{testCases.name}</span>}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => navigate('/admin')}>Cancel</Button>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white flex items-center gap-2">
            <NotebookPen className="h-4 w-4" /> Submit
          </Button>
        </div>

      </div>
    </div>
  );
}

export default AddProject;
