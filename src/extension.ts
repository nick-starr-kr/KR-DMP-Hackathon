// The module 'vscode' contains the VS Code extensibility API
import * as vscode from 'vscode';
import createJiraTicket from './create_ticket'; // Ensure correct path and export

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
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
    let createJiraTicketDisposable = vscode.commands.registerCommand('hackathon.createJiraTicket', () => {
        vscode.window.showInputBox({ prompt: 'Enter ticket title' });
    });

    // Run Test Coverage Analysis Command
    let runTestCoverageAnalysisDisposable = vscode.commands.registerCommand('hackathon.runTestCoverageAnalysis', () => {
        vscode.window.showInformationMessage('Running test coverage analysis...');
        // TODO: Call the function to run test coverage analysis
    });

    // View Outstanding JIRA Tickets Command
    let viewOutstandingTicketsDisposable = vscode.commands.registerCommand('hackathon.viewOutstandingTickets', () => {
        vscode.window.showInformationMessage('Gathering outstanding JIRA Tickets...');
        // TODO: Call the function to view outstanding JIRA Tickets
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

    // Add all disposables to context subscriptions
    context.subscriptions.push(
        helloWorldDisposable,
        scanCodeForDefectsDisposable,
        createJiraTicketDisposable,
        runTestCoverageAnalysisDisposable,
        viewOutstandingTicketsDisposable,
        lintChecksDisposable,
        codeExplanationDisposable,
        generateUnitTestsDisposable
    );
}

// This method is called when your extension is deactivated
export function deactivate() {}
