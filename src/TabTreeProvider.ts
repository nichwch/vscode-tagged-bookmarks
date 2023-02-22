import * as vscode from "vscode";
import { Bookmark } from "./bookmarkStateManager";

export class TabTreeProvider implements vscode.TreeDataProvider<Bookmark> {
  private bookmarks: Bookmark[] = [];
  private onDidChangeTreeDataEmitter = new vscode.EventEmitter<
    Bookmark | undefined
  >();
  // readonly onDidChangeTreeData = this.onDidChangeTreeDataEmitter.event;

  constructor(bookmarks: Bookmark[]) {
    this.bookmarks = bookmarks;
  }

  getTreeItem(bookmark: Bookmark): vscode.TreeItem {
    const tagsText =
      bookmark.tags.length > 0 ? `(${bookmark.tags.join(", ")})` : "";
    const label = `${bookmark.fileName}:${bookmark.lineNumber + 1} ${tagsText}`;
    const treeItem = new vscode.TreeItem(
      label,
      vscode.TreeItemCollapsibleState.None
    );
    treeItem.contextValue = "bookmark";
    treeItem.tooltip = label;
    return treeItem;
  }

  getChildren(element: Bookmark): Thenable<Bookmark[]> {
    if (element) {
      return Promise.resolve([]);
    }
    return Promise.resolve(this.bookmarks);
  }

  private _onDidChangeTreeData: vscode.EventEmitter<
    Bookmark | undefined | null | void
  > = new vscode.EventEmitter<Bookmark | undefined | null | void>();

  readonly onDidChangeTreeData: vscode.Event<
    Bookmark | undefined | null | void
  > = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }
}
// TODO:
