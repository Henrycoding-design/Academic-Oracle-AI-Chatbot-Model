import hljs from "highlight.js/lib/core";

// Common languages
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import python from "highlight.js/lib/languages/python";
import json from "highlight.js/lib/languages/json";
import bash from "highlight.js/lib/languages/bash";

// 💥 Add these
import cpp from "highlight.js/lib/languages/cpp";
import csharp from "highlight.js/lib/languages/csharp";
import java from "highlight.js/lib/languages/java";

// Register
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("js", javascript);

hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("ts", typescript);

hljs.registerLanguage("python", python);
hljs.registerLanguage("py", python);

hljs.registerLanguage("json", json);

hljs.registerLanguage("bash", bash);
hljs.registerLanguage("sh", bash);

// 👇 New ones
hljs.registerLanguage("cpp", cpp);
hljs.registerLanguage("c++", cpp); // alias (optional but nice)
hljs.registerLanguage("csharp", csharp);
hljs.registerLanguage("cs", csharp);
hljs.registerLanguage("java", java);

// Global config
hljs.configure({
  ignoreUnescapedHTML: true,
});

export default hljs;
