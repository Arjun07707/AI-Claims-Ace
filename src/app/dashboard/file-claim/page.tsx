import { ClaimFormTabs } from "./components/claim-form-tabs";

export default function FileClaimPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">File a New Claim</h1>
                <p className="text-muted-foreground">
                    Choose your preferred method to submit your claim details.
                </p>
            </div>
            <ClaimFormTabs />
        </div>
    );
}
