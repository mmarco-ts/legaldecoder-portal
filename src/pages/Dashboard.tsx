import { useEffect, useRef } from 'react';
import { LiveboardEmbed } from '@thoughtspot/visual-embed-sdk';
import Header from '../components/Header';
import '../lib/thoughtspot';

export default function Dashboard() {
  const embedRef = useRef<HTMLDivElement>(null);
  const embedInstanceRef = useRef<LiveboardEmbed | null>(null);

  useEffect(() => {
    if (embedRef.current && !embedInstanceRef.current) {
      const embed = new LiveboardEmbed(embedRef.current, {
        frameParams: {
          width: '100%',
          height: '100%',
        },
        liveboardId: '4114a628-d19c-49d8-bf4f-df39ca951df7',
        activeTabId: '95915dc3-57be-4283-ac19-41e9ef3ad444',
        hideLiveboardHeader: false,
        showLiveboardTitle: true,
        showLiveboardDescription: true,
        isLiveboardStylingAndGroupingEnabled: true,
        customizations: {
          style: {
            customCSS: {
              variables: {
                "--ts-var-root-background": "transparent",
                "--ts-var-viz-background": "#ffffff",
                "--ts-var-root-font-family": "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              },
              rules_UNSTABLE: {
                ".footer-module__footerLogo": {
                  display: "none !important"
                },
                ".footer-module__footer": {
                  display: "none !important"
                },
                "[class*='footer-module']": {
                  display: "none !important"
                },
                "body, .bk-root, .sage-embed-module, *": {
                  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important"
                },
                ".chip-base-module__chip.chip-base-module__filter.chip-base-module__trigger.chip-base-module__default:hover": {
                  backgroundColor: "#1B2A4A !important",
                  borderColor: "#1B2A4A !important",
                  color: "#ffffff !important",
                  boxShadow: "0 2px 8px rgba(27, 42, 74, 0.3) !important"
                },
                ".chip-base-module__chip.chip-base-module__filter.chip-base-module__trigger.chip-base-module__default:hover .chip-base-module__chipText": {
                  color: "#ffffff !important"
                },
                ".chip-base-module__chip.chip-base-module__filter.chip-base-module__trigger.chip-base-module__default:hover .chip-base-module__content": {
                  color: "#ffffff !important"
                },
                ".chip-base-module__chip.chip-base-module__filter.chip-base-module__trigger.chip-base-module__default:hover span": {
                  color: "#ffffff !important"
                },
                ".chip-base-module__chip.chip-base-module__filter:hover": {
                  backgroundColor: "#1B2A4A !important",
                  borderColor: "#1B2A4A !important",
                  color: "#ffffff !important"
                },
                ".chip-base-module__chip.chip-base-module__filter:hover span": {
                  color: "#ffffff !important"
                },
                ".filter-panel-module__filterChip.chip-base-module__chip:hover": {
                  backgroundColor: "#1B2A4A !important",
                  borderColor: "#1B2A4A !important",
                  color: "#ffffff !important"
                },
                ".filter-panel-module__filterChip.chip-base-module__chip:hover span": {
                  color: "#ffffff !important"
                },
                "[data-testid='filter-panel-chip']:hover": {
                  backgroundColor: "#1B2A4A !important",
                  borderColor: "#1B2A4A !important",
                  color: "#ffffff !important"
                },
                "[data-testid='filter-panel-chip']:hover span": {
                  color: "#ffffff !important"
                },
                "[data-testid='filter-panel-chip']:hover *": {
                  color: "#ffffff !important"
                },
                "body": {
                  backgroundColor: "transparent !important"
                },
                ".pinboard-background": {
                  backgroundColor: "transparent !important"
                },
                ".ReactGridLayout": {
                  backgroundColor: "transparent !important"
                },
                ".pinboard-content-module__pinboardContent": {
                  backgroundColor: "transparent !important"
                },
                ".pinboard-module__pinboard": {
                  backgroundColor: "transparent !important"
                },
                ".pinboard-page": {
                  backgroundColor: "transparent !important"
                },
                ".embed-module__embedContainer": {
                  backgroundColor: "transparent !important"
                },
                ".answer-module__answer": {
                  border: "none !important",
                  boxShadow: "0 12px 24px -4px rgba(0, 0, 0, 0.16), 0 4px 8px -2px rgba(0, 0, 0, 0.08) !important",
                  borderRadius: "12px !important",
                  overflow: "hidden !important"
                },
                ".viz-card-module__vizCard": {
                  border: "none !important",
                  boxShadow: "0 12px 24px -4px rgba(0, 0, 0, 0.16), 0 4px 8px -2px rgba(0, 0, 0, 0.08) !important",
                  borderRadius: "12px !important",
                  overflow: "hidden !important"
                },
                ".react-grid-item": {
                  border: "none !important"
                }
              },
            },
          },
        },
      });

      embedInstanceRef.current = embed;
      embed.render();
    }

    return () => {
      embedInstanceRef.current = null;
    };
  }, []);

  return (
    <>
      <Header 
        title="Compliance Dashboard" 
        subtitle="Invoice compliance analysis and flag review"
      />
      <main className="main-content">
        <div className="page-container">
          <div className="page-header">
            <h2 className="page-title">Invoice Compliance Analysis</h2>
            <p className="page-subtitle">
              Review flagged invoices, potential write-downs, and billing efficiency across law firms
            </p>
          </div>
          <div className="embed-container" ref={embedRef} />
        </div>
      </main>
    </>
  );
}
