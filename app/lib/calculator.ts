// Pricing calculator logic ported from the standalone EOD calculator.
// Pure functions + Excel-derived constants. No DOM access.

export const DAYS_BY_YEAR: Record<number, number> = {
  2024: 253,
  2025: 252,
  2026: 253,
  2027: 255,
  2028: 252,
};

export const HOLIDAYS = new Set<string>([
  "2024-01-01", "2024-04-01", "2024-05-01", "2024-05-08", "2024-05-09", "2024-05-20", "2024-07-14", "2024-08-15", "2024-11-01", "2024-11-11", "2024-12-25",
  "2025-01-01", "2025-04-21", "2025-05-01", "2025-05-08", "2025-05-29", "2025-06-09", "2025-07-14", "2025-08-15", "2025-11-01", "2025-11-11", "2025-12-25",
  "2026-01-01", "2026-04-06", "2026-05-01", "2026-05-08", "2026-05-14", "2026-05-25", "2026-07-14", "2026-08-15", "2026-11-01", "2026-11-11", "2026-12-25",
  "2027-01-01", "2027-03-29", "2027-05-01", "2027-05-08", "2027-05-06", "2027-05-17", "2027-07-14", "2027-08-15", "2027-11-01", "2027-11-11", "2027-12-25",
  "2028-01-01", "2028-04-17", "2028-05-01", "2028-05-08", "2028-05-25", "2028-07-14", "2028-08-15", "2028-11-01", "2028-11-11", "2028-12-25",
]);

// Coût de locaux AKKODIS (€/jour travaillé) — source Excel PARAM_TABLE_LOCAUX
export const LOCAUX_COST: Record<string, number> = {
  Adely: 16.3623522340212,
  Aix: 23.2028846938776,
  Albero: 30,
  Andromède: 18,
  Annecy: 17.311222119815667,
  "Modis - Aubière": 20.360388940092168,
  "Modis - Bouguenais": 16.678249769585257,
  Bourges: 9.880458963786637,
  "Belfort TechHom": 8.27547926267281,
  Cannes: 14,
  Chatelerault: 5.119815705069126,
  "Modis - Courbevoie": 49.34865327368741,
  Gonfreville: 13.855275382003398,
  Grenoble: 13.827498952660243,
  "Laudun sur l'Ardoise": 20.00230414746544,
  Louviers: 10.456755760368663,
  "La Rochelle": 14.68168637261356,
  Marignane: 19,
  "Mérignac JB": 17,
  "Modis - Pau": 20,
  "Modis - Marcq en Baroeul": 12.48183621569962,
  Marseille: 22.532025938117187,
  "Modis - Schiltigheim": 16.585872235023036,
  Niort: 17,
  Pau: 14,
  Périsud: 14,
  Ramonville: 15,
  Rennes: 14.48953603686636,
  "St Apollinaire": 27.03142857142858,
  "St Denis": 29.26795465437788,
  "Six Four Les Pl": 18,
  "Modis - St Herblain": 13.833494733377222,
  "Toulouse Basso": 17,
  Toulon: 18.33930414746544,
  "Modis - Tours": 14.325014285714287,
  Valence: 8.253456221198157,
};

// Coûts IT / Téléphonie (€/jour travaillé) — source Excel PARAM_TABLE_COUTS_IT
export const IT_PROFILES = [
  { value: "1 - Basic", label: "1 - Basic (Assistance Technique)", price: 0.55 },
  { value: "2 - Bureautique", label: "2 - Bureautique (PC standard hors CAO)", price: 2.75 },
  { value: "2.05 - Documentaire", label: "2.05 - Documentaire (Adobe / Arbortext)", price: 5 },
  { value: "2.1 - PC CAO sans licence", label: "2.1 - PC CAO sans licence", price: 5.5 },
  { value: "3 - DEV", label: "3 - DEV (Matlab, Docker, etc.)", price: 6 },
  { value: "4 - CAD Medium", label: "4 - CAD Medium (Solidwork / Autocad…)", price: 19 },
  { value: "5 - CAD High", label: "5 - CAD High (Catia V5 / Siemens NX)", price: 40 },
];

export interface TariffRow {
  family: string;
  code: string;
  tjmInSitu: number | null;
  tjmExSitu: number | null;
  tjmOffshore: number | null;
}

export type PricingMode = "TJM" | "MB souhaitee";
export type DeliveryMode = "tjmInSitu" | "tjmExSitu" | "tjmOffshore";

export interface CalculatorInput {
  firstName: string;
  lastName: string;
  included: "Oui" | "Non";
  resourceType: "Interne" | "externe";
  startDate: string;
  endDate: string;
  salaryAnnual: number;
  pricingMode: PricingMode;
  tjmInput: number;
  targetMarginPct: number;
  // Optional
  partTime: number;
  freeDays: number;
  leaveY0: number;
  leaveY1: number;
  leaveY2: number;
  cjSst: number;
  caOther: number;
  productionCost: number;
  travelCost: number;
  travelRefact: number;
  siteRealisation: "Site Client" | "Site AKKODIS";
  locauxAkkodis: string;
  occupancyRate: number;
  itProfile: string;
  serviceCode: string;
  deliveryMode: DeliveryMode;
  // Technical
  rfaPct: number;
  chargeLow: number;
  chargeHigh: number;
  salaryPivot: number;
  annualIncrease: number;
}

export const DEFAULT_CALCULATOR_INPUT: CalculatorInput = {
  firstName: "",
  lastName: "",
  included: "Oui",
  resourceType: "Interne",
  startDate: "2026-01-05",
  endDate: "2026-12-18",
  salaryAnnual: 45000,
  pricingMode: "TJM",
  tjmInput: 470,
  targetMarginPct: 25,
  partTime: 1,
  freeDays: 0,
  leaveY0: 0,
  leaveY1: 0,
  leaveY2: 0,
  cjSst: 0,
  caOther: 0,
  productionCost: 0,
  travelCost: 0,
  travelRefact: 0,
  siteRealisation: "Site Client",
  locauxAkkodis: "",
  occupancyRate: 100,
  itProfile: "",
  serviceCode: "",
  deliveryMode: "tjmInSitu",
  rfaPct: 0,
  chargeLow: 1.4051,
  chargeHigh: 1.8071,
  salaryPivot: 26700,
  annualIncrease: 1.025,
};

export interface CalculatorResult {
  ok: boolean;
  message?: string;
  tjm: number;
  marginAmount: number;
  marginPct: number;
  daysWorked: number;
  billableDays: number;
  tariffAlert?: { status: "ok" | "warn" | "danger"; text: string };
  details: Array<[string, string]>;
}

const numberFmt = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 });
const currencyFmt = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 2,
});

export function formatCurrency(value: number): string {
  return currencyFmt.format(value);
}

export function formatPercent(value: number): string {
  return `${numberFmt.format(value * 100)} %`;
}

function businessDays(startDate: Date, endDate: Date): number {
  if (
    Number.isNaN(startDate.getTime()) ||
    Number.isNaN(endDate.getTime()) ||
    startDate > endDate
  ) {
    return 0;
  }
  let count = 0;
  const d = new Date(startDate);
  while (d <= endDate) {
    const day = d.getDay();
    const iso = d.toISOString().slice(0, 10);
    if (day !== 0 && day !== 6 && !HOLIDAYS.has(iso)) count += 1;
    d.setDate(d.getDate() + 1);
  }
  return count;
}

function businessDaysForYear(startDate: Date, endDate: Date, year: number): number {
  const yStart = new Date(`${year}-01-01`);
  const yEnd = new Date(`${year}-12-31`);
  const from = startDate > yStart ? startDate : yStart;
  const to = endDate < yEnd ? endDate : yEnd;
  if (to < from) return 0;
  return businessDays(from, to);
}

function computeCjm(
  baseSalaryAnnual: number,
  chargeRate: number,
  annualIncrease: number,
  yearShift: number,
  daysOpen: number,
): number {
  if (!daysOpen) return 0;
  return (baseSalaryAnnual * annualIncrease ** yearShift * chargeRate) / daysOpen;
}

function computeTjmTarget(args: {
  costInternalPersonnel: number;
  costSst: number;
  costTravel: number;
  costProd: number;
  travelRefact: number;
  billableDays: number;
  targetMarginPct: number;
  caOther: number;
  rfa: number;
}): number {
  const totalCosts =
    args.costInternalPersonnel +
    args.costSst +
    args.costTravel +
    args.costProd -
    args.travelRefact;
  if (args.billableDays <= 0 || args.targetMarginPct >= 0.99) return 0;
  const numerator = totalCosts / (1 - args.targetMarginPct) - args.caOther;
  const denominator = args.billableDays * (1 - args.rfa);
  if (denominator <= 0) return 0;
  const candidate = numerator / denominator;
  return candidate <= args.targetMarginPct ? 0 : Math.max(0, candidate);
}

function evaluateTariff(
  input: CalculatorInput,
  tariffRows: TariffRow[],
  tjmForCalc: number,
): CalculatorResult["tariffAlert"] {
  if (!input.serviceCode) return undefined;
  const hit = tariffRows.find((row) => row.code === input.serviceCode);
  if (!hit) return { status: "warn", text: "Code de prestation introuvable." };
  const cap = hit[input.deliveryMode];
  if (cap == null) {
    return {
      status: "warn",
      text: `${hit.code} : pas de plafond défini pour ce contexte.`,
    };
  }
  if (tjmForCalc <= cap) {
    return {
      status: "ok",
      text: `Conforme grille : ${currencyFmt.format(tjmForCalc)} ≤ ${currencyFmt.format(cap)} (${hit.code}).`,
    };
  }
  return {
    status: "danger",
    text: `Dépassement grille : ${currencyFmt.format(tjmForCalc)} > ${currencyFmt.format(cap)} (${hit.code}).`,
  };
}

export function computeCalculator(
  input: CalculatorInput,
  tariffRows: TariffRow[] = [],
): CalculatorResult {
  const empty: CalculatorResult = {
    ok: false,
    tjm: 0,
    marginAmount: 0,
    marginPct: 0,
    daysWorked: 0,
    billableDays: 0,
    details: [],
  };

  if (!input.firstName || !input.lastName || !input.startDate || !input.endDate) {
    return { ...empty, message: "Complétez les champs obligatoires (*) pour lancer le calcul." };
  }
  if (!Number.isFinite(input.salaryAnnual)) {
    return { ...empty, message: "Renseignez un salaire brut annuel valide." };
  }

  const startDate = new Date(input.startDate);
  const endDate = new Date(input.endDate);
  if (startDate > endDate) {
    return { ...empty, message: "La date de fin doit être postérieure à la date de démarrage." };
  }
  if (input.included === "Non") {
    return { ...empty, message: "Ressource non prise en compte dans les calculs." };
  }

  const resourceType = input.resourceType;
  const mode = input.pricingMode;
  const baseYear = startDate.getFullYear();
  const partTime = Math.max(0, Math.min(1, input.partTime));

  const { leaveY0, leaveY1, leaveY2 } = input;

  const daysRaw = businessDays(startDate, endDate);
  const daysWorked = Math.max(0, partTime * (daysRaw - leaveY0 - leaveY1 - leaveY2));
  const freeDays = input.freeDays;
  const billableDays = Math.max(0, daysWorked - freeDays);

  const daysY0 = Math.max(0, businessDaysForYear(startDate, endDate, baseYear) - leaveY0);
  const daysY1 = Math.max(0, businessDaysForYear(startDate, endDate, baseYear + 1) - leaveY1);
  const daysY2 = Math.max(0, businessDaysForYear(startDate, endDate, baseYear + 2) - leaveY2);

  const salary = input.salaryAnnual;
  const cjSst = input.cjSst;

  const chargeLow = input.chargeLow || 1.4051;
  const chargeHigh = input.chargeHigh || 1.8071;
  const salaryPivot = input.salaryPivot || 26700;
  const annualIncrease = input.annualIncrease || 1.025;
  const rfa = (input.rfaPct || 0) / 100;

  const chargeRate = salary > salaryPivot ? chargeHigh : chargeLow;
  const cjmY0 = computeCjm(salary, chargeRate, annualIncrease, 0, DAYS_BY_YEAR[baseYear] || 253);
  const cjmY1 = computeCjm(salary, chargeRate, annualIncrease, 1, DAYS_BY_YEAR[baseYear + 1] || 253);
  const cjmY2 = computeCjm(salary, chargeRate, annualIncrease, 2, DAYS_BY_YEAR[baseYear + 2] || 253);

  const tagIntExt = resourceType === "externe" ? "EXT" : "INT";
  const tagSbaCj = resourceType === "Interne" ? "SBA" : "CJ";

  const personnelY0 = (tagSbaCj === "SBA" ? cjmY0 : cjSst) * daysY0 * (1 - rfa);
  const personnelY1 = (tagSbaCj === "SBA" ? cjmY1 : cjSst) * daysY1 * (1 - rfa);
  const personnelY2 = (tagSbaCj === "SBA" ? cjmY2 : cjSst) * daysY2 * (1 - rfa);

  const costInternalPersonnel = tagIntExt === "INT" ? personnelY0 + personnelY1 + personnelY2 : 0;
  const costSst = tagIntExt === "EXT" ? cjSst * daysWorked : 0;
  const costTravel = input.travelCost;
  const costProd = input.productionCost;

  const occupancyRate = Math.max(0, Math.min(1, (input.occupancyRate || 100) / 100));
  const locauxCostPerDay = LOCAUX_COST[input.locauxAkkodis] || 0;
  const costLocaux =
    tagSbaCj !== "CJ" && input.siteRealisation === "Site AKKODIS"
      ? locauxCostPerDay * daysWorked * occupancyRate
      : 0;

  const itProfile = IT_PROFILES.find((p) => p.value === input.itProfile);
  const costIt = tagSbaCj !== "CJ" && itProfile ? itProfile.price * daysWorked : 0;

  const costProdTotal = costProd + costLocaux + costIt;

  const tjmTarget = computeTjmTarget({
    costInternalPersonnel,
    costSst,
    costTravel,
    costProd: costProdTotal,
    travelRefact: input.travelRefact,
    billableDays,
    targetMarginPct: input.targetMarginPct / 100,
    caOther: input.caOther,
    rfa,
  });

  const tjmForCalc = mode === "MB souhaitee" ? tjmTarget : input.tjmInput;

  const caInterne = tagIntExt === "INT" ? tjmForCalc * billableDays * (1 - rfa) : 0;
  const caSst = tagIntExt === "EXT" ? tjmForCalc * billableDays * (1 - rfa) : 0;
  const caOther = input.caOther;
  const caInter = caInterne + caSst + caOther;
  const caTotal = caInter + input.travelRefact;

  const marginAmount = caTotal - costInternalPersonnel - costSst - costTravel - costProdTotal;
  const marginPct = caInter > 0 ? marginAmount / caInter : 0;

  const details: Array<[string, string]> = [
    ["TAG INT/EXT", tagIntExt],
    ["TAG SBA/CJ", tagSbaCj],
    ["Jours ouvrés (congés déduits)", numberFmt.format(daysWorked)],
    ["Jours facturables", numberFmt.format(billableDays)],
    [
      "Jours N / N+1 / N+2",
      `${numberFmt.format(daysY0)} / ${numberFmt.format(daysY1)} / ${numberFmt.format(daysY2)}`,
    ],
    ["CJM interne N", currencyFmt.format(cjmY0)],
    ["CJM interne N+1", currencyFmt.format(cjmY1)],
    ["CJM interne N+2", currencyFmt.format(cjmY2)],
    ["CJ SST", currencyFmt.format(cjSst)],
    ["Coût personnel interne", currencyFmt.format(costInternalPersonnel)],
    ["Coût SST", currencyFmt.format(costSst)],
    ["Frais déplacement", currencyFmt.format(costTravel)],
    ["Coût production", currencyFmt.format(costProd)],
    ["QP loyers (locaux)", currencyFmt.format(costLocaux)],
    ["Coût IT / Téléphonie", currencyFmt.format(costIt)],
    ["CA presta interne", currencyFmt.format(caInterne)],
    ["CA SST", currencyFmt.format(caSst)],
    ["CA autre", currencyFmt.format(caOther)],
    ["CA total", currencyFmt.format(caTotal)],
  ];

  return {
    ok: true,
    tjm: tjmForCalc,
    marginAmount,
    marginPct,
    daysWorked,
    billableDays,
    tariffAlert: evaluateTariff(input, tariffRows, tjmForCalc),
    details,
  };
}
