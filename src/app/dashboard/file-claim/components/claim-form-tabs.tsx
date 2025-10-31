'use client';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Bot, FileText, Loader2, Upload, Paperclip, SendHorizonal } from 'lucide-react';
import { fileClaimChatbot } from '@/ai/flows/chatbot-claim-filing';
import { extractClaimDetails } from '@/ai/flows/document-ai-claim-details-extraction';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

type Message = {
    sender: 'user' | 'bot';
    text: string | React.ReactNode;
};

type ExtractedDetails = {
    name?: string;
    policyNumber?: string;
    dateOfIncident?: string;
    damageType?: string;
    description?: string;
    amount?: string;
};


export function ClaimFormTabs() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [chatMessages, setChatMessages] = useState<Message[]>([
        { sender: 'bot', text: 'Hello! I can help you file a new claim. Please describe what happened.' }
    ]);
    const [chatInput, setChatInput] = useState('');
    const [formDetails, setFormDetails] = useState<ExtractedDetails>({});

    const handleChatSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        const userMessage: Message = { sender: 'user', text: chatInput };
        setChatMessages(prev => [...prev, userMessage]);
        setChatInput('');
        setIsLoading(true);

        try {
            const result = await fileClaimChatbot({ userQuery: chatInput });
            const botMessage: Message = {
                sender: 'bot',
                text: (
                    <div>
                        <p>Thanks! I&apos;ve extracted the following details. Please review them:</p>
                        <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                            {Object.entries(result.claimDetails).map(([key, value]) => value && <li key={key}><strong>{key.replace(/([A-Z])/g, ' $1')}:</strong> {value}</li>)}
                        </ul>
                    </div>
                )
            };
            setChatMessages(prev => [...prev, botMessage]);
            setFormDetails(result.claimDetails);
        } catch (error) {
            console.error('Chatbot error:', error);
            const errorMessage: Message = { sender: 'bot', text: 'I had trouble understanding that. Could you please try rephrasing?' };
            setChatMessages(prev => [...prev, errorMessage]);
            toast({
                variant: 'destructive',
                title: 'AI Error',
                description: 'The chatbot failed to process your request.',
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsLoading(true);
        toast({ title: 'Processing Document...', description: 'AI is reading your file. This may take a moment.' });
        
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            try {
                const base64 = reader.result as string;
                const result = await extractClaimDetails({ documentDataUri: base64 });
                
                const newDetails = {
                    name: result.claimDetails?.name || formDetails.name,
                    policyNumber: result.claimDetails?.policyNumber || formDetails.policyNumber,
                    dateOfIncident: result.claimDetails?.dateOfIncident || formDetails.dateOfIncident,
                    description: result.claimDetails?.description || formDetails.description,
                    amount: result.claimDetails?.amountClaimed?.toString() || formDetails.amount
                };

                setFormDetails(newDetails);
                toast({
                    title: 'Success!',
                    description: 'AI has extracted details from your document.',
                    className: 'bg-accent text-accent-foreground'
                });
            } catch (error) {
                 toast({
                    variant: 'destructive',
                    title: 'Extraction Failed',
                    description: 'Could not extract details from the document.',
                });
                console.error("Document extraction error:", error)
            } finally {
                setIsLoading(false);
            }
        };
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate submission
        setTimeout(() => {
            setIsLoading(false);
            toast({
                title: 'Claim Submitted!',
                description: 'Your claim has been successfully filed. You can track it on the "Track Claim" page.',
                className: 'bg-accent text-accent-foreground'
            });
            setFormDetails({});
        }, 1500);
    };
    
    return (
        <Tabs defaultValue="chatbot" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="chatbot"><Bot className="mr-2 h-4 w-4" />Chat with AI</TabsTrigger>
                <TabsTrigger value="form"><FileText className="mr-2 h-4 w-4" />Fill Manually</TabsTrigger>
            </TabsList>
            <TabsContent value="chatbot">
                <Card>
                    <CardHeader>
                        <CardTitle>Conversational Claim Filing</CardTitle>
                        <CardDescription>Describe your incident in plain language.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="border rounded-lg h-[400px] flex flex-col">
                            <ScrollArea className="flex-1 p-4">
                                <div className="space-y-4">
                                    {chatMessages.map((message, index) => (
                                        <div key={index} className={`flex items-end gap-2 ${message.sender === 'user' ? 'justify-end' : ''}`}>
                                            {message.sender === 'bot' && <Bot className="w-6 h-6 text-primary flex-shrink-0" />}
                                            <div className={`rounded-lg px-3 py-2 max-w-sm ${message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                                <p className="text-sm">{message.text}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {isLoading && chatMessages[chatMessages.length - 1].sender === 'user' && (
                                         <div className="flex items-end gap-2">
                                            <Bot className="w-6 h-6 text-primary flex-shrink-0" />
                                            <div className="rounded-lg px-3 py-2 bg-muted flex items-center">
                                                <Loader2 className="w-4 h-4 animate-spin"/>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                            <div className="p-2 border-t">
                                <form onSubmit={handleChatSubmit} className="flex items-center gap-2">
                                    <Input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="e.g., 'My car was hit in a parking lot...'" disabled={isLoading} />
                                    <Button type="submit" size="icon" disabled={isLoading || !chatInput.trim()}>
                                        <SendHorizonal className="h-4 w-4" />
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="form">
                <form onSubmit={handleFormSubmit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Claim Details Form</CardTitle>
                            <CardDescription>Fill out the form below. Upload documents to let AI assist you.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" placeholder="John Doe" value={formDetails.name || ''} onChange={e => setFormDetails({...formDetails, name: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="policyNumber">Policy Number</Label>
                                    <Input id="policyNumber" placeholder="POL-12345" value={formDetails.policyNumber || ''} onChange={e => setFormDetails({...formDetails, policyNumber: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="dateOfIncident">Date of Incident</Label>
                                    <Input id="dateOfIncident" type="date" value={formDetails.dateOfIncident || ''} onChange={e => setFormDetails({...formDetails, dateOfIncident: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="amount">Claim Amount</Label>
                                    <Input id="amount" type="number" placeholder="1200.00" value={formDetails.amount || ''} onChange={e => setFormDetails({...formDetails, amount: e.target.value})} />
                                </div>
                             </div>
                             <div className="space-y-2">
                                <Label htmlFor="description">Description of Incident</Label>
                                <Textarea id="description" placeholder="A brief summary of what happened..." value={formDetails.description || ''} onChange={e => setFormDetails({...formDetails, description: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <Label>Supporting Documents</Label>
                                <div className="flex items-center gap-2">
                                    <Button asChild variant="outline" type="button">
                                        <label htmlFor="file-upload" className="cursor-pointer">
                                            <Upload className="mr-2 h-4 w-4" />
                                            Upload File
                                        </label>
                                    </Button>
                                    <Input id="file-upload" type="file" className="hidden" onChange={handleFileChange} disabled={isLoading} />
                                    <span className="text-sm text-muted-foreground">PDF, PNG, JPG accepted.</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Submit Claim
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </TabsContent>
        </Tabs>
    );
}
