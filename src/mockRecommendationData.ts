export interface MockPricingRecord {
  partNumber: string;
  country: string;
  customerName: string;
  date: string;
  unitPrice: number;
  discount: number;
  currency: string;
  qty: number;
  contractType: 'Contract' | 'Spot' | 'Mixed';
}

export interface RecommendationSource {
  label: string;
  value: string;
}

export interface RecommendationCard {
  title: string;
  summary: string;
  detail: string;
  confidence: string;
  recommendedDiscount?: number;
  recommendedLeadTime?: number;
  sources: RecommendationSource[];
}

export const MOCK_PRICING_HISTORY: MockPricingRecord[] = [
  {
    partNumber: 'FP80C-CB1.3',
    country: 'UK',
    customerName: 'PDAS Group',
    date: '2024-01-18',
    unitPrice: 1680,
    discount: 8,
    currency: 'GBP',
    qty: 2,
    contractType: 'Contract',
  },
  {
    partNumber: 'FP80C-CB1.3',
    country: 'UK',
    customerName: 'Midland Water',
    date: '2024-06-11',
    unitPrice: 1750,
    discount: 12,
    currency: 'GBP',
    qty: 1,
    contractType: 'Spot',
  },
  {
    partNumber: 'FP80C-CB1.3',
    country: 'UK',
    customerName: 'AquaCore',
    date: '2025-02-03',
    unitPrice: 1825,
    discount: 10,
    currency: 'GBP',
    qty: 3,
    contractType: 'Contract',
  },
  {
    partNumber: 'FP80C-CB1.3',
    country: 'Germany',
    customerName: 'Bergwasser GmbH',
    date: '2024-03-15',
    unitPrice: 1910,
    discount: 7,
    currency: 'EUR',
    qty: 1,
    contractType: 'Spot',
  },
  {
    partNumber: 'FP80C-CB1.3',
    country: 'Germany',
    customerName: 'Energie Nord',
    date: '2025-04-22',
    unitPrice: 1880,
    discount: 9,
    currency: 'EUR',
    qty: 2,
    contractType: 'Contract',
  },
  {
    partNumber: 'FP80C-CB1.3',
    country: 'India',
    customerName: 'UHDE India',
    date: '2024-09-09',
    unitPrice: 1420,
    discount: 6,
    currency: 'INR',
    qty: 1,
    contractType: 'Mixed',
  },
  {
    partNumber: 'FP80C-CB1.3',
    country: 'India',
    customerName: 'Pune Utilities',
    date: '2025-05-30',
    unitPrice: 1495,
    discount: 11,
    currency: 'INR',
    qty: 2,
    contractType: 'Contract',
  },
  {
    partNumber: 'FP80C-CB1.3',
    country: 'UAE',
    customerName: 'Desert Flow',
    date: '2025-01-12',
    unitPrice: 2140,
    discount: 5,
    currency: 'AED',
    qty: 1,
    contractType: 'Spot',
  },

  {
    partNumber: 'FP100G-CB1.5',
    country: 'UK',
    customerName: 'Clean Water Group',
    date: '2024-02-12',
    unitPrice: 1980,
    discount: 9,
    currency: 'GBP',
    qty: 1,
    contractType: 'Contract',
  },
  {
    partNumber: 'FP100G-CB1.5',
    country: 'UK',
    customerName: 'North Water',
    date: '2024-10-08',
    unitPrice: 2060,
    discount: 13,
    currency: 'GBP',
    qty: 2,
    contractType: 'Mixed',
  },
  {
    partNumber: 'FP100G-CB1.5',
    country: 'Germany',
    customerName: 'Rhein Water',
    date: '2025-03-10',
    unitPrice: 2210,
    discount: 8,
    currency: 'EUR',
    qty: 1,
    contractType: 'Contract',
  },
  {
    partNumber: 'FP100G-CB1.5',
    country: 'India',
    customerName: 'Maharashtra Water',
    date: '2024-11-24',
    unitPrice: 1540,
    discount: 7,
    currency: 'INR',
    qty: 1,
    contractType: 'Spot',
  },

  {
    partNumber: 'GS-1049',
    country: 'UK',
    customerName: 'PetroSeal',
    date: '2023-11-05',
    unitPrice: 28,
    discount: 4,
    currency: 'GBP',
    qty: 12,
    contractType: 'Contract',
  },
  {
    partNumber: 'GS-1049',
    country: 'UK',
    customerName: 'Harbor Systems',
    date: '2024-08-14',
    unitPrice: 31,
    discount: 6,
    currency: 'GBP',
    qty: 24,
    contractType: 'Mixed',
  },
  {
    partNumber: 'GS-1049',
    country: 'Germany',
    customerName: 'Port Logistics',
    date: '2024-06-01',
    unitPrice: 33,
    discount: 5,
    currency: 'EUR',
    qty: 18,
    contractType: 'Contract',
  },
  {
    partNumber: 'GS-1049',
    country: 'UAE',
    customerName: 'Marine Hub',
    date: '2025-01-22',
    unitPrice: 36,
    discount: 4,
    currency: 'AED',
    qty: 12,
    contractType: 'Spot',
  },

  {
    partNumber: '31055123 M',
    country: 'UK',
    customerName: 'Metro Water',
    date: '2023-12-15',
    unitPrice: 3440,
    discount: 12,
    currency: 'GBP',
    qty: 1,
    contractType: 'Mixed',
  },
  {
    partNumber: '31055123 M',
    country: 'Germany',
    customerName: 'Civils Group',
    date: '2024-05-09',
    unitPrice: 3580,
    discount: 10,
    currency: 'EUR',
    qty: 1,
    contractType: 'Spot',
  },
  {
    partNumber: '31055123 M',
    country: 'India',
    customerName: 'Sewage Works',
    date: '2024-07-28',
    unitPrice: 2610,
    discount: 8,
    currency: 'INR',
    qty: 1,
    contractType: 'Contract',
  },
  {
    partNumber: '31055123 M',
    country: 'UAE',
    customerName: 'Falcon Utilities',
    date: '2025-02-17',
    unitPrice: 3780,
    discount: 9,
    currency: 'AED',
    qty: 1,
    contractType: 'Contract',
  },
];

export const getCountryFromQuote = (quote: {
  customerEmail?: string;
  sfdcOpportunity?: { region?: string } | undefined;
  customerName?: string;
}) => {
  const region = quote.sfdcOpportunity?.region?.toLowerCase() || '';
  if (region.includes('uk')) return 'UK';
  if (region.includes('germany') || region.includes('de')) return 'Germany';
  if (region.includes('india') || region.includes('india')) return 'India';
  if (region.includes('uae') || region.includes('emir')) return 'UAE';
  if (quote.customerEmail?.toLowerCase().includes('uk')) return 'UK';
  if (
    quote.customerEmail?.toLowerCase().includes('de') ||
    quote.customerEmail?.toLowerCase().includes('gmbh')
  )
    return 'Germany';
  if (
    quote.customerEmail?.toLowerCase().includes('india') ||
    quote.customerEmail?.toLowerCase().includes('in')
  )
    return 'India';
  if (
    quote.customerEmail?.toLowerCase().includes('ae') ||
    quote.customerEmail?.toLowerCase().includes('uae')
  )
    return 'UAE';
  return 'UK';
};

export const getQuoteRecommendations = (quote: {
  partNumberCorrected?: string;
  partNumberExtracted?: string;
  serialNumberCorrected?: string;
  serialNumberExtracted?: string;
  customerName?: string;
  price?: number;
  sfdcOpportunity?: { region?: string };
}) => {
  const partNumber = quote.partNumberCorrected || quote.partNumberExtracted || 'FP80C-CB1.3';
  const serial = quote.serialNumberCorrected || quote.serialNumberExtracted || '';
  const country = getCountryFromQuote(quote as any);
  const records = MOCK_PRICING_HISTORY.filter(
    record => record.partNumber === partNumber && record.country === country
  );
  const averagePrice = records.length
    ? records.reduce((sum, record) => sum + record.unitPrice, 0) / records.length
    : 1750;
  const averageDiscount = records.length
    ? records.reduce((sum, record) => sum + record.discount, 0) / records.length
    : 10;
  const contractType =
    records.find(record => record.contractType === 'Contract')?.contractType || 'Spot';
  const latestRecord = records[records.length - 1];

  const technicalRecommendation: RecommendationCard = (() => {
    if (partNumber.includes('FP80')) {
      return {
        title: 'Bundle recommendation',
        summary: `This impeller kit was last ordered with a seal kit ${73}% of the time.`,
        detail:
          'Bundling the wear set improves first-time-fit success and reduces downstream service calls.',
        confidence: 'High fit from historical order patterns',
        sources: [
          { label: '📄 mFiles', value: 'Drawing rev. 4.2 • seal kit compatibility confirmed' },
          { label: '🔧 SAP', value: 'Seal kit stock available in Pune hub' },
        ],
      };
    }

    if (partNumber.includes('FP100')) {
      return {
        title: 'Service-life insight',
        summary: `Serial ${
          serial || '301008544'
        } suggests a pump that has seen 8+ years of service.`,
        detail:
          'An overhaul kit is more suitable than a single impeller replacement for this service age profile.',
        confidence: 'Medium confidence from service age signal',
        sources: [
          { label: '📋 Tech spec', value: 'Revision 3.1 • overhaul kit preferred for older units' },
          { label: '🔧 SAP', value: 'Overhaul kit lead time 6 days' },
        ],
      };
    }

    if (partNumber.includes('GS')) {
      return {
        title: 'Compatibility note',
        summary:
          'This gasket family is commonly paired with a standard compound variant for marine duty.',
        detail:
          'The standard compound is the lowest-risk option for the requested delivery window.',
        confidence: 'High fit from standard part history',
        sources: [
          { label: '📄 Tech Docs', value: 'Material compatibility note • standard compound' },
          { label: '📦 SAP', value: '45 units available in Rotterdam hub' },
        ],
      };
    }

    return {
      title: 'Technical note',
      summary: 'The request looks consistent with standard catalogue spare parts.',
      detail:
        'No critical compatibility blockers were detected from the available part and serial details.',
      confidence: 'Moderate confidence',
      sources: [
        { label: '📄 mFiles', value: 'Part master verified' },
        { label: '🔧 SAP', value: 'Stock available for immediate dispatch' },
      ],
    };
  })();

  const pricingRecommendation: RecommendationCard = {
    title: 'Pricing guidance',
    summary: `${country} trend for ${partNumber} is ${currencyLabel(
      country,
      partNumber
    )}${Math.round(averagePrice).toLocaleString()} average price with ${Math.round(
      averageDiscount
    )}% average discount.`,
    detail: latestRecord
      ? `The latest ${latestRecord.contractType.toLowerCase()} transaction was for ${
          latestRecord.qty
        } units at ${latestRecord.discount}% discount.`
      : 'Contract pricing remains the most stable option for this part family.',
    confidence: `${contractType} rate is the strongest historical pattern`,
    recommendedDiscount: Math.max(4, Math.min(16, Math.round(averageDiscount))),
    recommendedLeadTime: partNumber.includes('GS') ? 5 : 6,
    sources: [
      {
        label: '📊 Mock pricing DB',
        value: `Past ${records.length || 4} transactions in ${country}`,
      },
      { label: '💼 Contract rules', value: `${contractType} tier behavior for this part family` },
    ],
  };

  return { technicalRecommendation, pricingRecommendation };
};

const currencyLabel = (country: string, partNumber: string) => {
  if (partNumber.includes('GS')) return '£';
  if (country === 'Germany') return '€';
  if (country === 'India') return '₹';
  if (country === 'UAE') return 'د.إ';
  return '£';
};

export const getRoutingInsight = (quote: {
  partNumberCorrected?: string;
  partNumberExtracted?: string;
  serialNumberCorrected?: string;
  serialNumberExtracted?: string;
  suggestedComplexity?: 'Simple' | 'Complex';
  notes?: string;
}) => {
  const partNumber = quote.partNumberCorrected || quote.partNumberExtracted || 'FP80C-CB1.3';
  const serial = quote.serialNumberCorrected || quote.serialNumberExtracted || 'N/A';
  const isSimple = quote.suggestedComplexity === 'Simple' && !partNumber.includes('31055123');

  if (isSimple) {
    return {
      title: 'AI flagged Simple',
      summary: `Standard catalogue part, prior order history available, and stock is healthy for ${partNumber}.`,
      detail: `The part is a good fit for autonomous routing. Serial ${serial} does not indicate any unusual service constraints.`,
      sources: [
        { label: '🧠 AI routing rules', value: 'Catalogue match + stable part history' },
        { label: '📦 SAP', value: 'Stock available for immediate dispatch' },
      ],
    };
  }

  return {
    title: 'AI flagged Complex',
    summary: 'This enquiry contains non-standard service indicators and needs engineering review.',
    detail: `The request for ${partNumber} is not a routine catalogue order; serial ${serial} and the service notes suggest deeper technical evaluation.`,
    sources: [
      { label: '🧠 AI routing rules', value: 'Non-standard wear pattern + service age signal' },
      { label: '📄 mFiles', value: 'Engineering review notes attached' },
    ],
  };
};
