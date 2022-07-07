// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import path = require('path');

let isActive = false;
let prevText = "";
let iTrackerStatusBarItem: vscode.StatusBarItem;
const iTrackerCommand = 'itrackhelper.helloWorld';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "itrackhelper" is now active!');

	iTrackerStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	iTrackerStatusBarItem.command = iTrackerCommand;
	context.subscriptions.push(iTrackerStatusBarItem);
	iTrackerStatusBarItem.text = '$(eye) iTracker';
	iTrackerStatusBarItem.show();

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand(iTrackerCommand, () => {
		// The code you place here will be executed every time your command is executed
		
		
		isActive = !isActive;
		executeAsync();
		vscode.window.showInformationMessage('iTracker is ' + (isActive ? 'active' : 'inactive'));
		
	});

	

	context.subscriptions.push(disposable);
	
}


// this method is called when your extension is deactivated
export function deactivate() {}

async function executeAsync() {
	
	while(isActive) {
		await new Promise<void>(resolve => setTimeout(()=>resolve(), 100)).then(()=>{
			// get current time
			let currentTime = new Date();
			let editor = vscode.window.activeTextEditor;
			if (editor) {
				// get snapshot of current editor viewport
				let viewport = editor.visibleRanges;
				// get currently displayed text
				let text = editor.document.getText(viewport[0]);
				if(text !== prevText) {
					prevText = text;
					let filepath = path.join(__dirname,".." ,"snapshots",currentTime.toLocaleTimeString() + `.` +currentTime.getMilliseconds() +".txt");
					text = editor.document.fileName + "\n" + text;
					fs.writeFileSync(filepath, text);
					console.log("Created snapshot : " + filepath);
				} 
			}
		
		});
	}
}


