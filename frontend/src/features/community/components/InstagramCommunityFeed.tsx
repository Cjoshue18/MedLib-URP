import React, { useEffect } from 'react';

interface InstagramCommunityFeedProps {
  subtitle?: string;
  footerNote?: string;
}

export const InstagramCommunityFeed: React.FC<InstagramCommunityFeedProps> = ({
  subtitle,
  footerNote = 'Síguenos para avisos de horarios especiales en sala, nuevas adquisiciones bibliográficas y convocatorias ALFIN.',
}) => {
  useEffect(() => {
    const existingScript = document.querySelector('script[src="https://elfsightcdn.com/platform.js"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://elfsightcdn.com/platform.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <section className="max-w-[1280px] mx-auto px-6 pb-20">
      <div className="bg-white rounded-3xl border-2 border-slate-900 shadow-urp-brutal p-6 sm:p-8">
        <div className="mb-6 border-b border-slate-200 pb-4">
          <span className="text-[11px] font-bold text-[#008744] uppercase tracking-wider block">
            COMUNIDAD MÉDICA &amp; ACTIVIDADES
          </span>
          <h3 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900">
            @bib_famurp en Instagram
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1">
              {subtitle}
            </p>
          )}
        </div>

        <div className="w-full px-2 sm:px-8 py-2 overflow-visible min-h-[340px]">
          <div className="elfsight-app-437cd9ca-7bc2-447c-9b36-5e9c7350b63f" data-elfsight-app-lazy></div>
        </div>

        {footerNote && (
          <p className="text-xs text-slate-500 mt-4">
            {footerNote}
          </p>
        )}
      </div>
    </section>
  );
};
