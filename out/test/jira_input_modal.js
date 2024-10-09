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
exports.JiraInputModal = void 0;
const vscode = __importStar(require("vscode"));
const fetch_users_1 = require("./fetch_users");
class JiraInputModal {
    async show() {
        // Prompt for ticket title
        const title = await vscode.window.showInputBox({ prompt: 'Enter ticket title' });
        // Prompt for ticket description
        const description = await vscode.window.showInputBox({ prompt: 'Enter ticket description' });
        // Fetch user IDs and display them for selection
        const users = await (0, fetch_users_1.fetchUsers)(); // Fetch users from JIRA
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
exports.JiraInputModal = JiraInputModal;
//# sourceMappingURL=jira_input_modal.js.map