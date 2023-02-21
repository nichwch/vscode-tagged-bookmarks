import * as vscode from "vscode";

export class TabTreeProvider implements vscode.TreeDataProvider<Space> {
  constructor(private workspaceRoot: string) {}

  getTreeItem(element: Space): vscode.TreeItem {
    return element;
  }

  getChildren(element?: Space): Thenable<Space[]> {
    return Promise.resolve([]);
  }
}

class Space extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
    this.tooltip = `${this.label}`;
    this.description = "hello world";
  }
}
