/**
 * @file themeConfig.js
 * @description Central konfiguration för färger och form.
 */

export const THEME = {
  // Ändra till 'rounded-none' för helt skarpa hörn (ingen rundning alls)
  borderRadius: "rounded-none", 


    // Alla fasta texter i gränssnittet samlas här
  labels: {
    qmsHeader: "Quality Management System (QMS)",
    docId: "Document ID",
    revision: "Revision",
    processOwner: "Process Owner",
    exampleHeader: "Description/Template Example",
    backButton: "Back to Dashboard",
    sopHeading: "Standard Operating Procedure"
  },

  // Centralisera "fula" Tailwind-strängar här
  styles: {
    sopModalOverlay: "fixed inset-0 bg-slate-900/80 z-50 flex items-center justify-center p-0 md:p-10 animate-in fade-in duration-200",
    sopContainer: "bg-white w-full max-w-5xl flex flex-col max-h-screen md:max-h-[95vh] overflow-hidden border-4 border-slate-900 shadow-none",
    metadataBox: "p-4 border-r-2 border-slate-900 bg-white",
    metadataLabel: "text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1",
    contentHeading1: "text-xl font-black mb-6 mt-2 border-b-4 border-slate-900 pb-2 uppercase text-slate-900",
    contentHeading2: "text-lg font-bold mb-4 mt-8 bg-slate-900 text-white px-3 py-1 inline-block uppercase tracking-wider"
  },
  
  // Färger
  colors: {
    sidebarBg: "bg-slate-950",
    sidebarText: "text-slate-400",
    primary: "bg-blue-700",
    primaryHover: "hover:bg-blue-800",
    border: "border-slate-200",
    headerBg: "bg-slate-50",
    cardBg: "bg-white",
  },
  
  // Teckensnitt och text
  typography: {
    title: "font-black tracking-tighter uppercase",
    body: "font-sans leading-relaxed text-slate-700",
  }
};
