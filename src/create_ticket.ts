import * as vscode from 'vscode';
import axios from 'axios';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();
const email = process.env.ATLASSIAN_EMAIL;
const apiToken = process.env.ATLASSIAN_API_TOKEN;

if (!email || !apiToken) {
    throw new Error("Missing JIRA credentials: Please set JIRA_EMAIL and JIRA_API_TOKEN in the .env file.");
}

export default async function createJiraTicket() {
    // Sample data, you may replace this with actual user input
    const title = await vscode.window.showInputBox({ prompt: 'Enter ticket title' });
    const description = await vscode.window.showInputBox({ prompt: 'Enter ticket description' });
    const assignee = await vscode.window.showInputBox({ prompt: 'Enter assignee' });
    const reporter = await vscode.window.showInputBox({ prompt: 'Enter reporter' });

    const jiraApiUrl = "https://anushachitranshi.atlassian.net/rest/api/2/issue";

    // Sample JIRA ticket payload
    const payload = {
        fields: {
            project: {
                key: 'SCRUM', 
            },
            summary: title || 'Default Title',
            description: description || 'Default Description',
            issuetype: {
                name: 'Task', // Change as needed
            },
            assignee: {
                name: assignee || 'defaultAssignee', // Assignee field
            },
            reporter: {
                name: reporter || 'defaultReporter', // Reporter field
            },
        },
    };
    vscode.window.showInformationMessage('Running test coverage analysis...');
    // API Call
    try {
        const response = await axios.post(jiraApiUrl, payload, {
            auth: {
                username: email || "", // Load from environment variable
                password: apiToken || "", // Load from environment variable
            },
            headers: {
                'Content-Type': 'application/json',
            },
        });
        vscode.window.showInformationMessage(`JIRA ticket created successfully: ${response.data.key}`);
        
    } catch (error: unknown) { // Explicitly typing error as unknown
        if (axios.isAxiosError(error)) {
            // Handle axios error
            vscode.window.showErrorMessage(`Error creating JIRA ticket: ${error.response?.data?.message || error.message}`);
        } else {
            // Handle generic error
            vscode.window.showErrorMessage(`Error creating JIRA ticket: ${String(error)}`);
        }
    }
    }
