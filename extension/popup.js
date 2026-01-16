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

      if (!response) {
        status.textContent = "No response from page.";
        return;
      }

      const { isCheckout, couponFields, applyButtons } = response;
      let message = "";

      if (isCheckout) {
        message += "Checkout-like page detected.\n";
      } else {
        message += "This does not look like a checkout page.\n";
      }

      message += `Coupon fields found: ${couponFields}\n`;
      message += `Apply buttons found: ${applyButtons}`;

      status.textContent = message;
    }
  );
});
