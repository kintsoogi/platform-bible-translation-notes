import React from 'react';
import TranslationNote from './TranslationNote';
import type { TranslationNoteType, NoteIndex } from '../types/TsvTypes';

const TranslationNoteScroller = ({
  notes,
  currentIndex,
  LeftArrowComponent,
  RightArrowComponent,
}: {
  notes: TranslationNoteType[];
  currentIndex: NoteIndex;
  LeftArrowComponent: React.ElementType;
  RightArrowComponent: React.ElementType;
}) => {
  return (
    <div className="scroller-container">
      <div id="note-position">
        {currentIndex + 1} of {notes.length}
      </div>

      <div className="column-container">
        <LeftArrowComponent aria-label="left" />

        <div id="note-container">
          <TranslationNote note={notes[currentIndex]} />
        </div>

        <RightArrowComponent aria-label="right" />
      </div>
    </div>
  );
};

export default TranslationNoteScroller;
