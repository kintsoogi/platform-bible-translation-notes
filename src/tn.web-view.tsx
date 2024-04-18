import React, { useCallback, useEffect, useState } from 'react'
import { WebViewProps } from '@papi/core';
import TranslationNoteScroller from './components/TranslationNoteScroller'; 
import { TnTSV, TranslationNoteType } from './types/TsvTypes';
import papi from '@papi/frontend';


const TranslationNotesWebview: React.FunctionComponent<WebViewProps> = ({ useWebViewState }: WebViewProps) => {
  // TODO: If I want to call a command
  // papi.commands.sendCommand('verseImageGenerator.generateImages', prompt)

  // TODO: Get the BCV from the platform. Did not work... so reach out to someone

  const [noteIndex, setNoteIndex] = useWebViewState<number>('noteIndex', 0);
  const [translationNotes, setTranslationNotes] = useWebViewState<TnTSV>('translationNotes', {})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getTnData = async () => {
      try {
        setIsLoading(true);
        const data = await papi.commands.sendCommand('translationNotes.openBookNotes');
        setTranslationNotes(data)
      } catch (error) {
        console.error('Failed to fetch translation notes:', error);
      } finally {
        setIsLoading(false); 
      }
    };

    getTnData();
  }, [])
  
  const incrementNoteIndex = () => {
      const isIndexInBound = noteIndex < translationNotes?.[1]?.[1].length - 1
      const newIndex = isIndexInBound ? noteIndex + 1 : noteIndex;
      setNoteIndex(newIndex);
  }

  const decrementNoteIndex = () => {
      const newIndex = noteIndex > 0 ? noteIndex - 1 : noteIndex;
      setNoteIndex(newIndex);
  }

  if (isLoading) {
    return (
      <div>Loading...</div>
    )
  }

  return (
    <div>
      <TranslationNoteScroller 
        notes={translationNotes?.[1]?.[1]}
        currentIndex={noteIndex}
        incrementIndex={incrementNoteIndex}
        decrementIndex={decrementNoteIndex}
      />
    </div>
  );
};

global.webViewComponent = TranslationNotesWebview;
