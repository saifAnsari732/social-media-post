"use client";
import { FileTerminal, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function WebhookLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Webhook Logs</h1>
          <p className="text-[#64748B] text-sm mt-1">Live feed of incoming webhooks from Meta for debugging.</p>
        </div>
        <button onClick={fetchLogs} className="bg-white border border-[#E2E8F0] text-[#0F172A] px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-[#F8FAFC] transition-colors flex items-center gap-2">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

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
            No webhooks received in this session. Ensure your Meta App is subscribed to the correct page events.
          </div>
        )}

        <div className="space-y-4 flex flex-col-reverse">
          {logs.map((log) => (
            <div key={log._id} className="border-l-2 border-[#7C3AED] pl-4 py-1">
              <div className="flex gap-4 text-[#94A3B8] text-xs mb-1">
                <span>[{new Date(log.receivedAt).toLocaleTimeString()}]</span>
                <span className="text-[#E2E8F0] uppercase font-bold">{log.platform}</span>
                <span className="text-[#38BDF8]">Event: {log.entry?.[0]?.messaging ? 'message' : 'other'}</span>
              </div>
              <pre className="text-[#E2E8F0] whitespace-pre-wrap">
                {JSON.stringify(log, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
