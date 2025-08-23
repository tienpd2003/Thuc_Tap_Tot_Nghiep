import { useEffect, useMemo, useState } from 'react';

// Map of available packs. Loaded on demand to avoid huge bundles.
const ICON_PACKS = [
  { key: 'ai', label: 'Ant Design', loader: () => import('react-icons/ai') },
  { key: 'bs', label: 'Bootstrap', loader: () => import('react-icons/bs') },
  { key: 'bi', label: 'BoxIcons', loader: () => import('react-icons/bi') },
  { key: 'cg', label: 'CSS.gg', loader: () => import('react-icons/cg') },
  { key: 'di', label: 'Devicons', loader: () => import('react-icons/di') },
  { key: 'fa', label: 'Font Awesome', loader: () => import('react-icons/fa') },
  { key: 'fc', label: 'Flat Color', loader: () => import('react-icons/fc') },
  { key: 'fi', label: 'Feather', loader: () => import('react-icons/fi') },
  { key: 'gi', label: 'Game Icons', loader: () => import('react-icons/gi') },
  { key: 'go', label: 'Github Octicons', loader: () => import('react-icons/go') },
  { key: 'gr', label: 'Grommet', loader: () => import('react-icons/gr') },
  { key: 'hi', label: 'Heroicons v1', loader: () => import('react-icons/hi') },
  { key: 'hi2', label: 'Heroicons v2', loader: () => import('react-icons/hi2') },
  { key: 'im', label: 'IcoMoon', loader: () => import('react-icons/im') },
  { key: 'io', label: 'Ionicons 4', loader: () => import('react-icons/io') },
  { key: 'io5', label: 'Ionicons 5', loader: () => import('react-icons/io5') },
  { key: 'md', label: 'Material Design', loader: () => import('react-icons/md') },
  { key: 'pi', label: 'Phosphor', loader: () => import('react-icons/pi') },
  { key: 'ri', label: 'Remix', loader: () => import('react-icons/ri') },
  { key: 'rx', label: 'Radix', loader: () => import('react-icons/rx') },
  { key: 'si', label: 'Simple Icons', loader: () => import('react-icons/si') },
  { key: 'sl', label: 'Simple Line', loader: () => import('react-icons/sl') },
  { key: 'tb', label: 'Tabler', loader: () => import('react-icons/tb') },
  { key: 'tfi', label: 'Themify', loader: () => import('react-icons/tfi') },
  { key: 'ti', label: 'Typicons', loader: () => import('react-icons/ti') },
  { key: 'vsc', label: 'VS Code', loader: () => import('react-icons/vsc') },
  { key: 'wi', label: 'Weather', loader: () => import('react-icons/wi') },
];

function IconGallery() {
  const [packKey, setPackKey] = useState(ICON_PACKS[0].key);
  const [packModule, setPackModule] = useState(null);
  const [query, setQuery] = useState('');
  const [size, setSize] = useState(28);
  const [copied, setCopied] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load selected pack lazily
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    const target = ICON_PACKS.find((p) => p.key === packKey);
    if (!target) return;
    target
      .loader()
      .then((mod) => {
        if (!cancelled) setPackModule(mod);
      })
      .catch(() => {
        if (!cancelled) setError('Không thể tải icon pack. Hãy đảm bảo đã cài react-icons.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [packKey]);

  const entries = useMemo(() => {
    if (!packModule) return [];
    return Object.entries(packModule)
      .filter(([, val]) => typeof val === 'function')
      .map(([name, Component]) => ({ name, Component }));
  }, [packModule]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter((e) => e.name.toLowerCase().includes(q));
  }, [entries, query]);

  const handleCopy = async (iconName) => {
    const importLine = `import { ${iconName} } from 'react-icons/${packKey}';`;
    try {
      await navigator.clipboard.writeText(importLine);
      setCopied(iconName);
      setTimeout(() => setCopied(''), 1200);
    } catch {
      // ignore copy errors
    }
  };

  const currentPack = ICON_PACKS.find((p) => p.key === packKey);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-slate-800">React Icons Gallery</h1>
              <p className="text-sm text-slate-500">Xem toàn bộ icon và tên icon. Click để copy câu lệnh import.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="flex items-center gap-2">
                <span className="whitespace-nowrap text-sm text-slate-600">Bộ icon</span>
                <select
                  value={packKey}
                  onChange={(e) => setPackKey(e.target.value)}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {ICON_PACKS.map((p) => (
                    <option key={p.key} value={p.key}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex items-center gap-2">
                <span className="whitespace-nowrap text-sm text-slate-600">Kích thước</span>
                <input
                  type="range"
                  min="16"
                  max="64"
                  step="2"
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                />
                <span className="w-8 text-right text-sm text-slate-600">{size}px</span>
              </label>

              <div className="relative">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={`Tìm icon trong ${currentPack?.label || ''}...`}
                  className="w-64 rounded-lg border border-slate-300 bg-white px-3 py-2 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 104.2 12.06l3.5 3.5a.75.75 0 101.06-1.06l-3.5-3.5a6.75 6.75 0 00-5.26-11zM6 10.5a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0z" clipRule="evenodd"/></svg>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 text-xs text-slate-500">
            {loading ? 'Đang tải icons...' : `${filtered.length.toLocaleString()} / ${entries.length.toLocaleString()} icons`}
          </div>
        </div>

        {error ? (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
        ) : null}

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
          {filtered.map(({ name, Component }) => (
            <button
              key={name}
              onClick={() => handleCopy(name)}
              title={`Sao chép import: ${name}`}
              className="group relative flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white p-4 text-slate-700 shadow-sm transition hover:border-indigo-300 hover:shadow-md"
            >
              <Component size={size} className="text-slate-700 transition group-hover:text-indigo-600" />
              <span className="truncate text-xs font-medium text-slate-600 group-hover:text-slate-800">{name}</span>
              {copied === name ? (
                <span className="absolute -top-2 right-2 rounded-md bg-emerald-500 px-1.5 py-0.5 text-[10px] font-semibold text-white shadow">Copied</span>
              ) : null}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default IconGallery;


