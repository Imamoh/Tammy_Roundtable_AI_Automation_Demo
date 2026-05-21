// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MaxWell Canyon Creek — Realtor Transaction Automation Demo v2
// 12 steps · Buyer / Seller / Full Automation flows
// Self-contained — no cross-file imports
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play, Pause, RotateCcw, ChevronLeft, ChevronRight,
  CheckCircle, Clock, XCircle, AlertTriangle, Info, X,
  Building2, FileText, FolderOpen, Folder, ClipboardList,
  CalendarCheck, Mail, Send, FileSpreadsheet, BadgeCheck,
  ScanSearch, Shield, Zap, Bell, Eye, Link, Users,
  ArrowRight, TrendingUp, FolderInput, FileSignature,
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════

const NAVY  = '#1B3A5C';
const TEAL  = '#1A6B55';
const GOLD  = '#B88A10';
const GREEN = '#16A34A';
const AMBER = '#D97706';
const RED   = '#DC2626';
const SLATE = '#475569';

const STEP_DELAYS = [4500,3800,4200,5500,4000,4500,4500,3800,5500,4200,4500,5000];

const STEPS = [
  { id:1,  label:'DocuSign arrives',        short:'DocuSign',     Icon:FileSignature  },
  { id:2,  label:'Saved to inbox',          short:'Saved',        Icon:FolderInput    },
  { id:3,  label:'Document classified',     short:'Classified',   Icon:ScanSearch     },
  { id:4,  label:'Data extracted',          short:'Extracted',    Icon:Zap            },
  { id:5,  label:'Folders created',         short:'Folders',      Icon:FolderOpen     },
  { id:6,  label:'Checklist generated',     short:'Checklist',    Icon:ClipboardList  },
  { id:7,  label:'Validation engine',       short:'Validation',   Icon:Shield         },
  { id:8,  label:'Reminders set',           short:'Reminders',    Icon:CalendarCheck  },
  { id:9,  label:'Emails drafted',          short:'Emails',       Icon:Mail           },
  { id:10, label:'Conveyancing prepared',   short:'Conveying',    Icon:Send           },
  { id:11, label:'Trade record updated',    short:'Trade rec.',   Icon:FileSpreadsheet},
  { id:12, label:'Transaction closed',      short:'Closed',       Icon:BadgeCheck     },
];

const SUBFOLDERS = [
  'Signed Contracts','Listing Documents & MLS','Photos & RMS',
  'Condo Documents','Offers','Trade Record',
  'Deposit','Conditions & Waivers','Conveyancing','Possession / Closing',
];

// ═══════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════

const BUYER_DEAL = {
  type:'buyer', client:'Sarah & James Mitchell', clientShort:'Mitchell',
  email:'sarah.mitchell@email.com', phone:'(403) 555-0182',
  address:'142 Birchwood Lane SW, Calgary, AB  T3H 2K9',
  addressShort:'142 Birchwood Lane SW',
  mls:'A2145892', price:'$875,000', deposit:'$25,000',
  depositTo:'MaxWell Canyon Creek Realty',
  condDate:'June 10, 2026', condRemoval:'June 14, 2026',
  possession:'July 15, 2026',
  lawyer:'David Park — Park & Associates', lawyerEmail:'dpark@parklaw.ca',
  realtorBuyer:'Tammy MacDonald', realtorSeller:'John Chen, RE/MAX',
  brokerage:'MaxWell Canyon Creek', commission:'3.5% / 1.5%',
  triggerDoc:'Residential Purchase Contract',
  triggerFile:'RPC_Mitchell_142Birchwood_Signed.pdf',
  docuSignMsg:'Sarah Mitchell & James Mitchell signed "Residential Purchase Contract"',
  docType:'Residential Purchase Contract',
  conditions:['Financing','Home inspection'],
  missingDocs:['Condo documents','Amendments / addendum'],
};

const SELLER_DEAL = {
  type:'seller', client:'Robert & Linda Chen', clientShort:'Chen',
  email:'robert.chen@email.com', phone:'(403) 555-0241',
  address:'89 Maple Avenue NW, Calgary, AB  T2L 0E8',
  addressShort:'89 Maple Avenue NW',
  mls:'A2138741', price:'$645,000', deposit:'$15,000',
  depositTo:'MaxWell Canyon Creek Realty',
  condDate:'June 2, 2026', condRemoval:'June 6, 2026',
  possession:'August 1, 2026',
  lawyer:'Linda Wong — Wong & Associates', lawyerEmail:'lwong@wonglaw.ca',
  realtorBuyer:'Kevin Park, Century 21', realtorSeller:'Tammy MacDonald',
  brokerage:'MaxWell Canyon Creek', commission:'3% / 1.5%',
  triggerDoc:'Seller Listing Agreement',
  triggerFile:'SLA_Chen_89Maple_Signed.pdf',
  docuSignMsg:'Robert Chen & Linda Chen signed "Seller Listing Agreement"',
  docType:'Seller Listing Agreement',
  conditions:['Home inspection','Status certificate'],
  missingDocs:['Property disclosure statement','Status certificate'],
};

const AUTO_LIST = [
  'Document detected & moved to NEW TRANSACTION INBOX',
  'Document type classified by AI',
  'All transaction data extracted — no manual entry',
  'Master folder + 10 subfolders created instantly',
  'Checklist template copied and pre-populated',
  'CRM tracker row added automatically',
  'Trade Record Sheet auto-populated',
  'Calendar reminders set for all key dates',
  'Validation engine checks every uploaded document',
  'Missing document alerts sent to agent',
  'Conveyancing package assembled as docs arrive',
  'Transaction marked CLOSED when checklist hits 100%',
  'Anniversary email scheduled for 1 year post-possession',
];

const APPROVAL_LIST = [
  'All AI-drafted emails — agent reviews before sending',
  'Conveyancing package — agent confirms before submitting',
  'Trade Record Sheet — agent verifies before submission',
  'Google Drive folder sharing with clients / lawyers',
  'Commission documents — agent signs off',
  'Counter-offer decisions and negotiations',
  'Any non-templated client communication',
];

// ═══════════════════════════════════════════════════════════════
// UI PRIMITIVES — all self-contained, no external imports
// ═══════════════════════════════════════════════════════════════

function Bdg({ color='gray', children, cls='' }) {
  const map = {
    green:  'bg-emerald-50 text-emerald-700 border-emerald-200',
    amber:  'bg-amber-50 text-amber-700 border-amber-200',
    red:    'bg-red-50 text-red-600 border-red-200',
    gray:   'bg-gray-100 text-gray-500 border-gray-200',
    navy:   'bg-blue-50 text-blue-700 border-blue-200',
    teal:   'bg-teal-50 text-teal-700 border-teal-200',
    gold:   'bg-amber-50 text-amber-700 border-amber-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
  };
  return <span className={`badge ${map[color]||map.gray} ${cls}`}>{children}</span>;
}

function StatusBdg({ status }) {
  const cfg = {
    completed: { c:'green',  Icon:CheckCircle,   label:'Complete' },
    pending:   { c:'amber',  Icon:Clock,         label:'Pending' },
    overdue:   { c:'red',    Icon:AlertTriangle, label:'Overdue' },
    missing:   { c:'red',    Icon:XCircle,       label:'Missing' },
  };
  const { c, Icon, label } = cfg[status] || cfg.pending;
  return <Bdg color={c}><Icon size={10} strokeWidth={2.5}/>{label}</Bdg>;
}

function Card({ children, cls='', accent }) {
  return (
    <div className={`card-pad ${accent?`border-l-4 ${accent}`:''} ${cls}`}>
      {children}
    </div>
  );
}

function FRow({ label, value, valCls='' }) {
  return (
    <div className="field-row">
      <span className="text-xs text-gray-500 flex-shrink-0">{label}</span>
      <span className={`text-xs font-medium text-right ${valCls||'text-gray-800'}`}>{value}</span>
    </div>
  );
}

function PBar({ value, max, color='bg-teal-600', showLabel=true }) {
  const pct = max>0 ? Math.round((value/max)*100) : 0;
  return (
    <div>
      {showLabel && (
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>{value}/{max}</span><span>{pct}%</span>
        </div>
      )}
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-2 rounded-full transition-all duration-700 ${color}`} style={{width:`${pct}%`}}/>
      </div>
    </div>
  );
}

function SecHead({ Icon, title, badge, badgeColor='teal' }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      {Icon && <Icon size={18} style={{color:NAVY}} className="flex-shrink-0"/>}
      <h3 className="font-semibold text-gray-900">{title}</h3>
      {badge && <Bdg color={badgeColor}>{badge}</Bdg>}
    </div>
  );
}

function FilePill({ name, type='pdf', time, status='new' }) {
  const col = { pdf:'bg-red-500', doc:'bg-blue-600', sheet:'bg-emerald-600' };
  return (
    <div className={`flex items-center gap-3 p-2.5 rounded-lg ${status==='new'?'bg-emerald-50 border border-emerald-200':'bg-gray-50'}`}>
      <div className={`${col[type]||col.pdf} text-white text-[9px] font-bold px-1.5 py-2 rounded-sm flex-shrink-0`}>
        {type.toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-medium truncate ${status==='new'?'text-emerald-800':'text-gray-700'}`}>{name}</p>
        <p className="text-xs text-gray-400">{time}</p>
      </div>
      {status==='new' && <Bdg color="green"><CheckCircle size={9}/>New</Bdg>}
      {status==='done' && <Bdg color="gray">Processed</Bdg>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// STEP 1 — DocuSign arrives
// ═══════════════════════════════════════════════════════════════
function S1({ deal }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      <Card cls="lg:col-span-3">
        {/* fake browser chrome */}
        <div className="flex items-center gap-1.5 mb-4 pb-3 border-b border-gray-100">
          <div className="w-3 h-3 rounded-full bg-red-400"/><div className="w-3 h-3 rounded-full bg-amber-400"/><div className="w-3 h-3 rounded-full bg-emerald-400"/>
          <span className="ml-2 text-xs text-gray-400 font-mono">Mail — tammymacdonald@telus.net</span>
        </div>
        {/* DocuSign email row */}
        <div className="border border-teal-200 rounded-lg overflow-hidden mb-2">
          <div className="bg-teal-50 px-4 py-3 flex gap-3 items-start">
            <div className="mt-1.5 w-2 h-2 rounded-full bg-teal-500 flex-shrink-0 animate-pulse-dot"/>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2">
                <span className="font-semibold text-xs text-gray-900">DocuSign — Document Completed</span>
                <span className="text-xs text-gray-400 flex-shrink-0">2:47 PM</span>
              </div>
              <p className="text-xs text-teal-800 font-medium mt-0.5">{deal.docuSignMsg}</p>
              <p className="text-xs text-gray-500 mt-0.5">All parties have signed. The completed document is attached and ready to download.</p>
              <div className="flex gap-2 mt-2">
                <Bdg color="green"><CheckCircle size={9}/>Fully signed</Bdg>
                <Bdg color="teal"><Shield size={9}/>DocuSign verified</Bdg>
              </div>
            </div>
          </div>
        </div>
        {/* Older inbox rows */}
        {[
          {from:'David Park — Park & Associates', sub:'RE: title search update — 142 Birchwood', time:'11:22 AM'},
          {from:'ShowingTime', sub:'Showing confirmed — 89 Maple Ave NW, 3:00 PM', time:'Yesterday'},
          {from:'MaxWell Canyon Creek', sub:'Monthly commission statement — May 2026', time:'May 19'},
        ].map((r,i)=>(
          <div key={i} className="flex gap-3 items-start px-2 py-2 border-b border-gray-100 last:border-0 opacity-40">
            <div className="mt-2 w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0"/>
            <div className="flex-1">
              <div className="flex justify-between"><span className="text-xs text-gray-600">{r.from}</span><span className="text-xs text-gray-400">{r.time}</span></div>
              <p className="text-xs text-gray-500 truncate">{r.sub}</p>
            </div>
          </div>
        ))}
      </Card>

      <Card cls="lg:col-span-2 space-y-4">
        <div className="pb-3 border-b border-gray-100">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Incoming Document</p>
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-red-500 text-white text-[9px] font-bold px-2 py-3 rounded-sm">PDF</div>
            <div>
              <p className="text-xs font-semibold text-gray-900 leading-tight">{deal.triggerFile}</p>
              <p className="text-xs text-gray-500">{deal.triggerDoc}</p>
            </div>
          </div>
          <FRow label="Parties" value={deal.client}/>
          <FRow label="Property" value={deal.addressShort}/>
          <FRow label="Received" value="Today, 2:47 PM"/>
          <FRow label="Signatures" value={<Bdg color="green"><CheckCircle size={9}/>All complete</Bdg>}/>
        </div>
        <div className="bg-navy-50 border border-navy-100 rounded-lg p-3">
          <p className="text-xs font-semibold text-navy-600 mb-1">What triggers next</p>
          <p className="text-xs text-navy-600 leading-relaxed">File auto-detected and moved to <strong>NEW TRANSACTION INBOX</strong>. AI processing begins immediately.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-600">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"/>
          AI processing starting...
        </div>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// STEP 2 — Saved to NEW TRANSACTION INBOX
// ═══════════════════════════════════════════════════════════════
function S2({ deal }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card>
        <SecHead Icon={FolderInput} title="NEW TRANSACTION INBOX" badge="Auto-routed"/>
        {/* flow diagram */}
        <div className="flex items-center gap-2 mb-5 p-3 bg-gray-50 rounded-lg text-xs flex-wrap gap-y-2">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
            <span className="text-base">📧</span>
            <span className="font-medium">DocuSign email</span>
          </div>
          <div className="flex flex-col items-center"><ArrowRight size={16} className="text-teal-500"/><span className="text-[10px] text-teal-600 font-semibold">auto-detect</span></div>
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            <Folder size={14} className="text-amber-600"/>
            <span className="font-medium">NEW TRANSACTION INBOX</span>
          </div>
          <div className="flex flex-col items-center"><ArrowRight size={16} className="text-teal-500"/><span className="text-[10px] text-teal-600 font-semibold">AI reads</span></div>
          <div className="flex items-center gap-2 bg-teal-50 border border-teal-200 rounded-lg px-3 py-2">
            <Zap size={14} className="text-teal-600"/>
            <span className="font-medium">Processing</span>
          </div>
        </div>
        {/* Drive mock */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 px-3 py-1.5 flex items-center gap-1 text-xs text-gray-500">
            <Folder size={11}/><span>Drive</span><span>›</span><span>Brokerage Transactions</span><span>›</span>
            <span className="font-semibold text-amber-700">NEW TRANSACTION INBOX</span>
          </div>
          <div className="p-2 space-y-1.5">
            <FilePill name={deal.triggerFile} time="Just now" status="new"/>
            <FilePill name="BRA_Chen_Offer_Signed.pdf" time="Yesterday" status="done"/>
            <FilePill name="Waiver_Johnson_Conditions.pdf" time="3 days ago" status="done"/>
          </div>
        </div>
      </Card>

      <Card>
        <SecHead Icon={CheckCircle} title="Auto-categorization result"/>
        <div className="space-y-0">
          {[
            {label:'Document detected',          val:'Yes',                     ok:true},
            {label:'File type',                  val:'PDF — signed',            ok:true},
            {label:'Transaction type',           val:deal.type==='buyer'?'Buyer — purchase':'Seller — listing', ok:true},
            {label:'Client name extracted',      val:deal.client,               ok:true},
            {label:'Property address',           val:deal.addressShort,         ok:true},
            {label:'Signature status',           val:'All parties signed',      ok:true},
            {label:'Duplicate check',            val:'No duplicate found',      ok:true},
            {label:'File renamed & archived',    val:'Complete',                ok:true},
          ].map((r,i)=>(
            <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0">
              <span className="text-xs text-gray-500">{r.label}</span>
              <div className="flex items-center gap-1.5">
                <CheckCircle size={11} className="text-emerald-500"/>
                <span className="text-xs font-medium text-gray-800">{r.val}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 rounded-lg px-3 py-2">
          <Zap size={12}/>Ready — AI classification beginning now
        </div>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// STEP 3 — Document type classification (NEW — was missing)
// ═══════════════════════════════════════════════════════════════
function S3({ deal }) {
  const docTypes = [
    { type:'Buyer Representation Agreement',    match:deal.type==='buyer'&&deal.docType.includes('Purchase') ? false : deal.type==='buyer', icon:'📋' },
    { type:'Seller Listing Agreement',          match:deal.type==='seller', icon:'🏡' },
    { type:'Residential Purchase Contract',     match:deal.type==='buyer'&&deal.docType.includes('Purchase'), icon:'📄' },
    { type:'Condo Purchase Contract',           match:false,  icon:'🏢' },
    { type:'Waiver / Satisfaction of Conditions', match:false, icon:'✅' },
    { type:'Addendum',                          match:false,  icon:'📎' },
    { type:'Trade Record Sheet',                match:false,  icon:'📊' },
    { type:'Condo Document Checklist',          match:false,  icon:'📋' },
  ];
  const matched = docTypes.find(d=>d.match) || docTypes[deal.type==='buyer'?2:1];

  const nextActions = deal.type === 'buyer' ? [
    'Create buyer transaction folder',
    'Extract purchase contract data',
    'Set deposit & condition reminders',
    'Draft buyer next-step email',
    'Prepare conveyancing package',
  ] : [
    'Create seller listing folder',
    'Extract listing agreement data',
    'Request photographer, RMS, sign install',
    'Draft seller welcome email',
    'Set up MLS entry checklist',
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      <Card cls="lg:col-span-3">
        <SecHead Icon={ScanSearch} title="AI Document Classification"/>
        <div className="mb-4 p-4 bg-emerald-50 border-2 border-emerald-400 rounded-xl flex items-start gap-3">
          <div className="text-3xl mt-0.5">{matched.icon}</div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Detected document type</p>
            <p className="text-lg font-bold text-emerald-700">{matched.type}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="h-1.5 bg-gray-200 rounded-full flex-1 overflow-hidden">
                <div className="h-1.5 bg-emerald-500 rounded-full" style={{width:'97%'}}/>
              </div>
              <span className="text-xs font-semibold text-emerald-600">97% confidence</span>
            </div>
          </div>
        </div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">All document types AI can detect</p>
        <div className="grid grid-cols-2 gap-2">
          {docTypes.map((d,i)=>(
            <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs ${d.match?'bg-emerald-50 border-emerald-300 font-semibold text-emerald-800':'bg-gray-50 border-gray-200 text-gray-500'}`}>
              <span>{d.icon}</span>
              {d.type}
              {d.match && <CheckCircle size={12} className="text-emerald-500 ml-auto flex-shrink-0"/>}
            </div>
          ))}
        </div>
      </Card>

      <Card cls="lg:col-span-2 space-y-4">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Actions triggered by this document type</p>
        {nextActions.map((action,i)=>(
          <div key={i} className="flex items-center gap-2 py-1.5 border-b border-gray-100 last:border-0">
            <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold" style={{background:TEAL,color:'white'}}>{i+1}</div>
            <span className="text-xs text-gray-700">{action}</span>
          </div>
        ))}
        <div className="bg-navy-50 border border-navy-100 rounded-lg p-3 mt-2">
          <p className="text-xs font-semibold" style={{color:NAVY}}>Key principle</p>
          <p className="text-xs mt-1" style={{color:NAVY}}>Document type determines the entire workflow. One classification triggers everything that follows.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-600">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"/>
          Proceeding to data extraction...
        </div>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// STEP 4 — AI Data Extraction (animated)
// ═══════════════════════════════════════════════════════════════
function S4({ deal }) {
  const [shown, setShown] = useState(0);
  const fields = [
    ['Document type',          deal.docType],
    ['Transaction type',       deal.type==='buyer'?'Buyer — purchase':'Seller — listing'],
    ['Client name(s)',         deal.client],
    ['Client email',           deal.email],
    ['Client phone',           deal.phone],
    ['Property address',       deal.address],
    ['MLS number',             deal.mls],
    ['Purchase / list price',  deal.price],
    ['Deposit amount',         deal.deposit],
    ['Deposit payable to',     deal.depositTo],
    ['Conditions due',         deal.condDate],
    ['Condition removal',      deal.condRemoval],
    ['Possession / closing',   deal.possession],
    ["Buyer's lawyer",         deal.lawyer],
    ["Buyer's Realtor",        deal.realtorBuyer],
    ["Seller's Realtor",       deal.realtorSeller],
    ['Brokerage',              deal.brokerage],
    ['Commission',             deal.commission],
  ];

  useEffect(()=>{
    setShown(0);
    const timers = fields.map((_,i)=>setTimeout(()=>setShown(i+1), 300+i*140));
    return ()=>timers.forEach(clearTimeout);
  },[deal.type]);

  const pct = Math.round((shown/fields.length)*100);
  const cats=[['Names & contact',shown>=5],['Property',shown>=7],['Financial',shown>=10],['Key dates',shown>=13],['Legal & agents',shown>=16],['Brokerage',shown>=18]];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      <Card cls="lg:col-span-2 flex flex-col gap-4">
        <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center flex-shrink-0">
            <Zap size={20} className="text-blue-600"/>
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">AI Extraction</p>
            <p className="text-xs text-gray-500 truncate">{deal.triggerFile}</p>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
            <span>Fields extracted</span>
            <span className="font-semibold text-teal-600">{shown}/{fields.length}</span>
          </div>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-2.5 bg-teal-500 rounded-full transition-all duration-300" style={{width:`${pct}%`}}/>
          </div>
          <p className="text-xs text-gray-400 mt-1">{pct}% complete</p>
        </div>
        <div className="space-y-1.5">
          {cats.map((c,i)=>(
            <div key={i} className="flex items-center gap-2">
              <CheckCircle size={13} className={c[1]?'text-emerald-500':'text-gray-200'}/>
              <span className={`text-xs ${c[1]?'text-gray-700':'text-gray-300'}`}>{c[0]}</span>
            </div>
          ))}
        </div>
        {deal.missingDocs.length>0 && shown>=14 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 animate-fade-in">
            <p className="text-xs font-semibold text-amber-700 flex items-center gap-1 mb-1"><AlertTriangle size={12}/>Missing fields flagged</p>
            {deal.missingDocs.map((d,i)=><p key={i} className="text-xs text-amber-700 ml-4">• {d}</p>)}
          </div>
        )}
      </Card>

      <Card cls="lg:col-span-3">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Extracted transaction data</p>
        <div className="grid grid-cols-2 gap-x-6">
          {fields.map((f,i)=>(
            <div key={i} className={`py-1.5 border-b border-gray-100 last:border-0 transition-all duration-200 ${i<shown?'opacity-100':'opacity-0 translate-y-1'}`}>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">{f[0]}</p>
              <p className="text-xs font-medium mt-0.5" style={{color:NAVY}}>{f[1]}</p>
            </div>
          ))}
        </div>
        {shown>=fields.length && (
          <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 animate-fade-in">
            <CheckCircle size={13}/>All fields extracted — ready to build transaction file
          </div>
        )}
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// STEP 5 — Master transaction folder created
// ═══════════════════════════════════════════════════════════════
function S5({ deal }) {
  const [shown, setShown] = useState(0);
  useEffect(()=>{
    setShown(0);
    const timers=SUBFOLDERS.map((_,i)=>setTimeout(()=>setShown(i+1),300+i*220));
    return ()=>timers.forEach(clearTimeout);
  },[deal.type]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      <Card cls="lg:col-span-3">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-red-400"/><div className="w-3 h-3 rounded-full bg-amber-400"/><div className="w-3 h-3 rounded-full bg-emerald-400"/>
          <span className="ml-2 text-xs text-gray-400 font-mono">Google Drive — Brokerage Transactions</span>
        </div>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 px-3 py-1.5 flex items-center gap-1 text-xs text-gray-500 flex-wrap">
            <Folder size={11}/><span>Drive</span><span>›</span><span>Brokerage Transactions</span><span>›</span>
            <span className="font-semibold text-teal-700 flex items-center gap-1">
              <span>📁</span>{deal.clientShort} — {deal.addressShort}
            </span>
            <Bdg color="green" cls="ml-1">Auto-created</Bdg>
          </div>
          <div className="pl-8 divide-y divide-gray-50">
            {SUBFOLDERS.map((folder,i)=>(
              <div key={i} className={`flex items-center justify-between py-2 px-3 transition-all duration-200 ${i<shown?'opacity-100':'opacity-0'}`}>
                <div className="flex items-center gap-2">
                  <Folder size={13} className="text-amber-500 flex-shrink-0"/>
                  <span className="text-xs text-gray-700">{folder}</span>
                </div>
                {i<shown && <CheckCircle size={12} className="text-emerald-500"/>}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          <span>{shown}/{SUBFOLDERS.length} folders created</span>
          {shown>=SUBFOLDERS.length && <Bdg color="green"><CheckCircle size={9}/>Complete</Bdg>}
        </div>
      </Card>

      <Card cls="lg:col-span-2 space-y-4">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Also auto-created</p>
        {[
          {Icon:ClipboardList, bg:'bg-teal-100 text-teal-700', title:'Transaction checklist', sub:'Copied from master template into client folder'},
          {Icon:FileSpreadsheet, bg:'bg-blue-100 text-blue-700', title:'Trade Record Sheet', sub:'Pre-filled with all extracted deal data'},
          {Icon:Link, bg:'bg-amber-100 text-amber-700', title:'CRM row added', sub:'Folder link written back — no manual entry'},
        ].map((item,i)=>(
          <div key={i} className={`flex items-start gap-3 transition-all duration-300`} style={{opacity:shown>=5?1:0, transitionDelay:`${i*200}ms`}}>
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${item.bg}`}>
              <item.Icon size={16}/>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{item.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{item.sub}</p>
            </div>
          </div>
        ))}
        {shown>=6 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 animate-fade-in">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">CRM tracker — new row</p>
            <FRow label="Client" value={deal.clientShort}/>
            <FRow label="Address" value={deal.addressShort}/>
            <FRow label="Price" value={deal.price} valCls="text-navy-700"/>
            <FRow label="Status" value={<Bdg color="teal">Active</Bdg>}/>
          </div>
        )}
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// STEP 6 — Master checklist
// ═══════════════════════════════════════════════════════════════
function S6({ deal }) {
  const isBuyer = deal.type==='buyer';
  const [activeTab, setActiveTab] = useState(isBuyer?'buyer':'seller');

  const BUYER_ITEMS=[
    {cat:'Accepted offer',  label:'Signed purchase contract received',      status:'completed'},
    {cat:'Deposit',         label:`Deposit received — ${deal.deposit}`,     status:'pending'},
    {cat:'Conditions',      label:'Home inspection completed',               status:'pending'},
    {cat:'Conditions',      label:'Financing confirmed by lender',           status:'pending'},
    {cat:'Condo',  label:'Condo documents requested & received', status:'pending'},
    {cat:'Legal',  label:'Lawyer assigned',                      status:'pending'},
    {cat:'Forms',           label:'Consumer Relationships Guide signed',     status:'completed'},
    {cat:'Waivers',         label:'Condition waiver signed & delivered',     status:'pending'},
  ];
  const SELLER_ITEMS=[
    {cat:'Listing',  label:'Listing agreement signed',      status:'completed'},
    {cat:'Listing',  label:'RMS measurements completed',    status:'pending'},
    {cat:'Listing',  label:'Photos taken & uploaded',       status:'pending'},
    {cat:'Listing',  label:'Sign installed',                status:'pending'},
    {cat:'Listing',  label:'MLS entry done',                status:'pending'},
    {cat:'Listing',  label:'Lockbox installed',             status:'missing'},
    {cat:'Forms',    label:'Consumer Relationships Guide',  status:'completed'},
    {cat:'Listing',  label:'Feature sheets ready',          status:'pending'},
  ];
  const CONVEY_ITEMS=[
    {cat:'Conveyancing', label:'Signed purchase contract sent',    status:'completed'},
    {cat:'Conveyancing', label:'Amendments / addendum sent',       status:'missing'},
    {cat:'Conveyancing', label:'Waivers sent to conveyancing',     status:'pending'},
    {cat:'Conveyancing', label:'Brokerage forms complete',         status:'pending'},
    {cat:'Conveyancing', label:'Commission documents filed',       status:'pending'},
    {cat:'Conveyancing', label:'Trust deposit confirmation',       status:'pending'},
  ];

  const tabItems = {buyer:BUYER_ITEMS, seller:SELLER_ITEMS, conveyancing:CONVEY_ITEMS};
  const items = tabItems[activeTab]||BUYER_ITEMS;
  const done=items.filter(x=>x.status==='completed').length;
  const missing=items.filter(x=>x.status==='missing').length;

  const allItems=[...BUYER_ITEMS,...SELLER_ITEMS,...CONVEY_ITEMS];
  const totalDone=allItems.filter(x=>x.status==='completed').length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      <Card cls="lg:col-span-1 space-y-3">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Overall progress</p>
        <PBar value={totalDone} max={allItems.length}/>
        <div className="space-y-2 pt-1">
          {[['Complete',totalDone,'green'],['Pending',allItems.filter(x=>x.status==='pending').length,'amber'],['Missing',allItems.filter(x=>x.status==='missing').length,'red'],['Overdue',0,'gray']].map(([l,n,c])=>(
            <div key={l} className="flex justify-between items-center">
              <StatusBdg status={l.toLowerCase()==='complete'?'completed':l.toLowerCase()}/>
              <span className="text-sm font-bold text-gray-800">{n}</span>
            </div>
          ))}
        </div>
        {missing>0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5">
            <p className="text-xs font-semibold text-amber-700 flex items-center gap-1"><AlertTriangle size={11}/>Action required</p>
            <p className="text-xs text-amber-600 mt-0.5">{missing} missing item{missing>1?'s':''} need attention before condition removal.</p>
          </div>
        )}
      </Card>

      <Card cls="lg:col-span-3">
        <div className="flex gap-0 border-b border-gray-200 mb-4">
          {[['buyer','Buyer side'],['seller','Seller side'],['conveyancing','Conveyancing']].map(([key,lbl])=>(
            <button key={key} onClick={()=>setActiveTab(key)}
              className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors ${activeTab===key?'border-teal-500 text-teal-700':'-mb-px border-transparent text-gray-400 hover:text-gray-600'}`}>
              {lbl}
            </button>
          ))}
        </div>
        <PBar value={done} max={items.length}/>
        <div className="mt-3">
          {items.map((item,i)=>(
            <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div className="flex items-center gap-2 flex-1 min-w-0 pr-2">
                <span className="text-[10px] text-gray-400 font-semibold w-20 flex-shrink-0">{item.cat}</span>
                <span className="text-xs text-gray-700">{item.label}</span>
              </div>
              <StatusBdg status={item.status}/>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// STEP 7 — Validation Engine (NEW — was missing)
// ═══════════════════════════════════════════════════════════════
function S7({ deal }) {
  const [checked, setChecked] = useState(0);
  useEffect(()=>{
    setChecked(0);
    const timers=Array.from({length:10},(_,i)=>setTimeout(()=>setChecked(i+1),400+i*350));
    return ()=>timers.forEach(clearTimeout);
  },[deal.type]);

  const checks=[
    {label:'Document type — correct?',           result:'Confirmed',              status:'pass'},
    {label:'All required signatures present?',   result:'Yes — all parties',      status:'pass'},
    {label:'Signed vs unsigned version?',        result:'Signed PDF confirmed',   status:'pass'},
    {label:'Deposit due date — in range?',       result:'June 3, 2026 — valid',   status:'pass'},
    {label:'Condition removal before closing?',  result:`${deal.condRemoval} < ${deal.possession}`, status:'pass'},
    {label:'Waiver of conditions received?',     result:'Not yet — pending',      status:'warn'},
    {label:'Home inspection booked?',            result:'Not confirmed',           status:'warn'},
    {label:'Condo documents received?',          result:deal.missingDocs.includes('Condo documents')?'Missing — required':'Received', status:deal.missingDocs.includes('Condo documents')?'fail':'pass'},
    {label:'Lawyer info present?',               result:deal.lawyer?'Confirmed':'Missing', status:deal.lawyer?'pass':'fail'},
    {label:'Amendments / addendum present?',     result:deal.missingDocs.includes('Amendments / addendum')?'Missing — required':'Present', status:deal.missingDocs.includes('Amendments / addendum')?'fail':'pass'},
  ];

  const statusCfg={
    pass: {bg:'bg-emerald-50', bdr:'border-emerald-200', Icon:CheckCircle, ic:'text-emerald-500', label:'Pass'},
    warn: {bg:'bg-amber-50',   bdr:'border-amber-200',   Icon:AlertTriangle,ic:'text-amber-500',  label:'Warning'},
    fail: {bg:'bg-red-50',     bdr:'border-red-200',     Icon:XCircle,     ic:'text-red-500',     label:'Action needed'},
  };

  const passed=checks.slice(0,checked).filter(c=>c.status==='pass').length;
  const warned=checks.slice(0,checked).filter(c=>c.status==='warn').length;
  const failed=checks.slice(0,checked).filter(c=>c.status==='fail').length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      <Card cls="lg:col-span-1 space-y-3">
        <SecHead Icon={Shield} title="Validation engine"/>
        <div className="text-center py-3">
          <p className="text-3xl font-bold text-gray-800">{checked}/{checks.length}</p>
          <p className="text-xs text-gray-500">checks run</p>
        </div>
        <PBar value={checked} max={checks.length}/>
        <div className="space-y-2 pt-1">
          {[['Passed',passed,'green'],['Warnings',warned,'amber'],['Action needed',failed,'red']].map(([l,n,c])=>(
            <div key={l} className="flex justify-between items-center py-1.5 border-b border-gray-100 last:border-0">
              <Bdg color={c}>{l}</Bdg>
              <span className="text-sm font-bold">{n}</span>
            </div>
          ))}
        </div>
        {failed>0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-2.5">
            <p className="text-xs font-semibold text-red-600 flex items-center gap-1"><AlertTriangle size={11}/>Agent notified</p>
            <p className="text-xs text-red-500 mt-0.5">{failed} issue{failed>1?'s':''} require attention before conditions are removed.</p>
          </div>
        )}
      </Card>

      <Card cls="lg:col-span-3">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Document & compliance checks</p>
        <div className="space-y-2">
          {checks.map((c,i)=>{
            const { bg, bdr, Icon, ic, label } = statusCfg[c.status];
            const visible = i < checked;
            return (
              <div key={i} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border ${visible?`${bg} ${bdr}`:' bg-gray-50 border-gray-200 opacity-30'} transition-all duration-300`}>
                {visible
                  ? <Icon size={14} className={`${ic} flex-shrink-0`}/>
                  : <div className="w-3.5 h-3.5 rounded-full bg-gray-300 flex-shrink-0"/>
                }
                <span className="text-xs text-gray-700 flex-1">{c.label}</span>
                {visible && (
                  <>
                    <span className="text-xs text-gray-500">{c.result}</span>
                    <Bdg color={c.status==='pass'?'green':c.status==='warn'?'amber':'red'}>{label}</Bdg>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// STEP 8 — Calendar reminders
// ═══════════════════════════════════════════════════════════════
function S8({ deal }) {
  const events=[
    {date:`Jun\n3`,  label:'Deposit due',             desc:`${deal.deposit} payable to ${deal.depositTo}`, type:'deposit',   c:'bg-navy-600 text-white'},
    {date:`Jun\n8`,  label:'Financing deadline',      desc:'Lender confirmation required',                  type:'condition', c:'bg-amber-500 text-white'},
    {date:`Jun\n8`,  label:'Inspection deadline',     desc:'Home inspection must be complete',              type:'condition', c:'bg-amber-500 text-white'},
    {date:`Jun\n10`, label:'Conditions due',          desc:'All conditions must be satisfied',              type:'deadline',  c:'bg-red-500 text-white'},
    {date:`Jun\n14`, label:'Waiver deadline',         desc:'Waiver must be signed & delivered',            type:'waiver',    c:'bg-orange-500 text-white'},
    {date:`Jul\n15`, label:'Possession day',          desc:'Key release at 12:00 PM',                      type:'closing',   c:'bg-teal-600 text-white'},
  ];
  const typeBdg={deposit:'navy',condition:'gold',deadline:'red',waiver:'amber',closing:'green'};

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      <Card cls="lg:col-span-3">
        <SecHead Icon={CalendarCheck} title="Calendar reminders created" badge={`${events.length} events`}/>
        <div className="space-y-2">
          {events.map((ev,i)=>(
            <div key={i} className="flex items-start gap-3 animate-fade-up" style={{animationDelay:`${i*90}ms`}}>
              <div className={`${ev.c} rounded-lg px-2.5 py-2 text-center min-w-[52px] flex-shrink-0`}>
                <div className="text-[10px] font-semibold opacity-80 whitespace-pre">{ev.date}</div>
              </div>
              <div className="flex-1 py-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold text-gray-800">{ev.label} — {deal.clientShort}</span>
                  <Bdg color={typeBdg[ev.type]}>{ev.type}</Bdg>
                </div>
                <p className="text-xs text-gray-500">{ev.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card cls="lg:col-span-2 space-y-3">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Reminder schedule</p>
        {['7 days before each deadline','48 hours before condition removal','24 hours before deposit due','Morning of possession day','Agent daily digest — 8:00 AM'].map((item,i)=>(
          <div key={i} className="flex items-start gap-2 py-1.5 border-b border-gray-100 last:border-0">
            <Bell size={12} className="text-teal-500 flex-shrink-0 mt-0.5"/>
            <span className="text-xs text-gray-700">{item}</span>
          </div>
        ))}
        <div className="bg-navy-50 border border-navy-100 rounded-lg p-3 mt-2">
          <p className="text-xs font-semibold text-navy-600">Each event includes</p>
          <ul className="mt-1.5 space-y-1">
            {['Client name in event title','Property address in description','Realtor notification sent automatically'].map((item,i)=>(
              <li key={i} className="flex items-center gap-1.5 text-xs text-navy-600">
                <CheckCircle size={10}/>{item}
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// STEP 9 — Email workflows (review before sending)
// ═══════════════════════════════════════════════════════════════
function S9({ deal }) {
  const isBuyer = deal.type==='buyer';
  const emails = isBuyer ? [
    {title:'Buyer accepted offer — next steps', to:deal.email, sub:`Your accepted offer · ${deal.addressShort}`, preview:`Hi ${deal.client.split(' ')[0]}, congratulations — your offer has been accepted! Here are your key upcoming dates and next steps: conditions due ${deal.condDate}, possession ${deal.possession}...`, status:'Draft', c:'border-teal-400', bc:'teal'},
    {title:'Deposit instructions',              to:deal.email, sub:`Deposit instructions · ${deal.addressShort}`, preview:`Your deposit of ${deal.deposit} is due by ${deal.condDate}. Please make your certified cheque payable to ${deal.depositTo}...`, status:'Draft', c:'border-navy-400', bc:'navy'},
    {title:'Lender / financing reminder',       to:deal.email, sub:'Confirm your financing this week', preview:`As a reminder, your financing condition is due by ${deal.condDate}. Please contact your lender immediately to confirm...`, status:'Scheduled', c:'border-amber-400', bc:'amber'},
    {title:'Possession preparation email',      to:deal.email, sub:`Preparing for possession · ${deal.possession}`, preview:`Your possession date is coming up on ${deal.possession}. Here is your complete moving checklist: lawyer appointment, utility transfers, key release at 12:00 PM...`, status:'Scheduled', c:'border-emerald-400', bc:'green'},
  ] : [
    {title:'Seller listing activated',              to:deal.email, sub:`Your listing is live · ${deal.addressShort}`, preview:`Hi ${deal.client.split(' ')[0]}, your property at ${deal.addressShort} is now listed! Here is your listing link, Drive folder access, and what to expect next...`, status:'Draft', c:'border-teal-400', bc:'teal'},
    {title:'Photographer / RMS / sign install request', to:'vendors@maxwell.ca', sub:`Service requests · ${deal.addressShort}`, preview:`New listing at ${deal.addressShort}. Please coordinate: photography session, RMS measurements, sign install. Client: ${deal.client}...`, status:'Draft', c:'border-amber-400', bc:'amber'},
    {title:'Seller preparing-for-move email',   to:deal.email, sub:'Getting ready for possession day', preview:`As possession day approaches, here is your seller checklist: final walkthrough, leave keys and remotes, utility transfers, possession prep...`, status:'Scheduled', c:'border-navy-400', bc:'navy'},
    {title:'Seller moving checklist',           to:deal.email, sub:`Moving checklist · possession ${deal.possession}`, preview:`Here is your complete moving checklist for possession on ${deal.possession}: address changes, utility transfers, final walkthrough, and key handoff instructions...`, status:'Scheduled', c:'border-emerald-400', bc:'green'},
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Mail size={18} style={{color:NAVY}}/>
          <h3 className="font-semibold text-gray-900">AI-drafted email templates</h3>
        </div>
        <Bdg color="amber"><Eye size={10}/>Review before sending</Bdg>
        <p className="text-xs text-gray-500 ml-auto">All emails are drafts — agent reviews and sends</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {emails.map((email,i)=>(
          <div key={i} className={`card p-4 border-l-4 ${email.c} animate-fade-up`} style={{animationDelay:`${i*100}ms`}}>
            <div className="flex justify-between items-start mb-2 gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-800">{email.title}</p>
                <p className="text-xs text-gray-500">To: {email.to}</p>
                <p className="text-xs font-medium text-gray-700 mt-0.5">Subject: {email.sub}</p>
              </div>
              <Bdg color={email.status==='Scheduled'?'amber':'teal'}>{email.status}</Bdg>
            </div>
            <p className="text-xs text-gray-500 italic bg-gray-50 rounded-lg p-2.5 leading-relaxed">"{email.preview}"</p>
            <div className="flex gap-2 mt-3">
              <button className="text-xs px-3 py-1.5 rounded-lg font-semibold text-white flex items-center gap-1.5" style={{background:TEAL}}>
                <Eye size={10}/>Review & edit
              </button>
              <button className="text-xs px-3 py-1.5 rounded-lg font-medium border border-gray-300 text-gray-600 hover:bg-gray-50">
                Send
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// STEP 10 — Conveyancing package
// ═══════════════════════════════════════════════════════════════
function S10({ deal }) {
  const docs=[
    {name:'Residential purchase contract',  status:'ready',   time:'Auto-collected on arrival'},
    {name:'MLS data sheet',                status:'ready',   time:'Auto-collected from listing'},
    {name:'Title',                          status:'ready',   time:'Included with purchase contract'},
    {name:'Waiver of conditions',           status:'pending', time:'Awaiting condition removal — '+deal.condRemoval},
    {name:'Trust deposit confirmation',     status:'pending', time:'Awaiting deposit — '+deal.condDate},
    {name:'Amendments / addendum',          status:'pending', time:'N/A in most cases'},
    {name:'Trade Record Sheet',             status:'pending', time:'Completed last — after waivers received'},
  ];
  const sc={ready:'green',pending:'amber',missing:'red'};
  const sl={ready:'Ready',pending:'Pending',missing:'Missing'};
  const ready=docs.filter(d=>d.status==='ready').length;
  const missing=docs.filter(d=>d.status==='missing').length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      <Card cls="lg:col-span-3">
        <SecHead Icon={Send} title="Conveyancing — MaxWell Canyon Creek"/>
        <p className="text-xs text-gray-500 -mt-2 mb-4">{deal.clientShort} — {deal.addressShort}</p>
        <div className="space-y-0">
          {docs.map((doc,i)=>(
            <div key={i} className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0 animate-fade-in" style={{animationDelay:`${i*70}ms`}}>
              <div>
                <p className="text-xs font-medium text-gray-800">{doc.name}</p>
                <p className="text-xs text-gray-400">{doc.time}</p>
              </div>
              <Bdg color={sc[doc.status]}>{sl[doc.status]}</Bdg>
            </div>
          ))}
        </div>
      </Card>
      <Card cls="lg:col-span-2 space-y-4">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Package status</p>
        <div className="text-center py-3">
          <p className="text-4xl font-bold text-amber-500">{ready}/{docs.length}</p>
          <p className="text-xs text-gray-500 mt-1">documents ready</p>
        </div>
        <PBar value={ready} max={docs.length} color="bg-amber-500"/>
        {missing>0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-xs font-semibold text-red-600 flex items-center gap-1"><AlertTriangle size={11}/>{missing} missing document{missing>1?'s':''}</p>
            <p className="text-xs text-red-500 mt-1">Agent notified automatically.</p>
          </div>
        )}
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
          <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1"><CheckCircle size={11}/>Auto-sent on arrival</p>
          <p className="text-xs text-emerald-600 mt-1">Contract + Trade Record delivered to MaxWell conveyancing immediately.</p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <p className="text-xs font-semibold text-gray-700 mb-2">Delivery mode</p>
          <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer mb-1"><input type="radio" name="delivery" defaultChecked className="accent-teal-600"/>Instant (as each doc arrives)</label>
          <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer"><input type="radio" name="delivery" className="accent-teal-600"/>Batched daily at 9:00 AM</label>
        </div>
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold text-white" style={{background:NAVY}}>
          <Send size={13}/>Send package to conveyancing
        </button>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// STEP 11 — Trade Record Sheet
// ═══════════════════════════════════════════════════════════════
function S11({ deal }) {
  const sections=[
    {title:'Property & parties', fields:[
      ['Buyer name(s)',       deal.client],
      ['Seller name(s)',      'Robert & Carol Simmons'],
      ['Property address',   deal.address],
      ['MLS number',         deal.mls],
      ['Property type',      'Residential — detached'],
      ['Legal description',  'Plan 0214693 Block 4 Lot 47'],
    ]},
    {title:'Financial details', fields:[
      ['Sale price',           deal.price],
      ['Deposit amount',       deal.deposit],
      ['Deposit payable to',   deal.depositTo],
      ['Commission — buyer side', deal.commission.split('/')[0].trim()+' of sale price'],
      ['Commission — seller side',deal.commission.split('/')[1].trim()+' of sale price'],
      ['Trust deposit received','Pending confirmation'],
    ]},
    {title:'Key dates', fields:[
      ['Offer date',          'May 20, 2026'],
      ['Conditions due',      deal.condDate],
      ['Condition removal',   deal.condRemoval],
      ['Possession / closing',deal.possession],
      ['Irrevocability',      'May 20, 2026 — 9:00 PM'],
    ]},
    {title:'Legal & contacts', fields:[
      ["Buyer's lawyer",     deal.lawyer],
      ['Lawyer email',       deal.lawyerEmail],
      ["Buyer's Realtor",    deal.realtorBuyer+' — '+deal.brokerage],
      ["Seller's Realtor",   deal.realtorSeller],
      ['Conveyancing',       'MaxWell Canyon Creek — conveyancing@maxwell.ca'],
    ]},
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <FileSpreadsheet size={18} style={{color:NAVY}}/>
        <h3 className="font-semibold text-gray-900">Trade Record Sheet — auto-populated</h3>
        <Bdg color="green"><CheckCircle size={9}/>No manual entry required</Bdg>
        <Bdg color="navy" cls="ml-auto">MaxWell Canyon Creek · {deal.realtorBuyer}</Bdg>
      </div>
      <div className="card overflow-hidden">
        <div className="px-4 py-3 flex items-center gap-3" style={{background:NAVY}}>
          <FileSpreadsheet size={15} color="white"/>
          <span className="text-sm font-semibold text-white">Trade Record Sheet — {deal.clientShort} — {deal.addressShort}</span>
          <Bdg color="green" cls="ml-auto"><CheckCircle size={9}/>Auto-populated</Bdg>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
          {sections.map((sec,si)=>(
            <div key={si} className={`p-4 ${si>=2?'border-t border-gray-200':''}`}>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3">{sec.title}</p>
              {sec.fields.map((f,fi)=>(
                <div key={fi} className="flex gap-3 py-1.5 border-b border-gray-100 last:border-0">
                  <span className="text-xs text-gray-500 w-36 flex-shrink-0">{f[0]}</span>
                  <span className={`text-xs font-medium flex-1 ${f[1].includes('Pending')?'text-amber-600':'text-navy-700'}`}>{f[1]}</span>
                  <CheckCircle size={11} className={f[1].includes('Pending')?'text-gray-300':'text-emerald-400'}/>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="px-4 py-3 border-t border-emerald-200 bg-emerald-50 flex items-center justify-between">
          <p className="text-xs text-emerald-700 font-semibold">✓ Trade Record Sheet complete — ready to submit to MaxWell Canyon Creek Conveyancing</p>
          <button className="text-xs px-3 py-1.5 rounded-lg font-semibold text-white flex-shrink-0" style={{background:NAVY}}>Send to conveyancing</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// STEP 12 — Closing phase
// ═══════════════════════════════════════════════════════════════
function S12({ deal }) {
  const finalChecks=[
    'All checklist items — 100% complete',
    'Conveyancing package sent & confirmed',
    'Trust deposit confirmed received',
    'Commission documents filed',
    'Signed contract archived in Drive',
    'Trade Record Sheet submitted',
  ];
  const stats=[
    {v:'< 2 min', l:'Setup time',      s:'vs. 45 min manually',            c:'teal'},
    {v:'0×',      l:'Data entry',      s:'Extracted once, used everywhere', c:'navy'},
    {v:'0×',      l:'Missed deadlines',s:'All reminders fired on time',     c:'amber'},
    {v:'100%',    l:'Docs organized',  s:'Zero missing at close',           c:'green'},
  ];
  const colorMap={teal:TEAL,navy:NAVY,amber:GOLD,green:GREEN};

  return (
    <div className="space-y-4">
      <Card cls="text-center py-10 bg-emerald-50 border-emerald-300">
        <div className="text-6xl mb-4">🏠</div>
        <div className="flex items-center justify-center gap-3 mb-2">
          <BadgeCheck size={32} className="text-emerald-500"/>
          <h2 className="text-3xl font-bold text-emerald-700">Transaction Closed</h2>
        </div>
        <p className="text-gray-700 font-semibold text-lg mb-1">{deal.client} — {deal.addressShort}</p>
        <p className="text-gray-500 mb-6">Sale price: {deal.price} · Possession: {deal.possession}</p>
        <div className="flex flex-wrap justify-center gap-2">
          {finalChecks.map((c,i)=><Bdg key={i} color="green"><CheckCircle size={9}/>{c}</Bdg>)}
        </div>
      </Card>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s,i)=>(
          <div key={i} className="card-pad text-center border-t-4" style={{borderTopColor:colorMap[s.c]}}>
            <p className="text-3xl font-bold" style={{color:colorMap[s.c]}}>{s.v}</p>
            <p className="text-xs font-semibold text-gray-700 mt-1">{s.l}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.s}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">What happened automatically</p>
          {['DocuSign document detected & saved','Document type classified by AI','All data extracted — no re-entry','Master folder + 10 subfolders created','Checklist & Trade Record generated','Calendar reminders set for every date','Email drafts prepared for review','Conveyancing package assembled','Missing document alerts sent','Transaction marked CLOSED'].map((item,i)=>(
            <div key={i} className="flex items-center gap-2 py-1 border-b border-gray-100 last:border-0">
              <CheckCircle size={11} className="text-emerald-500 flex-shrink-0"/>
              <span className="text-xs text-gray-700">{item}</span>
            </div>
          ))}
        </Card>
        <div className="space-y-3">
          <Card cls="bg-blue-50 border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Mail size={14} className="text-blue-600"/>
              <p className="text-sm font-semibold text-blue-800">Anniversary email scheduled</p>
              <Bdg color="navy">Auto</Bdg>
            </div>
            <p className="text-xs text-blue-700">"Happy 1 year in your new home!" — scheduled for {deal.possession.replace('2026','2027')}. Draft ready for agent review before it sends.</p>
          </Card>
          <Card>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={14} className="text-teal-600"/>
              <p className="text-sm font-semibold text-gray-800">Phase 2 — full automation</p>
            </div>
            {['DocuSign webhook — zero manual upload','Auto-share Drive folders with lawyers & clients','ShowingTime, Pillar 9, RiteWay Signs integration','Automatic conveyancing send as each doc arrives','Full missing-document validation engine'].map((item,i)=>(
              <div key={i} className="flex items-center gap-2 text-xs text-gray-600 py-0.5">
                <span className="text-teal-400">›</span>{item}
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// FULL AUTOMATION FLOW OVERVIEW (tab)
// ═══════════════════════════════════════════════════════════════
function FullFlowOverview() {
  const phases=[
    {phase:'Trigger',  color:NAVY,  steps:['Signed DocuSign document arrives by email','File auto-moved to NEW TRANSACTION INBOX']},
    {phase:'AI Processing', color:TEAL, steps:['Document type classified (BRA/SLA/Purchase/Waiver/etc.)','All data extracted — names, dates, prices, conditions','Missing fields flagged for agent review']},
    {phase:'Setup',    color:GOLD,  steps:['Master folder + 10 subfolders created','Checklist template copied in','CRM tracker row added — no manual entry','Trade Record Sheet pre-populated']},
    {phase:'Validation',color:'#7C3AED', steps:['Document type verified','Signed vs unsigned confirmed','Missing forms detected','Condition dates validated against closing date']},
    {phase:'Workflow', color:'#0891B2', steps:['Calendar reminders set for all key dates','Email drafts prepared — review before sending','Conveyancing package assembled as docs arrive','Google Drive shared with lawyers, brokers, clients']},
    {phase:'Closing',  color:GREEN, steps:['Checklist reaches 100%','Conveyancing confirmed','Commission paperwork filed','Transaction marked CLOSED','Anniversary email scheduled']},
  ];
  return (
    <div className="space-y-4">
      <div className="card-pad bg-navy-50 border-navy-200">
        <p className="text-sm font-semibold text-navy-700 mb-1">Key principle — event-driven automation</p>
        <p className="text-xs text-navy-600 leading-relaxed">Every completed step triggers the next automatically. Documents trigger workflows, validations, reminders, emails, and checklist updates — without manual admin work.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {phases.map((p,i)=>(
          <div key={i} className="card overflow-hidden">
            <div className="px-4 py-2.5" style={{background:p.color}}>
              <p className="text-xs font-bold text-white uppercase tracking-wider">{p.phase}</p>
            </div>
            <div className="p-3 space-y-1.5">
              {p.steps.map((s,j)=>(
                <div key={j} className="flex items-start gap-2">
                  <ArrowRight size={11} className="flex-shrink-0 mt-0.5" style={{color:p.color}}/>
                  <span className="text-xs text-gray-700">{s}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3"><Zap size={11} className="inline text-teal-500 mr-1"/>Automated — no agent input needed</p>
          {AUTO_LIST.map((item,i)=>(
            <div key={i} className="flex items-center gap-2 py-1 border-b border-gray-100 last:border-0">
              <CheckCircle size={11} className="text-emerald-500 flex-shrink-0"/>
              <span className="text-xs text-gray-700">{item}</span>
            </div>
          ))}
        </Card>
        <Card>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3"><Shield size={11} className="inline text-amber-500 mr-1"/>Requires agent approval</p>
          {APPROVAL_LIST.map((item,i)=>(
            <div key={i} className="flex items-center gap-2 py-1 border-b border-gray-100 last:border-0">
              <div className="w-3 h-3 rounded-full border-2 border-amber-400 flex-shrink-0"/>
              <span className="text-xs text-gray-700">{item}</span>
            </div>
          ))}
          <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-2.5">
            <p className="text-xs text-amber-700 font-medium">The Realtor stays in control of all client communications and legal documents. AI assists — you decide.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// INFO MODAL
// ═══════════════════════════════════════════════════════════════
function InfoModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-900">Automation breakdown</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 text-gray-500"><X size={18}/></button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-200">
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center"><Zap size={15} className="text-teal-600"/></div>
              <div><p className="text-sm font-semibold text-gray-900">What is automated</p><p className="text-xs text-gray-500">Happens without agent input</p></div>
            </div>
            {AUTO_LIST.map((item,i)=>(
              <div key={i} className="flex items-start gap-2 py-1.5 border-b border-gray-100 last:border-0">
                <CheckCircle size={12} className="text-emerald-500 flex-shrink-0 mt-0.5"/>
                <span className="text-xs text-gray-700">{item}</span>
              </div>
            ))}
          </div>
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center"><Shield size={15} className="text-amber-600"/></div>
              <div><p className="text-sm font-semibold text-gray-900">What requires your approval</p><p className="text-xs text-gray-500">Agent reviews before proceeding</p></div>
            </div>
            {APPROVAL_LIST.map((item,i)=>(
              <div key={i} className="flex items-start gap-2 py-1.5 border-b border-gray-100 last:border-0">
                <div className="w-3 h-3 rounded-full border-2 border-amber-400 flex-shrink-0 mt-0.5"/>
                <span className="text-xs text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 bg-gray-50 border-t border-gray-200 rounded-b-2xl">
          <p className="text-xs text-gray-500 text-center">AI-assisted, not fully autonomous. The Realtor remains in control of all client communications and legal documents.</p>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// LANDING PAGE
// ═══════════════════════════════════════════════════════════════
function Landing({ flowType, setFlowType, onStart, onShowInfo }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 py-4 flex items-center justify-between" style={{background:NAVY}}>
        <div className="flex items-center gap-3">
          <Building2 size={20} color="#93C5FD"/>
          <div>
            <p className="font-semibold text-sm text-white">MaxWell Canyon Creek</p>
            <p className="text-xs text-blue-300">Transaction Automation System</p>
          </div>
          <Bdg color="teal" cls="ml-2">AI-assisted</Bdg>
        </div>
        <button onClick={onShowInfo} className="flex items-center gap-1.5 text-xs font-medium text-blue-200 hover:text-white transition-colors">
          <Info size={13}/>About this demo
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-10 text-center">
        <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{color:TEAL}}>MaxWell Canyon Creek · Roundtable Demo</p>
        <h1 className="text-4xl font-bold text-gray-900 mb-3 leading-tight">Realtor Transaction<br/>Automation</h1>
        <p className="text-gray-500 text-base mb-8 max-w-xl leading-relaxed mx-auto">
          A signed DocuSign document arrives. Watch the full transaction set itself up — folder, CRM, checklist, validation, reminders, emails, conveyancing, and closing — automatically.
        </p>

        {/* Flow tabs */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1.5 mb-8 mx-auto">
          {[{key:'buyer',label:'👤 Buyer flow',sub:'Purchase contract'},{key:'seller',label:'🏡 Seller flow',sub:'Listing agreement'},{key:'full',label:'🔄 Full automation',sub:'System overview'}].map(opt=>(
            <button key={opt.key} onClick={()=>setFlowType(opt.key)}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${flowType===opt.key?'bg-white shadow text-navy-600 font-semibold':'text-gray-500 hover:text-gray-700'}`}>
              {opt.label}
              <span className="block text-xs font-normal text-gray-400 mt-0.5">{opt.sub}</span>
            </button>
          ))}
        </div>

        {flowType === 'full' ? (
          <button onClick={onStart} className="inline-flex items-center gap-3 px-7 py-4 rounded-xl text-base font-bold text-white shadow-lg transition-all hover:opacity-90 active:scale-95" style={{background:TEAL}}>
            <Play size={20} fill="currentColor"/>View Full Automation Overview
          </button>
        ) : (
          <button onClick={onStart} className="inline-flex items-center gap-3 px-7 py-4 rounded-xl text-base font-bold text-white shadow-lg transition-all hover:opacity-90 active:scale-95" style={{background:TEAL}}>
            <Play size={20} fill="currentColor"/>Run Demo Workflow
          </button>
        )}
        <p className="text-xs text-gray-400 mt-3">
          {flowType==='full'?'Complete system overview — 2 pages':'Auto-advances through 12 steps · ~55 sec runtime'}
        </p>

        {/* Step grid preview (not shown for full overview) */}
        {flowType !== 'full' && (
          <div className="mt-10 grid grid-cols-4 lg:grid-cols-6 gap-2 w-full max-w-2xl mx-auto">
            {STEPS.map((step)=>(
              <div key={step.id} className="card p-2.5 text-center hover:border-teal-300 transition-colors">
                <step.Icon size={16} style={{color:NAVY}} className="mx-auto mb-1.5"/>
                <p className="text-[10px] font-semibold text-gray-500 leading-tight">{step.short}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-3 w-full max-w-2xl mx-auto">
          {[
            {Icon:Zap, bg:'bg-teal-100 text-teal-700', title:'Event-driven', desc:'One signed document triggers the entire flow automatically.'},
            {Icon:Shield, bg:'bg-amber-100 text-amber-700', title:'Agent in control', desc:'All emails and documents are drafts — you review before anything goes out.'},
            {Icon:Users, bg:'bg-blue-100 text-blue-700', title:'No duplicate entry', desc:'Data extracted once and used across CRM, checklist, emails, and trade record.'},
          ].map((item,i)=>(
            <div key={i} className="card-pad text-left">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2.5 ${item.bg}`}><item.Icon size={15}/></div>
              <p className="text-sm font-semibold text-gray-800 mb-1">{item.title}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════
const STEP_COMPONENTS = [S1,S2,S3,S4,S5,S6,S7,S8,S9,S10,S11,S12];

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [flowType,    setFlowType]    = useState('buyer');
  const [running,     setRunning]     = useState(false);
  const [completed,   setCompleted]   = useState(new Set());
  const [visible,     setVisible]     = useState(false);
  const [showInfo,    setShowInfo]    = useState(false);
  const [showFull,    setShowFull]    = useState(false);
  const timerRef = useRef(null);
  const deal = flowType==='seller' ? SELLER_DEAL : BUYER_DEAL;

  const transitionTo = useCallback((step) => {
    setVisible(false);
    setTimeout(()=>{ setCurrentStep(step); setVisible(true); }, 200);
  },[]);

  const goNext = useCallback(()=>{
    if(currentStep<12){
      setCompleted(prev=>{ const n=new Set(prev); n.add(currentStep); return n; });
      transitionTo(currentStep+1);
    }
  },[currentStep,transitionTo]);

  const goPrev = useCallback(()=>{
    if(currentStep>1) transitionTo(currentStep-1);
    else reset();
  },[currentStep,transitionTo]);

  const reset = ()=>{
    if(timerRef.current) clearTimeout(timerRef.current);
    setRunning(false); setCurrentStep(0);
    setCompleted(new Set()); setVisible(false); setShowFull(false);
  };

  const startDemo = ()=>{
    if(flowType==='full'){ setShowFull(true); return; }
    setCompleted(new Set()); setRunning(true); transitionTo(1);
  };

  const manualGo = (step)=>{
    if(timerRef.current) clearTimeout(timerRef.current);
    setRunning(false);
    setCompleted(prev=>{ const n=new Set(prev); for(let i=1;i<step;i++) n.add(i); return n; });
    transitionTo(step);
  };

  useEffect(()=>{
    if(!running||currentStep===0) return;
    if(currentStep>=12){ setRunning(false); return; }
    const delay=STEP_DELAYS[currentStep-1]||4000;
    timerRef.current=setTimeout(()=>{
      setCompleted(prev=>{ const n=new Set(prev); n.add(currentStep); return n; });
      transitionTo(currentStep+1);
    }, delay);
    return ()=>clearTimeout(timerRef.current);
  },[running,currentStep,transitionTo]);

  // Full automation overview
  if(showFull) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <header className="px-5 py-3 flex items-center justify-between flex-shrink-0" style={{background:NAVY}}>
          <div className="flex items-center gap-3">
            <Building2 size={18} color="#93C5FD"/>
            <p className="font-semibold text-sm text-white">MaxWell Canyon Creek — Full Automation Flow</p>
          </div>
          <button onClick={reset} className="flex items-center gap-1.5 text-xs font-medium text-blue-200 hover:text-white transition-colors border border-blue-400/40 rounded-lg px-3 py-1.5">
            <RotateCcw size={12}/>Back to start
          </button>
        </header>
        <main className="flex-1 overflow-y-auto p-5"><FullFlowOverview/></main>
      </div>
    );
  }

  // Landing
  if(currentStep===0) {
    return (
      <>
        <Landing flowType={flowType} setFlowType={setFlowType} onStart={startDemo} onShowInfo={()=>setShowInfo(true)}/>
        {showInfo && <InfoModal onClose={()=>setShowInfo(false)}/>}
      </>
    );
  }

  const StepComp = STEP_COMPONENTS[currentStep-1];
  const stepMeta = STEPS[currentStep-1];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="px-5 py-3 flex items-center justify-between flex-shrink-0" style={{background:NAVY}}>
        <div className="flex items-center gap-3">
          <Building2 size={18} color="#93C5FD"/>
          <div>
            <p className="font-semibold text-sm text-white">MaxWell Canyon Creek</p>
            <p className="text-xs text-blue-300">Transaction Automation</p>
          </div>
          <Bdg color={flowType==='buyer'?'teal':'gold'} cls="ml-1">
            {flowType==='buyer'?'👤 Buyer flow':'🏡 Seller flow'}
          </Bdg>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={()=>setShowInfo(true)} className="flex items-center gap-1.5 text-xs font-medium text-blue-200 hover:text-white transition-colors">
            <Info size={12}/>Guide
          </button>
          <button onClick={reset} className="flex items-center gap-1.5 text-xs font-medium text-blue-200 hover:text-white transition-colors border border-blue-400/40 rounded-lg px-2.5 py-1.5">
            <RotateCcw size={12}/>Reset
          </button>
        </div>
      </header>

      {/* Step nav */}
      <nav className="bg-white border-b border-gray-200 overflow-x-auto flex-shrink-0">
        <div className="flex items-center min-w-max px-2">
          {STEPS.map((s,i)=>{
            const idx=i+1; const isActive=currentStep===idx; const isDone=completed.has(idx);
            return (
              <button key={idx} onClick={()=>manualGo(idx)}
                className={`step-btn ${isActive?'border-teal-500 text-teal-700':isDone?'border-emerald-300 text-emerald-600 hover:text-emerald-700':'border-transparent text-gray-400 hover:text-gray-600'}`}>
                {isDone&&!isActive ? <CheckCircle size={12} className="text-emerald-500"/> : <s.Icon size={12}/>}
                {s.short}
              </button>
            );
          })}
        </div>
        <div className="h-0.5 bg-gray-100">
          <div className="h-0.5 bg-teal-500 transition-all duration-700" style={{width:`${Math.round((currentStep/12)*100)}%`}}/>
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-5">
        {/* Step heading + flow toggle */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm text-white flex-shrink-0" style={{background:NAVY}}>{currentStep}</div>
          <h2 className="text-xl font-semibold text-gray-900">{stepMeta.label}</h2>
          {running&&currentStep<12 && (
            <Bdg color="teal" cls="animate-pulse-dot">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-ping"/>Auto-running
            </Bdg>
          )}
          <div className="ml-auto flex gap-1">
            {[{k:'buyer',l:'👤 Buyer'},{k:'seller',l:'🏡 Seller'}].map(opt=>(
              <button key={opt.k} onClick={()=>setFlowType(opt.k)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all border ${flowType===opt.k?opt.k==='buyer'?'bg-teal-50 border-teal-300 text-teal-700':'bg-amber-50 border-amber-300 text-amber-700':'border-gray-200 text-gray-400 hover:text-gray-600'}`}>
                {opt.l}
              </button>
            ))}
          </div>
        </div>

        {/* Step content */}
        <div style={{opacity:visible?1:0,transition:'opacity 0.25s ease'}}>
          {StepComp && <StepComp deal={deal} visible={visible}/>}
        </div>
      </main>

      {/* Controls */}
      <footer className="bg-white border-t border-gray-200 px-5 py-3 flex items-center justify-between flex-shrink-0">
        <button onClick={goPrev} className="ctrl border border-gray-200 text-gray-600 hover:bg-gray-50">
          <ChevronLeft size={15}/>{currentStep===1?'Back to start':'Previous'}
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{currentStep}/12</span>
          {!running&&currentStep<12 && (
            <button onClick={()=>setRunning(true)} className="ctrl text-white" style={{background:TEAL}}>
              <Play size={13} fill="currentColor"/>Auto-run
            </button>
          )}
          {running && (
            <button onClick={()=>{ setRunning(false); clearTimeout(timerRef.current); }} className="ctrl text-white" style={{background:AMBER}}>
              <Pause size={13}/>Pause
            </button>
          )}
        </div>
        {currentStep<12
          ? <button onClick={goNext} className="ctrl text-white" style={{background:NAVY}}>Next<ChevronRight size={15}/></button>
          : <button onClick={reset} className="ctrl border border-gray-200 text-gray-600 hover:bg-gray-50"><RotateCcw size={14}/>Start over</button>
        }
      </footer>

      {showInfo && <InfoModal onClose={()=>setShowInfo(false)}/>}
    </div>
  );
}
