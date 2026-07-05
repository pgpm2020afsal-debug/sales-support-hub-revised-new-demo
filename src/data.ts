import { QuoteInquiry } from './types';

export const INITIAL_QUOTES: QuoteInquiry[] = [
  {
    id: 'REQ-2026-001',
    customerName: 'Dylan Bell',
    customerEmail: 'dylan.bell@pdasgroup.co.uk',
    subject: 'RFQ: Impeller replacement hydraulic kit for FP80C-CB1.3',
    emailBody: `Good Morning,

Can I please request a quotation to replace the impeller and associated parts for the below pumps, I believe this would be a Hydraulic Kit FP80C-CB1.3;

XFP-PE1-80C-CB1.3-PE29_4C-EX
Order 3674455
GX2312321111111
SN: 301009200
SN: 301009201

Any help would be greatly appreciated, thank you.

Kind Regards,

Dylan Bell
Service Co-Ordinator
Ph: 01483 917702 | www: www.pdasgoup.co.uk`,
    customerSentAt: '2026-06-23T08:20:00Z',
    receivedAt: '2026-06-23T08:44:00Z',
    forwardedBy: 'Sarah Jenkins (UK Sales)',
    sfdcOpportunity: {
      accountName: 'PDAS Group Ltd',
      bookingEntity: 'Sulzer Pumps (UK) Ltd',
      opportunityName: 'PDAS – FP80C-CB1.3 Hydraulic Kit RFQ 2026',
      offerType: 'Spare Parts',
      contactName: 'Dylan Bell',
      contactTitle: 'Service Co-Ordinator',
      stage: 'Proposal',
      chanceToWin: 70,
      chanceOfOpportunity: 65,
      estimatedValue: 1850,
      currency: 'GBP',
      closeDate: '2026-07-15',
      region: 'UK & Ireland',
      productLine: 'Hydraulic Kits & Wear Parts',
    },
    partNumberExtracted: 'FP80C-CB1.3',
    partNumberCorrected: 'FP80C-CB1.3',
    serialNumberExtracted: '301009200',
    serialNumberCorrected: '301009200',
    status: 'unqualified',
    aiConfidence: 96,
    suggestedComplexity: 'Simple',
    finalComplexity: '',
    notes:
      'Direct match found in Sulzer parts master catalogue for FP80C Hydraulic Refurbishment Kit.',
    quoteNumber: 'QT-2026-8910',
    price: 1850.0,
    shippingCost: 150.0,
    leadTime: 3,
    discount: 0,
    draftEmailText: `Dear Dylan Bell,

Please find attached our official quote QT-2026-8910 for the replacement Hydraulic Kit FP80C-CB1.3 for your pumps.

We have confirmed this item is in stock and can be dispatched via expedited courier immediately upon approval.

Best regards,
Sales Support Hub`,
    clarificationEmailText: `Dear Dylan Bell,

Thank you for your RFQ. We see two distinct serial numbers (301009200 and 301009201). Please confirm if you require quotation for one or both units.

Best regards,
Sales Support Hub`,
    pilotMessages: [
      {
        sender: 'copilot',
        text: 'Hello! I have pre-calculated the quote for Dylan Bell. His inquiry is for the FP80C-CB1.3 kit. Based on PDAS Group contract rules, they are eligible for a 10% volume discount if they order both kits. Would you like to suggest this?',
        timestamp: '10:30 AM',
      },
    ],
  },
  {
    id: 'REQ-2026-002',
    customerName: 'Oliver Yates',
    customerEmail: 'oliver.yates@midlandpumps.co.uk',
    subject: 'Spare parts: replacement hydraulic kit for pump',
    emailBody: `Good morning Sulzer, 

Please can we have a quote for replacement hydraulic kit for the pump, as per the data plate attached. 

Kind Regards,
Oliver Yates
Midland Water Utilities`,
    customerSentAt: '2026-06-22T07:10:00Z',
    receivedAt: '2026-06-23T09:45:00Z',
    forwardedBy: 'Tom Richards (Midlands Rep)',
    sfdcOpportunity: {
      accountName: 'Midland Water Utilities',
      bookingEntity: 'Sulzer Pumps (UK) Ltd',
      opportunityName: 'Midland Water – Hydraulic Kit Replacement 2026',
      offerType: 'Spare Parts',
      contactName: 'Oliver Yates',
      contactTitle: 'Procurement Engineer',
      stage: 'Qualification',
      chanceToWin: 50,
      chanceOfOpportunity: 45,
      estimatedValue: 2450,
      currency: 'GBP',
      closeDate: '2026-07-30',
      region: 'UK & Ireland',
      productLine: 'Hydraulic Kits & Wear Parts',
    },
    partNumberExtracted: '', // MISSING (it is in the attached data plate!)
    partNumberCorrected: '',
    serialNumberExtracted: '', // MISSING
    serialNumberCorrected: '',
    status: 'unqualified',
    aiConfidence: 35,
    suggestedComplexity: 'Complex',
    finalComplexity: '',
    notes:
      'Missing direct text references for part/serial numbers. High resolution data plate image is attached below; human review required to extract parameters.',
    quoteNumber: 'QT-2026-8911',
    price: 2450.0,
    shippingCost: 220.0,
    leadTime: 10,
    discount: 0,
    draftEmailText: `Dear Oliver Yates,

Please find attached our official quote QT-2026-8911 for the replacement Hydraulic Kit.

Please review the attached specifications carefully to ensure compliance with your pump setup.

Best regards,
Sales Support Hub`,
    clarificationEmailText: `Dear Oliver Yates,

Thank you for your inquiry. To ensure we provide the exact hydraulic kit for your pump, we require confirmation of the model part number or serial number.

Our systems could not perfectly read the attached photograph. Could you please type in the Serial Number?

Best regards,
Sales Support Hub`,
    pilotMessages: [
      {
        sender: 'copilot',
        text: 'The text contains no part numbers, but there is a clear data plate image attached. Please click "Review Attachment" to read the plate and enter the model (XFP-80C) and Serial Number (301009204) manually.',
        timestamp: '11:00 AM',
      },
    ],
    attachments: [
      {
        name: 'sulzer_data_plate_XFP80.jpg',
        type: 'image/jpeg',
        size: '1.4 MB',
      },
    ],
  },
  {
    id: 'REQ-2026-003',
    customerName: 'Roberto Silva',
    customerEmail: 'r.silva@petro-brasil.br',
    subject: 'Spare parts quote for Gasket Seals',
    emailBody: `Dear sales team,

Please provide pricing and delivery time for 12 units of replacement Industrial Gasket Seals.
Part Number: GS-1049
Serial Number: SN-481920

Shipping destination is Rio de Janeiro port support yard. Standard freight is acceptable.

Best regards,
Roberto Silva
Procurement Office | Petro-Brasil SA`,
    customerSentAt: '2026-06-23T04:05:00Z',
    receivedAt: '2026-06-23T06:30:00Z',
    forwardedBy: 'Ana Costa (LATAM Sales)',
    sfdcOpportunity: {
      accountName: 'Petro-Brasil SA',
      bookingEntity: 'Sulzer Pumps Brasil Ltda',
      opportunityName: 'Petro-Brasil – GS-1049 Gasket Seals 12-Unit Order',
      offerType: 'Standard Parts',
      contactName: 'Roberto Silva',
      contactTitle: 'Procurement Officer',
      stage: 'Proposal',
      chanceToWin: 85,
      chanceOfOpportunity: 80,
      estimatedValue: 360,
      currency: 'BRL',
      closeDate: '2026-07-10',
      region: 'Latin America',
      productLine: 'Sealing & Gasket Systems',
    },
    partNumberExtracted: 'GS-1049',
    partNumberCorrected: 'GS-1049',
    serialNumberExtracted: 'SN-481920',
    serialNumberCorrected: 'SN-481920',
    status: 'accepted_hub',
    aiConfidence: 99,
    suggestedComplexity: 'Simple',
    finalComplexity: 'Simple',
    notes:
      'High historical match. Standard non-hazardous rubberized gasket seals with stock level: 45 units available.',
    quoteNumber: 'QT-2026-8908',
    price: 360.0,
    shippingCost: 80.0,
    leadTime: 5,
    discount: 0,
    draftEmailText: `Dear Roberto Silva,

Please find attached our official quote QT-2026-8908 for 12 units of Industrial Gasket Seals (Part Number GS-1049).

The delivery has been configured for standard marine freight to your Rio de Janeiro yard.

Best regards,
Sales Support Hub`,
    clarificationEmailText: `Dear Roberto Silva,

Thank you for your order. We require additional clarification on standard vs high-pressure compound gasket options. Please let us know if standard compound is sufficient.

Best regards,
Sales Support Hub`,
    pilotMessages: [
      {
        sender: 'copilot',
        text: 'This customer requested 12 units. Since stock is high (45 units), standard routing should put this directly in Simple Hub Queue. Would you like to proceed?',
        timestamp: '09:00 AM',
      },
    ],
  },
  {
    id: 'REQ-2026-004',
    customerName: 'Liam Henderson',
    customerEmail: 'liam.henderson@cleanwatergroup.com',
    subject: 'RFQ: Replacement Hydraulic Parts & Impeller Seal for ABS XFP',
    emailBody: `Hello Sulzer Sales Team,

Please could you quote for the replacement parts listed below for our storm water station pumps:

Pump Type: XFP 100G-CB1.5
Serial Number: 301008544
Hydraulic Kit: FP100G-CB1.5

Please confirm standard lead time and carriage costs to our Leeds Depot.

Best regards,
Liam Henderson
Leeds Water Treatment Operations`,
    customerSentAt: '2026-06-22T15:30:00Z',
    receivedAt: '2026-06-23T11:02:00Z',
    forwardedBy: 'James Booth (North UK)',
    sfdcOpportunity: {
      accountName: 'Clean Water Group',
      bookingEntity: 'Sulzer Pumps (UK) Ltd',
      opportunityName: 'Clean Water Group – XFP-100G Wear Kit Leeds 2026',
      offerType: 'Spare Parts',
      contactName: 'Liam Henderson',
      contactTitle: 'Operations Engineer',
      stage: 'Qualification',
      chanceToWin: 65,
      chanceOfOpportunity: 60,
      estimatedValue: 2150,
      currency: 'GBP',
      closeDate: '2026-07-20',
      region: 'UK & Ireland',
      productLine: 'Hydraulic Kits & Wear Parts',
    },
    partNumberExtracted: 'FP100G-CB1.5',
    partNumberCorrected: 'FP100G-CB1.5',
    serialNumberExtracted: '301008544',
    serialNumberCorrected: '301008544',
    status: 'unqualified',
    aiConfidence: 94,
    suggestedComplexity: 'Simple',
    finalComplexity: '',
    notes:
      'Direct system match for ABS XFP-100G Hydraulic Wear Kit. Stock status available at Leeds local hub.',
    quoteNumber: 'QT-2026-8912',
    price: 2150.0,
    shippingCost: 110.0,
    leadTime: 4,
    discount: 0,
    draftEmailText: `Dear Liam Henderson,

Please find attached our official quote QT-2026-8912 for the replacement parts and impeller seals for ABS XFP.

Delivery has been set for standard shipment to Leeds Depot.

Best regards,
Sales Support Hub`,
    clarificationEmailText: `Dear Liam Henderson,

Thank you for your RFQ. We have successfully tracked Serial Number 301008544 in our systems. Please confirm if you require both the seal rings and wear plates included.

Best regards,
Sales Support Hub`,
    pilotMessages: [
      {
        sender: 'copilot',
        text: 'The parts match Leeds hub inventory. I recommend qualifying this item so we can generate the quote quickly.',
        timestamp: '11:15 AM',
      },
    ],
  },
  {
    id: 'REQ-2026-005',
    customerName: 'David Miller',
    customerEmail: 'd.miller@detroit-water.com',
    subject: 'Urgent quotation: Hydraulic Impeller & Shaft Assembly',
    emailBody: `Hello sales team,

We require a heavy-duty hydraulic impeller and shaft assembly for our main municipal wastewater plant.
Part Number: 31055123 M
Serial Number: 301009201

Please note this requires custom impeller diameter resizing and dynamic balancing tests to handle continuous torsional stress.

Let me know standard lead times.

Thank you,
David Miller
Operations Engineer | Detroit Municipal Water`,
    customerSentAt: '2026-06-23T04:50:00Z',
    receivedAt: '2026-06-23T05:12:00Z',
    forwardedBy: 'Chris Wade (US East)',
    sfdcOpportunity: {
      accountName: 'Detroit Municipal Water',
      bookingEntity: 'Sulzer Pumps (US) Inc',
      opportunityName: 'Detroit Water – Custom Impeller & Shaft Assembly 2026',
      offerType: 'Engineered Solution',
      contactName: 'David Miller',
      contactTitle: 'Operations Engineer',
      stage: 'Proposal',
      chanceToWin: 80,
      chanceOfOpportunity: 75,
      estimatedValue: 3850,
      currency: 'USD',
      closeDate: '2026-08-01',
      region: 'North America',
      productLine: 'Custom Impeller & Shaft Assemblies',
    },
    partNumberExtracted: '31055123 M',
    partNumberCorrected: '31055123 M',
    serialNumberExtracted: '301009201',
    serialNumberCorrected: '301009201',
    status: 'qualified',
    aiConfidence: 95,
    suggestedComplexity: 'Complex',
    finalComplexity: '',
    notes: 'Flagged as complex due to impeller dia changes',
    quoteNumber: 'QT-2026-8907',
    price: 3850.0,
    shippingCost: 250.0,
    leadTime: 12,
    discount: 5,
    draftEmailText: `Dear David Miller,

Please find attached our official quote QT-2026-8907 for the customized Hydraulic Impeller and Shaft Assembly (Part Number 31055123 M, Serial 301009201).

As requested, we have appended the customized impeller diameter adjustment and dynamic balancing test specifications to the engineering bill of materials. The pricing includes non-destructive testing verification.

Best regards,
Sales Support Hub`,
    clarificationEmailText: `Dear David Miller,

Thank you for your RFQ. We are confirming the exact custom impeller diameter required for your pump model to ensure dynamic balancing is rated perfectly.

Best regards,
Sales Support Hub`,
    pilotMessages: [
      {
        sender: 'copilot',
        text: 'Hello David! I see Detroit Municipal Water requested custom impeller diameter modifications. I have automatically added $450 dynamic balancing and custom machining surcharge to the standard price. Standard shipping is selected. Should I add a custom expedited shipping surcharge?',
        timestamp: '10:45 AM',
      },
      {
        sender: 'user',
        text: 'Keep shipping as standard freight, but apply their 5% global contract discount.',
        timestamp: '10:48 AM',
      },
      {
        sender: 'copilot',
        text: 'Got it. I have applied the 5% contract discount ($192.50 discount value) and kept standard freight shipping at $250.00. The total is recalculated to $3,907.50. Let me know if you would like to finalize the quote!',
        timestamp: '10:49 AM',
      },
    ],
  },
  {
    id: 'REQ-2026-006',
    customerName: 'Milind Salunkhe (thyssenkrupp Uhde)',
    customerEmail: 'm.salunkhe@thyssenkrupp-uhde.co.in',
    subject: 'RFQ: RP008 - Non-API Centrifugal Slurry Pumps (HZL DAP/PA Plant)',
    emailBody: `[EXTERNAL EMAIL]
Project: O4QO-12659 – HZL 1.0 MMTPA DAP Plant & 0.36 MMTPA PA Plant, Chanderia

Subject: RFQ for RP008 - Non-API Centrifugal Slurry Pumps

To,
M/s. Sulzer Pumps
Kind Attn: Mr. Sulzer Pumps

Dear Sir,
M/s. Hindustan Zinc Limited (HZL) proposes to set up a 1.0 MMTPA DAP Plant and a 0.36 MMTPA PA Plant at Chanderia.
We, thyssenkrupp Uhde (India) Private Limited (tkUIPL), shall be bidding this project to HZL on an EPC basis. As part of the EPC proposal, we hereby invite you to submit your most competitive techno commercial quotation for the Design, Engineering, and Supply of the Non-API Centrifugal Slurry Pumps for the above referenced project, with the shortest possible delivery terms.
Please note that your quotation should be provided free of charge and without any obligation to thyssenkrupp Uhde India Private Limited.
All technical specifications are attached in the below cryptshare link. Password is required to download the documents from the  below link and same is mentioned below.Also please note that link will expire on 26.05.2026

Download Files
Available until 26-05-2026 


Password-: tkUIPL@2026
Note: All provided drawings, parts lists, manufacturing documentation, inspection and acceptance instructions, calculations, models, specifications, standard sheets, and similar documents remain the property of thyssenkrupp Uhde India Private Limited. These materials may not be disclosed to any third party or used for purposes other than those agreed with thyssenkrupp Uhde India Private Limited, without our prior written consent.
Your offer must comply fully with the attached technical specification. Any deviations from the technical specifications must be clearly highlighted and listed in a separate deviation sheet.
Below you will find major milestones and formal requirements for offer preparation:
•	Confirmation of RFQ: 22.05.2026
•	Validity of quotation: 3 months from the date of quotation
Request you to please submit your techno commercial offer on or before 29th May 2026.
Kindly confirm receipt of this inquiry with respective attachments in form of Reply to Inquiry and due date as stated above. In addition, please provide contact details of responsible person for offers preparation from your side.
In case your company decides not to participate in the tendering process for the above mentioned package, we kindly ask you to provide the respective reason in the Reply to Inquiry form by the due date as stated above.
In case of any questions, kindly contact the following persons as named below:
•	Technical queries : Rupesh Sagare (in CC)
•	Commercial queries : Milind Salunkhe (in CC)
Thanks in advance for your kind support.`,
    customerSentAt: '2026-06-21T09:00:00Z',
    receivedAt: '2026-06-23T11:30:00Z',
    forwardedBy: 'Priya Nair (India BDM)',
    sfdcOpportunity: {
      accountName: 'thyssenkrupp Uhde India Pvt Ltd',
      bookingEntity: 'Sulzer Pumps India Ltd',
      opportunityName: 'tkUIPL – HZL DAP/PA Plant Non-API Slurry Pumps EPC',
      offerType: 'EPC Tender',
      contactName: 'Milind Salunkhe',
      contactTitle: 'Commercial Manager',
      stage: 'Bid Negotiation',
      chanceToWin: 45,
      chanceOfOpportunity: 40,
      estimatedValue: 185000,
      currency: 'INR',
      closeDate: '2026-09-30',
      region: 'India & South Asia',
      productLine: 'Non-API Centrifugal Slurry Pumps',
    },
    partNumberExtracted: 'RP008',
    partNumberCorrected: 'RP008',
    serialNumberExtracted: 'O4QO-12659',
    serialNumberCorrected: 'O4QO-12659',
    status: 'unqualified',
    aiConfidence: 98,
    suggestedComplexity: 'Complex',
    finalComplexity: '',
    notes:
      'Very complex EPC Tender request from tkUIPL for Hindustan Zinc Slurry Pumps. Involves design/engineering of Non-API centrifugal slurry pumps with strict deviation and qualification schedules.',
    quoteNumber: 'QT-2026-8913',
    price: 185000.0,
    shippingCost: 7500.0,
    leadTime: 45,
    discount: 0,
    draftEmailText: `Dear Milind Salunkhe,

Thank you for your RFQ regarding the Non-API Centrifugal Slurry Pumps package (Project O4QO-12659) for the HZL DAP/PA Plant at Chanderia.

We are preparing our comprehensive techno-commercial proposal in strict accordance with your technical specifications. We will highlight any deviations in a dedicated sheet as requested.

Best regards,
Sulzer Pumps Proposal Division`,
    clarificationEmailText: `Dear Milind Salunkhe,

Thank you for your RFQ. To ensure we select the optimum slurry pump sizes and metallurgy, could you please provide the solid particle concentration and expected fluid density parameters?

Best regards,
Sulzer Pumps Proposal Division`,
    pilotMessages: [
      {
        sender: 'copilot',
        text: 'This is an extremely complex high-value EPC tender for a major chemical/mineral processing facility. Our AI model suggests routing this package directly to our Local Back office engineering division for complete custom pump rating selection and hydraulic simulation calculations.',
        timestamp: '11:45 AM',
      },
    ],
  },
];
