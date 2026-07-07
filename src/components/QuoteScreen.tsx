import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  Mail,
  MessageSquare,
  Send,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  DollarSign,
  Clock,
  Truck,
  Sparkles,
  Edit3,
  Check,
  Trash2,
  Printer,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { QuoteInquiry, PilotMessage } from '../types';
import { getQuoteRecommendations } from '../mockRecommendationData';

const getDynamicItemName = (quote: QuoteInquiry): string => {
  if (quote.id === 'REQ-2026-001') {
    return 'Hydraulic Replacement Kit & Impeller Parts';
  }
  if (quote.id === 'REQ-2026-002') {
    return 'Replacement Hydraulic Kit';
  }
  if (quote.id === 'REQ-2026-003') {
    return 'Industrial Gasket Seals (12-Unit Package)';
  }
  if (quote.id === 'REQ-2026-004') {
    return 'ABS XFP Replacement Hydraulic Parts & Impeller Seal';
  }
  if (quote.id === 'REQ-2026-005') {
    return 'Heavy-Duty Hydraulic Impeller & Shaft Assembly';
  }
  if (quote.id === 'REQ-2026-006') {
    return 'Design, Engineering & Supply of Non-API Centrifugal Slurry Pumps';
  }

  let name = quote.subject;
  name = name.replace(/^(RFQ|Spare parts|Urgent quotation|Subject)\s*:?\s*/gi, '');
  name = name.replace(/\s*\([^)]*\)\s*$/g, '');
  if (name.length > 0) {
    name = name.charAt(0).toUpperCase() + name.slice(1);
  }
  return name || 'Component spare replacement component';
};

const getCustomerAddress = (quote: QuoteInquiry) => {
  if (quote.id === 'REQ-2026-001') {
    return {
      company: 'PDAS PROACTIVE LIMITED',
      lines: [
        'FRIMLEY 4 BUSINESS PARK',
        'BUILDING 4.6, HITECH',
        'GU16 7SG CAMBERLEY',
        'United Kingdom',
      ],
      attention: 'JACKIE HARKINS',
      contactTel: '01483 930520',
    };
  }
  if (quote.id === 'REQ-2026-002') {
    return {
      company: 'MIDLAND WATER UTILITIES',
      lines: ['MIDLAND ROAD, SECTOR 3', 'BIRMINGHAM, WEST MIDLANDS', 'B1 2HP', 'United Kingdom'],
      attention: 'OLIVER YATES',
      contactTel: '0121 496 0321',
    };
  }
  if (quote.id === 'REQ-2026-003') {
    return {
      company: 'PETROBRAS PROCUREMENT SERVICES',
      lines: ['AV. REPUBLICA DO CHILE 65', 'CENTRO, RIO DE JANEIRO', '20031-912', 'Brazil'],
      attention: 'ROBERTO SILVA',
      contactTel: '+55 21 3876-4000',
    };
  }
  if (quote.id === 'REQ-2026-004') {
    return {
      company: 'CLEAN WATER GROUP OPERATIONS',
      lines: ['LEEDS DEPOT, OPERATIONS DIV', 'KIRKSTALL ROAD', 'LS4 2QD LEEDS', 'United Kingdom'],
      attention: 'LIAM HENDERSON',
      contactTel: '0113 243 1211',
    };
  }
  if (quote.id === 'REQ-2026-005') {
    return {
      company: 'DETROIT MUNICIPAL WATER DEPT',
      lines: ['WATER BOARD BUILDING', '735 RANDOLPH ST', 'DETROIT, MI 48226', 'United States'],
      attention: 'DAVID MILLER',
      contactTel: '+1 313 224 4700',
    };
  }
  if (quote.id === 'REQ-2026-006') {
    return {
      company: 'THYSSENKRUPP UHDE INDIA PVT LTD',
      lines: ['UHDE HOUSE, LBS MARG', 'VIKHROLI WEST, MUMBAI', '400083', 'India'],
      attention: 'MILIND SALUNKHE',
      contactTel: '+91 22 4047 8000',
    };
  }
  return {
    company: quote.customerName.toUpperCase(),
    lines: [
      'OPERATIONS CENTRE',
      'MAIN DEPT',
      quote.customerEmail.split('@')[1]?.toUpperCase() || 'INDUSTRIAL SITE',
      'United Kingdom',
    ],
    attention: quote.customerName,
    contactTel: '01483 930520',
  };
};

const getQuoteLineItems = (quote: QuoteInquiry, format: 'kit' | 'itemized' = 'kit') => {
  const discountPct = quote.discount || 35;
  const isSfdcMatch = quote.id === 'REQ-2026-003';

  if (quote.id === 'REQ-2026-001') {
    if (format === 'kit') {
      const partNo = quote.partNumberCorrected || 'FP80C-CB1.3';
      return [
        {
          pos: '10',
          part: partNo,
          desc: `HYDRAULIC REFURBISHMENT KIT (IMPELLER REPLACEMENT KIT) FOR PUMP MODEL FP80C-CB1.3`,
          qty: 1,
          listPrice: quote.price / (1 - discountPct / 100),
          unitPrice: quote.price,
        },
      ];
    } else {
      const mainPart = quote.partNumberCorrected || '35075594';
      const mainDesc = `IMPELLER COMPONENT FOR ${quote.partNumberCorrected || 'FP80C-CB1.3'}`;
      return [
        {
          pos: '10',
          part: '11210246',
          desc: 'CAP SCREW, SOCKET HD M10X45 DIN912 SS',
          qty: 1,
          listPrice: 10.0 / (1 - discountPct / 100),
          unitPrice: 10.0,
        },
        {
          pos: '20',
          part: '11490027',
          desc: 'LOCK WASHER M10 NORDLOCK DIN25201 SS',
          qty: 1,
          listPrice: 17.0 / (1 - discountPct / 100),
          unitPrice: 17.0,
        },
        {
          pos: '30',
          part: mainPart,
          desc: mainDesc.toUpperCase(),
          qty: 1,
          listPrice: (quote.price - 59) / (1 - discountPct / 100),
          unitPrice: quote.price - 59,
        },
        {
          pos: '40',
          part: '11120520',
          desc: 'O-RING 215.49 X 3.53 NBR',
          qty: 1,
          listPrice: 18.0 / (1 - discountPct / 100),
          unitPrice: 18.0,
        },
        {
          pos: '50',
          part: '11630003',
          desc: 'KEY A 6 X 6 X 25 DIN6885 SS',
          qty: 1,
          listPrice: 14.0 / (1 - discountPct / 100),
          unitPrice: 14.0,
        },
      ];
    }
  }

  if (isSfdcMatch) {
    if (format === 'kit') {
      const partNo = quote.partNumberCorrected || '11120520';
      return [
        {
          pos: '10',
          part: partNo,
          desc: `INDUSTRIAL GASKET SEALS (12-UNIT PACKAGE)`,
          qty: 12,
          listPrice: quote.price / 12 / (1 - discountPct / 100),
          unitPrice: quote.price / 12,
        },
      ];
    } else {
      return [
        {
          pos: '10',
          part: quote.partNumberCorrected || '11120520',
          desc: 'O-RING 215.49 X 3.53 NBR (GASKET SEALS)',
          qty: 12,
          listPrice: quote.price / 12 / (1 - discountPct / 100),
          unitPrice: quote.price / 12,
        },
      ];
    }
  }

  const totalRawPrice = quote.price;
  const item1Price = Math.round(totalRawPrice * 0.9 * 100) / 100;
  const item2Price = Math.round(totalRawPrice * 0.04 * 100) / 100;
  const item3Price = Math.round(totalRawPrice * 0.03 * 100) / 100;
  const item4Price = Math.round((totalRawPrice - item1Price - item2Price - item3Price) * 100) / 100;

  if (format === 'kit') {
    return [
      {
        pos: '10',
        part: quote.partNumberCorrected || '35075594',
        desc: getDynamicItemName(quote).toUpperCase(),
        qty: 1,
        listPrice: totalRawPrice / (1 - discountPct / 100),
        unitPrice: totalRawPrice,
      },
    ];
  } else {
    return [
      {
        pos: '10',
        part: quote.partNumberCorrected || '35075594',
        desc: getDynamicItemName(quote).toUpperCase(),
        qty: 1,
        listPrice: item1Price / (1 - discountPct / 100),
        unitPrice: item1Price,
      },
      {
        pos: '20',
        part: '11120520',
        desc: 'O-RING SEAL COMPATIBLE NBR',
        qty: 1,
        listPrice: item2Price / (1 - discountPct / 100),
        unitPrice: item2Price,
      },
      {
        pos: '30',
        part: '11210246',
        desc: 'CAP SCREW HEAVY HEX SS',
        qty: 1,
        listPrice: item3Price / (1 - discountPct / 100),
        unitPrice: item3Price,
      },
      {
        pos: '40',
        part: '11490027',
        desc: 'LOCK WASHER NORDLOCK SS',
        qty: 1,
        listPrice: item4Price / (1 - discountPct / 100),
        unitPrice: item4Price,
      },
    ];
  }
};

const getFormattedQuoteDate = (quote: QuoteInquiry) => {
  try {
    if (quote.receivedAt) {
      const d = new Date(quote.receivedAt);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    }
  } catch (e) {}
  return '19-06-2026';
};

const getExpirationDate = (quote: QuoteInquiry) => {
  try {
    if (quote.receivedAt) {
      const d = new Date(quote.receivedAt);
      d.setDate(d.getDate() + 30);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}.${month}.${year}`;
    }
  } catch (e) {}
  return '19.07.2026';
};

const formatSulzerPrice = (num: number) => {
  return num.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

interface QuoteScreenProps {
  quotes: QuoteInquiry[];
  selectedId: string;
  onSelect: (id: string) => void;
  onUpdateQuoteDetails: (id: string, updates: Partial<QuoteInquiry>) => void;
  onApproveAndSend: (id: string) => void;
  triggerNotification?: (text: string, type?: 'success' | 'info' | 'warning') => void;
}

export default function QuoteScreen({
  quotes,
  selectedId,
  onSelect,
  onUpdateQuoteDetails,
  onApproveAndSend,
  triggerNotification,
}: QuoteScreenProps) {
  const hubQuotes = useMemo(() => quotes.filter(
    q => q.status === 'accepted_hub' || q.status === 'accepted_ai_agent' || q.status === 'completed'
  ), [quotes]);
  const selectedQuote = quotes.find(q => q.id === selectedId) || hubQuotes[0];

  const [triggeredIds, setTriggeredIds] = useState<Record<string, boolean>>({});
  const [isTriggering, setIsTriggering] = useState(false);
  const isQuoteTriggered = triggeredIds[selectedQuote?.id] || selectedQuote?.status === 'completed';

  const [docTab, setDocTab] = useState<'pdf' | 'email'>('pdf');
  const [pdfPage, setPdfPage] = useState<number | 'all'>('all');
  const [activeFlowMap, setActiveFlowMap] = useState<Record<string, 'manual' | 'ai'>>({});
  const [quoteFormatMap, setQuoteFormatMap] = useState<Record<string, 'kit' | 'itemized'>>({});

  const [chatInput, setChatInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedQuote?.pilotMessages?.length, isAiTyping]);

  // Derived variables lifted out of the JSX render tree for strict parsing
  const addr = selectedQuote ? getCustomerAddress(selectedQuote) : null;
  const format = selectedQuote ? quoteFormatMap[selectedQuote.id] || 'kit' : 'kit';
  const items = selectedQuote ? getQuoteLineItems(selectedQuote, format) : [];
  const discountPct = selectedQuote?.discount || 35;
  const currentFlow = selectedQuote
    ? activeFlowMap[selectedQuote.id] ||
      (selectedQuote.status === 'accepted_ai_agent' ? 'ai' : 'manual')
    : 'manual';
  const isAiFlow = currentFlow === 'ai';

  if (!selectedQuote) {
    return (
      <div
        className="flex flex-col items-center justify-center h-[550px] bg-slate-50 border border-slate-200 rounded-xl p-8"
        id="no-hub-items"
      >
        <FileText className="w-16 h-16 text-slate-300 mb-4" />
        <p className="text-slate-500 font-medium text-lg">No quotes in final preparation queue.</p>
        <p className="text-slate-400 text-sm mt-1">
          Accept inquiries in Stage 2 (Complexity Routing) to populate the Quote Desk.
        </p>
      </div>
    );
  }

  const discountAmount = (selectedQuote.price * (selectedQuote.discount || 0)) / 100;
  const netPrice = selectedQuote.price - discountAmount;
  const grandTotal = netPrice + (selectedQuote.shippingCost || 0);
  const { technicalRecommendation, pricingRecommendation } = getQuoteRecommendations(
    selectedQuote as any
  );

  const handleSendChat = (textToSend?: string) => {
    const text = textToSend || chatInput;
    if (!text.trim()) return;

    const userMsg: PilotMessage = {
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...(selectedQuote.pilotMessages || []), userMsg];
    onUpdateQuoteDetails(selectedQuote.id, { pilotMessages: updatedMessages });

    if (!textToSend) {
      setChatInput('');
    }

    setIsAiTyping(true);
    setTimeout(() => {
      setIsAiTyping(false);

      let aiResponseText =
        'Understood. I have logged that specification in the draft file. Let me know if you need to apply any corporate discounts or modify lead times.';

      const lowerText = text.toLowerCase();
      if (lowerText.includes('discount') || lowerText.includes('%')) {
        let percentage = 5;
        if (lowerText.includes('10')) percentage = 10;
        if (lowerText.includes('15')) percentage = 15;

        onUpdateQuoteDetails(selectedQuote.id, {
          discount: percentage,
          notes: `${
            selectedQuote.notes ? selectedQuote.notes + ' ' : ''
          }Applied ${percentage}% account-specific contract discount.`,
        });
        aiResponseText = `Understood. I have applied a ${percentage}% discount ($${(
          (selectedQuote.price * percentage) /
          100
        ).toFixed(
          2
        )} savings) to the line items. The grand total has been recalculated on the PDF.\n\n[SAP CPQ Sync] Applied ${percentage}% discount to Quote ID ${
          selectedQuote.quoteNumber
        } dynamically.`;
        triggerNotification?.(
          `🔄 SAP CPQ Updated: Applied ${percentage}% discount contract rule!`,
          'success'
        );
      } else if (
        lowerText.includes('express') ||
        lowerText.includes('courier') ||
        lowerText.includes('expedite')
      ) {
        onUpdateQuoteDetails(selectedQuote.id, {
          shippingCost: 450,
          leadTime: Math.max(2, selectedQuote.leadTime - 4),
        });
        aiResponseText =
          'Expedited courier selected. I have updated the shipping cost to $450.00 and compressed the delivery lead time on the PDF. Please check the preview!\n\n[SAP CPQ Sync] Updated shipping cost to $450 and delivery class to Express.';
        triggerNotification?.(
          '🔄 SAP CPQ Updated: Expedited shipping & delivery terms recalculated.',
          'success'
        );
      } else if (
        lowerText.includes('standard') ||
        lowerText.includes('freight') ||
        lowerText.includes('marine')
      ) {
        onUpdateQuoteDetails(selectedQuote.id, {
          shippingCost: 150,
          leadTime: selectedQuote.leadTime + 2,
        });
        aiResponseText =
          'Switched to standard freight shipping. Shipping fee reduced to $150.00. Recalculated total is updated.\n\n[SAP CPQ Sync] Modified shipping freight to $150.00 standard.';
        triggerNotification?.(
          '🔄 SAP CPQ Updated: Standard shipping freight terms applied.',
          'success'
        );
      } else if (
        lowerText.includes('lead') ||
        lowerText.includes('day') ||
        lowerText.includes('time')
      ) {
        onUpdateQuoteDetails(selectedQuote.id, {
          leadTime: 5,
        });
        aiResponseText =
          'Lead time adjusted to 5 working days. The delivery schedule terms on the PDF are updated.\n\n[SAP CPQ Sync] Set lead time threshold to 5 days.';
        triggerNotification?.('🔄 SAP CPQ Updated: Lead time safety margins synced.', 'success');
      } else {
        triggerNotification?.(
          '🔄 SAP CPQ Synced: Synchronized latest parameters to pricing buffer.',
          'info'
        );
      }

      const finalMessages = [
        ...updatedMessages,
        {
          sender: 'copilot' as const,
          text: aiResponseText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ];

      onUpdateQuoteDetails(selectedQuote.id, { pilotMessages: finalMessages });
    }, 1200);
  };

  const getContextualChips = () => {
    if (selectedQuote.id === 'REQ-2026-001') {
      return [
        { label: 'Apply 10% Contract Discount', action: 'Apply 10% premium partner discount' },
        { label: 'Switch to Express Courier ($450)', action: 'Switch to Express Courier' },
        {
          label: 'Verify stock with SAP CPQ',
          action: 'Confirm that part CV-8830 is in Munich warehouse in SAP CPQ',
        },
      ];
    }
    if (selectedQuote.id === 'REQ-2026-005') {
      return [
        { label: 'Apply 5% Global Discount', action: 'Apply their 5% global contract discount' },
        {
          label: 'Switch to Express Courier ($450)',
          action: 'Switch to Priority Express Courier ($450)',
        },
        {
          label: 'Keep Standard Freight ($250)',
          action: 'Keep standard freight shipping at $250.00',
        },
      ];
    }
    return [
      { label: 'Apply 5% Bulk Discount', action: 'Apply a 5% bulk discount to the line items' },
      { label: 'Switch to Priority Delivery', action: 'Switch to express courier service' },
      { label: 'Set Lead Time to 5 Days', action: 'Adjust delivery lead time to 5 working days' },
    ];
  };

  return (
    <div className="flex flex-col gap-3" id="quote-screen-layout">
      {/* Top row: sidebar + document preview + copilot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
        {/* SIDEBAR LIST (Col-span-3) */}
        <div
          className="lg:col-span-3 flex flex-col bg-white border border-[#e1e6eb] rounded-lg shadow-2xs overflow-hidden"
          id="quote-sidebar"
        >
          <div className="p-3 border-b border-[#e1e6eb] bg-slate-50">
            <h3 className="font-sans font-black text-slate-900 text-xs uppercase tracking-widest">
              Hub Process Queue
            </h3>
            <p className="text-[10px] text-slate-500 font-medium">Ready for final dispatch</p>
          </div>
          <div
            className="overflow-y-auto divide-y divide-slate-100"
            id="quote-sidebar-list"
          >
            {hubQuotes.map(quote => {
              const isSelected = quote.id === selectedQuote.id;
              const isCompleted = quote.status === 'completed';

              return (
                <button
                  key={quote.id}
                  id={`quote-sidebar-item-${quote.id}`}
                  onClick={() => onSelect(quote.id)}
                  className={`w-full text-left p-3 transition-all hover:bg-slate-50 flex flex-col gap-1.5 ${
                    isSelected
                      ? 'bg-slate-50 border-l-4 border-[#004b93]'
                      : 'border-l-4 border-transparent'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] text-slate-400 font-bold font-mono">
                      {quote.id}
                    </span>
                    <div className="flex items-center gap-1">
                      {quote.status === 'accepted_ai_agent' && (
                        <span className="bg-emerald-55/10 text-emerald-800 text-[8px] font-bold px-1.5 py-0.5 rounded border border-emerald-100 flex items-center gap-0.5">
                          🤖 AUTO
                        </span>
                      )}
                      {quote.status === 'accepted_hub' && (
                        <span className="bg-amber-50 text-amber-850 text-[8px] font-bold px-1.5 py-0.5 rounded border border-amber-200 flex items-center gap-0.5">
                          👤 MANUAL
                        </span>
                      )}
                      {isCompleted ? (
                        <span className="bg-emerald-50 text-emerald-700 text-[8px] font-bold px-2 py-0.5 rounded border border-emerald-100">
                          SENT
                        </span>
                      ) : (
                        <span className="bg-[#004b93]/5 text-[#004b93] text-[8px] font-bold px-2 py-0.5 rounded border border-[#004b93]/10">
                          DRAFT
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="font-bold text-slate-800 text-xs truncate">
                    {quote.customerName}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate font-mono">
                    {quote.partNumberCorrected} | {quote.serialNumberCorrected}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* DOCUMENT PREVIEW (Col-span-6) */}
        <div
          className="lg:col-span-6 flex flex-col bg-white border border-[#e1e6eb] rounded-lg shadow-2xs overflow-hidden"
          id="document-preview-container"
        >
          {/* Global Header within Doc Workspace */}
          <div className="border-b border-[#e1e6eb] bg-slate-50 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">
                  Document Workspace
                </div>
                <p className="text-[10px] text-slate-500 font-medium mt-1">
                  Review generation output before dispatch.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="text-[10px] font-bold text-[#004b93] bg-[#004b93]/10 px-3 py-1.5 rounded-full border border-[#004b93]/20 shadow-3xs">
                  SAP CPQ Sync Active
                </div>
                {selectedQuote.status === 'accepted_ai_agent' && (
                  <div className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 shadow-3xs flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" />
                    AI Automated
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tab Selection */}
          <div className="flex border-b border-[#e1e6eb] bg-white px-4 pt-2 gap-6 shrink-0 shadow-3xs">
            <button
              onClick={() => setDocTab('pdf')}
              className={`pb-3 pt-2 text-[11px] font-bold flex items-center gap-2 transition-all border-b-2 cursor-pointer ${
                docTab === 'pdf'
                  ? 'border-[#004b93] text-[#004b93]'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
              id="tab-doc-pdf"
            >
              <FileText className="w-4 h-4" />
              PDF Quote
            </button>

            <button
              onClick={() => setDocTab('email')}
              className={`pb-3 pt-2 text-[11px] font-bold flex items-center gap-2 transition-all border-b-2 cursor-pointer ${
                docTab === 'email'
                  ? 'border-[#004b93] text-[#004b93]'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
              id="tab-doc-email"
            >
              <Mail className="w-4 h-4" />
              Outbound Email
            </button>
          </div>

          {/* Dynamic Frame Display */}
          <div
            className="overflow-y-auto p-6 bg-slate-50/50 flex-1 flex flex-col"
            id="document-frame"
          >
            {!isQuoteTriggered ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border border-[#e1e6eb] shadow-sm rounded-xl p-8 max-w-sm w-full mx-auto my-auto text-center flex flex-col items-center gap-5"
                id="sap-cpq-trigger-container"
              >
                {/* Flow Switcher */}
                <div className="flex border border-slate-200 rounded-lg p-1 bg-slate-55 w-full mb-1">
                  <button
                    onClick={() =>
                      setActiveFlowMap(prev => ({ ...prev, [selectedQuote.id]: 'manual' }))
                    }
                    className={`flex-1 py-1.5 px-2.5 rounded-md text-[10px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      !isAiFlow
                        ? 'bg-white text-[#004b93] shadow-xs border border-slate-200/50'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <span>⚙️ Manual CPQ</span>
                  </button>
                  <button
                    onClick={() =>
                      setActiveFlowMap(prev => ({ ...prev, [selectedQuote.id]: 'ai' }))
                    }
                    className={`flex-1 py-1.5 px-2.5 rounded-md text-[10px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      isAiFlow
                        ? 'bg-white text-emerald-700 shadow-xs border border-slate-200/50'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <span>🤖 AI Agent Desk</span>
                  </button>
                </div>

                <div
                  className={`w-14 h-14 rounded-full ${
                    isAiFlow
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                      : 'bg-amber-50 text-amber-600 border-amber-100'
                  } flex items-center justify-center text-xl font-bold border`}
                >
                  {isAiFlow ? '🤖' : '⚙️'}
                </div>

                <div>
                  <h3 className="font-sans font-black text-slate-900 text-[13px] tracking-wider uppercase">
                    {isAiFlow ? 'SAP CPQ Autonomous AI Engine' : 'SAP CPQ Manual Processing Desk'}
                  </h3>
                  <p className="text-[11px] text-slate-600 font-medium leading-relaxed mt-2 px-2">
                    {isAiFlow ? (
                      <>
                        Spare parts line-item data and customized requirements for{' '}
                        <span className="font-bold text-slate-850 font-mono">
                          {selectedQuote.id}
                        </span>{' '}
                        are pre-assembled for autonomous execution. Click below to trigger the{' '}
                        <strong>Auto-Quote</strong> generation.
                      </>
                    ) : (
                      <>
                        Spare parts line-item data for{' '}
                        <span className="font-bold text-slate-850 font-mono">
                          {selectedQuote.id}
                        </span>{' '}
                        requires manual pricing verification. Click below to trigger a{' '}
                        <strong>Manual CPQ Quote</strong>.
                      </>
                    )}
                  </p>
                  {!isAiFlow && (
                    <div className="mt-4 bg-[#00a1e0]/5 border border-[#00a1e0]/10 rounded-md p-3 text-left shadow-3xs">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <img
                          src="https://www.vectorlogo.zone/logos/salesforce/salesforce-icon.svg"
                          className="w-4 h-4"
                          alt="Salesforce"
                        />
                        <span className="text-[9.5px] font-bold text-[#0176d3] uppercase tracking-wider">
                          SFDC Opportunity Source
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-600 font-medium leading-normal">
                        This manual quote originated from Salesforce CRM. Click below to inspect,
                        verify, or update the deal opportunity details directly.
                      </p>
                      <a
                        href={`https://login.salesforce.com/?startURL=%2Flightning%2Fr%2FOpportunity%2F0068W0000${selectedQuote.id.replace(
                          'REQ-',
                          '00'
                        )}AQA%2Fview`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2.5 w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#0176d3] hover:bg-[#015ba5] text-white font-bold text-[10.5px] rounded border border-[#0176d3]/20 transition-all cursor-pointer shadow-2xs"
                      >
                        <span>Redirect to Salesforce CRM Opportunity</span>
                        <ExternalLink className="w-3 h-3 text-white" />
                      </a>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    setIsTriggering(true);
                    triggerNotification?.(
                      isAiFlow
                        ? '🔄 Dispatching payload to SAP CPQ AI Autonomous Gateway...'
                        : '🔄 Submitting manual line-item specs to SAP CPQ gateway...',
                      'info'
                    );
                    setTimeout(() => {
                      setIsTriggering(false);
                      setTriggeredIds(prev => ({ ...prev, [selectedQuote.id]: true }));
                      onUpdateQuoteDetails(selectedQuote.id, {
                        status: isAiFlow ? 'accepted_ai_agent' : 'accepted_hub',
                      });
                      triggerNotification?.(
                        isAiFlow
                          ? '🎉 SAP CPQ Auto-Quotation compiled autonomously!'
                          : '🎉 SAP CPQ Manual Quotation compiled and verified successfully!',
                        'success'
                      );
                    }, 1200);
                  }}
                  disabled={isTriggering}
                  className={`w-full h-10 ${
                    isAiFlow
                      ? 'bg-emerald-600 hover:bg-emerald-700 border-emerald-500/20'
                      : 'bg-[#004b93] hover:bg-[#003d78] border-[#004b93]/20'
                  } text-white disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed rounded-md font-semibold text-sm transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer border`}
                  id="btn-trigger-sap-cpq"
                >
                  {isTriggering ? (
                    <>
                      <RefreshCw className="w-4 h-4 text-white animate-spin" />
                      {isAiFlow ? 'Compiling Auto-Quote...' : 'Calculating Manual Quote...'}
                    </>
                  ) : (
                    <>
                      {isAiFlow ? (
                        <Sparkles className="w-4 h-4 text-white" />
                      ) : (
                        <FileText className="w-4 h-4 text-white" />
                      )}
                      {isAiFlow
                        ? 'Trigger Auto-Quote on SAP CPQ'
                        : 'Trigger Manual Quote on SAP CPQ'}
                    </>
                  )}
                </button>

                <div className="mt-2 rounded-2xl border border-slate-200 bg-slate-50/70 p-5 text-left w-full flex flex-col items-center justify-center">
                  <div className="opacity-40 flex flex-col items-center gap-3 w-full">
                    <div className="w-8 h-8 rounded-full bg-slate-300 mb-1"></div>
                    <div className="h-2 rounded-full bg-slate-300 w-3/4"></div>
                    <div className="h-2 rounded-full bg-slate-300 w-1/2"></div>
                    <div className="h-12 border border-slate-300 rounded-md w-full mt-2 border-dashed"></div>
                  </div>
                </div>

                <div className="text-[9px] text-slate-400 font-semibold uppercase tracking-widest flex items-center gap-2 mt-1">
                  <span
                    className={`w-2 h-2 rounded-full shadow-inner ${
                      isAiFlow ? 'bg-emerald-500' : 'bg-[#004b93]'
                    }`}
                  ></span>
                  {isAiFlow ? 'Autonomous AI API Linked' : 'Manual CPQ Port Active'}
                </div>
              </motion.div>
            ) : (
              <AnimatePresence mode="wait">
                {docTab === 'pdf' ? (
                  <div
                    className="flex flex-col overflow-hidden bg-slate-200 border border-slate-300 rounded-lg shadow-inner h-full min-h-[600px]"
                    id="pdf-view-wrapper"
                  >
                    {/* Page selector bar */}
                    <div className="flex items-center justify-between border-b border-[#e1e6eb] bg-white p-2 shrink-0 select-none shadow-sm">
                      <div className="flex items-center gap-1.5 overflow-x-auto flex-1 min-w-0 px-2">
                        <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase pr-2 shrink-0">
                          View Mode:
                        </span>
                        <button
                          onClick={() => setPdfPage('all')}
                          className={`px-3 py-1.5 text-[10px] font-bold rounded-md transition-all shrink-0 cursor-pointer ${
                            pdfPage === 'all'
                              ? 'bg-slate-800 text-white shadow-2xs'
                              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          Continuous
                        </button>
                        <button
                          onClick={() => setPdfPage(1)}
                          className={`px-3 py-1.5 text-[10px] font-bold rounded-md transition-all shrink-0 cursor-pointer ${
                            pdfPage === 1
                              ? 'bg-[#004b93] text-white shadow-2xs'
                              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          Page 1
                        </button>
                        <button
                          onClick={() => setPdfPage(2)}
                          className={`px-3 py-1.5 text-[10px] font-bold rounded-md transition-all shrink-0 cursor-pointer ${
                            pdfPage === 2
                              ? 'bg-[#004b93] text-white shadow-2xs'
                              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          Page 2
                        </button>
                        <button
                          onClick={() => setPdfPage(3)}
                          className={`px-3 py-1.5 text-[10px] font-bold rounded-md transition-all shrink-0 cursor-pointer ${
                            pdfPage === 3
                              ? 'bg-[#004b93] text-white shadow-2xs'
                              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          Page 3
                        </button>
                      </div>
                      <button
                        onClick={() => window.print()}
                        className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 border border-slate-300 hover:bg-slate-50 px-3 py-1.5 rounded-md text-[10px] font-bold bg-white shadow-sm cursor-pointer transition-colors shrink-0"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print (A4)</span>
                      </button>
                    </div>

                    {/* Scrollable canvas of pages */}
                    <div
                      className="overflow-y-auto overflow-x-auto p-6 space-y-8 flex flex-col items-center flex-1 bg-slate-200/50"
                      id="pdf-scrollable-pages"
                      style={{ scrollBehavior: 'smooth' }}
                    >
                      {/* PAGE 1: COVER LETTER */}
                      {(pdfPage === 'all' || pdfPage === 1) && addr && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white border border-slate-300 shadow-xl p-8 sm:p-12 w-full max-w-[620px] min-w-[320px] min-h-[820px] relative flex flex-col justify-between select-text"
                          id="pdf-page-1"
                        >
                          {/* Watermark for draft status */}
                          {selectedQuote.status !== 'completed' && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.035] select-none">
                              <div className="border-4 border-[#004b93] text-[#004b93] font-black text-5xl tracking-widest rotate-12 p-6 uppercase">
                                Draft Specification
                              </div>
                            </div>
                          )}

                          <div>
                            {/* Header Logo */}
                            <div className="flex justify-between items-start mb-8">
                              <div className="text-[10px] text-slate-900 leading-tight font-bold uppercase tracking-tight space-y-0.5 pt-1 text-left">
                                <div className="text-slate-950 font-black tracking-tight text-[12px] mb-1.5">
                                  {addr.company}
                                </div>
                                {addr.lines.map((l, i) => (
                                  <div key={i}>{l}</div>
                                ))}
                              </div>
                              <div className="flex flex-col items-end">
                                <div
                                  className="text-[#004b93] font-sans font-black text-3xl tracking-tighter select-none"
                                  style={{ fontFamily: '"Arial Black", sans-serif' }}
                                >
                                  SULZER
                                </div>
                                <div className="text-right text-[8.5px] text-slate-700 leading-normal font-semibold space-y-0.5 mt-2">
                                  <div className="font-bold text-slate-900 text-[9px]">
                                    Sulzer Pumps Wastewater UK Ltd.
                                  </div>
                                  <div>5th Floor, Astral Towers, Betts Way</div>
                                  <div>Phone +44(0)1293 558140</div>
                                  <div>Fax +44(0)1293 527972</div>
                                  <div className="text-[#004b93] hover:underline font-bold text-[9px]">
                                    www.sulzer.com
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Contact Details right below address block */}
                            <div className="flex justify-end mb-10">
                              <div className="text-right text-[9px] leading-tight space-y-0.5 text-slate-700">
                                <div>
                                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[7.5px] mr-1.5">
                                    Contact:
                                  </span>{' '}
                                  <span className="font-semibold text-slate-900">
                                    Michael Gernon
                                  </span>
                                </div>
                                <div>
                                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[7.5px] mr-1.5">
                                    Phone:
                                  </span>{' '}
                                  <span className="font-semibold text-slate-900">
                                    +441293558181
                                  </span>
                                </div>
                                <div>
                                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[7.5px] mr-1.5">
                                    Email:
                                  </span>{' '}
                                  <span className="font-semibold text-slate-900">
                                    michael.gernon@sulzer.com
                                  </span>
                                </div>
                                <div>
                                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[7.5px] mr-1.5">
                                    Date:
                                  </span>{' '}
                                  <span className="font-semibold text-slate-900">
                                    {getFormattedQuoteDate(selectedQuote)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Attention Block */}
                            <div className="text-left mb-8">
                              <h3 className="text-xs font-black text-slate-950 uppercase tracking-tight">
                                For the attention of {addr.attention.toUpperCase()}
                              </h3>
                            </div>

                            {/* Project & Reference */}
                            <div className="my-6 text-[10px] leading-tight text-slate-900 font-bold text-left space-y-1.5 bg-slate-50 p-4 rounded border border-slate-100">
                              <div className="flex">
                                <span className="w-16 text-slate-500 uppercase tracking-wider text-[8px] pt-0.5">
                                  Project:
                                </span>
                                <span className="uppercase text-slate-900 font-black">
                                  {selectedQuote.id.replace('REQ-', 'Q')}
                                </span>
                              </div>
                              <div className="flex">
                                <span className="w-16"></span>
                                <span className="text-slate-800 font-bold">
                                  OP-2881727; Quote-{selectedQuote.quoteNumber}-MASTER
                                </span>
                              </div>
                            </div>

                            {/* Main letter body */}
                            <div className="text-[10px] text-slate-700 leading-relaxed space-y-5 text-left font-medium">
                              <p>
                                Further to your recent enquiry referenced above we are pleased to
                                submit our quotation for your consideration.
                              </p>
                              <p>
                                Please find attached the datasheets and general arrangement drawing
                                related to the selected Products.
                              </p>
                              <p>
                                We trust that we have interpreted your requirements correctly and
                                that you find our quotation tender of interest.
                              </p>
                              <p>
                                Our scope of supply and prices are shown in section 2 of this offer.
                                If an item is not mentioned in that section it is not included in
                                our scope.
                              </p>
                            </div>
                          </div>

                          {/* Sign off and footer */}
                          <div className="mt-14">
                            <div className="text-left text-[10px] leading-normal text-slate-800 space-y-0.5 border-t border-slate-200 pt-6">
                              <div className="font-bold text-slate-950 text-[11px]">
                                Vidya Bhalerao
                              </div>
                              <div className="text-slate-500 font-semibold mb-2">
                                Application Engineer
                              </div>
                              <div>
                                Phone:{' '}
                                <span className="font-bold text-slate-900">+49 228 608791 406</span>
                              </div>
                              <div>
                                Email:{' '}
                                <span className="font-bold text-slate-900">
                                  Vidya.Bhalerao@sulzer.com
                                </span>
                              </div>
                              <div className="font-bold text-slate-900 mt-2">
                                Sulzer Pumps Wastewater Uk Ltd.
                              </div>
                              <div className="text-slate-500">United Kingdom</div>
                            </div>

                            <div className="border-t border-slate-300 pt-3 mt-12 flex justify-between items-center text-[7.5px] text-slate-500 font-semibold uppercase tracking-wider">
                              <div className="text-left truncate max-w-[420px]">
                                Sulzer Pumps Wastewater UK Ltd. 5th Floor, Astral Towers, Betts Way,
                                Crawley West Sussex RH10 9UY VAT No. GB232 5200 15
                              </div>
                              <div className="font-black text-slate-900 text-[9px] shrink-0">
                                Page 1
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* PAGE 2: PRODUCTS TABLE */}
                      {(pdfPage === 'all' || pdfPage === 2) && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white border border-slate-300 shadow-xl p-8 sm:p-12 w-full max-w-[620px] min-w-[320px] min-h-[820px] relative flex flex-col justify-between select-text"
                          id="pdf-page-2"
                        >
                          <div>
                            {/* Page header */}
                            <div className="flex justify-between items-start mb-8">
                              <div className="text-left text-[9px] text-slate-500 font-bold leading-normal space-y-0.5">
                                <div className="text-slate-900 uppercase font-black text-[10px]">
                                  Products & Specifications
                                </div>
                                <div>
                                  Quote Ref:{' '}
                                  <span className="font-mono text-slate-700">
                                    {selectedQuote.quoteNumber} - MASTER
                                  </span>
                                </div>
                              </div>
                              <div
                                className="text-[#004b93] font-sans font-black text-3xl tracking-tighter select-none"
                                style={{ fontFamily: '"Arial Black", sans-serif' }}
                              >
                                SULZER
                              </div>
                            </div>

                            <div className="text-right text-[9px] text-slate-600 font-bold space-y-0.5 mb-8">
                              <div>
                                Quote:{' '}
                                <span className="text-slate-900">
                                  {selectedQuote.quoteNumber} - MASTER
                                </span>
                              </div>
                              <div>
                                Date:{' '}
                                <span className="text-slate-900">
                                  {getFormattedQuoteDate(selectedQuote)}
                                </span>
                              </div>
                            </div>

                            <h3 className="text-[13px] font-black text-slate-950 uppercase tracking-widest border-b-2 border-slate-900 pb-1.5 mb-6 text-left">
                              Products
                            </h3>

                            {/* Products Table */}
                            <table className="w-full text-left border-collapse text-[10px] leading-normal text-slate-800">
                              <thead>
                                <tr className="border-b border-slate-900 font-bold text-slate-700 text-[9px] uppercase tracking-wider">
                                  <th className="pb-2 w-12 text-left">Position</th>
                                  <th className="pb-2 text-left">Product/Description</th>
                                  <th className="pb-2 w-10 text-center">Qty.</th>
                                  <th className="pb-2 w-18 text-right">List Price</th>
                                  <th className="pb-2 w-14 text-right">Disc.</th>
                                  <th className="pb-2 w-18 text-right">Unit Price</th>
                                  <th className="pb-2 w-18 text-right">Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                {items.map((item, idx) => (
                                  <React.Fragment key={idx}>
                                    <tr className="font-bold text-slate-950">
                                      <td className="pt-4 pb-0.5 text-left font-mono">
                                        {item.pos}
                                      </td>
                                      <td className="pt-4 pb-0.5 text-left font-mono">
                                        {item.part} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; M
                                      </td>
                                      <td className="pt-4 pb-0.5 text-center">{item.qty}</td>
                                      <td className="pt-4 pb-0.5 text-right font-mono">
                                        {formatSulzerPrice(item.listPrice)}
                                      </td>
                                      <td className="pt-4 pb-0.5 text-right font-mono text-[#004b93]">
                                        {formatSulzerPrice(discountPct)}%
                                      </td>
                                      <td className="pt-4 pb-0.5 text-right font-mono">
                                        {formatSulzerPrice(item.unitPrice)}
                                      </td>
                                      <td className="pt-4 pb-0.5 text-right font-mono">
                                        {formatSulzerPrice(item.unitPrice * item.qty)}
                                      </td>
                                    </tr>
                                    <tr className="border-b border-slate-100">
                                      <td></td>
                                      <td colSpan={6} className="pb-4 pt-0.5 text-left">
                                        <div className="text-[9px] text-slate-500 font-semibold font-mono uppercase tracking-tight">
                                          {item.desc}
                                        </div>
                                      </td>
                                    </tr>
                                  </React.Fragment>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {/* Total Scope of Supply and page footer */}
                          <div>
                            <div className="border-t-2 border-slate-900 pt-6 flex flex-col items-end">
                              <div className="text-right space-y-1.5">
                                <div className="text-[12px] font-black text-slate-950 uppercase tracking-tight flex items-center justify-end gap-3">
                                  <span>Total Scope of Supply:</span>
                                  <span className="font-mono text-[14px] bg-slate-50 p-2 px-3 rounded font-black text-slate-950 border border-slate-200">
                                    GBP {formatSulzerPrice(selectedQuote.price)}
                                  </span>
                                </div>
                                <div className="text-[8.5px] text-slate-500 font-semibold italic text-right mt-1">
                                  All prices shown are strictly net of all discounts and are
                                  exclusive of VAT
                                </div>
                              </div>
                            </div>

                            <div className="border-t border-slate-300 pt-3 mt-12 flex justify-between items-center text-[7.5px] text-slate-500 font-semibold uppercase tracking-wider">
                              <div className="text-left truncate max-w-[420px]">
                                Sulzer Pumps Wastewater UK Ltd. 5th Floor, Astral Towers, Betts Way,
                                Crawley West Sussex RH10 9UY VAT No. GB232 5200 15
                              </div>
                              <div className="font-black text-slate-900 text-[9px] shrink-0">
                                Page 2
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* PAGE 3: TERMS OF SUPPLY */}
                      {(pdfPage === 'all' || pdfPage === 3) && addr && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white border border-slate-300 shadow-xl p-8 sm:p-12 w-full max-w-[620px] min-w-[320px] min-h-[820px] relative flex flex-col justify-between select-text"
                          id="pdf-page-3"
                        >
                          <div>
                            {/* Page header */}
                            <div className="flex justify-between items-start mb-8">
                              <div className="text-left text-[9px] text-slate-500 font-bold leading-normal space-y-0.5">
                                <div className="text-slate-900 uppercase font-black text-[10px]">
                                  Commercial & Contractual Terms
                                </div>
                                <div>
                                  Quote Ref:{' '}
                                  <span className="font-mono text-slate-700">
                                    {selectedQuote.quoteNumber} - MASTER
                                  </span>
                                </div>
                              </div>
                              <div
                                className="text-[#004b93] font-sans font-black text-3xl tracking-tighter select-none"
                                style={{ fontFamily: '"Arial Black", sans-serif' }}
                              >
                                SULZER
                              </div>
                            </div>

                            <div className="text-right text-[9px] text-slate-600 font-bold space-y-0.5 mb-8">
                              <div>
                                Quote:{' '}
                                <span className="text-slate-900">
                                  {selectedQuote.quoteNumber} - MASTER
                                </span>
                              </div>
                              <div>
                                Date:{' '}
                                <span className="text-slate-900">
                                  {getFormattedQuoteDate(selectedQuote)}
                                </span>
                              </div>
                            </div>

                            {/* Terms list */}
                            <div className="grid grid-cols-12 gap-y-5 text-[10px] text-slate-800 border-t border-b border-slate-200 py-8 text-left leading-relaxed">
                              <div className="col-span-4 font-black text-slate-600 uppercase tracking-wider text-[9px]">
                                Terms of Delivery:
                              </div>
                              <div className="col-span-8 font-semibold text-slate-900">
                                DAP - Delivered At Place {addr.company.split(' ')[0]}.
                              </div>

                              <div className="col-span-4 font-black text-slate-600 uppercase tracking-wider text-[9px]">
                                Quote Expiration Date:
                              </div>
                              <div className="col-span-8 font-bold text-slate-900 font-mono">
                                {getExpirationDate(selectedQuote)}
                              </div>

                              <div className="col-span-4 font-black text-slate-600 uppercase tracking-wider text-[9px]">
                                Payment Terms:
                              </div>
                              <div className="col-span-8 font-semibold text-slate-900">
                                30 days net
                              </div>

                              <div className="col-span-4 font-black text-slate-600 uppercase tracking-wider text-[9px]">
                                Warranty:
                              </div>
                              <div className="col-span-8 font-semibold text-slate-900">
                                Standard
                              </div>

                              <div className="col-span-4 font-black text-slate-600 uppercase tracking-wider text-[9px]">
                                Lead Time:
                              </div>
                              <div className="col-span-8 text-slate-700 font-medium">
                                Delivery approx.{' '}
                                <span className="font-black text-slate-900">
                                  {selectedQuote.leadTime} working days
                                </span>{' '}
                                - carriage paid except part no.{' '}
                                <span className="font-mono font-bold text-slate-900">
                                  {selectedQuote.partNumberCorrected || '35075594'}
                                </span>{' '}
                                &amp; Delivery for this part will be approx. 4 to 6 working weeks.
                              </div>
                            </div>

                            {/* Verification metadata block */}
                            <div className="my-8 space-y-2 font-mono text-[9px] text-slate-700 border-l-2 border-[#004b93] pl-4 py-1 text-left">
                              <div>
                                SITE CONTACT NAME:{' '}
                                <span className="font-bold text-slate-900">
                                  {addr.attention.toUpperCase()}
                                </span>
                              </div>
                              <div>
                                CONTACT TEL NO:{' '}
                                <span className="font-bold text-slate-900">{addr.contactTel}</span>
                              </div>
                              <div>
                                YOUR QUOTE REF NO:{' '}
                                <span className="font-bold text-slate-900">
                                  {selectedQuote.quoteNumber}
                                </span>
                              </div>
                              <div>
                                QUOTE PROCESSED BY:{' '}
                                <span className="font-bold text-slate-900">Vidya Bhalerao</span>
                              </div>
                              <div>
                                EMAIL:{' '}
                                <span className="font-bold text-slate-900">salesuk@sulzer.com</span>
                              </div>
                            </div>
                          </div>

                          {/* Terms and conditions disclaimer and footer */}
                          <div>
                            <div className="text-[9px] text-slate-500 font-semibold leading-relaxed border-t border-slate-200 pt-6 text-left">
                              This quotation and any order pursuant to it is subject to the terms
                              and conditions of "GENERAL TERMS AND CONDITIONS OF SUPPLY - SULZER
                              PUMPS WASTEWATER UK LTD" attached hereto. A copy can also be
                              downloaded at{' '}
                              <span className="text-[#004b93] hover:underline font-bold">
                                www.sulzer.com
                              </span>
                              .
                            </div>

                            <div className="border-t border-slate-300 pt-3 mt-12 flex justify-between items-center text-[7.5px] text-slate-500 font-semibold uppercase tracking-wider">
                              <div className="text-left truncate max-w-[420px]">
                                Sulzer Pumps Wastewater UK Ltd. 5th Floor, Astral Towers, Betts Way,
                                Crawley West Sussex RH10 9UY VAT No. GB232 5200 15
                              </div>
                              <div className="font-black text-slate-900 text-[9px] shrink-0">
                                Page 3
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="bg-white border border-[#e1e6eb] shadow-sm rounded-xl p-6 max-w-xl mx-auto flex flex-col gap-4 mt-6"
                    id="outbound-email-document"
                  >
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase tracking-wider">
                        To Customer Recipient:
                      </label>
                      <input
                        type="text"
                        value={selectedQuote.customerEmail}
                        disabled
                        className="w-full text-xs font-sans px-3 py-2 border border-slate-200 rounded-md bg-slate-50 text-slate-500"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase tracking-wider">
                        Email Subject Header:
                      </label>
                      <input
                        type="text"
                        value={`RE: Official Sales Quotation ${selectedQuote.quoteNumber}`}
                        disabled
                        className="w-full text-xs font-bold px-3 py-2 border border-slate-200 rounded-md bg-slate-50 text-slate-700"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase tracking-wider">
                        Email Message Body:
                      </label>
                      <textarea
                        value={selectedQuote.draftEmailText}
                        onChange={e =>
                          onUpdateQuoteDetails(selectedQuote.id, { draftEmailText: e.target.value })
                        }
                        className="w-full text-xs font-sans p-3 border border-slate-200 rounded-md h-56 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 leading-relaxed bg-white font-medium shadow-inner"
                      ></textarea>
                    </div>

                    <div className="bg-[#004b93]/5 p-3 rounded-md text-[10px] text-slate-700 font-medium italic border border-[#004b93]/10">
                      💡 Note: The PDF Quotation (
                      <span className="font-mono">{selectedQuote.quoteNumber}.pdf</span>) will
                      automatically be rendered and attached to this outbound mail.
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* AI CO-PILOT (Col-span-3) */}
        <div
          className="lg:col-span-3 flex flex-col bg-slate-50 border border-[#e1e6eb] rounded-lg shadow-2xs overflow-hidden"
          id="copilot-container"
        >
          {/* CoPilot Header */}
          <div className="p-3 border-b border-[#e1e6eb] bg-white flex items-center justify-between shadow-xs z-10">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-md bg-[#004b93] text-white">
                <MessageSquare className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-sans font-black text-slate-900 text-[11px] uppercase tracking-wider leading-tight">
                  Discount Desk
                </h3>
                <p className="text-[10px] text-slate-500 font-medium">Contract loyalty advisory</p>
              </div>
            </div>
            <span className="text-[9px] bg-slate-50 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-md font-bold shadow-3xs">
              Live
            </span>
          </div>

          {/* Real-time SAP CPQ sync banner */}
          <div className="bg-emerald-50 border-b border-emerald-100 p-2.5 px-4 flex justify-between items-center text-[10px] text-emerald-800 font-bold font-mono shrink-0 shadow-3xs">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              SAP CPQ Sync Active
            </span>
            <span className="text-[9px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-black tracking-widest">
              LIVE
            </span>
          </div>

          <div className="p-4 bg-slate-50/80 border-b border-[#e1e6eb] shrink-0" id="recommendation-engine">
            <div className="flex items-center gap-1.5 mb-4">
              <span className="p-1 rounded bg-[#004b93]/10 text-[#004b93]">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
              <h4 className="font-sans font-black text-slate-900 text-[11px] uppercase tracking-[0.15em]">
                Recommendation Engine
              </h4>
            </div>

            <div className="grid gap-3">
              <div className="rounded-lg border border-[#e1e6eb] bg-white p-3.5 shadow-3xs hover:border-slate-300 transition-colors">
                <div className="flex flex-col gap-2">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">
                    Technical insight
                  </span>
                  <span className="text-[9px] w-max font-bold text-emerald-800 bg-emerald-100/50 px-2.5 py-1 rounded-md border border-emerald-200">
                    {technicalRecommendation.confidence}
                  </span>
                </div>
                <p className="mt-4 text-[11px] font-bold text-slate-900 leading-relaxed">
                  {technicalRecommendation.title}
                </p>
                <p className="mt-1.5 text-[10px] leading-relaxed text-slate-600 font-medium">
                  {technicalRecommendation.summary}
                </p>
                <p className="mt-2 text-[9px] leading-relaxed text-slate-500">
                  {technicalRecommendation.detail}
                </p>
                <div className="mt-3 space-y-1 bg-slate-50 p-2 rounded border border-slate-100">
                  {technicalRecommendation.sources.map((source, idx) => (
                    <div key={idx} className="text-[9px] text-slate-600 font-medium">
                      <span className="font-bold text-slate-800 mr-1">❖ {source.label}:</span>{' '}
                      {source.value}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-[#e1e6eb] bg-white p-3.5 shadow-3xs hover:border-slate-300 transition-colors">
                <div className="flex flex-col gap-2">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">
                    Pricing insight
                  </span>
                  <span className="text-[9px] w-max font-bold text-[#004b93] bg-[#004b93]/10 px-2.5 py-1 rounded-md border border-[#004b93]/20">
                    {pricingRecommendation.confidence}
                  </span>
                </div>
                <p className="mt-4 text-[11px] font-bold text-slate-900 leading-relaxed">
                  {pricingRecommendation.title}
                </p>
                <p className="mt-1.5 text-[10px] leading-relaxed text-slate-600 font-medium">
                  {pricingRecommendation.summary}
                </p>
                <p className="mt-2 text-[9px] leading-relaxed text-slate-500">
                  {pricingRecommendation.detail}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="text-[9px] font-bold text-slate-700 bg-white border border-slate-300 px-2 py-1 rounded-md shadow-3xs">
                    Suggested discount: {pricingRecommendation.recommendedDiscount}%
                  </span>
                  <span className="text-[9px] font-bold text-slate-700 bg-white border border-slate-300 px-2 py-1 rounded-md shadow-3xs">
                    Suggested lead time: {pricingRecommendation.recommendedLeadTime}d
                  </span>
                </div>
                <div className="mt-3 space-y-1 bg-slate-50 p-2 rounded border border-slate-100">
                  {pricingRecommendation.sources.map((source, idx) => (
                    <div key={idx} className="text-[9px] text-slate-600 font-medium">
                      <span className="font-bold text-slate-800 mr-1">❖ {source.label}:</span>{' '}
                      {source.value}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div
            className="p-4 bg-white border-b border-[#e1e6eb] shrink-0"
            id="manual-pricing-override"
          >
            <div className="flex items-center gap-1.5 mb-4">
              <span className="p-1 rounded bg-[#004b93]/10 text-[#004b93]">
                <Edit3 className="w-3.5 h-3.5" />
              </span>
              <h4 className="font-sans font-black text-slate-900 text-[11px] uppercase tracking-[0.15em]">
                Manual Pricing Override
              </h4>
            </div>

            <div className="grid grid-cols-2 gap-x-3 gap-y-4">
              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider block mb-1">
                  Base Price
                </label>
                <div className="flex items-stretch border border-slate-200 rounded-md bg-white focus-within:ring-1 focus-within:ring-slate-400 focus-within:border-slate-400 overflow-hidden shadow-3xs transition-shadow">
                  <div className="flex items-center justify-center px-2.5 bg-slate-50 text-[10px] font-bold text-slate-400 border-r border-slate-200 select-none">
                    $
                  </div>
                  <input
                    type="number"
                    value={selectedQuote.price}
                    onChange={e =>
                      onUpdateQuoteDetails(selectedQuote.id, {
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    disabled={selectedQuote.status === 'completed'}
                    className="w-full text-xs font-mono px-2 py-1.5 min-h-[36px] focus:outline-none bg-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider block mb-1">
                  Discount
                </label>
                <div className="flex items-stretch border border-slate-200 rounded-md bg-white focus-within:ring-1 focus-within:ring-slate-400 focus-within:border-slate-400 overflow-hidden shadow-3xs transition-shadow">
                  <input
                    type="number"
                    value={selectedQuote.discount || 0}
                    onChange={e =>
                      onUpdateQuoteDetails(selectedQuote.id, {
                        discount: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)),
                      })
                    }
                    disabled={selectedQuote.status === 'completed'}
                    className="w-full text-xs font-mono px-2 py-1.5 min-h-[36px] focus:outline-none bg-transparent"
                  />
                  <div className="flex items-center justify-center px-2.5 bg-slate-50 text-[10px] font-bold text-slate-400 border-l border-slate-200 select-none">
                    %
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider block mb-1">
                  Shipping
                </label>
                <div className="flex items-stretch border border-slate-200 rounded-md bg-white focus-within:ring-1 focus-within:ring-slate-400 focus-within:border-slate-400 overflow-hidden shadow-3xs transition-shadow">
                  <div className="flex items-center justify-center px-2.5 bg-slate-50 text-[10px] font-bold text-slate-400 border-r border-slate-200 select-none">
                    $
                  </div>
                  <input
                    type="number"
                    value={selectedQuote.shippingCost || 0}
                    onChange={e =>
                      onUpdateQuoteDetails(selectedQuote.id, {
                        shippingCost: parseFloat(e.target.value) || 0,
                      })
                    }
                    disabled={selectedQuote.status === 'completed'}
                    className="w-full text-xs font-mono px-2 py-1.5 min-h-[36px] focus:outline-none bg-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider block mb-1">
                  Lead Time
                </label>
                <div className="flex items-stretch border border-slate-200 rounded-md bg-white focus-within:ring-1 focus-within:ring-slate-400 focus-within:border-slate-400 overflow-hidden shadow-3xs transition-shadow">
                  <input
                    type="number"
                    value={selectedQuote.leadTime || 0}
                    onChange={e =>
                      onUpdateQuoteDetails(selectedQuote.id, {
                        leadTime: parseInt(e.target.value) || 0,
                      })
                    }
                    disabled={selectedQuote.status === 'completed'}
                    className="w-full text-xs font-mono px-2 py-1.5 min-h-[36px] focus:outline-none bg-transparent"
                  />
                  <div className="flex items-center justify-center px-2 bg-slate-50 text-[9px] font-bold text-slate-400 border-l border-slate-200 select-none uppercase tracking-wider">
                    Days
                  </div>
                </div>
              </div>

              <div className="col-span-2 border-t border-slate-100 pt-3 mt-1">
                <div className="flex flex-col gap-2 mb-1">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">
                    Quote Line-Item Format
                  </span>
                  <div className="flex bg-slate-100 p-1 rounded-md border border-slate-200 shadow-inner w-full">
                    <button
                      type="button"
                      onClick={() =>
                        setQuoteFormatMap(prev => ({ ...prev, [selectedQuote.id]: 'kit' }))
                      }
                      className={`flex-1 py-1.5 text-[10px] font-bold rounded cursor-pointer transition-all ${
                        (quoteFormatMap[selectedQuote.id] || 'kit') === 'kit'
                          ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      Consolidated Kit
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setQuoteFormatMap(prev => ({ ...prev, [selectedQuote.id]: 'itemized' }))
                      }
                      className={`flex-1 py-1.5 text-[10px] font-bold rounded cursor-pointer transition-all ${
                        (quoteFormatMap[selectedQuote.id] || 'kit') === 'itemized'
                          ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      Itemized Parts
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-span-2 border-t border-slate-100 pt-3 mt-1">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">
                    Dynamic Preview
                  </span>
                  <span className="text-[8px] font-mono font-bold text-[#004b93] bg-[#004b93]/10 px-1.5 py-0.5 rounded border border-[#004b93]/20">
                    Auto-Calculated
                  </span>
                </div>
                <div className="max-h-28 overflow-y-auto border border-slate-200 rounded-md bg-slate-50 p-2 space-y-1.5 shadow-inner">
                  {getQuoteLineItems(selectedQuote, quoteFormatMap[selectedQuote.id] || 'kit').map(
                    item => (
                      <div
                        key={item.pos}
                        className="flex justify-between text-[10px] border-b border-slate-200/50 last:border-none pb-1.5 last:pb-0 pt-1 first:pt-0"
                      >
                        <div className="font-mono text-slate-500 shrink-0 w-5 font-bold">
                          #{item.pos}
                        </div>
                        <div className="flex-1 min-w-0 pr-2 text-left">
                          <div className="font-bold text-slate-800 truncate" title={item.desc}>
                            {item.desc}
                          </div>
                          <div className="text-[8px] font-mono text-slate-400 mt-0.5">
                            PN: {item.part}
                          </div>
                        </div>
                        <div className="text-right shrink-0 font-mono font-bold text-slate-700 bg-white px-1.5 py-0.5 rounded border border-slate-200 h-max">
                          {item.qty} × ${formatSulzerPrice(item.unitPrice)}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Message Thread */}
          <div
            className="overflow-y-auto p-4 flex flex-col gap-3 bg-slate-100/50 flex-1 min-h-[160px]"
            id="copilot-messages"
          >
            {selectedQuote.pilotMessages?.map((msg, index) => {
              const isCopilot = msg.sender === 'copilot';

              return (
                <div
                  key={index}
                  className={`flex flex-col max-w-[90%] ${
                    isCopilot ? 'mr-auto items-start' : 'ml-auto items-end'
                  }`}
                >
                  <div
                    className={`px-3 py-2.5 rounded-lg text-xs leading-[1.6] font-medium shadow-3xs ${
                      isCopilot
                        ? 'bg-white border border-[#e1e6eb] text-slate-700 rounded-tl-none'
                        : 'bg-[#004b93] text-white rounded-tr-none'
                    }`}
                  >
                    {isCopilot && (
                      <div className="flex items-center gap-1.5 mb-1.5 border-b border-slate-100 pb-1">
                        <Sparkles className="w-3 h-3 text-[#004b93]" />
                        <span className="font-black text-[#004b93] text-[9px] uppercase tracking-widest">
                          DISCOUNT ADVISOR
                        </span>
                      </div>
                    )}
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-slate-400 mt-1 font-mono font-semibold">
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}

            {isAiTyping && (
              <div className="mr-auto items-start max-w-[90%] flex flex-col">
                <div className="px-3 py-2.5 rounded-lg bg-white border border-[#e1e6eb] text-slate-500 rounded-tl-none text-xs flex items-center gap-2 font-medium shadow-3xs">
                  <RefreshCw className="w-3.5 h-3.5 text-[#004b93] animate-spin" />
                  <span>Recalculating contract rules...</span>
                </div>
              </div>
            )}

            <div ref={chatEndRef}></div>
          </div>

          {/* Action chips (Quick Responses) */}
          <div className="px-4 pt-4 bg-white border-t border-[#e1e6eb] flex flex-col gap-3 shrink-0">
            <span className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] block">
              Quick Actions
            </span>
            <div className="flex flex-col gap-2 overflow-y-auto max-h-32" id="copilot-action-chips">
              {getContextualChips().map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendChat(chip.action)}
                  disabled={selectedQuote.status === 'completed'}
                  className="group w-full flex items-center gap-2.5 text-left bg-white hover:bg-slate-50 border border-slate-200 hover:border-[#004b93] rounded-md px-3.5 py-2.5 transition-all shadow-3xs disabled:opacity-50 disabled:cursor-not-allowed"
                  id={`chip-action-${idx}`}
                >
                  <span className="text-slate-300 group-hover:text-[#004b93] transition-colors">
                    ⚡
                  </span>
                  <span className="text-[11px] font-bold text-slate-700 group-hover:text-slate-900 truncate">
                    {chip.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Input */}
          <div className="px-4 pb-4 pt-4 bg-white flex items-center gap-2 shrink-0">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder={
                  selectedQuote.status === 'completed'
                    ? 'Quote finalized and sent'
                    : 'Ask advisor (Apply 10% discount)...'
                }
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendChat()}
                disabled={selectedQuote.status === 'completed'}
                className="w-full text-xs px-3.5 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 bg-slate-50 hover:bg-white transition-colors disabled:bg-slate-100 disabled:text-slate-400 font-medium shadow-inner"
                id="copilot-text-input"
              />
              <button
                onClick={() => handleSendChat()}
                disabled={!chatInput.trim() || selectedQuote.status === 'completed'}
                className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-slate-800 hover:bg-slate-900 text-white rounded-md disabled:bg-slate-200 disabled:text-slate-400 transition-colors flex items-center justify-center shadow-sm cursor-pointer"
                id="btn-copilot-send"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* end top row grid */}

      {/* STICKY FOOTER: Global confirmation action bar */}
      <div
        className="bg-slate-900 text-white rounded-xl p-4 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-800"
        id="quote-sticky-footer"
      >
        <div className="flex items-center gap-3">
          <span className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-emerald-400 shadow-inner">
            <ShieldCheck className="w-5 h-5" />
          </span>
          <div>
            <h4 className="font-sans font-black text-xs uppercase tracking-widest text-slate-100">
              Gatekeeper Dispatch Portal
            </h4>
            <p className="text-[11px] text-slate-400 max-w-xl mt-1 font-medium leading-relaxed">
              Confirming this quote will finalize document{' '}
              <span className="font-mono text-emerald-400 font-bold">
                {selectedQuote.quoteNumber}
              </span>
              , log transaction parameters into SAP CPQ, and transmit the official PDF to customer:{' '}
              <span className="font-bold text-slate-200">{selectedQuote.customerEmail}</span>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
          <div className="text-right">
            <span className="text-[9px] text-slate-400 uppercase tracking-widest block font-black mb-0.5">
              RECALCULATED TOTAL
            </span>
            <span className="text-xl font-mono font-black text-white">
              ${grandTotal.toFixed(2)}
            </span>
          </div>

          <button
            onClick={() => onApproveAndSend(selectedQuote.id)}
            disabled={selectedQuote.status === 'completed' || !isQuoteTriggered}
            className="flex-1 sm:flex-none px-5 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white rounded-lg text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer border border-emerald-500/30"
            id="btn-approve-and-send"
          >
            {selectedQuote.status === 'completed' ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                Quote Sent to Customer
              </>
            ) : !isQuoteTriggered ? (
              <>
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                Awaiting SAP CPQ Trigger
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Approve & Send
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
