'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { claims, type Claim } from '@/lib/data';
import { cn } from '@/lib/utils';
import { predictClaimApprovalProbability } from '@/ai/flows/claim-approval-probability';
import { generateClaimUpdate } from '@/ai/flows/ai-generated-claim-updates';

type ClaimWithInsights = Claim & {
  aiApprovalProbability?: number;
  aiReasons?: string;
  aiUpdate?: string;
};

const statusConfig = {
  Approved: { color: 'bg-green-500', variant: 'default' as const, progress: 100 },
  'In Review': { color: 'bg-yellow-500', variant: 'secondary' as const, progress: 50 },
  Pending: { color: 'bg-orange-500', variant: 'outline' as const, progress: 20 },
  Rejected: { color: 'bg-red-500', variant: 'destructive' as const, progress: 100 },
};

export function ClaimStatus() {
  const [claimsWithInsights, setClaimsWithInsights] = useState<ClaimWithInsights[]>(claims);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      const claimsWithAI = await Promise.all(
        claims.map(async (claim) => {
          try {
            const [approvalPrediction, update] = await Promise.all([
              predictClaimApprovalProbability({
                claimDetails: claim.description,
                userProfile: `Claimant: ${claim.claimantName}, Policy: ${claim.policyNumber}`,
                policyDetails: 'Standard auto & home insurance policy.',
              }),
              generateClaimUpdate({
                claimStatus: claim.status,
                claimDetails: claim.description,
              }),
            ]);
            
            return {
              ...claim,
              aiApprovalProbability: approvalPrediction.approvalProbability,
              aiReasons: approvalPrediction.reasons,
              aiUpdate: update.progress,
            };
          } catch (error) {
            console.error(`Failed to get insights for claim ${claim.id}:`, error);
            return claim; // Return original claim if AI call fails
          }
        })
      );
      setClaimsWithInsights(claimsWithAI);
      setIsLoading(false);
    };

    fetchInsights();
  }, []);

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
                <CardHeader>
                    <div className="h-6 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2 mt-2"></div>
                </CardHeader>
                <CardContent>
                    <div className="h-4 bg-muted rounded w-full"></div>
                    <div className="h-4 bg-muted rounded w-5/6 mt-2"></div>
                </CardContent>
                <CardFooter>
                    <div className="h-10 bg-muted rounded w-1/3"></div>
                </CardFooter>
            </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
      {claimsWithInsights.map((claim) => {
        const config = statusConfig[claim.status] || statusConfig.Pending;
        const probability = claim.aiApprovalProbability ?? claim.approvalProbability ?? 0;

        return (
          <Card key={claim.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Claim #{claim.id}</CardTitle>
                  <CardDescription>Submitted on {claim.dateSubmitted}</CardDescription>
                </div>
                <Badge variant={config.variant}>{claim.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground mb-4">{claim.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium">AI Approval Probability</span>
                  <span className="font-bold text-primary">{(probability * 100).toFixed(0)}%</span>
                </div>
                <Progress value={probability * 100} />
                 <p className="text-xs text-muted-foreground pt-1">{claim.aiReasons}</p>
              </div>
              
              <div className="p-3 bg-secondary/50 rounded-lg">
                <h4 className="font-semibold text-sm mb-1">AI Summary</h4>
                <p className="text-xs text-muted-foreground">{claim.aiUpdate || "AI summary is being generated."}</p>
              </div>

            </CardContent>
            <CardFooter>
                <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                    <AccordionTrigger>View Claim Timeline</AccordionTrigger>
                    <AccordionContent>
                        <ul className="space-y-4 py-4">
                            {claim.timeline.map((event, index) => (
                            <li key={index} className="flex gap-4">
                                <div className="flex flex-col items-center">
                                <div className={cn("w-3 h-3 rounded-full", statusConfig[event.status as keyof typeof statusConfig]?.color || 'bg-gray-400')}></div>
                                {index < claim.timeline.length - 1 && <div className="w-px h-full bg-border"></div>}
                                </div>
                                <div>
                                <p className="font-semibold text-sm">{event.status}</p>
                                <p className="text-xs text-muted-foreground">{event.date}</p>
                                <p className="text-sm mt-1">{event.description}</p>
                                </div>
                            </li>
                            ))}
                        </ul>
                    </AccordionContent>
                </AccordionItem>
                </Accordion>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
