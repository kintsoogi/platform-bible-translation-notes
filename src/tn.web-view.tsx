import React, { useEffect, useState } from 'react';
import { WebViewProps } from '@papi/core';
import { ScriptureReference } from 'platform-bible-react';
import TranslationNoteScroller from './components/TranslationNoteScroller';
import { TnTSV } from './types/TsvTypes';
import papi from '@papi/frontend';
import { useSetting } from '@papi/frontend/react';

const defaultScrRef: ScriptureReference = { bookNum: 1, chapterNum: 1, verseNum: 1 };

const TranslationNotesWebview: React.FunctionComponent<WebViewProps> = ({
  useWebViewState,
}: WebViewProps) => {
  // TODO: Get the BCV from the platform. Did not work... so reach out to someone

  const [noteIndex, setNoteIndex] = useWebViewState<number>('noteIndex', 0);
  const [translationNotes, setTranslationNotes] = useWebViewState<TnTSV>('translationNotes', {});
  const [isLoading, setIsLoading] = useState(true);

  // Get current verse reference
  const [scrRef] = useSetting('platform.verseRef', defaultScrRef);
  const { bookNum, chapterNum, verseNum } = scrRef ?? {};

  useEffect(() => {
    const getTnData = async () => {
      try {
        setIsLoading(true);
        setNoteIndex(0);
        const data = await papi.commands.sendCommand('translationNotes.openBookNotes', bookNum);
        setTranslationNotes(data);
      } catch (error) {
        console.error('Failed to fetch translation notes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getTnData();
  }, [bookNum, chapterNum, verseNum]);

  const incrementNoteIndex = () => {
    const isIndexInBound = noteIndex < translationNotes?.[chapterNum]?.[verseNum]?.length - 1;
    const newIndex = isIndexInBound ? noteIndex + 1 : noteIndex;
    setNoteIndex(newIndex);
  };

  const decrementNoteIndex = () => {
    const newIndex = noteIndex > 0 ? noteIndex - 1 : noteIndex;
    setNoteIndex(newIndex);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <TranslationNoteScroller
        notes={translationNotes?.[chapterNum]?.[verseNum] ?? []}
        currentIndex={noteIndex}
        incrementIndex={incrementNoteIndex}
        decrementIndex={decrementNoteIndex}
      />
    </div>
  );
};

global.webViewComponent = TranslationNotesWebview;
