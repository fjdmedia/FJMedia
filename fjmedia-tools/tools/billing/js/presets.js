// Matches FJMedia offer (locked 2026-04-24).
// Build tiers: internal target prices from reference/packages.md (quoted on fit call).
// Retainers: 3-tier Hormozi model — entry ramp / middle anchor / stretch premium.
// All prices are overrideable per invoice; drops below default show as a discount.

export const DEFAULT_PRESETS = [
  { group: 'Build tiers',       label: 'Launch',                      amount: 800 },
  { group: 'Build tiers',       label: 'Foundation',                  amount: 1400 },
  { group: 'Build tiers',       label: 'Authority',                   amount: 2200 },

  { group: 'Monthly retainers', label: 'Keep It Running — monthly',   amount: 75 },
  { group: 'Monthly retainers', label: 'Keep It Growing — monthly',   amount: 175 },
  { group: 'Monthly retainers', label: 'Own Your Market — monthly',   amount: 350 }
];
