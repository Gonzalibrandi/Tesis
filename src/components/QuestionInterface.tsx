import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Search, Upload, Github, FileText, Loader2, ExternalLink, Database } from "lucide-react";

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
  const [isLoading, setIsLoading] = useState(false);
  const [isIngesting, setIsIngesting] = useState(false);
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

  const simulateQuery = async () => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock response
    const mockAnswer = `Based on the provided documents and external sources, here's a comprehensive answer to your question:

Software architecture refers to the fundamental structures of a software system and the discipline of creating such structures. It encompasses the system's components, their relationships, and the principles governing their design and evolution.

Key architectural patterns include:
- Layered Architecture: Organizes code into horizontal layers
- Microservices: Decomposes applications into small, independent services
- Event-Driven Architecture: Uses events to trigger and communicate between services
- Clean Architecture: Emphasizes dependency inversion and separation of concerns

The choice of architecture depends on factors like scalability requirements, team structure, and system complexity.`;

    const mockSources: Source[] = [
      {
        type: 'pdf',
        title: 'Software Architecture in Practice',
        reference: 'Chapter 2, Page 45',
        score: 0.94,
        content: 'Architecture is the set of significant decisions about the organization of software systems...'
      },
      {
        type: 'github',
        title: 'Clean Architecture Examples',
        reference: 'src/architecture/README.md',
        score: 0.87,
        content: 'This repository demonstrates clean architecture principles in practice...'
      },
      {
        type: 'web',
        title: 'Martin Fowler - Software Architecture Guide',
        reference: 'martinfowler.com',
        score: 0.82,
        content: 'Software architecture is about making fundamental structural choices...'
      }
    ];

    setAnswer(mockAnswer);
    setSources(mockSources);
    setIsLoading(false);
  };

  const handleIngestData = async () => {
    if (!pdfFile && !githubRepo.trim()) {
      toast({
        title: "Data source required",
        description: "Please upload a PDF or provide a GitHub repository URL",
        variant: "destructive",
      });
      return;
    }
    
    setIsIngesting(true);
    
    // Simulate ingestion process
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    toast({
      title: "Data ingested successfully",
      description: "Your documents are now ready for querying",
    });
    
    setIsIngesting(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) {
      toast({
        title: "Question required",
        description: "Please enter a question to proceed",
        variant: "destructive",
      });
      return;
    }
    simulateQuery();
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
              disabled={isLoading || isIngesting}
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
                <p className="text-xs text-muted-foreground">
                  Enter the URL of a public GitHub repository to analyze its codebase, documentation, and README files
                </p>
                {githubRepo && (
                  <div className="p-3 bg-primary/10 rounded-md">
                    <p className="text-sm text-primary font-medium">
                      ✓ Repository URL added
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ingest Data Button */}
        <div className="flex justify-center pt-4">
          <Button 
            type="button"
            variant="outline"
            onClick={handleIngestData}
            className="px-8 py-3 h-12 text-base border-2 border-primary/30 hover:border-primary hover:bg-primary/10 transition-all duration-300"
            disabled={isIngesting || isLoading}
          >
            {isIngesting ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Ingesting Data Sources...
              </>
            ) : (
              <>
                <Database className="h-5 w-5 mr-2" />
                Ingest Data Sources
              </>
            )}
          </Button>
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