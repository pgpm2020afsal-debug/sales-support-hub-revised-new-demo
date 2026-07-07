import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mail,
  ShieldCheck,
  HelpCircle,
  AlertCircle,
  Sparkles,
  Send,
  CheckCircle,
  ArrowRight,
  CornerUpRight,
  RefreshCw,
  Eye,
  X,
  Clock,
  Sliders,
  TrendingUp,
  Check,
  Info,
  AlertTriangle,
  Play,
} from 'lucide-react';
import { QuoteInquiry } from '../types';

// Helper function to calculate latency between initial customer sent date and shared mailbox receipt date
export const calculateLatency = (sentStr?: string, receivedStr?: string) => {
  if (!sentStr || !receivedStr) return { minutes: 0, hours: 0, days: 0, formatted: 'N/A' };
  const sent = new Date(sentStr);
  const received = new Date(receivedStr);
  const diffMs = received.getTime() - sent.getTime();
  const diffMin = Math.max(0, Math.floor(diffMs / (1000 * 60)));
  const totalHours = diffMin / 60;
  const days = Math.floor(totalHours / 24);
  const hrs = Math.floor(totalHours % 24);
  const mins = diffMin % 60;

  let formatted = '';
  if (days > 0) {
    formatted = hrs > 0 ? `${days}d ${hrs}h` : `${days}d`;
  } else if (hrs > 0) {
    formatted = `${hrs}h ${mins}m`;
  } else {
    formatted = `${mins}m`;
  }

  return {
    minutes: diffMin,
    hours: totalHours,
    days: days + hrs / 24,
    formatted,
  };
};

interface IntakeScreenProps {
  quotes: QuoteInquiry[];
  selectedId: string;
  onSelect: (id: string) => void;
  onQualifyComplete: (id: string, partNo: string, serialNo: string) => void;
  onSendClarification: (id: string, emailText: string) => void;
  onLogAsRfi: (id: string, emailText: string) => void;
}

export default function IntakeScreen({
  quotes,
  selectedId,
  onSelect,
  onQualifyComplete,
  onSendClarification,
  onLogAsRfi,
}: IntakeScreenProps) {
  // SLA benchmark: flag anything forwarded later than 2 business days
  const slaThresholdDays = 2;
  const slaThresholdHours = slaThresholdDays * 24;

  // Filter for quotes that are unqualified or in clarification drafts
  const activeInflow = useMemo(() => quotes.filter(
    q =>
      q.status === 'unqualified' ||
      q.status === 'clarification_draft' ||
      q.status === 'awaiting_clarification'
  ), [quotes]);

  const selectedQuote = quotes.find(q => q.id === selectedId) || activeInflow[0];

  // Form states for AI Extraction verification
  const [partNumber, setPartNumber] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [composerType, setComposerType] = useState<'clarification' | 'rfi' | null>(null);
  const [composerText, setComposerText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAttachmentOpen, setIsAttachmentOpen] = useState(false);

  // Sync state when selected quote changes
  useEffect(() => {
    if (selectedQuote) {
      setPartNumber(selectedQuote.partNumberCorrected || selectedQuote.partNumberExtracted || '');
      setSerialNumber(
        selectedQuote.serialNumberCorrected || selectedQuote.serialNumberExtracted || ''
      );
      if (composerType === 'rfi') {
        setComposerText(getRfiDraftText(selectedQuote));
      } else {
        setComposerText(selectedQuote.clarificationEmailText || '');
      }
    }
  }, [selectedQuote?.id, composerType]);

  const getRfiDraftText = (quote: QuoteInquiry) => {
    return `Dear ${quote.customerName},

Thank you for contacting Global Spare Parts Ltd regarding "${quote.subject}".

We have received your informational inquiry. We are preparing the general technical datasheets, operating parameters, and dimension diagrams for your reference.

Please note that as this is a Request for Information (RFI) rather than an active commercial RFQ, this transaction has been successfully logged in SFDC as an Informational Request (Non-Opportunity). No commercial quotation or pricing is being calculated.

If you require a formal sales quotation in the future, please do not hesitate to contact us.

Best regards,
Sales Support Hub
Global Spare Parts Ltd`;
  };

  if (!selectedQuote) {
    return (
      <div
        className="flex flex-col items-center justify-center h-[550px] bg-slate-50 border border-dashed border-slate-300 rounded-xl p-8"
        id="no-intake-items"
      >
        <ShieldCheck className="w-16 h-16 text-slate-300 mb-4" />
        <p className="text-slate-500 font-medium text-lg">No items currently in Intake Queue.</p>
        <p className="text-slate-400 text-sm mt-1">
          All incoming quotes have been qualified or routed.
        </p>
      </div>
    );
  }

  const handleApprove = () => {
    onQualifyComplete(selectedQuote.id, partNumber, serialNumber);
  };

  const handleSendClarification = () => {
    if (composerType === 'rfi') {
      onLogAsRfi(selectedQuote.id, composerText);
    } else {
      onSendClarification(selectedQuote.id, composerText);
    }
    setComposerType(null);
  };

  const filteredInflow = useMemo(() => activeInflow.filter(
    q =>
      q.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.id.toLowerCase().includes(searchQuery.toLowerCase())
  ), [activeInflow, searchQuery]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5" id="intake-screen-layout">
      {/* LEFT SIDE: Email Inbox */}
      <div
        className="lg:col-span-5 flex flex-col bg-white border border-[#e1e6eb] rounded-lg shadow-xs overflow-hidden"
        id="inbox-container"
      >
        {/* Inbox Header */}
        <div className="p-3.5 border-b border-[#e1e6eb] bg-white flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-slate-700" />
              <h2 className="font-sans font-bold text-slate-800 text-xs uppercase tracking-wider">
                Client Intake Inbox
              </h2>
            </div>
            <span className="bg-[#004b93]/10 text-[#004b93] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#004b93]/20">
              {activeInflow.length} AI Pending
            </span>
          </div>

          {/* Search bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search sender, subject, reference..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-200 rounded-md bg-white focus:outline-none focus:border-[#004b93] transition-colors"
            />
            <span className="absolute left-2.5 top-2 text-slate-400 text-xs">🔍</span>
          </div>
        </div>

        {/* Inbox List */}
        <div
          className="overflow-y-auto divide-y divide-[#e1e6eb] max-h-[50vh] lg:max-h-[70vh]"
          id="inbox-list"
        >
          {filteredInflow.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs">
              No matching messages found.
            </div>
          ) : (
            filteredInflow.map(quote => {
              const isSelected = quote.id === selectedQuote.id;
              const hasIncompleteData = !quote.partNumberExtracted || !quote.serialNumberExtracted;
              const isWaiting = quote.status === 'awaiting_clarification';
              const latency = calculateLatency(quote.customerSentAt, quote.receivedAt);
              const isLate = quote.customerSentAt ? latency.days > slaThresholdDays : false;
              const isCritical = quote.customerSentAt ? latency.days > 4 : false;

              return (
                <button
                  key={quote.id}
                  id={`inbox-item-${quote.id}`}
                  onClick={() => onSelect(quote.id)}
                  className={`w-full text-left p-3.5 transition-all hover:bg-slate-50 relative flex flex-col gap-1 border-l-4 ${
                    isSelected
                      ? 'bg-[#004b93]/5 border-l-[#004b93]'
                      : isCritical
                      ? 'border-l-rose-500 bg-rose-50/30'
                      : isLate
                      ? 'border-l-amber-400 bg-amber-50/20'
                      : 'border-l-transparent'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-slate-900 text-[12px] truncate max-w-[150px]">
                      {quote.customerName}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Forwarding delay badge — only show if late */}
                      {quote.customerSentAt && isLate && (
                        <span
                          className={`text-[8px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5 ${
                            isCritical
                              ? 'bg-rose-100 text-rose-700 border border-rose-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          <Clock className="w-2 h-2" />
                          {latency.formatted} delay
                        </span>
                      )}
                      <span className="text-[9.5px] text-slate-400 font-mono font-bold">
                        {quote.id}
                      </span>
                    </div>
                  </div>

                  <div className="font-bold text-[11px] text-slate-700 truncate">
                    {quote.subject}
                  </div>

                  <p className="text-slate-500 text-[10.5px] line-clamp-1 leading-normal">
                    {quote.emailBody}
                  </p>

                  <div className="flex items-center justify-between mt-1 pt-1.5 border-t border-slate-100">
                    <div className="flex items-center gap-1 flex-wrap">
                      {isWaiting ? (
                        <span className="bg-amber-50 text-amber-700 text-[9px] font-bold px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                          Awaiting Clarification
                        </span>
                      ) : hasIncompleteData ? (
                        <span className="bg-rose-50 text-rose-700 text-[9px] font-bold px-2 py-0.5 rounded-full border border-rose-200 flex items-center gap-1">
                          <AlertCircle className="w-2.5 h-2.5" /> Incomplete Data
                        </span>
                      ) : (
                        <span className="bg-emerald-50 text-emerald-700 text-[9px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                          <CheckCircle className="w-2.5 h-2.5 text-emerald-600" /> Data Ready
                        </span>
                      )}
                      {/* Show forwarded-by in list only when SLA OK — subtle info */}
                      {quote.customerSentAt && !isLate && quote.forwardedBy && (
                        <span className="text-[8.5px] text-slate-400 font-medium truncate max-w-[100px]">
                          via {quote.forwardedBy.split(' (')[0]}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-0.5 text-slate-400 text-[9px] font-semibold shrink-0">
                      <span>Conf: {quote.aiConfidence}%</span>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT SIDE: AI Staging Area */}
      <div
        className="lg:col-span-7 flex flex-col bg-white border border-[#e1e6eb] rounded-lg shadow-xs overflow-hidden"
        id="staging-container"
      >
        {/* Email Header View */}
        <div className="p-3.5 border-b border-[#e1e6eb] bg-white flex justify-between items-center gap-3">
          <div className="min-w-0">
            <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">
              CUSTOMER EMAIL CORRESPONDENCE
            </div>
            <h3 className="font-sans font-bold text-slate-950 text-xs truncate max-w-[280px] sm:max-w-md">
              {selectedQuote.subject}
            </h3>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-5 h-5 rounded-full bg-slate-100 text-[#004b93] text-[9px] font-black flex items-center justify-center border border-slate-200">
                {selectedQuote.customerName.charAt(0)}
              </span>
              <span className="text-[11px] font-bold text-slate-700">
                {selectedQuote.customerName}
              </span>
              <span className="text-[10px] text-slate-400 truncate">
                &lt;{selectedQuote.customerEmail}&gt;
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0 text-right">
            <span className="text-[9px] text-slate-400 font-mono">June 23, 2026</span>
            <div className="flex items-center gap-1 bg-[#004b93]/10 px-2 py-0.5 rounded-full text-[#004b93] text-[10px] font-bold">
              <Sparkles className="w-3 h-3 text-[#004b93]" />
              <span>AI Extracted</span>
            </div>
          </div>
        </div>

        {/* Forwarding Pathway KPI Bar */}
        {selectedQuote.customerSentAt &&
          (() => {
            const latency = calculateLatency(
              selectedQuote.customerSentAt,
              selectedQuote.receivedAt
            );
            const isBreached = latency.days > slaThresholdDays;
            const isCritical = latency.days > 4;
            const formatTime = (isoStr: string) => {
              const d = new Date(isoStr);
              return (
                d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
                ' (' +
                d.toLocaleDateString([], { month: 'short', day: 'numeric' }) +
                ')'
              );
            };
            // progress bar: proportional to 2-day SLA, capped at 100%
            const pct = Math.min(100, (latency.days / slaThresholdDays) * 100);
            return (
              <div
                className={`px-3.5 pt-2 pb-2.5 border-b border-[#e1e6eb] ${
                  isCritical
                    ? 'bg-rose-50/60'
                    : isBreached
                    ? 'bg-amber-50/50'
                    : 'bg-[#004b93]/[0.03]'
                }`}
              >
                {/* Row 1: label + forwarded-by */}
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Routing Pathway KPI
                  </span>
                  <div className="flex items-center gap-1 text-[9px]">
                    <span className="text-slate-400 font-semibold">Forwarded By:</span>
                    <span className="font-bold text-slate-700 bg-white border border-slate-200 px-1.5 py-0.5 rounded font-mono text-[8.5px] shadow-sm">
                      {selectedQuote.forwardedBy || 'Regional Rep'}
                    </span>
                  </div>
                </div>

                {/* Row 2: timeline nodes + gap badge */}
                <div className="flex items-center gap-2">
                  {/* Timeline pill */}
                  <div className="flex-1 min-w-0 bg-white rounded border border-slate-200 px-2 sm:px-3 py-2 flex items-center justify-between shadow-sm">
                    {/* Node 1 */}
                    <div className="flex flex-col items-start gap-0.5 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#004b93] ring-2 ring-[#004b93]/15 shrink-0"></span>
                        <span className="text-[9.5px] font-bold text-slate-800 hidden sm:block">
                          Customer Sent
                        </span>
                        <span className="text-[9px] font-bold text-slate-800 sm:hidden">Sent</span>
                      </div>
                      <span className="text-[8px] text-slate-400 font-mono pl-3 truncate max-w-[80px] sm:max-w-none">
                        {formatTime(selectedQuote.customerSentAt)}
                      </span>
                    </div>

                    {/* Connector line with label */}
                    <div className="flex-1 mx-1 sm:mx-3 flex flex-col items-center gap-0.5">
                      <div
                        className={`w-full h-0 border-t-2 border-dashed ${
                          isCritical
                            ? 'border-rose-300'
                            : isBreached
                            ? 'border-amber-300'
                            : 'border-slate-200'
                        }`}
                      />
                      <span
                        className={`text-[7.5px] font-bold px-1 py-0.5 rounded border hidden sm:block ${
                          isCritical
                            ? 'bg-rose-50 text-rose-600 border-rose-200'
                            : isBreached
                            ? 'bg-amber-50 text-amber-600 border-amber-200'
                            : 'bg-slate-50 text-slate-400 border-slate-150'
                        }`}
                      >
                        Forwarding Delay
                      </span>
                    </div>

                    {/* Node 2 */}
                    <div className="flex flex-col items-end gap-0.5 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-[9.5px] font-bold text-slate-800 hidden sm:block">
                          Mailbox Received
                        </span>
                        <span className="text-[9px] font-bold text-slate-800 sm:hidden">
                          Received
                        </span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-400/15 shrink-0"></span>
                      </div>
                      <span className="text-[8px] text-slate-400 font-mono pr-3 truncate max-w-[80px] sm:max-w-none">
                        {formatTime(selectedQuote.receivedAt)}
                      </span>
                    </div>
                  </div>

                  {/* Gap badge */}
                  <div
                    className={`shrink-0 w-[72px] rounded border flex flex-col items-center justify-center py-1.5 text-center ${
                      isCritical
                        ? 'bg-rose-600 border-rose-700 text-white'
                        : isBreached
                        ? 'bg-amber-500 border-amber-600 text-white'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    }`}
                  >
                    <Clock
                      className={`w-3 h-3 mb-0.5 ${
                        isCritical || isBreached ? 'text-white/80' : 'text-emerald-500'
                      }`}
                    />
                    <span className="text-[13px] font-black font-mono leading-none">
                      {latency.formatted}
                    </span>
                    <span
                      className={`text-[7.5px] font-bold mt-1 ${
                        isCritical || isBreached ? 'text-white/90' : 'text-emerald-700'
                      }`}
                    >
                      {isCritical ? '🔴 CRITICAL' : isBreached ? '⚠ LATE' : '✓ SLA OK'}
                    </span>
                  </div>
                </div>

                {/* Row 3: SLA progress bar */}
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isCritical ? 'bg-rose-500' : isBreached ? 'bg-amber-400' : 'bg-emerald-400'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span
                    className={`text-[8px] font-bold shrink-0 ${
                      isCritical
                        ? 'text-rose-600'
                        : isBreached
                        ? 'text-amber-600'
                        : 'text-emerald-600'
                    }`}
                  >
                    {isBreached
                      ? `+${(latency.days - slaThresholdDays).toFixed(1)}d over 2-day SLA`
                      : `${(slaThresholdDays - latency.days).toFixed(1)}d SLA remaining`}
                  </span>
                </div>
              </div>
            );
          })()}

        {/* Email Content Body Preview */}
        <div
          className="p-3.5 bg-slate-50/40 border-b border-[#e1e6eb] max-h-28 overflow-y-auto"
          id="email-body-preview"
        >
          <pre className="text-slate-600 text-[11px] font-sans whitespace-pre-wrap leading-relaxed">
            {selectedQuote.emailBody}
          </pre>
        </div>

        {/* Email Attachments Bar */}
        {selectedQuote.attachments && selectedQuote.attachments.length > 0 && (
          <div
            className="px-3.5 py-2 bg-slate-50 border-b border-[#e1e6eb] flex items-center justify-between gap-3 text-xs"
            id="email-attachments-bar"
          >
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-bold text-[11px]">📎 Attachment:</span>
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded px-2 py-0.5 text-[11px] font-bold text-slate-700 shadow-2xs">
                <span>{selectedQuote.attachments[0].name}</span>
                <span className="text-[9.5px] text-slate-400">
                  ({selectedQuote.attachments[0].size})
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsAttachmentOpen(true)}
              className="text-[10px] text-[#004b93] hover:text-white font-extrabold bg-white hover:bg-[#004b93] border border-[#004b93] rounded px-3 py-1 shadow-2xs flex items-center gap-1 cursor-pointer transition-colors"
              id="btn-view-data-plate"
            >
              <Eye className="w-3 h-3" />
              Review Data Plate File
            </button>
          </div>
        )}

        {/* AI Staging Area Fields */}
        <div
          className="p-4 overflow-y-auto flex flex-col gap-4 bg-white relative"
          id="ai-staging-panel"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-1.5">
              <span className="p-1 rounded bg-[#004b93]/10 text-[#004b93]">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
              <div>
                <h4 className="font-sans font-bold text-slate-900 text-xs">
                  AI SUGGESTED EXTRACTOR
                </h4>
                <p className="text-[10px] text-slate-500">
                  Manual qualification matches references into SAP CPQ parameters.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 border border-amber-250 rounded-full">
              UNQUALIFIED
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Part Number Field */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                <span>Part Number</span>
                {selectedQuote.partNumberExtracted ? (
                  <span className="text-[9px] text-[#004b93] font-bold bg-[#004b93]/5 px-1.5 py-0.2 rounded border border-[#004b93]/10">
                    Extracted Reference
                  </span>
                ) : (
                  <span className="text-[9px] text-amber-600 font-bold bg-amber-50 px-1.5 py-0.2 rounded border border-amber-100">
                    ⚠️ Missing
                  </span>
                )}
              </label>

              <div className="relative">
                <input
                  type="text"
                  value={partNumber}
                  onChange={e => setPartNumber(e.target.value.toUpperCase())}
                  placeholder="Enter part number..."
                  className="w-full text-xs font-mono px-2.5 py-1.5 rounded-md border border-[#e1e6eb] focus:outline-none focus:border-[#004b93] transition-colors bg-white"
                  id="input-part-number"
                />
              </div>
              <p className="text-[9px] text-slate-400">
                Extracted:{' '}
                <span className="font-mono font-semibold text-slate-600">
                  {selectedQuote.partNumberExtracted || '[None]'}
                </span>
              </p>
            </div>

            {/* Serial Number Field */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                <span>Serial Number</span>
                {selectedQuote.serialNumberExtracted ? (
                  <span className="text-[9px] text-[#004b93] font-bold bg-[#004b93]/5 px-1.5 py-0.2 rounded border border-[#004b93]/10">
                    Extracted Reference
                  </span>
                ) : (
                  <span className="text-[9px] text-amber-600 font-bold bg-amber-50 px-1.5 py-0.2 rounded border border-amber-100">
                    ⚠️ Missing
                  </span>
                )}
              </label>

              <div className="relative">
                <input
                  type="text"
                  value={serialNumber}
                  onChange={e => setSerialNumber(e.target.value.toUpperCase())}
                  placeholder="Enter serial number..."
                  className="w-full text-xs font-mono px-2.5 py-1.5 rounded-md border border-[#e1e6eb] focus:outline-none focus:border-[#004b93] transition-colors bg-white"
                  id="input-serial-number"
                />
              </div>
              <p className="text-[9px] text-slate-400">
                Extracted:{' '}
                <span className="font-mono font-semibold text-slate-600">
                  {selectedQuote.serialNumberExtracted || '[None]'}
                </span>
              </p>
            </div>
          </div>

          {/* ERP Stock Matching or Alerts */}
          <div className="bg-slate-50 border border-[#e1e6eb] rounded p-3 flex gap-2.5 text-[11px] leading-relaxed">
            <span className="text-[#004b93] text-sm">💡</span>
            <div>
              <span className="font-bold text-slate-800 block mb-0.5">
                System Reference Matcher
              </span>
              <p className="text-slate-600 font-medium">{selectedQuote.notes}</p>
            </div>
          </div>

          {/* SFDC AI Extracted Opportunity Fields */}
          {selectedQuote.sfdcOpportunity && (
            <div
              className="border border-[#004b93]/20 rounded-lg overflow-hidden"
              id="sfdc-opportunity-panel"
            >
              {/* Panel header */}
              <div className="flex items-center justify-between px-3 py-2.5 bg-[#004b93]/5 border-b border-[#004b93]/15">
                <div className="flex items-center gap-1.5">
                  <span className="p-1 rounded bg-[#004b93]/10 text-[#004b93]">
                    <Sparkles className="w-3 h-3" />
                  </span>
                  <div>
                    <h4 className="font-sans font-bold text-slate-900 text-[11px]">
                      AI EXTRACTED OPPORTUNITY FIELDS
                    </h4>
                    <p className="text-[9px] text-slate-500">
                      Index-matched from CRM & email domain. Verify before converting to SFDC
                      opportunity.
                    </p>
                  </div>
                </div>
                <span className="text-[9px] font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 border border-amber-200 rounded-full shrink-0">
                  UNVERIFIED
                </span>
              </div>

              {/* Scrollable fields list */}
              <div
                className="overflow-y-auto bg-white divide-y divide-slate-100"
                style={{ maxHeight: '280px' }}
              >
                {(
                  [
                    {
                      label: 'Account Name',
                      value: selectedQuote.sfdcOpportunity.accountName,
                      required: true,
                    },
                    {
                      label: 'Booking Entity',
                      value: selectedQuote.sfdcOpportunity.bookingEntity,
                      required: true,
                    },
                    {
                      label: 'Opportunity Name',
                      value: selectedQuote.sfdcOpportunity.opportunityName,
                      required: true,
                    },
                    {
                      label: 'Chance to Win (%)',
                      value: `${selectedQuote.sfdcOpportunity.chanceToWin}%`,
                      required: true,
                    },
                    {
                      label: 'Offer Type',
                      value: selectedQuote.sfdcOpportunity.offerType,
                      required: true,
                    },
                    {
                      label: 'Chance of Opportunity',
                      value: `${selectedQuote.sfdcOpportunity.chanceOfOpportunity}%`,
                      required: true,
                    },
                    {
                      label: 'Close Date',
                      value: new Date(selectedQuote.sfdcOpportunity.closeDate).toLocaleDateString(
                        'en-GB',
                        { day: '2-digit', month: 'short', year: 'numeric' }
                      ),
                      required: true,
                    },
                    {
                      label: 'Opportunity Currency',
                      value: selectedQuote.sfdcOpportunity.currency,
                      required: true,
                    },
                    {
                      label: 'Op Amount',
                      value: selectedQuote.sfdcOpportunity.estimatedValue.toLocaleString('en-GB', {
                        minimumFractionDigits: 2,
                      }),
                      required: true,
                    },
                    { label: 'Stage', value: selectedQuote.sfdcOpportunity.stage, required: false },
                    {
                      label: 'Region',
                      value: selectedQuote.sfdcOpportunity.region,
                      required: false,
                    },
                    {
                      label: 'Product Line',
                      value: selectedQuote.sfdcOpportunity.productLine,
                      required: false,
                    },
                  ] as { label: string; value: string; required: boolean }[]
                ).map(({ label, value, required }) => (
                  <div key={label} className="px-3 py-2 flex flex-col gap-0.5">
                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-0.5">
                      {label}
                      {required && <span className="text-rose-500">*</span>}
                    </label>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 text-[11px] font-mono font-semibold text-slate-800 bg-slate-50 border border-[#e1e6eb] rounded px-2.5 py-1 truncate">
                        {value}
                      </div>
                      <span className="text-[8px] text-[#004b93] font-bold bg-[#004b93]/5 px-1.5 py-0.5 rounded border border-[#004b93]/10 shrink-0">
                        Extracted
                      </span>
                    </div>
                    <p className="text-[8px] text-slate-400 font-mono">
                      Extracted: <span className="font-semibold text-slate-500">{value}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Expandable Draft Email Composer (Clarification vs RFI) */}
          <AnimatePresence>
            {composerType !== null && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className={`border rounded-lg p-3.5 flex flex-col gap-2.5 shadow-2xs transition-colors ${
                  composerType === 'rfi'
                    ? 'border-[#004b93]/30 bg-slate-50/50'
                    : 'border-amber-200 bg-slate-50/50'
                }`}
                id="email-composer"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[11px] font-bold flex items-center gap-1 ${
                      composerType === 'rfi' ? 'text-[#004b93]' : 'text-amber-800'
                    }`}
                  >
                    <CornerUpRight className="w-3 h-3" />
                    {composerType === 'rfi'
                      ? 'Draft Informational Response (RFI)'
                      : 'Draft Clarification Email'}
                  </span>
                  <button
                    onClick={() => setComposerType(null)}
                    className="text-slate-400 hover:text-slate-600 text-[10px] font-bold cursor-pointer"
                  >
                    Close
                  </button>
                </div>
                <div className="text-[10px] text-slate-500 font-mono flex justify-between">
                  <span>To: {selectedQuote.customerEmail}</span>
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[8px]">
                    {composerType === 'rfi'
                      ? '🔗 SFDC: Info Log'
                      : '🔗 SFDC: Pending Clarification'}
                  </span>
                </div>
                <textarea
                  value={composerText}
                  onChange={e => setComposerText(e.target.value)}
                  className="w-full text-xs font-sans p-2.5 border border-[#e1e6eb] rounded-md h-28 focus:outline-none focus:border-[#004b93] bg-white font-medium"
                  placeholder="Draft your response here..."
                />
                <div className="flex justify-end gap-1.5">
                  <button
                    onClick={() => setComposerType(null)}
                    className="px-3 py-1 border border-[#e1e6eb] rounded-md text-[10px] font-bold text-slate-600 bg-white hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendClarification}
                    className={`px-3 py-1 text-white rounded-md text-[10px] font-bold flex items-center gap-1 shadow-2xs cursor-pointer ${
                      composerType === 'rfi'
                        ? 'bg-[#004b93] hover:bg-[#003d78]'
                        : 'bg-amber-600 hover:bg-amber-700'
                    }`}
                    id="btn-send-composer"
                  >
                    <Send className="w-3 h-3" />
                    {composerType === 'rfi'
                      ? 'Send RFI & Log to SFDC'
                      : 'Send Clarification Request'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Footer */}
        <div className="p-3 bg-slate-50 border-t border-[#e1e6eb] flex flex-col gap-2">
          <div className="text-slate-500 text-[10px] flex flex-col gap-0.5 py-1">
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#004b93]" />
              <span className="font-bold text-slate-750">Human-in-the-Loop Protocol Enforced</span>
            </div>
            <div className="text-[8.5px] text-slate-400 font-medium pl-4.5">
              Confirming parameters matches specs into the SAP CPQ pipeline.
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() =>
                setComposerType(composerType === 'clarification' ? null : 'clarification')
              }
              className={`flex-1 px-4 py-1.5 border text-xs font-bold rounded-md transition-colors flex items-center justify-center gap-1 shadow-2xs cursor-pointer ${
                composerType === 'clarification'
                  ? 'border-amber-400 bg-amber-50 text-amber-850'
                  : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
              }`}
              id="btn-review-clarification"
            >
              Review Draft Email
            </button>

            <button
              onClick={() => setComposerType(composerType === 'rfi' ? null : 'rfi')}
              className={`flex-1 px-4 py-1.5 border text-xs font-bold rounded-md transition-colors flex items-center justify-center gap-1 shadow-2xs cursor-pointer ${
                composerType === 'rfi'
                  ? 'border-[#004b93] bg-[#004b93]/5 text-[#004b93]'
                  : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
              }`}
              id="btn-handle-rfi"
            >
              Handle as RFI
            </button>

            <button
              onClick={handleApprove}
              disabled={!partNumber || !serialNumber}
              className="flex-1 px-5 py-2 bg-[#004b93] hover:bg-[#003d78] disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed text-white rounded-md text-xs font-bold transition-all shadow-2xs flex flex-col items-center justify-center gap-0.5 cursor-pointer"
              id="btn-approve-intake"
              title="Convert as Opportunity in SFDC"
            >
              <span>Approve & Register Opportunity in SFDC</span>
              <span className="text-[9px] text-blue-100 font-medium">
                Convert as Opportunity in SFDC
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ATTACHMENT LIGHTBOX MODAL */}
      <AnimatePresence>
        {isAttachmentOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/85 backdrop-blur-xs"
            id="attachment-lightbox"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl p-6 max-w-lg w-full border border-slate-200 relative"
            >
              <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg">📷</span>
                  <div>
                    <h3 className="font-display font-extrabold text-slate-900 text-sm">
                      Review Attached Nameplate Image
                    </h3>
                    <p className="text-[10px] text-slate-400 font-medium">
                      {selectedQuote.attachments?.[0]?.name} ({selectedQuote.attachments?.[0]?.size}
                      )
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAttachmentOpen(false)}
                  className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Metal Plate Container */}
              <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex justify-center items-center my-4 overflow-hidden">
                <div className="w-[380px] h-[210px] bg-gradient-to-br from-slate-300 via-slate-400 to-slate-500 rounded p-4 border-2 border-slate-600 shadow-inner relative flex flex-col justify-between font-mono text-slate-900 select-none text-[10px]">
                  {/* Screws/Rivets */}
                  <div className="absolute top-1.5 left-1.5 w-2 h-2 rounded-full bg-slate-700 border border-slate-500 shadow-xs"></div>
                  <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-slate-700 border border-slate-500 shadow-xs"></div>
                  <div className="absolute bottom-1.5 left-1.5 w-2 h-2 rounded-full bg-slate-700 border border-slate-500 shadow-xs"></div>
                  <div className="absolute bottom-1.5 right-1.5 w-2 h-2 rounded-full bg-slate-700 border border-slate-500 shadow-xs"></div>

                  {/* Metal Plate Header */}
                  <div className="flex justify-between items-start border-b border-slate-600 pb-1.5">
                    <div>
                      <span className="font-sans font-black text-xs tracking-tight text-slate-950">
                        SULZER PUMPS
                      </span>
                      <span className="text-[8px] font-sans block text-slate-700 -mt-0.5">
                        Global Manufacturing Division
                      </span>
                    </div>
                    <div className="text-right text-[8px] text-slate-800">
                      <span>Made in Germany</span>
                    </div>
                  </div>

                  {/* Metal Plate Fields */}
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 my-2">
                    <div className="border border-slate-500/45 p-1 bg-slate-100/50 rounded">
                      <span className="text-[7.5px] text-slate-600 block leading-none">
                        PUMP TYPE / CASING
                      </span>
                      <span className="font-bold text-[10.5px] text-slate-950 font-mono tracking-tight">
                        XFP-PE1-80C-CB1.3
                      </span>
                    </div>
                    <div className="border border-slate-500/45 p-1 bg-slate-100/50 rounded">
                      <span className="text-[7.5px] text-slate-600 block leading-none">
                        SERIAL NO / ID
                      </span>
                      <span className="font-bold text-[10.5px] text-emerald-950 font-mono tracking-tight">
                        301009204
                      </span>
                    </div>
                    <div className="border border-slate-500/45 p-1 bg-slate-100/50 rounded">
                      <span className="text-[7.5px] text-slate-600 block leading-none">
                        HYDRAULIC KIT REF
                      </span>
                      <span className="font-bold text-[10.5px] text-slate-950 font-mono tracking-tight">
                        FP80C-CB1.3
                      </span>
                    </div>
                    <div className="border border-slate-500/45 p-1 bg-slate-100/50 rounded">
                      <span className="text-[7.5px] text-slate-600 block leading-none">
                        ORDER REFERENCE
                      </span>
                      <span className="font-bold text-[10.5px] text-slate-950 font-mono tracking-tight">
                        3674455
                      </span>
                    </div>
                  </div>

                  {/* Technical values footer on tag */}
                  <div className="flex justify-between items-center text-[7.5px] text-slate-700 pt-1 border-t border-slate-600/50">
                    <span>kW: 2.9 | RPM: 1450</span>
                    <span>Class H | IP68</span>
                    <span>H-Max: 24m | Q-Max: 85m³/h</span>
                  </div>
                </div>
              </div>

              {/* Helper text and copy click */}
              <div className="text-[11px] text-slate-500 italic mb-4 leading-relaxed text-center">
                💡 High-resolution OCR identifies model{' '}
                <span className="font-bold font-mono text-slate-700">FP80C-CB1.3</span> and serial{' '}
                <span className="font-bold font-mono text-slate-700">301009204</span> on this metal
                nameplate.
              </div>

              <div className="flex gap-2.5">
                <button
                  onClick={() => {
                    setPartNumber('FP80C-CB1.3');
                    setSerialNumber('301009204');
                    setIsAttachmentOpen(false);
                  }}
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold text-xs shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  id="btn-autofill-attachment"
                >
                  📥 Extract & Copy parameters to Form
                </button>
                <button
                  onClick={() => setIsAttachmentOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded font-bold text-xs transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
