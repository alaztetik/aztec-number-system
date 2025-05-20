"use client";

import Head from 'next/head';
import React, { useState } from 'react';


// Define the Aztec symbols and their values
const aztecSymbols: { value: number; imageName: string; altText: string }[] = [
  { value: 8000, imageName: 'image_eight_thousand', altText: '8000' },
  { value: 400, imageName: 'image_four_hundred', altText: '400' },
  { value: 100, imageName: 'image_one_hundred', altText: '100' },
  { value: 20, imageName: 'image_twenty', altText: '20' },
  { value: 1, imageName: 'image_one', altText: '1' },
];

// Function to convert a single decimal number to an array of Aztec image names
const decimalToAztecImages = (num: number): string[] => {
  if (num === 0) return ['0']; // Or handle 0 as you see fit (e.g., empty array or specific text)
  if (num < 0) return ['(Negative numbers not supported)']; // Aztec system didn't represent negative numbers

  let remaining = num;
  const images: string[] = [];

  for (const symbol of aztecSymbols) {
    while (remaining >= symbol.value) {
      images.push(symbol.imageName);
      remaining -= symbol.value;
    }
  }
  return images;
};

// Function to process the input text and convert numbers
const transformTextToAztec = (text: string): (string | React.ReactElement)[] => {
  const parts = text.split(/(\b\d+\b)/g); // Split by numbers, keeping numbers as separate parts
  
  return parts.map((part, index) => {
    if (/\b\d+\b/.test(part)) { // If the part is a number
      const num = parseInt(part, 10);
      const aztecImageNames = decimalToAztecImages(num);
      
      if (aztecImageNames.length === 1 && (aztecImageNames[0] === '0' || aztecImageNames[0].startsWith('('))) {
        // Handle 0 or unsupported cases as text
        return <span key={`num-${index}`}>{aztecImageNames[0]}</span>;
      }

      return (
        <span key={`num-${index}`} className="inline-flex flex-wrap items-center align-bottom mx-1">
          {aztecImageNames.map((imageName, i) => (
            <img
              key={i}
              src={`/${imageName}.png`} // Assuming .png, adjust if using other formats
              alt={aztecSymbols.find(s => s.imageName === imageName)?.altText || 'Aztec symbol'}
              className="h-6 w-auto inline-block mx-0.5" // Adjust styling as needed
            />
          ))}
        </span>
      );
    }
    return <span key={`text-${index}`}>{part}</span>; // Keep non-number parts as text
  });
};

export default function HomePage() {
  const [inputText, setInputText] = useState<string>('');
  const [outputTextElements, setOutputTextElements] = useState<(string | React.ReactElement)[]>([]);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(event.target.value);
  };

  const handleConvertClick = () => {
    const transformedElements = transformTextToAztec(inputText);
    setOutputTextElements(transformedElements);
  };

  return (
    <>
      <Head>
        <title>Decimal to Aztec Converter</title>
        <meta name="description" content="Convert decimal numbers in text to Aztec numerals" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
          <h1 className="text-3xl font-bold text-center text-teal-700 mb-6">
            Decimal to Aztec Number Converter
          </h1>

          <div className="mb-6">
            <label htmlFor="inputText" className="block text-sm font-medium text-gray-700 mb-1">
              Enter your text with numbers:
            </label>
            <textarea
              id="inputText"
              value={inputText}
              onChange={handleInputChange}
              rows={5}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              placeholder="For example: The price is 123 and we have 20 items."
            />
          </div>

          <button
            onClick={handleConvertClick}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition duration-150 ease-in-out"
          >
            Convert to Aztec Numerals
          </button>

          {outputTextElements.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Transformed Text:</h2>
              <p className="bg-gray-50 p-4 rounded-md text-gray-700 leading-relaxed whitespace-pre-wrap">
                {outputTextElements.map((element, index) => (
                  <React.Fragment key={index}>{element}</React.Fragment>
                ))}
              </p>
            </div>
          )}
        </div>
        <footer className="text-center text-gray-500 mt-8 text-sm">
            <p>Aztec numeral images based on standard representations.</p>
        </footer>
      </main>
    </>
  );
}