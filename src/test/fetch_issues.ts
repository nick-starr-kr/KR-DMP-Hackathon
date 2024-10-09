import * as vscode from 'vscode';

interface JiraIssue {
    id: string;
    key: string;
    fields: {
        summary: string;
        assignee: {
            displayName: string;
        };
    };
}

export async function fetchAssignedIssues(userAccountId: string): Promise<JiraIssue[]> {
    const jiraApiUrl = `https://anushachitranshi.atlassian.net/rest/api/2/search?jql=assignee=${userAccountId}`;
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
            throw new Error(`Failed to fetch assigned issues: ${response.status} - ${response.statusText}`);
        }

        // Parse the response as JSON
        const data = await response.json() as any;

        // Return the list of issues assigned to the user
        return data.issues.map((issue: any) => ({
            id: issue.id,
            key: issue.key,
            fields: {
                summary: issue.fields.summary,
                assignee: {
                    displayName: issue.fields.assignee.displayName
                }
            }
        }));
    } catch (error) {
        vscode.window.showErrorMessage(`Error fetching assigned issues: ${error}`);
        return [];
    }
}
