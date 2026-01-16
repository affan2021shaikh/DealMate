chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type !== "CHECKOUT_DETECT") return;

  const url = window.location.href.toLowerCase();

  const checkoutIndicators = [
    "checkout",
    "cart",
    "payment",
    "order",
    "purchase"
  ];

  const isCheckout = checkoutIndicators.some(word => url.includes(word));

  sendResponse({ isCheckout });
});
