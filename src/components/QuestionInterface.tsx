import { useState } from 'react';
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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Question Input */}
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Search className="h-5 w-5" />
            Ask Your Question
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              placeholder="Enter your question about software architecture, computer architecture, or any technical topic..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="min-h-[120px] resize-none"
            />
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
              disabled={isLoading || isIngesting}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Ask Question
                </>
              )}
            </Button>
            
            <Tabs defaultValue="pdf" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="pdf" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  PDF Document
                </TabsTrigger>
                <TabsTrigger value="github" className="flex items-center gap-2">
                  <Github className="h-4 w-4" />
                  GitHub Repository
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="pdf" className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload a PDF document for analysis
                  </p>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="pdf-upload"
                  />
                  <label htmlFor="pdf-upload">
                    <Button variant="outline" type="button" className="cursor-pointer">
                      Choose PDF File
                    </Button>
                  </label>
                  {pdfFile && (
                    <p className="text-sm text-primary mt-2">
                      Selected: {pdfFile.name}
                    </p>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="github" className="space-y-4">
                <Input
                  placeholder="https://github.com/username/repository"
                  value={githubRepo}
                  onChange={(e) => setGithubRepo(e.target.value)}
                  className="w-full"
                />
              </TabsContent>
            </Tabs>
            
            <Button 
              type="button"
              variant="outline"
              onClick={handleIngestData}
              className="w-full"
              disabled={isIngesting || isLoading}
            >
              {isIngesting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Ingesting Data...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4 mr-2" />
                  Ingest Data
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

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