/** Hiperaustralis CI137 · Forge/Hipera 6 · QA en solo lectura.
 * No importa, no actualiza ni elimina documentos. Guarda reporte JSON.
 * Distingue URL histórica de accesibilidad efectiva; no promete QA visual.
 */
(async () => {
  const MODULE = 'hiperaustralis-ci137-qa6';
  const PACK = MODULE + '.ha-proto-items';
  const report = {
    schema:'hipera-ci137-forge-qa6-v01',
    runAt:new Date().toISOString(),
    foundry:game.version,
    system:game.system?.id,
    systemVersion:game.system?.version,
    world:game.world?.id,
    module:MODULE,
    readonly:true,
    check:'137 identidades, 9 carpetas, 5 plantillas, rutas gráficas y accesibilidad',
    errors:[],
    warnings:[],
    documents:{},
    paths:{},
    accessible:[],
    templateAvailability:[],
  };
  const roots = {
    own:'modules/' + MODULE + '/',
    legacy:'modules/hiperaustralis-rituales/',
    oldPrototype:'modules/hiperaustralis-compendios-prototype/'
  };
  try {
    const p=game.packs.get(PACK);
    if (!p || p.documentName !== 'Item') throw Error('Falta compendio ' + PACK);
    const res=await fetch(roots.own + 'QA/expected_137.json', {cache:'no-store'});
    if (!res.ok) throw Error('Falta manifiesto QA HTTP '+res.status);
    const expected=await res.json();
    const docs=await p.getDocuments();
    const byId=new Map(docs.map(d=>[d.id,d]));
    const seen=new Set();
    const problems=[];
    for(const e of expected.expectedIds){
      const d=byId.get(e.id);
      if(!d){problems.push({id:e.id,error:'ID ausente'});continue;}
      if(d.type !== 'equippableItem')problems.push({id:e.id,error:'tipo distinto'});
      if(d.system?.template !== e.template)problems.push({id:e.id,error:'plantilla distinta',got:d.system?.template});
      if((d.folder?.id??null) !== e.folderId)problems.push({id:e.id,error:'carpeta distinta',got:d.folder?.id});
      seen.add(e.id);
    }
    report.documents={
      expected:137,actual:docs.length,uniqueIds:byId.size,
      missingIds:expected.expectedIds.filter(e=>!byId.has(e.id)).map(e=>e.id),
      extraIds:docs.filter(d=>!seen.has(d.id)).map(d=>d.id),
      mismatches:problems
    };
    const templates=[...new Set(expected.expectedIds.map(e=>e.template))];
    report.templateAvailability=templates.map(id=>({id,worldTemplatePresent:!!game.items?.get(id)}));
    const refs=[];
    for(const d of docs){
      if(d.img)refs.push({id:d.id,field:'img',path:d.img});
      const bg=d.flags?.['hiperaustralis-sheet']?.background;
      if(bg)refs.push({id:d.id,field:'background',path:bg});
    }
    const kind=path=>path.startsWith(roots.own)?'local'
      :path.startsWith(roots.legacy)?'historical-module'
      :path.startsWith(roots.oldPrototype)?'old-prototype'
      :path.startsWith('icons/')?'stock-foundry'
      :path.startsWith('systems/')?'system'
      :/^https?:\/\//.test(path)?'url-other':'other';
    const grouped={};
    for(const ref of refs){const k=kind(ref.path);grouped[k]=(grouped[k]||0)+1;}
    report.paths={references:refs.length,groups:grouped,unique:new Set(refs.map(x=>x.path)).size};
    const urls=[...new Set(refs.map(r=>r.path))].filter(path=>kind(path)!=='other');
    for(let i=0;i<urls.length;i+=6){
      await Promise.all(urls.slice(i,i+6).map(async path=>{
        const o={path,kind:kind(path),http:null,ok:false};
        try{
          const r=await fetch(path,{cache:'no-store'});
          o.http=r.status; o.ok=r.ok;
        }catch(e){o.error=String(e);}
        report.accessible.push(o);
      }));
    }
    const bad=report.accessible.filter(x=>!x.ok);
    report.paths.failedUrlCount=bad.length;
    report.paths.failedReferences=refs.filter(x=>bad.some(y=>y.path===x.path)).length;
    if(docs.length!==137 || byId.size!==137 || problems.length)
      report.errors.push('No coincide la estructura 137/137');
    if((grouped['old-prototype']||0)!==0)
      report.errors.push('Rutas siguen apuntando al ID prototipo: colision');
    if((grouped['historical-module']||0)!==109)
      report.warnings.push('Dependencias históricas no coinciden con 109 esperadas: revisar payload y/o rewrite Forge');
    if(bad.length)report.warnings.push('No cargan '+bad.length+' URLs; revisión visual necesaria');
    if(!templates.every(id=>!!game.items?.get(id)))
      report.warnings.push('Alguna plantilla CSB no está en game.items; comprobar en hoja (puede estar en pack)');
    report.result=report.errors.length?'STRUCTURE_FAIL':
      (report.warnings.length?'STRUCTURE_PASS_WITH_DEPENDENCIES':'READONLY_PASS_VISUAL_PENDING');
    report.D3='NO ACREDITADO HASTA QA VISUAL Y FUNCIONAL EN FOUNDRY';
  }catch(e){report.errors.push(String(e));report.result='BLOCKED';}
  console.info('Hiperaustralis CI137 Hipera 6 — QA solo lectura',report);
  if(typeof globalThis.saveDataToFile==='function')
    globalThis.saveDataToFile(JSON.stringify(report,null,2),'application/json',
      'HIPERA_CI137_HIPERA6_QA_'+report.runAt.replace(/[:.]/g,'-')+'.json');
  ui.notifications?.info?.('CI137 QA: '+report.result+'. Revisa el reporte.');
})();
