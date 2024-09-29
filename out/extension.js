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
exports.activate = activate;
exports.deactivate = deactivate;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = __importStar(require("vscode"));
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "hackathon" is now active!');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    const disposable = vscode.commands.registerCommand('hackathon.helloWorld', () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World from Hackathon!');
    });
    context.subscriptions.push(disposable);
    // Define the chat request handler for "testcase-error-finder"
    const handler = async (request, chatContext, stream, token) => {
        // Check the command invoked in the chat input
        switch (request.command) {
            case 'finderrors':
                stream.markdown('Analyzing test cases for errors...');
                stream.markdown('Test case error: Missing assertion in line 12.');
                break;
            case 'createJiraTicket':
                stream.markdown('Creating a Jira ticket...');
                stream.markdown('Jira ticket created for the error.');
                break;
            default:
                stream.markdown('Unknown command. Try /finderrors or /createJiraTicket.');
                break;
        }
    };
    // Register the chat participant "testcase-error-finder"
    const errorFinder = vscode.chat.createChatParticipant('testcase-error-finder', handler);
    // Optionally set an icon for the chat participant
    // errorFinder.iconPath = vscode.Uri.joinPath(context.extensionUri, 'cat.jpeg');
}
// This method is called when your extension is deactivated
function deactivate() { }
//# sourceMappingURL=extension.js.map