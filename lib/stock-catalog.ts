// Generated from Luxvps-stock-bot/config.json (2026-08-01) — keep the two in sync.
//
// Maps the reseller API's opaque packet ids to the billing.luxvps.net store URLs the
// scraper already records as `Deal.sourceUrl`, which is how live stock is joined onto
// scraped deals. Nothing here is secret — the store URLs are public and the packet ids
// are meaningless without the API base URL + token, which live in the environment only.

export interface CatalogPacket {
  /** Reseller API packet id. */
  id: string;
  /** Group the stock bot files this packet under (Xeon / Ryzen / EPYC). */
  group: string;
  /** Package name as the stock bot labels it — for logging/debugging only. */
  alias: string;
  /** Store page URL, matched against Deal.sourceUrl. */
  orderUrl: string;
}

/**
 * Product lines to poll. Every watched packet lives in one of these; packets in a line
 * that aren't in CATALOG are ignored. Override with LUXVPS_API_LINES (comma-separated)
 * to keep the slugs out of git entirely.
 */
export const DEFAULT_LINES: string[] = [
  'f1docustom',
  'customf1dosalesalesale',
  'salesalesale',
  'ryzenf1doresellersale',
  'combahtonsale360days',
  '2024salef1doas203446',
  'ryzengen2f1doreseller',
  'resellerf1dovoxility',
  'rzyenf1doreseller',
  'f1doepyccustom',
];

export const CATALOG: CatalogPacket[] = [
  { id: '8fe5cfc5-3fe9-43f6-8fdc-2c740599fa82', group: 'Xeon', alias: 'KVM RootServer Tiny', orderUrl: 'https://billing.luxvps.net/index.php?rp=/store/kvm-rootservers/kvm-rootserver-tiny' },
  { id: 'ff51398b-0bda-4346-98a5-8dfee70a8319', group: 'Xeon', alias: 'KVM RootServer Starter', orderUrl: 'https://billing.luxvps.net/index.php?rp=/store/kvm-rootservers/kvm-rootserver-starter' },
  { id: '4c886409-cc1e-4faa-b9e9-4037e84bd170', group: 'Xeon', alias: 'KVM RootServer Small', orderUrl: 'https://billing.luxvps.net/index.php?rp=/store/kvm-rootservers/kvm-rootserver-small' },
  { id: '3f03fa7b-c2f3-4273-a5d7-ea19e442ac55', group: 'Xeon', alias: 'KVM RootServer Pro', orderUrl: 'https://billing.luxvps.net/index.php?rp=/store/kvm-rootservers/kvm-rootserver-pro' },
  { id: 'b67bf334-26d0-441e-8763-1157bb087c77', group: 'Xeon', alias: 'KVM RootServer Mega', orderUrl: 'https://billing.luxvps.net/index.php?rp=/store/kvm-rootservers/kvm-rootserver-mega' },
  { id: '752ab788-e096-4e15-8bb2-cdeb1669a45b', group: 'Xeon', alias: 'KVM RootServer Expert', orderUrl: 'https://billing.luxvps.net/index.php?rp=/store/kvm-rootservers/kvm-rootserver-expert' },
  { id: '36f8756b-1fd9-427c-b54b-99d49e3c4abb', group: 'Xeon', alias: 'KVM RootServer Power', orderUrl: 'https://billing.luxvps.net/index.php?rp=/store/kvm-rootservers/kvm-rootserver-power' },
  { id: 'c24af7e7-88f9-4139-b973-eeb43eded481', group: 'Xeon', alias: 'KVM RootServer Extreme', orderUrl: 'https://billing.luxvps.net/index.php?rp=/store/kvm-rootservers/kvm-rootserver-extreme' },
  { id: 'f9e7aadf-fa85-4ada-ac0b-9aee714ca23e', group: 'Xeon', alias: 'KVM RootServer Elite', orderUrl: 'https://billing.luxvps.net/index.php?rp=/store/kvm-rootservers/kvm-rootserver-elite' },
  { id: 'f0d6668e-62dd-4f15-a933-8c3d53e1a56c', group: 'Xeon', alias: 'KVM RootServer Ultimate', orderUrl: 'https://billing.luxvps.net/index.php?rp=/store/kvm-rootservers/kvm-rootserver-ultimate' },
  { id: '0dfbd2ff-18b9-4d86-a1f7-80f1922508eb', group: 'Ryzen', alias: 'Ryzen Starter Gen 3', orderUrl: 'https://billing.luxvps.net/index.php?rp=/store/ryzen-kvmservers/ryzen-starter-gen-3' },
  { id: 'feb995e2-d22d-40d1-ab87-53bf31693ecf', group: 'Ryzen', alias: 'Ryzen Small Gen 3', orderUrl: 'https://billing.luxvps.net/index.php?rp=/store/ryzen-kvmservers/ryzen-small' },
  { id: '392ffacc-449f-425b-a2c7-20e2ea890894', group: 'Ryzen', alias: 'Ryzen Pro Gen 3', orderUrl: 'https://billing.luxvps.net/index.php?rp=/store/ryzen-kvmservers/ryzen-pro-gen-3' },
  { id: 'f1ff349e-da47-4ebb-97db-f718a3eebd04', group: 'Ryzen', alias: 'Ryzen Mega Gen 3', orderUrl: 'https://billing.luxvps.net/index.php?rp=/store/ryzen-kvmservers/ryzen-mega-gen-3' },
  { id: 'ab7ef020-e1f6-4396-8764-d6ebb8005bf4', group: 'Ryzen', alias: 'Ryzen Expert Gen 3', orderUrl: 'https://billing.luxvps.net/index.php?rp=/store/ryzen-kvmservers/ryzen-expert-2' },
  { id: '9cd88741-2ce7-4623-9720-ce0260b23bb0', group: 'Ryzen', alias: 'Ryzen Power Gen 3', orderUrl: 'https://billing.luxvps.net/index.php?rp=/store/ryzen-kvmservers/ryzen-power-gen-3' },
  { id: '1b6c49fe-d620-49b9-a393-414041359b13', group: 'Ryzen', alias: 'Ryzen Extreme Gen 3', orderUrl: 'https://billing.luxvps.net/index.php?rp=/store/ryzen-kvmservers/ryzen-extreme-gen-3' },
  { id: '4c25bfe0-0d59-4c4a-a4dd-d28b5bbc70c2', group: 'Ryzen', alias: 'Ryzen Elite Gen 3', orderUrl: 'https://billing.luxvps.net/index.php?rp=/store/ryzen-kvmservers/ryzen-elite-gen-2' },
  { id: '7fccd4e5-7cc9-4e48-8439-937b78d4f129', group: 'EPYC', alias: 'EPYC Tiny', orderUrl: 'https://billing.luxvps.net/index.php?rp=/store/epyc/epyc-tiny' },
  { id: '50fe78ad-5901-4ded-b66c-ac353e1effd6', group: 'EPYC', alias: 'EPYC Starter', orderUrl: 'https://billing.luxvps.net/index.php?rp=/store/epyc/epyc-starter' },
  { id: 'd0ade821-fbcd-445f-bb0c-65981dad433d', group: 'EPYC', alias: 'EPYC Pro', orderUrl: 'https://billing.luxvps.net/index.php?rp=/store/epyc/epyc-pro' },
  { id: '39ff84a7-c9af-4c44-8907-b979da2d9617', group: 'EPYC', alias: 'EPYC Power', orderUrl: 'https://billing.luxvps.net/index.php?rp=/store/epyc/epyc-power' },
  { id: '3fc7c3b7-da1e-46d0-b357-40bc43b519dd', group: 'EPYC', alias: 'EPYC Extreme', orderUrl: 'https://billing.luxvps.net/index.php?rp=/store/epyc/epyc-extreme' },
  { id: '5507d7f3-96e6-46af-9934-2b6f4c1c0001', group: 'EPYC', alias: 'EPYC Elite', orderUrl: 'https://billing.luxvps.net/index.php?rp=/store/epyc/epyc-elite' },
];
