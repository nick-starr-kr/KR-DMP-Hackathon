// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { handleChatPrompt } from './agent';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of c`ode will only be executed once when your extension is activated
	console.log('Congratulations, your extension "hackathon" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('hackathon.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from Hackathon!');
	});


	const chatHandler: vscode.ChatRequestHandler = async (
		request: vscode.ChatRequest,
		context: vscode.ChatContext,
		stream: vscode.ChatResponseStream,
		token: vscode.CancellationToken
	  ): Promise<vscode.ChatResult> => {
		// Chat request handler implementation goes here
		// Test for the `test` command
		if (request.command === 'testCommand') {
			// Add logic here to handle the test scenario
			stream.progress('You\'re using my test command!');
			// Render a button to trigger a VS Code command
			stream.button({
				command: 'hackathon.helloWorld',
				title: vscode.l10n.t('Run test command')
  			});
			stream.progress(await handleChatPrompt(request.prompt));
			return {};
		  }
		else if (request.command === 'scanForDefects') {
		}
		else if (request.command === 'createJiraTicket') {
		}
		else if (request.command === 'runTestCoverageAnalysis') {
		}
		else if (request.command === 'viewOutstandingTickets') {
		}
		else if (request.command === 'lintChecks') {
		}
		else if (request.command === 'codeExplanation') {
		}
		else if (request.command === 'generateUnitTests') {
		}
		
		// Handle the default case
		else {
			stream.progress(await handleChatPrompt(request.prompt));
		  }

		  return {};
	  };

	// Register the chat participant and its request handler
	const hackChat = vscode.chat.createChatParticipant('chat-participant.hackathon', chatHandler);	

	// Register a follow-up provider
	hackChat.followupProvider = {
		provideFollowups(result: vscode.ChatResult, context: vscode.ChatContext, token: vscode.CancellationToken) {
			if (result.metadata?.command === 'testCommand') {
				return [{
					prompt: 'Do you want to use a followup?',
					label: vscode.l10n.t('Followup Test Example')
				} satisfies vscode.ChatFollowup];
			}
			else if (result.metadata?.command === 'scanForDefects') {
			}
			else if (result.metadata?.command === 'createJiraTicket') {
			}
			else if (result.metadata?.command === 'runTestCoverageAnalysis') {
			}
			else if (result.metadata?.command === 'viewOutstandingTickets') {
			}
			else if (result.metadata?.command === 'lintChecks') {
			}
			else if (result.metadata?.command === 'codeExplanation') {
			}
			else if (result.metadata?.command === 'generateUnitTests') {
			}
		}
	};
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

	context.subscriptions.push(disposable, hackChat, scanCodeForDefects, createJiraTicket, runTestCoverageAnalysis, viewOutstandingTickets, lintChecks, codeExplanation, generateUnitTests);
}

// This method is called when your extension is deactivated
export function deactivate() {}
