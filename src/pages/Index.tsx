import { QuestionInterface } from "@/components/QuestionInterface";
import { SystemArchitecture } from "@/components/SystemArchitecture";
import heroImage from "@/assets/hero-research.jpg";
import { GraduationCap, Zap, Shield, Target } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-90" />
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="text-center text-primary-foreground space-y-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <GraduationCap className="h-8 w-8" />
              <span className="text-sm font-medium uppercase tracking-wider">
                Undergraduate Thesis Project
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              AI-Powered Research
              <br />
              Assistant System
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto">
              Advanced question-answering system combining document analysis, 
              GitHub repositories, and web search using Langflow pipeline
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
              <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-lg p-6 text-center">
                <Zap className="h-8 w-8 mx-auto mb-3 text-accent-glow" />
                <h3 className="font-semibold mb-2">Multi-Source Retrieval</h3>
                <p className="text-sm text-primary-foreground/80">
                  PDF documents, GitHub repos, and web search combined
                </p>
              </div>
              <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-lg p-6 text-center">
                <Shield className="h-8 w-8 mx-auto mb-3 text-accent-glow" />
                <h3 className="font-semibold mb-2">Advanced Processing</h3>
                <p className="text-sm text-primary-foreground/80">
                  FAISS vector indexing with HuggingFace embeddings
                </p>
              </div>
              <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-lg p-6 text-center">
                <Target className="h-8 w-8 mx-auto mb-3 text-accent-glow" />
                <h3 className="font-semibold mb-2">Intelligent Generation</h3>
                <p className="text-sm text-primary-foreground/80">
                  OpenAI LLM with context-aware response generation
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 space-y-12">
        {/* System Architecture Overview */}
        <SystemArchitecture />
        
        {/* Question Interface */}
        <QuestionInterface />
      </div>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <GraduationCap className="h-5 w-5" />
            <span className="font-medium">AI Research Assistant System</span>
          </div>
          <p className="text-primary-foreground/80 text-sm">
            Undergraduate Thesis Project • Langflow Pipeline Implementation
          </p>
          <p className="text-primary-foreground/60 text-xs mt-2">
            Built with React, TypeScript, and Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;