// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import {
  addBookmark,
  Bookmark,
  BOOKMARKS,
  CURRENT_TAG,
  removeBookmark,
} from "./bookmarkStateManager";
import { BookmarkTreeProvider } from "./BookmarkTreeProvider";
import { TagDisplayProvider } from "./TabTreeProvider";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

let bookmarkDecorationType: vscode.TextEditorDecorationType;
export function activate(context: vscode.ExtensionContext) {
  // register all commands

  const rootPath =
    vscode.workspace.workspaceFolders &&
    vscode.workspace.workspaceFolders.length > 0
      ? vscode.workspace.workspaceFolders[0].uri.fsPath
      : undefined;
  context.workspaceState.update(BOOKMARKS, []);

  const topViewDataProvider = new TagDisplayProvider(context);
  const bottomViewDataProvider = new BookmarkTreeProvider(context);
  vscode.window.registerTreeDataProvider(
    "gestaltExplorerTop",
    topViewDataProvider
  );

  vscode.window.registerTreeDataProvider(
    "gestaltExplorerBottom",
    bottomViewDataProvider
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json

  let addBookmarkCommand = vscode.commands.registerCommand(
    "gestalt.addBookmark",
    async () => {
      const tagsInput =
        (await vscode.window.showInputBox({
          prompt: "enter a list of tags, separated by spaces",
        })) || "";
      const tags = tagsInput.trim().split(" ");
      const lineNumber =
        (vscode.window.activeTextEditor?.selection?.active?.line || 0) + 1;
      const fileName = vscode.window.activeTextEditor?.document.fileName!;
      addBookmark(context, { tags, fileName, lineNumber });
      vscode.window.showInformationMessage("Add bookmark to gestalt!");
      topViewDataProvider.refresh();
      bottomViewDataProvider.refresh();
    }
  );

  let toggleTagCommand = vscode.commands.registerCommand(
    "gestalt.toggleTag",
    (tag: string) => {
      context.workspaceState.update(CURRENT_TAG, tag);
      bottomViewDataProvider.refresh();
    }
  );

  let openBookmarkCommand = vscode.commands.registerCommand(
    "gestalt.openBookmark",
    async (fileName: string, lineNumber: number) => {
      const doc = await vscode.workspace.openTextDocument(fileName);
      const editor = await vscode.window.showTextDocument(doc);
      const range = editor.document.lineAt(lineNumber - 1).range;
      editor.selection = new vscode.Selection(range.start, range.end);
      editor.revealRange(range);
    }
  );

  let deleteBookmarkCommand = vscode.commands.registerCommand(
    "gestalt.deleteBookmark",
    async (node: Bookmark) => {
      const { fileName, lineNumber } = node;
      removeBookmark(context, { fileName, lineNumber });
      topViewDataProvider.refresh();
      bottomViewDataProvider.refresh();
    }
  );

  // let testCommnand = vscode.commands.registerCommand(
  //   "gestalt.test",
  //   async ( ) => {
  //     const openEditors = vscode.window.visibleTextEditors;
  //     editor.setDecorations(bookmarkDecorationType, []);

  //   }
  // );

  context.subscriptions.push(
    addBookmarkCommand,
    toggleTagCommand,
    openBookmarkCommand,
    deleteBookmarkCommand
  );

  bookmarkDecorationType = vscode.window.createTextEditorDecorationType({
    gutterIconPath: context.asAbsolutePath("media/bookmark.svg"),
    gutterIconSize: "contain",
  });

  // decorations
  refreshEditorDecorators(context);

  // refresh decorations when the active editor changes
  vscode.window.onDidChangeActiveTextEditor(() => {
    refreshEditorDecorators(context);
  });
}

export function refreshEditorDecorators(context: vscode.ExtensionContext) {
  let allBookmarks = context.workspaceState.get<Bookmark[]>(BOOKMARKS) || [];
  const openEditors = vscode.window.visibleTextEditors;

  let fileToBookmarkMap = new Map<string, Bookmark[]>();
  allBookmarks.forEach((bookmark) => {
    const existingBookmarks = fileToBookmarkMap.get(bookmark.fileName) || [];
    fileToBookmarkMap.set(bookmark.fileName, [...existingBookmarks, bookmark]);
  });

  // reset all editors

  openEditors.forEach((editor) => {
    const bookmarks = fileToBookmarkMap.get(editor.document.fileName) || [];
    const decorationsArray = bookmarks.map((bookmark) => {
      const range = new vscode.Range(
        new vscode.Position(bookmark.lineNumber - 1, 0),
        new vscode.Position(bookmark.lineNumber - 1, 0)
      );
      const decorationOptions: vscode.DecorationOptions = {
        range,
        hoverMessage: "lol",
      };
      return decorationOptions;
    });

    editor.setDecorations(bookmarkDecorationType, decorationsArray);
  });
}

// This method is called when your extension is deactivated
export function deactivate() {}
