import * as vscode from "vscode";
import { Bookmark, BOOKMARKS } from "./bookmarkStateManager";

const SHOW_ALL_BOOKMARKS = "show all bookmarks";
export class TagDisplayProvider implements vscode.TreeDataProvider<string> {
  private bookmarks: Bookmark[] = [];
  private context: vscode.ExtensionContext;

  constructor(context: vscode.ExtensionContext) {
    const bookmarks: Bookmark[] = context.workspaceState.get(BOOKMARKS)!;
    this.bookmarks = bookmarks;
    this.context = context;
  }

  getTreeItem(tag: string): vscode.TreeItem {
    const tagsText = tag;
    const label = tag;
    const treeItem = new vscode.TreeItem(
      label,
      vscode.TreeItemCollapsibleState.None
    );
    treeItem.contextValue = "bookmark";
    treeItem.tooltip = label;
    if (tag === SHOW_ALL_BOOKMARKS) {
      treeItem.command = {
        title: "Toggle Tag",
        command: "gestalt.toggleTag",
        arguments: [null],
      };
    } else {
      treeItem.command = {
        title: "Toggle Tag",
        command: "gestalt.toggleTag",
        arguments: [tag],
      };
    }

    return treeItem;
  }

  getChildren(element: string): Thenable<string[]> {
    if (element) {
      return Promise.resolve([]);
    }
    // get all unique tags from bookmarks
    const tagSet = new Set<string>();
    this.bookmarks.forEach((bm) => {
      bm.tags.forEach((tag) => tagSet.add(tag));
    });
    const tags = Array.from(tagSet);
    return Promise.resolve([SHOW_ALL_BOOKMARKS, ...tags]);
  }

  private _onDidChangeTreeData: vscode.EventEmitter<
    string | undefined | null | void
  > = new vscode.EventEmitter<string | undefined | null | void>();

  readonly onDidChangeTreeData: vscode.Event<string | undefined | null | void> =
    this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
    const bookmarks: Bookmark[] = this.context.workspaceState.get(BOOKMARKS)!;
    this.bookmarks = bookmarks;
  }
}
