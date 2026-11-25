/* MELIAZ LAB.4 — marcador, no motor de resolución. */
export function createRoundMarker({moduleId, socket, getActorName}) {
  const FLAG = 'roundMarkerV1';
  const RPC = 'roundMarkerRequestV1';
  const MAX = 4;
  const queues = new Map();
  let installed = false, collapsed = false, renderQueued = false;
  const clone = v => JSON.parse(JSON.stringify(v));
  const number = v => v !== null && v !== undefined && v !== '' && Number.isFinite(Number(v));
  const fail = message => ({ok:false,message});
  const gm = () => Array.from(game.users ?? []).filter(u=>u.active && u.isGM).sort((a,b)=>String(a.id).localeCompare(String(b.id)))[0];
  const authority = () => Boolean(game.user?.isGM && gm()?.id===game.user.id);
  const stateOf = c => c?.getFlag?.(moduleId,FLAG) ?? null;
  const isKona = a => {
    const p=a?.system?.props;
    return a?.type==='character' && !!p && !!String(p.oficio??'').trim() &&
      ['temple','picardia','neque'].every(k=>number(p[k])) && number(p.sentir??p.onda) &&
      !['HipRivalTpl00001','HipAnimalTpl00001','HipCreatureTpl01','HipObstacTpl0001'].includes(String(a.system?.template??''));
  };
  function rows(c){
    const byUuid=new Map();
    for(const b of Array.from(c?.combatants??[])){
      const a=b.actor;if(!isKona(a)||!a.uuid)continue;
      const p=a.system.props;
      const row={uuid:a.uuid,actor:a,id:b.id,name:getActorName(a),picardia:Number(p.picardia),
        out:Boolean(b.defeated)||(number(p.aguante)&&Number(p.aguante)<=0)};
      const previous=byUuid.get(a.uuid);
      if(!previous||previous.out&&!row.out)byUuid.set(a.uuid,row);
    }
    return [...byUuid.values()].sort((a,b)=>b.picardia-a.picardia||a.name.localeCompare(b.name,'es')||a.uuid.localeCompare(b.uuid));
  }
  function context(a){
    const c=game.combat;if(!c?.started||!rows(c).some(r=>r.uuid===a?.uuid))return null;
    const s=stateOf(c);
    return {combatUuid:c.uuid,epoch:s?.epoch??null,round:s?.round??null,ended:s?.ended===true};
  }
  const locked = a => {const x=context(a);return !!x&&!x.ended;};
  function queue(c, task){
    const key=c.uuid;
    const next=(queues.get(key)??Promise.resolve()).catch(()=>{}).then(task);
    queues.set(key,next);
    next.finally(()=>{if(queues.get(key)===next)queues.delete(key)}).catch(()=>{});
    return next;
  }
  function fresh(c){return {version:1,epoch:foundry.utils.randomID(),round:1,ended:false,used:[],pending:[],events:[],participants:rows(c).map(r=>r.uuid),cleanupPending:[]};}
  function syncParticipants(s,c){s.participants=[...new Set([...s.participants,...rows(c).map(r=>r.uuid)])];}
  function isCurrent(s,x){return !!s&&!s.ended&&s.epoch===x?.epoch&&s.round===x?.round;}
  function addUsed(s,u){if(!s.used.includes(u))s.used.push(u);}
  const outstanding = (s,u) => s.pending.some(p=>p.actorUuid===u||p.helperUuid===u);
  function close(s,reason){s.ended=true;s.reason=reason;s.cleanupPending=[...s.participants];s.pending=[];}
  function advance(s,c){
    if(s.ended||s.pending.length)return;
    const all=rows(c);const active=all.filter(r=>!r.out);
    if(!all.length)return;
    if(!active.length){close(s,'Sin Kona habilitados');return;}
    if(!active.every(r=>s.used.includes(r.uuid)))return;
    if(s.round>=MAX){close(s,'Cuarta ronda completada');return;}
    s.round++;s.used=[];
  }
  async function cleanOne(uuid,c){
    const actor=await fromUuid(uuid);
    if(!actor||actor.documentName!=='Actor')return true;
    // Never clear a manifestation from a different simultaneous active combat.
    const other=Array.from(game.combats??[]).some(o=>o.uuid!==c.uuid&&o.started&&!stateOf(o)?.ended&&rows(o).some(r=>r.uuid===uuid));
    if(other){console.warn('MELIAZ: Manifestación conservada por otro combate activo',uuid);return true;}
    if(Number(actor.system?.props?.manifestacion_activa??0)>0){
      await actor.update({'system.props.manifestacion_activa':0});
      if(actor.sheet?.rendered)actor.sheet.render(false);
    }
    return true;
  }
  async function persist(c,s,old){
    if(JSON.stringify(s)!==JSON.stringify(old))await c.setFlag(moduleId,FLAG,s);
    if(s.ended&&s.cleanupPending.length){
      const remain=[];
      for(const uuid of s.cleanupPending){try{if(!await cleanOne(uuid,c))remain.push(uuid)}catch(e){console.error('MELIAZ: cierre Manifestación',uuid,e);remain.push(uuid)}}
      if(remain.length!==s.cleanupPending.length){s={...s,cleanupPending:remain};await c.setFlag(moduleId,FLAG,s)}
    }
    scheduleRender();return s;
  }
  function permitted(row,userId){const u=game.users?.get?.(userId);return !!u&&!!row&&Boolean(u.isGM||row.actor.testUserPermission?.(u,'OWNER'));}
  function validActionMessage(message,p,ctx){
    const a=message?.getFlag?.(moduleId,'action');const x=a?.roundMarker;
    return a?.state==='resolved'&&a.actionId===p.id&&a.actorUuid===p.actorUuid&&a.ownerUserId===p.userId&&
      (message.author?.id??message.user?.id??message.user)===p.userId&&
      x?.combatUuid===ctx.combatUuid&&x.epoch===ctx.epoch&&x.round===ctx.round;
  }
  async function resolveMessage(c,s,message){
    const a=message?.getFlag?.(moduleId,'action');const ctx=a?.roundMarker;
    if(!isCurrent(s,ctx)||ctx.combatUuid!==c.uuid)return false;
    const p=s.pending.find(v=>v.id===a.actionId);if(!p||!validActionMessage(message,p,ctx))return false;
    // Receipt is idempotent: the reservation is consumed only by the persisted final card.
    addUsed(s,p.actorUuid);
    if(p.helperUuid&&a.intervention==='prestarRopa'&&a.helperActorUuid===p.helperUuid)addUsed(s,p.helperUuid);
    s.pending=s.pending.filter(v=>v.id!==p.id);
    s.events.push({id:p.id,round:s.round,actor:p.actorUuid,helper:a.helperActorUuid??null,messageId:message.id});
    return true;
  }
  async function requestGM(payload){
    if(!authority())return fail('No hay autoridad GM disponible para el marcador.');
    const c=await fromUuid(payload.combatUuid);
    if(!c||c.documentName!=='Combat'||!c.started)return fail('El combate ya no está activo.');
    return queue(c,async()=>{
      const old=stateOf(c);const s=old?clone(old):fresh(c);syncParticipants(s,c);
      const row=rows(c).find(r=>r.uuid===payload.actorUuid);
      const reply=async(value,doAdvance=true)=>{if(doAdvance)advance(s,c);await persist(c,s,old);return value;};
      const ctx={combatUuid:c.uuid,epoch:s.epoch,round:s.round};
      if(payload.kind==='reserve'){
        if(s.ended)return fail('El marcador ya terminó. Cierra el combate en Foundry.');
        if(payload.epoch!==null&&payload.epoch!==s.epoch||payload.round!==null&&payload.round!==s.round)return fail('La ronda cambió. Vuelve a declarar la acción.');
        if(!permitted(row,payload.userId))return fail('El Kona no está disponible para este usuario.');
        const reactive=payload.initiator==='rival';
        if(row.out&&!reactive)return fail('El Kona está incapacitado o fuera de combate.');
        if(outstanding(s,row.uuid))return fail('El Kona ya participa en una acción pendiente.');
        if(s.used.includes(row.uuid)&&!reactive)return fail('El Kona ya actuó en esta ronda.');
        if(typeof payload.actionId!=='string'||s.pending.some(p=>p.id===payload.actionId)||s.events.some(e=>e.id===payload.actionId))return fail('Acción duplicada.');
        s.pending.push({id:payload.actionId,actorUuid:row.uuid,userId:payload.userId,helperUuid:null,reactive,createdAt:Date.now()});
        return reply({ok:true,context:ctx},false);
      }
      if(!isCurrent(s,payload))return fail('Esta acción pertenece a otra ronda o el combate terminó.');
      const p=s.pending.find(x=>x.id===payload.actionId);
      if(payload.kind==='helper'){
        if(!p||p.actorUuid!==payload.leadUuid||p.userId!==payload.leadUserId)return fail('La acción ya no está pendiente.');
        if(!permitted(row,payload.userId)||row.out||row.uuid===p.actorUuid||s.used.includes(row.uuid)||outstanding(s,row.uuid)||p.helperUuid)return fail('Este Kona no puede Prestar ropa en esta ronda.');
        p.helperUuid=row.uuid;p.helperUserId=payload.userId;
        return reply({ok:true},false);
      }
      if(payload.kind==='dropHelper'){
        if(p&&p.userId===payload.userId&&p.helperUuid===payload.helperUuid){p.helperUuid=null;p.helperUserId=null;return reply({ok:true},false)}
        return fail('No hay colaboración que liberar.');
      }
      if(payload.kind==='release'){
        if(!p||p.userId!==payload.userId||p.actorUuid!==payload.actorUuid)return fail('Reserva ya cerrada.');
        s.pending=s.pending.filter(x=>x.id!==p.id);return reply({ok:true});
      }
      if(payload.kind==='finish'){
        const m=game.messages.get(payload.messageId);
        if(!await resolveMessage(c,s,m))return fail('La tarjeta aún no está resuelta o ya se registró.');
        return reply({ok:true});
      }
      if(payload.kind==='grace'){
        const m=game.messages.get(payload.messageId),g=m?.getFlag?.(moduleId,'gracia');const x=g?.roundMarker;
        if(!permitted(row,payload.userId)||row.out||!g||g.actorUuid!==row.uuid||(m.author?.id??m.user?.id??m.user)!==payload.userId||!isCurrent(s,x)||x.combatUuid!==c.uuid)return fail('La Gracia no corresponde a esta ronda.');
        if(s.used.includes(row.uuid)||outstanding(s,row.uuid))return fail('El Kona ya actuó o está resolviendo una acción.');
        const id='grace:'+m.id;if(s.events.some(e=>e.id===id))return fail('Gracia ya registrada.');
        addUsed(s,row.uuid);s.events.push({id,round:s.round,actor:row.uuid,messageId:m.id});return reply({ok:true});
      }
      return fail('Operación de marcador desconocida.');
    });
  }
  async function call(payload){
    const master=gm();if(!master)return fail('No hay GM activo para sincronizar el marcador.');
    try{
      if(master.id===game.user.id)return await requestGM(payload);
      const s=socket();if(!s)return fail('SocketLib no está disponible para el marcador.');
      return await s.executeAsUser(RPC,master.id,payload);
    }catch(e){console.error('MELIAZ: marcador',e);return fail('No se confirmó el estado de ronda. Revisa el marcador con Dirección.');}
  }
  function canPrepare(actor){
    const ctx=context(actor);if(!ctx)return {ok:true};
    const c=game.combat,s=stateOf(c),r=rows(c).find(row=>row.uuid===actor.uuid);
    if(!s||s.ended)return fail('El marcador no está activo.');
    if(!r||r.out||s.used.includes(actor.uuid)||outstanding(s,actor.uuid))return fail('El Kona no tiene acción disponible en esta ronda.');
    return {ok:true};
  }
  async function reserve(actor,actionId,initiator){
    const ctx=context(actor);if(!ctx)return {ok:true,context:null};
    return call({...ctx,kind:'reserve',actorUuid:actor.uuid,userId:game.user.id,actionId,initiator});
  }
  async function helper(action,payload){
    if(!action.roundMarker)return {ok:true};
    return call({...action.roundMarker,kind:'helper',actorUuid:payload.helperActorUuid,userId:payload.helperUserId,leadUuid:action.actorUuid,leadUserId:action.ownerUserId,actionId:action.actionId});
  }
  async function dropHelper(action,uuid){if(action.roundMarker)return call({...action.roundMarker,kind:'dropHelper',actionId:action.actionId,userId:action.ownerUserId,helperUuid:uuid});}
  async function release(ctx,actorUuid,actionId){if(ctx)return call({...ctx,kind:'release',actorUuid,actionId,userId:game.user.id});}
  async function finished(action,message){if(action.roundMarker&&message)return call({...action.roundMarker,kind:'finish',messageId:message.id});}
  async function reconcile(c){
    if(!authority()||!c)return;
    await queue(c,async()=>{
      const old=stateOf(c);if(!old&&(!c.started||game.combat?.uuid!==c.uuid))return;
      const s=old?clone(old):fresh(c);syncParticipants(s,c);
      if(!c.started&&!s.ended)close(s,'Combate cerrado en Foundry');
      if(!s.ended){
        const pendingIds=new Set(s.pending.map(p=>p.id));
        for(const m of Array.from(game.messages??[])){
          const a=m.getFlag?.(moduleId,'action');
          if(pendingIds.has(a?.actionId)&&a?.roundMarker?.combatUuid===c.uuid&&a.state==='resolved')await resolveMessage(c,s,m);
        }
        advance(s,c);
      }
      await persist(c,s,old);
    });
  }
  async function manual(c,kind,uuid){
    if(!authority())return;
    await queue(c,async()=>{
      const old=stateOf(c);if(!old||old.ended)return;
      const s=clone(old);
      if(kind==='end'){
        if(s.pending.length){ui.notifications.warn('Resuelve o libera las acciones pendientes antes de cerrar.');return;}
        close(s,'Cerrado por Dirección');
      }else if(kind==='releaseAll'){
        // Recovery only: never changes dice, Newén, Aguante or previously registered actions.
        s.pending=[];
      }else{
        const row=rows(c).find(r=>r.uuid===uuid);if(!row||row.out||outstanding(s,uuid))return;
        if(kind==='mark')addUsed(s,uuid);
        else if(kind==='unmark')s.used=s.used.filter(u=>u!==uuid);
      }
      advance(s,c);await persist(c,s,old);
    });
  }
  function textNode(tag,text,className){const e=document.createElement(tag);e.textContent=text;if(className)e.className=className;return e;}
  function button(text,fn){const e=textNode('button',text);e.type='button';e.addEventListener('click',async()=>{e.disabled=true;try{await fn()}catch(err){console.error('MELIAZ marcador',err);ui.notifications.error('No se confirmó el marcador.')}finally{e.disabled=false;}});return e;}
  async function confirm(title,content){return foundry.applications.api.DialogV2.confirm({window:{title},content:`<p>${content}</p>`,yes:{label:'Confirmar'},no:{label:'Cancelar'},rejectClose:false,modal:true});}
  function render(){
    renderQueued=false;
    if(!game.ready||typeof document==='undefined')return;
    const c=game.combat;const id='ha-meliaz-round-marker';let panel=document.getElementById(id);
    if(!c?.started){panel?.remove();return;}
    const s=stateOf(c);
    if(!panel){panel=document.createElement('section');panel.id=id;panel.setAttribute('aria-label','Marcador MELIAZ');document.body.appendChild(panel);}
    const sidebar=document.querySelector('#sidebar');const rect=sidebar?.getBoundingClientRect?.();
    panel.style.right=`${rect&&rect.width>50&&rect.left<innerWidth?Math.min(Math.max(12,innerWidth-rect.left+12),Math.max(12,innerWidth-300)):12}px`;
    panel.replaceChildren();
    const head=document.createElement('header');head.append(textNode('strong',s?.ended?'MELIAZ · Combate cerrado':`MELIAZ · Ronda ${s?.round??'…'} / ${MAX}`),button(collapsed?'+':'−',()=>{collapsed=!collapsed;scheduleRender()}));panel.append(head);
    if(collapsed)return;
    if(!s){panel.append(textNode('p','Esperando sincronización del GM.'));return;}
    if(s.ended){panel.append(textNode('p',s.reason??'Combate terminado.'),textNode('small',s.cleanupPending.length?'Manifestación: limpieza pendiente.':'Cierra el combate nativo en Foundry.'));return;}
    const rs=rows(c);const active=rs.filter(r=>!r.out);panel.append(textNode('small',`${active.filter(r=>s.used.includes(r.uuid)).length}/${active.length} acciones · orden libre`));
    for(const r of rs){
      const line=document.createElement('div');line.className='ha-round-line';const busy=outstanding(s,r.uuid);const used=s.used.includes(r.uuid);
      line.append(textNode('b',String(r.picardia),'ha-round-picardia'),textNode('span',r.name,'ha-round-name'));
      const state=r.out?'Fuera':busy?'Pendiente':used?'Actuó ✓':'Disponible';line.append(textNode('small',state,used?'ha-round-used':''));
      if(authority()&&!busy&&!r.out)line.append(button(used?'↶':'✓',()=>manual(c,used?'unmark':'mark',r.uuid)));
      panel.append(line);
    }
    if(!rs.length)panel.append(textNode('p','Añade Kona al combate nativo.'));
    if(authority()){
      const foot=document.createElement('footer');foot.append(button('Cerrar',async()=>{if(await confirm('Cerrar combate MELIAZ','Finalizar este combate y sus Manifestaciones activas.'))await manual(c,'end')}));
      if(s.pending.length)foot.append(button('Liberar pendientes',async()=>{if(await confirm('Recuperación de marcador','Sólo si las acciones pendientes han quedado interrumpidas. No revierte sus efectos ni vuelve a tirar.'))await manual(c,'releaseAll')}));
      panel.append(foot);
    }
    panel.append(textNode('small','Actúa desde la hoja Kona.','ha-round-note'));
  }
  function scheduleRender(){if(renderQueued||typeof document==='undefined')return;renderQueued=true;requestAnimationFrame(render);}
  function guarded(fn){return (...args)=>{scheduleRender();Promise.resolve(fn(...args)).catch(err=>{console.error('MELIAZ marcador',err);});};}
  function install(){
    if(installed)return;installed=true;
    Hooks.once('ready',()=>{
      const style=document.createElement('style');style.id='ha-round-marker-style';style.textContent=`#ha-meliaz-round-marker{position:fixed;top:90px;right:12px;z-index:90;width:264px;max-height:55vh;overflow:auto;padding:9px;color:var(--color-text-primary,#f3e7d3);background:var(--color-cool-5,#25221e);border:1px solid #99744b;border-radius:6px;box-shadow:0 3px 12px #0007;font-size:12px}#ha-meliaz-round-marker header,#ha-meliaz-round-marker footer{display:flex;align-items:center;justify-content:space-between;gap:5px}#ha-meliaz-round-marker button{font-size:11px;min-height:20px;line-height:1.2;padding:3px 5px;width:auto}#ha-meliaz-round-marker .ha-round-line{display:flex;align-items:center;gap:5px;border-top:1px solid #99744b55;padding:5px 0}#ha-meliaz-round-marker .ha-round-name{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis}#ha-meliaz-round-marker .ha-round-picardia{width:20px;text-align:center}#ha-meliaz-round-marker .ha-round-used{opacity:.65}#ha-meliaz-round-marker .ha-round-note{display:block;margin-top:6px;opacity:.8}`;
      if(!document.getElementById(style.id))document.head.append(style);
      scheduleRender();void reconcile(game.combat).catch(console.error);
      window.addEventListener('resize',scheduleRender);
    });
    Hooks.on('updateCombat',guarded(c=>reconcile(c)));
    for(const event of ['createCombatant','updateCombatant','deleteCombatant'])Hooks.on(event,guarded(b=>reconcile(b.parent)));
    Hooks.on('canvasReady',guarded(()=>reconcile(game.combat)));
    Hooks.on('updateActor',guarded(a=>{const c=game.combat;if(c?.started&&rows(c).some(r=>r.uuid===a.uuid))return reconcile(c)}));
    Hooks.on('updateToken',guarded(t=>{const c=game.combat;if(c?.started&&rows(c).some(r=>r.uuid===t.actor?.uuid))return reconcile(c)}));
    Hooks.on('deleteCombat',guarded(async c=>{
      if(!authority())return;const s=stateOf(c);if(!s)return;
      // If Foundry deletes the Combat document, the flag can no longer be written.
      for(const uuid of (s.ended?s.cleanupPending:s.participants))try{await cleanOne(uuid,c)}catch(e){console.error('MELIAZ: revisar Manifestación al cerrar',uuid,e);ui.notifications.warn('Revisa una Manifestación pendiente tras cerrar el combate.')}
    }));
    Hooks.on('updateChatMessage',guarded(m=>{const x=m.getFlag?.(moduleId,'action');if(x?.state==='resolved'&&x.roundMarker?.combatUuid&&authority())return fromUuid(x.roundMarker.combatUuid).then(c=>reconcile(c))}));
    Hooks.on('renderCombatTracker',scheduleRender);
    Hooks.on('renderCombatTrackerV2',scheduleRender);
    Hooks.on('renderChatMessageHTML',(m,html)=>{
      const g=m.getFlag?.(moduleId,'gracia');const x=g?.roundMarker;
      const root=html?.querySelector?html:html?.[0];if(!x||!root?.querySelector||root.querySelector('[data-ha-round-grace]'))return;
      const c=game.combat,s=stateOf(c);if(c?.uuid!==x.combatUuid||!isCurrent(s,x))return;
      const r=rows(c).find(r=>r.uuid===g.actorUuid);
      if(!permitted(r,game.user.id)||s.used.includes(g.actorUuid)||outstanding(s,g.actorUuid))return;
      // Activation alone may be followed by an opposition roll. Confirm only when it is the complete action.
      const b=button('Registrar Gracia resuelta',async()=>{const result=await call({...x,kind:'grace',actorUuid:g.actorUuid,userId:game.user.id,messageId:m.id});if(result.ok){b.remove()}else ui.notifications.warn(result.message)});
      b.dataset.haRoundGrace='1';b.title='Sólo si no queda un Intercambio o Capacidad por resolver.';root.append(b);
    });
  }
  function register(s){s.register(RPC,requestGM);}
  return {install,register,context,locked,canPrepare,reserve,helper,dropHelper,release,finished,reconcile,manual,rows,requestGM};
}
