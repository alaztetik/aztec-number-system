// src/app/page.tsx
"use client";

import { useState, useRef } from "react";

interface AztecSymbolDef {
  value: number;
  imageName: string;
  altText: string;
}

// Define the Aztec symbols and their values, from largest to smallest
// Based on user's revised list.
const AZTEC_SYMBOLS_DEFINITIONS: AztecSymbolDef[] = [
  // NB: User specified 'eight_hundred.png' for 8000. Using as specified.
  { value: 8000, imageName: "eight_hundred.png", altText: "Aztec 8000 Symbol" },
  { value: 400, imageName: "four_hundred.png", altText: "Aztec 400 Symbol" },
  { value: 300, imageName: "three_hundred.png", altText: "Aztec 300 Symbol" },
  { value: 200, imageName: "two_hundred.png", altText: "Aztec 200 Symbol" },
  { value: 100, imageName: "hundred.png", altText: "Aztec 100 Symbol" },
  { value: 20, imageName: "twenty.png", altText: "Aztec 20 Symbol" },
  { value: 10, imageName: "ten.png", altText: "Aztec 10 Symbol" },
];

const UNIT_DOT_DEFINITION = {
  imageName: "one.png", // Image for value 1 (dot)
  altText: "Aztec 1 Symbol (Dot)",
};

function decimalToAztecHtml(originalNumber: number): string {
  if (isNaN(originalNumber)) return "";
  if (originalNumber === 0) return "0";
  if (originalNumber < 0)
    return `-${decimalToAztecHtml(Math.abs(originalNumber))}`;

  let currentNum = originalNumber;
  const htmlChunks: string[] = [];

  const imgStyle =
    "display: inline-block; height: 1.1em; vertical-align: middle; margin: 0 1px;";
  const mainSymbolImgStyle =
    "display: inline-block; height: 1.3em; vertical-align: middle; margin: 0 2px 0 1px;";

  for (const symbol of AZTEC_SYMBOLS_DEFINITIONS) {
    if (currentNum === 0) break;
    if (symbol.value > currentNum) continue;

    const count = Math.floor(currentNum / symbol.value);
    if (count > 0) {
      // Determine if the original number is an exact match for this single symbol.
      // e.g., if originalNumber is 20, and current symbol is for 20, count is 1.
      const isExactOriginalMatch =
        count === 1 && originalNumber === symbol.value;

      if (isExactOriginalMatch) {
        // For exact matches (e.g., number 20), just show the symbol without preceding dots.
      } else {
        // For components of a larger number (e.g., the '20' part of '57')
        // or multiple counts (e.g. 2x400), show 'count' multiplier dots.
        // This aligns with Figure 3 (e.g., "1 x 10" shows a dot then the 10-symbol).
        for (let i = 0; i < count; i++) {
          htmlChunks.push(
            `<img src="/${UNIT_DOT_DEFINITION.imageName}" alt="${UNIT_DOT_DEFINITION.altText} (multiplier for ${symbol.value})" style="${imgStyle}" />`
          );
        }
      }

      // Add the main symbol image
      htmlChunks.push(
        `<img src="/${symbol.imageName}" alt="${symbol.altText}" style="${mainSymbolImgStyle}" />`
      );
      currentNum %= symbol.value;
    }
  }

  // Add remaining unit dots for values less than the smallest symbol (i.e., <10)
  if (currentNum > 0) {
    for (let i = 0; i < currentNum; i++) {
      htmlChunks.push(
        `<img src="/${UNIT_DOT_DEFINITION.imageName}" alt="${UNIT_DOT_DEFINITION.altText}" style="${imgStyle}" />`
      );
    }
  }

  return `<span style="white-space: nowrap;">${htmlChunks.join("")}</span>`;
}

function transformTextToAztec(inputText: string): string {
  const parts = inputText.split(/(\d+)/g);
  return parts
    .map((part) => {
      if (/^\d+$/.test(part)) {
        const num = parseInt(part, 10);
        return decimalToAztecHtml(num);
      }
      return part;
    })
    .join("");
}

export default function AztecConverterPage() {
  const initialInputText =
    "Example: 17257 cacao beans. Also 400, 300, 200, 100, 20, 10, and 7 units.";
  const [inputText, setInputText] = useState<string>(initialInputText);
  // Initialize transformedHtml directly using the initial input text
  const [transformedHtml, setTransformedHtml] = useState<string>(() =>
    transformTextToAztec(initialInputText)
  );
  const outputRef = useRef<HTMLDivElement>(null); // Changed from HTMLParagraphElement for semantic correctness of div

  const handleTransform = () => {
    const resultHtml = transformTextToAztec(inputText);
    setTransformedHtml(resultHtml);
  };

  if (outputRef.current) {
    const htmlContent = outputRef.current.innerHTML;
    try {
      const blob = new Blob([htmlContent], { type: "text/html" });
      const clipboardItem = new ClipboardItem({ "text/html": blob });

      try {
        navigator.clipboard.write([clipboardItem]).catch((err) => {
          console.error("Failed to write to clipboard:", err);
        });
      } catch (err) {
        console.error("Failed to write to clipboard:", err);
      }
      console.log("Aztec numeral text (HTML) copied to clipboard!");
    } catch (err) {
      console.warn(
        "Failed to copy as HTML, trying as plain text (markup):",
        err
      );
      try {
        navigator.clipboard.writeText(htmlContent).catch((err) => {
          console.error("Failed to copy HTML as text:", err);
        });
        console.log("Aztec numeral text (HTML markup) copied to clipboard!");
      } catch (textErr) {
        console.error("Failed to copy HTML as text:", textErr);
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="max-w-3xl w-full bg-white shadow-xl rounded-lg p-6 md:p-8">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-center text-teal-700">
            Aztec Numeral Converter
          </h1>
          <p className="text-sm text-gray-600 text-center mt-2">
            Enter text with decimal numbers to convert them into Aztec numerals.
          </p>
        </header>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="inputText"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Input Text:
            </label>
            <textarea
              id="inputText"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={5}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              placeholder="Enter text here..."
            />
          </div>

          <button
            onClick={handleTransform}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            Transform to Aztec Numerals
          </button>
        </div>

        {transformedHtml && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Transformed Text:
            </h2>
            <div
              ref={outputRef}
              className="p-4 bg-gray-50 border border-gray-200 rounded-md min-h-[60px] text-gray-700 leading-relaxed text-lg" // Increased text size for readability
              dangerouslySetInnerHTML={{ __html: transformedHtml }}
            />
            <button
              onClick={() => {
                const range = document.createRange();
                if (outputRef.current) {
                  range.selectNodeContents(outputRef.current);
                }
                const selection = window.getSelection();
                selection?.removeAllRanges();
                selection?.addRange(range);
              }}
              className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
            >
              Select All Transformed Text
            </button>
          </div>
        )}
      </div>
      <footer className="mt-8 text-center text-sm text-gray-500">
        <p>
          Ensure image files (e.g., one.png, ten.png, eight_hundred.png) are in
          the /public folder.
        </p>
        <p>
          The symbol for 8000 uses filename &apos;eight_hundred.png&apos; as per
          your list.
        </p>
      </footer>
    </div>
  );
}
