import { ClaimStatus } from './components/claim-status';

export default function TrackClaimPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Claims</h1>
        <p className="text-muted-foreground">
          Here&apos;s a list of your recent claims and their status.
        </p>
      </div>
      <ClaimStatus />
    </div>
  );
}
