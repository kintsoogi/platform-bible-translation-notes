import { IconButton } from "platform-bible-react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

import TranslationNote from "./TranslationNote";
import type { TranslationNoteType, NoteIndex } from "../types/TsvTypes";

const TranslationNoteScroller = ({
    notes,
    currentIndex,
    incrementIndex,
    decrementIndex,
}: {
    notes: TranslationNoteType[];
    currentIndex: NoteIndex;
    incrementIndex: () => void;
    decrementIndex: () => void;
}) => {
    return (
        <div className="scroller-container">
            <div id="note-position">
                {currentIndex + 1} of {notes.length}
            </div>

            <div className="column-container">
                <IconButton onClick={decrementIndex} className="arrow-button" aria-label="left" label="previous" size="medium" >
                    <MdChevronLeft />
                </IconButton>

                <div id="note-container">
                    <TranslationNote note={notes[currentIndex]} />
                </div>

                <IconButton onClick={incrementIndex} className="arrow-button" aria-label="right" label="next" size="medium">
                    <MdChevronRight />
                </IconButton>
            </div>
        </div>
    );
};

export default TranslationNoteScroller;
