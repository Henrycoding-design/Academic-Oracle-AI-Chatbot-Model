
import React, { useEffect, useRef, useState } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const SendIcon = ({ className }: { className: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z"
      fill="currentColor"
    />
  </svg>
);


export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [inputValue, setInputValue] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const taRef = useRef<HTMLTextAreaElement | null>(null);

  const handleSubmit = () => {
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  const autosize = () =>{
    const ta = taRef.current;
    ta.style.height = 'auto';
    ta.style.height = '${ta.scrollHeight} px';
  };

  useEffect(() => {
    autosize();
  }, [inputValue]);

  const onKeyDown : React.KeyboardEventHandler<HTMLTextAreaElement> = e => {
    if (e.key === 'Enter' && !e.shiftKey && !e.metaKey) {
      if (!isComposing) {
        e.preventDefault();
        handleSubmit();
      }
    }
  };



//   return (
//     <form onSubmit={handleSubmit} className="flex items-center p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
//       <input
//         type="text"
//         value={inputValue}
//         onChange={(e) => setInputValue(e.target.value)}
//         placeholder="Ask a question about your IGCSE studies..."
//         disabled={isLoading}
//         className="flex-grow px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-shadow duration-200"
//       />
//       <button
//         type="submit"
//         disabled={isLoading}
//         className={`ml-3 flex-shrink-0 p-3 rounded-full transition-colors duration-200 ${
//           isLoading 
//             ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' 
//             : 'bg-blue-600 hover:bg-blue-700 text-white'
//         }`}
//       >
//       < SendIcon className = 'w-6 h-6'/>
//       </button>
//     </form>
//   );
// };


    return (
        <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-4xl mx-auto flex items-end gap-3">
            <textarea
              ref={taRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={onKeyDown}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={() => setIsComposing(false)}
              placeholder="Ask a question about your IGCSE studies..."
              disabled={isLoading}
              rows={1}
              wrap="soft"
              className="
                flex-grow px-4 py-3 border border-gray-300 dark:border-gray-600
                rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500
                dark:bg-gray-700 dark:text-white transition-shadow duration-200
                resize-none overflow-y-auto
                max-h-40 md:max-h-56
              "
              style={{ lineHeight: "1.5" }}
            />
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading || !inputValue.trim()}
              className={`flex-shrink-0 p-3 rounded-full transition-colors duration-200
                ${isLoading || !inputValue.trim()
                  ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"}
              `}
              aria-label="Send message"
            >
              <SendIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      );
    };
