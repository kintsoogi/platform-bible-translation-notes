import papi, { logger } from '@papi/backend';
import type { ExecutionActivationContext, IWebViewProvider } from '@papi/core';
import webViewContent from './tn.web-view?inline';
import webViewContentStyle from './tn.web-view.scss?inline';

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

export async function activate(context: ExecutionActivationContext) {
  logger.info('Translation Notes are activating!');

  // TODO: If you want to add a command
  // const commandPromise = papi.commands.registerCommand(
  //   'verseImageGenerator.generateImages',
  //   async () => {
  //     return Promise;
  //   },
  // );

  // Register the web view provider
  const webViewPromise = papi.webViewProviders.register('translationNotes.view', webViewProvider);

  // Pull up the web view on startup
  papi.webViews.getWebView('translationNotes.view', undefined, { existingId: '?' });

  // Set up registered extension features to be unregistered when deactivating the extension.
  // TODO: Set up command registration
  context.registrations.add(await webViewPromise /*, await commandPromise*/);
}

export async function deactivate() {
  logger.info('Translation Notes are deactivating!');
  return true;
}
