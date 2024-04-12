import React, { useState } from 'react'
import { WebViewProps } from '@papi/core';
import TranslationNoteScroller from './components/TranslationNoteScroller'; 
import { TranslationNoteType } from './types/TsvTypes';

const translationNotes: TranslationNoteType[] = [
    {
      Reference: "1:1",
      ID: "a1b2",
      Tags: "important, keyword",
      SupportReference: "sc-ttdg/dsfa/dsafsd/asdf",
      Quote: "Ἐν ἀρχῇ",
      Occurrence: "1",
      Note: "This is a significant note for translation."
    },
    {
      Reference: "1:1",
      ID: "a1b2",
      Tags: "important, keyword",
      SupportReference: "sc-ttdg/dsfa/dsafsd/asdf",
      Quote: "Ἐν ἀρχῇ",
      Occurrence: "1",
      Note: "This is a significant note for translation. This is a significant note for translation. This is a significant note for translation. This is a significant note for translation. This is a significant note for translation. This is a significant note for translation. This is a significant note for translation. This is a significant note for translation. "
    },
    {
      Reference: "1:1",
      ID: "a1b2",
      Tags: "important, keyword",
      SupportReference: "sc-ttdg/dsfa/dsafsd/asdf",
      Quote: "Ἐν ἀρχῇ",
      Occurrence: "1",
      Note: "This is a significant note for translation."
    },
  ]

const TranslationNotesWebview: React.FunctionComponent<WebViewProps> = ({ useWebViewState }: WebViewProps) => {
  // TODO: If I want to call a command
  // papi.commands.sendCommand('verseImageGenerator.generateImages', prompt)

  // TODO: Get the BCV from the platform. Did not work... so reach out to someone

  const [noteIndex, setNoteIndex] = useState<number>(0);

  const incrementNoteIndex = () =>
      setNoteIndex((prevIndex) =>
          prevIndex < translationNotes.length - 1
              ? prevIndex + 1
              : prevIndex,
      );
  const decrementNoteIndex = () =>
      setNoteIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : prevIndex,
      );
  

  return (
    <div>
      <TranslationNoteScroller 
        notes={translationNotes}
        currentIndex={noteIndex}
        incrementIndex={incrementNoteIndex}
        decrementIndex={decrementNoteIndex}
      />
    </div>
  );
};

global.webViewComponent = TranslationNotesWebview;
