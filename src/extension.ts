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
		  } else {
			stream.progress(await handleChatPrompt(request.prompt));
			return {};
		  }
	  };

	// Register the chat participant and its request handler
	const hackChat = vscode.chat.createChatParticipant('chat-participant.hackathon', chatHandler);	
	context.subscriptions.push(hackChat,disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
