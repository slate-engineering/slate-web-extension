## slate-web-extension
<img width="1430" alt="Screen Shot 2021-08-30 at 11 43 16 AM" src="https://user-images.githubusercontent.com/60402678/131381707-1ff37208-7776-4c98-9770-ecafee18ee1b.png">

<br><br>

### Testing on Chrome

This project needs to be built in order to take advantage of the Chrome Extension API, such as using the Content script to get the extension's ID, or using the Chrome Storage API. These features cannot be used when running this project locally.

To load as a developer extension inside of Chrome:

1. Clone the repo `git clone https://github.com/jasonleyser/slate-web-extension.git` <br >
2. In terminal, navigate to the new `slate-web-extension` folder <br >
3. Run `npm install` <br >
4. Update the build folder `npm run build` <br >
5. Navigate to `chrome://extensions/` in your browser <br>
6. Toggle the `Developer mode` switch on in the top right hand corner <br>
7. Click the `Load unpacked` button in the top left corner <br>
8. Select the `build` folder inside of this project folder <br>


### Shortcuts
`option + S` opens the main app modal <br>
`option + O` opens your Slate data page <br><br>

When the app modal is open:
- `option + B` bookmark the current page
- `option + C` save bookmark to a collection

### Auto saving
1) When you bookmark a page through Chrome, the Slate extension will automatically archive the link.
2) When you download a file to your desktop, the Slate extension will automatically upload the file.
