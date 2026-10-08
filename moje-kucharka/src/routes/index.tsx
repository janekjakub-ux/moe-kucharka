import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  CATEGORIES,
  CUISINES,
  DEFAULT_RECIPES,
  FALLBACK_IMAGE,
  loadRecipes,
  saveRecipes,
  scaleIngredient,
  servingsLabel,
  type Recipe,
} from "@/lib/recipes";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Moje Kuchařka — osobní sbírka receptů" },
      {
        name: "description",
        content:
          "Osobní kuchařka s českými recepty, vyhledáváním podle ingrediencí a kalkulátorem porcí.",
      },
      { property: "og:title", content: "Moje Kuchařka — osobní sbírka receptů" },
      {
        property: "og:description",
        content:
          "Osobní kuchařka s českými recepty, vyhledáváním podle ingrediencí a kalkulátorem porcí.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Kucharka,
});

type View = "list" | "detail" | "form";

type FormState = {
  id: string;
  title: string;
  category: string;
  time: string;
  image: string;
  ingredients: string;
  instructions: string;
};

const EMPTY_FORM: FormState = {
  id: "",
  title: "",
  category: "Hlavní chody",
  time: "",
  image: "",
  ingredients: "",
  instructions: "",
};

function Kucharka() {
  const [recipes, setRecipes] = useState<Recipe[]>(DEFAULT_RECIPES);
  const [view, setView] = useState<View>("list");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("vse");
  const [cuisine, setCuisine] = useState("vse");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [servings, setServings] = useState(4);
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  useEffect(() => {
    setRecipes(loadRecipes());
  }, []);

  const persist = (next: Recipe[]) => {
    setRecipes(next);
    saveRecipes(next);
  };

  const selected = recipes.find((r) => r.id === selectedId) ?? null;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return recipes.filter((r) => {
      const matchesCategory = category === "vse" || r.category === category;
      const matchesCuisine = cuisine === "vse" || r.cuisine === cuisine;
      const matchesSearch =
        r.title.toLowerCase().includes(q) ||
        r.ingredients.some((i) => i.toLowerCase().includes(q));
      return matchesCategory && matchesCuisine && matchesSearch;
    });
  }, [recipes, search, category, cuisine]);

  const go = (next: View) => {
    setView(next);
    window.scrollTo(0, 0);
  };

  const openDetail = (id: string) => {
    const recipe = recipes.find((r) => r.id === id);
    if (!recipe) return;
    setSelectedId(id);
    setServings(recipe.baseServings || 4);
    setChecked({});
    go("detail");
  };

  const openForm = (recipe?: Recipe) => {
    setForm(
      recipe
        ? {
            id: recipe.id,
            title: recipe.title,
            category: recipe.category || "Hlavní chody",
            time: String(recipe.time),
            image: recipe.image ?? "",
            ingredients: recipe.ingredients.join(", "),
            instructions: recipe.instructions,
          }
        : EMPTY_FORM,
    );
    go("form");
  };

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const ingredients = form.ingredients
      .split(",")
      .map((i) => i.trim())
      .filter(Boolean);
    const base = {
      title: form.title.trim(),
      category: form.category,
      time: parseInt(form.time, 10) || 0,
      image: form.image.trim(),
      ingredients,
      instructions: form.instructions.trim(),
    };

    if (form.id) {
      persist(recipes.map((r) => (r.id === form.id ? { ...r, ...base } : r)));
      openDetail(form.id);
    } else {
      persist([{ id: Date.now().toString(), baseServings: 4, ...base }, ...recipes]);
      go("list");
    }
  };

  const deleteSelected = () => {
    if (!selected) return;
    if (!window.confirm("Opravdu chcete tento recept smazat?")) return;
    persist(recipes.filter((r) => r.id !== selected.id));
    setSelectedId(null);
    go("list");
  };

  const ratio = selected ? servings / (selected.baseServings || 4) : 1;

  return (
    <div className="app-shell flex min-h-screen flex-col bg-background pb-8">
      <header className="sticky top-0 z-50 flex items-center justify-between bg-primary px-5 py-5 text-primary-foreground shadow-soft">
        <h1 className="flex items-center gap-2 text-xl font-bold">🍳 Moje Kuchařka</h1>
        <button
          onClick={() => openForm()}
          className="flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
        >
          + Přidat recept
        </button>
      </header>

      {view === "list" && (
        <main>
          <div className="p-5 pb-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Hledat podle názvu nebo ingrediencí..."
              className="w-full rounded-lg border border-border bg-card px-4 py-3 text-base outline-none placeholder:text-muted-foreground focus:border-primary"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto px-5 pb-2">
            {["vse", ...CUISINES].map((c) => (
              <button
                key={c}
                onClick={() => setCuisine(c)}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  cuisine === c
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-border bg-card text-muted-foreground"
                }`}
              >
                {c === "vse" ? "Všechny kuchyně" : `${c} kuchyně`}
              </button>
            ))}
          </div>
          <p className="px-5 pb-2 text-xs text-muted-foreground">Nalezeno receptů: {filtered.length}</p>
          <div className="flex gap-2 overflow-x-auto px-5 pb-4">
            {["vse", ...CATEGORIES].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  category === cat
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground"
                }`}
              >
                {cat === "vse" ? "Všechny" : cat}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-4 px-5">
            {filtered.length === 0 && (
              <div className="py-10 text-center text-muted-foreground">
                <p className="mb-2 text-3xl">🔍</p>
                <p>Nenalezeny žádné recepty podle zadaných kritérií.</p>
              </div>
            )}

            {filtered.map((r) => (
              <button
                key={r.id}
                onClick={() => openDetail(r.id)}
                className="overflow-hidden rounded-xl bg-card text-left shadow-soft transition-shadow hover:shadow-lift"
              >
                <img
                  src={r.image || FALLBACK_IMAGE}
                  alt={r.title}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_IMAGE;
                  }}
                  className="h-44 w-full object-cover"
                />
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-bold text-primary">{r.title}</h3>
                    <span className="shrink-0 rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">
                      {r.category || "Recept"}
                    </span>
                  </div>
                  <div className="mt-2 flex gap-4 text-sm text-muted-foreground">
                    <span>⏱️ {r.time} minut</span>
                    <span>🥗 {r.ingredients.length} ingrediencí</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </main>
      )}

      {view === "detail" && selected && (
        <main>
          <div className="relative">
            <img
              src={selected.image || FALLBACK_IMAGE}
              alt={selected.title}
              onError={(e) => {
                e.currentTarget.src = FALLBACK_IMAGE;
              }}
              className="h-60 w-full object-cover"
            />
            <button
              onClick={() => go("list")}
              className="absolute left-4 top-4 rounded-full bg-card/90 px-4 py-2 text-sm font-semibold text-foreground shadow-soft"
            >
              ← Zpět
            </button>
          </div>

          <div className="p-5">
            <h2 className="text-2xl font-bold text-primary">{selected.title}</h2>
            <div className="mt-2 flex items-center gap-3">
              <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">
                {selected.category || "Recept"}
              </span>
              <span className="text-sm text-muted-foreground">⏱️ {selected.time} min</span>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-card p-4 shadow-soft">
              <span className="text-sm font-semibold">👥 Počet porcí / lidí:</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setServings((s) => Math.max(1, s - 1))}
                  className="h-9 w-9 rounded-full bg-primary text-lg font-bold text-primary-foreground"
                >
                  −
                </button>
                <span className="min-w-20 text-center text-sm font-semibold">
                  {servings} {servingsLabel(servings)}
                </span>
                <button
                  onClick={() => setServings((s) => Math.min(20, s + 1))}
                  className="h-9 w-9 rounded-full bg-primary text-lg font-bold text-primary-foreground"
                >
                  +
                </button>
              </div>
            </div>

            <h3 className="mt-6 text-base font-bold uppercase tracking-wide text-primary">
              Ingredience
            </h3>
            <ul className="mt-3 flex flex-col gap-2">
              {selected.ingredients.map((ing, index) => (
                <li key={index} className="flex items-start gap-3 rounded-lg bg-card p-3 shadow-soft">
                  <input
                    id={`ing-${index}`}
                    type="checkbox"
                    checked={!!checked[index]}
                    onChange={(e) => setChecked((c) => ({ ...c, [index]: e.target.checked }))}
                    className="mt-0.5 h-5 w-5 accent-[var(--primary)]"
                  />
                  <label
                    htmlFor={`ing-${index}`}
                    className={checked[index] ? "text-muted-foreground line-through" : ""}
                  >
                    {scaleIngredient(ing, ratio)}
                  </label>
                </li>
              ))}
            </ul>

            <h3 className="mt-6 text-base font-bold uppercase tracking-wide text-primary">
              Postup přípravy
            </h3>
            <p className="mt-3 whitespace-pre-line rounded-xl bg-card p-4 leading-relaxed shadow-soft">
              {selected.instructions}
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => openForm(selected)}
                className="flex-1 rounded-lg bg-primary py-3.5 font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
              >
                ✏️ Upravit recept
              </button>
              <button
                onClick={deleteSelected}
                className="rounded-lg bg-destructive px-5 py-3.5 font-semibold text-destructive-foreground"
              >
                🗑️
              </button>
            </div>
          </div>
        </main>
      )}

      {view === "form" && (
        <main className="p-5">
          <h2 className="mb-4 text-xl font-bold text-primary">
            {form.id ? "Upravit recept" : "Přidat nový recept"}
          </h2>
          <form onSubmit={submitForm} className="flex flex-col gap-4">
            <Field label="Název receptu *">
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="např. Svíčková na smetaně"
                className={inputClass}
              />
            </Field>

            <Field label="Kategorie">
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={inputClass}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Doba přípravy (v minutách) *">
              <input
                required
                type="number"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                placeholder="60"
                className={inputClass}
              />
            </Field>

            <Field label="URL adresa obrázku (volitelné)">
              <input
                type="url"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="https://..."
                className={inputClass}
              />
            </Field>

            <Field label="Ingredience pro 4 porce (oddělené čárkou) *">
              <textarea
                required
                value={form.ingredients}
                onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
                placeholder="700g hovězí maso, 1x cibule, 250ml smetana..."
                className={`${inputClass} min-h-24`}
              />
            </Field>

            <Field label="Postup vaření *">
              <textarea
                required
                value={form.instructions}
                onChange={(e) => setForm({ ...form, instructions: e.target.value })}
                placeholder={"1. Maso orestujeme na cibulce...\n2. Přidáme koření a podlijeme..."}
                className={`${inputClass} min-h-36`}
              />
            </Field>

            <div className="mt-2 flex gap-3">
              <button
                type="button"
                onClick={() => go(selectedId && form.id ? "detail" : "list")}
                className="rounded-lg bg-secondary px-5 py-3.5 font-semibold text-secondary-foreground"
              >
                Zrušit
              </button>
              <button
                type="submit"
                className="flex-1 rounded-lg bg-primary py-3.5 font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
              >
                Uložit recept
              </button>
            </div>
          </form>
        </main>
      )}
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-border bg-card px-4 py-3 text-base outline-none placeholder:text-muted-foreground focus:border-primary";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
