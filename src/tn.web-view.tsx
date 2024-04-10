import React, { useState } from 'react'
import { WebViewProps } from '@papi/core';
import TranslationNote from './components/TranslationNote';
import { Button } from 'platform-bible-react';
import { TranslationNoteType } from './types/TsvTypes';

const TranslationNotesWebview: React.FunctionComponent<WebViewProps> = ({ useWebViewState }: WebViewProps) => {
  // TODO: If I want to call a command
  // papi.commands.sendCommand('verseImageGenerator.generateImages', prompt)

  // TODO: Get the BCV from the platform. Did not work... so reach out to someone

  const translationNote: TranslationNoteType = {
    Reference: "1:1",
    ID: "a1b2",
    Tags: "important, keyword",
    SupportReference: "sc-ttdg/dsfa/dsafsd/asdf",
    Quote: "Ἐν ἀρχῇ",
    Occurrence: "1",
    Note: "This is a significant note for translation."
  }

  return (
    <div>
      <TranslationNote note={translationNote} />
    </div>
  );
};

global.webViewComponent = TranslationNotesWebview;
