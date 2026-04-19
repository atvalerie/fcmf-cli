import fs from "fs/promises";
import path from "path";
import ansis from "ansis";
import {
  createPrompt,
  useKeypress,
  useMemo,
  usePrefix,
  useState,
  isEnterKey,
  isUpKey,
  isDownKey,
  isBackspaceKey,
  type Status,
  makeTheme,
  type Theme,
} from "@inquirer/core";
import type { PartialDeep } from "@inquirer/type";

type Entry = {
  name: string;
  fullPath: string;
  isDirectory: boolean;
};

type FilePickerConfig = {
  message: string;
  root?: string;
  initialDir?: string;
  pageSize?: number;
  showHidden?: boolean;
  theme?: PartialDeep<Theme>;
};

async function readDirectory(dir: string, showHidden = false): Promise<Entry[]> {
  const dirents = await fs.readdir(dir, { withFileTypes: true });

  return dirents
    .filter((d) => showHidden || !d.name.startsWith("."))
    .map((d) => ({
      name: d.name,
      fullPath: path.join(dir, d.name),
      isDirectory: d.isDirectory(),
    }))
    .sort((a, b) => {
      if (a.isDirectory !== b.isDirectory) {
        return a.isDirectory ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
}

async function readTree(root: string, showHidden = false): Promise<Entry[]> {
  const results: Entry[] = [];

  async function walk(dir: string) {
    const dirents = await fs.readdir(dir, { withFileTypes: true });

    const entries = dirents
      .filter((d) => showHidden || !d.name.startsWith("."))
      .map((d) => ({
        name: d.name,
        fullPath: path.join(dir, d.name),
        isDirectory: d.isDirectory(),
      }))
      .sort((a, b) => {
        if (a.isDirectory !== b.isDirectory) {
          return a.isDirectory ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      });

    for (const entry of entries) {
      results.push(entry);
      if (entry.isDirectory) {
        await walk(entry.fullPath);
      }
    }
  }

  await walk(root);
  return results;
}

async function isDirectory(p: string): Promise<boolean> {
  try {
    return (await fs.stat(p)).isDirectory();
  } catch {
    return false;
  }
}

async function normalizeStartDir(root: string, initialDir?: string): Promise<string> {
  const resolvedRoot = path.resolve(root);
  const candidate = path.resolve(initialDir ?? resolvedRoot);

  if (await isDirectory(candidate) && candidate.startsWith(resolvedRoot)) {
    return candidate;
  }

  return resolvedRoot;
}

function wrapIndex(index: number, length: number) {
  if (length <= 0) return 0;
  return (index + length) % length;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export const filePicker = createPrompt<string, FilePickerConfig>((config, done) => {
  const resolvedRoot = path.resolve(config.root ?? process.cwd());
  const pageSize = config.pageSize ?? 10;
  const showHidden = config.showHidden ?? false;

  const theme = makeTheme(config.theme);
  const [status, setStatus] = useState<Status>("idle");
  const prefix = usePrefix({ status, theme });

  const [currentDir, setCurrentDir] = useState<string>(resolvedRoot);
  const [filter, setFilter] = useState("");
  const [cursor, setCursor] = useState(0);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [indexedEntries, setIndexedEntries] = useState<Entry[]>([]);
  const [isIndexing, setIsIndexing] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [initialized, setInitialized] = useState(false);

  useMemo(() => {
    if (initialized) return;

    void (async () => {
      const startDir = await normalizeStartDir(resolvedRoot, config.initialDir);
      const list = await readDirectory(startDir, showHidden);
      setCurrentDir(startDir);
      setEntries(list);
      setCursor(0);
      setInitialized(true);

      setIsIndexing(true);
      try {
        const tree = await readTree(resolvedRoot, showHidden);
        setIndexedEntries(tree);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setIsIndexing(false);
      }
    })();
  }, [initialized, resolvedRoot, config.initialDir, showHidden]);

  const visibleEntries = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return entries;

    return indexedEntries.filter((entry) => {
      const relativePath = path.relative(resolvedRoot, entry.fullPath).toLowerCase();
      return (
        entry.name.toLowerCase().includes(q) ||
        relativePath.includes(q)
      );
    });
  }, [entries, filter, indexedEntries, resolvedRoot]);

  const boundedCursor = clamp(cursor, 0, Math.max(visibleEntries.length - 1, 0));
  const windowStart = clamp(
    boundedCursor - Math.floor(pageSize / 2),
    0,
    Math.max(visibleEntries.length - pageSize, 0),
  );
  const windowEnd = windowStart + pageSize;
  const windowedEntries = visibleEntries.slice(windowStart, windowEnd);

  const selected = visibleEntries[boundedCursor];

  async function loadDirectory(nextDir: string) {
    try {
      const normalized = path.resolve(nextDir);

      if (!normalized.startsWith(resolvedRoot)) {
        setError("Cannot leave the configured root.");
        return;
      }

      const list = await readDirectory(normalized, showHidden);
      setCurrentDir(normalized);
      setEntries(list);
      setFilter("");
      setCursor(0);
      setError(undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function goUp() {
    if (currentDir === resolvedRoot) return;
    await loadDirectory(path.dirname(currentDir));
  }

  async function openSelection() {
    if (!selected) return;

    if (selected.isDirectory) {
      await loadDirectory(selected.fullPath);
      return;
    }

    setStatus("done");
    done(selected.fullPath);
  }

  useKeypress((key, rl) => {
    void (async () => {
      setError(undefined);

      if (isUpKey(key)) {
        setCursor(wrapIndex(boundedCursor - 1, visibleEntries.length));
        return;
      }

      if (isDownKey(key)) {
        setCursor(wrapIndex(boundedCursor + 1, visibleEntries.length));
        return;
      }

      if (key.name === "left" || key.name === "h") {
        await goUp();
        return;
      }

      if (key.name === "right" || key.name === "l") {
        await openSelection();
        return;
      }

      if (isEnterKey(key)) {
        await openSelection();
        return;
      }

      if (isBackspaceKey(key)) {
        if (filter.length > 0) {
          setFilter(rl.line);
          setCursor(0);
          return;
        }

        // backspace on empty filter goes to parent
        await goUp();
        return;
      }

      if (key.ctrl || key.name == "meta") return;

      // filter now
      setFilter(rl.line);
      setCursor(0);
    })();
  });

  const renderedList =
    visibleEntries.length === 0
      ? theme.style.help(filter && isIndexing ? "  Indexing files..." : "  No matches")
      : windowedEntries
          .map((item, index) => {
            const isActive = windowStart + index === boundedCursor;
            const pointer = isActive ? ansis.yellow(">") : " ";
            const icon = item.isDirectory ? ansis.cyan("🗀 ") : "🗈 ";
            const relativePath = path.relative(resolvedRoot, item.fullPath);
            const label = filter
              ? item.isDirectory
                ? `${relativePath}/`
                : relativePath
              : item.isDirectory
                ? `${item.name}/`
                : item.name;
            const text = isActive ? theme.style.highlight(label) : label;
            return `${pointer} ${icon} ${text}`;
          })
          .join("\n");

  const message = theme.style.message(config.message, status);
  const dirLine = ansis.dim(currentDir);
  const filterLine = filter
    ? `${ansis.cyan("filter:")} ${filter}`
    : ansis.dim("filter: ");

  const helpLine = theme.style.help(
    "↑/↓ move • Enter open/select • ←/h parent • →/l enter • Backspace on empty goes up",
  );

  const promptLine =
    status === "done"
      ? `${prefix} ${message} ${theme.style.answer(selected?.fullPath ?? currentDir)}`
      : `${prefix} ${message}`;

  if (status === "done") {
    return promptLine;
  }

  const bottom = [
    dirLine,
    filterLine,
    "",
    renderedList,
    "",
    helpLine,
    error ? theme.style.error(error) : "",
  ]
    .filter(Boolean)
    .join("\n");

  return [promptLine, bottom];
});
