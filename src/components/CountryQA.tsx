'use client';

import React, { useEffect, useState, FormEvent } from 'react';

interface CountryQAProps {
  countryName: string;
}

const TEST_VARIANT_CLASS = 'enhanced-flag-animation-test';

interface QAPair {
  id: number;
  question: string;
  answer: string;
  isError?: boolean;
}

let qaIdCounter = 0;

export default function CountryQA({ countryName }: CountryQAProps) {
  const [isTestVariant, setIsTestVariant] = useState<boolean>(false);
  const [question, setQuestion] = useState<string>('');
  const [conversation, setConversation] = useState<QAPair[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (document.body.classList.contains(TEST_VARIANT_CLASS)) {
      setIsTestVariant(true);
    }
  }, []);

  const recommendedQuestions = [
    `What is the capital of ${countryName}?`,
    `Tell me three interesting facts about ${countryName}.`,
    `What is the main industry in ${countryName}?`,
    `Describe the geography of ${countryName}.`,
  ];

  const handleSubmit = async (currentQuestion: string) => {
    if (!currentQuestion.trim()) return;

    setIsLoading(true);
    const currentQaId = qaIdCounter++;
    const newQAPair: QAPair = { id: currentQaId, question: currentQuestion, answer: 'Loading...' };
    setConversation((prev) => [...prev, newQAPair]);
    setQuestion('');

    try {
      const response = await fetch('/api/ask-country-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ countryName, question: currentQuestion }),
      });

      const data = await response.json();

      setConversation((prevConvo) =>
        prevConvo.map((qa) => {
          if (qa.id === currentQaId) {
            if (response.ok && data.answer) {
              return { ...qa, answer: data.answer, isError: false };
            } else {
              return {
                ...qa,
                answer: data.error || "Sorry, I couldn't get an answer. Please try again.",
                isError: true,
              };
            }
          }
          return qa;
        }),
      );
    } catch (error) {
      console.error('Error asking AI:', error);
      setConversation((prevConvo) =>
        prevConvo.map((qa) =>
          qa.id === currentQaId
            ? { ...qa, answer: 'An error occurred while fetching the answer.', isError: true }
            : qa,
        ),
      );
    }
    setIsLoading(false);
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(question);
  };

  if (!isTestVariant) {
    return null;
  }

  return (
    <div className="mt-8 p-6 bg-surface-elevated rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold text-primary mb-4">Ask AI About {countryName}</h3>

      {conversation.length > 0 && (
        <div className="mb-4 space-y-4 max-h-96 overflow-y-auto pr-2">
          {conversation.map((qa) => (
            <div key={qa.id} className="text-sm">
              <p className="font-semibold text-text mb-1">
                <span className="text-accent">You:</span> {qa.question}
              </p>
              <p
                className={`whitespace-pre-line ${
                  qa.isError ? 'text-red-500' : 'text-text-secondary'
                }`}
              >
                <span className={`font-semibold ${qa.isError ? 'text-red-600' : 'text-primary'}`}>
                  AI:
                </span>{' '}
                {qa.answer}
              </p>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row gap-2 items-start">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={`Ask something about ${countryName}...`}
          className="flex-grow p-3 border border-gray-300 rounded-md shadow-sm focus:ring-accent focus:border-accent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          aria-label="Ask a question about the country"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !question.trim()}
          className="px-6 py-3 bg-accent text-white rounded-md shadow-sm hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-50 disabled:opacity-50 transition duration-150 ease-in-out w-full sm:w-auto"
        >
          {isLoading ? 'Asking...' : 'Ask AI'}
        </button>
      </form>

      {conversation.length === 0 && (
        <div className="mt-6">
          <h4 className="text-md font-semibold text-primary mb-2">
            Or try a recommended question:
          </h4>
          <div className="flex flex-wrap gap-2">
            {recommendedQuestions.map((recQuestion, index) => (
              <button
                key={index}
                onClick={() => handleSubmit(recQuestion)}
                disabled={isLoading}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 disabled:opacity-70 text-sm transition duration-150 ease-in-out dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
              >
                {recQuestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
