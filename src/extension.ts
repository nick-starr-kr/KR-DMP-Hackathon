// The module 'vscode' contains the VS Code extensibility API
import * as vscode from 'vscode';
import { createJiraTicket, createJiraTicketLLM } from './test/create_ticket'; 
import { fetchAssignedIssues } from './test/fetch_issues';
import { fetchUsers } from './test/fetch_users'; 
import { analyzeCodeQuality, analyzeTestCoverage, explainCode, createTicket, generateUnitTests, handleChatPrompt, handleGenericChatPrompt } from './agent';
import parseLCOV from 'parse-lcov';

interface HackChatResult extends vscode.ChatResult {
    metadata: {
        command: string;
    }
}

const DEFAULT_REPORTER = { id: '' };
const DEFAULT_ASSIGNEE = { id: '' };
const DEFAULT_TYPE = "Task";

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "hackathon" is now active!');

    // Hello World Command
    let helloWorldDisposable = vscode.commands.registerCommand('hackathon.helloWorld', () => {
        vscode.window.showInformationMessage('Hello World from Hackathon!');
    });

    // Scan Code for Defects Command
    let scanCodeForDefectsDisposable = vscode.commands.registerCommand('hackathon.scanCodeForDefects', async () => {
        vscode.window.showInformationMessage('Scanning code for defects...');
        const document = vscode.window.activeTextEditor?.document;
            if (document !== undefined) {
                const uri = document.uri;
                let diagnostics = vscode.languages.getDiagnostics(uri);
                const code = document.getText();
                console.log(JSON.stringify(diagnostics));
                let result = await analyzeCodeQuality(JSON.stringify(diagnostics), code);
                vscode.window.showInformationMessage(result);
            }
    });

    // Create JIRA Ticket Command
    let createJiraTicketDisposable = vscode.commands.registerCommand('hackathon.createJiraTicket', createJiraTicket);

    // Run Test Coverage Analysis Command
    let runTestCoverageAnalysisDisposable = vscode.commands.registerCommand('hackathon.runTestCoverageAnalysis', async () => {
        vscode.window.showInformationMessage('Running test coverage analysis...');

        vscode.window.showInformationMessage('Running test coverage analysis...');
        // Locate the lcov.info file
        const lcovFiles = await vscode.workspace.findFiles('**/lcov.info', '**/node_modules/**', 1);
        let fileUri;

        if (lcovFiles.length > 0) {
            fileUri = lcovFiles[0];
        } else {
            fileUri = await vscode.window.showOpenDialog({
                canSelectFiles: true,
                canSelectFolders: false,
                filters: { 'LCOV Files': ['info'] },
                openLabel: 'Select lcov.info file'
            }).then(fileUris => fileUris ? fileUris[0] : undefined);
        }

        if (!fileUri) {
            vscode.window.showErrorMessage('No lcov.info file selected or found.');
            return;
        }

        // Read the file contents
        const fileData = await vscode.workspace.fs.readFile(fileUri);
        const lcovContent = Buffer.from(fileData).toString('utf8');
        console.log(lcovContent);

        const lcovJSON = parseLCOV(lcovContent);
        const document = vscode.window.activeTextEditor?.document;
        console.log(document?.fileName);
        
        let fileCov = lcovJSON.find((file) => file.file === document?.fileName);
        if (document !== undefined && fileCov !== undefined) {
            const uri = document.uri;
            const code = document.getText();
            vscode.window.showInformationMessage(await analyzeTestCoverage(JSON.stringify(fileCov), code));
        }
        else {
            vscode.window.showErrorMessage('No coverage for this file found.');
            return
        }            
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

    // Explain Code Command
    let codeExplanationDisposable = vscode.commands.registerCommand('hackathon.codeExplanation', async () => {
        vscode.window.showInformationMessage('Collecting explanation for the code...');
        const editor = vscode.window.activeTextEditor;
            if (editor) {
                const selection = editor.selection;
                const selectedText = editor.document.getText(selection);
                vscode.window.showInformationMessage(`Selected text: ${selectedText}`);
                const text = await explainCode(selectedText);
                vscode.window.showInformationMessage(text);
            } else {
                vscode.window.showInformationMessage('No active editor found');
            }
    });

    // Generate Unit Tests Command
    let generateUnitTestsDisposable = vscode.commands.registerCommand('hackathon.generateUnitTests', async () => {
        vscode.window.showInformationMessage('Generating unit tests...');

        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const selection = editor.selection;
            const selectedText = editor.document.getText(selection);
            vscode.window.showInformationMessage(`Selected text: ${selectedText}`);
            const text = await generateUnitTests(selectedText);
            vscode.window.showInformationMessage(text);
        } else {
            vscode.window.showInformationMessage('No active editor found');
        }
    });

    const chatHandler: vscode.ChatRequestHandler = async (
		request: vscode.ChatRequest,
		chatContext: vscode.ChatContext,
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
        }
    
        // Get the file name and determine the line range based on the selection
        const fileName = documentUri.path.split('/').pop();
        const lineNumber = selection.start.line;
        const fileRange = new vscode.Range(lineNumber, selection.start.line, selection.end.line, selection.end.character);

       
        
		// Chat request handler implementation goes here
		// Test for the `test` command
        // Using workspace name to store unique conversation history per workspace
        const workspaceName = vscode.workspace.name || 'defaultWorkspace';
        const conversationKey = `chatHistory_${workspaceName}`;

        // Retrieve conversation history for the current user from workspaceState or globalState
        const previousConversation = context.workspaceState.get<string[]>(conversationKey) || [];

        // Show the previous conversation (if any)
        // if (previousConversation.length > 0) {
        //     stream.markdown(`**Previous Conversations:**\n${previousConversation.join('\n')}`);
        // }

        let botResponse: string = '';
        
        if (request.command === 'scanForDefects') {
            const document = vscode.window.activeTextEditor?.document;
            
            if (document !== undefined) {
                const uri = document.uri;
                 // Use stream.reference to add a clickable reference to the exact location
                stream.reference(uri);
                // Additionally, display a simple text or message
                stream.progress(`Added reference for ${fileName}`);
                let diagnostics = vscode.languages.getDiagnostics(uri);
                const code = document.getText();
                console.log(JSON.stringify(diagnostics));
                stream.markdown(await analyzeCodeQuality(JSON.stringify(diagnostics), code));
            }
            return { metadata: { command: request.command } };
		}
		else if (request.command === 'createJiraTicket') {
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                const selection = editor.selection;
                const selectedText = editor.document.getText(selection);
                vscode.window.showInformationMessage(`Selected text: ${selectedText}`);
                const text = await createTicket(selectedText);
                let name = text[0];
                let description = text[1];

                const title = await vscode.window.showInputBox({ prompt: 'Confirm title', value: "Defect in " + name });
                const ticketDescription = await vscode.window.showInputBox({ prompt: 'Confirm description', value: description});
                
                if (title && ticketDescription) {
                    createJiraTicketLLM(title, ticketDescription);
                }
            } else {
                vscode.window.showInformationMessage('No active editor found');
            }
            // Prompt for different parts of the Jira ticket
            // What is the name of the function
            // What is the description of the function
            // Recommended changes
            // List of acceptance criteria
		}
		else if (request.command === 'runTestCoverageAnalysis') {
            vscode.window.showInformationMessage('Running test coverage analysis...');
            // Locate the lcov.info file
            const lcovFiles = await vscode.workspace.findFiles('**/lcov.info', '**/node_modules/**', 1);
            let fileUri;
    
            if (lcovFiles.length > 0) {
                fileUri = lcovFiles[0];
            } else {
                fileUri = await vscode.window.showOpenDialog({
                    canSelectFiles: true,
                    canSelectFolders: false,
                    filters: { 'LCOV Files': ['info'] },
                    openLabel: 'Select lcov.info file'
                }).then(fileUris => fileUris ? fileUris[0] : undefined);
            }
    
            if (!fileUri) {
                vscode.window.showErrorMessage('No lcov.info file selected or found.');
                return { metadata: { command: request.command } };
            }
    
            // Read the file contents
            const fileData = await vscode.workspace.fs.readFile(fileUri);
            const lcovContent = Buffer.from(fileData).toString('utf8');
            console.log(lcovContent);

            const lcovJSON = parseLCOV(lcovContent);
            const document = vscode.window.activeTextEditor?.document;
            console.log(document?.fileName);
            
            let fileCov = lcovJSON.find((file) => file.file === document?.fileName);
            if (document !== undefined && fileCov !== undefined) {
                const uri = document.uri;
                 // Use stream.reference to add a clickable reference to the exact location
                stream.reference(uri);
                // Additionally, display a simple text or message
                stream.progress(`Added reference for ${fileName}`);
                const code = document.getText();
                stream.markdown(await analyzeTestCoverage(JSON.stringify(fileCov), code));
            }
            else {
                vscode.window.showErrorMessage('No coverage for this file found.');
                return { metadata: { command: request.command } };
            }            
           
            return { metadata: { command: request.command } };
		}
		else if (request.command === 'viewOutstandingTickets') {
		}
		else if (request.command === 'codeExplanation') {
            const editor = vscode.window.activeTextEditor;
             // Use stream.reference to add a clickable reference to the exact location
            stream.reference(new vscode.Location(documentUri, fileRange));

            // Additionally, display a simple text or message
            stream.progress(`Added reference for ${fileName}:${lineNumber}`);
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
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                const selection = editor.selection;
                const selectedText = editor.document.getText(selection);
                vscode.window.showInformationMessage(`Selected text: ${selectedText}`);
                const text = await generateUnitTests(selectedText);
                stream.markdown(text);
            } else {
                vscode.window.showInformationMessage('No active editor found');
            }
		}
		else {
            let code = '';
            let diagnostics = '';
            let filename = '';
            const document = vscode.window.activeTextEditor?.document;
            if (document !== undefined) {
                filename = document.fileName;
                const uri = document.uri;
                diagnostics = JSON.stringify(vscode.languages.getDiagnostics(uri));
                code = document.getText();
            }
		    botResponse = await handleGenericChatPrompt(request.prompt,code,diagnostics,filename);
            stream.markdown(botResponse);

		  }
          // Append the new chat input and response to the conversation history
        previousConversation.push(`User: ${request.prompt}`);
        previousConversation.push(`Bot: ${botResponse}`);

        // Save the updated conversation history
        context.workspaceState.update(conversationKey, previousConversation);

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
			}
			else if (result.metadata.command === 'createJiraTicket') {
			}
			else if (result.metadata.command === 'runTestCoverageAnalysis') {
			}
			else if (result.metadata.command === 'viewOutstandingTickets') {
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
        codeExplanationDisposable,
        generateUnitTestsDisposable,
        hackChat
    );
}

// This method is called when your extension is deactivated
export function deactivate() {}
