import papi, { logger } from '@papi/backend';
import type { ExecutionActivationContext, IWebViewProvider, ExecutionToken } from '@papi/core';
import webViewContent from './tn.web-view?inline';
import webViewContentStyle from './tn.web-view.scss?inline';
import { tsvStringToScriptureTSV } from './utils/tsvFileConversions';
import { TnTSV } from './types/TsvTypes';

const webViewProvider: IWebViewProvider = {
  async getWebView(savedWebView) {
    return {
      ...savedWebView,
      content: webViewContent,
      styles: webViewContentStyle,
      title: 'Translation Notes',
    };
  },
};

async function getTranslationNotesData(token: ExecutionToken) {
  const tnTsvString: string = await papi.storage.readTextFileFromInstallDirectory(
    token,
    'assets/en_tn/tn_TIT.tsv',
  );
  return tsvStringToScriptureTSV(tnTsvString) as TnTSV
}

export async function activate(context: ExecutionActivationContext) {
  logger.info('Translation Notes are activating!');

  // TODO: If you want to add a command
  // const commandPromise = papi.commands.registerCommand(
  //   'verseImageGenerator.generateImages',
  //   async () => {
  //     return Promise;
  //   },
  // );


  // Register command to generate images for a prompt
  const translationNotesPromise = papi.commands.registerCommand(
    'translationNotes.openBookNotes',
    async () => {
      // TODO: Get BCV!
      return getTranslationNotesData(context.executionToken)
    },
  );


  // TODO: Now we take the file text and serve it to the frontend
  

  // Register the web view provider
  const webViewPromise = papi.webViewProviders.register('translationNotes.view', webViewProvider);

  // Pull up the web view on startup
  papi.webViews.getWebView('translationNotes.view', undefined, { existingId: '?' });

  // Set up registered extension features to be unregistered when deactivating the extension.
  // TODO: Set up command registration
  context.registrations.add(await webViewPromise , await translationNotesPromise);
}

export async function deactivate() {
  logger.info('Translation Notes are deactivating!');
  return true;
}
