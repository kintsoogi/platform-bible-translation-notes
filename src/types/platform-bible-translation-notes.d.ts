import { TnTSV } from './TsvTypes';

declare module 'platform-bible-translation-notes' {
  // Add extension types exposed on the papi for other extensions to use here
  // More instructions can be found in the README
}

declare module 'papi-shared-types' {
  export interface CommandHandlers {
    /**
     * Given a BCV
     *
     * @param prompt Prompt for generating images
     * @returns Array of urls for the generated images
     * @todo Implement BCV input
     */
    'translationNotes.openBookNotes': (bookNum: number) => Promise<TnTSV>;
  }
}
