## slate-web-extension
<img width="1440" alt="Screen Shot 2021-11-04 at 12 07 26 PM" src="https://user-images.githubusercontent.com/60402678/140395348-5eb0074c-00ce-480a-ad0f-4297b9b9eccb.png">

<br><br>

### Testing on Chrome

This project needs to be built in order to take advantage of the Chrome Extension API, such as using the Content script to get the extension's ID, or using the Chrome Storage API. These features cannot be used when running this project locally.

To load as a developer extension inside of Chrome:

1. Clone the repo `https://github.com/slate-engineering/slate-web-extension` <br >
2. In terminal, navigate to the new `slate-web-extension` folder <br >
3. Run `npm install` <br >
4. Update the build folder `npm run build` <br >
5. Navigate to `chrome://extensions/` in your browser <br>
6. Toggle the `Developer mode` switch on in the top right hand corner <br>
7. Click the `Load unpacked` button in the top left corner <br>
8. Select the `build` folder inside of this project folder <br>

### Shortcuts
`option + S` opens the main extension modal <br>
`option + O` opens your Slate data page in the web app <br>
`option + B` bookmark the current page
