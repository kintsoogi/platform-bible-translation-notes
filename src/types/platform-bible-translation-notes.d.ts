import { TnTSV } from "./TsvTypes";

declare module 'platform-bible-translation-notes' {
  // Add extension types exposed on the papi for other extensions to use here
  // More instructions can be found in the README
}

declare module 'papi-shared-types' {
  export interface CommandHandlers {
    /**
     * Given a BCV
     *
     * @todo Implement BCV input
     * @param prompt Prompt for generating images
     * @returns Array of urls for the generated images
     */
    'translationNotes.openBookNotes': () => Promise<TnTSV>;
  }
}
