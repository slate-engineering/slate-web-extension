GetApiKey = async () => {
  var storage = new Promise(function (resolve, reject) {
    chrome.storage.local.get(["apiKey"], function (result) {
      resolve(result);
    });
  });
  return storage;
};

SaveApiKey = async (props) => {
  chrome.storage.local.set({ apiKey: props.key });
};

document.getElementById('saveApiKeyButton').addEventListener("click", async function() {
  let key = document.getElementById('apiKey').value;
  let save = await SaveApiKey({ key: key });
  document.getElementById('saveApiKeyButton').value = "Saved"
});

window.onload = async function() {
  let get = await GetApiKey();
  document.getElementById('apiKey').value = get.apiKey;
};