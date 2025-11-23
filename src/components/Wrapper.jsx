import { Download, Flame } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import html2canvas from "html2canvas";

function Wrapper({ children, title, icon, cardRef, isStoriesMode = false }) {
  const downloadCard = async () => {
    if (cardRef?.current) {
      // Hide the download button before capturing
      const downloadButton = cardRef.current.querySelector('button');
      if (downloadButton) {
        downloadButton.style.display = 'none';
      }

      // Create a temporary style override for backdrop-blur elements
      const styleEl = document.createElement('style');
      styleEl.id = 'temp-download-style';
      styleEl.textContent = `
        .backdrop-blur-sm {
          backdrop-filter: none !important;
          background-color: rgba(255, 255, 255, 0.15) !important;
        }
      `;
      document.head.appendChild(styleEl);

      // Wait a moment for styles to apply
      await new Promise(resolve => setTimeout(resolve, 50));

      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
        allowTaint: true,
        logging: false,
      });

      // Remove temporary style and show button again
      document.getElementById('temp-download-style')?.remove();
      if (downloadButton) {
        downloadButton.style.display = '';
      }

      const link = document.createElement("a");
      link.download = 
        `${title.toLowerCase().replace(/\s+/g, "_")}_card.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    }
  };

  return (
    <Card
      ref={cardRef}
      className={
        "relative w-full max-w-[480px] min-h-[730px] mx-auto " +
        "overflow-hidden rounded-3xl border-0 shadow-xl " +
        "bg-gradient-to-br from-purple-900 via-pink-800 to-orange-700"
      }
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <svg className="absolute inset-0 w-full h-full">
          <defs>
            <filter id="blur-pink" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="60" />
            </filter>
            <filter id="blur-orange" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="60" />
            </filter>
          </defs>
          <circle cx="96" cy="96" r="190" fill="rgba(236, 72, 153, 0.3)" filter="url(#blur-pink)" />
          <circle cx="384" cy="634" r="190" fill="rgba(249, 115, 22, 0.3)" filter="url(#blur-orange)" />
        </svg>
      </div>
      <div className="flex h-full min-h-[730px] flex-col p-8 md:p-10">
        <header className="mb-4">
          <div className="flex items-center gap-2">
            <div
              className={
                "p-2 rounded-xl bg-white/10 ring-1 ring-white/20 " +
                "backdrop-blur-sm"
              }
            >
              {icon}
            </div>
            <h1
              className={
                "text-2xl md:text-3xl font-bold text-white tracking-tight"
              }
            >
              {title}
            </h1>
          </div>
          <p className="text-white/80 mt-2 text-sm">
            Instagram Rewind - 2025
          </p>
        </header>
        <CardContent
          className={
            "relative z-10 p-0 text-white/95 text-base leading-7 flex-1"
          }
        >
          {children}
        </CardContent>
        <footer
          className={
            "pt-4 text-xs text-white/60 flex items-center " +
            "justify-between mt-auto"
          }
        >
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4" />
            <span>Generated locally</span>
          </div>
          {!isStoriesMode && (
            <button
              onClick={downloadCard}
              className={
                "flex items-center gap-2 px-3 py-1 rounded-lg " +
                "bg-white/15 hover:bg-white/25 transition-colors " +
                "text-white text-xs backdrop-blur-sm"
              }
            >
              <Download className="w-3 h-3" /> Download
            </button>
          )}
        </footer>
      </div>
    </Card>
  );
}

export default Wrapper;
