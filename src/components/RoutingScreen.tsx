import React from 'react';
import { motion } from 'motion/react';
import {
  GitBranch,
  ShieldAlert,
  CheckSquare,
  Sparkles,
  Building2,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  ArrowRightLeft,
  Cpu,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { QuoteInquiry } from '../types';
import { getRoutingInsight } from '../mockRecommendationData';

interface RoutingScreenProps {
  quotes: QuoteInquiry[];
  onRouteEngineering: (id: string) => void;
  onAcceptHub: (id: string) => void;
  onAcceptAiAgent: (id: string) => void;
  onResetStatus?: (id: string, status: QuoteInquiry['status']) => void;
  onGoToQuote: (id: string) => void;
}

export default function RoutingScreen({
  quotes,
  onRouteEngineering,
  onAcceptHub,
  onAcceptAiAgent,
  onResetStatus,
  onGoToQuote,
}: RoutingScreenProps) {
  // We classify quotes that passed Screen 1 as follows:
  // 1. Backlog (status = 'qualified')
  // 2. Engineering (status = 'engineering_routed')
  // 3. AI Agent Desk (status = 'accepted_ai_agent')
  // 4. Hub Queue (status = 'accepted_hub' or 'completed')

  const backlogQuotes = quotes.filter(q => q.status === 'qualified');
  const engineeringQuotes = quotes.filter(q => q.status === 'engineering_routed');
  const aiQuotes = quotes.filter(q => q.status === 'accepted_ai_agent');
  const hubQuotes = quotes.filter(q => q.status === 'accepted_hub' || q.status === 'completed');

  return (
    <div className="flex flex-col gap-4" id="routing-screen-layout">
      {/* Intro Header */}
      <div className="bg-white border border-[#e1e6eb] rounded-lg p-3.5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <h2 className="font-sans font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
            <GitBranch className="w-4 h-4 text-[#004b93]" />
            COMPLEXITY ROUTING & CPQ DISPATCH GATEWAY
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl font-medium">
            Quotes qualified in Stage 1 flow here. Verify complexity rules and dispatch to either
            the autonomous AI agent or human engineers.
          </p>
        </div>
        <div className="flex items-center gap-1 bg-slate-50 border border-[#e1e6eb] px-2.5 py-1 rounded-full text-slate-700 text-[10.5px] font-bold">
          <ShieldCheck className="w-3.5 h-3.5 text-[#004b93]" />
          <span>Manual Dispatch Protocol Active</span>
        </div>
      </div>

      {/* Routing Rules Summary Banner (Zero visual clutter, informative) */}
      <div className="bg-slate-50 border border-[#e1e6eb] rounded-lg p-3.5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex gap-2.5 items-start">
          <div className="p-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded">
            <Cpu className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[10.5px] font-bold text-slate-800 uppercase block tracking-wider">
              Class 1: Simple Spare Parts (AI Eligible)
            </span>
            <span className="text-[10px] text-slate-500 font-medium leading-relaxed block mt-0.5">
              Basic casing seals, routine gaskets, and standard impellers with 100% confidence.
              Eligible for instant autonomous AI parsing and SAP CPQ compiling.
            </span>
          </div>
        </div>
        <div className="flex gap-2.5 items-start border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-4">
          <div className="p-1.5 bg-amber-50 text-amber-700 border border-amber-100 rounded">
            <Building2 className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[10.5px] font-bold text-slate-800 uppercase block tracking-wider">
              Class 2: Engineered Packages (Manual Desk)
            </span>
            <span className="text-[10px] text-slate-500 font-medium leading-relaxed block mt-0.5">
              Heavy metallurgic impellers, custom dynamic stress ratings, or structural casing
              trims. Requires specialist certification & manual pricing.
            </span>
          </div>
        </div>
      </div>

      {/* Kanban Board columns — horizontal scroll on mobile */}
      <div className="-mx-1 overflow-x-auto pb-2" id="kanban-scroll-wrapper">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 min-w-[640px] px-1" id="kanban-board">
          {/* COLUMN 1: Needs Routing */}
          <div
            className="bg-white border border-[#e1e6eb] rounded-lg p-3 flex flex-col"
            id="col-needs-routing"
          >
            <div className="flex items-center justify-between mb-3 px-1 border-b border-slate-100 pb-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                <h3 className="font-sans font-bold text-slate-850 text-xs uppercase tracking-wider">
                  Qualified Backlog
                </h3>
              </div>
              <span className="bg-slate-100 text-slate-700 font-mono text-[10px] font-black px-2 py-0.5 rounded-full">
                {backlogQuotes.length}
              </span>
            </div>

            <div className="flex flex-col gap-3" id="backlog-cards">
              {backlogQuotes.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-6 text-center bg-slate-50/50 border border-dashed border-slate-200 rounded-md text-slate-400 text-xs">
                  <CheckSquare className="w-6 h-6 text-slate-300 mb-1.5" />
                  No backlog inquiries. Complete Stage 1 qualification.
                </div>
              ) : (
                backlogQuotes.map(quote => {
                  const isSimple =
                    quote.suggestedComplexity === 'Simple' && quote.id !== 'REQ-2026-006';
                  return (
                    <motion.div
                      layoutId={`routing-card-${quote.id}`}
                      key={quote.id}
                      id={`card-backlog-${quote.id}`}
                      className="bg-white border border-[#e1e6eb] hover:border-[#004b93] rounded-md p-3.5 shadow-2xs hover:shadow-xs transition-all flex flex-col gap-2.5 relative"
                    >
                      {/* Card Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-[9px] text-slate-400 font-bold font-mono">
                            {quote.id}
                          </div>
                          <h4 className="font-bold text-slate-900 text-xs leading-tight">
                            {quote.customerName}
                          </h4>
                          <p className="text-[10px] text-slate-500 truncate max-w-[150px] font-medium">
                            {quote.subject}
                          </p>
                        </div>

                        {/* Suggested Complexity Badge */}
                        <span
                          className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded ${
                            isSimple
                              ? 'bg-slate-100 text-[#004b93] border border-slate-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {quote.suggestedComplexity}
                        </span>
                      </div>

                      {/* Card Specs */}
                      <div className="bg-slate-50 rounded-md p-2 grid grid-cols-2 gap-1.5 font-mono text-[9px] text-slate-600 border border-slate-100/50">
                        <div>
                          <span className="text-slate-450 text-[8px] block uppercase font-sans font-bold">
                            Part Ref:
                          </span>
                          <span className="font-bold text-slate-850 truncate block">
                            {quote.partNumberCorrected || 'N/A'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-450 text-[8px] block uppercase font-sans font-bold">
                            Serial Ref:
                          </span>
                          <span className="font-bold text-slate-850 truncate block">
                            {quote.serialNumberCorrected || 'N/A'}
                          </span>
                        </div>
                      </div>

                      {/* AI Agent Eligibility Flag (Addresses requirement directly) */}
                      <div className="pt-1.5 pb-0.5 border-t border-slate-100">
                        {isSimple ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-emerald-700 text-[10px] font-bold bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                              <Sparkles className="w-3 h-3 text-emerald-600" />
                              <span>✓ AI Agent Eligible</span>
                            </div>
                            <span className="text-[9px] text-slate-400 block font-medium leading-relaxed pl-1">
                              Routine spare part match. Can compile fully autonomously.
                            </span>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-slate-600 text-[10px] font-bold bg-slate-50 px-2 py-1 rounded border border-slate-200">
                              <ShieldAlert className="w-3 h-3 text-slate-400" />
                              <span>✕ AI Ineligible (Manual Only)</span>
                            </div>
                            <span className="text-[9px] text-slate-400 block font-medium leading-relaxed pl-1">
                              Engineering review required for tolerance stress tolerances.
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Technical Reason */}
                      <p className="text-[10px] text-slate-500 bg-slate-50 px-2 py-1 rounded border-l-2 border-[#004b93] italic leading-relaxed">
                        🤖 "{quote.notes}"
                      </p>

                      <div className="rounded-md border border-slate-200 bg-slate-50/70 p-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[8px] font-bold uppercase tracking-wider text-slate-500">
                            Routing insight
                          </span>
                          <span className="text-[8px] font-semibold text-[#004b93] bg-white px-1.5 py-0.3 rounded-full border border-slate-200">
                            {getRoutingInsight(quote).title}
                          </span>
                        </div>
                        <p className="mt-1 text-[9px] font-semibold text-slate-800">
                          {getRoutingInsight(quote).summary}
                        </p>
                        <p className="mt-0.5 text-[8.5px] text-slate-600">
                          {getRoutingInsight(quote).detail}
                        </p>
                        <div className="mt-1.5 space-y-0.5">
                          {getRoutingInsight(quote).sources.map((source, idx) => (
                            <div key={idx} className="text-[8px] text-slate-500">
                              <span className="font-semibold text-slate-700">{source.label}:</span>{' '}
                              {source.value}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Explicit Routing Actions */}
                      <div className="flex flex-col gap-1.5 mt-1 pt-2 border-t border-slate-100">
                        {!isSimple ? (
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => onRouteEngineering(quote.id)}
                              className="flex-1 px-2 py-1.5 border border-amber-300 text-amber-850 hover:bg-amber-50 rounded-md text-[10px] font-bold flex items-center justify-center gap-1 transition-colors"
                              id={`btn-route-eng-${quote.id}`}
                            >
                              <Building2 className="w-3 h-3" />
                              Local Back office
                            </button>
                            <button
                              onClick={() => onAcceptHub(quote.id)}
                              className="flex-1 px-2 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-md text-[10px] font-bold flex items-center justify-center gap-1 transition-colors shadow-2xs"
                              id={`btn-accept-hub-${quote.id}`}
                            >
                              Pune Hub
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => onAcceptHub(quote.id)}
                              className="flex-1 px-2 py-1.5 border border-slate-250 text-slate-700 hover:bg-slate-50 bg-white rounded-md text-[10px] font-bold flex items-center justify-center gap-1 transition-colors"
                              id={`btn-accept-hub-pune-${quote.id}`}
                            >
                              Pune Hub
                            </button>
                            <button
                              onClick={() => onAcceptAiAgent(quote.id)}
                              className="flex-1 px-2 py-1.5 bg-[#004b93] hover:bg-[#003d78] text-white rounded-md text-[10px] font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                              id={`btn-accept-hub-ai-${quote.id}`}
                            >
                              <Cpu className="w-3.5 h-3.5 text-white" />
                              Accept for AI agent
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>

          {/* COLUMN 2: Routed to Local Back Office */}
          <div
            className="bg-white border border-[#e1e6eb] rounded-lg p-3 flex flex-col"
            id="col-eng-routing"
          >
            <div className="flex items-center justify-between mb-3 px-1 border-b border-slate-100 pb-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <h3 className="font-sans font-bold text-slate-850 text-xs uppercase tracking-wider">
                  Local Back Office
                </h3>
              </div>
              <span className="bg-amber-50 text-amber-800 font-mono text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-100">
                {engineeringQuotes.length}
              </span>
            </div>

            <div className="flex flex-col gap-3" id="engineering-cards">
              {engineeringQuotes.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-6 text-center bg-slate-50/50 border border-dashed border-slate-200 rounded-md text-slate-400 text-xs">
                  <Building2 className="w-6 h-6 text-slate-300 mb-1.5" />
                  Local Back Office is empty. Complex items routed here.
                </div>
              ) : (
                engineeringQuotes.map(quote => (
                  <motion.div
                    layoutId={`routing-card-${quote.id}`}
                    key={quote.id}
                    id={`card-eng-${quote.id}`}
                    className="bg-white border border-[#e1e6eb] rounded-md p-3.5 shadow-2xs flex flex-col gap-2.5 relative"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-[9px] text-slate-400 font-bold font-mono">
                          {quote.id}
                        </div>
                        <h4 className="font-bold text-slate-900 text-xs">{quote.customerName}</h4>
                        <p className="text-[10px] text-slate-500 truncate max-w-[150px] font-medium">
                          {quote.subject}
                        </p>
                      </div>
                      <span className="text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                        <AlertTriangle className="w-2.5 h-2.5 text-amber-500" />
                        Eng Review
                      </span>
                    </div>

                    <div className="bg-slate-50 rounded-md p-2 font-mono text-[9px] text-slate-600 border border-slate-100/50">
                      <div>
                        <span className="font-bold text-slate-700">Part: </span>
                        {quote.partNumberCorrected}
                      </div>
                      <div className="mt-0.5">
                        <span className="font-bold text-slate-700">Serial: </span>
                        {quote.serialNumberCorrected}
                      </div>
                    </div>

                    <p className="text-[10px] text-slate-500 bg-amber-50/10 p-2 rounded-md border-l-2 border-amber-400 leading-relaxed font-medium">
                      ⚙️ Flagged for metallurgical tolerances & material certificate inspection.
                    </p>

                    <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100">
                      {onResetStatus && (
                        <button
                          onClick={() => onResetStatus(quote.id, 'qualified')}
                          className="px-2 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-md text-[10px] font-bold flex items-center gap-1 transition-colors flex-1 justify-center"
                          id={`btn-reroute-back-${quote.id}`}
                        >
                          <ArrowRightLeft className="w-2.5 h-2.5 text-slate-400" />
                          Re-route
                        </button>
                      )}
                      <button
                        onClick={() => onAcceptHub(quote.id)}
                        className="px-2 py-1.5 bg-[#004b93] hover:bg-[#003d78] text-white rounded-md text-[10px] font-bold flex items-center gap-1 transition-colors flex-1 justify-center shadow-2xs"
                        id={`btn-eng-to-hub-${quote.id}`}
                      >
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        Approve Hub
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* COLUMN 3: Autonomous AI Agent Desk (New Column!) */}
          <div
            className="bg-slate-50/50 border border-[#e1e6eb] rounded-lg p-3 flex flex-col"
            id="col-ai-agent-desk"
          >
            <div className="flex items-center justify-between mb-3 px-1 border-b border-slate-200 pb-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#004b93] animate-pulse"></span>
                <h3 className="font-sans font-bold text-[#004b93] text-xs uppercase tracking-wider flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5" />
                  AI Agent Queue
                </h3>
              </div>
              <span className="bg-[#004b93]/10 text-[#004b93] font-mono text-[10px] font-black px-2 py-0.5 rounded-full border border-[#004b93]/20">
                {aiQuotes.length}
              </span>
            </div>

            <div className="flex flex-col gap-3" id="ai-agent-cards">
              {aiQuotes.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-6 text-center bg-white border border-dashed border-slate-200 rounded-md text-slate-400 text-xs">
                  <Cpu className="w-6 h-6 text-slate-300 mb-1.5" />
                  No simple items routed to the AI Agent yet. Accept eligible items on the left.
                </div>
              ) : (
                aiQuotes.map(quote => (
                  <motion.div
                    layoutId={`routing-card-${quote.id}`}
                    key={quote.id}
                    id={`card-ai-${quote.id}`}
                    className="bg-white border-2 border-emerald-500/30 rounded-md p-3.5 shadow-xs flex flex-col gap-2.5 relative"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-[9px] text-slate-400 font-bold font-mono">
                          {quote.id}
                        </div>
                        <h4 className="font-bold text-slate-900 text-xs">{quote.customerName}</h4>
                        <p className="text-[10px] text-slate-500 truncate max-w-[150px] font-medium">
                          {quote.subject}
                        </p>
                      </div>
                      <span className="text-[8px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded flex items-center gap-1 shrink-0">
                        <Sparkles className="w-2.5 h-2.5 text-emerald-600 animate-pulse" />
                        Auto-Synced
                      </span>
                    </div>

                    {/* AI Execution Trace (Provides detailed intelligence of the agent) */}
                    <div className="bg-slate-50 rounded-md p-2.5 text-[9px] font-mono border border-slate-100/50 space-y-1">
                      <div className="flex items-center justify-between text-emerald-700">
                        <span>✓ Metadata Verification:</span>
                        <span className="font-bold">100% Match</span>
                      </div>
                      <div className="flex items-center justify-between text-emerald-700">
                        <span>✓ Metallurgical Clearance:</span>
                        <span className="font-bold">Class 1 Safe</span>
                      </div>
                      <div className="flex items-center justify-between text-emerald-700">
                        <span>✓ SAP CPQ Synced:</span>
                        <span className="font-bold">${quote.price.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between text-emerald-700">
                        <span>✓ Outbound Draft:</span>
                        <span className="font-bold">Generated</span>
                      </div>
                    </div>

                    <p className="text-[10px] text-slate-500 bg-slate-50 p-2 rounded-md border-l-2 border-emerald-500 leading-snug">
                      🤖 Autonomous run successful. Quote compilation cached & synchronized in SAP
                      CPQ.
                    </p>

                    <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100">
                      {onResetStatus && (
                        <button
                          onClick={() => onResetStatus(quote.id, 'qualified')}
                          className="px-2 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-md text-[10px] font-bold flex items-center gap-1 transition-colors flex-1 justify-center"
                          id={`btn-reroute-ai-back-${quote.id}`}
                        >
                          <ArrowRightLeft className="w-2.5 h-2.5 text-slate-400" />
                          Re-route
                        </button>
                      )}
                      <button
                        onClick={() => onGoToQuote(quote.id)}
                        className="px-2 py-1.5 bg-slate-900 hover:bg-black text-white rounded-md text-[10px] font-bold flex items-center gap-1 transition-colors flex-1 justify-center shadow-2xs"
                        id={`btn-ai-to-quote-desk-${quote.id}`}
                      >
                        <span>Quote Desk</span>
                        <ChevronRight className="w-3 h-3 text-slate-400" />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* COLUMN 4: Pune Hub */}
          <div
            className="bg-white border border-[#e1e6eb] rounded-lg p-3 flex flex-col"
            id="col-hub-routing"
          >
            <div className="flex items-center justify-between mb-3 px-1 border-b border-slate-100 pb-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <h3 className="font-sans font-bold text-slate-850 text-xs uppercase tracking-wider">
                  Pune Hub (Manual)
                </h3>
              </div>
              <span className="bg-emerald-55/10 text-emerald-800 font-mono text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-100">
                {hubQuotes.length}
              </span>
            </div>

            <div className="flex flex-col gap-3" id="hub-cards">
              {hubQuotes.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-6 text-center bg-slate-50/50 border border-dashed border-slate-200 rounded-md text-slate-400 text-xs">
                  <CheckCircle2 className="w-6 h-6 text-slate-300 mb-1.5" />
                  Pune Hub Queue is empty. Routed inquiries appear here.
                </div>
              ) : (
                hubQuotes.map(quote => (
                  <motion.div
                    layoutId={`routing-card-${quote.id}`}
                    key={quote.id}
                    id={`card-hub-${quote.id}`}
                    className="bg-white border border-[#e1e6eb] rounded-md p-3.5 shadow-2xs flex flex-col gap-2.5 relative"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-[9px] text-slate-400 font-bold font-mono">
                          {quote.id}
                        </div>
                        <h4 className="font-bold text-slate-900 text-xs">{quote.customerName}</h4>
                        <p className="text-[10px] text-slate-500 truncate max-w-[150px] font-medium">
                          {quote.subject}
                        </p>
                      </div>
                      {quote.status === 'completed' ? (
                        <span className="text-[9px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-150">
                          ✓ Sent
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold bg-slate-50 text-[#004b93] px-2 py-0.5 rounded border border-[#004b93]/10">
                          ✓ In Queue
                        </span>
                      )}
                    </div>

                    <div className="bg-slate-50 rounded-md p-2 font-mono text-[9px] text-slate-600 border border-slate-100/50">
                      <div>
                        <span className="font-bold text-slate-700">Part: </span>
                        {quote.partNumberCorrected}
                      </div>
                      <div className="mt-0.5">
                        <span className="font-bold text-slate-700">Serial: </span>
                        {quote.serialNumberCorrected}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 mt-1.5">
                      {onResetStatus && quote.status !== 'completed' && (
                        <button
                          onClick={() => onResetStatus(quote.id, 'qualified')}
                          className="px-2 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-md text-[10px] font-bold flex items-center gap-1 transition-colors flex-1 justify-center"
                          id={`btn-reroute-hub-back-${quote.id}`}
                        >
                          <ArrowRightLeft className="w-2.5 h-2.5 text-slate-400" />
                          Re-route
                        </button>
                      )}
                      <button
                        onClick={() => onGoToQuote(quote.id)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-md text-[10px] font-bold flex items-center justify-center gap-1 transition-all flex-1"
                        id={`btn-open-quote-desk-${quote.id}`}
                      >
                        Open Desk
                        <ChevronRight className="w-3 h-3 text-slate-400" />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
