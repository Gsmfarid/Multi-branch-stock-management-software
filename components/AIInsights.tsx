
import React, { useState, useEffect } from 'react';
import { getBusinessAdvice } from '../services/geminiService';

interface Props {
  data: any;
}

const AIInsights: React.FC<Props> = ({ data }) => {
  const [advice, setAdvice] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const fetchAdvice = async () => {
    setLoading(true);
    const result = await getBusinessAdvice(data);
    setAdvice(result || '');
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-700 to-indigo-900 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
            <i className="fas fa-brain text-9xl"></i>
        </div>
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">Gemini Business Intelligence</h2>
          <p className="text-indigo-100 mb-6 opacity-80 leading-relaxed">
            Generate customized business growth strategies, inventory optimization tips, and branch performance analysis using cutting-edge AI.
          </p>
          <button 
            onClick={fetchAdvice}
            disabled={loading}
            className="bg-white text-indigo-900 px-8 py-3 rounded-2xl font-bold hover:bg-indigo-50 transition-all flex items-center disabled:opacity-50"
          >
            {loading ? (
              <><i className="fas fa-circle-notch fa-spin mr-3"></i> Analyzing Data...</>
            ) : (
              <><i className="fas fa-sparkles mr-3"></i> Generate Insights</>
            )}
          </button>
        </div>
      </div>

      {advice && (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-indigo-50 animate-fadeIn">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
               <i className="fas fa-robot"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-800">Consultant Recommendations</h3>
          </div>
          <div className="prose prose-indigo max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
            {advice}
          </div>
        </div>
      )}

      {!advice && !loading && (
        <div className="text-center p-12 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl">
           <i className="fas fa-lightbulb text-4xl text-gray-300 mb-4 block"></i>
           <p className="text-gray-500 italic">Click the button above to analyze your business performance.</p>
        </div>
      )}
    </div>
  );
};

export default AIInsights;
