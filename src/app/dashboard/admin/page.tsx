import { ClaimsTable } from "./components/claims-table";

export default function AdminPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
                <p className="text-muted-foreground">
                    Review, manage, and process all user claims.
                </p>
            </div>
            <ClaimsTable />
        </div>
    );
}
