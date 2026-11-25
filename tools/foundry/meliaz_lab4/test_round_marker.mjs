import assert from 'node:assert/strict';
import {createRoundMarker} from './round-marker.js';
const M='meliaz-bridge-lab',F='roundMarkerV1';
class Collection extends Map { [Symbol.iterator](){return this.values();} }
const docs=new Map(),users=new Collection(),messages=new Collection(),combats=new Collection();
const GM={id:'gm',active:true,isGM:true},P={id:'p',active:true,isGM:false},Q={id:'q',active:true,isGM:false};
for(const u of [GM,P,Q])users.set(u.id,u);
let id=0;globalThis.foundry={utils:{randomID:()=>`epoch${++id}`}};
globalThis.game={users,messages,combats,user:GM,combat:null};globalThis.fromUuid=async u=>docs.get(u);globalThis.ui={notifications:{warn:()=>{}}};
function actor(uuid,picardia,owner,extra={}){
  const a={uuid,name:uuid,type:'character',documentName:'Actor',system:{props:{oficio:'Sabio',temple:4,sentir:2,picardia,neque:1,aguante:2,newen:3,manifestacion_activa:0,...extra}},testUserPermission:u=>u.id===owner,async update(change){for(const [k,v] of Object.entries(change)){assert.equal(k,'system.props.manifestacion_activa');this.system.props.manifestacion_activa=v}}};docs.set(uuid,a);return a;
}
function combat(name,actors){const flags={};const c={uuid:'Combat.'+name,documentName:'Combat',started:true,combatants:actors.map((a,i)=>({id:`c${i}`,actor:a,defeated:false})),getFlag:(m,k)=>flags[k],async setFlag(m,k,v){flags[k]=structuredClone(v)}};docs.set(c.uuid,c);combats.set(c.uuid,c);game.combat=c;return c;}
const A=actor('Actor.A',4,'p',{manifestacion_activa:2}),B=actor('Actor.B',1,'q'),C=actor('Scene.S.Token.C.Actor.C',3,'p');
const rival={type:'character',uuid:'Actor.R',name:'Rival',system:{props:{peso:4}}};
const c=combat('test',[A,B,C,rival,A]);const marker=createRoundMarker({moduleId:M,socket:()=>null,getActorName:a=>a.name});
const state=()=>c.getFlag(M,F);const req=(kind,data={})=>marker.requestGM({combatUuid:c.uuid,epoch:state().epoch,round:state().round,kind,...data});
const reserve=(a,actionId,userId,initiator='kona')=>req('reserve',{actorUuid:a.uuid,actionId,userId,initiator});
function finalCard(actionId,a,u,ctx,helper=null){const flags={action:{actionId,actorUuid:a.uuid,ownerUserId:u.id,state:'resolved',roundMarker:ctx,intervention:helper?'prestarRopa':null,helperActorUuid:helper?.uuid??null}};const m={id:'m-'+actionId,author:u,getFlag:(_,k)=>flags[k]};messages.set(m.id,m);return m;}
async function resolve(actionId,a,u,ctx,helper){const m=finalCard(actionId,a,u,ctx,helper);return req('finish',{messageId:m.id});}
const passed=[];function pass(s){passed.push(s);console.log('PASS',s)}
await marker.reconcile(c);assert.equal(state().round,1);assert.deepEqual(marker.rows(c).map(r=>r.uuid),[A.uuid,C.uuid,B.uuid]);pass('order Picardía; excludes rivals; deduplicates linked UUID; keeps synthetic actor');
assert.equal((await reserve(A,'bad','q')).ok,false);pass('ownership validation');
let x=await reserve(B,'b1','q');assert(x.ok);assert.equal(state().used.length,0);assert.equal((await reserve(B,'b2','q')).ok,false);assert.equal(state().round,1);pass('out-of-order action reserves without spending; duplicate pending blocked');
assert((await req('helper',{actionId:'b1',actorUuid:A.uuid,userId:'p',leadUuid:B.uuid,leadUserId:'q'})).ok);assert.equal((await reserve(A,'a1','p')).ok,false);assert.equal((await req('helper',{actionId:'b1',actorUuid:C.uuid,userId:'p',leadUuid:B.uuid,leadUserId:'q'})).ok,false);pass('one collaborator; helper cannot spend twice');
assert((await resolve('b1',B,Q,x.context,A)).ok);assert.deepEqual(new Set(state().used),new Set([A.uuid,B.uuid]));assert.equal(state().round,1);assert.equal((await req('finish',{messageId:'m-b1'})).ok,false);pass('resolved chat registers both exactly once');
assert.equal((await reserve(A,'extra','p')).ok,false);x=await reserve(A,'def','p','rival');assert(x.ok);assert((await resolve('def',A,P,x.context)).ok);assert.equal(state().used.length,2);pass('defense allowed after acting, no renewed action');
x=await reserve(C,'cancel','p');assert(x.ok);assert((await req('release',{actionId:'cancel',actorUuid:C.uuid,userId:'p'})).ok);assert.equal(state().used.length,2);pass('cancel does not mark used');
x=await reserve(C,'c1','p');assert(x.ok);const late=x.context;finalCard('c1',C,P,x.context);const reload=createRoundMarker({moduleId:M,socket:()=>null,getActorName:a=>a.name});await reload.reconcile(c);assert.equal(state().round,2);assert.equal(state().used.length,0);assert.equal(A.system.props.manifestacion_activa,2);assert.equal((await marker.requestGM({...late,kind:'finish',messageId:'m-c1'})).ok,false);pass('reload recovers resolved receipt; automatic next cycle; stale receipt rejected; manifestation sustained');
// Gracia activation is explicit completion if no further opposition. Never counts just from card creation.
const ctx2=marker.context(A);const gm2={id:'g2',author:P,getFlag:(_,k)=>k==='gracia'?{actorUuid:A.uuid,roundMarker:ctx2}:undefined};messages.set(gm2.id,gm2);assert.equal(state().used.length,0);assert((await req('grace',{actorUuid:A.uuid,userId:'p',messageId:'g2'})).ok);assert.equal((await req('grace',{actorUuid:A.uuid,userId:'p',messageId:'g2'})).ok,false);pass('grace explicit completion; repeated click rejected');
x=await reserve(B,'b2','q','rival');assert(x.ok);assert((await resolve('b2',B,Q,x.context)).ok);assert(state().used.includes(B.uuid));pass('first forced exchange counts as participation');
await marker.manual(c,'mark',C.uuid);assert.equal(state().round,3);assert.equal(A.system.props.manifestacion_activa,2);
// Join mid-cycle and incapacitated participant.
const D=actor('Actor.D',2,'p');c.combatants.push({id:'d',actor:D,defeated:false});await marker.reconcile(c);C.system.props.aguante=0;await marker.reconcile(c);assert(marker.rows(c).find(r=>r.uuid===C.uuid).out);
for(const a of [A,B,D])await marker.manual(c,'mark',a.uuid);assert.equal(state().round,4);assert.equal(A.system.props.manifestacion_activa,2);pass('join mid-round provisional; incapacitated excluded; no reset manifestation');
// pending reactive must finish before rollover; prevent automatic fifth.
x=await reserve(B,'late-defense','q','rival');assert(x.ok);await marker.manual(c,'mark',A.uuid);await marker.manual(c,'mark',D.uuid);assert.equal(state().ended,false);assert((await resolve('late-defense',B,Q,x.context)).ok);assert.equal(state().round,4);assert(state().ended);assert.equal(A.system.props.manifestacion_activa,0);assert.equal(A.system.props.newen,3);assert.equal(A.system.props.aguante,2);assert.equal(state().cleanupPending.length,0);assert.equal((await reserve(A,'fifth','p')).ok,false);pass('round 4 closes; waits pending; clears only manifestation; no fifth');
// fresh combat early close; manual correction in current cycle; noncombat flow untouched.
c.started=false;A.system.props.manifestacion_activa=3;const c2=combat('early',[A,B]);await marker.reconcile(c2);await marker.manual(c2,'mark',A.uuid);await marker.manual(c2,'unmark',A.uuid);assert.equal(c2.getFlag(M,F).used.length,0);await marker.manual(c2,'end');assert(c2.getFlag(M,F).ended);assert.equal(A.system.props.manifestacion_activa,0);pass('manual correction and early close');
c2.started=false;
const c3=combat('concurrent',[A,B,D]);await marker.reconcile(c3);
const sc=()=>c3.getFlag(M,F);const ask=(kind,data)=>marker.requestGM({combatUuid:c3.uuid,epoch:sc().epoch,round:sc().round,kind,...data});
const p0=await Promise.all([ask('reserve',{actorUuid:A.uuid,actionId:'rA1',userId:'p',initiator:'kona'}),ask('reserve',{actorUuid:A.uuid,actionId:'rA2',userId:'p',initiator:'kona'})]);assert.equal(p0.filter(r=>r.ok).length,1);const aId=sc().pending[0].id;
const p1=await ask('reserve',{actorUuid:B.uuid,actionId:'rB1',userId:'q',initiator:'kona'});assert(p1.ok);
const p2=await Promise.all([ask('helper',{actionId:aId,actorUuid:D.uuid,userId:'p',leadUuid:A.uuid,leadUserId:'p'}),ask('helper',{actionId:'rB1',actorUuid:D.uuid,userId:'p',leadUuid:B.uuid,leadUserId:'q'})]);assert.equal(p2.filter(r=>r.ok).length,1);pass('simultaneous requests serialized; helper cannot join two actions');
const bad=finalCard(aId,A,Q,p0.find(r=>r.ok).context);assert.equal((await ask('finish',{messageId:bad.id})).ok,false);assert.equal(sc().used.length,0);pass('wrong-author chat cannot consume participation');
game.combat=null;assert.deepEqual(await marker.reserve(A,'outside','kona'),{ok:true,context:null});pass('out-of-combat path untouched');
console.log(`TOTAL ${passed.length} PASS · simulated document/socket authority, not Foundry runtime`);
