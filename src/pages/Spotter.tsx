import { useEffect, useRef } from 'react';
import { SpotterEmbed } from '@thoughtspot/visual-embed-sdk';
import Header from '../components/Header';
import '../lib/thoughtspot';

export default function Spotter() {
  const embedRef = useRef<HTMLDivElement>(null);
  const embedInstanceRef = useRef<SpotterEmbed | null>(null);

  useEffect(() => {
    if (embedRef.current && !embedInstanceRef.current) {
      const embed = new SpotterEmbed(embedRef.current, {
        frameParams: {
          width: '100%',
          height: '100%',
        },
        worksheetId: 'e94d24f4-a2ad-48b2-ab43-b83549c43017',
        updatedSpotterChatPrompt: true,
        customizations: {
          style: {
            customCSS: {
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
        title="AI Analytics" 
        subtitle="Natural language search powered by Legal AI"
      />
      <main className="main-content">
        <div className="page-container">
          <div className="page-header">
            <h2 className="page-title">AI-Powered Legal Insights</h2>
            <p className="page-subtitle">
              Ask questions in natural language about invoices, flags, law firms, and billing patterns
            </p>
          </div>
          <div className="embed-container" ref={embedRef}>
            <div className="embed-loading">
              <div className="embed-loading-spinner"></div>
              <span>Loading AI Analytics...</span>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
