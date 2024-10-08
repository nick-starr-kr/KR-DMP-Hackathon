import * as vscode from 'vscode';
import axios from 'axios';
import * as dotenv from 'dotenv';
import { JiraInputModal } from './jira_input_modal';

// Load environment variables from .env file
dotenv.config();
const email = process.env.ATLASSIAN_EMAIL;
const apiToken = process.env.ATLASSIAN_API_TOKEN;

if (!email || !apiToken) {
    throw new Error("Missing JIRA credentials: Please set JIRA_EMAIL and JIRA_API_TOKEN in the .env file.");
}

export default async function createJiraTicket() {
    const jiraInputModal = new JiraInputModal();
    const { title, description, assignee, reporter } = await jiraInputModal.show();

    const jiraApiUrl = "https://anushachitranshi.atlassian.net/rest/api/2/issue";

    const payload = {
        fields: {
            project: {
                key: 'SCRUM',
            },
            summary: title,
            description: description,
            issuetype: [{
                name: 'Task', // Change as needed
            },
            {
                name: 'Bug'
            },
            {
                name: 'Story'
            }],
            assignee: {
                name: assignee, // Assignee field
            },
            reporter: {
                name: reporter, // Reporter field
            },
        },
    };

    vscode.window.showInformationMessage('Running test coverage analysis...');

    // API Call to create the JIRA ticket
    try {
        const response = await axios.post(jiraApiUrl, payload, {
            auth: {
                username: email || "",
                password: apiToken || "",
            },
            headers: {
                'Content-Type': 'application/json',
            },
        });
        vscode.window.showInformationMessage(`JIRA ticket created successfully: ${response.data.key}`);

    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            vscode.window.showErrorMessage(`Error creating JIRA ticket: ${error.response?.data?.message || error.message}`);
        } else {
            vscode.window.showErrorMessage(`Error creating JIRA ticket: ${String(error)}`);
        }
    }
}
