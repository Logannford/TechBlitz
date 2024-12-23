'use client';

import { FileIcon, CopyIcon, CheckIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { codeToHtml } from 'shiki';
import { motion, AnimatePresence } from 'framer-motion';

interface CodeComparisonProps {
  beforeCode: string;
  afterCode: string;
  language: string;
  filename: string;
  lightTheme: string;
  darkTheme: string;
}

export default function CodeComparison({
  beforeCode,
  afterCode,
  language,
  filename,
  lightTheme,
  darkTheme
}: CodeComparisonProps) {
  const { theme, systemTheme } = useTheme();
  const [highlightedBefore, setHighlightedBefore] = useState('');
  const [highlightedAfter, setHighlightedAfter] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const currentTheme = theme === 'system' ? systemTheme : theme;
    const selectedTheme = currentTheme === 'dark' ? darkTheme : lightTheme;

    async function highlightCode() {
      const before = await codeToHtml(beforeCode, {
        lang: language,
        theme: selectedTheme
      });
      const after = await codeToHtml(afterCode, {
        lang: language,
        theme: selectedTheme
      });
      setHighlightedBefore(before);
      setHighlightedAfter(after);
    }

    highlightCode();
  }, [
    theme,
    systemTheme,
    beforeCode,
    afterCode,
    language,
    lightTheme,
    darkTheme
  ]);

  const handleCopy = () => {
    navigator.clipboard.writeText(afterCode).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const renderCode = (code: string, highlighted: string) => {
    if (highlighted) {
      return (
        <div
          className="max-h-64 md:max-h-96 md:h-full max-w-[31rem] overflow-hidden bg-background font-inter text-[10px] sm:text-xs [&>pre]:h-full [&>pre]:!bg-transparent [&>pre]:p-4 [&_code]:break-all"
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      );
    } else {
      return (
        <pre className="h-full overflow-auto break-all bg-background p-4 font-inter text-xs">
          {code}
        </pre>
      );
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="relative w-full overflow-hidden rounded-xl border border-black-50">
        <div className="relative grid md:grid-cols-2 md:divide-x md:divide-border !divide-black-50">
          <div>
            <div
              className="flex items-center p-3 text-sm text-foreground"
              style={{
                background:
                  'radial-gradient(128% 107% at 50% 0%,#212121 0%,rgb(0,0,0) 77.61472409909909%)'
              }}
            >
              <FileIcon className="mr-2 h-4 w-4" />
              <span className="font-medium font-onest">Other platforms</span>
            </div>
            {renderCode(beforeCode, highlightedBefore)}
          </div>
          <div>
            <div
              className="flex items-center border-t border-black-50 md:border-none p-3 text-sm text-foreground justify-between"
              style={{
                background:
                  'radial-gradient(128% 107% at 50% 0%,#212121 0%,rgb(0,0,0) 77.61472409909909%)'
              }}
            >
              <div className="flex items-center">
                <FileIcon className="mr-2 h-4 w-4" />
                <span className="font-medium font-onest">techblitz</span>
              </div>
              <motion.div
                className="relative flex items-center cursor-pointer"
                onClick={handleCopy}
                title="Copy code"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <AnimatePresence
                  mode="wait"
                  initial={false}
                >
                  {isCopied ? (
                    <motion.div
                      key="check"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CheckIcon className="h-4 w-4 text-green-500" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="copy"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CopyIcon className="h-4 w-4 text-white" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
            {renderCode(afterCode, highlightedAfter)}
          </div>
        </div>
        <div className="font-semibold font-onest hidden md:flex absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-md bg-accent text-xs text-white">
          VS
        </div>
      </div>
    </div>
  );
}
