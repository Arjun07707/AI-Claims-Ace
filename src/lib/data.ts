export type Claim = {
  id: string;
  policyNumber: string;
  claimantName: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'In Review';
  dateSubmitted: string;
  description: string;
  amount: number;
  fraudScore?: number;
  approvalProbability?: number;
  timeline: {
    date: string;
    status: string;
    description: string;
  }[];
};

export const claims: Claim[] = [
  {
    id: 'CLM-001',
    policyNumber: 'POL-12345',
    claimantName: 'John Doe',
    status: 'Approved',
    dateSubmitted: '2023-10-01',
    description: 'Windshield crack from road debris on highway I-5.',
    amount: 350.0,
    fraudScore: 0.05,
    approvalProbability: 0.95,
    timeline: [
      { date: '2023-10-01', status: 'Submitted', description: 'Claim submitted by user.' },
      { date: '2023-10-02', status: 'In Review', description: 'AI is reviewing documents and claim details.' },
      { date: '2023-10-03', status: 'Approved', description: 'Claim has been approved. Payment will be processed.' },
    ],
  },
  {
    id: 'CLM-002',
    policyNumber: 'POL-67890',
    claimantName: 'Jane Smith',
    status: 'In Review',
    dateSubmitted: '2023-10-15',
    description: 'Minor fender bender in a parking lot. Other party at fault.',
    amount: 800.0,
    fraudScore: 0.12,
    approvalProbability: 0.88,
    timeline: [
        { date: '2023-10-15', status: 'Submitted', description: 'Claim submitted by user.' },
        { date: '2023-10-16', status: 'In Review', description: 'An adjuster is assigned and reviewing the case.' },
    ],
  },
  {
    id: 'CLM-003',
    policyNumber: 'POL-24680',
    claimantName: 'Peter Jones',
    status: 'Pending',
    dateSubmitted: '2023-11-05',
    description: 'Water damage in basement due to burst pipe.',
    amount: 5500.0,
    fraudScore: 0.25,
    approvalProbability: 0.75,
    timeline: [
      { date: '2023-11-05', status: 'Submitted', description: 'Claim submitted. Awaiting document verification.' },
    ],
  },
  {
    id: 'CLM-004',
    policyNumber: 'POL-13579',
    claimantName: 'Maria Garcia',
    status: 'Rejected',
    dateSubmitted: '2023-09-20',
    description: 'Lost luggage during international travel.',
    amount: 1200.0,
    fraudScore: 0.85,
    approvalProbability: 0.10,
    timeline: [
      { date: '2023-09-20', status: 'Submitted', description: 'Claim submitted by user.' },
      { date: '2023-09-21', status: 'In Review', description: 'AI flagged inconsistencies in submitted documents.' },
      { date: '2023-09-23', status: 'Rejected', description: 'Claim rejected due to policy exclusion for this type of loss.' },
    ],
  },
  {
    id: 'CLM-005',
    policyNumber: 'POL-97531',
    claimantName: 'Chen Wei',
    status: 'In Review',
    dateSubmitted: '2023-11-10',
    description: 'Hail damage to vehicle roof and hood during recent storm.',
    amount: 2100.0,
    fraudScore: 0.08,
    approvalProbability: 0.92,
    timeline: [
      { date: '2023-11-10', status: 'Submitted', description: 'Claim and photos received.' },
      { date: '2023-11-11', status: 'In Review', description: 'AI damage assessment is in progress.' },
    ],
  },
];
