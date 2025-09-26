import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Database, ExternalLink, FileText, Github, Loader2, Search, Upload } from "lucide-react";
import { useRef, useState } from 'react';
const LANGFLOW_API_KEY = import.meta.env.VITE_LANGFLOW_API_KEY;
const LANGFLOW_API_ENDPOINT = import.meta.env.VITE_LANGFLOW_RETRIEVAL_URL;

interface Source {
  type: 'pdf' | 'github' | 'web';
  title: string;
  reference: string;
  score?: number;
  content: string;
}

export const QuestionInterface = () => {
  const [question, setQuestion] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [githubRepo, setGithubRepo] = useState('');
  const [githubBranch, setGithubBranch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPdfIngesting, setIsPdfIngesting] = useState(false);
  const [isGithubIngesting, setIsGithubIngesting] = useState(false);
  const [answer, setAnswer] = useState('');
  const [sources, setSources] = useState<Source[]>([]);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      toast({
        title: "PDF uploaded",
        description: `${file.name} ready for processing`,
      });
    } else {
      toast({
        title: "Invalid file",
        description: "Please upload a PDF file",
        variant: "destructive",
      });
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleIngestPdf = async () => {
    if (!pdfFile) {
      toast({
        title: "No PDF selected",
        description: "Please upload a PDF file first",
        variant: "destructive",
      });
      return;
    }

    setIsPdfIngesting(true);

    try {
      const formData = new FormData();
      formData.append("file", pdfFile);

      // puerto debe coincidir con backend (3001 en server.js)
      const response = await fetch("http://localhost:3001/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const result = await response.json();

      toast({
        title: "PDF uploaded successfully",
        description: `${result.file.filename} saved in server.`,
      });
    } catch (error: any) {
      console.error("Error uploading PDF:", error);
      toast({
        title: "Error uploading PDF",
        description: error.message || "Could not upload the file.",
        variant: "destructive",
      });
    } finally {
      setIsPdfIngesting(false);
    }
  };


  const handleIngestGithub = async () => {
    if (!githubRepo.trim()) {
      toast({
        title: "No repository URL provided",
        description: "Please enter a GitHub repository URL",
        variant: "destructive",
      });
      return;
    }

    setIsGithubIngesting(true);

    try {
      const response = await fetch(import.meta.env.VITE_LANGFLOW_GITHUB_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_LANGFLOW_API_KEY}`,
        },
        body: JSON.stringify({
          input_value: "",
          input_type: "chat",
          output_type: "chat",
          tweaks: {
             "GitLoaderComponent-V0bQK": {
              repo_source: "Remote",
              clone_url: githubRepo,
              branch: githubBranch || "main",
            },
          },
        }),
      });

      if (!response.ok) throw new Error("Langflow ingestion failed");

      const data = await response.json();
      console.log("Langflow GitHub ingestion response:", data);

      toast({
        title: "Repository ingested successfully",
        description: `Repository from branch "${githubBranch || "main"}" is now ready for querying`,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error ingesting repository",
        description: String(error),
        variant: "destructive",
      });
    } finally {
      setIsGithubIngesting(false);
    }
  };



  const handleIngestAllSources = async () => {
    if (!pdfFile && !githubRepo.trim()) {
      toast({
        title: "No data sources selected",
        description: "Please upload a PDF or provide a GitHub repository URL",
        variant: "destructive",
      });
      return;
    }
    
    const promises = [];
    
    if (pdfFile) {
      promises.push(handleIngestPdf());
    }
    
    if (githubRepo.trim()) {
      promises.push(handleIngestGithub());
    }
    
    await Promise.all(promises);
    
    toast({
      title: "All data sources ingested",
      description: "Your documents are now ready for querying",
    });
  };

  const fetchLangflowAnswer = async (userQuestion: string) => {
    const apiKey = LANGFLOW_API_KEY;
    const apiEndpoint = LANGFLOW_API_ENDPOINT;
    const payload = { 
      output_type: "chat", 
      input_type: "chat", 
      input_value: userQuestion, 
      session_id: "user_1" 
    }; 
    const options = { 
      method: "POST", 
      headers: { "Content-Type": "application/json", "x-api-key": apiKey }, 
      body: JSON.stringify(payload) 
    }; 
    const response = await fetch(apiEndpoint, options);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    } 
    const data = await response.json(); // ✅ Ajusta esta ruta si la estructura cambia
    return data.outputs?.[0]?.outputs?.[0]?.artifacts?.message || "";
  }; 
  
  const parseLLMResponse = (raw: string) => { 
    const [answerPart, traceabilityPart] = raw.split("**Source Traceability:**");
    const answer = answerPart
      .replace("**Answer:**", "")
      .replace(/^[-\s\n]+/, "")
      .trim(); 
    const sources: Source[] = [];
    if (traceabilityPart) {
      const lines = traceabilityPart.trim().split("\n");
      lines.forEach((line) => {
        const match = line.match(/-\s*(PDF|GitHub|Web):\s*(\d+)%/i);
        if (match) {
          sources.push({
            type: match[1].toLowerCase() as "pdf" | "github" | "web",
            title: `${match[1]} contribution`,
            reference: "",
            score: parseInt(match[2], 10) / 100,
            content: ""
          });
        } 
      }); 
    } 
    return { answer, sources }; 
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) {
      toast({ 
        title: "Question required", 
        description: "Please enter a question to proceed", 
        variant: "destructive", 
      });
      return; 
    } 
    setIsLoading(true); 
    try {
      const rawResponse = await fetchLangflowAnswer(question);
      const { answer, sources } = parseLLMResponse(rawResponse);
      setAnswer(answer);
      setSources(sources);
    } catch (err) {
      console.error("Langflow error:", err);
      toast({ 
        title: "Error", 
        description: "Could not retrieve a valid response from Langflow", 
        variant: "destructive", 
      }); 
    } 
    finally { 
      setIsLoading(false); 
    } 
  };
  
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Question Input */}
      <Card className="shadow-elegant bg-gradient-subtle">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-primary text-xl">
            <Search className="h-6 w-6" />
            Ask Your Question
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Textarea
              placeholder="Enter your question about software architecture, computer architecture, or any technical topic..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="min-h-[120px] resize-none bg-background/50 border-primary/20 focus:border-primary/40"
            />
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300 h-12 text-base font-medium"
              disabled={isLoading || isPdfIngesting || isGithubIngesting}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Processing Your Question...
                </>
              ) : (
                <>
                  <Search className="h-5 w-5 mr-2" />
                  Ask Question
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Data Sources */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-primary text-center">Choose Your Data Sources</h2>
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* PDF Upload */}
          <Card className="shadow-elegant bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20 hover:border-accent/40 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-accent">
                <FileText className="h-5 w-5" />
                PDF Document
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div 
                className="border-2 border-dashed border-accent/30 rounded-lg p-8 text-center hover:border-accent/60 transition-colors cursor-pointer bg-background/30"
                onClick={triggerFileUpload}
              >
                <Upload className="h-10 w-10 mx-auto mb-3 text-accent" />
                <p className="text-sm text-muted-foreground mb-3">
                  Click to upload a PDF document for analysis
                </p>
                <p className="text-xs text-muted-foreground/80">
                  Supports research papers, documentation, reports
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                {pdfFile && (
                  <div className="mt-4 p-3 bg-accent/10 rounded-md">
                    <p className="text-sm text-accent font-medium">
                      ✓ {pdfFile.name}
                    </p>
                  </div>
                )}
              </div>
              
              {pdfFile && (
                <Button 
                  onClick={handleIngestPdf}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                  disabled={isPdfIngesting || isLoading}
                >
                  {isPdfIngesting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Ingesting PDF...
                    </>
                  ) : (
                    <>
                      <Database className="h-4 w-4 mr-2" />
                      Ingest PDF
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* GitHub Repository */}
          <Card className="shadow-elegant bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover:border-primary/40 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Github className="h-5 w-5" />
                GitHub Repository
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Input
                  placeholder="https://github.com/username/repository"
                  value={githubRepo}
                  onChange={(e) => setGithubRepo(e.target.value)}
                  className="w-full bg-background/50 border-primary/20 focus:border-primary/40"
                />
                <Input
                  placeholder="Branch name (e.g., main, dev, feature-branch)"
                  value={githubBranch}
                  onChange={(e) => setGithubBranch(e.target.value)}
                  className="w-full bg-background/50 border-primary/20 focus:border-primary/40"
                />
                <p className="text-xs text-muted-foreground">
                  Enter the URL of a public GitHub repository and specify the branch to analyze its codebase, documentation, and README files
                </p>
                {githubRepo && (
                  <div className="p-3 bg-primary/10 rounded-md">
                    <p className="text-sm text-primary font-medium">
                      ✓ Repository: {githubRepo}
                    </p>
                    <p className="text-xs text-primary/80">
                      Branch: {githubBranch}
                    </p>
                  </div>
                )}
              </div>
              
              {githubRepo && (
                <Button 
                  onClick={handleIngestGithub}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={isGithubIngesting || isLoading}
                >
                  {isGithubIngesting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Ingesting Repository...
                    </>
                  ) : (
                    <>
                      <Database className="h-4 w-4 mr-2" />
                      Ingest Repository
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Results */}
      {(answer || isLoading) && (
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Database className="h-5 w-5" />
              Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center space-y-4">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                  <p className="text-muted-foreground">
                    Processing your query through the Langflow pipeline...
                  </p>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>→ Retrieving from PDF documents</p>
                    <p>→ Searching GitHub repositories</p>
                    <p>→ Gathering web sources</p>
                    <p>→ Generating comprehensive answer</p>
        </div>
        
        {/* Central Ingest All Button */}
        {(pdfFile || githubRepo.trim()) && (
          <div className="flex justify-center pt-6">
            <Button 
              onClick={handleIngestAllSources}
              variant="outline"
              className="px-8 py-3 h-12 text-base border-2 border-primary/30 hover:border-primary hover:bg-primary/10 transition-all duration-300"
              disabled={isPdfIngesting || isGithubIngesting || isLoading}
            >
              {(isPdfIngesting || isGithubIngesting) ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Ingesting Data Sources...
                </>
              ) : (
                <>
                  <Database className="h-5 w-5 mr-2" />
                  Ingest All Data Sources
                </>
              )}
            </Button>
          </div>
        )}
      </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="prose prose-sm max-w-none">
                  <div className="bg-gradient-subtle p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-primary mb-3">Answer</h3>
                    <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                      {answer}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-4">Sources</h3>
                  <div className="grid gap-4">
                    {sources.map((source, index) => (
                      <Card key={index} className="border-l-4 border-l-accent">
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {source.type === 'pdf' && <FileText className="h-4 w-4 text-primary" />}
                              {source.type === 'github' && <Github className="h-4 w-4 text-primary" />}
                              {source.type === 'web' && <ExternalLink className="h-4 w-4 text-primary" />}
                              <span className="font-medium">{source.title}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {source.type.toUpperCase()}
                              </Badge>
                              {source.score && (
                                <Badge variant="outline" className="text-xs">
                                  {Math.round(source.score * 100)}% match
                                </Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {source.reference}
                          </p>
                          <p className="text-sm">
                            {source.content}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};