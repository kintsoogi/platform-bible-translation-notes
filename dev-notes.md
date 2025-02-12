## Webview Workflow

1. Create a webview (must have file name like [name].web-view.tsx) that returns jsx.

   - Must be assigned to `global.webViewComponent`

2. Register this webview in the `main.ts` file
   - Import necessary types and webview
   - Create a webview provider
   - Get a webview promise from papi and add it to `context.registrations`
   - Render webview panel with `papi.webViews.getWebView()`

## Commands Workflow

1. Create the functions that you want the command to run.

2. Tell intellisense about our command using the types/[your-proj].d.ts

   - Declare `papi-shared-types` module to declare what your extension adds to the platform.
   - Export `CommandHandlers` interface to tell papi what funciton your command contributes.
   - _Note_: Commands must be async and return a promise!

3. Create a command promise using `papi.commands.registerCommand` to tell papi about your command.

4. Add command promise to `context.registrations`

5. Configure the frontend to talk with this backend command.
   - Import papi from `@papi/frontend`
   - Use `papi.commands.sendCommand()` to call your command!

## Communicating With the Rest of Paranext

1. Use `papi.projectLookup` to retrieve the project that you want to get information from.

2. Use the `useSetting` react hook to retrieve getter/setter for whatever content you need (i.e verse reference)

3. Use the const obtained from create a object of the data retrieved (i.e a VerseRef object)

4. Use the `useProjectData` hook to retrieve the verse information from the project given the project ID.

### Implementing for Translation Notes

I don't need to get the actual verse data in my extension. Instead, I just need to access the current book, chapter, and verse.

So, I will just need to use the `useSetting` hook to get the current book, chapter and verse!

1. Create a default scripture reference

2. Call `useSetting` hook using default scripture ref to get platform current book, chapter, verse

    ```ts
    const defaultScrRef: ScriptureReference = { bookNum: 1, chapterNum: 1, verseNum: 1 };

    const [scrRef] = useSetting('platform.verseRef', defaultScrRef);
    ```

3. Call the `openBookNotes` command with the current book

4. Retrieve TN file based on the book and pass it back to the webview!

## Accessing Files (Mimicking Custom Editor Reading)

The biggest change when transferring my vscode extension into a paranext extension is that the way to 
access a file is different. 
- In vscode I could make my extension a custom editor, and this would allow 
and files with `.md` extension to open my extension's webview.

When I asked in the paranext discord about how to do this, here was the response I received:

>  I see a few options, and the one you should choose probably depends on your needs. **First, though, a  limitation: we currently do not offer a way to access arbitrary file system locations outside of your extension's files.** For example, node's fs package cannot be imported. We are considering opening the option if an extension specifically requests access, in which case we can mark that extension as needing higher privileges in the marketplace (or whatever we end up doing), but we don't have anything like that currently. As such, you'll have to access files in one of two ways: 

> (For reference, [here is a link to papi.storage documentation](https://paranext.github.io/paranext-core/papi-dts/interfaces/_extension_host_services_extension_storage_service_.ExtensionStorageService.html). I will be discussing it at length. If you want to get there yourself, go to the paranext-core repo, click [its linked website](https://paranext.github.io/paranext-core/), click papi-dts, click @papi/backend, click storage, then click ExtensionStorageService)

> 1. **If you are able to bundle your files in at build time** (for example, if you have one or a few sets of specific files that can be freely distributed to all users who have the extension), **you can include your files in your extension's assets folder and load them into your backend with `papi.storage.readText.FileFromInstallDirectory` (there's also a binary version).** [Here's an example](https://github.com/paranext/paranext-core/blob/850-resource-viewer-images-fix/extensions/src/quick-verse/src/main.ts#L281) of doing that in one of our test extensions 🙂 Note you can actually load files from anywhere in your extension bundle, but you have to [make sure webpack copies the files over into the built folder](https://github.com/paranext/paranext-extension-template/blob/main/webpack/webpack.config.main.ts#L50). It copies assets by default
> 2. **If the files are not a few specific files or only certain users have access to some files, you can hit an internet API serving those files and save them in your extension's user data storage** (basically a per-extension key/value storage that abstracts the file system away) **with `papi.storage.readUserData` and `papi.stoarge.writeUserData`.** [Here's an example](https://github.com/paranext/paranext-core/blob/850-resource-viewer-images-fix/extensions/src/quick-verse/src/main.ts#L290) from the same test extension 🙂

> I would also be glad to discuss how to serve that data to your frontend if you'd like! There are many ways to do this such as commands, data provider, project data provider, etc. There's some documentation on those things [here](https://github.com/paranext/paranext-extension-template/wiki/Extension-Anatomy)

### Implementing for Translation Notes

Based on this feeback, since we need to keep things offline, we will go with the first method. 

The process was pretty easy and more similar to VSCODE than I expected. 

1. Loaded TN .tsv files into the assets folder under `en_tn` folder

2. Retrieve an execution token from the platform

3. Call `papi.storage.readTextFileFromInstallDirectory` and directly get file text string!

4. Transform text string to TN data object

    ```ts
    async function getTranslationNotesData(token: ExecutionToken) {
      const tnTsvString: string = await papi.storage.readTextFileFromInstallDirectory(
        token,
        'assets/en_tn/tn_TIT.tsv',
      );
      return tsvStringToScriptureTSV(tnTsvString) as TnTSV
    }
    ```

5. Pass TN Data object to frontend using a command (very similar process to VSCode)

    ```ts
    const translationNotesPromise = papi.commands.registerCommand(
      'translationNotes.openBookNotes',
      async () => {
        return getTranslationNotesData(context.executionToken)
      },
    );
    ```

## Comparing to Vscode Extension Development

### Similarities

- The process of registering extensions, webviews, commands, etc. seems pretty similar.
  - Those who have worked on vscode extensions will have some common ground to work on!
- Like vscode's `webview-ui-toolkit`, platform.bible has a library of UI elements so that your extension can have the same look and file as the rest of the application (even if it doesn't look as cool as vscode)

### Differences

- The vscode extension documentation and examples are far more numerous and thorough than the paranext development documentation
  - Is projectLookup/useSetting/etc. documented so that they can be easily used? It's a little confusing.
- The `useWebViewState` function is different than keeping track of state in vscode.
  - Do I like it better or worse? It seems more intuitive to react, but also seems to focus us in on React.
  - Seems like local storage?
- The debugging process is a little more frustrating. However, it can be found in the wiki.
- It seems like the only way to make a webview is using React. This is great for our use cases but is less flexible than VSCode. 
- Using the UI elements is different than using VSCode UI elements. There is not much documentation, BUT they are basically used just like Material-UI elements, and there is plenty of documentation there. 
- **Most platform and cross-extenstion communication happens through PAPI**. 
    - I found the process of reading a file to be easier than using a custom editor in vscdode.
    - I also found the command communication to be a little bit easier than vscode. 
    - They have API documentation for PAPI, but it would be beneficial to have more use-case examples.  

### Questions

- 

### Problems

- It seems like the "Your First Extension" wiki is not up to date, as it does not use @papi imports.



