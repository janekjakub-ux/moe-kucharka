import babovkaImg from "@/assets/babovka.jpg";
import bramborakyImg from "@/assets/bramboraky.jpg";
import gulasImg from "@/assets/gulas.jpg";
import placeholderImg from "@/assets/placeholder-recipe.jpg";
import svickovaImg from "@/assets/svickova.jpg";
import veprozeloImg from "@/assets/veprozelo.jpg";
import libraryData from "./recipes-library.json";

export type Recipe = {
  id: string;
  title: string;
  category: string;
  time: number;
  baseServings: number;
  image: string;
  ingredients: string[];
  instructions: string;
  cuisine?: string;
};

export const CATEGORIES = ["Hlavní chody", "Přílohy", "Polévky", "Předkrmy a saláty", "Dezerty"] as const;
export const CUISINES = ["Česká", "Italská", "Světová"] as const;

export const FALLBACK_IMAGE = placeholderImg;

const STORAGE_KEY = "pwa_kucharka_recipes";

export const DEFAULT_RECIPES: Recipe[] = [
  {
    id: "1",
    title: "Svíčková na smetaně",
    category: "Hlavní chody",
    time: 150,
    baseServings: 4,
    image: svickovaImg,
    ingredients: [
      "700g hovězí zadní",
      "200g kořenová zelenina (mrkev, celer, petržel)",
      "1x cibule",
      "250ml smetana ke šlehání",
      "100g špek",
      "divoké koření (nové koření, pepř, bobkový list)",
      "citrón",
      "brusinky",
    ],
    instructions:
      "1. Hovězí maso prošpikujeme klínky špeku, osolíme a opepříme.\n2. Na rozpaleném tuku orestujeme nakrájenou kořenovou zeleninu a cibulku do zlatova.\n3. Přidáme maso, opečeme ze všech stran, přidáme divoké koření a podlijeme vodou nebo vývarem.\n4. Dusíme doměkka (cca 2 hodiny).\n5. Maso vyjmeme, koření odstraníme, zeleninový základ rozmixujeme, zahustíme smetanou a dochutíme citrónovou šťávou.\n6. Podáváme s houskovým knedlíkem a brusinkami.",
  },
  {
    id: "2",
    title: "Hovězí guláš",
    category: "Hlavní chody",
    time: 120,
    baseServings: 4,
    image: gulasImg,
    ingredients: [
      "600g hovězí kližka",
      "500g cibule",
      "3 lžíce mletá sladká paprika",
      "2 stroužky česnek",
      "majoránka",
      "sůl",
      "pepř",
      "sádlo",
    ],
    instructions:
      "1. Na sádle osmažíme velkorysé množství cibule zcela do tmavooranžova.\n2. Přidáme nakrájené hovězí maso, zprudka opečeme, zasypeme sladkou paprikou a krátce zarestujeme.\n3. Podlijeme trochou vody, osolíme, opepříme a pod pokličkou dusíme do změknutí (cca 1,5–2 hodiny).\n4. Nakonec dochutíme třeným česnekem a rozetřenou majoránkou. Podáváme s houskovým knedlíkem nebo chlebem.",
  },
  {
    id: "3",
    title: "Křupavé Bramboráky",
    category: "Přílohy",
    time: 35,
    baseServings: 4,
    image: bramborakyImg,
    ingredients: [
      "1000g brambory (typ B/C)",
      "2x vejce",
      "4 stroužky česneku",
      "100ml mléko",
      "3 lžíce hladká mouka",
      "hodně majoránky",
      "sůl, pepř",
      "sádlo na smažení",
    ],
    instructions:
      "1. Brambory oloupeme a nastrouháme najemno (případně napůl nahrubo).\n2. Vytlačíme přebytečnou vodu a zalijeme horkým mlékem, aby brambory nezčernaly.\n3. Přidáme vejce, prolisovaný česnek, mouku, sůl, pepř a pořádnou dávku majoránky.\n4. Na pánvi na rozpáleném sádle smažíme tenké placky z obou stran dozlatova a dokřupava.",
  },
  {
    id: "4",
    title: "Vepřo knedlo zelo",
    category: "Hlavní chody",
    time: 110,
    baseServings: 4,
    image: veprozeloImg,
    ingredients: [
      "800g vepřová krkovice nebo bůček",
      "500g kysané zelí",
      "1x cibule",
      "kmín",
      "česnek",
      "sůl",
      "hladká mouka na zahuštění",
    ],
    instructions:
      "1. Vepřové maso nakrájíme na větší kostky, osolíme, opepříme, promačkáme s česnekem a kmínem.\n2. Dáme do pekáče s nakrájenou cibulí, podlijeme trochou vody a pečeme při 180°C cca 1.5 hodiny do změknutí a výpeku.\n3. Kysané zelí podlijeme vodou, přidáme kmín a podusíme. Nakonec lehce zahustíme jíškou.\n4. Podáváme s bramborovým nebo houskovým knedlíkem.",
  },
  {
    id: "5",
    title: "Tradiční bábovka",
    category: "Dezerty",
    time: 60,
    baseServings: 4,
    image: babovkaImg,
    ingredients: [
      "2x hrnek polohrubá mouka",
      "1x hrnek cukr krupice",
      "1x hrnek mléko",
      "0.5 hrnku olej",
      "3x vejce",
      "1x prášek do pečiva",
      "2 lžíce kakao",
    ],
    instructions:
      "1. Žloutky utřeme s cukrem a olejem, přidáme mléko a mouku smíchanou s kypřicím práškem.\n2. Z bílků ušleháme tuhý sníh a zlehka ho zapracujeme do těsta.\n3. Dvě třetiny těsta nalijeme do vymazané a vysypané bábovkové formy.\n4. Do zbylé třetiny přimícháme kakao a nalijeme na světlé těsto.\n5. Pečeme v předehřáté troubě na 180°C přibližně 45 minut.",
  },
];

const LIBRARY: Recipe[] = (libraryData as Omit<Recipe, "image">[]).map((r) => ({
  ...r,
  image: FALLBACK_IMAGE,
}));

const ALL_DEFAULTS: Recipe[] = [
  ...DEFAULT_RECIPES.map((r) => ({ ...r, cuisine: "Česká" })),
  ...LIBRARY,
];

const LIBRARY_KEY = "pwa_kucharka_library_v1";

export function loadRecipes(): Recipe[] {
  if (typeof window === "undefined") return ALL_DEFAULTS;
  const saved = window.localStorage.getItem(STORAGE_KEY);
  let list: Recipe[] = ALL_DEFAULTS;
  if (saved) {
    try {
      const parsed = JSON.parse(saved) as Recipe[];
      if (Array.isArray(parsed)) list = parsed;
    } catch {
      /* ignore */
    }
  }
  // Add the recipe library once for users who already had saved recipes
  if (saved && !window.localStorage.getItem(LIBRARY_KEY)) {
    const ids = new Set(list.map((r) => r.id));
    list = [...list, ...LIBRARY.filter((r) => !ids.has(r.id))];
    saveRecipes(list);
  }
  window.localStorage.setItem(LIBRARY_KEY, "1");
  // Bundled images change between builds; refresh library images
  return list.map((r) => (r.id.includes("-") && LIBRARY.some((l) => l.id === r.id) ? { ...r, image: FALLBACK_IMAGE } : r));
}

export function saveRecipes(recipes: Recipe[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
}

export function scaleIngredient(text: string, ratio: number): string {
  if (ratio === 1) return text;
  return text.replace(/(\d+(?:[.,]\d+)?)/g, (match) => {
    const num = parseFloat(match.replace(",", "."));
    if (Number.isNaN(num)) return match;
    const scaled = num * ratio;
    const rounded = scaled % 1 === 0 ? scaled : parseFloat(scaled.toFixed(1));
    return rounded.toString().replace(".", ",");
  });
}

export function servingsLabel(count: number): string {
  if (count === 1) return "porce";
  return count < 5 ? "porce" : "porcí";
}
