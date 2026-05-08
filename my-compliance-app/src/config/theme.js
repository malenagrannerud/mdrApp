/**
 * @file theme.js
 * @description Central konfiguration för färger och form.
 */


/**
 * @file theme.js
 * @description Central konfiguration för färger, form och typografi.
 */

export const THEME = {
  borderRadius: "rounded-none", 

  // 1. DEFINIERA ALLA TEXTSTORLEKAR HÄR
  fontSizes: {
    xs: "text-[10px]",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    h3: "text-2xl",
    h2: "text-3xl",
    h1: "text-4xl",
    mega: "text-5xl"
  },

  // 2. FASTA ETIKETTER 
  labels: {
    qmsHeader: "Quality Management System (QMS)",
    docId: "Document ID",
    revision: "Revision",
    processOwner: "Process Owner",
    exampleHeader: "Description/Template Example",
    backButton: "Back to Dashboard",
    sopHeading: "Standard Operating Procedure",
    viewButton: "View"
  },

  // 3. CENTRALISERADE STILAR (TAILWIND-STRÄNGAR)
  styles: {
    
    // SOP Modal
    sopModalOverlay: "fixed inset-0 bg-slate-900/80 z-50 flex items-center justify-center p-0 md:p-10 animate-in fade-in duration-200",
    sopContainer: "bg-white w-full max-w-5xl flex flex-col max-h-screen md:max-h-[95vh] overflow-hidden border-4 border-slate-900 shadow-none",
    
    // Metadata i SOP
    metadataBox: "p-4 border-r-2 border-slate-900 bg-white",
    metadataLabel: "text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1",
    metadataValue: "text-sm font-bold text-slate-900",

    // Innehåll i SOP (Använder fontSizes ovan)
    sopHeading1: "text-xl font-bold mb-6 mt-2 border-b-4 border-slate-900 pb-2 uppercase text-slate-900",
    sopHeading2: "text-lg font-bold mb-4 mt-8 bg-slate-900 text-white px-3 py-1 inline-block uppercase tracking-wider",
    sopText: "text-sm font-medium leading-relaxed text-slate-700",
    sopList: "ml-4 mb-2 list-none border-l-4 border-slate-200 pl-4 font-bold italic text-slate-800",

    // Dashboard & Paneler
    mainTitle: "text-2xl font-bold text-slate-900 mb-2 uppercase tracking-tight",
    mainDesc: "text-slate-500 text-lg leading-relaxed font-medium mb-12",
    sectionTitle: "text-sm font-bold uppercase tracking-[0.15em] text-slate-400 mb-4",
    sectionText: "text-slate-700 text-lg leading-relaxed mb-6 font-normal",
    linkButton: "flex items-center gap-3 text-blue-700 font-bold hover:text-blue-900 transition-colors group"
  },
  
  // 4. FÄRGSCHEMA
  colors: {
    sidebarBg: "bg-slate-950",
    sidebarText: "text-slate-400",
    primary: "bg-blue-700",
    primaryHover: "hover:bg-blue-800",
    border: "border-slate-200",
    headerBg: "bg-slate-50",
    cardBg: "bg-white",
  },
  
  // 5. TYPOGRAFI-BAS
  typography: {
    title: "font-black tracking-tighter uppercase",
    body: "font-sans leading-relaxed text-slate-700",
  }
};
