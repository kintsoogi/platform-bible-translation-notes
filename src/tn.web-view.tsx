import React, { useEffect, useState } from 'react';
import { WebViewProps } from '@papi/core';
import { ScriptureReference, IconButton } from 'platform-bible-react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

import TranslationNoteScroller from './components/TranslationNoteScroller';
import { TnTSV } from './types/TsvTypes';
import papi from '@papi/frontend';
import { useSetting } from '@papi/frontend/react';

const defaultScrRef: ScriptureReference = { bookNum: 1, chapterNum: 1, verseNum: 1 };

const TranslationNotesWebview: React.FunctionComponent<WebViewProps> = ({
  useWebViewState,
}: WebViewProps) => {
  const [noteIndex, setNoteIndex] = useWebViewState<number>('noteIndex', 0);
  const [translationNotes, setTranslationNotes] = useWebViewState<TnTSV>('translationNotes', {});
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

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
        setIsError(false);
      } catch (error) {
        console.error('Failed to fetch translation notes:', error);
        setIsError(true);
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

  if (!translationNotes?.[chapterNum]?.[verseNum] || isError) {
    return <div>No translation notes available for this verse.</div>;
  }

  const LeftArrowButton = () => (
    <IconButton
      onClick={decrementNoteIndex}
      className="arrow-button"
      aria-label="left"
      label="previous"
      size="medium"
    >
      <MdChevronLeft />
    </IconButton>
  );

  const RightArrowButton = () => (
    <IconButton
      onClick={incrementNoteIndex}
      className="arrow-button"
      aria-label="right"
      label="next"
      size="medium"
    >
      <MdChevronRight />
    </IconButton>
  );

  return (
    <div>
      <TranslationNoteScroller
        notes={translationNotes[chapterNum][verseNum]}
        currentIndex={noteIndex}
        LeftArrowComponent={LeftArrowButton}
        RightArrowComponent={RightArrowButton}
      />
    </div>
  );
};

global.webViewComponent = TranslationNotesWebview;
