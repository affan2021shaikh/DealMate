chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type !== "CHECKOUT_DETECT") return;

  const url = window.location.href.toLowerCase();

  // Step 1: Detect checkout page
  const checkoutIndicators = ["checkout", "cart", "payment", "order", "purchase"];
  const isCheckout = checkoutIndicators.some(word => url.includes(word));

  // Step 2: Detect coupon input fields
  const inputFields = Array.from(document.querySelectorAll("input"));
  const couponInputs = inputFields.filter(input => {
    const name = input.name?.toLowerCase() || "";
    const id = input.id?.toLowerCase() || "";
    const placeholder = input.placeholder?.toLowerCase() || "";
    return (
      name.includes("coupon") ||
      name.includes("promo") ||
      name.includes("discount") ||
      id.includes("coupon") ||
      id.includes("promo") ||
      id.includes("discount") ||
      placeholder.includes("coupon") ||
      placeholder.includes("promo") ||
      placeholder.includes("discount")
    );
  });

  // Step 3: Detect buttons near coupon fields
  const applyButtons = couponInputs.map(input => {
    // Look for buttons inside the same form or next to the input
    const form = input.closest("form");
    const buttons = form ? Array.from(form.querySelectorAll("button")) : [];
    const nearbyButtons = buttons.filter(btn => {
      const text = btn.textContent.toLowerCase();
      return text.includes("apply") || text.includes("submit");
    });
    return nearbyButtons;
  }).flat();

  sendResponse({
    isCheckout,
    couponFields: couponInputs.length,
    applyButtons: applyButtons.length
  });
});
