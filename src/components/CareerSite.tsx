/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Briefcase, MapPin, Clock, Search, ArrowLeft, Upload, 
  CheckCircle2, Building, ArrowUpRight, HelpCircle, User, Mail, Phone, ChevronRight
} from 'lucide-react';
import { Job, JobApplication } from '../types';

interface CareerSiteProps {
  jobs: Job[];
  onAddApplication: (app: JobApplication) => void;
  onAddCandidate: (candidate: { name: string; skills: string; matchScore: string; location: string }) => void;
  onBack: () => void;
}

export default function CareerSite({ jobs, onAddApplication, onAddCandidate, onBack }: CareerSiteProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedLoc, setSelectedLoc] = useState('All');
  
  // Application Form State
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [candidateSkills, setCandidateSkills] = useState('');
  const [resumeName, setResumeName] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const departments = ['All', ...Array.from(new Set(jobs.map(j => j.department)))];
  const locations = ['All', ...Array.from(new Set(jobs.map(j => j.location)))];

  const activeJobs = jobs.filter(j => j.status === 'Active');

  const filteredJobs = activeJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'All' || job.department === selectedDept;
    const matchesLoc = selectedLoc === 'All' || job.location === selectedLoc;
    return matchesSearch && matchesDept && matchesLoc;
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setResumeName(e.dataTransfer.files[0].name);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setResumeName(e.target.files[0].name);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !selectedJob) return;

    // Generate unique Application ID
    const appId = `AP-${Math.floor(100 + Math.random() * 900)}`;
    
    // Register Application in ATS State
    onAddApplication({
      id: appId,
      jobTitle: selectedJob.title,
      candidateName: name,
      email: email,
      status: 'Applied',
      appliedDate: new Date().toISOString().split('T')[0]
    });

    // Determine random match score for simulation
    const scores = ['94%', '88%', '91%', '85%', '97%'];
    const matchScore = scores[Math.floor(Math.random() * scores.length)];

    // Register Candidate in Candidate Database State
    onAddCandidate({
      name,
      skills: candidateSkills || 'React, TypeScript, CSS',
      matchScore,
      location: location || 'Remote'
    });

    setFormSubmitted(true);
  };

  const resetForm = () => {
    setSelectedJob(null);
    setName('');
    setEmail('');
    setPhone('');
    setLocation('');
    setCoverLetter('');
    setCandidateSkills('');
    setResumeName(null);
    setFormSubmitted(false);
  };

  return (
    <div id="worksuite-careers-site" className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Admin Quick Back Ribbon */}
      <div className="bg-[#0f172a] text-slate-300 py-2.5 px-4 text-xs font-semibold flex items-center justify-between border-b border-slate-800 shadow-sm shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span>Worksuite Public Careers Portal</span>
        </div>
        <button 
          id="btn-careers-back-to-admin"
          onClick={onBack}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1 px-3 rounded transition-colors text-[11px] cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Admin Panel</span>
        </button>
      </div>

      {/* Modern Public Header */}
      <header className="bg-white border-b border-slate-100 py-4 px-6 sm:px-12 flex justify-between items-center shrink-0 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-sm">
            W
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-slate-900 tracking-tight leading-none">Worksuite Inc.</h1>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Careers Space</span>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-6 text-sm font-semibold text-slate-600">
          <a href="#jobs-section" className="hover:text-indigo-600 transition-colors">Open Roles</a>
          <a href="#benefits-section" className="hover:text-indigo-600 transition-colors">Our Benefits</a>
          <a href="#culture-section" className="hover:text-indigo-600 transition-colors">Culture</a>
        </div>
      </header>

      {/* Main Public Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Dynamic Hero Section */}
        <section className="relative overflow-hidden bg-[#0a0e1a] text-white py-16 px-6 sm:px-12 md:py-24 text-center">
          <div className="absolute inset-0 bg-radial-gradient from-indigo-950/40 via-transparent to-transparent opacity-80" />
          <div className="max-w-3xl mx-auto relative z-10 space-y-6">
            <span className="inline-block bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              We're Hiring Globally!
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Build the future of SaaS work environments
            </h2>
            <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto font-medium leading-relaxed">
              Join our fully remote global team and help organizations build exceptional, streamlined, modern workspaces.
            </p>

            {/* Quick Search and Filter Box */}
            <div className="bg-white rounded-2xl p-4 shadow-xl border border-slate-200 text-slate-800 max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-3 mt-10">
              <div className="relative flex items-center border border-slate-200 rounded-xl px-3 bg-slate-50 focus-within:border-indigo-500 transition-colors col-span-1 md:col-span-1.5">
                <Search className="h-4 w-4 text-slate-400 shrink-0" />
                <input 
                  type="text" 
                  placeholder="Search job titles..."
                  className="w-full bg-transparent border-0 focus:ring-0 text-sm py-2 pl-2 text-slate-800 focus:outline-none placeholder-slate-400 font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="relative border border-slate-200 rounded-xl px-3 bg-slate-50">
                <select 
                  className="w-full bg-transparent border-none text-sm py-2 text-slate-700 focus:outline-none font-semibold cursor-pointer"
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                >
                  <option value="All">All Departments</option>
                  {departments.filter(d => d !== 'All').map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div className="relative border border-slate-200 rounded-xl px-3 bg-slate-50">
                <select 
                  className="w-full bg-transparent border-none text-sm py-2 text-slate-700 focus:outline-none font-semibold cursor-pointer"
                  value={selectedLoc}
                  onChange={(e) => setSelectedLoc(e.target.value)}
                >
                  <option value="All">All Locations</option>
                  {locations.filter(l => l !== 'All').map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Live Jobs Board Section */}
        <section id="jobs-section" className="py-16 px-6 sm:px-12 max-w-5xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-slate-200 pb-5">
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Current Openings</h3>
              <p className="text-xs text-slate-500 font-semibold mt-1">Showing {filteredJobs.length} active opportunities</p>
            </div>
          </div>

          {filteredJobs.length > 0 ? (
            <div className="space-y-4">
              {filteredJobs.map(job => (
                <div 
                  key={job.id} 
                  className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs hover:shadow-md hover:border-indigo-500/60 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded uppercase tracking-wider font-mono">{job.id}</span>
                      <span className="text-xs text-slate-400 font-bold uppercase">{job.department}</span>
                    </div>
                    <h4 className="text-lg font-black text-slate-900 tracking-tight">{job.title}</h4>
                    <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        <span>{job.type || 'Full-time'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Building className="h-3.5 w-3.5 text-slate-400" />
                        <span>{job.openings} Openings</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => setSelectedJob(job)}
                    className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs px-5 py-3 rounded-xl shadow-xs hover:shadow-md flex items-center justify-center gap-2 group transition-all shrink-0 cursor-pointer"
                  >
                    <span>Apply for this Job</span>
                    <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-3xs max-w-md mx-auto space-y-3">
              <Briefcase className="h-10 w-10 text-slate-300 mx-auto" />
              <h4 className="text-base font-black text-slate-900">No matching positions found</h4>
              <p className="text-xs text-slate-400 font-medium">Try broadening your search criteria or checking back soon.</p>
            </div>
          )}
        </section>

        {/* Benefits & Culture section */}
        <section id="benefits-section" className="bg-slate-100 py-16 px-6 sm:px-12 border-t border-slate-200">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Why you'll love working here</h3>
              <p className="text-xs text-slate-500 font-semibold">We believe in fostering a supportive, asynchronous, high-trust environment.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { title: '100% Remote-First', desc: 'Work from anywhere in the world. We build products asynchronously so you can control your own schedule.' },
                { title: 'Home Office Stipend', desc: 'Get a premium desk, chair, monitor, and device allowance to make your daily space comfortable.' },
                { title: 'Health & Wellness', desc: 'Fully covered medical, vision, and mental health subscription plans to ensure your well-being.' },
              ].map((b, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center text-sm font-black">
                    {i + 1}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{b.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Branded Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 px-6 sm:px-12 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0 text-xs text-slate-400 font-medium">
        <p>© {new Date().getFullYear()} Worksuite Inc. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-indigo-600">Privacy Policy</a>
          <a href="#" className="hover:text-indigo-600">Terms of Service</a>
          <a href="#" className="hover:text-indigo-600">Cookie Policy</a>
        </div>
      </footer>

      {/* JOB APPLICATION MODAL / SLIDE-OVER */}
      {selectedJob && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex justify-end z-50 animate-fade-in">
          <div className="bg-white w-full max-w-xl h-full flex flex-col shadow-2xl border-l border-slate-200 overflow-hidden animate-slide-in">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="space-y-1">
                <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded font-mono uppercase">{selectedJob.id}</span>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Apply for {selectedJob.title}</h3>
                <p className="text-xs text-slate-500 font-medium">{selectedJob.department} • {selectedJob.location}</p>
              </div>
              <button 
                onClick={resetForm}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {formSubmitted ? (
                <div className="py-12 text-center space-y-4 max-w-sm mx-auto">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-2xs border border-emerald-100">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h4 className="text-lg font-black text-slate-900 tracking-tight">Application Submitted Successfully!</h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    Thank you for applying, <span className="font-bold text-slate-800">{name}</span>. Your application for <span className="font-semibold text-indigo-600">{selectedJob.title}</span> has been securely logged into our ATS database.
                  </p>
                  <button 
                    onClick={resetForm}
                    className="w-full bg-slate-900 hover:bg-slate-950 text-white font-black text-xs py-3 rounded-xl transition-all cursor-pointer"
                  >
                    Keep Browsing Jobs
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Full Name *</label>
                      <div className="relative flex items-center border border-slate-200 rounded-xl px-3 bg-slate-50 focus-within:border-indigo-500 transition-colors">
                        <User className="h-4 w-4 text-slate-400 shrink-0" />
                        <input 
                          type="text" required
                          placeholder="Dr. Dorian Klein I"
                          className="w-full bg-transparent border-0 focus:ring-0 text-xs py-2.5 pl-2 text-slate-800 focus:outline-none placeholder-slate-300 font-medium"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Email Address *</label>
                      <div className="relative flex items-center border border-slate-200 rounded-xl px-3 bg-slate-50 focus-within:border-indigo-500 transition-colors">
                        <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                        <input 
                          type="email" required
                          placeholder="dorian.klein@demo.worksuite.biz"
                          className="w-full bg-transparent border-0 focus:ring-0 text-xs py-2.5 pl-2 text-slate-800 focus:outline-none placeholder-slate-300 font-medium"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Phone Number</label>
                      <div className="relative flex items-center border border-slate-200 rounded-xl px-3 bg-slate-50 focus-within:border-indigo-500 transition-colors">
                        <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                        <input 
                          type="text"
                          placeholder="+1 555-412-9843"
                          className="w-full bg-transparent border-0 focus:ring-0 text-xs py-2.5 pl-2 text-slate-800 focus:outline-none placeholder-slate-300 font-medium"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Location / Residence</label>
                      <div className="relative flex items-center border border-slate-200 rounded-xl px-3 bg-slate-50 focus-within:border-indigo-500 transition-colors">
                        <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                        <input 
                          type="text"
                          placeholder="Bangalore, India"
                          className="w-full bg-transparent border-0 focus:ring-0 text-xs py-2.5 pl-2 text-slate-800 focus:outline-none placeholder-slate-300 font-medium"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Core Skills Profile</label>
                    <input 
                      type="text"
                      placeholder="e.g. React, TypeScript, Node.js, Tailwind, Docker"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none placeholder-slate-300 font-medium"
                      value={candidateSkills}
                      onChange={(e) => setCandidateSkills(e.target.value)}
                    />
                    <span className="text-[10px] text-slate-400 block font-medium">List primary technical tags separated by commas.</span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Cover Letter</label>
                    <textarea 
                      rows={4}
                      placeholder="Tell us briefly why you would be an exceptional fit for Worksuite..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none placeholder-slate-300 font-medium"
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                    />
                  </div>

                  {/* Resume Upload Drag & Drop Box */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Resume / CV *</label>
                    <div 
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                        isDragOver ? 'border-indigo-500 bg-indigo-50/40' : 'border-slate-200 hover:border-indigo-400 bg-slate-50/50'
                      }`}
                    >
                      <input 
                        type="file" 
                        id="resume-file-input" 
                        className="hidden" 
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                      />
                      <label htmlFor="resume-file-input" className="cursor-pointer space-y-2 block">
                        <Upload className="h-8 w-8 text-indigo-500 mx-auto" />
                        <div className="text-xs font-bold text-slate-700">
                          {resumeName ? `Attached: ${resumeName}` : 'Upload Resume / CV File'}
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium">
                          Drag and drop your files here, or click to browse (PDF, DOCX up to 10MB)
                        </p>
                      </label>
                    </div>
                  </div>

                  {/* Submit buttons */}
                  <div className="flex gap-3 pt-4 border-t border-slate-100">
                    <button 
                      type="button" 
                      onClick={resetForm}
                      className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs py-3.5 rounded-xl transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs py-3.5 rounded-xl transition-all shadow-xs hover:shadow-md cursor-pointer"
                    >
                      Submit Application
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
