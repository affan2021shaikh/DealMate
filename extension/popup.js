document.getElementById("check").addEventListener("click", async () => {
  const status = document.getElementById("status");
  status.textContent = "Checking page...";

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab || !tab.id) {
    status.textContent = "No active tab found.";
    return;
  }

  chrome.tabs.sendMessage(
    tab.id,
    { type: "CHECKOUT_DETECT" },
    (response) => {
      if (chrome.runtime.lastError) {
        status.textContent = "Unable to communicate with page.";
        return;
      }

      if (response && response.isCheckout) {
        status.textContent = "Checkout-like page detected.";
      } else {
        status.textContent = "This does not look like a checkout page.";
      }
    }
  );
});
