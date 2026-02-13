'use client';

import { useState } from 'react';
import { Button } from '@/components/ui';

const categories = ['all', 'ads', 'creative', 'store', 'sourcing', 'fulfillment', 'email', 'conflict'];
const categoryLabels: Record<string, string> = {
  all: 'All',
  ads: 'Meta Ads',
  creative: 'Creatives',
  store: 'Store CRO',
  sourcing: 'Sourcing',
  fulfillment: 'Fulfillment',
  email: 'Email/SMS',
  conflict: '⚠️ Conflicts',
};

// Full knowledge base from YC demo (31 tactics)
const mockTactics = [
  {id:'1',tactic:'Use broad targeting + Advantage+',detail:"Let Meta's algorithm find buyers. Interest stacking is dead for most niches.",category:'ads',rule:'IF CPM > $30 on interest → switch to broad\nKILL IF: no purchase after $50 spend',sources:['Biaheza','Jordan Welsh','Foundr','AC Hampton','Davie Fogarty'],confidence:92,status:'verified'},
  {id:'2',tactic:'⚠️ When to kill underperforming ad sets',detail:'CONFLICT: Sources disagree on kill timeline.',category:'ads',rule:'A: Kill after 48h (Biaheza, Sara Finance)\nB: Wait 96h for learning (Davie Fogarty)',sources:['Biaheza','Sara Finance','Davie Fogarty'],confidence:-1,status:'conflict',isConflict:true},
  {id:'3',tactic:'UGC hooks outperform studio ads 2-3x',detail:'Phone-recorded, authentic feel. First 3 sec = make or break.',category:'creative',rule:'Test 3 UGC hooks per product\nSCALE IF: hook rate > 30% + CTR > 2%',sources:['Biaheza','Sara Finance','Arie Scherson','Sebastian Ghiorghiu','Wholesale Ted'],confidence:96,status:'verified'},
  {id:'4',tactic:'Urgency elements lift CR 15-30%',detail:'Countdown timers, low-stock badges, "X people viewing" popups.',category:'store',rule:'IF CR < 2% → add urgency\nA/B test 7 days before committing',sources:['Jordan Welsh','Wholesale Ted','Foundr','Verum Ecom'],confidence:88,status:'verified'},
  {id:'5',tactic:'Order samples before committing to supplier',detail:'Always test 2-3 suppliers. Check shipping, packaging, quality.',category:'sourcing',rule:'Order 3 samples minimum\nKILL supplier IF: shipping > 15 days',sources:['Wholesale Ted','Verum Ecom'],confidence:95,status:'verified'},
  {id:'6',tactic:'3-email abandoned cart sequence',detail:'Email 1: 1h (reminder). Email 2: 24h (social proof). Email 3: 48h (discount).',category:'email',rule:'Set up in Klaviyo\nSCALE IF: recovery rate > 5%',sources:['Chase Dimond','Foundr','Ezra Firestone'],confidence:90,status:'verified'},
  {id:'7',tactic:'⚠️ Optimal daily ad budget for testing',detail:'CONFLICT: Wide range of recommended test budgets.',category:'ads',rule:'A: $20-30/day per ad set (Biaheza)\nB: $50-100/day (Davie Fogarty)\nC: 2x target CPA/day (AC Hampton)',sources:['Biaheza','Davie Fogarty','AC Hampton','Jordan Welsh'],confidence:-1,status:'conflict',isConflict:true},
  {id:'8',tactic:'Use 3PL once hitting 30+ orders/day',detail:'Switch from agent fulfillment to 3PL for consistency and speed.',category:'fulfillment',rule:'IF orders > 30/day for 7 days → evaluate 3PL\nTarget: < 5-day delivery',sources:['Verum Ecom','AutoDS'],confidence:85,status:'verified'},
  {id:'9',tactic:'TikTok Ads: use native-feel content only',detail:'Polished ads get scrolled past. Film on phone, use trending sounds, first-person POV.',category:'creative',rule:'Shoot on iPhone, vertical 9:16\nHook in first 1.5 sec\nKILL IF: <1% CTR after 500 impressions',sources:['Sara Finance','Sebastian Ghiorghiu','Nas Academy'],confidence:91,status:'verified'},
  {id:'10',tactic:'Bundle offers increase AOV 20-35%',detail:'Offer "Buy 2 Get 1 Free" or bundle complementary products. Works especially well for compression wear.',category:'store',rule:'IF AOV < $50 → test bundle offers\nSCALE IF: bundle take rate > 15%',sources:['Davie Fogarty','Foundr','Ezra Firestone'],confidence:87,status:'verified'},
  {id:'11',tactic:'Retarget with social proof creative',detail:"Show UGC reviews, unboxing, before/after in retargeting. Don't repeat prospecting creative.",category:'ads',rule:'Separate creative for retarget audience\nSCALE IF: ROAS > 4x on retarget',sources:['AC Hampton','Jordan Welsh','Arie Scherson'],confidence:89,status:'verified'},
  {id:'12',tactic:'SMS welcome flow converts 3x email',detail:'First SMS within 5 min of signup. Keep it personal, include discount code.',category:'email',rule:'Use Postscript or Klaviyo SMS\nOpt-in required\nSCALE IF: SMS revenue > 5% of total',sources:['Chase Dimond','Postscript blog'],confidence:82,status:'suggested'},
  {id:'13',tactic:'⚠️ CBO vs ABO for testing',detail:'CONFLICT: Creators split on campaign structure for initial tests.',category:'ads',rule:'A: ABO for testing, CBO for scaling (Biaheza)\nB: CBO from day 1, let Meta optimize (AC Hampton)',sources:['Biaheza','AC Hampton','Davie Fogarty'],confidence:-1,status:'conflict',isConflict:true},
  {id:'14',tactic:'Product page: benefits > features',detail:'Lead with outcomes, not specs. "Flatten your tummy in 30 days" > "High-compression nylon blend".',category:'store',rule:'Rewrite all product copy\nUse before/after framing\nA/B test headline variants',sources:['Ezra Firestone','Foundr','Wholesale Ted','Jordan Welsh'],confidence:93,status:'verified'},
  {id:'15',tactic:'Free shipping threshold lifts AOV 10-15%',detail:'Set free shipping at 1.3x current AOV. Forces multi-item carts.',category:'store',rule:'IF AOV=$39 → set free shipping at $49\nMonitor cart abandonment rate',sources:['Davie Fogarty','Wholesale Ted','Foundr'],confidence:86,status:'verified'},
  {id:'16',tactic:'Winning product criteria checklist',detail:'Wow factor, solves a problem, <$30 COGS, 3x markup possible, lightweight for shipping.',category:'sourcing',rule:'Must pass 4/5 criteria to proceed\nKILL product IF: margins < 2.5x after all costs',sources:['Biaheza','Sara Finance','Sebastian Ghiorghiu','Verum Ecom'],confidence:94,status:'verified'},
  {id:'17',tactic:'Advantage+ Shopping campaigns (ASC)',detail:"Meta's AI-driven campaign type. Less manual control but often better performance at scale.",category:'ads',rule:'IF scaling past $500/day → test ASC\nAllocate 30% of budget to ASC\nSCALE IF: ASC ROAS > manual campaigns',sources:['AC Hampton','Davie Fogarty','Jordan Welsh'],confidence:88,status:'verified'},
  {id:'18',tactic:'Hook rate is the #1 metric for video ads',detail:'First 3 seconds determine everything. Track thumb-stop ratio (hook rate) not just CTR.',category:'creative',rule:'Target hook rate > 25%\nKILL creative IF: hook rate < 15%\nTest 5 hooks per winning body',sources:['Biaheza','Sara Finance','Sebastian Ghiorghiu'],confidence:94,status:'verified'},
  {id:'19',tactic:'Use post-purchase upsell for +15% AOV',detail:'Show complementary product on thank-you page. "Add X for $19 — one click, no re-entering payment."',category:'store',rule:'Set up via ReConvert or AfterSell\nSCALE IF: upsell take rate > 8%',sources:['Ezra Firestone','Foundr'],confidence:84,status:'suggested'},
  {id:'20',tactic:'Review request email at Day 7',detail:'Ask for product review 7 days after delivery. Offer 10% off next purchase as incentive.',category:'email',rule:'Automate in Klaviyo\nGoal: 5-10% review rate\nUse reviews in ad creative',sources:['Chase Dimond','Foundr'],confidence:86,status:'verified'},
  {id:'21',tactic:'⚠️ Broad vs interest targeting for new products',detail:'CONFLICT: When to use each approach for product launch.',category:'ads',rule:'A: Always start broad (Davie Fogarty, AC Hampton)\nB: Start interest-based, graduate to broad (Biaheza)',sources:['Davie Fogarty','AC Hampton','Biaheza'],confidence:-1,status:'conflict',isConflict:true},
  {id:'22',tactic:'Dynamic creative testing (DCT)',detail:'Upload 5 images, 5 headlines, 5 body texts. Meta tests all combinations automatically.',category:'creative',rule:'Use for initial testing phase\nSwitch to manual ad sets for scaling\nMinimum 3-day test',sources:['AC Hampton','Jordan Welsh'],confidence:82,status:'verified'},
  {id:'23',tactic:'Offer free shipping over threshold',detail:'Calculate 1.3x current AOV. Set that as free shipping minimum. Watch AOV climb.',category:'store',rule:'IF AOV=$42 → free shipping at $55\nMonitor cart abandonment\nKILL IF: abandonment rises >10%',sources:['Davie Fogarty','Wholesale Ted','Foundr'],confidence:86,status:'verified'},
  {id:'24',tactic:'Exit-intent popup with 10% discount',detail:'Show popup when cursor moves to close tab. Mobile: show after 30 seconds. Collect email + offer discount.',category:'store',rule:'Use Privy or Klaviyo popup\nTarget 3-5% opt-in rate\nDont show to returning visitors who already opted in',sources:['Foundr','Wholesale Ted'],confidence:83,status:'suggested'},
  {id:'25',tactic:'Test video vs static on TikTok',detail:'TikTok prioritizes video but carousel ads are gaining traction. Test both formats.',category:'creative',rule:'Run 50/50 budget split\n3-day test minimum\nSCALE winner by 2x',sources:['Nas Academy','Sebastian Ghiorghiu'],confidence:78,status:'suggested'},
  {id:'26',tactic:'Use branded tracking page',detail:'Replace default carrier tracking with branded page. Cross-sell products while customer waits for delivery.',category:'fulfillment',rule:'Use Aftership or Track123\nAdd 3-4 recommended products\nGoal: 2-3% click-through on tracking page',sources:['Verum Ecom','AutoDS'],confidence:79,status:'suggested'},
  {id:'27',tactic:'Retarget cart abandoners within 1 hour',detail:'Fastest follow-up wins. Retarget with the exact product they left behind + social proof.',category:'ads',rule:'Create custom audience: ATC but no purchase, last 3 days\nBudget: 15-20% of total ad spend\nSCALE IF: ROAS > 5x',sources:['AC Hampton','Jordan Welsh','Arie Scherson'],confidence:91,status:'verified'},
  {id:'28',tactic:'Optimize product images for mobile',detail:'67% of ecommerce traffic is mobile. First image must show product clearly at small size. Use lifestyle shots 2-4.',category:'store',rule:'Test square vs portrait images\nFirst image: product on white background\nImages 2-5: lifestyle, scale, packaging',sources:['Foundr','Wholesale Ted','Ezra Firestone'],confidence:88,status:'verified'},
  {id:'29',tactic:'Use Shopify Checkout Extensibility',detail:'Customize checkout page: add trust badges, timer, upsell. Only on Shopify Plus or newer checkout.',category:'store',rule:'Add: trust badges, delivery estimate, express checkout\nSCALE IF: checkout CR improves >5%',sources:['Foundr','Ezra Firestone'],confidence:80,status:'suggested'},
  {id:'30',tactic:'⚠️ When to switch from dropshipping to 3PL',detail:'CONFLICT: Different thresholds recommended for when to make the switch.',category:'fulfillment',rule:'A: At 30+ orders/day (Verum Ecom)\nB: At 100+ orders/day (Sebastian Ghiorghiu)\nC: When shipping complaints > 5% (AutoDS)',sources:['Verum Ecom','Sebastian Ghiorghiu','AutoDS'],confidence:-1,status:'conflict',isConflict:true},
  {id:'31',tactic:'Lookalike audience from purchasers',detail:'Create 1% lookalike from purchase pixel events. Most valuable custom audience for scaling.',category:'ads',rule:'Need minimum 100 purchases for good data\nTest 1%, 2%, 5% lookalikes\nKILL IF: LLA CPM > 2x broad targeting',sources:['Biaheza','AC Hampton','Jordan Welsh'],confidence:90,status:'verified'},
];

export default function KnowledgePage() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  let filtered = mockTactics;
  if (categoryFilter === 'conflict') {
    filtered = filtered.filter((t) => t.isConflict);
  } else if (categoryFilter !== 'all') {
    filtered = filtered.filter((t) => t.category === categoryFilter);
  }

  if (search) {
    filtered = filtered.filter((t) =>
      [t.tactic, t.detail, t.rule, ...t.sources].join(' ').toLowerCase().includes(search.toLowerCase())
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input
            className="search-box"
            placeholder="Search tactics, rules, sources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
            {filtered.length} tactics · {mockTactics.filter(t => !t.isConflict).length} verified · {mockTactics.filter((t) => t.isConflict).length} conflicts
          </span>
        </div>
        <Button>+ Add tactic</Button>
      </div>

      <div className="kb-filters" style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`filter-chip${categoryFilter === cat ? ' active' : ''}`}
            onClick={() => setCategoryFilter(cat)}
          >
            {categoryLabels[cat]}{' '}
            <span style={{ opacity: 0.6 }}>
              {cat === 'all'
                ? mockTactics.length
                : cat === 'conflict'
                  ? mockTactics.filter((t) => t.isConflict).length
                  : mockTactics.filter((t) => t.category === cat).length}
            </span>
          </button>
        ))}
      </div>

      <table className="kb-table">
        <thead>
          <tr>
            <th>Tactic</th>
            <th>Category</th>
            <th>Decision Rule</th>
            <th>Sources</th>
            <th>Confidence</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((tactic) => (
            <tr key={tactic.id}>
              <td>
                <strong style={{ fontSize: '12.5px' }}>{tactic.tactic}</strong>
                <br />
                <span style={{ color: 'var(--text-dim)', fontSize: '11px' }}>{tactic.detail}</span>
              </td>
              <td style={{ fontSize: '12px', textTransform: 'capitalize' }}>{tactic.category}</td>
              <td style={{ fontSize: '11.5px', color: 'var(--text-dim)', whiteSpace: 'pre-line', maxWidth: '220px' }}>
                {tactic.rule}
              </td>
              <td>
                {tactic.sources.map((src, i) => (
                  <span key={i} className="source-badge">
                    {src}
                  </span>
                ))}
              </td>
              <td>
                {tactic.confidence < 0 ? (
                  <span className="confidence med">● Split</span>
                ) : (
                  <span className={`confidence ${tactic.confidence >= 85 ? 'high' : tactic.confidence >= 60 ? 'med' : 'low'}`}>
                    ● {tactic.confidence}%
                  </span>
                )}
                <br />
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{tactic.sources.length} sources</span>
              </td>
              <td>
                {tactic.status === 'verified' && (
                  <span className="card-tag tag-agent" style={{ fontSize: '10.5px' }}>
                    Verified
                  </span>
                )}
                {tactic.status === 'conflict' && <span className="conflict-badge">⚠ Test</span>}
                {tactic.status === 'suggested' && (
                  <span className="card-tag tag-source" style={{ fontSize: '10.5px' }}>
                    Suggested
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
