import { QuestionInterface } from "@/components/QuestionInterface";
import { SystemArchitecture } from "@/components/SystemArchitecture";
import heroImage from "@/assets/hero-research.jpg";
import { GraduationCap, Zap, Shield, Target } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-accent/5 to-background">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 space-y-12 relative">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          {/* Question Interface */}
          <QuestionInterface />
          
          {/* System Architecture Overview */}
          <SystemArchitecture />
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Multi-layer background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-glow to-accent" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent" />
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-2xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-accent-glow/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        
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
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center border border-white/20 hover:bg-white/15 transition-all duration-300">
                <Zap className="h-8 w-8 mx-auto mb-3 text-accent-glow" />
                <h3 className="font-semibold mb-2">Multi-Source Retrieval</h3>
                <p className="text-sm text-primary-foreground/80">
                  PDF documents, GitHub repos, and web search combined
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center border border-white/20 hover:bg-white/15 transition-all duration-300">
                <Shield className="h-8 w-8 mx-auto mb-3 text-accent-glow" />
                <h3 className="font-semibold mb-2">Advanced Processing</h3>
                <p className="text-sm text-primary-foreground/80">
                  FAISS vector indexing with HuggingFace embeddings
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center border border-white/20 hover:bg-white/15 transition-all duration-300">
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

      {/* Footer */}
      <footer className="relative bg-gradient-to-br from-primary-glow via-primary to-primary/90 text-primary-foreground py-12 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <GraduationCap className="h-6 w-6" />
            <span className="font-semibold text-lg">AI Research Assistant System</span>
          </div>
          <p className="text-primary-foreground/90 text-base mb-2">
            Undergraduate Thesis Project • Langflow Pipeline Implementation
          </p>
          <p className="text-primary-foreground/70 text-sm">
            Built with React, TypeScript, and Tailwind CSS
          </p>
          
          {/* Decorative elements */}
          <div className="mt-8 flex justify-center space-x-8 opacity-60">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <div className="w-2 h-2 bg-accent-glow rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;