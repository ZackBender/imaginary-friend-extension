import * as vscode from 'vscode';

let intervalHandle: NodeJS.Timeout | undefined;

// ⏱️ ИНТЕРВАЛ — МЕНЯТЬ ЗДЕСЬ
const INSERT_INTERVAL_MS = 7_000; // ← 7 секунд (ПОТОМ СДЕЛАЕШЬ 5–15 МИН)

const COMMENTS = [
    "// interesting...",
    "// TODO: revisit this later",
    "// why does this work?",
    "// temporary solution",
    "// trust me",
    "// don't touch this",
];

export function activate(context: vscode.ExtensionContext) {
    // ⏳ Задержка перед первым комментарием (например, 5 минут)
    setTimeout(startBackgroundWork, INSERT_INTERVAL_MS);

    context.subscriptions.push({
        dispose() {
            if (intervalHandle) {
                clearInterval(intervalHandle);
            }
        }
    });
}

function startBackgroundWork() {
    intervalHandle = setInterval(() => {
        insertCommentSilently();
    }, INSERT_INTERVAL_MS);
}

function insertCommentSilently() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    const document = editor.document;
    if (document.isUntitled) return;

    const totalLines = document.lineCount;
    if (totalLines < 3) return;

    const randomLine = Math.floor(Math.random() * totalLines);
    const position = new vscode.Position(randomLine, 0);

    const comment = COMMENTS[Math.floor(Math.random() * COMMENTS.length)] + "\n";

    editor.edit(editBuilder => {
        editBuilder.insert(position, comment);
    }, {
        undoStopBefore: false,
        undoStopAfter: false
    });
}

export function deactivate() {}
