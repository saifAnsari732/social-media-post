"use client";
import { FileTerminal, RefreshCw, Zap, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function WebhookLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSimulator, setShowSimulator] = useState(false);
  const [simText, setSimText] = useState("how much is this?");
  const [simType, setSimType] = useState("dm");
  const [simAccount, setSimAccount] = useState("");
  const [accounts, setAccounts] = useState([]);

  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/webhook-logs");
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch (err) {
      toast.error("Failed to fetch logs");
    } finally {
      setLoading(false);
    }
  };

  const fetchAccounts = async () => {
    try {
      const userStr = localStorage.getItem("yt_user");
      if (!userStr) return;
      const { userId } = JSON.parse(userStr);
      const res = await fetch("/api/accounts", { headers: { "x-user-id": userId } });
      const data = await res.json();
      setAccounts(data.accounts || []);
      if (data.accounts?.length > 0) setSimAccount(data.accounts[0]._id);
    } catch (err) {}
  };

  useEffect(() => {
    fetchLogs();
    fetchAccounts();
    const interval = setInterval(fetchLogs, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, []);

  const simulateWebhook = async () => {
    if (!simAccount) return toast.error("Select an account to simulate");
    
    // Create mock Meta webhook payload
    const mockPayload = {
      object: "instagram",
      entry: [{
        id: simAccount,
        time: Date.now(),
        ...(simType === 'dm' ? {
          messaging: [{
            sender: { id: "test_user_123" },
            recipient: { id: simAccount },
            timestamp: Date.now(),
            message: { mid: "mid.$cAA...", text: simText }
          }]
        } : {
          changes: [{
            field: "comments",
            value: {
              id: "comment_123",
              text: simText,
              from: { id: "test_user_123", username: "tester" }
            }
          }]
        })
      }]
    };

    toast.loading("Simulating webhook...", { id: 'sim' });
    try {
      await fetch("/api/webhook/instagram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockPayload)
      });
      toast.success("Webhook processed!", { id: 'sim' });
      setShowSimulator(false);
      fetchLogs();
    } catch (e) {
      toast.error("Simulation failed", { id: 'sim' });
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Webhook Logs</h1>
          <p className="text-[#64748B] text-sm mt-1">Live feed of incoming webhooks from Meta for debugging.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowSimulator(true)} className="bg-[#1E1B4B] text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-[#2E1065] transition-colors flex items-center gap-2">
            <Zap className="w-4 h-4" /> Simulator
          </button>
          <button onClick={fetchLogs} className="bg-white border border-[#E2E8F0] text-[#0F172A] px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-[#F8FAFC] transition-colors flex items-center gap-2">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>
      </div>

      {showSimulator && (
        <div className="mb-8 p-6 bg-white rounded-xl border border-[#E2E8F0] shadow-sm relative">
          <button onClick={() => setShowSimulator(false)} className="absolute top-4 right-4 text-[#94A3B8] hover:text-[#0F172A]">
            <X className="w-5 h-5" />
          </button>
          <h3 className="font-bold text-[#0F172A] mb-4 flex items-center gap-2"><Zap className="w-4 h-4 text-[#7C3AED]" /> Test Automation Rule Locally</h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-[#64748B] mb-1">Target Account ID</label>
              <select className="w-full text-sm p-2 border rounded-md" value={simAccount} onChange={e => setSimAccount(e.target.value)}>
                {accounts.map(a => <option key={a._id} value={a._id}>{a.name} ({a.platform})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#64748B] mb-1">Trigger Type</label>
              <select className="w-full text-sm p-2 border rounded-md" value={simType} onChange={e => setSimType(e.target.value)}>
                <option value="dm">Direct Message (DM)</option>
                <option value="comment">Post Comment</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#64748B] mb-1">Incoming Message Text</label>
              <input type="text" className="w-full text-sm p-2 border rounded-md" value={simText} onChange={e => setSimText(e.target.value)} />
            </div>
          </div>
          <button onClick={simulateWebhook} className="bg-[#7C3AED] text-white px-4 py-2 rounded-md font-medium text-sm">Fire Webhook</button>
        </div>
      )}

      <div className="bg-[#0F172A] rounded-xl border border-[#334155] p-6 font-mono text-sm shadow-sm overflow-x-auto min-h-[500px] max-h-[700px] overflow-y-auto">
        <div className="flex items-center gap-2 text-[#94A3B8] mb-4 pb-4 border-b border-[#334155] sticky top-0 bg-[#0F172A]">
          <FileTerminal className="w-4 h-4" />
          <span>Listening for incoming webhooks on /api/webhook/...</span>
          <div className="ml-auto flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#10B981]"></span>
            </span>
            <span className="text-xs">Live</span>
          </div>
        </div>
        
        {logs.length === 0 && !loading && (
          <div className="text-[#64748B]">
            No webhooks received in this session. Use the Simulator above to test.
          </div>
        )}

        <div className="space-y-4 flex flex-col-reverse">
          {logs.map((log) => (
            <div key={log._id} className="border-l-2 border-[#7C3AED] pl-4 py-1">
              <div className="flex gap-4 text-[#94A3B8] text-xs mb-1">
                <span>[{new Date(log.receivedAt).toLocaleTimeString()}]</span>
                <span className="text-[#E2E8F0] uppercase font-bold">{log.platform}</span>
                <span className="text-[#38BDF8]">Event: {log.eventType}</span>
              </div>
              <pre className="text-[#E2E8F0] whitespace-pre-wrap">
                {JSON.stringify(log.payload, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
