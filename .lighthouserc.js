module.exports = {
    "ci": {
      "assert": {
        "preset": "lighthouse:no-pwa",
        "assertions": {
          "csp-xss": "off",
          "aria-hidden-focus": "off",
          "unused-css-rules": "warn",
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