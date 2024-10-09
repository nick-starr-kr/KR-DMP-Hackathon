import * as vscode from 'vscode';
const fetch = async () => (await import('node-fetch')).default;
import { JiraInputModal } from './jira_input_modal'; // Ensure this imports correctly
const dotenv = require('dotenv');
dotenv.config();

const email = process.env.ATLASSIAN_EMAIL || "anusha.chitranshi@gmail.com";
const apiToken = process.env.ATLASSIAN_API_TOKEN || "ATATT3xFfGF0copIlxDooU627jALZJ7JL6bBkxBH__TXokM-fSmY-qCrQyCFni3EVSvZHL8eV9CcviFANcA2oUsmcg5LObHgH55dAt4Zktwzl25kVghbY7dl7-TjFFuOuvMlfZsCAglCepwR2tWqgcOQ5mjpc_shGGa3EX_WkQ2CerG6CAet1Ck=7FEFDAD8";

if (!email || !apiToken) {
    throw new Error("Missing JIRA credentials: Please set JIRA_EMAIL and JIRA_API_TOKEN in the .env file.");
}

export default async function createJiraTicket() {
    const jiraInputModal = new JiraInputModal();
    const { title, description, assignee, reporter, issueType } = await jiraInputModal.show();

    const bodyData = JSON.stringify({
        fields: {
            project: {
                key: 'SCRUM',
            },
            summary: title,
            description: description,
            issuetype: {
                name: issueType, 
            },
            assignee: {
                id: assignee.id, 
            },
            reporter: {
                id: reporter.id, 
            }
        }
    });

    const jiraApiUrl = "https://anushachitranshi.atlassian.net/rest/api/2/issue";

    try {
        const fetchFn = await fetch();
        const response = await fetchFn(jiraApiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: bodyData
        }) as unknown as Response;

        if (response.ok) {
            const responseData = await response.json();
            vscode.window.showInformationMessage(`JIRA ticket created successfully: ${responseData.key}`);
        } else {
            const errorText = await response.text();
            vscode.window.showErrorMessage(`Error creating JIRA ticket: ${response.status} - ${response.statusText} - ${errorText}`);
        }
    } catch (error: unknown) {
        vscode.window.showErrorMessage(`Error creating JIRA ticket: ${String(error)}`);
    }
}
