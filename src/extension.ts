// The module 'vscode' contains the VS Code extensibility API
import * as vscode from 'vscode';
import createJiraTicket from './test/create_ticket'; 
import { fetchAssignedIssues } from './test/fetch_issues';
import { fetchUsers } from './test/fetch_users'; 
import { analyzeCodeQuality, explainCode, handleChatPrompt } from './agent';

interface HackChatResult extends vscode.ChatResult {
    metadata: {
        command: string;
    }
}

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
    let createJiraTicketDisposable = vscode.commands.registerCommand('hackathon.createJiraTicket', createJiraTicket);

    // Run Test Coverage Analysis Command
    let runTestCoverageAnalysisDisposable = vscode.commands.registerCommand('hackathon.runTestCoverageAnalysis', () => {
        vscode.window.showInformationMessage('Running test coverage analysis...');
        console.log(process.env.ATLASSIAN_EMAIL);
        // TODO: Call the function to run test coverage analysis
    });

    // View Outstanding JIRA Tickets Command
    let viewOutstandingTicketsDisposable = vscode.commands.registerCommand('hackathon.viewOutstandingTickets', async () => {
        vscode.window.showInformationMessage('Fetching assigned JIRA issues...');

        const users = await fetchUsers();
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
    
            const issues = await fetchAssignedIssues(selectedUser.accountId);

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
        } else {
            vscode.window.showWarningMessage('No issues found assigned to you.');
        }
    } else {
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

    const chatHandler: vscode.ChatRequestHandler = async (
		request: vscode.ChatRequest,
		context: vscode.ChatContext,
		stream: vscode.ChatResponseStream,
		token: vscode.CancellationToken
	  ): Promise<HackChatResult> => {
        //get reference to the active text editor
        const editor = vscode.window.activeTextEditor;
    
        if (!editor) {
            stream.progress('No active editor');
            return { metadata: { command: '' } };
        }
    
        const documentUri = editor.document.uri;
        const selection = editor.selection;
        const selectedText = editor.document.getText(selection);
        
        if (!selectedText) {
            stream.progress('No text selected');
            return { metadata: { command: '' } };
        }
    
        const fileName = documentUri.path.split('/').pop(); // Extracts the file name from the full path
        const lineNumber = selection.start.line + 1;
    
        const referenceButton = `[${fileName}:${lineNumber}](command:vscode.open?${encodeURIComponent(JSON.stringify({
            scheme: 'file',
            path: documentUri.path,
            fragment: `${lineNumber}`
        }))} "Open ${fileName} at line ${lineNumber}")`;
        
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
            return { metadata: { command: request.command } };
		  } 
		else if (request.command === 'scanForDefects') {
            const document = vscode.window.activeTextEditor?.document;
            stream.markdown("Referenced from: " + referenceButton + "\n\n");

            if (document !== undefined) {
                const uri = document.uri;
                let diagnostics = vscode.languages.getDiagnostics(uri);
                const code = document.getText();
                console.log(JSON.stringify(diagnostics));
                stream.progress(await analyzeCodeQuality(JSON.stringify(diagnostics), code));
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
                const text = await explainCode(selectedText);
                stream.markdown(text);
            } else {
                vscode.window.showInformationMessage('No active editor found');
            }
		}
		else if (request.command === 'generateUnitTests') {
		}
		else {
		    stream.progress(await handleChatPrompt(request.prompt));
            return { metadata: { command: '' }};
		  }
          return { metadata: { command: '' }};
        };

    // Register the chat participant and its request handler
	const hackChat = vscode.chat.createChatParticipant('chat-participant.hackathon', chatHandler);	

    // Register a follow-up provider
	hackChat.followupProvider = {
		provideFollowups(result: HackChatResult, context: vscode.ChatContext, token: vscode.CancellationToken) {
			if (result.metadata.command === 'testCommand') {
				return [{
					prompt: 'Do you want to use a followup?',
					label: vscode.l10n.t('Followup Test Example')
				} satisfies vscode.ChatFollowup];
			}
			else if (result.metadata.command === 'scanForDefects') {
                return [{
					prompt: 'Just testing this out!',
					label: vscode.l10n.t('Would you like to create a Jira ticket for these improvements?')
				} satisfies vscode.ChatFollowup];
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
    context.subscriptions.push(
        helloWorldDisposable,
        scanCodeForDefectsDisposable,
        createJiraTicketDisposable,
        runTestCoverageAnalysisDisposable,
        viewOutstandingTicketsDisposable,
        lintChecksDisposable,
        codeExplanationDisposable,
        generateUnitTestsDisposable,
        hackChat
    );
}

// This method is called when your extension is deactivated
export function deactivate() {}
