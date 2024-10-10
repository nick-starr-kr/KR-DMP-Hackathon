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
exports.fetchUsers = fetchUsers;
const vscode = __importStar(require("vscode"));
async function fetchUsers() {
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
        const users = await response.json();
        // Map the users to the required format
        return users.map((user) => ({
            id: user.accountId, // JIRA user ID
            displayName: user.displayName // User's display name
        }));
    }
    catch (error) {
        vscode.window.showErrorMessage(`Error fetching users: ${error}`);
        return [];
    }
}
//# sourceMappingURL=fetch_users.js.map