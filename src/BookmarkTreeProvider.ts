import * as vscode from "vscode";
import { Bookmark, BOOKMARKS, CURRENT_TAG } from "./bookmarkStateManager";
export class BookmarkTreeProvider implements vscode.TreeDataProvider<Bookmark> {
  private currentTags: string | null = null;
  private bookmarks: Bookmark[] = [];
  private context: vscode.ExtensionContext;
  constructor(context: vscode.ExtensionContext) {
    this.context = context;
    const focusedTag = context.workspaceState.get(CURRENT_TAG) as string;
    if (focusedTag) {
      this.bookmarks = this.getBookmarksForTag(focusedTag);
    }
  }

  getTreeItem(bookmark: Bookmark): vscode.TreeItem {
    const tagsText = bookmark;
    const label = `${bookmark.fileName}:${bookmark.lineNumber}`;
    const treeItem = new vscode.TreeItem(
      label,
      vscode.TreeItemCollapsibleState.None
    );
    treeItem.contextValue = "bookmark";
    treeItem.tooltip = label;
    treeItem.command = {
      title: "Toggle Tag",
      command: "gestalt.openBookmark",
      arguments: [bookmark.fileName, bookmark.lineNumber],
    };
    return treeItem;
  }

  getChildren(element: Bookmark): Thenable<Bookmark[]> {
    return Promise.resolve(this.bookmarks!);
  }

  private _onDidChangeTreeData: vscode.EventEmitter<
    Bookmark | undefined | null | void
  > = new vscode.EventEmitter<Bookmark | undefined | null | void>();

  readonly onDidChangeTreeData: vscode.Event<
    Bookmark | undefined | null | void
  > = this._onDidChangeTreeData.event;

  private getBookmarksForTag(tag: string): Bookmark[] {
    const allBookmarks: Bookmark[] =
      this.context.workspaceState.get(BOOKMARKS)!;

    const bookmarksWithTags = allBookmarks.filter((bm) => {
      return bm.tags.includes(tag);
    });
    return bookmarksWithTags;
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
    const focusedTag = this.context.workspaceState.get(CURRENT_TAG) as string;
    if (focusedTag) {
      this.bookmarks = this.getBookmarksForTag(focusedTag);
    }
  }
}
