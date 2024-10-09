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
exports.fetchAssignedIssues = fetchAssignedIssues;
const vscode = __importStar(require("vscode"));
async function fetchAssignedIssues(userAccountId) {
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
        const data = await response.json();
        // Return the list of issues assigned to the user
        return data.issues.map((issue) => ({
            id: issue.id,
            key: issue.key,
            fields: {
                summary: issue.fields.summary,
                assignee: {
                    displayName: issue.fields.assignee.displayName
                }
            }
        }));
    }
    catch (error) {
        vscode.window.showErrorMessage(`Error fetching assigned issues: ${error}`);
        return [];
    }
}
//# sourceMappingURL=fetch_issues.js.map