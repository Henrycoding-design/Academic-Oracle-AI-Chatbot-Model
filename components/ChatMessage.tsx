
import React from 'react';
import type { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

const BotAvatar = () => (
    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M12 14l9-5-9-5-9 5 9 5z" />
            <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222 4 2.222V20M12 12L4 7l8-4 8 4-8 5z" />
        </svg>
    </div>
);

const UserAvatar = () => (
    <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    </div>
);


export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isModel = message.role === 'model';

  const messageClasses = `flex items-start gap-3 my-4 animate-fade-in-up`;
  const messageBubbleClasses = `max-w-xl px-5 py-3 rounded-2xl shadow-md ${
    isModel
      ? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-none'
      : 'bg-blue-500 text-white rounded-br-none'
  }`;

  return (
    <div className={`${messageClasses} ${isModel ? 'justify-start' : 'justify-end'}`}>
      {isModel && <BotAvatar />}
      <div className={`${messageBubbleClasses} ${isModel ? '' : 'order-1'}`}>
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
       {!isModel && <UserAvatar />}
    </div>
  );
};
