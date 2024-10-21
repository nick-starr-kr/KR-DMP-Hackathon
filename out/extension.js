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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
// The module 'vscode' contains the VS Code extensibility API
const vscode = __importStar(require("vscode"));
const create_ticket_1 = __importDefault(require("./test/create_ticket"));
const fetch_issues_1 = require("./test/fetch_issues");
const fetch_users_1 = require("./test/fetch_users");
const agent_1 = require("./agent");
// This method is called when your extension is activated
function activate(context) {
    console.log('Congratulations, your extension "hackathon" is now active!');
    // Hello World Command
    let helloWorldDisposable = vscode.commands.registerCommand('hackathon.helloWorld', () => {
        vscode.window.showInformationMessage('Hello World from Hackathon!');
    });
    // Scan Code for Defects Command
    let scanCodeForDefectsDisposable = vscode.commands.registerCommand('hackathon.scanCodeForDefects', () => {
        vscode.window.showInformationMessage('Scanning code for defects...');
        // TODO: Call linting function here
    });
    // Create JIRA Ticket Command
    let createJiraTicketDisposable = vscode.commands.registerCommand('hackathon.createJiraTicket', create_ticket_1.default);
    // Run Test Coverage Analysis Command
    let runTestCoverageAnalysisDisposable = vscode.commands.registerCommand('hackathon.runTestCoverageAnalysis', () => {
        vscode.window.showInformationMessage('Running test coverage analysis...');
        console.log(process.env.ATLASSIAN_EMAIL);
        // TODO: Call the function to run test coverage analysis
    });
    // View Outstanding JIRA Tickets Command
    let viewOutstandingTicketsDisposable = vscode.commands.registerCommand('hackathon.viewOutstandingTickets', async () => {
        vscode.window.showInformationMessage('Fetching assigned JIRA issues...');
        const users = await (0, fetch_users_1.fetchUsers)();
        if (users.length === 0) {
            vscode.window.showWarningMessage('No JIRA users found.');
            return;
        }
        const userItems = users.map(user => ({
            label: user.displayName,
            accountId: user.id
        }));
        const selectedUser = await vscode.window.showQuickPick(userItems, {
            placeHolder: 'Select a JIRA user to view their assigned issues',
            canPickMany: false
        });
        if (selectedUser) {
            vscode.window.showInformationMessage(`Fetching issues for ${selectedUser.label}...`);
            const issues = await (0, fetch_issues_1.fetchAssignedIssues)(selectedUser.accountId);
            if (issues.length > 0) {
                const issueItems = issues.map(issue => ({
                    label: `${issue.key} - ${issue.fields.summary}`,
                    detail: `Assigned to: ${issue.fields.assignee.displayName}`,
                    url: `https://anushachitranshi.atlassian.net/browse/${issue.key}`
                }));
                const selectedIssue = await vscode.window.showQuickPick(issueItems, {
                    placeHolder: 'Select a JIRA issue to view details',
                    canPickMany: false
                });
                if (selectedIssue) {
                    vscode.env.openExternal(vscode.Uri.parse(selectedIssue.url));
                }
            }
            else {
                vscode.window.showWarningMessage('No issues found assigned to you.');
            }
        }
        else {
            vscode.window.showWarningMessage('No user selected.');
        }
    });
    // Lint Checks Command
    let lintChecksDisposable = vscode.commands.registerCommand('hackathon.lintChecks', () => {
        vscode.window.showInformationMessage('Running a lint check...');
        // TODO: Call the function to conduct a lint check
    });
    // Explain Code Command
    let codeExplanationDisposable = vscode.commands.registerCommand('hackathon.codeExplanation', () => {
        vscode.window.showInformationMessage('Collecting explanation for the code...');
        // TODO: Call the function to explain a given code
    });
    // Generate Unit Tests Command
    let generateUnitTestsDisposable = vscode.commands.registerCommand('hackathon.generateUnitTests', () => {
        vscode.window.showInformationMessage('Generating unit tests...');
        // TODO: Call the function to generate unit tests
    });
    const chatHandler = async (request, chatContext, stream, token) => {
        // Chat request handler implementation goes here
        // Test for the `test` command
        // Using workspace name to store unique conversation history per workspace
        const workspaceName = vscode.workspace.name || 'defaultWorkspace';
        const conversationKey = `chatHistory_${workspaceName}`;
        // Retrieve conversation history for the current user from workspaceState or globalState
        const previousConversation = context.workspaceState.get(conversationKey) || [];
        // Show the previous conversation (if any)
        // if (previousConversation.length > 0) {
        //     stream.markdown(`**Previous Conversations:**\n${previousConversation.join('\n')}`);
        // }
        let botResponse = '';
        if (request.command === 'testCommand') {
            stream.progress('You\'re using my test command!');
            stream.button({
                command: 'hackathon.helloWorld',
                title: vscode.l10n.t('Run test command')
            });
            botResponse = await (0, agent_1.handleChatPrompt)(request.prompt);
            stream.progress(botResponse);
        }
        else if (request.command === 'scanForDefects') {
            const document = vscode.window.activeTextEditor?.document;
            if (document !== undefined) {
                const uri = document.uri;
                let diagnostics = vscode.languages.getDiagnostics(uri);
                const code = document.getText();
                console.log(JSON.stringify(diagnostics));
                stream.progress(await (0, agent_1.analyzeCodeQuality)(JSON.stringify(diagnostics), code));
            }
            return { metadata: { command: request.command } };
        }
        else if (request.command === 'createJiraTicket') {
            // Prompt for different parts of the Jira ticket
            // What is the name of the function
            // What is the description of the function
            // Recommended changes
            // List of acceptance criteria
        }
        else if (request.command === 'runTestCoverageAnalysis') {
        }
        else if (request.command === 'viewOutstandingTickets') {
        }
        else if (request.command === 'lintChecks') {
        }
        else if (request.command === 'codeExplanation') {
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                const selection = editor.selection;
                const selectedText = editor.document.getText(selection);
                vscode.window.showInformationMessage(`Selected text: ${selectedText}`);
                const text = await (0, agent_1.explainCode)(selectedText);
                stream.markdown(text);
            }
            else {
                vscode.window.showInformationMessage('No active editor found');
            }
        }
        else if (request.command === 'generateUnitTests') {
        }
        else {
            botResponse = await (0, agent_1.handleChatPrompt)(request.prompt);
            stream.progress(botResponse);
        }
        // Append the new chat input and response to the conversation history
        previousConversation.push(`User: ${request.prompt}`);
        previousConversation.push(`Bot: ${botResponse}`);
        // Save the updated conversation history
        context.workspaceState.update(conversationKey, previousConversation);
        return { metadata: { command: '' } };
    };
    // Register the chat participant and its request handler
    const hackChat = vscode.chat.createChatParticipant('chat-participant.hackathon', chatHandler);
    // Register a follow-up provider
    hackChat.followupProvider = {
        provideFollowups(result, context, token) {
            if (result.metadata.command === 'testCommand') {
                return [{
                        prompt: 'Do you want to use a followup?',
                        label: vscode.l10n.t('Followup Test Example')
                    }];
            }
            else if (result.metadata.command === 'scanForDefects') {
                return [{
                        prompt: 'Just testing this out!',
                        label: vscode.l10n.t('Would you like to create a Jira ticket for these improvements?')
                    }];
            }
            else if (result.metadata.command === 'createJiraTicket') {
            }
            else if (result.metadata.command === 'runTestCoverageAnalysis') {
            }
            else if (result.metadata.command === 'viewOutstandingTickets') {
            }
            else if (result.metadata.command === 'lintChecks') {
            }
            else if (result.metadata.command === 'codeExplanation') {
            }
            else if (result.metadata.command === 'generateUnitTests') {
            }
        }
    };
    // Add all disposables to context subscriptions
    context.subscriptions.push(helloWorldDisposable, scanCodeForDefectsDisposable, createJiraTicketDisposable, runTestCoverageAnalysisDisposable, viewOutstandingTicketsDisposable, lintChecksDisposable, codeExplanationDisposable, generateUnitTestsDisposable, hackChat);
}
// This method is called when your extension is deactivated
function deactivate() { }
//# sourceMappingURL=extension.js.map