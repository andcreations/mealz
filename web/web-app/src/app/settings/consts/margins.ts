export interface MarginDef {
  from: number;
  to: number;
  margin: number;
}

function marginDef(from: number, to: number, margin: number) {
  return { from, to, margin };
}

export const MARGINS: MarginDef[] = [
  marginDef(0, 5, 0),
  marginDef(0, 10, 1),
  marginDef(10, 50, 2),
  marginDef(50, 250, 5),
  marginDef(250, 999_999, 10),
];

export function marginForAmount(amount: number): number {
  if (amount < 0) {
    return 0;
  }
  const last = MARGINS[MARGINS.length - 1];
  if (amount > last.to) {
    return last.margin;
  }
  const marginDef = MARGINS.find(margin => {
    return amount >= margin.from && amount < margin.to;
  });
  return marginDef?.margin ?? 0;
}