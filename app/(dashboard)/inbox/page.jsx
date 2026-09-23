"use client";

import { useState, useEffect, useRef } from "react";
import { 
  MessageCircle, 
  Search, 
  Send, 
  User, 
  Zap, 
  RefreshCw, 
  Clock, 
  CheckCheck,
  Filter,
  ShieldCheck
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { PlatformIcon } from "@/components/ui/SocialIcons";
import { checkPlanAccess } from "@/lib/user";

export default function InboxPage() {
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(true);
  const [filterPlatform, setFilterPlatform] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sending, setSending] = useState(false);
  const [user, setUser] = useState(null);
  const messagesEndRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const allowed = checkPlanAccess({ action: "social_inbox", router, toast });
    if (!allowed) return;
    const userStr = localStorage.getItem("socialflow_user") || localStorage.getItem("yt_user");
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        setUser(u);
        fetchConversations(u.userId);
        return;
      } catch (e) {}
    }
    fetchConversations("eb994f0c8e6f7fb4c2629561");
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedConv?.messages]);

  async function fetchConversations(userId) {
    try {
      setLoading(true);
      const res = await fetch("/api/conversations", {
        headers: { "x-user-id": userId || user?.userId }
      });
      const data = await res.json();
      const list = data.conversations || [];
      setConversations(list);
      if (list.length > 0 && !selectedConv) {
        setSelectedConv(list[0]);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load inbox messages");
    } finally {
      setLoading(false);
    }
  }

  const handleSend = async () => {
    if (!replyText.trim() || !selectedConv || !user) return;
    
    const textToSend = replyText.trim();
    setReplyText("");
    setSending(true);

    const newMessage = {
      sender: "agent",
      text: textToSend,
      timestamp: new Date().toISOString()
    };
    
    // Optimistic UI update
    const updatedConv = {
      ...selectedConv,
      lastMessageAt: newMessage.timestamp,
      messages: [...(selectedConv.messages || []), newMessage]
    };
    
    setSelectedConv(updatedConv);
    setConversations(conversations.map(c => 
      c.externalId === updatedConv.externalId ? updatedConv : c
    ));

    try {
      await fetch("/api/conversations", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-user-id": user.userId 
        },
        body: JSON.stringify({
          externalId: selectedConv.externalId,
          text: textToSend
        })
      });
      toast.success("Reply sent & synced!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to sync message to server");
    } finally {
      setSending(false);
    }
  };

  const handleQuickAIResponse = (promptType) => {
    if (promptType === "thanks") {
      setReplyText("Thank you so much for reaching out! We truly appreciate your support. Let us know if you have any questions! 🙌");
    } else if (promptType === "order") {
      setReplyText("Hey there! Your order is currently being processed by our fulfillment team and will ship shortly. Tracking details will follow! 📦");
    } else if (promptType === "promo") {
      setReplyText("Hi! Yes, our promo code SAVE20 is active right now at checkout for 20% off your purchase! 🎉");
    }
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = (conv.participant?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (conv.participant?.username || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (conv.messages?.[conv.messages.length - 1]?.text || "").toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (filterPlatform === "all") return true;
    return conv.platform?.toLowerCase() === filterPlatform.toLowerCase();
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-950 tracking-tight flex items-center gap-2.5">
            <MessageCircle className="w-7 h-7 text-indigo-600" />
            <span>Social Unified Inbox</span>
          </h1>
          <p className="text-xs lg:text-sm text-slate-600 mt-1 font-normal">
            Direct messages & inquiries across Instagram, Facebook, and Twitter consolidated in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => fetchConversations(user?.userId)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>
      </div>

      {/* Main Inbox Workspace */}
      <div className="h-[calc(100vh-14rem)] min-h-[580px] flex bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs">
        
        {/* Left Column: Conversations List */}
        <div className="w-80 lg:w-96 border-r border-slate-200/90 flex flex-col bg-slate-50/60 shrink-0">
          
          <div className="p-4 border-b border-slate-200/80 bg-white space-y-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input 
                type="text" 
                placeholder="Search conversations..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Platform Filter Chips */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
              {[
                { id: "all", label: "All" },
                { id: "instagram", label: "Instagram" },
                { id: "facebook", label: "Facebook" }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFilterPlatform(tab.id)}
                  className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer whitespace-nowrap ${
                    filterPlatform === tab.id 
                      ? "bg-slate-900 text-white shadow-2xs" 
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Thread List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {loading ? (
              <div className="space-y-2 p-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-16 bg-slate-200/70 rounded-xl animate-pulse"></div>
                ))}
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="text-center p-8 mt-6">
                <MessageCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">No conversations found</p>
                <p className="text-[11px] text-slate-400 mt-0.5">New messages from Meta Webhooks will appear here.</p>
              </div>
            ) : (
              filteredConversations.map(conv => {
                const isSelected = selectedConv?.externalId === conv.externalId;
                const lastMsg = conv.messages?.[conv.messages.length - 1];
                const dateStr = conv.lastMessageAt 
                  ? new Date(conv.lastMessageAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })
                  : "";

                return (
                  <div 
                    key={conv._id || conv.externalId} 
                    onClick={() => setSelectedConv(conv)}
                    className={`p-3 rounded-xl cursor-pointer transition-all border ${
                      isSelected 
                        ? 'bg-white border-indigo-600 shadow-xs ring-1 ring-indigo-600/30' 
                        : 'bg-transparent border-transparent hover:border-slate-200 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-bold text-xs flex items-center justify-center shadow-2xs">
                          {conv.participant?.name?.slice(0, 2).toUpperCase() || "US"}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-md overflow-hidden bg-white shadow-2xs border border-white">
                          <PlatformIcon platform={conv.platform} className="w-full h-full" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-0.5">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {conv.participant?.name || "Customer"}
                          </h4>
                          <span className="text-[10px] text-slate-400 font-medium shrink-0 ml-1">
                            {dateStr}
                          </span>
                        </div>
                        <p className={`text-[11.5px] truncate font-normal ${
                          isSelected ? "text-slate-800" : "text-slate-500"
                        }`}>
                          {lastMsg ? (lastMsg.sender === "agent" ? `You: ${lastMsg.text}` : lastMsg.text) : "New message"}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Chat Conversation Canvas */}
        <div className="flex-1 bg-white flex flex-col relative min-w-0">
          {!selectedConv ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-3 border border-slate-200/80">
                <MessageCircle className="w-8 h-8 text-indigo-400" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Select a conversation</h3>
              <p className="text-xs text-slate-500 max-w-sm">
                Pick a customer thread from the left to read messages and send direct replies.
              </p>
            </div>
          ) : (
            <>
              {/* Chat Thread Header */}
              <div className="h-16 border-b border-slate-200/80 px-6 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-bold text-xs flex items-center justify-center shadow-2xs">
                      {selectedConv.participant?.name?.slice(0, 2).toUpperCase() || "US"}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-md overflow-hidden bg-white shadow-2xs border border-white">
                      <PlatformIcon platform={selectedConv.platform} className="w-full h-full" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                      {selectedConv.participant?.name || "Customer"}
                    </h3>
                    <p className="text-[10.5px] text-slate-500 font-medium capitalize flex items-center gap-1.5">
                      <span>@{selectedConv.participant?.username || "user"}</span>
                      <span>•</span>
                      <span>via {selectedConv.platform} Direct</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Live Connected
                  </span>
                </div>
              </div>
              
              {/* Chat Bubble Messages Container */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#FAFBFD]">
                {selectedConv.messages?.map((msg, idx) => {
                  const isAgent = msg.sender === "agent";
                  const time = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                  return (
                    <div key={idx} className={`flex ${isAgent ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 shadow-2xs ${
                        isAgent 
                          ? 'bg-indigo-600 text-white rounded-br-xs' 
                          : 'bg-white border border-slate-200/90 text-slate-900 rounded-bl-xs'
                      }`}>
                        <p className="text-xs sm:text-[13px] leading-relaxed font-normal">{msg.text}</p>
                        <div className={`flex items-center gap-1 text-[10px] mt-1 ${
                          isAgent ? 'text-indigo-200 justify-end' : 'text-slate-400'
                        }`}>
                          <span>{time}</span>
                          {isAgent && <CheckCheck className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick AI Suggestion Chips */}
              <div className="px-4 py-2 bg-slate-50/90 border-t border-slate-100 flex items-center gap-2 overflow-x-auto">
                <span className="text-[10.5px] font-bold text-slate-400 flex items-center gap-1 shrink-0">
                  <Zap className="w-3 h-3 text-indigo-500" /> Quick replies:
                </span>
                <button
                  onClick={() => handleQuickAIResponse("thanks")}
                  className="px-2.5 py-1 bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 rounded-lg text-[11px] font-medium transition-all shadow-2xs whitespace-nowrap cursor-pointer"
                >
                  🙏 Thank you
                </button>
                <button
                  onClick={() => handleQuickAIResponse("order")}
                  className="px-2.5 py-1 bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 rounded-lg text-[11px] font-medium transition-all shadow-2xs whitespace-nowrap cursor-pointer"
                >
                  📦 Order Status
                </button>
                <button
                  onClick={() => handleQuickAIResponse("promo")}
                  className="px-2.5 py-1 bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 rounded-lg text-[11px] font-medium transition-all shadow-2xs whitespace-nowrap cursor-pointer"
                >
                  🎉 Discount Code
                </button>
              </div>

              {/* Reply Input Bar */}
              <div className="p-4 border-t border-slate-200/90 bg-white">
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5 pr-2 focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                  <input 
                    type="text" 
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    placeholder={`Reply to ${selectedConv.participant?.name || "customer"}...`}
                    className="flex-1 bg-transparent border-none px-3 py-1.5 text-xs font-medium text-slate-900 focus:outline-none focus:ring-0 placeholder:text-slate-400"
                  />
                  <button 
                    onClick={handleSend}
                    disabled={!replyText.trim() || sending}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg disabled:opacity-40 transition-all shadow-xs shadow-indigo-600/20 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

      </div>

    </div>
  );
}
