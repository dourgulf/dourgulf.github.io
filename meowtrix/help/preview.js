// Author: lidawen
import {readHelpLink,helpBoardRevision} from './application/help-sharing.js';
import {makeLevel,Game} from './domain/rules.js';
const $=id=>document.getElementById(id);
const locales=['en','zh','ja','de','es','fr','it','pt'];
const requested=new URLSearchParams(location.search).get('lang')||navigator.language;
const locale=locales.find(value=>value===requested.toLowerCase().split('-')[0])||'en';
let words={};
const tr=key=>words[key]||key;
async function load(){
 $('retry').hidden=true;
 try{
  const response=await fetch(`l10n/${locale}.json`);if(!response.ok)throw Error('network');words=await response.json();
  document.documentElement.lang=locale;
  $('download').textContent=tr('helpDownload');$('retry').textContent=tr('leaderboardRetry');$('note').textContent=tr('helpDownloadNotice');
  const payload=readHelpLink(location.search.slice(1));
  const boards=await fetch('boards.json');if(!boards.ok)throw Error('network');
  const catalog=await boards.json(),raw=catalog[payload.kind].find(board=>board.id===payload.id);
  if(!raw)throw Error('helpLinkIncompatible');
  const level=makeLevel(raw),game=Game.restore(level,{cells:[...payload.cells].map(Number),mistakes:0});
  if(helpBoardRevision(level)!==payload.revision)throw Error('helpLinkIncompatible');
  if(!game)throw Error('helpLinkInvalid');
  $('message').textContent=tr(payload.answer?(game.isSolved?'helpAnswerComplete':'helpAnswerPartial'):'helpInvitation');
  const board=$('board'),art=globalThis.MeowtrixBoard;
  board.replaceChildren();
  const slots=art.regionSlots(level.id,Array.from({length:level.size},(_,row)=>level.regions.slice(row*level.size,(row+1)*level.size)),level.theme.size>0);
  const resize=()=>{const cell=(board.clientWidth-4)/(level.size+(level.size-1)*.08);board.style.setProperty('--cell',`${cell}px`);};
  board.style.setProperty('--n',level.size);
  level.regions.forEach((region,index)=>{
   const tile=document.createElement('div');tile.className='cell';const slot=slots.get(region);art.tileStyle(tile,art.PALETTE[slot],slot);
   tile.innerHTML=art.mark(game.cells[index]);board.append(tile);
  });
  new ResizeObserver(resize).observe(board);resize();
  $('open').textContent=tr('helpOpenGame');$('open').href=`meowtrix://help/?h=${encodeURIComponent(JSON.stringify(payload))}`;$('open').hidden=false;
 }catch(error){
  $('open').hidden=true;$('board').replaceChildren();
  const key=['helpLinkInvalid','helpLinkIncompatible'].includes(error.message)?error.message:null;
  $('message').textContent=key?tr(key):(words.leaderboardRetry||'Could not load. Please try again.');
  $('retry').hidden=!!key;
 }
}
$('retry').addEventListener('click',()=>void load());void load();
