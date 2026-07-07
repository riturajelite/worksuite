import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, Plus, MoreVertical, Send, Smile, Paperclip, 
  Image as ImageIcon, Trash2, Check, CheckCheck, MessageSquare, 
  X, Bold, Italic, Underline, Link2, List, ListOrdered, AlignLeft,
  UserPlus, FileText
} from 'lucide-react';
import { Employee, Client } from '../../types';

interface Message {
  id: string;
  senderId: string; // "me" or employee/client ID
  senderName: string;
  senderAvatar?: string;
  content: string;
  time: string;
  isRead: boolean;
  attachments?: { name: string; type: string; size: string; previewUrl?: string }[];
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  role: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  online: boolean;
  messages: Message[];
}

interface MessagesViewProps {
  employees: Employee[];
  clients: Client[];
}

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    name: 'Elena Rostova',
    role: 'Senior Project Manager',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    lastMessage: 'Hi Zara, did you approve the budget for the SaaS Redesign?',
    time: '09:15 AM',
    unreadCount: 2,
    online: true,
    messages: [
      { id: 'm1_1', senderId: 'c1', senderName: 'Elena Rostova', content: 'Hi Zara, did you approve the budget for the SaaS Redesign?', time: '09:15 AM', isRead: true }
    ]
  },
  {
    id: 'c2',
    name: 'James Carter',
    role: 'Infrastructure Architect',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    lastMessage: 'Vite configurations are fully secured now. Let me know when you run the deploy.',
    time: 'Yesterday',
    unreadCount: 0,
    online: true,
    messages: [
      { id: 'm2_1', senderId: 'me', senderName: 'Zara Khan', content: 'James, are the servers ready for the cluster migration?', time: '04:30 PM', isRead: true },
      { id: 'm2_2', senderId: 'c2', senderName: 'James Carter', content: 'Vite configurations are fully secured now. Let me know when you run the deploy.', time: '04:35 PM', isRead: true }
    ]
  },
  {
    id: 'c3',
    name: 'Daniel Park',
    role: 'Full-stack Developer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    lastMessage: 'Sounds good, let me check the webhook logs.',
    time: '2 days ago',
    unreadCount: 0,
    online: false,
    messages: [
      { id: 'm3_1', senderId: 'c3', senderName: 'Daniel Park', content: 'We need to recalibrate the biometric scanners in the lobby.', time: '10:00 AM', isRead: true },
      { id: 'm3_2', senderId: 'me', senderName: 'Zara Khan', content: 'Agreed, I raised an internal ticket for that.', time: '10:05 AM', isRead: true },
      { id: 'm3_3', senderId: 'c3', senderName: 'Daniel Park', content: 'Sounds good, let me check the webhook logs.', time: '10:10 AM', isRead: true }
    ]
  }
];

export default function MessagesView({ employees, clients }: MessagesViewProps) {
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Chat input states
  const [inputText, setInputText] = useState('');
  const [editorBold, setEditorBold] = useState(false);
  const [editorItalic, setEditorItalic] = useState(false);
  const [editorUnderline, setEditorUnderline] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<{ name: string; type: string; size: string; previewUrl?: string }[]>([]);

  // New conversation modal states
  const [showNewModal, setShowNewModal] = useState(false);
  const [newRecipientId, setNewRecipientId] = useState('');
  const [newMsgText, setNewMsgText] = useState('');
  const [newAttachedFiles, setNewAttachedFiles] = useState<{ name: string; type: string; size: string; previewUrl?: string }[]>([]);

  // Active chat details
  const activeConversation = conversations.find(c => c.id === selectedConversationId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages, selectedConversationId]);

  // Handle Mark as Read
  const handleSelectConversation = (id: string) => {
    setSelectedConversationId(id);
    setConversations(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, unreadCount: 0 };
      }
      return c;
    }));
  };

  // Filtered contacts
  const filteredConversations = conversations.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() && attachedFiles.length === 0) return;

    if (!selectedConversationId) return;

    let finalMessage = inputText;
    // Format text if editor styles are on
    if (editorBold) finalMessage = `**${finalMessage}**`;
    if (editorItalic) finalMessage = `*${finalMessage}*`;
    if (editorUnderline) finalMessage = `<u>${finalMessage}</u>`;

    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      senderId: 'me',
      senderName: 'Zara Khan',
      content: finalMessage || 'Sent an attachment',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
      attachments: attachedFiles.length > 0 ? attachedFiles : undefined
    };

    setConversations(prev => prev.map(c => {
      if (c.id === selectedConversationId) {
        return {
          ...c,
          lastMessage: inputText ? inputText : 'File Attachment',
          time: 'Just now',
          messages: [...c.messages, newMsg]
        };
      }
      return c;
    }));

    setInputText('');
    setAttachedFiles([]);
    setEditorBold(false);
    setEditorItalic(false);
    setEditorUnderline(false);
  };

  // Drag and drop handler for chat attachments
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const array = Array.from(files).map((file: any) => {
        const isImage = file.type.startsWith('image/');
        return {
          name: file.name,
          type: file.type,
          size: `${(file.size / 1024).toFixed(1)} KB`,
          previewUrl: isImage ? URL.createObjectURL(file) : undefined
        };
      });
      setAttachedFiles(prev => [...prev, ...array]);
    }
  };

  // Modal recipient options
  const recipientOptions = [
    ...employees.map(emp => ({ id: `emp-${emp.id}`, name: emp.name, role: emp.designation, avatar: emp.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100' })),
    ...clients.map(cli => ({ id: `cli-${cli.id}`, name: cli.name, role: `Client @ ${cli.company}`, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100' }))
  ];

  // Drag & Drop state inside Modal
  const [modalDragActive, setModalDragActive] = useState(false);
  const modalFileInputRef = useRef<HTMLInputElement>(null);

  const handleModalDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setModalDragActive(true);
    } else if (e.type === 'dragleave') {
      setModalDragActive(false);
    }
  };

  const handleModalDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setModalDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = e.dataTransfer.files;
      const array = Array.from(files).map((file: any) => ({
        name: file.name,
        type: file.type,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
      }));
      setNewAttachedFiles(prev => [...prev, ...array]);
    }
  };

  const handleModalFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const array = Array.from(files).map((file: any) => ({
        name: file.name,
        type: file.type,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
      }));
      setNewAttachedFiles(prev => [...prev, ...array]);
    }
  };

  const handleStartNewConversation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecipientId || (!newMsgText.trim() && newAttachedFiles.length === 0)) return;

    const recipient = recipientOptions.find(r => r.id === newRecipientId);
    if (!recipient) return;

    // Check if conversation already exists
    const existingIndex = conversations.findIndex(c => c.name === recipient.name);
    if (existingIndex !== -1) {
      // Add message to existing conversation
      const newMsg: Message = {
        id: `msg_${Date.now()}`,
        senderId: 'me',
        senderName: 'Zara Khan',
        content: newMsgText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: false,
        attachments: newAttachedFiles.length > 0 ? newAttachedFiles : undefined
      };
      setConversations(prev => {
        const copy = [...prev];
        copy[existingIndex] = {
          ...copy[existingIndex],
          lastMessage: newMsgText || 'Sent attachments',
          time: 'Just now',
          messages: [...copy[existingIndex].messages, newMsg]
        };
        return copy;
      });
      setSelectedConversationId(conversations[existingIndex].id);
    } else {
      // Create brand new conversation
      const newId = `c_${Date.now()}`;
      const newConv: Conversation = {
        id: newId,
        name: recipient.name,
        role: recipient.role,
        avatar: recipient.avatar,
        lastMessage: newMsgText || 'Sent attachments',
        time: 'Just now',
        unreadCount: 0,
        online: true,
        messages: [
          {
            id: `msg_${Date.now()}`,
            senderId: 'me',
            senderName: 'Zara Khan',
            content: newMsgText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isRead: true,
            attachments: newAttachedFiles.length > 0 ? newAttachedFiles : undefined
          }
        ]
      };
      setConversations(prev => [newConv, ...prev]);
      setSelectedConversationId(newId);
    }

    // Reset states and close modal
    setNewRecipientId('');
    setNewMsgText('');
    setNewAttachedFiles([]);
    setShowNewModal(false);
  };

  const addEmoji = (emoji: string) => {
    setInputText(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const emojis = ['😀', '😂', '😍', '👍', '🔥', '🎉', '🙌', '💡', '🚀', '⭐', '❤️', '👏'];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Messages Main Layout Panel */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col md:flex-row h-[600px]" id="messages-module-canvas">
        
        {/* LEFT PANEL: Conversation list */}
        <div className="w-full md:w-80 border-r border-slate-200 flex flex-col h-full bg-white shrink-0">
          {/* Panel Search & Action */}
          <div className="p-4 border-b border-slate-200 bg-slate-50/50 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-900 font-mono flex items-center gap-2">
                <MessageSquare className="h-4.5 w-4.5 text-indigo-600" />
                <span>Internal Chat</span>
              </h3>
              <button
                id="btn-new-conversation"
                onClick={() => setShowNewModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>New chat</span>
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search direct messages..."
                className="w-full bg-white text-slate-800 text-xs pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Conversation list */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 scrollbar-thin">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-slate-400 space-y-2">
                <MessageSquare className="h-8 w-8 mx-auto text-slate-300" />
                <p className="text-xs font-medium">No discussions found</p>
              </div>
            ) : (
              filteredConversations.map(conv => (
                <div
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv.id)}
                  className={`p-3.5 flex items-start gap-3 cursor-pointer hover:bg-slate-50 transition-colors relative group ${
                    selectedConversationId === conv.id ? 'bg-indigo-50/40 border-l-4 border-indigo-600' : ''
                  }`}
                >
                  {/* User Avatar with status */}
                  <div className="relative shrink-0">
                    <img
                      src={conv.avatar}
                      alt={conv.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    {conv.online && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                    )}
                  </div>

                  {/* Message details */}
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex justify-between items-baseline">
                      <h4 className="text-xs font-bold text-slate-800 truncate">{conv.name}</h4>
                      <span className="text-[10px] text-slate-400 font-medium font-mono shrink-0">{conv.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate font-medium">{conv.lastMessage}</p>
                    <span className="text-[9px] text-slate-400 font-mono block font-medium">{conv.role}</span>
                  </div>

                  {/* Unread & Action Indicators */}
                  <div className="flex flex-col items-end gap-1 shrink-0 self-center">
                    {conv.unreadCount > 0 && (
                      <span className="bg-indigo-600 text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center font-mono">
                        {conv.unreadCount}
                      </span>
                    )}
                    <button 
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-slate-600 rounded transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        alert(`Manage discussion options for ${conv.name}`);
                      }}
                    >
                      <MoreVertical className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT PANEL: Chat History or Empty State */}
        <div className="flex-1 flex flex-col h-full bg-slate-50/50">
          {activeConversation ? (
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-3">
                  <img
                    src={activeConversation.avatar}
                    alt={activeConversation.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{activeConversation.name}</h4>
                    <p className="text-[10px] text-slate-500 font-medium">
                      {activeConversation.online ? 'Online' : 'Away'} • {activeConversation.role}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 rounded-full border border-emerald-100">
                    Secure Peer SSL
                  </span>
                </div>
              </div>

              {/* Chat history scrollable */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin bg-slate-50/30">
                {activeConversation.messages.map(m => {
                  const isMe = m.senderId === 'me';
                  return (
                    <div key={m.id} className={`flex gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}>
                      {!isMe && (
                        <img
                          src={activeConversation.avatar}
                          alt={m.senderName}
                          referrerPolicy="no-referrer"
                          className="w-7 h-7 rounded-full object-cover self-end shrink-0"
                        />
                      )}
                      <div className="max-w-[75%] space-y-1">
                        <div className={`p-3 rounded-2xl shadow-2xs text-xs leading-relaxed ${
                          isMe 
                            ? 'bg-indigo-600 text-white rounded-br-none' 
                            : 'bg-white text-slate-800 rounded-bl-none border border-slate-200/60'
                        }`}>
                          {/* Parse bold/italic preview markup on frontend */}
                          <p className="font-medium whitespace-pre-wrap">
                            {m.content.startsWith('**') && m.content.endsWith('**') ? (
                              <strong className="font-bold">{m.content.slice(2, -2)}</strong>
                            ) : m.content.startsWith('*') && m.content.endsWith('*') ? (
                              <span className="italic">{m.content.slice(1, -1)}</span>
                            ) : m.content}
                          </p>

                          {/* Image preview support */}
                          {m.attachments?.map((att, attIdx) => (
                            <div key={attIdx} className="mt-2 pt-2 border-t border-white/20 space-y-1">
                              {att.previewUrl ? (
                                <div className="rounded-lg overflow-hidden border border-white/10 max-w-[180px]">
                                  <img src={att.previewUrl} alt={att.name} className="object-cover max-h-36 w-full" />
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 bg-black/10 text-white px-2 py-1.5 rounded-lg text-[10px] font-mono">
                                  <FileText className="h-3.5 w-3.5 shrink-0" />
                                  <span className="truncate">{att.name}</span>
                                  <span className="opacity-70 text-[9px] shrink-0">({att.size})</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        <div className={`flex items-center gap-1 text-[9px] text-slate-400 font-mono ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <span>{m.time}</span>
                          {isMe && (
                            <span>
                              {m.isRead ? <CheckCheck className="h-3 w-3 text-indigo-500" /> : <Check className="h-3 w-3" />}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input / Rich text editor panel */}
              <div className="p-3 bg-white border-t border-slate-200">
                <form onSubmit={handleSendMessage} className="space-y-2">
                  
                  {/* Rich Text Toolbar */}
                  <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100 text-slate-500">
                    <button
                      type="button"
                      onClick={() => setEditorBold(!editorBold)}
                      className={`p-1.5 rounded hover:bg-slate-100 transition-colors ${editorBold ? 'bg-indigo-50 text-indigo-600' : ''}`}
                      title="Bold text"
                    >
                      <Bold className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditorItalic(!editorItalic)}
                      className={`p-1.5 rounded hover:bg-slate-100 transition-colors ${editorItalic ? 'bg-indigo-50 text-indigo-600' : ''}`}
                      title="Italic text"
                    >
                      <Italic className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditorUnderline(!editorUnderline)}
                      className={`p-1.5 rounded hover:bg-slate-100 transition-colors ${editorUnderline ? 'bg-indigo-50 text-indigo-600' : ''}`}
                      title="Underline text"
                    >
                      <Underline className="h-3.5 w-3.5" />
                    </button>
                    <div className="w-px h-4 bg-slate-200 mx-1" />
                    
                    {/* Attachments buttons */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-1.5 rounded hover:bg-slate-100 text-slate-500 transition-colors"
                      title="Attach file"
                    >
                      <Paperclip className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (fileInputRef.current) {
                          fileInputRef.current.accept = "image/*";
                          fileInputRef.current.click();
                        }
                      }}
                      className="p-1.5 rounded hover:bg-slate-100 text-slate-500 transition-colors"
                      title="Attach image"
                    >
                      <ImageIcon className="h-3.5 w-3.5" />
                    </button>

                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className={`p-1.5 rounded hover:bg-slate-100 text-slate-500 transition-colors ${showEmojiPicker ? 'bg-indigo-50 text-indigo-600' : ''}`}
                        title="Add emoji"
                      >
                        <Smile className="h-3.5 w-3.5" />
                      </button>

                      {/* Floating emoji picker */}
                      {showEmojiPicker && (
                        <div className="absolute bottom-8 left-0 bg-white border border-slate-200 rounded-xl shadow-xl p-2.5 grid grid-cols-4 gap-1 z-40">
                          {emojis.map(emo => (
                            <button
                              key={emo}
                              type="button"
                              onClick={() => addEmoji(emo)}
                              className="w-7 h-7 text-sm hover:bg-slate-100 rounded flex items-center justify-center transition-colors"
                            >
                              {emo}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleFileAttach}
                      multiple
                    />
                  </div>

                  {/* Input field area */}
                  <div className="space-y-1.5">
                    {/* Attachment preview list */}
                    {attachedFiles.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {attachedFiles.map((f, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 pl-2 pr-1 py-1 rounded-lg text-[10px]">
                            {f.previewUrl ? (
                              <img src={f.previewUrl} alt={f.name} className="w-4 h-4 object-cover rounded" />
                            ) : (
                              <Paperclip className="h-3 w-3 text-slate-400" />
                            )}
                            <span className="truncate max-w-[120px] text-slate-700 font-medium font-mono">{f.name}</span>
                            <button
                              type="button"
                              onClick={() => setAttachedFiles(prev => prev.filter((_, i) => i !== idx))}
                              className="p-0.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Type a message or drop formatted guidelines here..."
                        className="flex-1 bg-slate-50 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200/80 focus:outline-none focus:border-indigo-500 font-medium"
                      />
                      <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-xl cursor-pointer shadow-sm transition-colors flex items-center justify-center shrink-0"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-indigo-50 border border-indigo-100/50 flex items-center justify-center text-indigo-600">
                <MessageSquare className="h-8 w-8" />
              </div>
              <div className="space-y-1 max-w-sm">
                <h4 className="text-sm font-bold text-slate-800">Select a conversation to send a message</h4>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">
                  Start a direct workspace discussion channel with team developers, clients, or regional coordinators.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* NEW CONVERSATION MODAL */}
      {showNewModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-100 shadow-2xl space-y-5 mx-4">
            
            {/* Header */}
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-900 font-mono uppercase tracking-wide flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-indigo-600" />
                <span>Start Conversation Thread</span>
              </h3>
              <button 
                onClick={() => setShowNewModal(false)}
                className="text-slate-400 hover:text-slate-600 rounded-lg p-1 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleStartNewConversation} className="space-y-4">
              {/* Member Selector Dropdown */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Choose Member</label>
                <select
                  required
                  value={newRecipientId}
                  onChange={(e) => setNewRecipientId(e.target.value)}
                  className="w-full bg-slate-50 text-slate-800 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-bold"
                >
                  <option value="">-- Choose a developer, manager or client --</option>
                  {recipientOptions.map(rec => (
                    <option key={rec.id} value={rec.id}>
                      {rec.name} ({rec.role})
                    </option>
                  ))}
                </select>
              </div>

              {/* Simulated Rich Text Editor */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Initial Message Content</label>
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                  {/* Fake toolbar */}
                  <div className="flex items-center gap-1.5 p-2 bg-white border-b border-slate-200 text-slate-400">
                    <Bold className="h-3.5 w-3.5 cursor-pointer hover:text-slate-600" />
                    <Italic className="h-3.5 w-3.5 cursor-pointer hover:text-slate-600" />
                    <Underline className="h-3.5 w-3.5 cursor-pointer hover:text-slate-600" />
                    <div className="w-px h-4 bg-slate-200 mx-1" />
                    <List className="h-3.5 w-3.5 cursor-pointer hover:text-slate-600" />
                    <ListOrdered className="h-3.5 w-3.5 cursor-pointer hover:text-slate-600" />
                    <AlignLeft className="h-3.5 w-3.5 cursor-pointer hover:text-slate-600" />
                    <div className="w-px h-4 bg-slate-200 mx-1" />
                    <Link2 className="h-3.5 w-3.5 cursor-pointer hover:text-slate-600" />
                  </div>
                  <textarea
                    rows={4}
                    required
                    placeholder="Provide detailed brief instruction notes..."
                    value={newMsgText}
                    onChange={(e) => setNewMsgText(e.target.value)}
                    className="w-full bg-transparent text-slate-800 text-xs p-3 focus:outline-none resize-none font-medium leading-relaxed"
                  />
                </div>
              </div>

              {/* Drag & Drop File Upload area */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Attachments</label>
                <div
                  onDragEnter={handleModalDrag}
                  onDragOver={handleModalDrag}
                  onDragLeave={handleModalDrag}
                  onDrop={handleModalDrop}
                  onClick={() => modalFileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
                    modalDragActive 
                      ? 'border-indigo-500 bg-indigo-50/30' 
                      : 'border-slate-200 hover:border-indigo-400 bg-slate-50/50 hover:bg-slate-50'
                  }`}
                >
                  <Paperclip className="h-6 w-6 text-slate-400 mx-auto mb-1.5" />
                  <p className="text-xs font-bold text-slate-700">Drag & Drop files or click to upload</p>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">Maximum attachment limit 25MB per post</p>
                  <input
                    type="file"
                    ref={modalFileInputRef}
                    onChange={handleModalFileSelect}
                    className="hidden"
                    multiple
                  />
                </div>

                {/* Show attached files list */}
                {newAttachedFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newAttachedFiles.map((f, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 pl-2 pr-1 py-1 rounded-lg text-[10px]">
                        <Paperclip className="h-3 w-3 text-slate-400" />
                        <span className="truncate max-w-[120px] text-slate-700 font-medium font-mono">{f.name}</span>
                        <button
                          type="button"
                          onClick={() => setNewAttachedFiles(prev => prev.filter((_, i) => i !== idx))}
                          className="p-0.5 text-slate-400 hover:text-red-500 rounded"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-xl cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl cursor-pointer shadow-sm transition-colors"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
