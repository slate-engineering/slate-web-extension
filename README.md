## slate-web-extension
<img width="1440" alt="Screen Shot 2021-08-16 at 11 20 45 AM" src="https://user-images.githubusercontent.com/60402678/129603939-0d6825a7-bc44-40c7-ab53-f05ae28d14d8.png">

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

`option + S` opens the main app modal <br><br>
When the app modal is open:
- `option + B` bookmark the current page
- The search should be focused onload, so you can begin typing right away
     - `enter` to open slate with search query
     - `esc` to navigate back to previous page 
