import * as vscode from 'vscode';

export class JiraInputModal {
    // Method to show the modal and get user input
    public async show(): Promise<{ title: string; description: string; assignee: string; reporter: string }> {
        const title = await vscode.window.showInputBox({ prompt: 'Enter ticket title' });
        const description = await vscode.window.showInputBox({ prompt: 'Enter ticket description' });
        const assignee = await vscode.window.showInputBox({ prompt: 'Enter assignee' });
        const reporter = await vscode.window.showInputBox({ prompt: 'Enter reporter' });

        return {
            title: title || 'Default Title',
            description: description || 'Default Description',
            assignee: assignee || 'defaultAssignee',
            reporter: reporter || 'defaultReporter'
        };
    }
}
