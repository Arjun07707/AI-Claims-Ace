import { config } from 'dotenv';
config();

import '@/ai/flows/fraudulent-claim-detection.ts';
import '@/ai/flows/claim-approval-probability.ts';
import '@/ai/flows/chatbot-claim-filing.ts';
import '@/ai/flows/document-ai-claim-details-extraction.ts';
import '@/ai/flows/ai-generated-claim-updates.ts';