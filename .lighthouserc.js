module.exports = {
    "ci": {
      "assert": {
        "preset": "lighthouse:recommended",
        "assertions": {
          "csp-xss": "off",
          "aria-hidden-focus": "off",
          "categories:performance": ["warn", {"minScore": .90}],
          "categories:accessibility": ["warn", {"minScore": .90}],
          "categories:best-practices": ["warn", {"minScore": .90}],
          "categories:seo": ["warn", {"minScore": .90}],
          }
        },
      "upload": {
        "target": "temporary-public-storage",
      },
    }
  };