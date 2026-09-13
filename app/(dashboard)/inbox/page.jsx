"use client";

import { useState, useEffect } from "react";
import { MessageCircle, Search, Send, User } from "lucide-react";

export default function InboxPage() {
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  async function fetchConversations() {
    try {
      const userStr = localStorage.getItem("yt_user");
      if (!userStr) return;
      const { userId } = JSON.parse(userStr);

      const res = await fetch("/api/conversations", {
        headers: { "x-user-id": userId }
      });
      const data = await res.json();
      setConversations(data.conversations || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleSend = () => {
    if (!replyText.trim() || !selectedConv) return;
    
    // Optimistic UI update
    const newMessage = {
      sender: "agent",
      text: replyText,
      timestamp: new Date().toISOString()
    };
    
    const updatedConv = {
      ...selectedConv,
      messages: [...(selectedConv.messages || []), newMessage]
    };
    
    setSelectedConv(updatedConv);
    setConversations(conversations.map(c => c._id === updatedConv._id ? updatedConv : c));
    setReplyText("");
    
    // In a real app, send this to the server here.
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-sm">
      {/* Left Panel: Conversation List */}
      <div className="w-80 border-r border-[#E2E8F0] flex flex-col bg-[#F8FAFC]">
        <div className="p-4 border-b border-[#E2E8F0] bg-white">
          <h2 className="text-lg font-bold text-[#0F172A] mb-3 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-[#7C3AED]" />
            Unified Inbox
          </h2>
          <div className="relative">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
            <input 
              type="text" 
              placeholder="Search messages..." 
              className="w-full pl-9 pr-3 py-2 bg-[#F1F5F9] border-none rounded-lg text-sm focus:ring-2 focus:ring-[#7C3AED] outline-none"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2">
          {loading ? (
            <div className="animate-pulse space-y-2 p-2">
               {[1,2,3,4].map(i => <div key={i} className="h-16 bg-[#E2E8F0] rounded-lg"></div>)}
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center p-6 mt-10">
              <MessageCircle className="w-8 h-8 text-[#CBD5E1] mx-auto mb-2" />
              <p className="text-sm font-medium text-[#64748B]">No conversations yet</p>
            </div>
          ) : (
            conversations.map(conv => (
              <div 
                key={conv._id} 
                onClick={() => setSelectedConv(conv)}
                className={`p-3 rounded-lg cursor-pointer transition-colors border mb-1 ${
                  selectedConv?._id === conv._id 
                    ? 'bg-white border-[#7C3AED] shadow-sm' 
                    : 'bg-transparent border-transparent hover:border-[#E2E8F0] hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-100 to-fuchsia-100 overflow-hidden flex items-center justify-center font-bold text-[#7C3AED]">
                    {conv.participant?.name?.charAt(0) || "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <h4 className="text-sm font-bold text-[#0F172A] truncate">{conv.participant?.name || "Unknown"}</h4>
                      <span className="text-[10px] text-[#94A3B8]">{new Date(conv.lastMessageAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-[#64748B] truncate">
                      {conv.messages?.[conv.messages.length - 1]?.text || "New conversation"}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Panel: Thread */}
      <div className="flex-1 bg-white flex flex-col relative">
        {!selectedConv ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
             <div className="w-16 h-16 bg-[#F8FAFC] rounded-full flex items-center justify-center mb-4 border border-[#E2E8F0]">
               <MessageCircle className="w-8 h-8 text-[#CBD5E1]" />
             </div>
             <h3 className="text-lg font-bold text-[#0F172A] mb-2">Select a conversation</h3>
             <p className="text-[#64748B] max-w-sm">Choose a message from the left panel to view the thread and reply to your customers.</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="h-16 border-b border-[#E2E8F0] px-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#E2E8F0] flex items-center justify-center">
                  <User className="w-4 h-4 text-[#64748B]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#0F172A] text-sm">{selectedConv.participant?.name || "Unknown"}</h3>
                  <p className="text-xs text-[#64748B] capitalize">via {selectedConv.platform}</p>
                </div>
              </div>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {selectedConv.messages?.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                    msg.sender === 'agent' 
                      ? 'bg-[#7C3AED] text-white rounded-br-none' 
                      : 'bg-[#F1F5F9] text-[#0F172A] rounded-bl-none'
                  }`}>
                    <p className="text-sm">{msg.text}</p>
                    <span className={`text-[10px] mt-1 block ${msg.sender === 'agent' ? 'text-white/70 text-right' : 'text-[#94A3B8]'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-[#E2E8F0] bg-white">
              <div className="flex items-center gap-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-1 pr-2">
                <input 
                  type="text" 
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Type your reply..."
                  className="flex-1 bg-transparent border-none px-3 py-2 text-sm focus:outline-none focus:ring-0"
                />
                <button 
                  onClick={handleSend}
                  disabled={!replyText.trim()}
                  className="bg-[#7C3AED] text-white p-2 rounded-lg disabled:opacity-50 transition-opacity hover:bg-[#6D28D9]"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
