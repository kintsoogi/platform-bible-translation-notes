import { WebViewProps } from '@papi/core';

const FirstWebview: React.FunctionComponent<WebViewProps> = ({ useWebViewState }: WebViewProps) => {
  // TODO: If I want to call a command
  // papi.commands.sendCommand('verseImageGenerator.generateImages', prompt)

  // TODO: Get the BCV from the platform. Did not work... so reach out to someone
  
  return (
    <div>
      <h3>TranslationNotesExtension</h3>
    </div>
  );
};

global.webViewComponent = FirstWebview;
