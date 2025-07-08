export const emptyDictionary = {
  common: {
    loading: "",
    error: "",
    success: "",
    confirm: "",
    cancel: "",
    save: "",
    delete: "",
    edit: "",
    add: "",
    search: "",
    warning: "",
    info: "",
  },
  settings: {
    title: "",
    language: "",
    selectLanguage: "",
    currentLanguage: "",
    noOptions: "",
  },
  chat: {
    input: "",
    send: "",
    stop: "",
    reload: "",
    empty: "",
    error: "",
    placeholder: "",
    sendMessage: "",
    stopGeneration: "",
    regenerate: "",
    addAttachment: "",
    dragDropFiles: "",
    dragDropDescription: "",
    clearAllFiles: "",
    processingFiles: "",
    retry: "",
    unsupportedFileType: "",
    processingFailed: "",
    retryFailed: "",
    waitingForReply: "",
    replying: "",
    online: "",
  },
  flow: {
    locate: "",
    style: "",
    styleConfig: "",
    resetToDefault: "",
    nodeSize: "",
    layoutSpacing: "",
    typography: "",
    edgeStyle: "",
    width: "",
    height: "",
    horizontalSpacing: "",
    verticalSpacing: "",
    fontSize: "",
    lineHeight: "",
    maxCharacters: "",
    edgeWidth: "",
    edgeType: "",
    edgeAnimated: "",
    default: "",
    bezierCurve: "",
    straight: "",
    step: "",
    smoothStep: "",
    title: "",
  },
  list: {
    startNewChat: "",
    chatDescription: "",
    errorOccurred: "",
    unknownError: "",
  },
  markdown: {
    loadingChart: "",
  },
  documents: {
    pdfDocument: "",
    wordDocument: "",
    wordDocumentDocx: "",
    wordDocumentDoc: "",
    excelWorkbook: "",
    excelWorkbookXlsx: "",
    excelWorkbookXls: "",
    powerpointPresentation: "",
    powerpointPresentationPptx: "",
    powerpointPresentationPpt: "",
    xmlDocument: "",
    xmlDocumentXml: "",
    jsonDataFile: "",
    jsonDataFileJson: "",
    xhtmlDocument: "",
    xhtmlDocumentXhtml: "",
    latexDocument: "",
    latexDocumentTex: "",
    texDocument: "",
    texDocumentTex: "",
    yamlConfigFile: "",
    yamlConfigFileYml: "",
    yamlConfigFileYaml: "",
    yamlConfigFileYmlYaml: "",
    rssFeed: "",
    rssFeedRss: "",
    atomFeed: "",
    atomFeedAtom: "",
  },
  sidebar: {
    expandCollapse: "",
  },
  attachment: {
    attachment: "",
    downloadFile: "",
  },
  navigation: {
    chatFlow: "",
    settings: "",
  },
} as const;

export const localeNames = {
  "zh-CN": "中文",
  "en-US": "English",
} as const;

export type Dictionary = typeof emptyDictionary;
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
