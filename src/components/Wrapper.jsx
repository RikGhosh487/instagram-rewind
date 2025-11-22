import { Download, Flame } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import html2canvas from "html2canvas";

function Wrapper({ children, title, icon, cardRef }) {
  const downloadCard = async () => {
    if (cardRef?.current) {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: null,
        width: 480,
        height: 730,
      });

      const link = document.createElement("a");
      link.download = 
        `${title.toLowerCase().replace(/\s+/g, "_")}_card.png`;
      link.href = canvas.toDataURL();
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
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div
          className={
            "absolute -top-24 -left-24 w-[380px] h-[380px] " +
            "rounded-full bg-pink-500/30 blur-3xl"
          }
        />
        <div
          className={
            "absolute -bottom-24 -right-24 w-[380px] h-[380px] " +
            "rounded-full bg-orange-500/30 blur-3xl"
          }
        />
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
        </footer>
      </div>
    </Card>
  );
}

export default Wrapper;
