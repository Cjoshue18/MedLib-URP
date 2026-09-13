import React, { useEffect, useRef, useMemo } from 'react';

interface InstagramPostEmbedProps {
  url: string;
  className?: string;
  captioned?: boolean;
}

export const InstagramPostEmbed: React.FC<InstagramPostEmbedProps> = ({
  url,
  className = '',
  captioned = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const cleanPermalink = useMemo(() => {
    if (!url) return null;
    const match = url.match(/https?:\/\/(?:www\.)?instagram\.com\/(?:p|reel)\/([a-zA-Z0-9_-]+)/i);
    return match ? `https://www.instagram.com/p/${match[1]}/` : url;
  }, [url]);

  useEffect(() => {
    const scriptId = 'instagram-embed-sdk';
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    const triggerProcess = () => {
      const instgrm = (window as unknown as { instgrm?: { Embeds: { process: () => void } } }).instgrm;
      if (instgrm && typeof instgrm.Embeds.process === 'function') {
        instgrm.Embeds.process();
      }
    };

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://www.instagram.com/embed.js';
      script.async = true;
      script.onload = () => {
        triggerProcess();
      };
      document.body.appendChild(script);
    } else {
      triggerProcess();
      const timer = setTimeout(triggerProcess, 300);
      const timer2 = setTimeout(triggerProcess, 1000);
      return () => {
        clearTimeout(timer);
        clearTimeout(timer2);
      };
    }
  }, [cleanPermalink]);

  if (!cleanPermalink) {
    return null;
  }

  return (
    <div ref={containerRef} className={`flex justify-center w-full max-w-[360px] mx-auto ${className}`}>
      <blockquote
        key={`${cleanPermalink}-${captioned ? 'cap' : 'nocap'}`}
        className="instagram-media"
        {...(captioned ? { 'data-instgrm-captioned': true } : {})}
        data-instgrm-permalink={`${cleanPermalink}?utm_source=ig_embed&amp;utm_campaign=loading`}
        data-instgrm-version="14"
        style={{
          background: '#FFF',
          border: 0,
          borderRadius: '16px',
          boxShadow: 'none',
          margin: '0 auto',
          maxWidth: '360px',
          minWidth: '280px',
          padding: 0,
          width: '100%',
        }}
      >
        <div style={{ padding: '16px' }}>
          <a
            href={`${cleanPermalink}?utm_source=ig_embed&amp;utm_campaign=loading`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#FFFFFF',
              lineHeight: 0,
              padding: '0 0',
              textAlign: 'center',
              textDecoration: 'none',
              width: '100%',
              fontSize: '13px',
              color: '#008744',
              fontWeight: 600,
            }}
          >
            Ver publicación en Instagram
          </a>
        </div>
      </blockquote>
    </div>
  );
};
