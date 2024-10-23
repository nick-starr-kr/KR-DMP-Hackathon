import * as vscode from 'vscode';
import { fetchUsers } from './fetch_users'; 

interface User {
    id: string;
    displayName: string;
}

export class JiraInputModal {
    async show(): Promise<{ title: string; description: string; assignee: { id: string }; reporter: { id: string }; issueType: string }> {
        // Prompt for ticket title
        const title = await vscode.window.showInputBox({ prompt: 'Enter ticket title' });
        
        // Prompt for ticket description
        const description = await vscode.window.showInputBox({ prompt: 'Enter ticket description' });

        // Fetch user IDs and display them for selection
        const users: User[] = await fetchUsers(); // Fetch users from JIRA
        const userItems = users.map(user => ({ label: user.displayName, id: user.id }));

        // Select assignee
        const assignee = await vscode.window.showQuickPick(userItems, { placeHolder: 'Select assignee' });
        
        // Select reporter
        const reporter = await vscode.window.showQuickPick(userItems, { placeHolder: 'Select reporter' });

        // Define available issue types
        const issueTypes = [
            { label: 'Story', value: 'Story' },
            { label: 'Task', value: 'Task' },
            { label: 'Bug', value: 'Bug' }
        ];

        // Select issue type
        const issueType = await vscode.window.showQuickPick(issueTypes, { placeHolder: 'Select issue type' });

        return {
            title: title || '',
            description: description || '',
            assignee: assignee ? { id: assignee.id } : { id: '' }, // Default to empty if not selected
            reporter: reporter ? { id: reporter.id } : { id: '' }, // Default to empty if not selected
            issueType: issueType ? issueType.value : 'Task' // Default to 'Task' if nothing is selected
        };
    }
}

export class SimpleJiraInputModal {
    async show(): Promise<{assignee: { id: string }; reporter: { id: string }; issueType: string }> {

        // Fetch user IDs and display them for selection
        const users: User[] = await fetchUsers(); // Fetch users from JIRA
        const userItems = users.map(user => ({ label: user.displayName, id: user.id }));

        // Select assignee
        const assignee = await vscode.window.showQuickPick(userItems, { placeHolder: 'Select assignee' });
        
        // Select reporter
        const reporter = await vscode.window.showQuickPick(userItems, { placeHolder: 'Select reporter' });

        // Define available issue types
        const issueTypes = [
            { label: 'Story', value: 'Story' },
            { label: 'Task', value: 'Task' },
            { label: 'Bug', value: 'Bug' }
        ];

        // Select issue type
        const issueType = await vscode.window.showQuickPick(issueTypes, { placeHolder: 'Select issue type' });

        return {
            assignee: assignee ? { id: assignee.id } : { id: '' }, // Default to empty if not selected
            reporter: reporter ? { id: reporter.id } : { id: '' }, // Default to empty if not selected
            issueType: issueType ? issueType.value : 'Task' // Default to 'Task' if nothing is selected
        };
    }
}