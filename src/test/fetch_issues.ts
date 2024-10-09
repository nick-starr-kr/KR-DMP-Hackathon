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
    const apiToken = process.env.ATLASSIAN_API_TOKEN || "ATATT3xFfGF0copIlxDooU627jALZJ7JL6bBkxBH__TXokM-fSmY-qCrQyCFni3EVSvZHL8eV9CcviFANcA2oUsmcg5LObHgH55dAt4Zktwzl25kVghbY7dl7-TjFFuOuvMlfZsCAglCepwR2tWqgcOQ5mjpc_shGGa3EX_WkQ2CerG6CAet1Ck=7FEFDAD8";

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
