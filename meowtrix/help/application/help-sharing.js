// Author: lidawen
import {CAT, Game} from '../domain/rules.js';

const BASE = 'https://dourgulf.github.io/meowtrix/help/';
const token = () => {
  const bytes = new Uint8Array(16);
  if (globalThis.crypto?.getRandomValues) globalThis.crypto.getRandomValues(bytes);
  else for (let i=0;i<bytes.length;i++) bytes[i]=Math.floor(Math.random()*256);
  return Array.from(bytes, value=>value.toString(16).padStart(2,'0')).join('');
};
const validToken = value => typeof value==='string' && /^[a-f0-9]{32}$/.test(value);

// This identifies authored board revisions, not senders. No solution is shared.
export function helpBoardRevision(level) {
  let hash=2166136261;
  for (const char of JSON.stringify([level.size,level.regions,level.given])) hash=Math.imul(hash^char.charCodeAt(0),16777619);
  return (hash>>>0).toString(36);
}

export function helpQuery(payload) { return `h=${encodeURIComponent(JSON.stringify(payload))}`; }
export function helpURL(payload) { return `${BASE}?${helpQuery(payload)}`; }
export function readHelpLink(input) {
  if (typeof input!=='string' || input.length>6000) throw Error('helpLinkInvalid');
  let encoded=input;
  if(input.startsWith(BASE+'?')) encoded=input.slice(BASE.length+1);
  else if(input.startsWith('https:')) throw Error('helpLinkInvalid');
  const entries=encoded.split('&').filter(item=>item.startsWith('h='));
  if(entries.length!==1) throw Error('helpLinkInvalid');
  let value;
  try { value=JSON.parse(decodeURIComponent(entries[0].slice(2))); } catch { throw Error('helpLinkInvalid'); }
  if(value?.v!==1) throw Error('helpLinkIncompatible');
  if(!validToken(value.owner)||!validToken(value.request)||!['level','daily'].includes(value.kind)||
    typeof value.id!=='string'||!/^[a-zA-Z0-9_-]{1,100}$/.test(value.id)||
    typeof value.revision!=='string'||!/^[a-z0-9]{1,10}$/.test(value.revision)||
    typeof value.cells!=='string'||!/^[012]{1,144}$/.test(value.cells)||typeof value.answer!=='boolean') throw Error('helpLinkInvalid');
  return {v:1,owner:value.owner,request:value.request,kind:value.kind,id:value.id,revision:value.revision,cells:value.cells,answer:value.answer};
}

// Session owns all persistence. This module keeps sharing lifecycles together,
// without engine/platform dependencies or a second personal game save.
export class HelpSharing {
  constructor(session) {
    this.session=session;
    const saved=session.progress.help;
    this.state=session.progress.help={
      identity:validToken(saved?.identity)?saved.identity:null,
      requests:saved?.requests&&typeof saved.requests==='object'&&!Array.isArray(saved.requests)?saved.requests:{},
      sessions:saved?.sessions&&typeof saved.sessions==='object'&&!Array.isArray(saved.sessions)?saved.sessions:{},
      active:typeof saved?.active==='string'?saved.active:null,
      returnTo:['level','daily','tutorial'].includes(saved?.returnTo)?saved.returnTo:null,
    };
  }
  get available() {
    const b=this.session.board;
    return !!b&&!b.replay&&(['level','daily'].includes(b.kind)&&!b.done&&!b.game.isSolved&&!b.game.isFailed||b.kind==='help');
  }
  get current() { return this.state.sessions[this.state.active]; }
  share() {
    const s=this.session,b=s.board;
    if(!this.available) return null;
    s.commit();
    let payload;
    if(b.kind==='help') payload={...this.current.payload,answer:true};
    else {
      if(!this.state.identity)this.state.identity=token();
      const save=b.kind==='level'?s.progress.active:s.progress.daily;
      let request=save.helpRequest;
      if(!validToken(request)||!this.state.requests[request]) {
        request=token();save.helpRequest=request;
        this.state.requests[request]={kind:b.kind,id:b.level.id,number:b.number??null,day:b.day??null};
      }
      payload={v:1,owner:this.state.identity,request,kind:b.kind,id:b.level.id,revision:helpBoardRevision(b.level),answer:false};
    }
    payload.cells=b.game.cells.join('');s.save();
    return {url:helpURL(payload),query:helpQuery(payload),payload,kind:payload.answer?'answer':'request'};
  }
  raw(payload) {
    const s=this.session;
    return payload.kind==='level'?s.rawLevel(payload.id):[...s.pools.weekday,...s.pools.saturday,...s.pools.sunday].find(raw=>raw.id===payload.id);
  }
  inspect(input) {
    const payload=readHelpLink(input),raw=this.raw(payload);
    if(!raw) throw Error('helpLinkIncompatible');
    const level=this.session.level(raw);
    if(helpBoardRevision(level)!==payload.revision) throw Error('helpLinkIncompatible');
    const game=Game.restore(level,{cells:[...payload.cells].map(Number),mistakes:0});
    if(!game) throw Error('helpLinkInvalid');
    const own=payload.owner===this.state.identity&&!!this.state.requests[payload.request];
    const reason=own&&payload.answer?this.invalidReason(payload):null;
    const existing=!!this.state.sessions[this.key(payload)];
    return {payload,game,type:own&&payload.answer?'answer':'help',reason,solved:game.isSolved,existing,
      canApply:!!(own&&payload.answer&&!reason),canReplaceHelp:!!(existing&&(!own||!payload.answer||reason))};
  }
  key(payload) { return `${payload.owner}:${payload.request}`; }
  invalidReason(payload) {
    const s=this.session,r=this.state.requests[payload.request];
    if(!r||r.kind!==payload.kind||r.id!==payload.id) return 'helpUnavailableRestarted';
    if(r.kind==='level'&&s.progress.completed>=r.number||r.kind==='daily'&&s.progress.lastDailyDay>=r.day) return 'helpUnavailableCompleted';
    if(r.kind==='daily'&&r.day!==s.today()&&!(s.board?.kind==='daily'&&s.board.day===r.day&&!s.board.done)) return 'helpUnavailableExpired';
    const save=r.kind==='level'?s.progress.active:s.progress.daily;
    return save?.helpRequest===payload.request?null:'helpUnavailableRestarted';
  }
  open(invitation,{replace=false,fromStart=false}={}) {
    // Revalidate external data at the mutation boundary as well as at preview.
    const fresh=this.inspect(helpURL(invitation.payload)),s=this.session,p=fresh.payload,key=this.key(p);
    s.commit();
    if(s.board?.kind!=='help') this.state.returnTo=s.board&&!s.board.done?s.board.kind:null;
    let record=this.state.sessions[key];
    if(!record) record=this.state.sessions[key]={payload:p,baseline:p.cells,game:fresh.game.toJSON(),run:{key,ms:0,hints:0,fails:0,attempt:1,step:0}};
    if(replace) record.game={...fresh.game.toJSON(),mistakes:record.game.mistakes};
    if(fromStart) record.game=new Game(fresh.game.level).toJSON();
    this.state.active=key;
    return this.restore();
  }
  restore() {
    const s=this.session,record=this.current;
    if(!record) return null;
    try {
      const checked=this.inspect(helpURL(record.payload)),game=Game.restore(checked.game.level,record.game);
      if(!game) throw Error('helpLinkInvalid');
      if(typeof record.baseline!=='string'||!/^[012]{1,144}$/.test(record.baseline)||
        !Game.restore(game.level,{cells:[...record.baseline].map(Number),mistakes:0}))throw Error('helpLinkInvalid');
      const run=record.run||{};
      const count=value=>Number.isSafeInteger(value)&&value>=0?value:0;
      record.run={key:this.state.active,ms:Number.isFinite(run.ms)&&run.ms>=0?run.ms:0,
        hints:count(run.hints),fails:count(run.fails),attempt:count(run.attempt)||1,step:0};
      s.board={kind:'help',game,level:game.level,request:this.state.active,resumed:true};
      s.save();return s.board;
    } catch { this.state.active=null;s.save();return null; }
  }
  commit() { if(this.current)this.current.game=this.session.board.game.toJSON(); }
  apply(invitation) {
    const fresh=this.inspect(helpURL(invitation.payload)),s=this.session,p=fresh.payload;
    if(fresh.type!=='answer'||fresh.reason) return false;
    s.commit();
    const source=this.state.requests[p.request];
    this.state.active=null;this.state.returnTo=null;
    if(s.board?.kind!==source.kind || (source.kind==='daily'&&s.board.day!==source.day)) {
      if(source.kind==='level')s.startLevel();else s.startDaily();
    }
    const board=s.board;
    if(!board||board.kind!==source.kind) return false;
    // Import only the snapshot. The receiver's clock, streak, errors and wallet
    // belong to their existing playthrough, including cats previously scored.
    fresh.game.mistakes=board.game.mistakes;
    if(board.points) for(let cell=0;cell<fresh.game.cells.length;cell++)
      if(fresh.game.cells[cell]===CAT&&!board.points.cells.includes(cell))board.points.cells.push(cell);
    board.game=fresh.game;board.done=false;board.failed=false;
    s.feedback?.cancelHints();s.commit();s.flush(true);return true;
  }
  restart({fromStart=false}={}) {
    const s=this.session,record=this.current;
    if(!record) return;
    const game=fromStart?new Game(s.board.level):Game.restore(s.board.level,{cells:[...record.baseline].map(Number),mistakes:0});
    if(!game) return;
    s.board.game=game;s.board.done=false;s.board.failed=false;
    record.run.attempt++;s.commit();
  }
  leave() {
    const s=this.session;this.commit();this.state.active=null;
    const destination=this.state.returnTo;this.state.returnTo=null;s.board=null;s.save();
    if(destination==='level')s.startLevel();
    else if(destination==='daily'){
      if(s.progress.daily?.day===s.today()&&!s.dailyStatus.done)s.startDaily();
      else s.dropStaleBoards();
    }
    else if(destination==='tutorial')s.startTutorial();
  }
}

export function helpSharePayload(session,l10n) {
  const share=session.help.share();
  if(!share)return null;
  const title=l10n.text(share.kind==='answer'?'helpAnswerShareText':'helpRequestShareText');
  return {kind:share.kind,surface:session.board?.done?'result':'game',source:'help',
    text:`${title}\n${share.url}`,wechat:{title,query:share.query}};
}
