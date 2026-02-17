import { init, AuthType } from '@thoughtspot/visual-embed-sdk';

let isInitialized = false;

export function initThoughtSpot() {
  if (!isInitialized) {
    init({
      thoughtSpotHost: 'https://legaldecoder.thoughtspot.cloud',
      authType: AuthType.None,
      customizations: {
        content: {
          strings: {
            "Spotter": "Legal AI",
            "Ask Spotter": "Ask Legal AI",
            "Spotter session": "Legal AI session",
            "Ask a question": "Ask about your legal spend data",
            "ThoughtSpot": "Legal Decoder",
            "Powered by ThoughtSpot": "",
            "Preview data": "Preview data",
            "What do you want to know?": "What would you like to analyze?",
          }
        },
        iconSpriteUrl: "https://cdn.jsdelivr.net/gh/mmarco-ts/ld-icon-store/ld-spotter-icon.svg",
        style: {
          customCSS: {
            rules_UNSTABLE: {
              // Hide footer / Powered by ThoughtSpot
              ".footer-module__footerLogo": {
                display: "none !important"
              },
              ".footer-module__footer": {
                display: "none !important"
              },
              "[class*='footer-module']": {
                display: "none !important"
              },
              "img[alt*='Powered by']": {
                display: "none !important"
              },
              // Hide Spotter icon in reasoning tool call card
              "svg.chat-module__spotterIcon.icon-module__iconStyle.icon-module__xxl.icon-module__white": {
                display: "none !important"
              },
              // Hide ThoughtSpot text in reasoning tool call card
              ".collapsible-item-response-module__title": {
                textIndent: "-89px",
                overflow: "hidden",
                marginLeft: "-24px"
              },
              // Hide ThoughtSpot/Connector icon in reasoning tool call card
              ".collapsible-item-response-module__customIconWrapper": {
                display: "none !important"
              },
              // Hide MCP connectors button if present
              ".button-module__buttonWrapper.chat-connector-resources-module__addConnectorResourceButton": {
                display: "none !important"
              },
            },
          },
        },
      },
    });
    isInitialized = true;
    console.log('ThoughtSpot SDK initialized for Legal Decoder');
  }
}

initThoughtSpot();
