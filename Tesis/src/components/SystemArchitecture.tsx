import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, Brain, Database, FileText, Github, Merge, Search } from "lucide-react";

export const SystemArchitecture = () => {
  return (
    <Card className="bg-gradient-subtle border-0 shadow-elegant">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-primary flex items-center gap-2">
          <Brain className="h-5 w-5" />
          System Architecture
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Data Ingestion */}
          <div className="space-y-4">
            <h3 className="font-medium text-primary">Data Ingestion</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                <FileText className="h-4 w-4 text-primary" />
                <span className="text-sm">PDF Loader</span>
              </div>
              <ArrowDown className="h-4 w-4 text-muted-foreground mx-auto" />
              <div className="flex items-center gap-3 p-3 bg-accent/10 rounded-lg">
                <Database className="h-4 w-4 text-accent" />
                <span className="text-sm">FAISS-PDF Index</span>
              </div>
            </div>
            
            <div className="space-y-3 mt-6">
              <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                <Github className="h-4 w-4 text-primary" />
                <span className="text-sm">GitHub Loader</span>
              </div>
              <ArrowDown className="h-4 w-4 text-muted-foreground mx-auto" />
              <div className="flex items-center gap-3 p-3 bg-accent/10 rounded-lg">
                <Database className="h-4 w-4 text-accent" />
                <span className="text-sm">FAISS-GitHub Index</span>
              </div>
            </div>
          </div>

          {/* Retrieval */}
          <div className="space-y-4">
            <h3 className="font-medium text-primary">Retrieval</h3>
            <div className="space-y-3">
              <div className="p-3 bg-primary/5 rounded-lg text-center">
                <span className="text-sm font-medium">User Question</span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-center gap-2 p-2 bg-secondary rounded text-xs">
                  <Database className="h-3 w-3" />
                  PDF Retriever
                </div>
                <div className="flex items-center gap-2 p-2 bg-secondary rounded text-xs">
                  <Database className="h-3 w-3" />
                  GitHub Retriever
                </div>
                <div className="flex items-center gap-2 p-2 bg-secondary rounded text-xs">
                  <Search className="h-3 w-3" />
                  Web Search
                </div>
              </div>
              <ArrowDown className="h-4 w-4 text-muted-foreground mx-auto" />
              <div className="flex items-center gap-3 p-3 bg-accent/10 rounded-lg">
                <Merge className="h-4 w-4 text-accent" />
                <span className="text-sm">Merge & Parse</span>
              </div>
            </div>
          </div>

          {/* Generation */}
          <div className="space-y-4">
            <h3 className="font-medium text-primary">Generation</h3>
            <div className="space-y-3">
              <div className="p-3 bg-secondary rounded-lg">
                <span className="text-sm">Context Building</span>
              </div>
              <ArrowDown className="h-4 w-4 text-muted-foreground mx-auto" />
              <div className="p-3 bg-gradient-accent rounded-lg text-accent-foreground">
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  <span className="text-sm font-medium">OpenAI LLM</span>
                </div>
              </div>
              <ArrowDown className="h-4 w-4 text-muted-foreground mx-auto" />
              <div className="p-3 bg-primary text-primary-foreground rounded-lg text-center">
                <span className="text-sm font-medium">Final Answer</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};