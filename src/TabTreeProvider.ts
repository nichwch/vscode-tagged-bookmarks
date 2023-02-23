import * as vscode from "vscode";
import { Bookmark } from "./bookmarkStateManager";

export class TagDisplayProvider implements vscode.TreeDataProvider<string> {
  private bookmarks: Bookmark[] = [];

  constructor(bookmarks: Bookmark[]) {
    this.bookmarks = bookmarks;
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
    return Promise.resolve(tags);
  }

  private _onDidChangeTreeData: vscode.EventEmitter<
    string | undefined | null | void
  > = new vscode.EventEmitter<string | undefined | null | void>();

  readonly onDidChangeTreeData: vscode.Event<string | undefined | null | void> =
    this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }
}
// TODO:
