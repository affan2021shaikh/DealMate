const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

// Path to the coupons JSON file
const couponsFile = path.join(__dirname, "coupons.json");

// Utility to read coupons
function getCoupons() {
  const data = fs.readFileSync(couponsFile);
  return JSON.parse(data);
}

// GET coupons for a domain
app.get("/coupons", (req, res) => {
  const domain = req.query.domain;
  if (!domain) return res.status(400).json({ error: "Missing domain parameter" });

  const coupons = getCoupons()[domain.toLowerCase()] || [];
  res.json({ domain, coupons });
});

// POST a new coupon (manual submission, optional)
app.post("/coupons", (req, res) => {
  const { domain, code } = req.body;
  if (!domain || !code) return res.status(400).json({ error: "Missing domain or code" });

  const coupons = getCoupons();
  const domainKey = domain.toLowerCase();

  if (!coupons[domainKey]) coupons[domainKey] = [];
  if (!coupons[domainKey].includes(code)) coupons[domainKey].push(code);

  fs.writeFileSync(couponsFile, JSON.stringify(coupons, null, 2));

  res.json({ message: "Coupon added", domain: domainKey, code });
});

app.listen(PORT, () => {
  console.log(`DealMate backend running on http://localhost:${PORT}`);
});
