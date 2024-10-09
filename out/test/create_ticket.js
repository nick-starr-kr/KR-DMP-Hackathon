"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createJiraTicket;
const vscode = __importStar(require("vscode"));
const fetch = async () => (await import('node-fetch')).default;
const jira_input_modal_1 = require("./jira_input_modal"); // Ensure this imports correctly
const dotenv = require('dotenv');
dotenv.config();
const email = process.env.ATLASSIAN_EMAIL || "anusha.chitranshi@gmail.com";
const apiToken = process.env.ATLASSIAN_API_TOKEN || "ATATT3xFfGF0copIlxDooU627jALZJ7JL6bBkxBH__TXokM-fSmY-qCrQyCFni3EVSvZHL8eV9CcviFANcA2oUsmcg5LObHgH55dAt4Zktwzl25kVghbY7dl7-TjFFuOuvMlfZsCAglCepwR2tWqgcOQ5mjpc_shGGa3EX_WkQ2CerG6CAet1Ck=7FEFDAD8";
if (!email || !apiToken) {
    throw new Error("Missing JIRA credentials: Please set JIRA_EMAIL and JIRA_API_TOKEN in the .env file.");
}
async function createJiraTicket() {
    const jiraInputModal = new jira_input_modal_1.JiraInputModal();
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
        });
        if (response.ok) {
            const responseData = await response.json();
            vscode.window.showInformationMessage(`JIRA ticket created successfully: ${responseData.key}`);
        }
        else {
            const errorText = await response.text();
            vscode.window.showErrorMessage(`Error creating JIRA ticket: ${response.status} - ${response.statusText} - ${errorText}`);
        }
    }
    catch (error) {
        vscode.window.showErrorMessage(`Error creating JIRA ticket: ${String(error)}`);
    }
}
//# sourceMappingURL=create_ticket.js.map