#!/usr/bin/env python3
"""Reproduce LAB.4 from the exact verified LAB.3 distribution. No world writes."""
import hashlib, json, pathlib, sys, zipfile, subprocess
ROOT=pathlib.Path(__file__).resolve().parent
BASE_SHA='f9f6d7c63d2841beaf174e8cf7696e0b5070bf8ad7497ab230f6b78f3ab629bf'
sha=lambda x:hashlib.sha256(x).hexdigest()
base=pathlib.Path(sys.argv[1]); dest=pathlib.Path(sys.argv[2]); assert sha(base.read_bytes())==BASE_SHA
with zipfile.ZipFile(base) as z:
    assert z.testzip() is None
    entries={i.filename:(i,z.read(i)) for i in z.infolist()}
s=entries['bridge.js'][1].decode()
changes=[]
def rep(old,new,label):
    global s
    assert s.count(old)==1,(label,s.count(old))
    s=s.replace(old,new,1);changes.append(label)
rep('/* MELIAZ LAB D2 — compatibility guard;', 'import {createRoundMarker} from "./round-marker.js";\n\n/* MELIAZ LAB D2 — compatibility guard;', 'import marker module')
rep('let meliazSocket = null;\nlet clickListenerInstalled = false;', 'let meliazSocket = null;\nconst roundMarker = createRoundMarker({moduleId:MODULE_ID,socket:()=>meliazSocket,getActorName:getActorDisplayName});\nroundMarker.install();\nlet clickListenerInstalled = false;', 'install marker within LAB guard')
rep('    meliazSocket.register("applyPesoLoss", applyPesoLossLocal);', '    meliazSocket.register("applyPesoLoss", applyPesoLossLocal);\n    roundMarker.register(meliazSocket);', 'register marker SocketLib authority')
# Manifestation level match master exact (no cost change).
rep('2: { label: "II · Excepcional", cost: 2, costText: "la mitad", battleBonus: 1 }', '2: { label: "II · Excepcional", cost: 2, costText: "la mitad", battleBonus: 2 }', 'Manifestation II correction')
rep('3: { label: "III · Legendaria", cost: 3, costText: "tres partes", battleBonus: 1 }', '3: { label: "III · Legendaria", cost: 3, costText: "tres partes", battleBonus: 3 }', 'Manifestation III correction')
rep('`Manifestación ${MANIFESTACION_DATA[grade]?.label ?? grade} activa · segundo clic para limpiar`','`Manifestación ${MANIFESTACION_DATA[grade]?.label ?? grade} activa · ${roundMarker.locked(actor) ? "hasta el final del combate" : "segundo clic para limpiar"}`','Manifestation tooltip')
rep('  const active = Number(actor.system?.props?.[activeKey] ?? 0);\n\n  if (!active) {','  const active = Number(actor.system?.props?.[activeKey] ?? 0);\n\n  if (active && roundMarker.locked(actor)) {\n    ui.notifications.info("MELIAZ: la Manifestación permanece activa hasta el final del combate.");\n    return;\n  }\n  if (!active) {','lock manual manifestation clear in tracked combat')
old='La Manifestación activa aporta +1 a las Capacidades durante el enfrentamiento; su grado determina el alcance.'
assert s.count(old)==2
s=s.replace(old,'La Manifestación aporta +1 por nivel a cualquier Capacidad utilizada durante el enfrentamiento, hasta el final del combate.');changes.append('Manifestation chat text both copies')
# Use exact original actions and cards; create reservation after all opposition dialogs.
rep('  const actionId = makeActionId();\n  const speaker = ChatMessage.getSpeaker({ actor });', '''  const actionId = makeActionId();
  const markerReservation = await roundMarker.reserve(actor,actionId,intercambio?.initiator);
  if (!markerReservation.ok) {ui.notifications.warn(markerReservation.message);return;}
  const markerContext = markerReservation.context;
  const speaker = ChatMessage.getSpeaker({ actor });''','reserve after opposition selection')
rep('  const message = await ChatMessage.create({\n    user: game.user.id,\n    speaker,\n    content: `\n      <div>\n        <h3>${intercambio', '  let message;\n  try { message = await ChatMessage.create({\n    user: game.user.id,\n    speaker,\n    content: `\n      <div>\n        <h3>${intercambio','guard creation')
rep('          actionId,\n          state: "pending",\n          ownerUserId: game.user.id,','          actionId,\n          state: "pending",\n          roundMarker: markerContext,\n          ownerUserId: game.user.id,','persist reservation context in chat')
rep('  });\n\n\n  if (selfExaltar) {','  }); } catch (err) {\n    await roundMarker.release(markerContext,actorUuid,actionId);\n    throw err;\n  }\n\n  if (selfExaltar) {','release on failed chat create')
rep('  const action = {\n    actionId,\n    ownerUserId: game.user.id,','  const action = {\n    actionId,\n    roundMarker: markerContext,\n    ownerUserId: game.user.id,','attach round context to pending action')
rep('  if (!claimIntervention(action, "prestarRopa")) {\n    return { ok: false, message: "La acción ya no acepta intervenciones." };\n  }','''  const markerHelper = await roundMarker.helper(action,payload);
  if (!markerHelper.ok) return markerHelper;
  if (!claimIntervention(action, "prestarRopa")) {
    await roundMarker.dropHelper(action,payload.helperActorUuid);
    return { ok: false, message: "La acción ya no acepta intervenciones." };
  }''','reserve helper before claiming intervention')
rep('  action.state = "resolved";\n  cleanupAction(action);','  action.state = "resolved";\n  cleanupAction(action);\n  if (message) await roundMarker.finished(action,message);','commit only persisted resolution')
# Gracia activation is not an automatic roll. Preserve card with context and explicit completed affordance.
rep('  const newenAfter = newenBefore - cost;\n\n  await actor.update({\n    "system.props.newen": newenAfter\n  });\n\n  const copyText = [\n    "MELIAZ · GRACIA",', '''  const newenAfter = newenBefore - cost;
  const markerContext = roundMarker.context(actor);
  const markerCheck = roundMarker.canPrepare(actor);
  if (!markerCheck.ok) {ui.notifications.warn(markerCheck.message);return;}
  await actor.update({
    "system.props.newen": newenAfter
  });

  const copyText = [
    "MELIAZ · GRACIA",''','Gracia capture context without extra roll')
rep('          graciaName,\n          porte,\n          porteLabel:', '          graciaName,\n          roundMarker: markerContext,\n          porte,\n          porteLabel:', 'Gracia receipt context')
# ensure exact source/sheet integrity
module=json.loads(entries['module.json'][1]);module['version']='0.24.206-lab.4';module['description']+=' Marcador MELIAZ de cuatro rondas, prototipo de contabilidad; D3 pendiente.'
new={'bridge.js':s.encode(),'module.json':(json.dumps(module,ensure_ascii=False,indent=2)+'\n').encode(),'round-marker.js':(ROOT/'round-marker.js').read_bytes()}
for name in ['bridge.js','round-marker.js']:
    (ROOT/name).write_bytes(new[name]); subprocess.run(['node','--check',str(ROOT/name)],check=True)
test=subprocess.run(['node',str(ROOT/'test_round_marker.mjs')],check=True,text=True,capture_output=True); print(test.stdout,end=''); (ROOT/'test_report.txt').write_text(test.stdout)
report={'tests':test.stdout.splitlines(),'version':module['version'],'baseSha256':BASE_SHA,'anchors':changes,'sheetSha256':sha(entries['assets/hoja-kona-experimental-v2.webp'][1]),'state':'D2_SYNTAX_AND_SIMULATION_PASS; D3 pending','newFiles':['round-marker.js','QA_LAB4_MARKER.json'],'changedExisting':['bridge.js','module.json']}
assert report['sheetSha256']=='fb9d84709b9303457f0c06efd6a9c8364c62fb2b03870358b3f73c940b9aeafe'
new['QA_LAB4_MARKER.json']=(json.dumps(report,ensure_ascii=False,indent=2)+'\n').encode()
with zipfile.ZipFile(dest,'w',zipfile.ZIP_DEFLATED,compresslevel=9) as z:
    for name,(info,data) in entries.items():z.writestr(info,new.get(name,data))
    for name,data in new.items():
        if name not in entries:z.writestr(name,data)
with zipfile.ZipFile(dest) as z:
    assert z.testzip() is None
    assert set(z.namelist())==set(entries)|set(new)
    for name,(_,data) in entries.items():
        if name not in new:assert z.read(name)==data,name
    assert z.read('bridge.js')==new['bridge.js'] and z.read('round-marker.js')==new['round-marker.js']
print(json.dumps({'path':str(dest),'bytes':dest.stat().st_size,'sha256':sha(dest.read_bytes()),'members':len(entries)+2,'patches':changes},ensure_ascii=False,indent=2))
