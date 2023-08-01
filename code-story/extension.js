// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const { todo } = require('node:test');
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "code-story" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json

	let disposable = vscode.commands.registerCommand('code-story.helloWorld', ()=> {
		// The code you place here will be executed every time your command is executed
        list_comments()
		// Display a message box to the user
		//vscode.window.showInformationMessage('Hello World from code story!');
	});
    context.subscriptions.push(disposable);

    let disposableGenerateComment = vscode.commands.registerCommand('code-story.generateCommentBlock', () => {
        generateCommentBlock();
    });
    context.subscriptions.push(disposableGenerateComment);


// TODO: list only code story chapter comment    
function list_comments(){
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active editor found!');
        return;
    }

    const document = editor.document;
    const text = document.getText();

    const commentRegex = /#.*$/gm;
    const comments = text.match(commentRegex);

    if (!comments || comments.length === 0) {
        vscode.window.showInformationMessage('No comments found in the Python file.');
        return;
    }

    const panel = vscode.window.createWebviewPanel(
        'commentReader', // Unique ID
        'Python Comments', // Title
        vscode.ViewColumn.One, // Editor column to show the panel
        {}
    );

    // Generate HTML content to display comments
    const html = `
    <!DOCTYPE html>
    <html>
    <body>
        <h2>Comments in the Python File:</h2>
        <ul>
            ${comments.map(comment => `<li>${escapeHtml(comment)}</li>`).join('')}
        </ul>
    </body>
    </html>`;

    panel.webview.html = html;

}

	





    
}

//TODO: change to activate when press command+c+s /ctrl+c+s 
function generateCommentBlock() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active editor found!');
        return;
    }

    const document = editor.document;
    const selection = editor.selection;
    const cursorPosition = selection.active;

    const lineText = document.lineAt(cursorPosition.line).text;
    const indentation = lineText.match(/^\s*/)[0]; // Get the indentation of the current line

    // Generate a comment block with a placeholder
    const commentBlock = `${indentation}''' \n${indentation}code-story chapter:\n${indentation}'''\n`;

    // Insert the comment block at the current cursor position
    editor.edit(editBuilder => {
        editBuilder.insert(cursorPosition, commentBlock);
    });
}

// Function to escape HTML characters
function escapeHtml(html) {
    return html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
