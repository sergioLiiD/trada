import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Note } from '../types';

interface PersonalNotesProps {
  note: Note;
  onNoteChange: (note: Note) => void;
}

const COLORS = ['default', 'gray', 'red', 'green', 'blue', 'yellow'];
const COLOR_MAP: { [key: string]: { bg: string, text: string } } = {
  default: { bg: 'bg-white dark:bg-gray-800/50', text: 'text-gray-700 dark:text-gray-300' },
  gray: { bg: 'bg-gray-200 dark:bg-gray-700', text: 'text-gray-800 dark:text-gray-200' },
  red: { bg: 'bg-red-200 dark:bg-red-900/50', text: 'text-red-800 dark:text-red-200' },
  green: { bg: 'bg-green-200 dark:bg-green-900/50', text: 'text-green-800 dark:text-green-200' },
  blue: { bg: 'bg-blue-200 dark:bg-blue-900/50', text: 'text-blue-800 dark:text-blue-200' },
  yellow: { bg: 'bg-yellow-200 dark:bg-yellow-800/50', text: 'text-yellow-800 dark:text-yellow-200' },
};

const COLOR_SWATCH_MAP: { [key: string]: string } = {
  default: 'bg-white',
  gray: 'bg-gray-400',
  red: 'bg-red-400',
  green: 'bg-green-400',
  blue: 'bg-blue-400',
  yellow: 'bg-yellow-400',
};


const PersonalNotes: React.FC<PersonalNotesProps> = ({ note, onNoteChange }) => {
  const [content, setContent] = useState(note.content || '');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setContent(note.content || '');
  }, [note.content]);

  const checkHeight = useCallback(() => {
    if (contentRef.current) {
        // Line height approx 24px, 3 lines is 72px.
        setShowToggle(contentRef.current.scrollHeight > 72);
    }
  }, []);

  useEffect(() => {
    checkHeight();
    const resizeObserver = new ResizeObserver(checkHeight);
    if(contentRef.current) {
        resizeObserver.observe(contentRef.current);
    }
    return () => resizeObserver.disconnect();
  }, [checkHeight, content]);


  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const newContent = e.currentTarget.innerHTML;
    setContent(newContent);
  };
  
  const handleBlur = () => {
    if (note.content !== content) {
      onNoteChange({ ...note, content });
    }
  }

  const handleColorChange = (color: string) => {
    onNoteChange({ ...note, color });
  };

  const handleFormat = (command: string) => {
    document.execCommand(command, false);
  };
  
  const selectedColor = COLOR_MAP[note.color] || COLOR_MAP.default;

  return (
    <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 border border-gray-200 dark:border-gray-700/50 ${selectedColor.bg}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className={`text-xl font-bold text-primary`}>Personal Notes</h2>
        <div className="flex items-center space-x-1">
            <button onClick={() => handleFormat('bold')} className="p-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600"><b>B</b></button>
            <button onClick={() => handleFormat('italic')} className="p-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600"><i>I</i></button>
            <button onClick={() => handleFormat('underline')} className="p-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600"><u>U</u></button>
            {/* Fix: Property 'strike' does not exist on type 'JSX.IntrinsicElements'. The <strike> tag is obsolete and was replaced with <s>. */}
            <button onClick={() => handleFormat('strikeThrough')} className="p-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600"><s>S</s></button>
            <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1"></div>
            {COLORS.map(color => (
                <button
                  key={color}
                  onClick={() => handleColorChange(color)}
                  aria-label={`Set note color to ${color}`}
                  className={`w-5 h-5 rounded-full border-2 transition-transform duration-200 ${note.color === color ? 'border-primary scale-110' : 'border-transparent'} ${COLOR_SWATCH_MAP[color]}`}
                ></button>
            ))}
        </div>
      </div>
      <div 
        ref={contentRef}
        contentEditable
        onInput={handleInput}
        onBlur={handleBlur}
        dangerouslySetInnerHTML={{ __html: content }}
        className={`prose dark:prose-invert max-w-none focus:outline-none transition-all duration-300 ${selectedColor.text} ${isExpanded ? 'max-h-none' : 'max-h-18 overflow-hidden'}`}
        style={{maxHeight: isExpanded ? 'none' : '72px'}}
      />
      <div className="flex justify-between items-center mt-2 text-xs">
        {showToggle && (
             <button onClick={() => setIsExpanded(!isExpanded)} className="text-primary font-semibold">
                {isExpanded ? 'Show Less' : 'Read More'}
            </button>
        )}
       <span className="ml-auto text-gray-500 dark:text-gray-400">Further reading</span>
      </div>
    </div>
  );
};

export default PersonalNotes;