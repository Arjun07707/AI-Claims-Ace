'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { claims, type Claim } from '@/lib/data';
import { detectFraudulentClaim } from '@/ai/flows/fraudulent-claim-detection';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Loader2, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type ClaimWithFraudInfo = Claim & {
  fraudInfo?: {
    isFraudulent: boolean;
    fraudExplanation: string;
    confidenceScore: number;
  };
};

export function ClaimsTable() {
  const [claimsData, setClaimsData] = useState<ClaimWithFraudInfo[]>(claims);
  const [selectedClaim, setSelectedClaim] = useState<ClaimWithFraudInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchFraudInfo = async () => {
      const claimsWithFraud = await Promise.all(
        claims.map(async (claim) => {
          try {
            const fraudInfo = await detectFraudulentClaim({
              claimDetails: `Name: ${claim.claimantName}, Policy: ${claim.policyNumber}, Description: ${claim.description}, Amount: ${claim.amount}`,
            });
            return { ...claim, fraudInfo };
          } catch (error) {
            console.error(`Failed to get fraud info for claim ${claim.id}:`, error);
            return claim;
          }
        })
      );
      setClaimsData(claimsWithFraud);
      setIsLoading(false);
    };

    fetchFraudInfo();
  }, []);

  const handleAction = (claimId: string, action: 'Approved' | 'Rejected') => {
    setClaimsData((prev) =>
      prev.map((claim) =>
        claim.id === claimId ? { ...claim, status: action } : claim
      )
    );
    toast({
      title: `Claim ${action}`,
      description: `Claim ${claimId} has been marked as ${action}.`,
    });
  };

  const statusConfig: { [key: string]: { variant: "default" | "secondary" | "destructive" | "outline" } } = {
    Approved: { variant: 'default' },
    'In Review': { variant: 'secondary' },
    Pending: { variant: 'outline' },
    Rejected: { variant: 'destructive' },
  };

  return (
    <>
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Claim ID</TableHead>
                <TableHead>Claimant</TableHead>
                <TableHead>Policy #</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-center">Fraud Risk</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                    <TableRow key={i} className="animate-pulse">
                        <TableCell><div className="h-4 bg-muted rounded w-20"></div></TableCell>
                        <TableCell><div className="h-4 bg-muted rounded w-24"></div></TableCell>
                        <TableCell><div className="h-4 bg-muted rounded w-24"></div></TableCell>
                        <TableCell><div className="h-6 bg-muted rounded w-20 mx-auto"></div></TableCell>
                        <TableCell><div className="h-4 bg-muted rounded w-20"></div></TableCell>
                        <TableCell><div className="h-4 bg-muted rounded w-16 ml-auto"></div></TableCell>
                        <TableCell><div className="h-6 bg-muted rounded w-16 mx-auto"></div></TableCell>
                        <TableCell><div className="flex gap-2 justify-center"><div className="h-8 w-8 bg-muted rounded"></div><div className="h-8 w-8 bg-muted rounded"></div></div></TableCell>
                    </TableRow>
                ))
              ) : (
                claimsData.map((claim) => (
                  <TableRow key={claim.id} onClick={() => setSelectedClaim(claim)} className="cursor-pointer">
                    <TableCell className="font-medium">{claim.id}</TableCell>
                    <TableCell>{claim.claimantName}</TableCell>
                    <TableCell>{claim.policyNumber}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={statusConfig[claim.status]?.variant ?? 'outline'}>{claim.status}</Badge>
                    </TableCell>
                    <TableCell>{claim.dateSubmitted}</TableCell>
                    <TableCell className="text-right">${claim.amount.toFixed(2)}</TableCell>
                    <TableCell className="text-center">
                        {claim.fraudInfo ? (
                             <Badge variant={claim.fraudInfo.confidenceScore > 0.5 ? "destructive" : "secondary"}>
                                {(claim.fraudInfo.confidenceScore * 100).toFixed(0)}%
                            </Badge>
                        ) : (
                            <Badge variant="outline">N/A</Badge>
                        )}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex gap-2 justify-center" onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="text-green-600 hover:text-green-700" onClick={() => handleAction(claim.id, 'Approved')}>
                          <CheckCircle className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700" onClick={() => handleAction(claim.id, 'Rejected')}>
                          <XCircle className="h-5 w-5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {selectedClaim && (
        <Dialog open={!!selectedClaim} onOpenChange={() => setSelectedClaim(null)}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Claim Details: {selectedClaim.id}</DialogTitle>
                    <DialogDescription>
                        Full details for the claim filed by {selectedClaim.claimantName}.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                    <div>
                        <h3 className="font-semibold mb-4 border-b pb-2">Claim Information</h3>
                        <div className="space-y-3 text-sm">
                            <p><strong>Claimant:</strong> {selectedClaim.claimantName}</p>
                            <p><strong>Policy Number:</strong> {selectedClaim.policyNumber}</p>
                            <p><strong>Status:</strong> <Badge variant={statusConfig[selectedClaim.status]?.variant ?? 'outline'}>{selectedClaim.status}</Badge></p>
                            <p><strong>Date Submitted:</strong> {selectedClaim.dateSubmitted}</p>
                            <p><strong>Claimed Amount:</strong> ${selectedClaim.amount.toFixed(2)}</p>
                            <p><strong>Description:</strong> {selectedClaim.description}</p>
                        </div>
                    </div>
                     <div>
                        <h3 className="font-semibold mb-4 border-b pb-2">AI Fraud Analysis</h3>
                         {selectedClaim.fraudInfo ? (
                             <div className="space-y-3 text-sm p-4 rounded-lg bg-secondary/50">
                                <p><strong>Fraudulent:</strong> {selectedClaim.fraudInfo.isFraudulent ? 'Yes' : 'No'}</p>
                                <p><strong>Confidence Score:</strong> <Badge variant={selectedClaim.fraudInfo.confidenceScore > 0.5 ? "destructive" : "secondary"}>
                                    {(selectedClaim.fraudInfo.confidenceScore * 100).toFixed(0)}%
                                </Badge></p>
                                <p><strong>AI Explanation:</strong> {selectedClaim.fraudInfo.fraudExplanation}</p>
                             </div>
                         ) : (
                             <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                <p>AI Analysis in progress...</p>
                            </div>
                         )}
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setSelectedClaim(null)}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      )}
    </>
  );
}
