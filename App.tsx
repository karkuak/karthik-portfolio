
import React, { useState, useCallback } from 'react';
import type { UseCase } from './types';
import { generateTestCases } from './services/geminiService';
import Header from './components/Header';
import InputSection from './components/InputSection';
import ResultsDisplay from './components/ResultsDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import Welcome from './components/Welcome';
import ErrorDisplay from './components/ErrorDisplay';

const App: React.FC = () => {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [useCases, setUseCases] = useState<UseCase[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!htmlContent.trim()) {
      setError('Please paste the HTML content of a webpage to begin.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setUseCases(null);

    try {
      const result = await generateTestCases(htmlContent);
      setUseCases(result);
    } catch (err) {
      console.error(err);
      setError('Failed to generate test cases. The AI model might be overloaded or an error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [htmlContent]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <InputSection
          htmlContent={htmlContent}
          onHtmlContentChange={setHtmlContent}
          onGenerate={handleGenerate}
          isLoading={isLoading}
        />

        {error && <ErrorDisplay message={error} />}

        <div className="mt-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-12 bg-slate-800/50 rounded-lg">
              <LoadingSpinner />
              <p className="mt-4 text-lg text-slate-400">Analyzing HTML and building test scenarios...</p>
            </div>
          ) : useCases ? (
            <ResultsDisplay useCases={useCases} />
          ) : (
            !error && <Welcome />
          )}
        </div>
      </main>
      <footer className="text-center p-4 text-slate-500 text-sm">
        <p>Powered by Gemini API</p>
      </footer>
    </div>
  );
};

export default App;
