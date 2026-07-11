/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Ticket, Calendar, ShieldAlert, BookOpen, Mail, Plus, Search, 
  Send, HelpCircle, ChevronRight, CheckCircle, Clock, Heart, Award,
  QrCode, Trash2, Copy, Download
} from 'lucide-react';
import { Ticket as SupportTicket, Notice, Client, Project, Employee } from '../types';
import TicketsView from './tickets/TicketsView';
import EventsView from './events/EventsView';
import MessagesView from './messages/MessagesView';
import NoticesView from './notices/NoticesView';
import KnowledgeBaseView from './knowledgebase/KnowledgeBaseView';
import AssetsView from './assets/AssetsView';
import BioLinksView from './biolinks/BioLinksView';

interface MiscTabProps {
  subTab: string;
  tickets: SupportTicket[];
  notices: Notice[];
  onAddTicket: (ticket: { subject: string; priority: 'Urgent' | 'High' | 'Medium' | 'Low'; assignedTo: string }) => void;
  onResolveTicket: (id: string) => void;
  clients: Client[];
  projects: Project[];
  employees: Employee[];
}

export default function MiscTab({
  subTab,
  tickets,
  notices,
  onAddTicket,
  onResolveTicket,
  clients,
  projects,
  employees
}: MiscTabProps) {
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketPriority, setTicketPriority] = useState<'Urgent' | 'High' | 'Medium' | 'Low'>('Medium');
  const [ticketAssignee, setTicketAssignee] = useState('Elena Rostova');

  // Interactive Calendar State
  const [calendarEvents, setCalendarEvents] = useState([
    { title: 'Q3 Product Strategy alignment', date: '2026-07-03', time: '11:00 AM', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    { title: 'Independence Day Social Gathering', date: '2026-07-04', time: '05:00 PM', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { title: 'Biometric Badges Calibration', date: '2026-07-08', time: '02:00 PM', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  ]);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventTime, setNewEventTime] = useState('09:00 AM');

  const handleCalendarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle || !selectedDay) return;
    const dateString = `2026-07-${selectedDay.toString().padStart(2, '0')}`;
    const newEvt = {
      title: newEventTitle,
      date: dateString,
      time: newEventTime,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    };
    setCalendarEvents([...calendarEvents, newEvt]);
    setNewEventTitle('');
    setShowCalendarModal(false);
  };

  // Knowledge Base State
  const [kbSearch, setKbSearch] = useState('');
  const kbArticles = [
    { id: 'KB-01', title: 'Connecting to Corporate Git via SSH Handshake', cat: 'DevOps', desc: 'Step-by-step instructions for mapping local public keys onto our container hosting nodes.' },
    { id: 'KB-02', title: 'Biometric Attendance Clock Calibration', cat: 'IT / Facilities', desc: 'How to recalibrate the hardware terminals when seeing handshake alignment codes.' },
    { id: 'KB-03', title: 'Expense Logging Policy for Remote Developers', cat: 'Finance', desc: 'Annual limits on hardware licenses, cloud hosting credits, and SaaS seats.' },
  ];

  // Internal Messages state
  const [activeChatUser, setActiveChatUser] = useState('Elena Rostova');
  const [newMessage, setNewMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'Elena Rostova', msg: 'Hi Zara, did you approve the budget for the SaaS Redesign?', time: '09:15 AM' },
    { id: 2, sender: 'Zara Khan', msg: 'Yes Elena, I have already updated the contract registry and logged the paid invoice state.', time: '09:20 AM' },
    { id: 3, sender: 'Elena Rostova', msg: 'Perfect! I am clocking in on the "Design system tokens" task now.', time: '09:22 AM' },
  ]);

  // Company Events
  const eventsList = [
    { title: 'Q3 Product Strategy alignment', date: '2026-07-03', time: '11:00 AM', loc: 'Conference Room Alpha / Meet' },
    { title: 'Independence Day Social Gathering', date: '2026-07-04', time: '17:00 PM', loc: 'Garden Terrace' },
    { title: 'Biometric Badges Calibration Session', date: '2026-07-08', time: '14:00 PM', loc: 'Lobby Port terminal' },
  ];

  // --- QR Code Generator States ---
  const [qrLabel, setQrLabel] = useState('SF HQ Mobile Authentication Portal');
  const [qrType, setQrType] = useState('URL'); // 'URL' | 'WiFi' | 'Text' | 'vCard'
  const [qrText, setQrText] = useState('https://demo.worksuite.biz/mobile-auth');
  const [qrFgColor, setQrFgColor] = useState('#0b0f19');
  const [qrBgColor, setQrBgColor] = useState('#ffffff');
  const [qrSize, setQrSize] = useState('256');

  // WiFi helper states
  const [wifiSsid, setWifiSsid] = useState('SF-HQ-GUEST');
  const [wifiPassword, setWifiPassword] = useState('WorksuiteSecure2026');
  const [wifiSecurity, setWifiSecurity] = useState('WPA');

  // vCard helper states
  const [vCardName, setVCardName] = useState('Zara Khan');
  const [vCardOrg, setVCardOrg] = useState('Worksuite S.R.L');
  const [vCardPhone, setVCardPhone] = useState('+1-555-0199');
  const [vCardEmail, setVCardEmail] = useState('zara@worksuite.biz');

  // Saved QR History
  const [qrHistory, setQrHistory] = useState<Array<{
    id: string;
    label: string;
    text: string;
    fgColor: string;
    bgColor: string;
    type: string;
    date: string;
  }>>(() => {
    const saved = localStorage.getItem('qr_history_list');
    return saved ? JSON.parse(saved) : [
      { id: 'qr-1', label: 'SF HQ Guest Wi-Fi Portal', text: 'WIFI:T:WPA;S:SF-HQ-GUEST;P:WorksuiteSecure2026;;', fgColor: '#0b0f19', bgColor: '#ffffff', type: 'WiFi', date: '2026-07-04' },
      { id: 'qr-2', label: 'Employee Portal Sign-in', text: 'https://demo.worksuite.biz/employee/auth', fgColor: '#3b82f6', bgColor: '#ffffff', type: 'URL', date: '2026-07-03' },
      { id: 'qr-3', label: 'Server Room B Asset Tag #9912', text: 'ASSET-SRB-NODE-9912A', fgColor: '#10b981', bgColor: '#ffffff', type: 'Text', date: '2026-07-02' }
    ];
  });

  // Auto-compile text based on type and inputs
  React.useEffect(() => {
    if (qrType === 'WiFi') {
      setQrText(`WIFI:T:${wifiSecurity};S:${wifiSsid};P:${wifiPassword};;`);
    } else if (qrType === 'vCard') {
      setQrText(`BEGIN:VCARD\nVERSION:3.0\nN:${vCardName}\nORG:${vCardOrg}\nTEL:${vCardPhone}\nEMAIL:${vCardEmail}\nEND:VCARD`);
    }
  }, [qrType, wifiSsid, wifiPassword, wifiSecurity, vCardName, vCardOrg, vCardPhone, vCardEmail]);

  const saveQrToHistory = () => {
    if (!qrLabel.trim()) return alert('Please enter a label for this QR code');
    if (!qrText.trim()) return alert('Please enter text or a URL for the QR code');

    const newQr = {
      id: `qr-${Date.now()}`,
      label: qrLabel,
      text: qrText,
      fgColor: qrFgColor,
      bgColor: qrBgColor,
      type: qrType,
      date: new Date().toISOString().split('T')[0]
    };

    const updated = [newQr, ...qrHistory];
    setQrHistory(updated);
    localStorage.setItem('qr_history_list', JSON.stringify(updated));
    alert('QR code successfully generated and added to library!');
  };

  const deleteQrFromHistory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this QR code from history?')) {
      const updated = qrHistory.filter(item => item.id !== id);
      setQrHistory(updated);
      localStorage.setItem('qr_history_list', JSON.stringify(updated));
    }
  };

  const loadQrCode = (item: any) => {
    setQrLabel(item.label);
    setQrType(item.type || 'URL');
    setQrFgColor(item.fgColor);
    setQrBgColor(item.bgColor);
    setQrText(item.text);
    
    // Parse WiFi if applicable
    if (item.type === 'WiFi') {
      const ssidMatch = item.text.match(/S:([^;]+)/);
      const passMatch = item.text.match(/P:([^;]+)/);
      const secMatch = item.text.match(/T:([^;]+)/);
      if (ssidMatch) setWifiSsid(ssidMatch[1]);
      if (passMatch) setWifiPassword(passMatch[1]);
      if (secMatch) setWifiSecurity(secMatch[1]);
    }
    // Parse vCard if applicable
    if (item.type === 'vCard') {
      const nameMatch = item.text.match(/N:([^\n]+)/);
      const orgMatch = item.text.match(/ORG:([^\n]+)/);
      const phoneMatch = item.text.match(/TEL:([^\n]+)/);
      const emailMatch = item.text.match(/EMAIL:([^\n]+)/);
      if (nameMatch) setVCardName(nameMatch[1].trim());
      if (orgMatch) setVCardOrg(orgMatch[1].trim());
      if (phoneMatch) setVCardPhone(phoneMatch[1].trim());
      if (emailMatch) setVCardEmail(emailMatch[1].trim());
    }
  };

  const handleDownloadPNG = async (text: string, fgColor: string, bgColor: string, size: string) => {
    try {
      const cleanFg = fgColor.replace('#', '');
      const cleanBg = bgColor.replace('#', '');
      const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&color=${cleanFg}&bgcolor=${cleanBg}&margin=20`;
      
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `qrcode-${qrLabel.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      alert('Failed to download high-resolution QR code. Please try again.');
    }
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject) return;
    onAddTicket({
      subject: ticketSubject,
      priority: ticketPriority,
      assignedTo: ticketAssignee
    });
    setTicketSubject('');
    setShowTicketModal(false);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage) return;
    setChatMessages([
      ...chatMessages,
      { id: Date.now(), sender: 'Zara Khan', msg: newMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    setNewMessage('');
  };

  const filteredKb = kbArticles.filter(art => 
    art.title.toLowerCase().includes(kbSearch.toLowerCase()) ||
    art.desc.toLowerCase().includes(kbSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Panel Header */}
      {subTab !== 'tickets' && subTab !== 'calendar' && subTab !== 'events' && subTab !== 'messages' && subTab !== 'notices' && subTab !== 'knowledgebase' && subTab !== 'assets' && subTab !== 'biolinks' && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight capitalize">
              {subTab}
            </h2>
            <p className="text-xs text-slate-500 font-medium">Keep company teams connected, log issues, and query organizational documentation.</p>
          </div>
          <div>
            {subTab === 'tickets' && (
              <button
                id="misc-add-ticket-btn"
                onClick={() => setShowTicketModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Raise Ticket</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 0. PERSONAL INTERACTIVE CALENDAR */}
      {subTab === 'calendar' && (
        <EventsView 
          subTab="calendar"
          clients={clients}
          projects={projects}
          employees={employees}
        />
      )}

      {/* 1. SUPPORT HELP TICKETS */}
      {subTab === 'tickets' && (
        <TicketsView 
          clients={clients}
          projects={projects}
          employees={employees}
          initialTickets={tickets}
          onAddTicket={onAddTicket}
          onResolveTicket={onResolveTicket}
        />
      )}

      {/* 2. NOTICE BOARD */}
      {subTab === 'notices' && (
        <NoticesView 
          initialNotices={notices}
          employees={employees}
          clients={clients}
        />
      )}

      {/* 3. KNOWLEDGE BASE */}
      {subTab === 'knowledgebase' && (
        <KnowledgeBaseView 
          employees={employees}
          clients={clients}
        />
      )}

      {/* 4. COMPANY EVENTS */}
      {subTab === 'events' && (
        <EventsView 
          subTab="events"
          clients={clients}
          projects={projects}
          employees={employees}
        />
      )}

      {/* 5. INTERNAL SECURE MESSAGES */}
      {subTab === 'messages' && (
        <MessagesView 
          employees={employees}
          clients={clients}
        />
      )}

      {/* 6. ASSETS MANAGEMENT */}
      {subTab === 'assets' && (
        <AssetsView 
          employees={employees}
        />
      )}

      {/* 7. BIOLINKS CREATOR */}
      {subTab === 'biolinks' && (
        <BioLinksView />
      )}

      {/* 8. QR CODE GENERATOR */}
      {subTab === 'qrcode' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in text-left">
          {/* Controls - Left panel */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="h-8 w-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                <QrCode className="h-4 w-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900 font-sans tracking-tight">QR Code Creator</h3>
            </div>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Design, customize, and save secure corporate QR codes mapped to local network or cloud services.
            </p>
            
            <div className="space-y-3.5 pt-2">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wide mb-1">QR Code Title / Label</label>
                <input 
                  type="text" 
                  value={qrLabel} 
                  onChange={e => setQrLabel(e.target.value)} 
                  className="w-full bg-slate-50 text-slate-800 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-bold" 
                  placeholder="e.g. Guest Wi-Fi Access"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wide mb-1">Information Encoding Type</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {['URL', 'WiFi', 'Text', 'vCard'].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setQrType(type)}
                      className={`py-1.5 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                        qrType === type 
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs' 
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic inputs based on encoding type */}
              {qrType === 'URL' && (
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wide mb-1">Target URL Address</label>
                  <input 
                    type="url" 
                    value={qrText} 
                    onChange={e => setQrText(e.target.value)} 
                    className="w-full bg-slate-50 text-slate-800 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-mono" 
                    placeholder="https://example.com"
                  />
                </div>
              )}

              {qrType === 'Text' && (
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wide mb-1">Plain Text Message</label>
                  <textarea 
                    rows={2}
                    value={qrText} 
                    onChange={e => setQrText(e.target.value)} 
                    className="w-full bg-slate-50 text-slate-800 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-mono resize-none" 
                    placeholder="Enter message text..."
                  />
                </div>
              )}

              {qrType === 'WiFi' && (
                <div className="space-y-2.5 p-3 bg-slate-50/50 border border-slate-100 rounded-xl">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wide mb-1">Network Name (SSID)</label>
                    <input 
                      type="text" 
                      value={wifiSsid} 
                      onChange={e => setWifiSsid(e.target.value)} 
                      className="w-full bg-white text-slate-800 text-xs p-2 rounded-lg border border-slate-200 focus:outline-none" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wide mb-1">Password</label>
                      <input 
                        type="password" 
                        value={wifiPassword} 
                        onChange={e => setWifiPassword(e.target.value)} 
                        className="w-full bg-white text-slate-800 text-xs p-2 rounded-lg border border-slate-200 focus:outline-none" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wide mb-1">Security Type</label>
                      <select 
                        value={wifiSecurity} 
                        onChange={e => setWifiSecurity(e.target.value)} 
                        className="w-full bg-white text-slate-800 text-xs p-2 rounded-lg border border-slate-200 focus:outline-none font-bold"
                      >
                        <option value="WPA">WPA/WPA2</option>
                        <option value="WEP">WEP</option>
                        <option value="nopass">Unsecured</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {qrType === 'vCard' && (
                <div className="space-y-2.5 p-3 bg-slate-50/50 border border-slate-100 rounded-xl">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wide mb-1">Full Name</label>
                      <input 
                        type="text" 
                        value={vCardName} 
                        onChange={e => setVCardName(e.target.value)} 
                        className="w-full bg-white text-slate-800 text-xs p-2 rounded-lg border border-slate-200 focus:outline-none" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wide mb-1">Organization</label>
                      <input 
                        type="text" 
                        value={vCardOrg} 
                        onChange={e => setVCardOrg(e.target.value)} 
                        className="w-full bg-white text-slate-800 text-xs p-2 rounded-lg border border-slate-200 focus:outline-none" 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wide mb-1">Contact Phone</label>
                      <input 
                        type="text" 
                        value={vCardPhone} 
                        onChange={e => setVCardPhone(e.target.value)} 
                        className="w-full bg-white text-slate-800 text-xs p-2 rounded-lg border border-slate-200 focus:outline-none font-mono" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wide mb-1">Email Address</label>
                      <input 
                        type="email" 
                        value={vCardEmail} 
                        onChange={e => setVCardEmail(e.target.value)} 
                        className="w-full bg-white text-slate-800 text-xs p-2 rounded-lg border border-slate-200 focus:outline-none font-mono" 
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Design controls */}
              <div className="grid grid-cols-2 gap-3.5 border-t border-slate-100 pt-3">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wide mb-1">Foreground Color</label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      value={qrFgColor} 
                      onChange={e => setQrFgColor(e.target.value)} 
                      className="w-10 h-10 bg-slate-50 border border-slate-200 rounded-lg p-1 cursor-pointer shrink-0" 
                    />
                    <input 
                      type="text" 
                      value={qrFgColor} 
                      onChange={e => setQrFgColor(e.target.value)} 
                      className="w-full bg-slate-50 text-slate-800 text-xs p-2 rounded-lg border border-slate-200 focus:outline-none font-mono uppercase" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wide mb-1">Background Color</label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      value={qrBgColor} 
                      onChange={e => setQrBgColor(e.target.value)} 
                      className="w-10 h-10 bg-slate-50 border border-slate-200 rounded-lg p-1 cursor-pointer shrink-0" 
                    />
                    <input 
                      type="text" 
                      value={qrBgColor} 
                      onChange={e => setQrBgColor(e.target.value)} 
                      className="w-full bg-slate-50 text-slate-800 text-xs p-2 rounded-lg border border-slate-200 focus:outline-none font-mono uppercase" 
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wide mb-1">Export Sizing Resolution</label>
                <select 
                  value={qrSize} 
                  onChange={e => setQrSize(e.target.value)} 
                  className="w-full bg-slate-50 text-slate-800 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none font-bold"
                >
                  <option value="128">128 x 128 px (Lightweight Screen)</option>
                  <option value="256">256 x 256 px (Standard)</option>
                  <option value="512">512 x 512 px (High Definition)</option>
                  <option value="1024">1024 x 1024 px (Vector Print)</option>
                </select>
              </div>
            </div>

            <button 
              onClick={saveQrToHistory} 
              className="w-full bg-[#1890ff] hover:bg-[#40a9ff] text-white text-xs font-bold py-3 rounded-xl transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5 mt-2"
            >
              <Plus className="h-4 w-4" />
              <span>Generate and Save QR</span>
            </button>
          </div>

          {/* Right Column: Live Preview & History Library */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Live Preview Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col items-center justify-center space-y-5">
              <div className="flex items-center justify-between w-full border-b border-slate-100 pb-2">
                <span className="text-[10px] font-black text-slate-400 font-mono tracking-wide">SECURE QR CODE LIVE CANVAS</span>
                <span className="text-[10px] text-emerald-500 font-bold bg-emerald-50 px-2 py-0.5 rounded-full uppercase font-mono animate-pulse">Live link active</span>
              </div>

              {/* Dynamic high-fidelity QR Code from API */}
              <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center">
                <div className="bg-white p-4.5 border border-slate-150 rounded-2xl shadow-xs">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(qrText)}&color=${qrFgColor.replace('#', '')}&bgcolor=${qrBgColor.replace('#', '')}&margin=15`}
                    alt="Active Enterprise QR Code"
                    className="w-48 h-48 select-none border border-slate-50 rounded-lg shadow-2xs"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-mono font-medium max-w-xs text-center mt-3 truncate w-full" title={qrText}>
                  Raw: {qrText}
                </p>
              </div>

              <div className="flex gap-2 w-full font-sans">
                <button 
                  onClick={() => handleDownloadPNG(qrText, qrFgColor, qrBgColor, qrSize)} 
                  className="flex-1 bg-slate-900 hover:bg-slate-950 text-white text-xs font-semibold py-2.5 rounded-xl text-center cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Download className="h-4 w-4" />
                  <span>Download QR PNG</span>
                </button>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(qrText);
                    alert('Raw QR code text contents copied to clipboard!');
                  }} 
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl text-center cursor-pointer flex items-center gap-1.5"
                >
                  <Copy className="h-4 w-4" />
                  <span>Copy Raw Data</span>
                </button>
              </div>
            </div>

            {/* History List Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 flex-1">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <h4 className="text-xs font-black text-slate-900 font-mono uppercase tracking-wide">Saved QR Codes Library</h4>
                <span className="text-[10px] text-slate-400 font-bold font-mono bg-slate-50 px-2 py-0.5 rounded-full">{qrHistory.length} saved</span>
              </div>

              {qrHistory.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs font-medium">
                  No saved QR codes in history yet. Generate one to store it here.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto max-h-[220px] pr-1 scrollbar-thin">
                  {qrHistory.map(item => (
                    <div 
                      key={item.id} 
                      onClick={() => loadQrCode(item)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-2.5 select-none text-left ${
                        qrLabel === item.label && qrText === item.text 
                          ? 'bg-indigo-50/50 border-indigo-200 shadow-xs' 
                          : 'bg-slate-50/50 border-slate-150 hover:bg-slate-50'
                      }`}
                    >
                      {/* Mini QR thumb */}
                      <div className="h-10 w-10 bg-white border border-slate-200 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=${encodeURIComponent(item.text)}&color=${item.fgColor.replace('#', '')}&bgcolor=${item.bgColor.replace('#', '')}`}
                          alt="Thumbnail" 
                          className="h-8 w-8 object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <h5 className="text-[11px] font-bold text-slate-800 truncate" title={item.label}>{item.label}</h5>
                        <p className="text-[9px] text-slate-400 font-mono truncate" title={item.text}>{item.text}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[8px] font-black uppercase text-indigo-600 bg-indigo-50 px-1 py-0.2 rounded-sm">{item.type || 'URL'}</span>
                          <span className="text-[8px] text-slate-400 font-mono font-medium">{item.date}</span>
                        </div>
                      </div>

                      <button 
                        onClick={(e) => deleteQrFromHistory(item.id, e)}
                        className="text-slate-300 hover:text-red-500 p-1 hover:bg-white rounded-lg transition-colors cursor-pointer shrink-0 animate-fade-in"
                        title="Delete record"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 9. LETTER TEMPLATES & GENERATOR */}
      {subTab.startsWith('letter-') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          {/* Builder Controls */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Standard Letter Generator</h3>
            <p className="text-xs text-slate-500 font-medium">Quick-draft, edit, and print official letters (Offer Letters, Appreciations, Appraisals) using authorized templates.</p>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Select Base Template</label>
                <select className="w-full bg-slate-50 text-slate-800 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none">
                  <option value="offer">Employment Offer Letter</option>
                  <option value="appraisal">Performance Appraisal Letter</option>
                  <option value="warning">Standard Workspace Warning Notification</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Candidate / Staff Name</label>
                <input type="text" defaultValue="John Doe" className="w-full bg-slate-50 text-slate-800 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Target Job Title</label>
                <input type="text" defaultValue="Senior Product Designer" className="w-full bg-slate-50 text-slate-800 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Offered Annual Salary</label>
                  <input type="text" defaultValue="$115,000" className="w-full bg-slate-50 text-slate-800 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Offer Expiry Date</label>
                  <input type="date" defaultValue="2026-07-15" className="w-full bg-slate-50 text-slate-800 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none font-mono" />
                </div>
              </div>
            </div>
            <button onClick={() => alert('Corporate Letter updated successfully!')} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2.5 rounded-xl transition-colors cursor-pointer shadow-xs">
              Generate & Render Letter
            </button>
          </div>

          {/* Rendered letter block preview */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-8 space-y-6 shadow-sm overflow-x-auto min-w-[340px]">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <h4 className="text-base font-black tracking-wider text-slate-900 uppercase">WORKSUITE S.R.L</h4>
                <p className="text-[10px] text-slate-400 font-mono">100 Pine Street, San Francisco, CA 94111</p>
              </div>
              <div className="w-10 h-10 bg-indigo-600 rounded flex items-center justify-center text-white font-black text-xl">W</div>
            </div>

            <div className="space-y-4 text-xs text-slate-800 leading-relaxed font-serif">
              <p className="font-mono text-slate-500 text-[10px]">Reference Code: WS-OFFER-2026-902A</p>
              <p className="font-bold">Date: July 4, 2026</p>

              <div className="space-y-0.5 font-sans">
                <p className="font-bold">To: John Doe</p>
                <p className="text-slate-500 text-[11px]">Candidate Pool ID: CAND-9912A</p>
              </div>

              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-l-2 border-indigo-500 pl-2 py-0.5 font-sans">
                Subject: Offer of Employment — Senior Product Designer
              </h3>

              <p>
                We are absolutely thrilled to offer you the position of <strong className="font-sans text-indigo-700">Senior Product Designer</strong> at Worksuite Corp! 
                This offer is contingent upon successful biometric mapping credentials setup.
              </p>

              <p>
                Your annual base remuneration is set at <strong className="font-mono text-indigo-700">$115,000 USD</strong>, payable bi-monthly in equal installments via our secure payroll ledger. 
                Your scheduled join date is July 20, 2026.
              </p>

              <p>
                Please sign and scan this document prior to <strong className="font-sans">July 15, 2026</strong> to secure your starting date. We look forward to welcome you onto our digital team!
              </p>

              <div className="pt-6 flex justify-between items-end font-sans">
                <div>
                  <div className="h-10 w-24 border-b border-slate-300 italic text-slate-400 flex items-end pb-1 text-[11px]">Authorized Sign</div>
                  <p className="font-bold text-slate-900 mt-2">Zara Khan</p>
                  <p className="text-[10px] text-slate-500">Executive Director HR</p>
                </div>
                <div className="text-right">
                  <div className="h-10 w-24 border-b border-slate-300"></div>
                  <p className="font-bold text-slate-900 mt-2">John Doe</p>
                  <p className="text-[10px] text-slate-500">Candidate Signature</p>
                </div>
              </div>
            </div>

            <button onClick={() => window.print()} className="w-full bg-slate-900 hover:bg-slate-950 text-white text-xs font-semibold py-2 rounded-xl text-center cursor-pointer shadow-xs transition-colors font-sans">
              Print Letter (PDF Export)
            </button>
          </div>
        </div>
      )}

      {/* TICKET ADD MODAL */}
      {showTicketModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-100 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Raise Support Ticket</h3>
            <form onSubmit={handleTicketSubmit} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Support Topic / Subject</label>
                <input
                  type="text" required
                  className="w-full bg-slate-50 text-slate-800 text-xs p-2 rounded-lg border border-slate-200 focus:outline-none"
                  placeholder="e.g. Database API endpoint latency spiking"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Priority Severity</label>
                  <select
                    className="w-full bg-slate-50 text-slate-800 text-xs p-2 rounded-lg border border-slate-200 focus:outline-none"
                    value={ticketPriority}
                    onChange={(e) => setTicketPriority(e.target.value as 'Urgent' | 'High' | 'Medium' | 'Low')}
                  >
                    <option value="Urgent">Urgent Severity</option>
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium State</option>
                    <option value="Low">Low Utility</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Assignee Owner</label>
                  <select
                    className="w-full bg-slate-50 text-slate-800 text-xs p-2 rounded-lg border border-slate-200 focus:outline-none"
                    value={ticketAssignee}
                    onChange={(e) => setTicketAssignee(e.target.value)}
                  >
                    <option value="Elena Rostova">Elena Rostova</option>
                    <option value="James Carter">James Carter</option>
                    <option value="Daniel Park">Daniel Park</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTicketModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4 py-2 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-xl"
                >
                  Generate Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
