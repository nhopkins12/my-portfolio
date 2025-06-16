import React, { useState, useRef } from 'react';

const WordChainGame = () => {
  const [startWord, setStartWord] = useState('START');
  const [targetWord, setTargetWord] = useState('END');
  const [wordChain, setWordChain] = useState(['START']);
  const [currentInput, setCurrentInput] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [showFullChain, setShowFullChain] = useState(false);
  const [invalidWord, setInvalidWord] = useState(false);

  // Find overlap between two words
  const findOverlap = (word1, word2) => {
    const maxOverlap = Math.min(word1.length, word2.length);
    for (let i = maxOverlap; i > 0; i--) {
      if (word1.slice(-i).toLowerCase() === word2.slice(0, i).toLowerCase()) {
        return i;
      }
    }
    return 0;
  };

  // Build the continuous word from chain
  const buildContinuousWord = () => {
    if (wordChain.length === 1) return wordChain[0];
    
    let result = wordChain[0];
    const overlaps = [];
    
    for (let i = 1; i < wordChain.length; i++) {
      const overlap = findOverlap(wordChain[i - 1], wordChain[i]);
      overlaps.push({ 
        start: result.length - overlap, 
        end: result.length,
        wordIndex: i 
      });
      result += wordChain[i].slice(overlap);
    }
    
    return { word: result, overlaps };
  };

  const handleAddWord = () => {
    if (!currentInput.trim()) return;
    
    const newWord = currentInput.toUpperCase();
    const lastWord = wordChain[wordChain.length - 1];
    const overlap = findOverlap(lastWord, newWord);
    
    if (overlap === 0) {
      setInvalidWord(true);
      setTimeout(() => setInvalidWord(false), 500);
      return;
    }
    
    const newChain = [...wordChain, newWord];
    setWordChain(newChain);
    setCurrentInput('');
    
    if (newWord === targetWord) {
      setIsComplete(true);
      setTimeout(() => setShowFullChain(true), 600);
    }
  };

  const resetGame = () => {
    setWordChain([startWord]);
    setCurrentInput('');
    setIsComplete(false);
    setShowFullChain(false);
    setInvalidWord(false);
  };

  const continuousWord = buildContinuousWord();
  const displayWord = typeof continuousWord === 'string' ? continuousWord : continuousWord.word;
  const overlaps = typeof continuousWord === 'object' ? continuousWord.overlaps : [];

  return (
    <div className="min-h-screen bg-white font-['Helvetica_Neue',_sans-serif]">
      <div className="max-w-3xl mx-auto px-6 py-12">
        
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-4xl font-bold text-black mb-4 tracking-tight">
            Word Chain
          </h1>
          <div className="text-lg text-gray-600">
            Connect <span className="font-semibold text-black">{startWord}</span> to{' '}
            <span className="font-semibold text-black">{targetWord}</span>
          </div>
        </header>

        {/* Game Board */}
        <div className="mb-12">
          <div className="relative h-24 flex items-center justify-center overflow-hidden">
            
            {/* Main Word Display */}
            <div 
              className={`
                transition-all duration-700 ease-out flex items-center
                ${showFullChain ? 'transform scale-75 -translate-x-32' : ''}
              `}
            >
              {/* Start Word Box */}
              {wordChain.length === 1 && (
                <div className="bg-gray-100 rounded-lg px-4 py-3 border border-gray-300">
                  <div className="text-2xl font-bold text-gray-700 tracking-wide">
                    {startWord}
                  </div>
                </div>
              )}
              
              {/* Continuous Word */}
              {wordChain.length > 1 && (
                <div className="bg-white rounded-lg border-2 border-gray-300 px-4 py-3 shadow-sm">
                  <div className="text-2xl font-bold text-black tracking-wide relative">
                    {displayWord.split('').map((letter, index) => {
                      // Check if this letter is part of an overlap
                      const isInOverlap = overlaps.some(overlap => 
                        index >= overlap.start && index < overlap.end
                      );
                      
                      return (
                        <span key={index} className="relative">
                          {isInOverlap && (
                            <div className="absolute inset-0 bg-green-500 rounded-md -m-0.5 z-0"></div>
                          )}
                          <span className={`relative z-10 ${isInOverlap ? 'text-white' : 'text-black'}`}>
                            {letter}
                          </span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Target Word */}
            {!isComplete && (
              <div 
                className={`
                  absolute right-0 transition-all duration-700 ease-out
                  ${showFullChain ? 'opacity-0 translate-x-20' : 'opacity-50'}
                `}
              >
                <div className="bg-blue-50 rounded-lg px-4 py-3 border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600 tracking-wide">
                    {targetWord}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Section */}
        {!isComplete && (
          <div className="text-center mb-12">
            <div className="inline-flex gap-3 items-center">
              <input
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value.toUpperCase())}
                onKeyPress={(e) => e.key === 'Enter' && handleAddWord()}
                placeholder="Type your word"
                className={`
                  w-48 px-4 py-3 text-lg font-medium border-2 rounded-md text-center
                  focus:outline-none focus:border-black transition-all duration-200
                  ${invalidWord ? 'border-red-400 bg-red-50 animate-pulse' : 'border-gray-300 bg-white'}
                `}
                maxLength={12}
              />
              <button
                onClick={handleAddWord}
                className="px-6 py-3 bg-black text-white font-semibold rounded-md hover:bg-gray-800 transition-colors duration-200"
              >
                Enter
              </button>
            </div>
          </div>
        )}

        {/* Success Message */}
        {isComplete && (
          <div className="text-center mb-12">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-md mx-auto">
              <div className="text-3xl font-bold text-green-800 mb-2">
                Solved!
              </div>
              <div className="text-green-700 mb-4">
                You connected the words in {wordChain.length - 1} step{wordChain.length !== 2 ? 's' : ''}
              </div>
              <button
                onClick={resetGame}
                className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors"
              >
                Play Again
              </button>
            </div>
          </div>
        )}

        {/* Game Setup */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex justify-center gap-8 mb-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Start Word
              </label>
              <input
                type="text"
                value={startWord}
                onChange={(e) => {
                  const newStart = e.target.value.toUpperCase();
                  setStartWord(newStart);
                  setWordChain([newStart]);
                  setIsComplete(false);
                  setShowFullChain(false);
                }}
                className="w-24 px-3 py-2 border border-gray-300 rounded text-center font-semibold focus:outline-none focus:border-black"
                maxLength={8}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Target Word
              </label>
              <input
                type="text"
                value={targetWord}
                onChange={(e) => setTargetWord(e.target.value.toUpperCase())}
                className="w-24 px-3 py-2 border border-gray-300 rounded text-center font-semibold focus:outline-none focus:border-black"
                maxLength={8}
              />
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <div className="text-sm text-gray-600 leading-relaxed">
              <strong>How to play:</strong> Add words that share letters with the end of the previous word. 
              Overlapping letters will be highlighted in green.
              <br />
              <span className="text-gray-500">
                Example: WORD →ORDEN → DENSE → ENSUE
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordChainGame;