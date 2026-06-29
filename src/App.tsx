import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, HelpCircle, AlertCircle, Sparkles, CheckSquare, RefreshCw, Bell, X, FileText, CheckCircle2, Lock, Play, Search, Menu } from 'lucide-react';
import { INITIAL_QUOTES } from './data';
import { QuoteInquiry } from './types';
import IntakeScreen from './components/IntakeScreen';
import RoutingScreen from './components/RoutingScreen';
import QuoteScreen from './components/QuoteScreen';

interface Notification {
  id: string;
  text: string;
  type: 'success' | 'info' | 'warning';
}

export default function App() {
  const [quotes, setQuotes] = useState<QuoteInquiry[]>(() => {
    // Try to load from localStorage if exists, otherwise initial data
    try {
      const saved = localStorage.getItem('sales_hub_quotes');
      if (saved && saved.includes('REQ-2026-006')) {
        return JSON.parse(saved);
      }
      return INITIAL_QUOTES;
    } catch {
      return INITIAL_QUOTES;
    }
  });

  const [activeTab, setActiveTab] = useState<'intake' | 'routing' | 'quote'>('intake');
  const [selectedIntakeId, setSelectedIntakeId] = useState('REQ-2026-001');
  const [selectedQuoteId, setSelectedQuoteId] = useState('REQ-2026-003');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState<string | null>(null);
  const [showTutorial, setShowTutorial] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Global search filtering
  const filteredQuotes = quotes.filter((q) => {
    const query = searchQuery.toLowerCase();
    return (
      q.id.toLowerCase().includes(query) ||
      q.customerName.toLowerCase().includes(query) ||
      q.customerEmail.toLowerCase().includes(query) ||
      q.subject.toLowerCase().includes(query) ||
      (q.partNumberExtracted || '').toLowerCase().includes(query) ||
      (q.partNumberCorrected || '').toLowerCase().includes(query) ||
      (q.serialNumberExtracted || '').toLowerCase().includes(query) ||
      (q.serialNumberCorrected || '').toLowerCase().includes(query) ||
      (q.quoteNumber || '').toLowerCase().includes(query)
    );
  });

  const handleSearchResultClick = (q: QuoteInquiry) => {
    if (q.status === 'unqualified' || q.status === 'clarification_draft' || q.status === 'awaiting_clarification') {
      setActiveTab('intake');
      setSelectedIntakeId(q.id);
    } else if (q.status === 'qualified' || q.status === 'engineering_routed') {
      setActiveTab('routing');
    } else {
      setActiveTab('quote');
      setSelectedQuoteId(q.id);
    }
    setShowSearchResults(false);
    setSearchQuery('');
    triggerNotification(`Navigated to ${q.customerName}'s inquiry (${q.id})`, 'info');
  };

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('sales_hub_quotes', JSON.stringify(quotes));
  }, [quotes]);

  // Helper to trigger alert notifications
  const triggerNotification = (text: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const newId = Date.now().toString();
    setNotifications((prev) => [...prev, { id: newId, text, type }]);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== newId));
    }, 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Reset the demo to starting conditions
  const handleResetDemo = () => {
    setQuotes(INITIAL_QUOTES);
    setSelectedIntakeId('REQ-2026-001');
    setSelectedQuoteId('REQ-2026-003');
    setActiveTab('intake');
    triggerNotification('Demo data reset to default configuration.', 'info');
  };

  // HANDLER: Qualify Complete in Stage 1
  const handleQualifyComplete = (id: string, partNo: string, serialNo: string) => {
    setQuotes((prev) =>
      prev.map((q) => {
        if (q.id === id) {
          return {
            ...q,
            status: 'qualified',
            partNumberCorrected: partNo,
            serialNumberCorrected: serialNo,
            notes: 'Human-qualified & routed to SFDC for Opportunity creation. Ready for Complexity Routing.',
          };
        }
        return q;
      })
    );

    const targetQuote = quotes.find((q) => q.id === id);
    triggerNotification(
      `🎉 Verified ${targetQuote?.customerName}'s inquiry. SFDC Opportunity Created & parameters synced to Sales Cloud pipeline!`,
      'success'
    );

    // Auto-select another unqualified item if exists
    const remainingUnqualified = quotes.filter(
      (q) => q.id !== id && (q.status === 'unqualified' || q.status === 'clarification_draft')
    );
    if (remainingUnqualified.length > 0) {
      setSelectedIntakeId(remainingUnqualified[0].id);
    }

    // Give a beautiful suggestion to move to Tab 2
    setTimeout(() => {
      triggerNotification('💡 Inflow qualified! Switch to Tab 2: Complexity Routing to dispatch it.', 'info');
    }, 1500);
  };

  // HANDLER: Log as Informational Request (RFI) in Stage 1
  const handleLogAsRfi = (id: string, emailText: string) => {
    setQuotes((prev) =>
      prev.map((q) => {
        if (q.id === id) {
          return {
            ...q,
            status: 'completed',
            draftEmailText: emailText,
            notes: 'Resolved as RFI (Request for Information). Email response sent & logged in SFDC as informational (Closed - No active Opportunity).',
          };
        }
        return q;
      })
    );

    const targetQuote = quotes.find((q) => q.id === id);
    triggerNotification(`ℹ️ Logged RFI for ${targetQuote?.customerName} in SFDC (Informational). Sent response email.`, 'success');

    // Auto-select another unqualified item if exists
    const remainingUnqualified = quotes.filter(
      (q) => q.id !== id && (q.status === 'unqualified' || q.status === 'clarification_draft' || q.status === 'awaiting_clarification')
    );
    if (remainingUnqualified.length > 0) {
      setSelectedIntakeId(remainingUnqualified[0].id);
    }
  };

  // HANDLER: Send Clarification Request in Stage 1
  const handleSendClarification = (id: string, emailText: string) => {
    setQuotes((prev) =>
      prev.map((q) => {
        if (q.id === id) {
          return {
            ...q,
            status: 'awaiting_clarification',
            clarificationEmailText: emailText,
            notes: 'Clarification email sent. Awaiting client serial number submission.',
          };
        }
        return q;
      })
    );

    const targetQuote = quotes.find((q) => q.id === id);
    triggerNotification(`✉️ Clarification request transmitted to ${targetQuote?.customerName}. Status updated.`, 'info');
  };

  // HANDLER: Route to Local Engineering in Stage 2
  const handleRouteEngineering = (id: string) => {
    setQuotes((prev) =>
      prev.map((q) => {
        if (q.id === id) {
          return {
            ...q,
            status: 'engineering_routed',
            finalComplexity: 'Complex',
          };
        }
        return q;
      })
    );
    triggerNotification('⚙️ Routed inquiry to Local Metallurgical Engineering queue.', 'warning');
  };

  // HANDLER: Accept into Hub Queue in Stage 2
  const handleAcceptHub = (id: string) => {
    setQuotes((prev) =>
      prev.map((q) => {
        if (q.id === id) {
          return {
            ...q,
            status: 'accepted_hub',
            finalComplexity: q.suggestedComplexity,
          };
        }
        return q;
      })
    );

    setSelectedQuoteId(id);
    triggerNotification('🚀 Approved for Hub processing. Item is now active in Tab 3: Quote Desk.', 'success');

    // Suggest switching to Tab 3
    setTimeout(() => {
      triggerNotification('💡 Card dispatched! Navigate to Tab 3: Quote Generation to customize and send.', 'info');
    }, 1200);
  };

  // HANDLER: Route to Autonomous AI Desk in Stage 2
  const handleAcceptAiAgent = (id: string) => {
    setQuotes((prev) =>
      prev.map((q) => {
        if (q.id === id) {
          return {
            ...q,
            status: 'accepted_ai_agent',
            finalComplexity: 'Simple',
          };
        }
        return q;
      })
    );

    setSelectedQuoteId(id);
    triggerNotification('🤖 Routed to Autonomous AI Desk. AI Agent is compiling parts and drafts...', 'info');

    // Simulate autonomous completion notification
    setTimeout(() => {
      triggerNotification('✓ AI Agent auto-compiled the SAP CPQ quote and finalized the customer draft! Ready for review.', 'success');
    }, 2000);

    // Suggest switching to Tab 3
    setTimeout(() => {
      triggerNotification('💡 Auto-quote compiled! Navigate to Tab 3: Quote Generation to send.', 'info');
    }, 3200);
  };

  // HANDLER: Reset status (useful for moving cards back on Kanban)
  const handleResetStatus = (id: string, status: QuoteInquiry['status']) => {
    setQuotes((prev) =>
      prev.map((q) => {
        if (q.id === id) {
          return { ...q, status };
        }
        return q;
      })
    );
    triggerNotification('🔄 Moved item back to pending queue.', 'info');
  };

  // HANDLER: Update quote parameters (price, discount, shipping, messages) in Stage 3
  const handleUpdateQuoteDetails = (id: string, updates: Partial<QuoteInquiry>) => {
    setQuotes((prev) =>
      prev.map((q) => {
        if (q.id === id) {
          return { ...q, ...updates };
        }
        return q;
      })
    );
  };

  // HANDLER: Final Approve & Send to Customer
  const handleApproveAndSend = (id: string) => {
    setQuotes((prev) =>
      prev.map((q) => {
        if (q.id === id) {
          return { ...q, status: 'completed' };
        }
        return q;
      })
    );
    setShowSuccessModal(id);
    triggerNotification('🎉 Quotation approved, signed, and transmitted to customer!', 'success');
  };

  // Tab counters for badge display
  const countIntake = quotes.filter(
    (q) => q.status === 'unqualified' || q.status === 'clarification_draft' || q.status === 'awaiting_clarification'
  ).length;
  
  const countRouting = quotes.filter((q) => q.status === 'qualified').length;
  
  const countQuote = quotes.filter((q) => q.status === 'accepted_hub' || q.status === 'accepted_ai_agent').length;

  const activeModalQuote = quotes.find((q) => q.id === showSuccessModal);

  return (
    <div className="min-h-screen bg-[#eff3f6] text-[#1e293b] font-sans flex flex-col justify-between" id="app-workspace">
      
      {/* GLOBAL TOAST STACK */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full" id="notification-toasts">
        <AnimatePresence>
          {notifications.map((notif) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              className={`p-4 rounded shadow border flex items-start gap-3 bg-white ${
                notif.type === 'success'
                  ? 'border-emerald-200 bg-emerald-50/95 text-emerald-900'
                  : notif.type === 'warning'
                  ? 'border-amber-200 bg-amber-50/95 text-amber-900'
                  : 'border-slate-200 bg-white/95 text-slate-900'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {notif.type === 'success' ? (
                  <CheckSquare className="w-5 h-5 text-emerald-600" />
                ) : notif.type === 'warning' ? (
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                ) : (
                  <Bell className="w-5 h-5 text-[#004b93]" />
                )}
              </div>
              <div className="flex-1 text-xs font-semibold leading-relaxed">
                {notif.text}
              </div>
              <button
                onClick={() => removeNotification(notif.id)}
                className="text-slate-400 hover:text-slate-600 shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div>
        {/* APP HEADER */}
        <header className="bg-white border-b border-[#e1e6eb] px-6 sticky top-0 z-40 shadow-xs" id="global-header">
          <div className="max-w-7xl mx-auto flex items-center justify-between h-14">
            
            {/* Logo and Nav Menu */}
            <div className="flex items-center gap-10">
              <span className="font-sans font-extrabold tracking-wider text-[#004b93] text-xl select-none">SULZER</span>
              
              <nav className="hidden md:flex items-stretch h-14">
                <button
                  onClick={() => setActiveTab('intake')}
                  className={`px-4 h-full text-xs font-semibold transition-all relative flex items-center gap-1.5 ${
                    activeTab === 'intake' ? 'text-[#004b93]' : 'text-slate-600 hover:text-[#004b93]'
                  }`}
                  id="tab-nav-intake"
                >
                  <span>Intake & Completeness</span>
                  {countIntake > 0 && (
                    <span className="bg-[#004b93] text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                      {countIntake}
                    </span>
                  )}
                  {activeTab === 'intake' && (
                    <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#004b93]" />
                  )}
                </button>
                
                <button
                  onClick={() => setActiveTab('routing')}
                  className={`px-4 h-full text-xs font-semibold transition-all relative flex items-center gap-1.5 ${
                    activeTab === 'routing' ? 'text-[#004b93]' : 'text-slate-600 hover:text-[#004b93]'
                  }`}
                  id="tab-nav-routing"
                >
                  <span>Complexity Routing</span>
                  {countRouting > 0 && (
                    <span className="bg-amber-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                      {countRouting}
                    </span>
                  )}
                  {activeTab === 'routing' && (
                    <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#004b93]" />
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('quote')}
                  className={`px-4 h-full text-xs font-semibold transition-all relative flex items-center gap-1.5 ${
                    activeTab === 'quote' ? 'text-[#004b93]' : 'text-slate-600 hover:text-[#004b93]'
                  }`}
                  id="tab-nav-quote"
                >
                  <span>Quote Generation</span>
                  {countQuote > 0 && (
                    <span className="bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                      {countQuote}
                    </span>
                  )}
                  {activeTab === 'quote' && (
                    <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#004b93]" />
                  )}
                </button>
              </nav>
            </div>

            {/* Right Header items matching Sulzer screenshot */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                {/* Global Search Container */}
                <div className="relative flex items-center" id="global-search-container">
                  <input
                    type="text"
                    placeholder="Global Search (Ref, Name, Part...)"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSearchResults(e.target.value.length > 0);
                    }}
                    onFocus={() => {
                      if (searchQuery.length > 0) setShowSearchResults(true);
                    }}
                    className="bg-slate-50 hover:bg-slate-100 focus:bg-white text-[11px] text-slate-700 placeholder-slate-400 border border-slate-200 focus:border-[#004b93] focus:ring-1 focus:ring-[#004b93] rounded-md pl-7 pr-7 py-1 w-44 focus:w-56 transition-all outline-none font-medium"
                    id="global-search-input"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
                  {searchQuery ? (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setShowSearchResults(false);
                      }}
                      className="absolute right-2.5 text-slate-400 hover:text-slate-600 transition-colors"
                      id="btn-clear-search"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  ) : null}

                  {/* Search Results Dropdown Overlay */}
                  {showSearchResults && (
                    <div 
                      className="absolute top-full mt-2 right-0 w-80 bg-white border border-[#e1e6eb] rounded-lg shadow-xl z-50 p-2 overflow-hidden flex flex-col max-h-96" 
                      id="search-results-dropdown"
                    >
                      <div className="px-2 py-1.5 border-b border-slate-100 text-[9px] font-bold text-slate-400 uppercase tracking-wider flex justify-between items-center">
                        <span>Matching Inquiries ({filteredQuotes.length})</span>
                        <button 
                          onClick={() => setShowSearchResults(false)} 
                          className="text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="overflow-y-auto divide-y divide-slate-100 flex-1 max-h-80" id="search-results-list">
                        {filteredQuotes.length === 0 ? (
                          <div className="p-4 text-center text-xs text-slate-400 font-medium">
                            No matches found for "{searchQuery}"
                          </div>
                        ) : (
                          filteredQuotes.map((q) => (
                            <button
                              key={q.id}
                              onClick={() => handleSearchResultClick(q)}
                              className="w-full text-left p-2.5 hover:bg-slate-50 transition-colors flex flex-col gap-1"
                              id={`search-result-item-${q.id}`}
                            >
                              <div className="flex justify-between items-center">
                                <span className="font-mono text-[9px] font-bold text-[#004b93]">{q.id}</span>
                                <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ${
                                  q.status === 'completed'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                    : q.status === 'qualified'
                                    ? 'bg-amber-50 text-amber-700 border-amber-100'
                                    : q.status === 'accepted_hub'
                                    ? 'bg-[#004b93]/5 text-[#004b93] border-[#004b93]/10'
                                    : q.status === 'engineering_routed'
                                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                                    : 'bg-slate-50 text-slate-500 border-slate-200'
                                }`}>
                                  {q.status.replace('_', ' ').toUpperCase()}
                                </span>
                              </div>
                              <div className="font-bold text-xs text-slate-800 truncate">{q.customerName}</div>
                              <div className="text-[10px] text-slate-500 truncate font-medium">{q.subject}</div>
                              {(q.partNumberCorrected || q.serialNumberCorrected) && (
                                <div className="text-[9px] font-mono text-slate-600 bg-slate-50 px-1.5 py-0.5 rounded mt-0.5 flex gap-2">
                                  {q.partNumberCorrected && <span>PN: {q.partNumberCorrected}</span>}
                                  {q.serialNumberCorrected && <span>SN: {q.serialNumberCorrected}</span>}
                                </div>
                              )}
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setShowMenu(true)}
                  className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-[#004b93] transition-colors cursor-pointer"
                  id="btn-global-menu"
                  title="Sulzer Topics & Resources"
                >
                  <Menu className="w-4 h-4" />
                </button>

                <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 text-[#004b93] text-[10px] font-bold flex items-center justify-center select-none cursor-pointer hover:bg-slate-200 transition-colors">
                  D
                </div>
              </div>

              {/* Reset State & Guide */}
              <div className="flex items-center gap-2.5 ml-2 border-l border-slate-200 pl-4">
                <button
                  onClick={() => setShowTutorial(!showTutorial)}
                  className="text-[10px] text-slate-500 hover:text-[#004b93] font-semibold transition-all"
                  id="btn-tutorial-toggle"
                >
                  Quick Guide
                </button>
                <button
                  onClick={handleResetDemo}
                  className="text-[10px] text-slate-500 hover:text-red-600 font-semibold flex items-center gap-1 transition-all"
                  id="btn-reset-data"
                >
                  <RefreshCw className="w-2.5 h-2.5 text-slate-400" />
                  Reset Demo
                </button>
              </div>
            </div>

          </div>
        </header>

        {/* MOBILE NAVIGATION LINKS (Fallback for small screens) */}
        <div className="md:hidden bg-white border-b border-[#e1e6eb] px-4 py-1.5 flex gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('intake')}
            className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              activeTab === 'intake' ? 'bg-[#004b93]/10 text-[#004b93]' : 'text-slate-500'
            }`}
          >
            Intake
          </button>
          <button
            onClick={() => setActiveTab('routing')}
            className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              activeTab === 'routing' ? 'bg-[#004b93]/10 text-[#004b93]' : 'text-slate-500'
            }`}
          >
            Routing
          </button>
          <button
            onClick={() => setActiveTab('quote')}
            className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              activeTab === 'quote' ? 'bg-[#004b93]/10 text-[#004b93]' : 'text-slate-500'
            }`}
          >
            Quote
          </button>
        </div>

        {/* PERSISTENT TUTORIAL / PROTOCOL ACCENT BAR MATCHING SULZER PORTAL */}
        <AnimatePresence>
          {showTutorial && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-[#fff9e6] border-b border-[#f3e5b5] text-amber-900 overflow-hidden shadow-xs"
              id="tutorial-panel"
            >
              <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center justify-between gap-3 text-xs font-sans font-medium">
                <div className="flex items-center gap-2 leading-tight">
                  <span className="text-amber-500 text-sm">⚠️</span>
                  <span>
                    <strong>Max throughput reached:</strong> Make sure to qualify equipment serial & part numbers manually, then route Complex items to either <strong>Pune Hub</strong> or <strong>Local Back office</strong>.
                  </span>
                </div>
                <button
                  onClick={() => setShowTutorial(false)}
                  className="text-amber-700 hover:text-amber-900 font-bold text-[10px] uppercase transition-colors shrink-0"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MAIN STAGE CANVAS */}
        <main className="max-w-7xl mx-auto p-6 flex-1">
          <AnimatePresence mode="wait">
            {activeTab === 'intake' && (
              <motion.div
                key="intake-stage"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
              >
                <IntakeScreen
                  quotes={quotes}
                  selectedId={selectedIntakeId}
                  onSelect={setSelectedIntakeId}
                  onQualifyComplete={handleQualifyComplete}
                  onSendClarification={handleSendClarification}
                  onLogAsRfi={handleLogAsRfi}
                />
              </motion.div>
            )}

            {activeTab === 'routing' && (
              <motion.div
                key="routing-stage"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
              >
                <RoutingScreen
                  quotes={quotes}
                  onRouteEngineering={handleRouteEngineering}
                  onAcceptHub={handleAcceptHub}
                  onAcceptAiAgent={handleAcceptAiAgent}
                  onResetStatus={handleResetStatus}
                  onGoToQuote={(id) => {
                    setSelectedQuoteId(id);
                    setActiveTab('quote');
                  }}
                />
              </motion.div>
            )}

            {activeTab === 'quote' && (
              <motion.div
                key="quote-stage"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
              >
                <QuoteScreen
                  quotes={quotes}
                  selectedId={selectedQuoteId}
                  onSelect={setSelectedQuoteId}
                  onUpdateQuoteDetails={handleUpdateQuoteDetails}
                  onApproveAndSend={handleApproveAndSend}
                  triggerNotification={triggerNotification}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* FOOTER METRICS */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 px-6" id="global-footer">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <div>
            <span>Sales Support Hub Platform © 2026. Enforcing <strong>100% human-verified qualification protocol</strong>.</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>SAP CPQ Sync Active</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              <span>AI Extractor Listening</span>
            </div>
          </div>
        </div>
      </footer>

      {/* SUCCESS TRANSITION MODAL (CONGRATULATIONS / PDF ARCHIVED) */}
      <AnimatePresence>
        {showSuccessModal && activeModalQuote && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm" id="success-modal">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full border border-slate-200 relative overflow-hidden"
            >
              {/* Top abstract graphic bar */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-emerald-600" />
              
              <div className="flex flex-col items-center text-center mt-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                
                <h3 className="font-display font-extrabold text-slate-900 text-xl">Quotation Dispatched</h3>
                <p className="text-slate-500 text-xs mt-1.5 px-2">
                  Document <strong className="font-mono text-slate-800">{activeModalQuote.quoteNumber}</strong> has been qualified, digitally signed, and transmitted to customer.
                </p>

                {/* Tracking simulation block */}
                <div className="w-full bg-slate-50 rounded-lg p-4 border border-slate-100 text-left my-5 flex flex-col gap-2.5 text-xs">
                  <div className="font-bold text-slate-400 text-[10px] uppercase tracking-wider mb-0.5">SAP CPQ Audit Trail Ledger</div>
                  
                  <div className="flex justify-between font-mono">
                    <span className="text-slate-500">Client Recipient:</span>
                    <span className="font-semibold text-slate-800 truncate max-w-[180px]">{activeModalQuote.customerName}</span>
                  </div>
                  
                  <div className="flex justify-between font-mono">
                    <span className="text-slate-500">Document Ref:</span>
                    <span className="font-semibold text-slate-800">{activeModalQuote.quoteNumber}</span>
                  </div>

                  <div className="flex justify-between font-mono">
                    <span className="text-slate-500">Part/Serial Specs:</span>
                    <span className="font-semibold text-slate-800">{activeModalQuote.partNumberCorrected} / {activeModalQuote.serialNumberCorrected}</span>
                  </div>

                  <div className="flex justify-between font-mono border-t border-slate-200/60 pt-2.5">
                    <span className="text-slate-500">Status in SAP CPQ:</span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      QUALIFIED & TRANSMITTED
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => {
                      setShowSuccessModal(null);
                      // Switch back to start tab
                      setActiveTab('intake');
                    }}
                    className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                  >
                    Go Back to Intake
                  </button>
                  <button
                    onClick={() => setShowSuccessModal(null)}
                    className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SIDE DRAWER FOR RELEVANT TOPICS */}
      <AnimatePresence>
        {showMenu && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMenu(false)}
              className="fixed inset-0 bg-slate-900 z-50 cursor-pointer"
              id="menu-drawer-backdrop"
            />
            {/* Drawer Container */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl border-l border-[#e1e6eb] z-50 flex flex-col overflow-hidden"
              id="menu-drawer-container"
            >
              {/* Drawer Header */}
              <div className="p-4 border-b border-[#e1e6eb] bg-slate-50 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2">
                  <Menu className="w-4 h-4 text-[#004b93]" />
                  <h2 className="font-sans font-bold text-slate-900 text-[11px] uppercase tracking-wider">
                    SULZER PORTAL TOPICS & RESOURCES
                  </h2>
                </div>
                <button
                  onClick={() => setShowMenu(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded hover:bg-slate-200 cursor-pointer"
                  id="btn-close-menu-drawer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6" id="menu-drawer-content">
                {/* Section 1: Human-in-the-Loop Protocol */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-[#004b93] uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    Human-in-the-Loop Protocol
                  </h3>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                    Sulzer mandates 100% human-verified qualification. AI extraction automates 80% of routine ingestion, but a human must confirm critical metallurgical tolerances, casing dimensions, and dynamic stress ratings before any quotation is legally dispatched.
                  </p>
                </div>

                {/* Section 2: SAP CPQ Integration */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <RefreshCw className="w-4 h-4 text-emerald-600" />
                    SAP CPQ Integration Engine
                  </h3>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                    Once a quote is qualified and dispatched from Stage 2, spare parts line items are pushed to the gateway cache. Our integration calculates contract-specific bulk discounts, real-time inventory status, and standard freight lead times.
                  </p>
                </div>

                {/* Section 3: Escaped/Complex Cases */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    Complex Cases & Special Engineering
                  </h3>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                    For complex project packages (such as large-scale centrifugal slurry pumps or resized impellers), route the inquiry to the <strong>Local Back office Engineering</strong>. Specialist reviews handle induction case hardening, material safety datasheets, and custom dynamic balancing calculations.
                  </p>
                </div>

                {/* Section 4: Contact Directory */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-slate-500" />
                    Support & Escalation Contacts
                  </h3>
                  <div className="space-y-2 bg-slate-50 border border-[#e1e6eb] rounded-lg p-3 text-[11px] font-medium text-slate-700">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-sans">Pune Support Hub:</span>
                      <span className="font-bold">pune.hub@sulzer.com</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-100 pt-1.5">
                      <span className="text-slate-500 font-sans">Lead Systems Engineer:</span>
                      <span className="font-bold">systems.admin@sulzer.com</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-100 pt-1.5">
                      <span className="text-slate-500 font-sans">Global Supply Chain:</span>
                      <span className="font-bold">logistics.desk@sulzer.com</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-[#e1e6eb] bg-slate-50 text-[10px] text-slate-400 font-medium shrink-0 text-center">
                Sales Support Portal • Version 2026.4
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
