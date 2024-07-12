return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src vscode-resource: https:; style-src vscode-resource: https: 'unsafe-inline'; script-src 'nonce-${nonce}' 'unsafe-eval';">
          <script nonce="${nonce}">
            console.log("Webview loaded");
            const vscode = acquireVsCodeApi();
            vscode.postMessage({ type: 'webviewReady' });
          </script>
        </head>
        <body>
          <div id="root"></div>
          <script nonce="${nonce}" src="${scriptSrc}"></script>
        </body>
      </html>
    `;

return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src vscode-resource: https:; style-src vscode-resource: https: 'unsafe-inline'; script-src 'nonce-${nonce}' 'unsafe-eval';">
          <script nonce="${nonce}">
            console.log("Webview loaded");
            const vscode = acquireVsCodeApi();
            vscode.postMessage({ type: 'webviewReady' });
          </script>
        </head>
        <body>
          <div id="root"></div>
          <script nonce="${nonce}" src="${scriptSrc}"></script>
        </body>
      </html>
    `;
