export interface Dictionary {
  common: {
    loading: string;
    error: string;
    success: string;
    confirm: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
    add: string;
    search: string;
    warning: string;
    info: string;
  };
  settings: {
    title: string;
    language: string;
    selectLanguage: string;
    currentLanguage: string;
    noOptions: string;
  };
  chat: {
    input: string;
    send: string;
    stop: string;
    reload: string;
    empty: string;
    error: string;
    placeholder: string;
    sendMessage: string;
    stopGeneration: string;
    regenerate: string;
    addAttachment: string;
    dragDropFiles: string;
    dragDropDescription: string;
    clearAllFiles: string;
    processingFiles: string;
    retry: string;
    unsupportedFileType: string;
    processingFailed: string;
    retryFailed: string;
    waitingForReply: string;
    replying: string;
    online: string;
  };
  flow: {
    locate: string;
    style: string;
    styleConfig: string;
    resetToDefault: string;
    nodeSize: string;
    layoutSpacing: string;
    typography: string;
    edgeStyle: string;
    width: string;
    height: string;
    horizontalSpacing: string;
    verticalSpacing: string;
    fontSize: string;
    lineHeight: string;
    maxCharacters: string;
    edgeWidth: string;
    edgeType: string;
    edgeAnimated: string;
    default: string;
    bezierCurve: string;
    straight: string;
    step: string;
    smoothStep: string;
    title: string;
  };
  list: {
    startNewChat: string;
    chatDescription: string;
    errorOccurred: string;
    unknownError: string;
  };
  markdown: {
    loadingChart: string;
  };
  documents: {
    pdfDocument: string;
    wordDocument: string;
    wordDocumentDocx: string;
    wordDocumentDoc: string;
    excelWorkbook: string;
    excelWorkbookXlsx: string;
    excelWorkbookXls: string;
    powerpointPresentation: string;
    powerpointPresentationPptx: string;
    powerpointPresentationPpt: string;
    xmlDocument: string;
    xmlDocumentXml: string;
    jsonDataFile: string;
    jsonDataFileJson: string;
    xhtmlDocument: string;
    xhtmlDocumentXhtml: string;
    latexDocument: string;
    latexDocumentTex: string;
    texDocument: string;
    texDocumentTex: string;
    yamlConfigFile: string;
    yamlConfigFileYml: string;
    yamlConfigFileYaml: string;
    yamlConfigFileYmlYaml: string;
    rssFeed: string;
    rssFeedRss: string;
    atomFeed: string;
    atomFeedAtom: string;
  };
  sidebar: {
    expandCollapse: string;
  };
  attachment: {
    attachment: string;
    downloadFile: string;
  };
  navigation: {
    chatFlow: string;
    settings: string;
  };
}

export const localeNames = {
  "zh-CN": "中文",
  "en-US": "English",
} as const;

export type Locale = keyof typeof localeNames;

export const defaultLocale: Locale = "zh-CN";

const localeLoaders: Record<Locale, () => Promise<{ default: Dictionary }>> = {
  "zh-CN": () => import("./dictionaries/zh-CN"),
  "en-US": () => import("./dictionaries/en-US"),
};

const supportedLocales: Locale[] = Object.keys(localeLoaders) as Locale[];

export function detectBrowserLanguage(): Locale {
  if (typeof navigator === "undefined") return defaultLocale;

  const browserLang = navigator.language;

  if (supportedLocales.includes(browserLang as Locale)) {
    return browserLang as Locale;
  }

  const langPrefix = browserLang.split("-")[0];
  const matchedLocale = supportedLocales.find((locale) => locale.startsWith(langPrefix + "-"));

  if (matchedLocale) {
    return matchedLocale;
  }

  return defaultLocale;
}

const loadedLocales = new Map<Locale, Dictionary>();

export async function loadLocale(locale: Locale): Promise<Dictionary> {
  if (loadedLocales.has(locale)) {
    return loadedLocales.get(locale)!;
  }

  try {
    const loader = localeLoaders[locale];
    if (!loader) {
      throw new Error(`Unsupported locale: ${locale}`);
    }

    const localeModule = await loader();
    const dictionary = localeModule.default;

    loadedLocales.set(locale, dictionary);

    return dictionary;
  } catch (error) {
    console.error(`Failed to load locale ${locale}:`, error);

    if (locale !== defaultLocale) {
      return loadLocale(defaultLocale);
    }

    return {} as Dictionary;
  }
}

export function getSupportedLocales(): Locale[] {
  return [...supportedLocales];
}
