import * as vscode from "vscode";
export interface Bookmark {
  tags: string[];
  fileName: string;
  lineNumber: number;
}

export const BOOKMARKS = "bookmarks";

// this upserts bookmarks into the array
export const addBookmark = (
  context: vscode.ExtensionContext,
  newBookmark: Bookmark
) => {
  const existingBookmarks: Bookmark[] = context.workspaceState.get(BOOKMARKS)!;

  const index = existingBookmarks.findIndex((bm) => {
    return (
      bm.fileName === newBookmark.fileName &&
      bm.lineNumber === newBookmark.lineNumber
    );
  });
  if (index !== -1) {
    const newBookmarks = [...existingBookmarks];

    newBookmarks[index] = newBookmark;
    context.workspaceState.update(BOOKMARKS, newBookmarks);
  } else {
    context.workspaceState.update(BOOKMARKS, [
      ...existingBookmarks,
      newBookmark,
    ]);
  }
};

export const removeBookmark = (
  context: vscode.ExtensionContext,
  bookmark: Bookmark
) => {
  const existingBookmarks: Bookmark[] = context.workspaceState.get(BOOKMARKS)!;
  const newBookmarks = [...existingBookmarks];
  const index = newBookmarks.findIndex((bm) => {
    return (
      bm.fileName === bookmark.fileName && bm.lineNumber === bookmark.lineNumber
    );
  });
  newBookmarks.splice(index, 1);
  context.workspaceState.update(BOOKMARKS, newBookmarks);
};
