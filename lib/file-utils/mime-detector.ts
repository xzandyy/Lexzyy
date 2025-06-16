// MIME类型检测和文件扩展名映射

// 根据文件扩展名获取MIME类型（备用方法）
export function getMimeTypeByExtension(fileName: string): string {
  const ext = fileName.toLowerCase().split(".").pop();
  const mimeMap: Record<string, string> = {
    // 文本文件
    md: "text/markdown",
    markdown: "text/markdown",
    txt: "text/plain",
    csv: "text/csv",
    log: "text/plain",
    gitignore: "text/plain",
    dockerfile: "text/plain",
    readme: "text/plain",

    // 代码文件
    js: "text/javascript",
    ts: "text/typescript",
    jsx: "text/javascript",
    tsx: "text/typescript",
    html: "text/html",
    htm: "text/html",
    css: "text/css",
    scss: "text/css",
    sass: "text/css",
    less: "text/css",
    php: "text/php",
    py: "text/x-python",
    java: "text/x-java-source",
    cpp: "text/x-c++src",
    c: "text/x-csrc",
    h: "text/x-chdr",
    rb: "text/x-ruby",
    go: "text/x-go",
    rs: "text/x-rust",
    swift: "text/x-swift",
    kt: "text/x-kotlin",
    sh: "text/x-shellscript",
    bash: "text/x-shellscript",
    zsh: "text/x-shellscript",
    fish: "text/x-shellscript",
    ps1: "text/x-powershell",
    bat: "text/x-msdos-batch",
    cmd: "text/x-msdos-batch",

    // 配置文件
    json: "application/json",
    xml: "application/xml",
    yaml: "text/yaml",
    yml: "text/yaml",
    toml: "text/x-toml",
    ini: "text/plain",
    conf: "text/plain",
    config: "text/plain",
    env: "text/plain",

    // 文档文件
    rtf: "application/rtf",
    tex: "application/x-latex",
    latex: "application/x-latex",

    // Office文档
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ppt: "application/vnd.ms-powerpoint",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",

    // 订阅文件
    rss: "application/rss+xml",
    atom: "application/atom+xml",
  };

  return mimeMap[ext || ""] || "";
}

// 获取文件的实际MIME类型（浏览器识别的或根据扩展名推断的）
export function getActualMimeType(file: File): string {
  return file.type || getMimeTypeByExtension(file.name);
}
