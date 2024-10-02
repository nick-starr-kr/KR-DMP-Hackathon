// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

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

	// Scan Code for Defects
    let scanCodeForDefects = vscode.commands.registerCommand('hackathon.scanCodeForDefects', () => {
        vscode.window.showInformationMessage('Scanning code for defects...');
        // TODO: Call linting function here
    });
    
    // Create JIRA Ticket for Defects
    let createJiraTicket = vscode.commands.registerCommand('hackathon.createJiraTicket', () => {
        vscode.window.showInformationMessage('Creating JIRA ticket...');
        // TODO: Call JIRA integration function here
    });

	// Run Test Coverage Analysis
    let runTestCoverageAnalysis = vscode.commands.registerCommand('hackathon.runTestCoverageAnalysis', () => {
        vscode.window.showInformationMessage('Running test coverage analysis...');
        // TODO: Call the function to run test coverage analysis
    });
	
	// View Outstanding JIRA Tickets for the codebase
    let viewOutstandingTickets = vscode.commands.registerCommand('hackathon.viewOutstandingTickets', () => {
        vscode.window.showInformationMessage('Gathering outstanding JIRA Tickets...');
        // TODO: Call the function to view outstanding JIRA Tickets
    });

	// Lint check
    let lintChecks = vscode.commands.registerCommand('hackathon.lintChecks', () => {
        vscode.window.showInformationMessage('Running a lint check...');
        // TODO: Call the function to conduct a lint check
    });

	// Explain Code
    let codeExplanation = vscode.commands.registerCommand('hackathon.codeExplanation', () => {
        vscode.window.showInformationMessage('Collecting explanation for the code...');
        // TODO: Call the function to explain a given code
    });

	// Generate Unit Tests
    let generateUnitTests = vscode.commands.registerCommand('hackathon.generateUnitTests', () => {
        vscode.window.showInformationMessage('Generating unit tests...');
        // TODO: Call the function to generate unit tests
    });

	context.subscriptions.push(disposable, scanCodeForDefects, createJiraTicket, runTestCoverageAnalysis, viewOutstandingTickets, lintChecks, codeExplanation, generateUnitTests);
}

// This method is called when your extension is deactivated
export function deactivate() {}
