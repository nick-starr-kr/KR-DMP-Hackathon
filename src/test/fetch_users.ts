import * as vscode from 'vscode';

// Define a User interface based on the expected structure from JIRA API
interface JiraUser {
    accountId: string; // ID used by JIRA for the user
    displayName: string; // Display name of the user
}

export async function fetchUsers(): Promise<{ id: string; displayName: string }[]> {
    const jiraApiUrl = 'https://anushachitranshi.atlassian.net/rest/api/2/users';
    const email = process.env.ATLASSIAN_EMAIL || "anusha.chitranshi@gmail.com";
    const apiToken = process.env.ATLASSIAN_API_TOKEN;

    const fetch = await import('node-fetch').then(mod => mod.default);

    try {
        const response = await fetch(jiraApiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch users: ${response.status} - ${response.statusText}`);
        }

        // Cast the response to the expected type
        const users: JiraUser[] = await response.json() as any;

        // Map the users to the required format
        return users.map((user) => ({
            id: user.accountId, // JIRA user ID
            displayName: user.displayName // User's display name
        }));
    } catch (error) {
        vscode.window.showErrorMessage(`Error fetching users: ${error}`);
        return [];
    }
}


