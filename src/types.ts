export interface PilotMessage {
  sender: 'copilot' | 'user';
  text: string;
  timestamp: string;
}

export interface QuoteInquiry {
  id: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  emailBody: string;
  receivedAt: string;
  partNumberExtracted: string;
  partNumberCorrected: string;
  serialNumberExtracted: string;
  serialNumberCorrected: string;
  status: 'unqualified' | 'clarification_draft' | 'awaiting_clarification' | 'qualified' | 'engineering_routed' | 'accepted_hub' | 'accepted_ai_agent' | 'completed';
  aiConfidence: number; // 0-100
  suggestedComplexity: 'Simple' | 'Complex';
  finalComplexity: 'Simple' | 'Complex' | '';
  notes: string;
  quoteNumber: string;
  price: number;
  shippingCost: number;
  leadTime: number; // in days
  discount: number; // e.g. 5%
  draftEmailText: string;
  clarificationEmailText: string;
  pilotMessages: PilotMessage[];
  attachments?: { name: string; type: string; size: string; content?: string }[];
  customerSentAt?: string;
  forwardedBy?: string;
  sfdcOpportunity?: {
    accountName: string;
    bookingEntity: string;
    opportunityName: string;
    offerType: string;
    contactName: string;
    contactTitle: string;
    stage: 'Prospecting' | 'Qualification' | 'Proposal' | 'Bid Negotiation' | 'Closed Won' | 'Closed Lost';
    chanceToWin: number;
    chanceOfOpportunity: number;
    estimatedValue: number;
    currency: string;
    closeDate: string;
    region: string;
    productLine: string;
  };
}
