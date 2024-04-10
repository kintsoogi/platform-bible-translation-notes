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

### Questions

- My extension uses a custom editor to directly talk to, display, and edit a file. Does platform.bible support this?
- Is there an easy way to debug our code?

### Problems

- It seems like the "Your First Extension" wiki is not up to date, as it does not use @papi imports.
