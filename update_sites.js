const fs = require('fs');
const path = 'data/sites.json';
let sites = JSON.parse(fs.readFileSync(path, 'utf8'));

sites = sites.filter(site => {
  const hasForeign = site.models.includes('gpt') || site.models.includes('claude') || site.models.includes('gemini');
  return hasForeign;
});

sites.push({
  name: "转发站",
  url: "https://www.zhuanfazhan.com/home",
  description: "高性价比多模型中转服务",
  models: ["gpt", "claude", "gemini", "multi"],
  priceTier: "standard",
  featured: false
});

fs.writeFileSync(path, JSON.stringify(sites, null, 2));
