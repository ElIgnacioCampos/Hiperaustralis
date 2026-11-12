const MODULE_ID = "meliaz-bridge";
const WAIT_MS = 10000;
// Prioridad de ocupación sobre las cuatro zonas nativas ya grabadas en Kona.
// No altera coordenadas: primero la zona 1, luego 3, 4 y finalmente 2.
const KONA_SLOT_PRIORITY = Object.freeze([1, 3, 4, 2]);
let KONA_TERRITORY_SETUP_PROMISE = null;

function nextKonaPrioritySlot(usedSlots, maxSlots = 4) {
  const used = usedSlots instanceof Set ? usedSlots : new Set(Array.from(usedSlots ?? [], Number));
  return KONA_SLOT_PRIORITY.find(slot => slot <= maxSlots && !used.has(slot)) ?? null;
}

/* mb208 · AUDITORÍA DE MÁRGENES
   IZQUIERDA: Nombre + Auspicio comienzan en x=5.8%.
   DERECHA: Cultura + Oficio + Gracia se alinean por su BORDE IZQUIERDO con
            los rótulos impresos de la lámina. Se desplazan claramente hacia
            el margen derecho; el ornamento exterior fija el límite visual.
   El menú visible de Oficio hereda exactamente la caja de Oficio.
*/

/* mb207 · GRAMÁTICA DE HOJA HIPERAUSTRALIS
   TEMPLE   → Rituales + Reliquias            [drag & drop]
   SENTIR   → Instrumentos                    [drag & drop]
   PICARDÍA → Lenguas                         [drag & drop]
   ÑEQUE    → Arma + Armadura                 [drag & drop]
   CARIÑOS  → drag & drop (implementación actual v2).
   LENGUAS  → drag & drop (implementación actual v2).
   No revertir estos dos campos a escritura directa ni alterar sus hitboxes.
*/

const CAP_LABELS = {
  temple: "Temple",
  sentir: "Sentir",
  onda: "Sentir", // legado: compatibilidad con hojas pre-v20
  picardia: "Picardía",
  neque: "Ñeque"
};

const GRACIA_LABELS = {
  pewma: "Pewma",
  entonar: "Entonar",
  franquear: "Franquear",
  arremetida: "Arremetida"
};

const PORTE_DATA = {
  1: { label: "I · Desafiante", cost: 1, costText: "una parte" },
  2: { label: "II · Excepcional", cost: 2, costText: "la mitad" },
  3: { label: "III · Legendario", cost: 3, costText: "tres partes" }
};

const MANIFESTACION_DATA = {
  1: { label: "I · Desafiante", cost: 1, costText: "una parte", battleBonus: 1 },
  2: { label: "II · Excepcional", cost: 2, costText: "la mitad", battleBonus: 2 },
  3: { label: "III · Legendaria", cost: 3, costText: "tres partes", battleBonus: 3 }
};

const pendingById = new Map();
const pendingByActor = new Map();
const konaActorMutationQueues = new Map();

function queueKonaActorMutation(actor, task) {
  const key = actor?.uuid ?? actor?.id;
  if (!key) return Promise.resolve().then(task);

  const previous = konaActorMutationQueues.get(key) ?? Promise.resolve();
  const next = previous
    .catch(() => {})
    .then(task)
    .finally(() => {
      if (konaActorMutationQueues.get(key) === next) {
        konaActorMutationQueues.delete(key);
      }
    });

  konaActorMutationQueues.set(key, next);
  return next;
}

let meliazSocket = null;
let clickListenerInstalled = false;

function installKonaSheetStyles() {
  // 0.24.137: reutiliza y reemplaza la hoja de estilos existente.
  // Evita que una instancia previa de MELIAZ conserve CSS obsoleto.
  const existingStyle = document.getElementById("meliaz-kona-styles");
  const bg = foundry?.utils?.getRoute
    ? foundry.utils.getRoute("modules/meliaz-bridge/assets/placa-hiperaustralis-aprobada.png")
    : "/modules/meliaz-bridge/assets/placa-hiperaustralis-aprobada.png";

  const style = existingStyle || document.createElement("style");
  style.id = "meliaz-kona-styles";
  style.textContent = `
    /* 0.24.200 · Evita el destello de los recuadros heredados de Ñeque durante el montaje CSB.
       El bloque se revela sólo después de reconciliar los dos destinos actuales. */
    .ha-kona-sheet:not(.ha-kona-neque-ready) .ha-neque-loadout {
      visibility: hidden !important;
    }
    /* 0.24.201 · Los campos CSB equipo_1..7 son estructura legacy.
       Ocultar sus wrappers completos evita que texto/labels antiguos se pinten
       antes del montaje del grid actual. No afecta .ha-equipo-items-grid. */
    .ha-kona-sheet :is(
      .ha-val-equipo_1, .ha-val-equipo_2, .ha-val-equipo_3, .ha-val-equipo_4,
      .ha-val-equipo_5, .ha-val-equipo_6, .ha-val-equipo_7,
      .ha-field-equipo_1, .ha-field-equipo_2, .ha-field-equipo_3, .ha-field-equipo_4,
      .ha-field-equipo_5, .ha-field-equipo_6, .ha-field-equipo_7,
      [data-field="equipo_1"], [data-field="equipo_2"],
      [data-field="equipo_3"], [data-field="equipo_4"],
      [data-field="equipo_5"], [data-field="equipo_6"],
      [data-field="equipo_7"]
    ) {
      display: none !important;
      visibility: hidden !important;
      pointer-events: none !important;
    }
    /* mb2318 · Uniformidad de filas y miniiconos sin cambiar la geometría de la placa. */
    .ha-kona-sheet :is(.ha-reliquia-item-row,
      .ha-sentir-instrumento-row, .ha-biomas-row, .ha-neque-loadout-row) {
      box-sizing: border-box !important;
      min-height: 18px !important; max-height: 18px !important;
      gap: 3px !important; overflow: hidden !important;
    }
    /* 0.24.99 · Las celdas Ritual pertenecen a KonaItemGrid:
       no pueden heredar el límite legacy de 18px de las filas de texto. */
    .ha-kona-sheet .ha-ritual-item-row {
      box-sizing: border-box !important;
      min-height: 0 !important;
      max-height: none !important;
      height: 100% !important;
      gap: 0 !important;
      overflow: hidden !important;
    }
    .ha-kona-sheet :is(.ha-ritual-item-name, .ha-reliquia-item-name,
      .ha-sentir-instrumento-name, .ha-biomas-open, .ha-neque-loadout-name) {
      min-width: 0 !important; text-align: left !important;
      direction: ltr !important; overflow: hidden !important;
      text-overflow: ellipsis !important; white-space: nowrap !important;
    }
    .ha-kona-sheet :is(.ha-mini-item-icon, .ha-ritual-item-icon,
      .ha-sentir-instrumento-icon) {
      width:14px !important; height:14px !important;
      min-width:14px !important; max-width:14px !important;
      flex:0 0 14px !important; object-fit:contain !important;
      border:0 !important; border-radius:2px !important;
    }
    /* Reliquias quedan fuera de la regla de miniaturas de 14 px. */
    .ha-kona-sheet .ha-reliquia-item-icon {
      width:100% !important; height:100% !important;
      min-width:0 !important; min-height:0 !important;
      max-width:100% !important; max-height:100% !important;
      flex:1 1 auto !important; object-fit:contain !important;
      border:0 !important; border-radius:0 !important;
    }
    /* mb2313 · recuadros compactos: controles X ocultos; retirada directa por clic en el nombre. */
    .ha-kona-sheet :is(.ha-ritual-item-remove, .ha-reliquia-item-remove,
      .ha-sentir-instrumento-remove, .ha-biomas-remove, .ha-neque-loadout-remove) {
      display: none !important;
    }
    .ha-kona-sheet :is(.ha-ritual-item-row, .ha-reliquia-item-row,
      .ha-sentir-instrumento-row, .ha-biomas-row, .ha-neque-loadout-name) {
      cursor: pointer !important;
    }

    .ha-kona-sheet {
      position: relative !important;
      display: block !important;
      width: 100% !important;
      aspect-ratio: 4 / 3 !important;
      min-height: 650px !important;
      padding: 0 !important;
      margin: 0 !important;
      overflow: hidden !important;
      box-sizing: border-box !important;
      background-image: linear-gradient(rgba(255,248,233,.15), rgba(255,248,233,.15)), url("${bg}") !important;
      background-repeat: no-repeat !important;
      background-position: center center !important;
      background-size: 100% 100% !important;
    }


    /* Tarjetas MELIAZ · icono pequeño de copiar texto. */
    .meliaz-copy-row {
      display: flex !important;
      justify-content: flex-end !important;
      align-items: center !important;
      margin-top: .2rem !important;
      min-height: 22px !important;
    }

    .meliaz-copy-icon {
      width: 22px !important;
      height: 22px !important;
      min-width: 22px !important;
      min-height: 22px !important;
      margin: 0 !important;
      padding: 0 !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      border: 1px solid rgba(110,110,110,.28) !important;
      border-radius: 5px !important;
      background: transparent !important;
      color: inherit !important;
      opacity: .48 !important;
      box-shadow: none !important;
      cursor: pointer !important;
      font: 600 14px/1 sans-serif !important;
    }

    .meliaz-copy-icon:hover {
      opacity: .95 !important;
      background: rgba(127,127,127,.10) !important;
      border-color: rgba(110,110,110,.50) !important;
    }

    .ha-kona-roll {
      position: absolute !important;
      z-index: 10 !important;
      margin: 0 !important;
      padding: 0 !important;
      opacity: 0 !important;
      cursor: pointer !important;
      color: transparent !important;
      font-size: 0 !important;
      line-height: 0 !important;
      text-shadow: none !important;
      background: transparent !important;
      border: 0 !important;
      outline: 0 !important;
      box-shadow: none !important;
      appearance: none !important;
      -webkit-appearance: none !important;
    }

    .ha-kona-roll:hover,
    .ha-kona-roll:focus,
    .ha-kona-roll:active {
      opacity: 0 !important;
      color: transparent !important;
      background: transparent !important;
      border: 0 !important;
      outline: 0 !important;
      box-shadow: none !important;
    }

    .ha-kona-value {
      position: absolute !important;
      z-index: 20 !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    .ha-kona-value label {
      display: none !important;
    }

    .ha-kona-value input {
      width: 100% !important;
      height: 100% !important;
      min-width: 0 !important;
      padding: 0 !important;
      margin: 0 !important;
      border: 0 !important;
      outline: 0 !important;
      box-shadow: none !important;
      background: transparent !important;
      color: #2a150d !important;
      text-align: center !important;
      font-family: Georgia, "Times New Roman", serif !important;
      font-weight: 500 !important;
      line-height: 1 !important;
      font-size: 62px !important;
    }

    .ha-kona-value input:hover,
    .ha-kona-value input:focus {
      background: rgba(255,255,255,0.18) !important;
      border-radius: 10px !important;
    }

    .ha-kona-center input {
      font-size: clamp(24px, 3vw, 48px) !important;
    }


    /* Porte I–III · los círculos tallados SON el control.
       CSB conserva el radio real para guardar el valor, pero se hace invisible.
       Sólo se dibuja un punto interior sobre el círculo seleccionado. */
    .ha-porte-radio {
      position: absolute !important;
      z-index: 28 !important;
      margin: 0 !important;
      padding: 0 !important;
      width: 4.0% !important;
      height: 5.8% !important;
      background: transparent !important;
      border: 0 !important;
      box-shadow: none !important;
      overflow: visible !important;
    }

    .ha-porte-radio label,
    .ha-porte-radio .label,
    .ha-porte-radio span {
      display: none !important;
    }

    .ha-porte-radio input[type="radio"] {
      position: absolute !important;
      inset: 0 !important;
      width: 100% !important;
      height: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      opacity: 0 !important;
      appearance: none !important;
      -webkit-appearance: none !important;
      cursor: pointer !important;
      z-index: 2 !important;
    }

    .ha-porte-radio::before {
      content: "" !important;
      position: absolute !important;
      left: 50% !important;
      top: 50% !important;
      width: 56% !important;
      aspect-ratio: 1 / 1 !important;
      transform: translate(-50%, -50%) !important;
      border-radius: 50% !important;
      background: transparent !important;
      pointer-events: none !important;
      z-index: 3 !important;
    }

    .ha-porte-radio:hover::before {
      background: rgba(73,34,20,.16) !important;
    }

    .ha-porte-radio:has(input[type="radio"]:checked)::before {
      background: rgba(73,34,20,.88) !important;
      box-shadow: 0 0 0 2px rgba(232,177,88,.38) !important;
    }

    /* Centros calibrados contra la lámina original 1408×1056. */
    .ha-porte-1 { left: 43.9473% !important; top: 53.8059% !important; }
    .ha-porte-2 { left: 48.0488% !important; top: 53.9057% !important; }
    .ha-porte-3 { left: 52.1980% !important; top: 53.9057% !important; }


    /* Campos exteriores: transparentes hasta hover/focus para respetar el tallado. */
    .ha-kona-text,
    .ha-kona-list {
      position: absolute !important;
      z-index: 22 !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    .ha-kona-text label,
    .ha-kona-list label {
      display: none !important;
    }

    .ha-kona-text input,
    .ha-kona-list input {
      width: 100% !important;
      height: 100% !important;
      min-width: 0 !important;
      padding: 0 .18em !important;
      margin: 0 !important;
      border: 0 !important;
      border-bottom: 1px solid transparent !important;
      outline: 0 !important;
      box-shadow: none !important;
      background: transparent !important;
      color: #351a10 !important;
      font-family: Georgia, "Times New Roman", serif !important;
    }

    .ha-kona-text input {
      font-size: clamp(14px, 1.45vw, 22px) !important;
    }

    .ha-kona-list input {
      font-size: clamp(11px, 1.08vw, 17px) !important;
      line-height: 1.05 !important;
    }

    [class*="ha-ritual-"] input,
    [class*="ha-reliquia-"] input {
      font-size: clamp(10px, 1.00vw, 16px) !important;
    }

    .ha-kona-text input:hover,
    .ha-kona-text input:focus,
    .ha-kona-list input:hover,
    .ha-kona-list input:focus {
      background: rgba(255,245,220,.18) !important;
      border-bottom-color: rgba(79,39,22,.28) !important;
      border-radius: 3px !important;
    }

    /* Identidad: el valor queda SOBRE el rótulo tallado, no a su lado. */
    .ha-field-nombre    { left: 5.8% !important;  top: 14.1% !important; width: 17.5% !important; height: 3.8% !important; }
    .ha-field-auspicio  { left: 5.8% !important;  top: 26.5% !important; width: 17.5% !important; height: 3.8% !important; }
    .ha-field-cultura   { left: 85.4% !important; top: 14.1% !important; width: 12.0% !important; height: 3.8% !important; }
    .ha-field-oficio    { left: 84.0% !important; top: 26.5% !important; width: 13.4% !important; height: 3.8% !important; }

    /* mb208 · bloque derecho: mismo margen exterior que Nombre/Auspicio
       y texto alineado a la izquierda con los títulos impresos de la lámina. */
    .ha-field-cultura input,
    .ha-field-oficio input {
      text-align: left !important;
      padding-left: .25em !important;
      padding-right: .10em !important;
    }

    /* 0.24.123 · Auspicio iguala el cuerpo tipográfico de Oficio. */
    .ha-field-auspicio input {
      font-size: clamp(14px, 1.45vw, 22px) !important;
    }

    .ha-field-cultura input {
      font-size: clamp(13px, 1.28vw, 20px) !important;
      text-align: left !important;
      padding-left: .25em !important;
      padding-right: .10em !important;
    }


    /* Menús de creación: visibles sólo con el candado abierto. */
    .ha-creation-select {
      position: absolute !important;
      z-index: 34 !important;
      height: 3.8% !important;
      margin: 0 !important;
      padding: 0 .25em !important;
      border: 1px solid rgba(86,43,24,.22) !important;
      border-radius: 5px !important;
      background: rgba(239,214,164,.54) !important;
      color: #351a10 !important;
      font-family: Georgia, "Times New Roman", serif !important;
      font-size: clamp(12px, 1.20vw, 18px) !important;
      text-align: center !important;
      text-align-last: center !important;
      outline: 0 !important;
      box-shadow: none !important;
      cursor: pointer !important;
    }

    .ha-creation-select:hover,
    .ha-creation-select:focus {
      background: rgba(239,214,164,.78) !important;
      border-color: rgba(86,43,24,.42) !important;
    }

    .ha-select-oficio-v2 {
      left: 84.0% !important;
      top: 26.0% !important;
      width: 13.4% !important;
      text-align: left !important;
      text-align-last: left !important;
      padding-left: .20em !important;
      padding-right: .08em !important;
    }

    .ha-select-auspicio-v2 {
      left: 5.8% !important;
      top: 26.0% !important;
      width: 17.5% !important;
    }

    .ha-gracia-locked {
      cursor: default !important;
      opacity: .92 !important;
    }

    .ha-field-gracia input {
      text-align: left !important;
      padding-left: .25em !important;
      padding-right: .10em !important;
      font-size: clamp(13px, 1.30vw, 20px) !important;
    }

    /* Listas verticales: cuatro líneas independientes por bloque. */
    .ha-ritual-1 { left: 38.0% !important; top: 15.3% !important; width: 9.2% !important; height: 2.35% !important; }
    .ha-ritual-2 { left: 38.0% !important; top: 17.8% !important; width: 9.2% !important; height: 2.35% !important; }
    .ha-ritual-3 { left: 38.0% !important; top: 20.3% !important; width: 9.2% !important; height: 2.35% !important; }
    .ha-ritual-4 { left: 38.0% !important; top: 22.8% !important; width: 9.2% !important; height: 2.35% !important; }

    .ha-reliquia-1 { left: 26.9% !important; top: 28.4% !important; width: 11.0% !important; height: 1.0% !important; }
    .ha-reliquia-2 { left: 26.9% !important; top: 29.6% !important; width: 11.0% !important; height: 1.0% !important; }
    .ha-reliquia-3 { left: 26.9% !important; top: 30.8% !important; width: 11.0% !important; height: 1.0% !important; }
    .ha-reliquia-4 { left: 26.9% !important; top: 32.0% !important; width: 11.0% !important; height: 1.0% !important; }


    /* HOJA DE ITEM · RITUAL
       Usa la lámina autoral como fondo del template de Ritual. */
    .ha-ritual-sheet {
      position: relative !important;
      display: block !important;
      width: 100% !important;
      aspect-ratio: 4 / 3 !important;
      min-height: 0 !important;
      height: auto !important;
      margin: 0 !important;
      padding: 0 !important;
      overflow: hidden !important;
      box-sizing: border-box !important;
      background: transparent !important;
}

    .ha-ritual-sheet > .custom-system-component {
      position: absolute !important;
      z-index: 8 !important;
      margin: 0 !important;
      padding: .10rem .26rem !important;
      box-sizing: border-box !important;
      background: rgba(244, 222, 183, .18) !important;
      border: 0 !important;
      color: #3a1d12 !important;
      overflow-x: hidden !important;
      overflow-y: auto !important;
    }

    .ha-ritual-sheet .ha-ritual-procedimiento {
      left: 8.4% !important; top: 29.2% !important; width: 82.4% !important; height: 24.0% !important;
    }
    .ha-ritual-sheet .ha-ritual-correspondencias {
      left: 8.4% !important; top: 54.2% !important; width: 82.4% !important; height: 14.0% !important;
    }
    .ha-ritual-sheet .ha-ritual-coste {
      left: 8.4% !important; top: 69.2% !important; width: 82.4% !important; height: 9.0% !important;
    }
    .ha-ritual-sheet .ha-ritual-notas {
      left: 8.4% !important; top: 79.2% !important; width: 82.4% !important; height: 13.8% !important;
    }

    .ha-ritual-sheet .custom-system-rich-content,
    .ha-ritual-sheet prose-mirror,
    .ha-ritual-sheet .ProseMirror {
      width: 100% !important;
      height: 100% !important;
      min-height: 0 !important;
      max-height: 100% !important;
      box-sizing: border-box !important;
      overflow-y: auto !important;
      overflow-x: hidden !important;
      background: transparent !important;
      color: #3a1d12 !important;
      font: 400 clamp(9px, .78vw, 12px)/1.10 Georgia, "Times New Roman", serif !important;
      border: 0 !important;
      box-shadow: none !important;
    }

    .ha-ritual-sheet .custom-system-rich-content p,
    .ha-ritual-sheet prose-mirror p,
    .ha-ritual-sheet .ProseMirror p {
      margin: 0 0 .18em 0 !important;
      padding: 0 !important;
      line-height: 1.10 !important;
    }

    .ha-ritual-sheet .custom-system-rich-content p:last-child,
    .ha-ritual-sheet prose-mirror p:last-child,
    .ha-ritual-sheet .ProseMirror p:last-child {
      margin-bottom: 0 !important;
    }

    .ha-ritual-sheet .custom-system-rich-editor-button {
      opacity: .36 !important;
      color: #3a1d12 !important;
    }

    .ha-ritual-sheet .ha-ritual-skin-image {
      position: absolute !important;
      inset: 0 !important;
      width: 100% !important;
      height: 100% !important;
      object-fit: fill !important;
      z-index: 0 !important;
      pointer-events: none !important;
      display: block !important;
    }

    .ha-ritual-sheet .ha-ritual-procedimiento,
    .ha-ritual-sheet .ha-ritual-correspondencias,
    .ha-ritual-sheet .ha-ritual-coste,
    .ha-ritual-sheet .ha-ritual-notas {
      position: absolute !important;
      z-index: 8 !important;
    }
    .ha-ritual-sheet .custom-system-rich-editor-button:hover { opacity: 1 !important; }

    /* HOJA DE ITEM · RELIQUIA
       Lámina autoral con cuatro cuadrantes:
       Historia · Correspondencias · Resonancia · Notas. */
    .ha-reliquia-item-sheet {
      position: relative !important;
      display: block !important;
      width: 100% !important;
      aspect-ratio: 507 / 381 !important;
      min-height: 0 !important;
      height: auto !important;
      margin: 0 !important;
      padding: 0 !important;
      overflow: hidden !important;
      box-sizing: border-box !important;
      background: transparent !important;
    }

    .ha-reliquia-item-sheet > .custom-system-component {
      position: absolute !important;
      z-index: 8 !important;
      margin: 0 !important;
      padding: .08rem .18rem !important;
      box-sizing: border-box !important;
      background: rgba(244, 222, 183, .10) !important;
      border: 0 !important;
      color: #3a1d12 !important;
      overflow-x: hidden !important;
      overflow-y: auto !important;
    }

    .ha-reliquia-item-sheet .ha-reliquia-historia {
      left: 10.8% !important; top: 27.0% !important; width: 36.7% !important; height: 27.7% !important;
    }
    .ha-reliquia-item-sheet .ha-reliquia-correspondencias {
      left: 52.5% !important; top: 27.0% !important; width: 36.7% !important; height: 27.7% !important;
    }
    .ha-reliquia-item-sheet .ha-reliquia-resonancia {
      left: 10.8% !important; top: 57.0% !important; width: 36.7% !important; height: 27.7% !important;
    }
    .ha-reliquia-item-sheet .ha-reliquia-notas {
      left: 52.5% !important; top: 57.0% !important; width: 36.7% !important; height: 27.7% !important;
    }

    .ha-reliquia-item-sheet .custom-system-rich-content,
    .ha-reliquia-item-sheet prose-mirror,
    .ha-reliquia-item-sheet .ProseMirror {
      width: 100% !important;
      height: 100% !important;
      min-height: 0 !important;
      max-height: 100% !important;
      box-sizing: border-box !important;
      overflow-y: auto !important;
      overflow-x: hidden !important;
      background: transparent !important;
      color: #3a1d12 !important;
      font: 400 clamp(8px, .72vw, 11px)/1.08 Georgia, "Times New Roman", serif !important;
      border: 0 !important;
      box-shadow: none !important;
    }

    .ha-reliquia-item-sheet .custom-system-rich-content p,
    .ha-reliquia-item-sheet prose-mirror p,
    .ha-reliquia-item-sheet .ProseMirror p {
      margin: 0 0 .12em 0 !important;
      padding: 0 !important;
      line-height: 1.08 !important;
    }

    .ha-reliquia-item-sheet label {
      display: block !important;
      margin: 0 0 .12rem 0 !important;
      padding: 0 !important;
      color: #4a2415 !important;
      font: 700 clamp(8px, .70vw, 10px)/1 Georgia, "Times New Roman", serif !important;
      letter-spacing: .02em !important;
      text-transform: none !important;
    }

    .ha-reliquia-skin-image {
      position: absolute !important;
      inset: 0 !important;
      width: 100% !important;
      height: 100% !important;
      object-fit: fill !important;
      z-index: 0 !important;
      pointer-events: none !important;
      display: block !important;
    }

    /* PROTOTIPO ITEMS · RITUALES
       La capa aparece sólo cuando el Kona posee al menos un Item-Ritual.
       Los antiguos ritual_1..4 siguen preservados como datos y se muestran
       como entradas de legado dentro de la misma lista. */
    .ha-ritual-items-area {
      position: absolute !important;
      z-index: 46 !important;
      left: 37.55% !important;
      top: 14.85% !important;
      width: 10.25% !important;
      min-height: 10.7% !important;
      max-height: 12.8% !important;
      overflow-y: auto !important;
      overflow-x: hidden !important;
      padding: .12rem .08rem !important;
      box-sizing: border-box !important;
      background: rgba(238, 211, 163, .12) !important;
      border-radius: 4px !important;
      scrollbar-width: thin !important;
    }

    .ha-ritual-item-row,
    .ha-ritual-legacy-row {
      width: 100% !important;
      min-height: 1.55rem !important;
      display: flex !important;
      align-items: center !important;
      gap: .12rem !important;
      margin: 0 !important;
      padding: 0 .08rem !important;
      border: 0 !important;
      background: transparent !important;
      color: #3a1d12 !important;
      font: 400 clamp(8px, .78vw, 11px)/1.05 Georgia, "Times New Roman", serif !important;
      text-align: left !important;
      box-sizing: border-box !important;
    }

    .ha-ritual-item-row {
      cursor: pointer !important;
    }

    .ha-ritual-item-row:hover {
      background: rgba(239,214,164,.55) !important;
    }

    .ha-ritual-item-name,
    .ha-ritual-legacy-name {
      flex: 1 1 auto !important;
      min-width: 0 !important;
      overflow: hidden !important;
      white-space: nowrap !important;
      text-overflow: ellipsis !important;
    }

    .ha-ritual-item-remove {
      flex: 0 0 auto !important;
      width: 1.15rem !important;
      height: 1.15rem !important;
      padding: 0 !important;
      margin: 0 !important;
      border: 0 !important;
      border-radius: 50% !important;
      background: transparent !important;
      color: rgba(58,29,18,.62) !important;
      font: 700 10px/1 sans-serif !important;
      cursor: pointer !important;
      opacity: .42 !important;
    }

    .ha-ritual-item-row:hover .ha-ritual-item-remove,
    .ha-ritual-item-remove:hover {
      opacity: 1 !important;
    }

    /* ITEMS · RELIQUIAS
       Misma lógica de lista del bloque de Rituales, usando el recuadro RELIQUIAS
       ya existente en la hoja Kona. */
    /* Reliquias: contenedor invisible de iconos; la geometría final se fija abajo. */
    .ha-reliquia-items-area {
      position:absolute !important;
      left:26.55% !important; top:27.0% !important;
      width:9.3% !important; height:9.5% !important;
      min-height:0 !important; max-height:none !important;
      padding:0 !important; margin:0 !important;
      overflow:visible !important; box-sizing:border-box !important;
      border:0 !important; outline:0 !important; border-radius:0 !important;
      background:transparent !important; box-shadow:none !important;
      transform:none !important; z-index:47 !important;
    }

    .ha-reliquia-item-row,
    .ha-reliquia-legacy-row {
      width: 100% !important;
      min-height: .78rem !important;
      display: flex !important;
      align-items: center !important;
      gap: .12rem !important;
      margin: 0 !important;
      padding: 0 .08rem !important;
      border: 0 !important;
      background: transparent !important;
      color: #3a1d12 !important;
      font: 400 clamp(8px, .68vw, 9.5px)/1 Georgia, "Times New Roman", serif !important;
      text-align: left !important;
      box-sizing: border-box !important;
    }

    .ha-reliquia-item-row {
      cursor: pointer !important;
    }

    .ha-reliquia-item-row:hover,
    .ha-biomas-row:hover {
      background: rgba(239,214,164,.55) !important;
    }

    .ha-reliquia-item-name,
    .ha-reliquia-legacy-name {
      flex: 1 1 auto !important;
      min-width: 0 !important;
      overflow: hidden !important;
      white-space: nowrap !important;
      text-overflow: ellipsis !important;
    }

    .ha-reliquia-item-remove {
      flex: 0 0 auto !important;
      width: 1.15rem !important;
      height: 1.15rem !important;
      padding: 0 !important;
      margin: 0 !important;
      border: 0 !important;
      border-radius: 50% !important;
      background: transparent !important;
      color: rgba(58,29,18,.62) !important;
      font: 700 10px/1 sans-serif !important;
      cursor: pointer !important;
      opacity: .42 !important;
    }

    .ha-reliquia-item-remove:hover {
      opacity: 1 !important;
      background: rgba(239,214,164,.70) !important;
    }


    .ha-carino-1 { left: 52.3% !important; top: 15.2% !important; width: 14.4% !important; height: 2.5% !important; }
    .ha-carino-2 { left: 52.3% !important; top: 18.0% !important; width: 14.4% !important; height: 2.5% !important; }
    .ha-carino-3 { left: 52.3% !important; top: 20.8% !important; width: 14.4% !important; height: 2.5% !important; }
    .ha-carino-4 { left: 52.3% !important; top: 23.6% !important; width: 14.4% !important; height: 2.5% !important; }

    .ha-equipo-1 { left: calc(36.2% + 5px) !important; top: 73.5% !important; width: 10.6% !important; height: 2.5% !important; }
    .ha-equipo-2 { left: calc(36.2% + 5px) !important; top: 76.3% !important; width: 10.6% !important; height: 2.5% !important; }
    .ha-equipo-3 { left: calc(36.2% + 5px) !important; top: 79.1% !important; width: 10.6% !important; height: 2.5% !important; }
    .ha-equipo-4 { left: calc(36.2% + 5px) !important; top: 81.9% !important; width: 10.6% !important; height: 2.5% !important; }


    /* mb201 · slots dedicados bajo Ñeque. */
    .ha-neque-loadout {
      position: absolute !important;
      left: 27.3% !important;
      top: calc(66.0% - 10px) !important;
      width: 10.0% !important;
      z-index: 19 !important;
      color: #3a1d12 !important;
      font: 600 clamp(7px,.55vw,10px)/1.05 Georgia, "Times New Roman", serif !important;
      pointer-events: auto !important;
    }

    .ha-neque-loadout-row {
      position: relative !important;
      display: flex !important;
      align-items: center !important;
      gap: .20rem !important;
      min-height: 18px !important;
      margin-bottom: .12rem !important;
      padding: .08rem .18rem !important;
      border-bottom: 1px solid rgba(74,36,21,.25) !important;
      background: rgba(244,222,183,.10) !important;
      box-sizing: border-box !important;
    }

    .ha-neque-loadout-label {
      flex: 0 0 1.25rem !important;
      width: 1.25rem !important;
      min-width: 1.25rem !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      font-size: clamp(9px,.72vw,12px) !important;
      line-height: 1 !important;
      font-weight: 700 !important;
      letter-spacing: 0 !important;
      opacity: .78 !important;
    }

    .ha-neque-loadout-name {
      flex: 1 1 auto !important;
      min-width: 0 !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      white-space: nowrap !important;
      cursor: pointer !important;
    }

    .ha-neque-loadout-remove,
    .ha-armadura-averiada {
      flex: 0 0 auto !important;
      width: 16px !important;
      min-width: 16px !important;
      height: 16px !important;
      padding: 0 !important;
      margin: 0 !important;
      border: 0 !important;
      background: transparent !important;
      color: #55271b !important;
      line-height: 16px !important;
    }

    .ha-neque-loadout-remove { opacity: .40 !important; }

    .ha-armadura-averiada {
      display: none !important;
      opacity: .90 !important;
      cursor: pointer !important;
    }

    .ha-neque-loadout-row.is-averiada .ha-armadura-averiada {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
    }

    /* mb206: LENGUAS — 4 líneas, mayor altura vertical sin cambiar ancho. */
    .ha-lengua-1 { left: 52.0% !important; top: 72.2% !important; width: 9.0% !important; height: 2.25% !important; }
    .ha-lengua-2 { left: 52.0% !important; top: 74.6% !important; width: 9.0% !important; height: 2.25% !important; }
    .ha-lengua-3 { left: 52.0% !important; top: 77.0% !important; width: 9.0% !important; height: 2.25% !important; }
    .ha-lengua-4 { left: 52.0% !important; top: 79.4% !important; width: 9.0% !important; height: 2.25% !important; }

    /* mb209 · Lenguas: prioridad a legibilidad vertical.
       Se mantiene cuatro líneas; altura mayor y tipografía un punto más contenida. */
    .ha-lengua-1 input,
    .ha-lengua-2 input,
    .ha-lengua-3 input,
    .ha-lengua-4 input {
      font-size: clamp(10px, .88vw, 14px) !important;
      line-height: 1.05 !important;
      padding-top: 0 !important;
      padding-bottom: 0 !important;
      box-sizing: border-box !important;
    }

    /* Los campos narrativos bajos se recentran respecto del rótulo. */
    .ha-field-kizuamun  { left: 5.8% !important; top: 88.0% !important; width: 28.2% !important; height: 3.8% !important; }
    .ha-field-gracia    { left: 85.8% !important; top: 88.0% !important; width: 11.6% !important; height: 3.8% !important; }

    /* Botoncito de Manifestación debajo de Auspicio. */
    .ha-manifest-button {
      position: absolute !important;
      z-index: 32 !important;
      left: calc(5.6% - 3px) !important;
      top: 30.45% !important;
      width: 12.6% !important;
      height: 3.3% !important;
      margin: 0 !important;
      padding: 0 .30rem !important;
      border: 1px solid rgba(86,43,24,.28) !important;
      border-radius: 7px !important;
      background: rgba(239,214,164,.34) !important;
      color: #3a1d12 !important;
      font: 700 clamp(8px, 0.84vw, 12px)/1 Georgia, "Times New Roman", serif !important;
      letter-spacing: 0 !important;
      text-transform: none !important;
      cursor: pointer !important;
      opacity: .82 !important;
    }

    .ha-manifest-button:hover {
      opacity: 1 !important;
      background: rgba(239,214,164,.52) !important;
      box-shadow: 0 0 0 1px rgba(86,43,24,.08) inset !important;
    }

    .ha-manifest-button.is-active {
      opacity: 1 !important;
      background: rgba(109,54,31,.78) !important;
      color: #f4dfb5 !important;
      border-color: rgba(86,43,24,.62) !important;
      box-shadow: 0 0 0 1px rgba(244,223,181,.20) inset !important;
    }

    /* EXALTAR: hotspot invisible sobre el rótulo NEWÉN.
       No tapa el contador ni los controles +/-; funciona dentro y fuera de combate. */
    .ha-exaltar-button {
      position: absolute !important;
      z-index: 33 !important;
      left: 41.10% !important;
      top: 39.95% !important;
      width: 9.40% !important;
      height: 3.05% !important;
      margin: 0 !important;
      padding: 0 !important;
      border: 0 !important;
      border-radius: 7px !important;
      background: transparent !important;
      color: transparent !important;
      font-size: 0 !important;
      line-height: 1 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      cursor: pointer !important;
      opacity: 1 !important;
      box-shadow: none !important;
      outline: 0 !important;
    }

    .ha-exaltar-button:hover {
      background: #ead8b5 !important;
      color: #3a1d12 !important;
      font: 700 clamp(7px, 0.62vw, 10px)/1 Georgia, "Times New Roman", serif !important;
      white-space: nowrap !important;
      overflow: visible !important;
      box-shadow: 0 0 0 1px rgba(86,43,24,.28) inset !important;
    }

    /* Si Foundry tiene un combate activo, NEWÉN recuerda discretamente que puede Exaltarse. */
    .ha-exaltar-button.is-in-combat {
      background: rgba(232,177,88,.12) !important;
      box-shadow: 0 0 0 1px rgba(109,54,31,.24) inset,
                  0 0 7px rgba(232,177,88,.20) !important;
    }

    /* Exaltar preparado: el hotspot se vuelve una marca visible sin añadir otro botón a la hoja. */
    .ha-exaltar-button.is-active {
      background: rgba(232,177,88,.26) !important;
      box-shadow: 0 0 0 2px rgba(109,54,31,.46) inset,
                  0 0 8px rgba(232,177,88,.30) !important;
    }

    .ha-exaltar-button.is-active.is-in-combat {
      background: rgba(232,177,88,.36) !important;
      box-shadow: 0 0 0 2px rgba(109,54,31,.62) inset,
                  0 0 11px rgba(232,177,88,.46) !important;
    }

    .ha-rival-apinar-marker {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      margin: .15rem 0 .35rem .35rem !important;
      padding: .12rem .42rem !important;
      border-radius: 999px !important;
      border: 1px solid rgba(86,43,24,.42) !important;
      background: rgba(109,54,31,.82) !important;
      color: #f4dfb5 !important;
      font-weight: 700 !important;
      font-size: .76em !important;
      letter-spacing: .03em !important;
      text-transform: uppercase !important;
    }

    /* Marcador binario de Descendencia: registro de hoja, no coste automático. */
    .ha-descendiente-marker {
      position: absolute !important;
      z-index: 32 !important;
      left: 5.6% !important;
      top: 34.05% !important;
      width: 12.6% !important;
      height: 3.0% !important;
      margin: 0 !important;
      padding: 0 .30rem !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      border: 1px solid rgba(86,43,24,.20) !important;
      border-radius: 7px !important;
      background: rgba(239,214,164,.20) !important;
      color: #3a1d12 !important;
      font: 700 clamp(8px, 0.82vw, 12px)/1 Georgia, "Times New Roman", serif !important;
      letter-spacing: 0 !important;
      text-transform: none !important;
      cursor: pointer !important;
      opacity: .76 !important;
    }

    .ha-descendiente-marker:hover { opacity: 1 !important; }

    /* Alineación visual del retrato/token del PJ con el retrato de mascota.
       Se limita a la imagen de perfil dentro de la hoja Kona. */
    .ha-kona-sheet img.profile-img,
    .ha-kona-sheet .profile-img {
      position: absolute !important;
      top: calc(38.0% - 3px) !important;
    }

    /* 0.24.28 · la propia imagen de Mascotas es el control de regeneración, como Token Kona. */
    /* Retrato de mascota: zona invisible salvo por la palabra, debajo de Descendiente.
       El hitbox sigue siendo cuadrado; sin fondo, borde ni marco. */
    .ha-mascota-portrait {
      position: absolute !important;
      z-index: 31 !important;
      left: calc(5.6% - 12px) !important;
      top: 38.0% !important;
      width: 12.6% !important;
      aspect-ratio: 1 / 1 !important;
      box-sizing: border-box !important;
      border: 0 !important;
      outline: 0 !important;
      box-shadow: none !important;
      border-radius: 0 !important;
      background-color: transparent !important;
      background-position: center !important;
      background-size: contain !important;
      background-repeat: no-repeat !important;
      overflow: visible !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      color: #3a1d12 !important;
      font: 700 clamp(7px, .72vw, 11px)/1.2 Georgia, "Times New Roman", serif !important;
      text-align: center !important;
      padding: 2px !important;
      cursor: pointer !important;
      opacity: 1 !important;
      transition: filter .12s ease, outline-color .12s ease !important;
    }
    .ha-mascota-portrait.has-image {
      background-color: transparent !important;
      color: transparent !important;
      opacity: 1 !important;
    }
    .ha-mascota-portrait,
    .ha-mascota-portrait:hover,
    .ha-mascota-portrait:focus,
    .ha-mascota-portrait:focus-visible,
    .ha-mascota-portrait:active,
    .ha-mascota-portrait.is-dragover {
      border: 0 none !important;
      outline: 0 none !important;
      outline-offset: 0 !important;
      box-shadow: none !important;
      text-decoration: none !important;
      -webkit-appearance: none !important;
      appearance: none !important;
    }
    .ha-mascota-portrait:hover {
      opacity: 1 !important;
      filter: none !important;
    }
    .ha-mascota-portrait::before,
    .ha-mascota-portrait::after,
    .ha-mascota-portrait:hover::before,
    .ha-mascota-portrait:hover::after {
      content: none !important;
      display: none !important;
      border: 0 none !important;
      outline: 0 none !important;
      box-shadow: none !important;
    }
    .ha-mascota-portrait.is-locked {
      cursor: default !important;
      opacity: 1 !important;
    }
    .ha-mascota-portrait.is-dragover {
      filter: none !important;
    }
    .ha-mascota-portrait .ha-mascota-placeholder {
      pointer-events: none !important;
      opacity: .25 !important;
      text-transform: lowercase !important;
    }
    .ha-mascota-portrait.has-image .ha-mascota-placeholder {
      display: none !important;
    }

    .ha-descendiente-dot {
      display: none !important;
    }

    .ha-descendiente-marker.is-active {
      opacity: 1 !important;
      background: rgba(109,54,31,.78) !important;
      color: #f4dfb5 !important;
      border-color: rgba(86,43,24,.62) !important;
      box-shadow: 0 0 0 1px rgba(244,223,181,.20) inset !important;
    }

    .ha-descendiente-marker.is-locked {
      cursor: default !important;
      opacity: .92 !important;
    }

    .ha-descendiente-marker.is-locked:hover {
      opacity: .92 !important;
    }

    /* Click discreto sobre el rótulo GRACIA, separado del campo editable. */
    .ha-roll-gracia {
      left: 85.4% !important;
      top: 84.7% !important;
      width: 8.8% !important;
      height: 4.5% !important;
    }

    /* Arraigo / Decadencia: cada círculo tallado es una marca independiente. */
    .ha-kona-mark {
      position: absolute !important;
      z-index: 26 !important;
      width: 4.2% !important;
      height: 5.8% !important;
      margin: 0 !important;
      padding: 0 !important;
      background: transparent !important;
      border: 0 !important;
      overflow: visible !important;
    }

    .ha-kona-mark label,
    .ha-kona-mark .label,
    .ha-kona-mark span {
      display: none !important;
    }

    .ha-kona-mark input[type="checkbox"] {
      position: absolute !important;
      inset: 0 !important;
      width: 100% !important;
      height: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      opacity: 0 !important;
      cursor: pointer !important;
    }

    .ha-kona-mark::before {
      content: "" !important;
      position: absolute !important;
      left: 50% !important;
      top: 50% !important;
      width: 56% !important;
      aspect-ratio: 1/1 !important;
      transform: translate(-50%, -50%) !important;
      border-radius: 50% !important;
      background: transparent !important;
      pointer-events: none !important;
    }

    .ha-kona-mark:hover::before {
      background: rgba(73,34,20,.14) !important;
    }

    .ha-kona-mark:has(input[type="checkbox"]:checked)::before {
      background: rgba(73,34,20,.88) !important;
      box-shadow: 0 0 0 2px rgba(232,177,88,.30) !important;
    }


    .ha-decadencia-1::before,
    .ha-decadencia-2::before,
    .ha-decadencia-3::before {
      width: 60% !important;
    }

    .ha-arraigo-1 { left: 11.55% !important; top: 61.76% !important; }
    .ha-arraigo-2 { left: 13.05% !important; top: 67.40% !important; }
    .ha-arraigo-3 { left: 15.25% !important; top: 73.52% !important; }

    .ha-decadencia-1 { left: 86.0348% !important; top: 60.7068% !important; }
    .ha-decadencia-2 { left: 84.1293% !important; top: 66.6212% !important; }
    .ha-decadencia-3 { left: 81.9746% !important; top: 73.1405% !important; }



    /* Controles estrechos de recursos: fuera del número, sin tapar el diseño. */
    .ha-resource-stepper {
      position: absolute !important;
      z-index: 35 !important;
      width: 2.15% !important;
      height: 6.65% !important;
      display: grid !important;
      grid-template-rows: 1fr 1fr !important;
      gap: 1px !important;
      margin: 0 !important;
      padding: 0 !important;
      border-radius: 8px !important;
      overflow: hidden !important;
      opacity: .62 !important;
    }

    .ha-resource-stepper:hover {
      opacity: 1 !important;
    }

    .ha-resource-stepper button {
      min-width: 0 !important;
      min-height: 0 !important;
      width: 100% !important;
      height: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      border: 1px solid rgba(86,43,24,.25) !important;
      border-radius: 4px !important;
      background: rgba(239,214,164,.42) !important;
      color: #3a1d12 !important;
      font: 700 clamp(10px, 1.05vw, 16px)/1 sans-serif !important;
      cursor: pointer !important;
      box-shadow: none !important;

      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      text-align: center !important;
      text-indent: 0 !important;
      vertical-align: middle !important;
    }

    .ha-resource-stepper button:hover {
      background: rgba(239,214,164,.78) !important;
      border-color: rgba(86,43,24,.48) !important;
    }

    /* A la izquierda de Newen / a la derecha de Aguante. */
    .ha-step-newen   { left: 39.65% !important; top: 41.87% !important; }
    .ha-step-aguante { left: 56.85% !important; top: 41.87% !important; }

    /* Candado discreto para congelar las Capacidades tras la creación. */
    .ha-cap-lock {
      position: absolute !important;
      z-index: 40 !important;
      left: 1.2% !important;
      top: 1.2% !important;
      width: 3.0% !important;
      height: 3.4% !important;
      margin: 0 !important;
      padding: 0 !important;
      border: 0 !important;
      background: transparent !important;
      color: rgba(58,29,18,.58) !important;
      font: 600 clamp(11px, 1.15vw, 17px)/1 sans-serif !important;
      cursor: pointer !important;
      opacity: .58 !important;
      box-shadow: none !important;
    }

    .ha-cap-lock {
      pointer-events: auto !important;
      transition: none !important;
      animation: none !important;
      transform: none !important;
      will-change: auto !important;
    }

    .ha-cap-lock:hover {
      opacity: 1 !important;
      background: rgba(239,214,164,.18) !important;
      border-radius: 5px !important;
      transition: none !important;
      transform: none !important;
    }

    .ha-cap-locked input {
      cursor: default !important;
    }

    .ha-cap-locked input:hover,
    .ha-cap-locked input:focus {
      background: transparent !important;
    }


    /* mb202 · HOTSPOTS AUDITADOS.
       La circunferencia exterior real de la lámina ocupa aprox.
       x 15.7–83.5% / y 4.3–94.6%. Usamos cuartos de elipse,
       no círculos normalizados, para respetar el 4:3 de la hoja.
       Z=10: quedan debajo de inputs, listas, Equipo, Lenguas e Instrumentos. */
    .ha-roll-temple {
      left: 15.7% !important;
      top: 4.3% !important;
      width: 34.3% !important;
      height: 45.7% !important;
      z-index: 10 !important;
      border-radius: 0 !important;
      clip-path: ellipse(100% 100% at 100% 100%) !important;
    }

    .ha-val-temple    { left: 30.25% !important; top: 36.65% !important; width: 7.5% !important;  height: 8.8% !important; }

    .ha-roll-sentir,
    .ha-roll-onda {
      left: 50.0% !important;
      top: 4.3% !important;
      width: 33.5% !important;
      height: 45.7% !important;
      z-index: 10 !important;
      border-radius: 0 !important;
      clip-path: ellipse(100% 100% at 0% 100%) !important;
    }
    .ha-val-sentir,
    .ha-val-onda      { left: 62.25% !important; top: 37.45% !important; width: 7.5% !important;  height: 8.8% !important; }

    .ha-roll-neque {
      left: 15.7% !important;
      top: 50.0% !important;
      width: 34.3% !important;
      height: 44.6% !important;
      z-index: 10 !important;
      border-radius: 0 !important;
      clip-path: ellipse(100% 100% at 100% 0%) !important;
    }
    .ha-val-neque     { left: 30.25% !important; top: 58.25% !important; width: 7.5% !important;  height: 8.8% !important; }

    .ha-roll-picardia {
      left: 50.0% !important;
      top: 50.0% !important;
      width: 33.5% !important;
      height: 44.6% !important;
      z-index: 10 !important;
      border-radius: 0 !important;
      clip-path: ellipse(100% 100% at 0% 0%) !important;
    }
    .ha-val-picardia  { left: 62.25% !important; top: 58.25% !important; width: 7.5% !important;  height: 8.8% !important; }

    /* El círculo central no pertenece a ninguna Capacidad.
       Bloquea el hotspot de los cuatro cuadrantes, pero queda bajo sus controles. */
    .ha-roll-center-shield {
      position: absolute !important;
      left: 37.2% !important;
      top: 32.4% !important;
      width: 25.6% !important;
      height: 35.2% !important;
      z-index: 11 !important;
      border-radius: 50% !important;
      background: transparent !important;
      pointer-events: auto !important;
      cursor: default !important;
    }


    /* mb207 · SENTIR / ONDA · Instrumentos.
       Asociado a la Capacidad y situado junto al número de stat.
       Drag & drop; no fija máximo mecánico. */
    .ha-sentir-instrumentos-box {
      position: absolute !important;
      left: 69.2% !important;
      top: 36.9% !important;
      width: 10.8% !important;
      height: 10.1% !important;
      z-index: 19 !important;
      box-sizing: border-box !important;
      padding: .12rem .18rem !important;
      border: 0 !important;
      outline: 0 !important;
      box-shadow: none !important;
      background: rgba(244,222,183,.10) !important;
      color: #3a1d12 !important;
      overflow: hidden !important;
      pointer-events: auto !important;
      font-family: Georgia, "Times New Roman", serif !important;
    }

    .ha-sentir-instrumentos-title {
      font: 700 clamp(7px,.52vw,9px)/1 Georgia, "Times New Roman", serif !important;
      text-align: left !important;
      margin: 0 0 .10rem 0 !important;
      padding: 0 .05rem !important;
      letter-spacing: .03em !important;
      opacity: .82 !important;
    }

    .ha-sentir-instrumentos-list {
      height: calc(100% - 12px) !important;
      overflow-y: auto !important;
      overflow-x: hidden !important;
      scrollbar-width: none !important;
      -ms-overflow-style: none !important;
    }

    .ha-sentir-instrumentos-list::-webkit-scrollbar {
      width: 0 !important;
      height: 0 !important;
      display: none !important;
    }

    .ha-sentir-instrumento-row {
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      gap: .15rem !important;
      min-height: 16px !important;
      padding: .04rem .10rem !important;
      border-bottom: 1px solid rgba(74,36,21,.22) !important;
      background: transparent !important;
      font: 400 clamp(7px,.55vw,10px)/1.05 Georgia, "Times New Roman", serif !important;
      cursor: pointer !important;
      box-sizing: border-box !important;
    }

    .ha-sentir-instrumento-row:hover {
      background: rgba(239,214,164,.42) !important;
    }

    .ha-sentir-instrumento-name {
      flex: 1 1 auto !important;
      min-width: 0 !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      white-space: nowrap !important;
    }

    .ha-sentir-instrumento-remove {
      flex: 0 0 auto !important;
      width: 16px !important;
      min-width: 16px !important;
      height: 16px !important;
      padding: 0 !important;
      margin: 0 !important;
      border: 0 !important;
      background: transparent !important;
      color: #55271b !important;
      opacity: .40 !important;
      line-height: 16px !important;
    }

    .ha-sentir-instrumento-row:hover .ha-sentir-instrumento-remove,
    .ha-sentir-instrumento-remove:hover {
      opacity: 1 !important;
    }


    /* CORE/FICHAS · estilo uniforme para eliminar elementos; no cambia eventos ni datos. */
    .ha-kona-sheet :is(.ha-ritual-item-remove, .ha-reliquia-item-remove,
      .ha-neque-loadout-remove, .ha-sentir-instrumento-remove) {
      flex: 0 0 18px !important;
      width: 18px !important; min-width: 18px !important;
      height: 18px !important; min-height: 18px !important;
      padding: 0 !important; margin: 0 !important;
      display: inline-flex !important; align-items: center !important;
      justify-content: center !important;
      border: 1px solid rgba(85,39,27,.25) !important;
      border-radius: 50% !important;
      background: rgba(239,214,164,.16) !important;
      color: #55271b !important;
      font: 700 12px/1 sans-serif !important;
      opacity: .55 !important; cursor: pointer !important;
    }
    .ha-kona-sheet :is(.ha-ritual-item-remove, .ha-reliquia-item-remove,
      .ha-neque-loadout-remove, .ha-sentir-instrumento-remove):is(:hover,:focus-visible) {
      opacity: 1 !important; background: rgba(239,214,164,.75) !important;
      outline: 1px solid rgba(85,39,27,.35) !important;
    }

    /* mb222 LAB · refinamientos solicitados: campos, valores y biomas. */
    .ha-val-neque { top: 51.8% !important; left: 30.25% !important; }
    .ha-val-picardia { top: 51.8% !important; left: 63.3% !important; }
    .ha-val-sentir, .ha-val-onda { top: 37.45% !important; left: 62.8% !important; }
    .ha-field-cultura { left: 77.0% !important; width: 17.0% !important; }
    .ha-field-oficio { left: 80.5% !important; width: 14.2% !important; }
    .ha-field-gracia { left: 77.0% !important; top: 89.45% !important; width: 17.0% !important; }
    .ha-select-oficio-v2 { left: 80.5% !important; width: 14.2% !important; }
    .ha-sentir-instrumentos-box { top: 32.0% !important; height: 9.2% !important; left: 69.6% !important; width: 9.2% !important; }
    .ha-sentir-instrumentos-title { display: none !important; }
    .ha-sentir-instrumentos-list { height: 100% !important; }
    .ha-biomas-box {
      position: absolute !important; left: 62.1% !important; top: 67.3% !important;
      width: 14.0% !important; height: 11.2% !important; z-index: 35 !important;
      box-sizing: border-box !important; background: transparent !important;
      border: 0 !important; border-radius: 0 !important;
      font: 400 clamp(8px,.62vw,11px)/1.15 Georgia,serif !important;
      overflow: hidden !important; color: #432718 !important;
    }
    /* mb225 · micro-ajustes identidades y legibilidad sin cambiar reglas. */
    .ha-field-cultura input {
      box-sizing: border-box !important; width: 100% !important;
      font-size: clamp(11px, 1.05vw, 16px) !important;
      white-space: nowrap !important; overflow: hidden !important;
      text-overflow: ellipsis !important;
    }
    .ha-field-cultura input:focus { text-overflow: clip !important; }
    .ha-field-gracia input {
      box-sizing: border-box !important; width: 100% !important;
      font-size: clamp(11px, 1.06vw, 16px) !important;
      text-align: left !important; padding-left: .2em !important;
    }
    .ha-biomas-box:empty { min-height: 0 !important; }
    .ha-biomas-box.is-empty::after { content:"Soltar en Territorio"; position:absolute; left:3px; top:2px; font-size:9px; opacity:.50; pointer-events:none; }
    /* Sin signo +: la zona se comporta visualmente como los demás espacios. */
    .ha-kona-sheet .ha-biomas-remove {
      width: 18px !important; min-width: 18px !important;
      height: 18px !important; display:inline-flex !important;
      justify-content:center !important; align-items:center !important;
      padding:0 !important; border-radius:50% !important;
      border:1px solid rgba(85,39,27,.3) !important;
      font:700 12px/1 sans-serif !important; opacity:.8 !important;
    }
    .ha-kona-sheet .ha-biomas-remove:hover { opacity:1 !important; background:rgba(239,214,164,.6) !important; }
    .ha-biomas-box.is-dragover { background: rgba(230,187,110,.18) !important; }
    .ha-biomas-heading { display: none !important; }
    .ha-biomas-list { overflow:hidden !important; max-height:100% !important; }
    .ha-biomas-row { display:flex !important; align-items:center !important; justify-content:flex-start !important; flex-direction:row !important; gap:3px !important;
      height:18px !important; min-height:18px !important; width:100% !important; box-sizing:border-box !important;
      padding:1px 2px !important; border-top:1px solid rgba(92,46,28,.12) !important; }
    .ha-mini-item-icon { width:14px !important; height:14px !important; min-width:14px !important; max-width:14px !important; flex:0 0 14px !important; object-fit:contain !important; border:0 !important; border-radius:2px !important; opacity:.88 !important; vertical-align:middle !important; }
    .ha-neque-loadout-icon { width:14px !important; height:14px !important; flex:0 0 14px !important; }
    .ha-equipo-slot-mini-icon { cursor:pointer !important; }
    /* 0.24.148 · Se retira el desplazamiento global heredado de Equipo.
       Las celdas experimentales usan centros SVG explícitos; no deben recibir
       un transform genérico por compartir el atributo data-ha-equipo-slot. */
    .ha-kona-sheet [data-ha-equipo-slot] { transform: none !important; }
    .ha-biomas-open { flex:1 1 0 !important; min-width:0 !important; max-width:100% !important;
      text-align:left !important; direction:ltr !important; unicode-bidi:normal !important;
      padding:0 2px !important; border:0 !important; background:transparent !important;
      overflow:hidden !important; text-overflow:ellipsis !important; white-space:nowrap !important;
      display:block !important; font-size:10px !important; }
    .ha-biomas-remove { border:0 !important; background:transparent !important; padding:0 3px !important;
      color:#55271b !important; cursor:pointer !important; }
    /* 0.24.27 · microajuste geométrico Kona; retirar marcos café de Biomas/Instrumentos. */
    .ha-kona-sheet :is(.ha-ritual-items-area, .ha-reliquia-items-area,
      .ha-sentir-instrumentos-box, .ha-biomas-box, .ha-neque-loadout) {
      transform: translateX(-5px) !important;
      box-sizing: border-box !important;
      border: 1px solid rgba(85,39,27,.28) !important;
      border-radius: 3px !important;
      background-color: rgba(239,214,164,.16) !important;
    }
    /* 0.24.101 · Biomas sin placa de fondo; sólo feedback de arrastre. */
    .ha-kona-sheet .ha-biomas-box { background: transparent !important; }
    /* 0.24.55 · Reliquias: conservar posición vertical aprobada y altura natural de los recuadros. */
    .ha-kona-sheet .ha-reliquia-items-area { top: 29.6% !important; left: 26.55% !important; max-height: none !important; transform: translateX(-20px) !important; }
    /* Arma y armadura: avanzar 5 px para despejar el icono y ensanchar
       hasta el borde izquierdo de los slots Equipo (x=36.2%). */
    .ha-kona-sheet .ha-neque-loadout {
      width: calc(9% - 5px) !important;
      transform: translateX(15px) !important;
    }
    /* Legado Biomas: reglas geométricas sustituidas por la autoridad SVG v40
       de KONA Experimental. No aplicar desplazamientos heredados al contenedor. */
    .ha-kona-sheet .ha-biomas-box {
      transform: none !important;
    }
    /* No mostrar controles X: la retirada se hace clicando el nombre/icono. */
    .ha-kona-sheet :is(.ha-neque-loadout-remove, .ha-biomas-remove) {
      display: none !important;
    }
    .ha-kona-sheet :is(.ha-neque-loadout-row, .ha-biomas-row) { cursor: pointer !important; }
    /* 0.24.25 · retirar explícitamente los marcos café de los contenedores Biomas e Instrumentos.
       Solo elimina el marco exterior: conserva filas, iconos, fondo suave e interacciones. */
    .ha-kona-sheet .ha-biomas-box,
    .ha-kona-sheet .ha-sentir-instrumentos-box {
      border: 0 !important;
      outline: 0 !important;
      box-shadow: none !important;
    }
    /* mb204 · lectura editorial de Items comunes / Instrumentos. */
    .ha-generic-item-sheet .ha-equipo-descripcion label,
    .ha-generic-item-sheet .ha-equipo-procedencia label,
    .ha-generic-item-sheet .ha-instrumento-descripcion label,
    .ha-generic-item-sheet .ha-instrumento-procedencia label,
    .ha-generic-item-sheet .ha-equipo-descripcion .custom-system-label,
    .ha-generic-item-sheet .ha-equipo-procedencia .custom-system-label,
    .ha-generic-item-sheet .ha-instrumento-descripcion .custom-system-label,
    .ha-generic-item-sheet .ha-instrumento-procedencia .custom-system-label {
      display: block !important;
      font-weight: 700 !important;
      margin-bottom: .55rem !important;
    }

    .ha-generic-item-sheet .ha-equipo-descripcion,
    .ha-generic-item-sheet .ha-instrumento-descripcion {
      margin-bottom: .85rem !important;
    }

    .ha-generic-item-sheet .ha-equipo-procedencia,
    .ha-generic-item-sheet .ha-instrumento-procedencia {
      margin-top: .35rem !important;
    }

    .ha-val-newen     { left: 42.0% !important; top: 41.72% !important; width: 6.3% !important; height: 7.0% !important; }
    .ha-val-aguante   { left: 50.2% !important; top: 41.72% !important; width: 6.3% !important; height: 7.0% !important; }

    /* Rival · Apiñar preparado. No modifica Peso: sólo marca visualmente
       que el +1 está armado para la próxima oposición. */
    .ha-rival-apinar.ha-rival-apinar-prepared {
      font-weight: 700 !important;
      outline: 2px solid currentColor !important;
      outline-offset: 2px !important;
      border-radius: 6px !important;
    }
    .ha-rival-action-button {
      position:absolute !important; left:auto !important; top:10px !important;
      right:10px !important; bottom:auto !important;
      z-index:20 !important; display:inline-flex !important; align-items:center !important;
      justify-content:center !important; width:auto !important; min-width:0 !important;
      padding:6px 10px !important; min-height:26px !important;
      border:1px solid rgba(255,255,255,.42) !important; border-radius:4px !important;
      background:rgba(32,25,22,.92) !important; color:#fffdf7 !important;
      font:700 10px/1.1 sans-serif !important; letter-spacing:.04em !important;
      cursor:pointer !important; text-shadow:0 1px 2px #000 !important;
    }
    .ha-rival-action-button:hover { background:rgba(82,43,30,.96) !important; }
    .ha-rival-visual-sheet .ha-rival-peso {
      position:absolute !important; left:10px !important; top:10px !important;
      width:76px !important; min-width:0 !important; max-width:76px !important;
      z-index:12 !important; box-sizing:border-box !important; margin:0 !important;
    }
    .ha-rival-visual-sheet .ha-rival-peso :is(input, textarea, select) {
      width:100% !important; min-width:0 !important; max-width:100% !important;
      box-sizing:border-box !important; text-align:center !important;
    }
    .ha-rival-visual-sheet .ha-rival-descripcion {
      position:absolute !important; left:96px !important; top:10px !important;
      width:calc(100% - 106px) !important; max-width:calc(100% - 106px) !important;
      z-index:12 !important; box-sizing:border-box !important;
    }
    .ha-rival-visual-sheet .ha-rival-descripcion :is(input, textarea, select) {
      width:100% !important; min-width:0 !important; max-width:100% !important;
      box-sizing:border-box !important;
    }

    /* 0.24.66 · Retirar visualmente los cuatro campos legacy de Reliquias.
       Los valores permanecen intactos en actor.system.props para migración/consulta. */
    .ha-kona-sheet :is(.ha-reliquia-1, .ha-reliquia-2, .ha-reliquia-3, .ha-reliquia-4) {
      display: none !important;
      visibility: hidden !important;
      pointer-events: none !important;
    }

    /* 0.24.69 · Reliquias: iconos al tamaño de los campos de capacidades. */
    .ha-kona-sheet .ha-reliquia-items-area {
      /* Cada celda coincide con el tamaño de un campo numérico de capacidades. */
      position:absolute !important; left:26.55% !important; top:27.2% !important;
      width:15% !important; height:17.6% !important; max-height:17.6% !important;
      padding:0 !important; margin:0 !important; transform:none !important;
      display:grid !important; gap:2px !important; overflow:visible !important;
      border:0 !important; outline:0 !important; border-radius:0 !important;
      background:transparent !important; box-shadow:none !important;
      box-sizing:border-box !important; z-index:47 !important;
      align-items:stretch !important; justify-items:stretch !important;
    }
    /* 0.24.82 · Reliquias: conservar cuadrícula 2×2, encima del valor Temple.
       El bloque queda bajo el rótulo y termina antes del número; gap y márgenes internos a cero. */
    .ha-kona-sheet .ha-reliquia-items-area {
      left:22.5% !important;
      top:24.5% !important;
      width:12.75% !important; /* 15% mas estrecho; borde izquierdo fijo */
      height:13% !important;
      max-height:13% !important;
      gap:0 !important;
      row-gap:0 !important;
      column-gap:0 !important;
      padding:0 !important;
      margin:0 !important;
    }
    .ha-kona-sheet .ha-reliquia-items-area[data-count="0"] { display:none !important; }
    .ha-kona-sheet .ha-reliquia-items-area[data-count="1"] { grid-template-columns:1fr !important; grid-template-rows:1fr !important; }
    .ha-kona-sheet .ha-reliquia-items-area[data-count="2"] { grid-template-columns:1fr 1fr !important; grid-template-rows:1fr !important; }
    .ha-kona-sheet .ha-reliquia-items-area[data-count="3"] { grid-template-columns:1fr 1fr !important; grid-template-rows:1fr 1fr !important; }
    .ha-kona-sheet .ha-reliquia-items-area[data-count="4"] { grid-template-columns:1fr 1fr !important; grid-template-rows:1fr 1fr !important; grid-auto-flow:row !important; }
    .ha-kona-sheet .ha-reliquia-items-area[data-count="3"] .ha-reliquia-icon-slot:nth-child(3) { grid-column:1 / 3 !important; width:50% !important; justify-self:center !important; }
    .ha-kona-sheet .ha-reliquia-icon-slot {
      min-width:0 !important; min-height:0 !important; width:100% !important; height:100% !important;
      display:flex !important; align-items:center !important; justify-content:center !important;
      overflow:visible !important; border:0 !important; background:transparent !important;
      padding:0 !important; margin:0 !important; cursor:pointer !important;
    }
    .ha-kona-sheet .ha-reliquia-icon-slot img {
      display:block !important; width:90% !important; height:100% !important;
      max-width:90% !important; max-height:100% !important; object-fit:contain !important;
      border:0 !important; border-radius:0 !important; background:transparent !important;
      box-shadow:none !important; pointer-events:none !important;
    }
    .ha-kona-sheet .ha-reliquia-icon-slot:hover img { filter:brightness(1.12) drop-shadow(0 0 2px rgba(80,40,20,.45)) !important; }

    /* 0.24.95 · Bloque compacto de Reliquias alineado bajo su rótulo.
       El área se dimensiona para cuatro iconos en 2x2; no se centra una
       cuadrícula ancha ni se redistribuyen las celdas según la cantidad. */
    .ha-kona-sheet .ha-reliquia-items-area {
      left:26.55% !important;
      top:calc(27.0% - 15px) !important;
      width:9.3% !important;
      height:9.5% !important;
      max-width:9.3% !important;
      max-height:9.5% !important;
      grid-template-columns:repeat(2, minmax(0, 1fr)) !important;
      grid-template-rows:repeat(2, minmax(0, 1fr)) !important;
      column-gap:0 !important;
      row-gap:0 !important;
      gap:0 !important;
      padding:0 !important;
      margin:0 !important;
      overflow:visible !important;
      transform:none !important;
      box-sizing:border-box !important;
    }
    .ha-kona-sheet .ha-reliquia-items-area .ha-reliquia-icon-slot {
      width:100% !important;
      height:100% !important;
      min-width:0 !important;
      min-height:0 !important;
      padding:0 !important;
      margin:0 !important;
      overflow:hidden !important;
      box-sizing:border-box !important;
    }
    .ha-kona-sheet .ha-reliquia-items-area .ha-reliquia-icon-slot img {
      width:100% !important;
      height:100% !important;
      max-width:100% !important;
      max-height:100% !important;
      object-fit:contain !important;
    }

    /* 0.24.96 · KonaItemGrid: adaptador Ritual sobre el núcleo visual común.
       La caja conserva su anclaje; la zona de drop usa este mismo rectángulo DOM. */
    .ha-kona-sheet .ha-ritual-items-area {
      position:absolute !important;
      left:37.55% !important;
      top:14.85% !important;
      width:10.25% !important;
      height:10.7% !important;
      min-height:0 !important;
      max-height:12.8% !important;
      display:flex !important;
      flex-direction:column !important;
      gap:0 !important;
      padding:0 !important;
      margin:0 !important;
      overflow:hidden !important;
      box-sizing:border-box !important;
      background:transparent !important;
      border:0 !important;
      border-radius:0 !important;
      transform:none !important;
    }
    .ha-kona-sheet .ha-ritual-legacy-list {
      flex:0 0 auto !important;
      max-height:35% !important;
      min-height:0 !important;
      overflow:hidden !important;
    }
    .ha-kona-sheet .ha-ritual-legacy-row {
      min-height:12px !important;
      max-height:12px !important;
      padding:0 2px !important;
      font-size:clamp(7px,.65vw,9px) !important;
      line-height:1 !important;
    }
    /* 0.24.99 · La cuadrícula gobierna la altura de sus celdas; no usar
       el alto fijo de las filas legacy ni el límite de miniaturas de texto. */
    .ha-kona-sheet .ha-ritual-items-grid {
      flex:1 1 0 !important;
      display:grid !important;
      grid-template-columns:repeat(2,minmax(0,1fr)) !important;
      grid-template-rows:repeat(2,minmax(0,1fr)) !important;
      gap:0 !important;
      min-width:0 !important;
      min-height:0 !important;
      width:100% !important;
      overflow:hidden !important;
    }
    .ha-kona-sheet .ha-ritual-item-row {
      min-width:0 !important;
      min-height:0 !important;
      width:100% !important;
      height:100% !important;
      padding:0 !important;
      margin:0 !important;
      overflow:hidden !important;
      border:0 !important;
      background:transparent !important;
      cursor:pointer !important;
    }
    /* 0.24.100 · Instrumentos usa las mismas celdas del núcleo KonaItemGrid.
       La lista legacy deja de imponer filas de texto de 18px/miniaturas de 14px. */
    .ha-kona-sheet .ha-sentir-instrumentos-list {
      display:grid !important;
      grid-template-columns:repeat(2,minmax(0,1fr)) !important;
      grid-template-rows:repeat(2,minmax(0,1fr)) !important;
      grid-auto-flow:row !important;
      gap:0 !important;
      width:100% !important;
      height:100% !important;
      min-width:0 !important;
      min-height:0 !important;
      overflow:hidden !important;
      padding:0 !important;
      margin:0 !important;
    }
    .ha-kona-sheet .ha-sentir-instrumento-row {
      display:flex !important;
      align-items:center !important;
      justify-content:center !important;
      box-sizing:border-box !important;
      width:100% !important;
      height:100% !important;
      min-width:0 !important;
      min-height:0 !important;
      max-height:none !important;
      gap:0 !important;
      padding:0 !important;
      margin:0 !important;
      overflow:hidden !important;
      border:0 !important;
      background:transparent !important;
      cursor:pointer !important;
    }
    .ha-kona-sheet .ha-sentir-instrumento-row:hover {
      background:rgba(239,214,164,.16) !important;
    }
    /* 0.24.101 · Biomas usa KonaItemGrid; no hereda miniaturas de 14px. */
    .ha-kona-sheet .ha-biomas-icon {
      display:block !important;
      width:100% !important;
      height:100% !important;
      min-width:0 !important;
      min-height:0 !important;
      max-width:100% !important;
      max-height:100% !important;
      flex:1 1 auto !important;
      object-fit:contain !important;
      border:0 !important;
      border-radius:0 !important;
      pointer-events:none !important;
    }
    .ha-kona-sheet .ha-biomas-row {
      display:flex !important;
      align-items:center !important;
      justify-content:center !important;
      width:100% !important;
      height:100% !important;
      min-width:0 !important;
      min-height:0 !important;
      max-height:none !important;
      padding:0 !important;
      margin:0 !important;
      border:0 !important;
      background:transparent !important;
      overflow:hidden !important;
    }
    .ha-kona-sheet .ha-biomas-row:hover {
      background:rgba(239,214,164,.16) !important;
    }
    .ha-kona-sheet .ha-sentir-instrumento-icon {
      display:block !important;
      width:100% !important;
      height:100% !important;
      min-width:0 !important;
      min-height:0 !important;
      max-width:100% !important;
      max-height:100% !important;
      flex:1 1 auto !important;
      object-fit:contain !important;
      border:0 !important;
      border-radius:0 !important;
      pointer-events:none !important;
    }
    .ha-kona-sheet .ha-ritual-item-row:hover {
      background:rgba(239,214,164,.16) !important;
    }
    .ha-kona-sheet .ha-ritual-item-icon {
      width:100% !important;
      height:100% !important;
      min-width:0 !important;
      min-height:0 !important;
      max-width:100% !important;
      max-height:100% !important;
      flex:1 1 auto !important;
      object-fit:contain !important;
    }

  `;

  if (!existingStyle) document.head.appendChild(style);
  console.info("MELIAZ Bridge 0.24.137 · estilos Hoja Kona actualizados.", {
    reusedExistingStyle: Boolean(existingStyle),
    styleId: style.id
  });
}

function getActorDisplayName(actor) {
  const sheetName = String(actor?.system?.props?.nombre ?? "").trim();
  return sheetName || actor?.name || "Personaje";
}

function getRenderedRoot(html) {
  if (html instanceof HTMLElement) return html;
  if (html?.[0] instanceof HTMLElement) return html[0];
  return null;
}

function getSheetActor(application) {
  const candidate =
    application?.actor ??
    application?.document ??
    application?.object ??
    null;

  if (candidate?.documentName === "Actor") return candidate;
  return null;
}

function getSheetItem(application) {
  const candidate =
    application?.item ??
    application?.document ??
    application?.object ??
    null;

  if (candidate?.documentName === "Item") return candidate;
  return null;
}

function getCommonAncestor(elements, boundary) {
  const nodes = Array.from(elements ?? []).filter(Boolean);
  if (!nodes.length) return null;

  let current = nodes[0];
  while (current && current !== boundary?.parentElement) {
    if (nodes.every(node => current.contains?.(node))) return current;
    current = current.parentElement;
  }
  return boundary ?? null;
}



function purgeHiperaGenericSheetArt(root, kind) {
  if (!root) return;
  const kindKey = String(kind ?? '').toLowerCase();
  const asset = kindKey === 'ritual' ? 'hoja-ritual.webp' : 'hoja-reliquia.webp';
  const className = kindKey === 'ritual' ? '.ha-ritual-skin-image' : '.ha-reliquia-skin-image';

  for (const node of Array.from(root.querySelectorAll(className))) {
    node.remove?.();
  }

  for (const node of Array.from(root.querySelectorAll('img'))) {
    const src = String(node.getAttribute?.('src') ?? node.src ?? '');
    if (src.includes(asset)) node.remove?.();
  }

  const all = [root, ...Array.from(root.querySelectorAll('*'))];
  for (const node of all) {
    const inlineBg = String(node.style?.backgroundImage ?? '');
    if (inlineBg.includes(asset)) {
      node.style.removeProperty('background-image');
      node.style.removeProperty('background-repeat');
      node.style.removeProperty('background-position');
      node.style.removeProperty('background-size');
      node.style.setProperty('background', 'transparent', 'important');
    }
  }
}

function installHiperaOwnArtLayer(canvas, item, {
  className = "ha-item-own-art",
  zIndex = 2,
  opacity = 0.25,
  objectFit = "cover"
} = {}) {
  if (!canvas || !item) return null;

  const raw = String(item.img ?? "").trim();
  if (!raw) return null;

  const src = foundry?.utils?.getRoute
    ? foundry.utils.getRoute(raw)
    : (raw.startsWith("/") ? raw : `/${raw}`);

  let art = canvas.querySelector(`:scope > .${className}`);
  if (!art) {
    art = document.createElement("img");
    art.className = className;
    art.alt = "";
    art.setAttribute("aria-hidden", "true");
    canvas.appendChild(art);
  }

  art.src = `${src}${src.includes("?") ? "&" : "?"}hiperaOwnArt=189`;
  art.style.setProperty("position", "absolute", "important");
  art.style.setProperty("inset", "0", "important");
  art.style.setProperty("width", "100%", "important");
  art.style.setProperty("height", "100%", "important");
  art.style.setProperty("object-fit", objectFit, "important");
  art.style.setProperty("object-position", "center", "important");
  art.style.setProperty("opacity", String(opacity), "important");
  art.style.setProperty("z-index", String(zIndex), "important");
  art.style.setProperty("pointer-events", "none", "important");
  art.style.setProperty("display", "block", "important");
  return art;
}

function installHiperaSheetVeil(canvas, {
  className = "ha-item-sheet-veil",
  zIndex = 4,
  opacity = 0.10,
  color = "255,255,255"
} = {}) {
  if (!canvas) return null;

  let veil = canvas.querySelector(`:scope > .${className}`);
  if (!veil) {
    veil = document.createElement("div");
    veil.className = className;
    veil.setAttribute("aria-hidden", "true");
    canvas.appendChild(veil);
  }

  veil.style.setProperty("position", "absolute", "important");
  veil.style.setProperty("inset", "0", "important");
  veil.style.setProperty("background", `rgba(${color}, ${opacity})`, "important");
  veil.style.setProperty("z-index", String(zIndex), "important");
  veil.style.setProperty("pointer-events", "none", "important");
  veil.style.setProperty("display", "block", "important");
  return veil;
}

function installHiperaSheetLightText(canvas, {
  color = "#fffdf7",
  shadow = "0 1px 2px rgba(0,0,0,0.85)"
} = {}) {
  if (!canvas) return;

  const selectors = [
    ".custom-system-field-root",
    ".custom-system-label",
    ".custom-system-field label",
    ".custom-system-text-area",
    ".custom-system-rich-editor-content",
    ".editor-content",
    ".editor",
    "label",
    "legend",
    "p",
    "span",
    "strong",
    "em",
    "small",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "div",
    "textarea",
    "input",
    "select"
  ].join(", ");

  const nodes = [canvas, ...canvas.querySelectorAll(selectors)];
  for (const node of nodes) {
    if (!node || node.classList?.contains("ha-ritual-own-art") || node.classList?.contains("ha-reliquia-own-art") || node.classList?.contains("ha-generic-item-own-art") || node.classList?.contains("ha-arma-own-art") || node.classList?.contains("ha-item-sheet-veil") || node.classList?.contains("ha-ritual-text-veil") || node.classList?.contains("ha-reliquia-text-veil") || node.classList?.contains("ha-generic-item-text-veil") || node.classList?.contains("ha-arma-text-veil")) continue;
    node.style?.setProperty?.("color", color, "important");
    node.style?.setProperty?.("-webkit-text-fill-color", color, "important");
    if (!(node instanceof HTMLInputElement) && !(node instanceof HTMLTextAreaElement) && !(node instanceof HTMLSelectElement)) {
      node.style?.setProperty?.("text-shadow", shadow, "important");
    }
    if (node instanceof HTMLInputElement || node instanceof HTMLTextAreaElement || node instanceof HTMLSelectElement) {
      node.style?.setProperty?.("caret-color", color, "important");
      node.style?.setProperty?.("background", "transparent", "important");
      node.style?.setProperty?.("background-color", "transparent", "important");
      node.style?.setProperty?.("border-color", "rgba(255,255,255,0.25)", "important");
    }
  }
}

const RITUAL_SCALE_DATA = Object.freeze({
  1: { label: "Persona", cost: 1 },
  2: { label: "Colectivo", cost: 2 },
  3: { label: "Territorio", cost: 3 }
});
const ritualExecutionLocks = new Set();

async function askRitualScale(maxScale) {
  const options = Object.entries(RITUAL_SCALE_DATA)
    .filter(([key]) => Number(key) <= maxScale)
    .map(([key, data]) => `<option value="${key}">${data.label} · ${data.cost} Newén</option>`)
    .join("");
  try {
    const scale = await foundry.applications.api.DialogV2.prompt({
      window: { title: "MELIAZ · Oficiar Ritual" },
      content: `<div style="display:grid;gap:.75rem"><p>Selecciona la escala de la operación.</p><label for="meliaz-ritual-scale"><strong>Escala</strong></label><select id="meliaz-ritual-scale" name="scale">${options}</select></div>`,
      ok: {
        label: "Oficiar",
        callback: (event, button) => Number(button.form.elements.scale.value)
      },
      rejectClose: false,
      modal: true
    });
    return scale == null ? null : Number(scale);
  } catch (err) {
    console.warn("MELIAZ: selección de escala ritual cancelada.", err);
    return null;
  }
}

async function oficiarRitual(itemUuid, actorUuid) {
  if (!game.user?.isGM) {
    const actorCheck = await fromUuid(actorUuid);
    if (!actorCheck?.isOwner) {
      ui.notifications.warn("MELIAZ: no tienes permiso para oficiar con este personaje.");
      return;
    }
  }
  if (ritualExecutionLocks.has(actorUuid)) return;
  ritualExecutionLocks.add(actorUuid);
  try {
    const item = await fromUuid(itemUuid);
    const actor = await fromUuid(actorUuid);
    if (!item || !isHiperaRitualItem(item) || !actor || actor.documentName !== "Actor" || item.parent?.uuid !== actor.uuid) {
      ui.notifications.error("MELIAZ: no pude validar el Ritual y su personaje.");
      return;
    }
    const porteRaw = actor.system?.props?.porte;
    const maxScale = Number.isFinite(Number(porteRaw)) && Number(porteRaw) >= 1
      ? Math.min(3, Math.floor(Number(porteRaw))) : 1;
    const scale = await askRitualScale(maxScale);
    if (!scale) return;
    const scaleData = RITUAL_SCALE_DATA[scale];
    if (!scaleData || scale > maxScale) {
      ui.notifications.warn("MELIAZ: esa escala supera el Porte disponible.");
      return;
    }
    // Releer el recurso justo antes de gastar; cancelar o fallar no consume Newén.
    const freshActor = await fromUuid(actorUuid);
    const before = Number(freshActor?.system?.props?.newen ?? 0);
    if (!Number.isFinite(before) || before < scaleData.cost) {
      ui.notifications.warn(`MELIAZ: Newén insuficiente. ${scaleData.label} requiere ${scaleData.cost}.`);
      return;
    }
    const after = before - scaleData.cost;
    await freshActor.update({ "system.props.newen": after }, { render: false });
    const ritualName = String(item.name ?? "Ritual");
    const copyText = ["MELIAZ · RITUAL", freshActor.name, `Ritual: ${ritualName}`, `Escala: ${scaleData.label}`, `Newén: ${before} → ${after}`].join("\n");
    await ChatMessage.create({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: freshActor }),
      content: `<div><h3>MELIAZ · RITUAL</h3><p><strong>${foundry.utils.escapeHTML(freshActor.name)}</strong></p><p><strong>Ritual:</strong> ${foundry.utils.escapeHTML(ritualName)}</p><p><strong>Escala:</strong> ${scaleData.label}</p><p><strong>Newén:</strong> ${before} → ${after}</p></div>`,
      flags: { [MODULE_ID]: { copyText, ritual: { itemUuid, actorUuid, scale, scaleLabel: scaleData.label, cost: scaleData.cost, newenBefore: before, newenAfter: after, createdAt: Date.now() } } }
    });
    ui.notifications.info(`Ritual oficiado a escala ${scaleData.label}. Newén: ${after}.`);
  } catch (err) {
    console.error("MELIAZ: error al oficiar Ritual.", err);
    ui.notifications.error("MELIAZ: no se pudo completar el Ritual; revisa la consola antes de repetir.");
  } finally {
    ritualExecutionLocks.delete(actorUuid);
  }
}

function installHiperaRitualSheetVisual(application, html) {
  const item = getSheetItem(application);
  if (!item || item.type !== "equippableItem") return;

  const ritualish =
    isHiperaRitualItem(item) ||
    String(item.system?.template ?? "") === HIPERA_RITUAL_TEMPLATE_ID;
  if (!ritualish) return;

  const root = getRenderedRoot(html);
  if (!root) return;

  const selector = [
    ".ha-ritual-procedimiento",
    ".ha-ritual-correspondencias",
    ".ha-ritual-coste",
    ".ha-ritual-notas"
  ].join(", ");

  const fields = Array.from(root.querySelectorAll(selector));
  if (!fields.length) return;

  // CSB 5.2.1 preserves cssClass on child fields but strips cssClass from the
  // root custom_body panel. Recover the actual rendered common container here.
  const canvas = getCommonAncestor(fields, root) ?? root;
  canvas.classList.add("ha-ritual-sheet");
  canvas.dataset.haRitualSheet = "1";
  const ritualActor = item.parent?.documentName === "Actor" ? item.parent : null;
  let officiateButton = canvas.querySelector(":scope > .ha-ritual-oficiar");
  if (ritualActor && (game.user?.isGM || ritualActor.isOwner)) {
    if (!officiateButton) {
      officiateButton = document.createElement("button");
      officiateButton.type = "button";
      officiateButton.className = "ha-ritual-oficiar";
      officiateButton.textContent = "Oficiar";
      officiateButton.dataset.meliazOficiar = "1";
      canvas.appendChild(officiateButton);
    }
    officiateButton.dataset.itemUuid = item.uuid;
    officiateButton.dataset.actorUuid = ritualActor.uuid;
    Object.assign(officiateButton.style, {
      position: "absolute", right: "4%", bottom: "2.5%", zIndex: "20",
      padding: ".28rem .8rem", border: "1px solid rgba(58,29,18,.65)",
      borderRadius: ".25rem", background: "rgba(244,222,183,.92)",
      color: "#3a1d12", fontWeight: "700", cursor: "pointer"
    });
  } else {
    officiateButton?.remove?.();
  }

  // mb192: sin ilustración genérica de Ritual.
  // El icono propio del Item es la única imagen de fondo.
  purgeHiperaGenericSheetArt(root, "ritual");
  const oldSkin = canvas.querySelector(":scope > .ha-ritual-skin-image");
  oldSkin?.remove?.();
  canvas.style.removeProperty("background-image");
  canvas.style.removeProperty("background-repeat");
  canvas.style.removeProperty("background-position");
  canvas.style.removeProperty("background-size");

  canvas.style.setProperty("position", "relative", "important");
  canvas.style.setProperty("display", "block", "important");
  canvas.style.setProperty("width", "100%", "important");
  canvas.style.setProperty("aspect-ratio", "543 / 408", "important");
  canvas.style.setProperty("min-height", "0", "important");
  canvas.style.setProperty("height", "auto", "important");
  canvas.style.setProperty("overflow", "hidden", "important");
  canvas.style.setProperty("padding", "0", "important");
  canvas.style.setProperty("margin", "0", "important");


  installHiperaOwnArtLayer(canvas, item, {
    className: "ha-ritual-own-art",
    zIndex: 2,
    opacity: 0.25,
    objectFit: "cover"
  });

  installHiperaSheetVeil(canvas, {
    className: "ha-ritual-text-veil",
    zIndex: 4,
    opacity: 0.15,
    color: "0,0,0"
  });

  installHiperaSheetLightText(canvas);

  for (const field of fields) {
    field.style.setProperty("position", "relative", "important");
    field.style.setProperty("z-index", "8", "important");
  }

  console.log(`Hiperaustralis · MELIAZ Bridge mb192 · fondo propio Ritual aplicado a ${item.name}.`);
}


function installHiperaReliquiaSheetVisual(application, html) {
  const item = getSheetItem(application);
  if (!item || item.type !== "equippableItem") return;

  const reliquiaish =
    isHiperaReliquiaItem(item) ||
    String(item.system?.template ?? "") === HIPERA_RELIQUIA_TEMPLATE_ID;
  if (!reliquiaish) return;

  const root = getRenderedRoot(html);
  if (!root) return;

  const selector = [
    ".ha-reliquia-historia",
    ".ha-reliquia-correspondencias",
    ".ha-reliquia-resonancia",
    ".ha-reliquia-notas"
  ].join(", ");

  const fields = Array.from(root.querySelectorAll(selector));
  if (!fields.length) {
    console.warn(`MELIAZ Bridge: no encontré los cuatro campos de Reliquia en ${item.name}.`);
    return;
  }

  const canvas = getCommonAncestor(fields, root) ?? root;
  canvas.classList.add("ha-reliquia-item-sheet");
  canvas.dataset.haReliquiaSheet = "1";

  // CSB puede envolver los campos en paneles con fondo propio.
  // Transparéntalos para que la lámina autoral no quede tapada.
  for (const field of fields) {
    let node = field;
    while (node && node !== canvas) {
      node.style?.setProperty?.("background", "transparent", "important");
      node.style?.setProperty?.("background-color", "transparent", "important");
      node = node.parentElement;
    }
  }

  // mb193: se elimina la lámina genérica de Reliquia.
  // El icono propio del Item es la única imagen de fondo.
  purgeHiperaGenericSheetArt(root, "reliquia");
  canvas.querySelector(":scope > .ha-reliquia-skin-image")?.remove?.();
  canvas.style.removeProperty("background-image");
  canvas.style.removeProperty("background-repeat");
  canvas.style.removeProperty("background-position");
  canvas.style.removeProperty("background-size");

  for (const field of fields) {
    field.style.setProperty("position", "absolute", "important");
    field.style.setProperty("z-index", "8", "important");
  }

  canvas.style.setProperty("position", "relative", "important");
  canvas.style.setProperty("display", "block", "important");
  canvas.style.setProperty("width", "100%", "important");
  canvas.style.setProperty("aspect-ratio", "507 / 381", "important");
  canvas.style.setProperty("min-height", "0", "important");
  canvas.style.setProperty("height", "auto", "important");
  canvas.style.setProperty("overflow", "hidden", "important");
  canvas.style.setProperty("padding", "0", "important");
  canvas.style.setProperty("margin", "0", "important");


  installHiperaOwnArtLayer(canvas, item, {
    className: "ha-reliquia-own-art",
    zIndex: 2,
    opacity: 0.25,
    objectFit: "cover"
  });

  installHiperaSheetVeil(canvas, {
    className: "ha-reliquia-text-veil",
    zIndex: 4,
    opacity: 0.15,
    color: "0,0,0"
  });

  installHiperaSheetLightText(canvas);

  console.log(`Hiperaustralis · mb193 · fondo propio Reliquia aplicado a ${item.name}.`);
}




function installHiperaGenericItemOwnArt(application, html) {
  const item = getSheetItem(application);
  if (!item || item.type !== "equippableItem") return;

  const kind = inferHiperaItemKind(item);
  if (!["equipo", "instrumento", "defensa", "armadura", "flora", "fauna", "bioma"].includes(kind)) return;

  const root = getRenderedRoot(html);
  if (!root) return;

  const preferred = Array.from(root.querySelectorAll(".custom-system-component-contents, .custom-system-panel, .custom-system-form, .custom-system-form-field"));
  const canvas = getCommonAncestor(preferred, root) ?? root;

  canvas.classList.add("ha-generic-item-sheet");
  canvas.dataset.haGenericItemSheet = "1";
  canvas.style.setProperty("position", "relative", "important");
  canvas.style.setProperty("overflow", "hidden", "important");
  canvas.style.setProperty("min-height", "260px", "important");
  canvas.style.setProperty("background", "transparent", "important");
  canvas.style.setProperty("background-color", "transparent", "important");

  installHiperaOwnArtLayer(canvas, item, {
    className: "ha-generic-item-own-art",
    zIndex: 1,
    opacity: 0.25,
    objectFit: "cover"
  });

  installHiperaSheetVeil(canvas, {
    className: "ha-generic-item-text-veil",
    zIndex: 2,
    opacity: 0.15,
    color: "0,0,0"
  });

  installHiperaSheetLightText(canvas);

  for (const child of Array.from(canvas.children)) {
    if (child.classList?.contains("ha-generic-item-own-art")) continue;
    child.style?.setProperty?.("position", "relative", "important");
    child.style?.setProperty?.("z-index", "3", "important");
    child.style?.setProperty?.("background", "transparent", "important");
    child.style?.setProperty?.("background-color", "transparent", "important");
  }

  for (const node of Array.from(canvas.querySelectorAll("*"))) {
    if (node.classList?.contains("ha-generic-item-own-art")) continue;
    node.style?.setProperty?.("background", "transparent", "important");
    node.style?.setProperty?.("background-color", "transparent", "important");
  }

  console.log(`Hiperaustralis · fondo propio genérico aplicado a ${item.name}.`);
}

function installHiperaArmaSheetVisual(application, html) {
  const item = getSheetItem(application);
  if (!item || item.type !== "equippableItem") return;

  const armaish =
    inferHiperaItemKind(item) === "arma" ||
    String(item.system?.template ?? "") === HIPERA_ARMA_TEMPLATE_ID;
  if (!armaish) return;

  const root = getRenderedRoot(html);
  if (!root) return;

  const field = root.querySelector(".ha-arma-descripcion");
  if (!field) return;

  const canvas = getCommonAncestor([field], root) ?? field.parentElement ?? root;
  canvas.classList.add("ha-arma-item-sheet");
  canvas.dataset.haArmaSheet = "1";

  let node = field;
  while (node && node !== canvas) {
    node.style?.setProperty?.("background", "transparent", "important");
    node.style?.setProperty?.("background-color", "transparent", "important");
    node = node.parentElement;
  }

  canvas.style.setProperty("position", "relative", "important");
  canvas.style.setProperty("overflow", "hidden", "important");
  canvas.style.setProperty("min-height", "280px", "important");

  // Las ilustraciones de armas son cuadrados 512×512 sobre fondo negro.
  // Contenerlas evita recortes en la ficha 4:3; menor opacidad despeja el texto.
  installHiperaOwnArtLayer(canvas, item, {
    className: "ha-arma-own-art",
    zIndex: 1,
    opacity: 0.18,
    objectFit: "contain"
  });

  installHiperaSheetVeil(canvas, {
    className: "ha-arma-text-veil",
    zIndex: 4,
    opacity: 0.15,
    color: "0,0,0"
  });

  installHiperaSheetLightText(canvas);

  field.style.setProperty("position", "relative", "important");
  field.style.setProperty("z-index", "8", "important");
}

function replaceVisibleTextNode(root, fromText, toText) {
  if (!root || !fromText || fromText === toText) return;

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    if (!node.nodeValue?.includes(fromText)) continue;
    node.nodeValue = node.nodeValue.replace(fromText, toText);
    return;
  }
}

function installRivalApinarVisualState(application, html) {
  const root = getRenderedRoot(html);
  const actor = getSheetActor(application);
  if (!root || !actor) return;

  const peso = Number(actor.system?.props?.peso);
  if (!Number.isInteger(peso) || peso < 1) return;

  const prepared = Boolean(actor.getFlag?.(MODULE_ID, "apinarPrepared"));
  const pendingApiñado = getPendingMessagesForRival(actor).some(message =>
    Number(message.getFlag?.(MODULE_ID, "action")?.apinarBonus ?? 0) >= 1
  );
  const marked = prepared || pendingApiñado;

  root.querySelectorAll(".ha-rival-apinar").forEach(control => {
    control.classList.toggle("ha-rival-apinar-prepared", marked);
    replaceVisibleTextNode(
      control,
      marked ? "APIÑAR +1" : "APIÑADO +1",
      marked ? "APIÑADO +1" : "APIÑAR +1"
    );
    control.setAttribute(
      "title",
      prepared
        ? "APIÑADO +1 · preparado para la próxima oposición. Pulsa para cancelar."
        : pendingApiñado
          ? "APIÑADO +1 · aplicado a una oposición pendiente."
          : "APIÑAR +1 · prepara +1 al Peso efectivo de la próxima oposición."
    );
  });

  let marker = root.querySelector(".ha-rival-apinar-marker");
  if (marked && !marker) {
    marker = document.createElement("div");
    marker.className = "ha-rival-apinar-marker";
    const pesoControl = root.querySelector(".ha-rival-peso");
    if (pesoControl?.parentElement) pesoControl.insertAdjacentElement("afterend", marker);
    else root.appendChild(marker);
  }
  if (marker) {
    marker.textContent = `PESO EFECTIVO ${peso} → ${peso + 1}`;
    marker.style.display = marked ? "inline-flex" : "none";
  }
}

async function rerenderRivalSheet(actor) {
  try {
    if (actor?.sheet?.rendered) actor.sheet.render(false);
  } catch (err) {
    console.warn("MELIAZ Bridge: no pude refrescar el estado visual de Apiñar.", err);
  }
}


async function adjustKonaResource(actor, key, delta) {
  const current = Number(actor.system?.props?.[key] ?? 0);
  if (!Number.isFinite(current)) return;

  let min = 0;
  let max = 4;

  if (key === "aguante") {
    const neque = Number(actor.system?.props?.neque ?? 4);
    max = Number.isFinite(neque) ? Math.max(0, neque) : 4;
  }

  const next = Math.max(min, Math.min(max, current + delta));
  if (next === current) return;

  await actor.update({ [`system.props.${key}`]: next });
}


const KONA_OFICIOS = ["Sabio", "Cantor", "Explorador", "Guerrero"];

// No hay una tabla vigente Oficio→Gracia confirmada en las fuentes cotejadas.
// La lógica de cambio conserva la Gracia actual cuando no existe una entrada.
const KONA_GRACIA_POR_OFICIO = Object.freeze({});

const KONA_BUILD_POR_OFICIO = Object.freeze({
  // Builds confirmados en el Estado Maestro; CSB persiste numberField como strings.
  Sabio:    { temple: "4", onda: "2", picardia: "3", neque: "1" },
  Cantor:   { temple: "3", onda: "4", picardia: "2", neque: "1" },
  Explorador: { temple: "2", onda: "1", picardia: "4", neque: "3" },
  // Compatibilidad con personajes antiguos que aún guardan el nombre Viajero.
  Viajero:  { temple: "2", onda: "1", picardia: "4", neque: "3" },
  Guerrero: { temple: "2", onda: "3", picardia: "1", neque: "4" }
});

const KONA_AUSPICIOS_POR_OFICIO = Object.freeze({
  Sabio: ["Zorro - Luz"],
  Cantor: ["Rana - Flujo"],
  Explorador: ["Ñandú - Viento"],
  // Compatibilidad de lectura para personajes creados con la nomenclatura anterior.
  Viajero: ["Ñandú - Viento"],
  Guerrero: ["Culebra - Pulso"],
  // Compatibilidad de lectura para actores creados con los Oficios antiguos.
  Taita: ["Zorro - Luz"],
  Pueta: ["Rana - Flujo"],
  Patiperro: ["Ñandú - Viento"],
  Weichan: ["Culebra - Pulso"]
});

// Mortal y Descendiente utilizan el mismo Auspicio simple.
// La condición de Descendiente no cambia ni vacía el Auspicio.
function getKonaAuspiciosFor(oficio, descendiente) {
  return Array.from(KONA_AUSPICIOS_POR_OFICIO[oficio] ?? []);
}

function getCanonicalKonaAuspicio(oficio, descendiente, current = "") {
  const allowed = getKonaAuspiciosFor(oficio, descendiente);
  const existing = String(current ?? "").trim();
  return allowed.includes(existing) ? existing : (allowed[0] ?? "");
}

function replaceSelectOptions(select, values, current = "") {
  if (!select) return;
  const wanted = String(current ?? "").trim();
  select.replaceChildren();

  const blank = document.createElement("option");
  blank.value = "";
  blank.textContent = "—";
  select.appendChild(blank);

  for (const value of values) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    if (wanted.toLowerCase() === value.toLowerCase()) option.selected = true;
    select.appendChild(option);
  }

  if (wanted && !values.some(v => v.toLowerCase() === wanted.toLowerCase())) {
    select.value = values[0] ?? "";
  }
}

function buildKonaSelect(className, propKey, values, actor) {
  const select = document.createElement("select");
  select.className = `ha-creation-select ${className}`;
  select.dataset.haChoiceProp = propKey;

  const current = String(actor.system?.props?.[propKey] ?? "").trim();

  const blank = document.createElement("option");
  blank.value = "";
  blank.textContent = "—";
  select.appendChild(blank);

  for (const value of values) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    if (current.toLowerCase() === value.toLowerCase()) option.selected = true;
    select.appendChild(option);
  }

  // Preserve an existing non-standard value without destroying it.
  if (current && !values.some(v => v.toLowerCase() === current.toLowerCase())) {
    const option = document.createElement("option");
    option.value = current;
    option.textContent = current;
    option.selected = true;
    select.appendChild(option);
  }

  return select;
}


function findKonaCsbInput(canvas, key) {
  const selectors = [
    `[name="system.props.${key}"]`,
    `[name="${key}"]`,
    `.ha-val-${key} input`,
    `.ha-field-${key} input`
  ];

  for (const selector of selectors) {
    const input = canvas.querySelector(selector);
    if (input) return input;
  }

  return null;
}

function cleanupLegacyHiperaEquipoSeven(canvas, actor) {
  if (!canvas) return;

  // 0.24.148 · Limpieza visual no destructiva.
  // Los slots heredados 5–7 se ocultan, pero NO se normalizan ni se mutan
  // automáticamente: Items, flags y valores del Actor permanecen intactos.
  for (let slot = 5; slot <= 7; slot++) {
    const input = findKonaCsbInput(canvas, `equipo_${slot}`);
    if (input) {
      input.style.setProperty("visibility", "hidden", "important");
      input.style.setProperty("pointer-events", "none", "important");
      input.setAttribute("aria-hidden", "true");
      const wrapper = input.closest?.(
        `.ha-field-equipo_${slot}, .ha-val-equipo_${slot}, [data-field="equipo_${slot}"]`
      );
      if (wrapper) {
        wrapper.style.setProperty("display", "none", "important");
        wrapper.style.setProperty("visibility", "hidden", "important");
        wrapper.style.setProperty("pointer-events", "none", "important");
        wrapper.setAttribute("aria-hidden", "true");
      }
    }
  }

  // Retira sólo restos DOM visuales que identifiquen inequívocamente slots > 4.
  // No elimina Items, no cambia equipoSlot y no altera propiedades CSB.
  for (const node of canvas.querySelectorAll(
    "[data-ha-equipo-slot], .ha-equipo-grid-cell, .ha-equipo-slot-mini-icon"
  )) {
    const slot = Number(node.dataset?.haEquipoSlot ?? node.dataset?.slot ?? 0);
    if (slot > 4) node.remove();
  }

  for (const node of canvas.querySelectorAll("[title], [aria-label]")) {
    const title = String(node.getAttribute("title") ?? "").trim();
    const aria = String(node.getAttribute("aria-label") ?? "").trim();
    if (/^Equipo\s*[5-7]$/i.test(title) || /^Equipo\s*[5-7]$/i.test(aria)) {
      node.remove();
    }
  }

  // La migración de 4 zonas se ejecuta aparte y sólo añade flags que faltan;
  // esta limpieza sigue siendo exclusivamente visual y nunca toca los Items.
  if (canvas.dataset.haEquipoFourSlotMigration !== "done") {
    canvas.dataset.haEquipoFourSlotMigration = "visual-cleanup-only";
  }
}

function cleanupRedundantHiperaEquipoTooltips(canvas) {
  if (!canvas) return;
  // Los slots conservan su índice interno 1–4, pero no deben anunciar
  // "Equipo 1", "Equipo 2", etc. como tooltips: visualmente son cuatro
  // espacios de una misma zona. No tocar nombres de Items ni datos CSB.
  const redundant = /^Equipo\s*[1-4]$/i;
  for (const node of canvas.querySelectorAll("[title], [data-tooltip]")) {
    const title = String(node.getAttribute("title") ?? "").trim();
    const tooltip = String(node.getAttribute("data-tooltip") ?? "").trim();
    if (redundant.test(title)) node.removeAttribute("title");
    if (redundant.test(tooltip)) node.removeAttribute("data-tooltip");
  }
}

function installHiperaEquipoSlotIcons(canvas, actor) {
  if (!canvas || !actor) return;

  // 0.24.198: el montaje es exclusivamente visual. No ejecuta migraciones ni
  // asigna equipoSlot / system.props al abrir o volver a renderizar la ficha.
  cleanupLegacyHiperaEquipoSeven(canvas, actor);

  let grid = canvas.querySelector(":scope > .ha-equipo-items-grid");
  if (!grid) {
    grid = document.createElement("div");
    grid.className = "ha-equipo-items-grid";
    grid.setAttribute("aria-label", "Equipo");
    grid.title = "Equipo";
    canvas.appendChild(grid);
  }

  for (let slot = 1; slot <= 4; slot++) {
    const input = findKonaCsbInput(canvas, `equipo_${slot}`);
    if (input) {
      input.dataset.haEquipoSlot = String(slot);
      input.style.setProperty("visibility", "hidden", "important");
      input.style.setProperty("pointer-events", "none", "important");
      input.setAttribute("aria-hidden", "true");

      // 0.24.203 · Ocultar el wrapper CSB completo, no sólo el input.
      // El texto/valor legacy puede permanecer visible en el contenedor aunque
      // el control esté oculto y reaparecer brevemente al refrescar el Actor
      // durante un drag-and-drop. Los datos legacy NO se borran ni modifican.
      const wrapper = input.closest?.(
        `.ha-field-equipo_${slot}, .ha-val-equipo_${slot}, [data-field="equipo_${slot}"]`
      );
      if (wrapper) {
        wrapper.style.setProperty("display", "none", "important");
        wrapper.style.setProperty("visibility", "hidden", "important");
        wrapper.style.setProperty("pointer-events", "none", "important");
        wrapper.setAttribute("aria-hidden", "true");
      }
    }
  }

  // Los legacy arma/defensa que ya ocupaban Equipo siguen visibles y
  // recuperables. No se les reasigna ni limpia ningún flag.
  const equipoKinds = ["arma", "equipo", "defensa"];
  const bySlot = new Map();
  for (const candidate of Array.from(actor.items ?? [])) {
    const kind = String(candidate.getFlag?.(MODULE_ID, "kind") ?? inferHiperaItemKind(candidate) ?? "").toLowerCase();
    const slot = Number(candidate.getFlag?.(MODULE_ID, "equipoSlot")) || 0;
    if (equipoKinds.includes(kind) && slot >= 1 && slot <= 4 && !bySlot.has(slot)) bySlot.set(slot, candidate);
  }
  const occupied = new Set(bySlot.keys());
  const nextEquipoSlot = nextKonaPrioritySlot(occupied);
  const existingCells = new Map(Array.from(grid.querySelectorAll(":scope > .ha-equipo-grid-cell"))
    .map(cell => [Number(cell.dataset.haEquipoSlot), cell]));

  for (let slot = 1; slot <= 4; slot++) {
    const item = bySlot.get(slot) ?? null;
    let cell = existingCells.get(slot);
    if (!cell) {
      cell = document.createElement("button");
      cell.type = "button";
      cell.className = "ha-equipo-grid-cell";
      cell.dataset.haEquipoSlot = String(slot);
      cell.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        const id = cell.dataset.haEquipoItemId;
        const embedded = id ? actor.items?.get?.(id) : null;
        if (embedded) embedded.sheet?.render?.(true);
      });
    }

    const itemId = item?.id ?? "";
    const previousId = cell.dataset.haEquipoItemId ?? "";
    cell.dataset.haEquipoItemId = itemId;
    cell.dataset.haEquipoSlot = String(slot);

    // Geometría aprobada intacta.
    if (canvas.classList.contains("ha-kona-experimental-sheet")) {
      const centers = [
        { x: 652.0, y: 795.0 },
        { x: 652.0, y: 925.0 },
        { x: 569.0, y: 772.0 },
        { x: 548.0, y: 881.0 }
      ];
      const point = centers[slot - 1];
      if (point) {
        cell.style.setProperty("position", "absolute", "important");
        cell.style.setProperty("left", `${(point.x - 35) / 1448 * 100}%`, "important");
        cell.style.setProperty("top", `${(point.y - 35) / 1086 * 100}%`, "important");
        cell.style.setProperty("width", `${70 / 1448 * 100}%`, "important");
        cell.style.setProperty("height", `${70 / 1086 * 100}%`, "important");
        cell.style.setProperty("border", "0", "important");
        cell.style.setProperty("border-radius", "50%", "important");
      }
    }

    const label = item ? String(item.name ?? "Equipo") : "Equipo";
    cell.title = label;
    cell.setAttribute("aria-label", label);
    cell.setAttribute("data-tooltip", label);

    if (previousId !== itemId) {
      cell.replaceChildren();
      if (item) {
        const img = document.createElement("img");
        img.className = "ha-equipo-grid-icon";
        img.src = item.img || "icons/svg/item-bag.svg";
        img.alt = label;
        img.title = label;
        img.setAttribute("data-tooltip", label);
        img.draggable = false;
        cell.appendChild(img);
      } else {
        const empty = document.createElement("span");
        empty.className = "ha-equipo-grid-empty";
        empty.textContent = slot === nextEquipoSlot ? "+" : "";
        empty.setAttribute("aria-hidden", "true");
        if (slot === nextEquipoSlot) {
          empty.style.setProperty("display", "block", "important");
          empty.style.setProperty("z-index", "2", "important");
        }
        cell.appendChild(empty);
      }
    } else if (item) {
      const img = cell.querySelector("img.ha-equipo-grid-icon");
      if (img) {
        const nextSrc = item.img || "icons/svg/item-bag.svg";
        if (img.getAttribute("src") !== nextSrc) img.src = nextSrc;
        img.alt = label;
        img.title = label;
        img.setAttribute("data-tooltip", label);
      }
    } else {
      const empty = cell.querySelector(".ha-equipo-grid-empty");
      if (empty) empty.textContent = slot === nextEquipoSlot ? "+" : "";
    }

    if (!item && slot === nextEquipoSlot) {
      cell.dataset.haKonaAdd = "equipo";
      cell.title = "Equipo";
      cell.setAttribute("aria-label", "Equipo");
      cell.setAttribute("data-tooltip", "Equipo");
    } else {
      delete cell.dataset.haKonaAdd;
    }
    // Mover sólo si es un nodo nuevo o está fuera de orden; no reconstruir grid.
    const currentAtSlot = grid.children[slot - 1];
    if (currentAtSlot !== cell) grid.insertBefore(cell, currentAtSlot ?? null);
    existingCells.delete(slot);
  }
  for (const stale of existingCells.values()) stale.remove();
  cleanupRedundantHiperaEquipoTooltips(canvas);
}
function setKonaCsbInputValue(canvas, key, value, fireEvents = true) {
  const input = findKonaCsbInput(canvas, key);
  if (!input) return false;

  const next = String(value ?? "");

  // Use the native setter where possible so CSB/framework wrappers see
  // exactly the same change as a user edit.
  const proto =
    input instanceof HTMLInputElement
      ? HTMLInputElement.prototype
      : input instanceof HTMLTextAreaElement
        ? HTMLTextAreaElement.prototype
        : null;

  const descriptor = proto
    ? Object.getOwnPropertyDescriptor(proto, "value")
    : null;

  if (descriptor?.set) descriptor.set.call(input, next);
  else input.value = next;

  input.setAttribute("value", next);

  if (fireEvents) {
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }

  return true;
}

function syncKonaOficioIntoCsbForm(canvas, oficio, gracia, build) {
  // Critical: write the REAL CSB form fields first.
  // If CSB later serializes its whole form, it now sees the new build,
  // rather than restoring the previous Oficio's values.
  setKonaCsbInputValue(canvas, "oficio", oficio, false);
  setKonaCsbInputValue(canvas, "gracia", gracia, false);

  if (!build) return;

  setKonaCsbInputValue(canvas, "temple", build.temple, true);
  setKonaCsbInputValue(canvas, "onda", build.onda, true);
  setKonaCsbInputValue(canvas, "picardia", build.picardia, true);
  setKonaCsbInputValue(canvas, "neque", build.neque, true);
  setKonaCsbInputValue(canvas, "aguante", build.neque, true);
}


function syncKonaCreationChoices(canvas, actor, locked) {
  // Auspicio ya no es un menú: se conserva el valor y se muestra como
  // resultado del Oficio elegido. Las opciones/correspondencias siguen
  // definidas en las tablas canónicas y se aplican al cambiar el Oficio.
  canvas.querySelectorAll(
    ".ha-select-oficio, .ha-select-auspicio, .ha-select-auspicio-v2, .ha-auspicio-custom-input, .ha-auspicio-menu-back"
  ).forEach(el => el.remove());

  const oficioInput = canvas.querySelector(".ha-field-oficio input");
  const auspicioInput = canvas.querySelector(".ha-field-auspicio input");
  const graciaInput = canvas.querySelector(".ha-field-gracia input");

  // Keep exactly one Bridge selector even after hot reloads or repeated sheet refreshes.
  const oficioSelects = Array.from(canvas.querySelectorAll(".ha-select-oficio-v2"));
  let oficioSelect = oficioSelects.shift() ?? null;
  for (const duplicate of oficioSelects) duplicate.remove();
  if (!oficioSelect) {
    oficioSelect = buildKonaSelect("ha-select-oficio-v2", "oficio", KONA_OFICIOS, actor);
    canvas.appendChild(oficioSelect);
  }

  const currentOficio = String(actor.system?.props?.oficio ?? "").trim();
  const currentAuspicio = String(actor.system?.props?.auspicio ?? "").trim();
  const currentGracia = String(actor.system?.props?.gracia ?? "").trim();
  const descendiente = isKonaDescendiente(actor);
  const canonicalAuspicio = getCanonicalKonaAuspicio(currentOficio, descendiente, currentAuspicio);

  oficioSelect.style.setProperty("left", "80.5%", "important");
  oficioSelect.style.setProperty("top", "26.0%", "important");
  oficioSelect.style.setProperty("width", "14.2%", "important");
  if ([...oficioSelect.options].some(o => o.value === currentOficio)) oficioSelect.value = currentOficio;

  if (auspicioInput) {
    const displayedAuspicio = canonicalAuspicio || currentAuspicio;
    auspicioInput.value = displayedAuspicio;
    auspicioInput.readOnly = true;
    auspicioInput.tabIndex = -1;
    auspicioInput.setAttribute("aria-readonly", "true");
    auspicioInput.style.pointerEvents = "none";

    // Mortal y Descendiente comparten el mismo Auspicio simple por Oficio.
    // Normaliza también los valores históricos de Descendientes: el estado
    // Descendiente nunca debe borrar ni sustituir el Auspicio.
    if (canonicalAuspicio && currentAuspicio !== canonicalAuspicio) {
      void actor.update(
        { "system.props.auspicio": canonicalAuspicio },
        { render: false }
      ).catch(err => console.warn("MELIAZ: no pude completar el nombre del Auspicio.", err));
    }
  }

  const expectedGracia = KONA_GRACIA_POR_OFICIO[currentOficio] ?? currentGracia;
  if (graciaInput) {
    graciaInput.value = expectedGracia;
    graciaInput.readOnly = true;
    graciaInput.tabIndex = -1;
    graciaInput.classList.add("ha-gracia-locked");
  }

  // Visibility uses inline !important because the visual stylesheet previously
  // forced display:block !important on the select and defeated normal display:none.
  if (locked) {
    oficioSelect.hidden = true;
    oficioSelect.setAttribute("aria-hidden", "true");
    oficioSelect.style.setProperty("display", "none", "important");
    if (oficioInput) {
      oficioInput.hidden = false;
      oficioInput.removeAttribute("aria-hidden");
      oficioInput.style.setProperty("display", "block", "important");
      oficioInput.readOnly = true;
      oficioInput.tabIndex = -1;
    }
  } else {
    oficioSelect.hidden = false;
    oficioSelect.setAttribute("aria-hidden", "false");
    oficioSelect.style.setProperty("display", "block", "important");
    if (oficioInput) {
      oficioInput.hidden = true;
      oficioInput.setAttribute("aria-hidden", "true");
      oficioInput.style.setProperty("display", "none", "important");
      oficioInput.readOnly = true;
      oficioInput.tabIndex = -1;
    }
  }
  if (auspicioInput) auspicioInput.style.display = "";
  if (graciaInput) graciaInput.style.display = "";
}


function installKonaMascotaPortrait(canvas, actor) {
  if (!canvas || !actor) return;
  let slot = canvas.querySelector(".ha-mascota-portrait");
  if (!slot) {
    slot = document.createElement("div");
    slot.className = "ha-mascota-portrait";
    slot.dataset.haMascotaPortrait = "1";
    slot.setAttribute("role", "img");
    slot.setAttribute("aria-label", "Mascota");
    slot.title = "Arrastra una ficha del Bestiario para vincularla como mascota";
    slot.innerHTML = '<span class="ha-mascota-placeholder">mascota</span>';
    canvas.appendChild(slot);
  }

  const render = () => {
    const saved = actor.getFlag?.(MODULE_ID, "mascotaPortrait") ?? null;
    slot.replaceChildren();
    if (saved?.img) {
      slot.style.backgroundImage = `url("${String(saved.img).replace(/["\\\\]/g, "")}")`;
      slot.classList.add("has-image");
      slot.setAttribute("aria-label", saved.name ? `Mascota: ${saved.name}` : "Mascota");
      const locked = Boolean(actor.getFlag?.(MODULE_ID, "capacidadesLocked"));
      slot.title = saved.name
        ? `${saved.name} · arrastra otra ficha del Bestiario para reemplazarla${locked ? "" : " · clic derecho para retirar"}`
        : `Arrastra una ficha del Bestiario para reemplazar la mascota${locked ? "" : " · clic derecho para retirar"}`;
      slot.dataset.mascotaUuid = saved.uuid || "";
    } else {
      slot.style.backgroundImage = "";
      slot.classList.remove("has-image");
      slot.setAttribute("aria-label", "Mascota");
      slot.title = "Arrastra una ficha del Bestiario para vincularla como mascota";
      slot.dataset.mascotaUuid = "";
      const placeholder = document.createElement("span");
      placeholder.className = "ha-mascota-placeholder";
      placeholder.textContent = "mascota";
      slot.appendChild(placeholder);
    }
    const locked = Boolean(actor.getFlag?.(MODULE_ID, "capacidadesLocked"));
    slot.classList.toggle("is-locked", locked);
    slot.setAttribute("aria-disabled", locked ? "true" : "false");
    slot.setAttribute("role", "img");
    slot.style.setProperty("cursor", "default", "important");
    slot.style.pointerEvents = "";
  };
  render();

  if (slot.dataset.meliazMascotaDropBound === "1") return;
  slot.dataset.meliazMascotaDropBound = "1";

  // La mascota ya no se regenera por clic. Sólo se puede vincular/reemplazar
  // arrastrando una ficha Actor del Bestiario con el candado abierto.
  slot.addEventListener("dragover", event => {
    const locked = Boolean(actor.getFlag?.(MODULE_ID, "capacidadesLocked"));
    if (locked) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    slot.classList.add("is-dragover");
  });
  slot.addEventListener("dragleave", () => slot.classList.remove("is-dragover"));

  // Con el candado abierto, clic derecho retira sólo el vínculo de mascota.
  // El Actor del Bestiario nunca se elimina ni se modifica.
  if (slot.dataset.meliazMascotaContextBound !== "1") {
    slot.dataset.meliazMascotaContextBound = "1";
    slot.addEventListener("contextmenu", async event => {
      if (Boolean(actor.getFlag?.(MODULE_ID, "capacidadesLocked"))) return;
      const saved = actor.getFlag?.(MODULE_ID, "mascotaPortrait") ?? null;
      if (!saved) return;
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      try {
        await actor.unsetFlag(MODULE_ID, "mascotaPortrait");
        render();
        ui.notifications?.info?.("MELIAZ: mascota retirada de la hoja.");
      } catch (err) {
        console.error("MELIAZ Bridge: no se pudo retirar la mascota.", err);
        ui.notifications?.error?.("MELIAZ: no se pudo retirar la mascota.");
      }
    });
  }

  slot.addEventListener("drop", async event => {
    event.preventDefault();
    event.stopPropagation();
    slot.classList.remove("is-dragover");

    if (Boolean(actor.getFlag?.(MODULE_ID, "capacidadesLocked"))) return;

    let dropped = null;
    const candidates = [];
    const transfer = event.dataTransfer;
    for (const mime of ["text/plain", "application/json", "text"]) {
      try {
        const value = transfer?.getData(mime);
        if (value && !candidates.includes(value)) candidates.push(value);
      } catch (_) {}
    }
    for (const raw of candidates) {
      let data = null;
      try {
        data = globalThis.TextEditor?.getDragEventData ? TextEditor.getDragEventData(event) : null;
      } catch (_) {}
      if (!data) { try { data = JSON.parse(raw); } catch (_) {} }
      if (!data && raw.startsWith("Compendium.")) data = { type: "Actor", uuid: raw };
      if (!data) continue;
      try {
        const ActorClass = globalThis.Actor?.implementation ?? globalThis.Actor;
        if (data.type === "Actor" && ActorClass?.fromDropData) dropped = await ActorClass.fromDropData(data);
        else if (data.type === "Actor" && data.uuid && globalThis.fromUuid) dropped = await fromUuid(data.uuid);
        else if (data.type === "Actor" && data.id) dropped = game.actors?.get(data.id) ?? null;
        else if (data.uuid && globalThis.fromUuid) {
          const resolved = await fromUuid(data.uuid);
          if (resolved?.documentName === "Actor") dropped = resolved;
        } else if (data.data?.type === "character" && data.data?.name) {
          dropped = { documentName: "Actor", name: data.data.name, img: data.data.img, uuid: data.uuid || "", prototypeToken: data.data.prototypeToken };
        }
      } catch (err) {
        console.debug("MELIAZ Bridge: payload de mascota no resolvió como Actor; probando otro formato.", err);
      }
      if (dropped) break;
    }
    if (!dropped || dropped.documentName !== "Actor") {
      ui.notifications?.warn?.("MELIAZ: no pude leer esa ficha. Arrastra un documento Actor desde el Bestiario con el candado abierto.");
      return;
    }
    const img = String(dropped.img || dropped.prototypeToken?.texture?.src || dropped.prototypeToken?.img || "").trim();
    if (!img) {
      ui.notifications?.warn?.("MELIAZ: la ficha arrastrada no tiene retrato.");
      return;
    }
    try {
      await actor.setFlag(MODULE_ID, "mascotaPortrait", {
        uuid: dropped.uuid,
        name: String(dropped.name || "Mascota"),
        img,
        mode: "linked-actor"
      });
      render();
    } catch (err) {
      console.error("MELIAZ Bridge: no se pudo guardar el retrato de mascota.", err);
      ui.notifications?.error?.("MELIAZ: no se pudo guardar el retrato de mascota.");
    }
  });
}

function applyKonaCapabilityLock(root, actor) {
  const locked = Boolean(actor.getFlag?.(MODULE_ID, "capacidadesLocked"));

  root.querySelectorAll(
    ".ha-val-temple input, .ha-val-sentir input, .ha-val-onda input, .ha-val-neque input, .ha-val-picardia input"
  ).forEach(input => {
    input.readOnly = locked;
    input.tabIndex = locked ? -1 : 0;
    input.closest(".ha-kona-value")?.classList.toggle("ha-cap-locked", locked);
  });

  const lockButton = root.querySelector(".ha-cap-lock");
  if (lockButton) {
    lockButton.textContent = locked ? "🔒" : "🔓";
    lockButton.title = locked
      ? "Creación cerrada · clic para editar"
      : "Modo creación · clic para bloquear";
    lockButton.setAttribute("aria-label", lockButton.title);
  }

  const canvas = root.querySelector(".ha-kona-sheet");
  if (canvas) {
    // Sync the pet portrait's drag-and-drop lock state with capability lock.
    installKonaMascotaPortrait(canvas, actor);
    syncKonaCreationChoices(canvas, actor, locked);
    applyKonaDescendienteState(canvas, actor);
  }
}

function applyKonaDescendienteState(canvas, actor) {
  const marker = canvas?.querySelector?.("[data-ha-descendiente]");
  if (!marker || !actor) return;

  const active = isKonaDescendiente(actor);
  const locked = Boolean(actor.getFlag?.(MODULE_ID, "capacidadesLocked"));

  // Con la creación cerrada, un Kona no-Descendiente no muestra el marcador.
  // Al abrir el candado vuelve a aparecer para permitir edición/revelación posterior.
  const hideMarker = Boolean(locked && !active);
  marker.hidden = hideMarker;
  marker.style.display = hideMarker ? "none" : "";
  marker.style.visibility = hideMarker ? "hidden" : "visible";
  marker.classList.toggle("is-active", active);
  marker.classList.toggle("is-locked", locked);
  marker.disabled = locked;
  marker.style.pointerEvents = locked ? "none" : "";
  marker.setAttribute("aria-disabled", locked ? "true" : "false");
  marker.setAttribute("aria-pressed", active ? "true" : "false");
  marker.title = locked
    ? (active ? "Descendiente marcado" : "")
    : (active ? "Descendiente marcado · clic para desmarcar" : "Marcar como Descendiente");

  const manifestButton = canvas.querySelector?.("[data-ha-manifest]");
  if (manifestButton) manifestButton.style.display = active ? "" : "none";

  const decadenciaMarks = canvas.querySelectorAll?.('.ha-decadencia-1, .ha-decadencia-2, .ha-decadencia-3');
  decadenciaMarks?.forEach?.(mark => {
    const input = mark.querySelector?.('input[type="checkbox"]');
    if (input) {
      input.disabled = !active;
      input.tabIndex = active ? 0 : -1;
    }
    mark.style.pointerEvents = active ? '' : 'none';
    mark.style.opacity = active ? '' : '.45';
  });

  const oficio = String(actor.system?.props?.oficio ?? "").trim();
  const current = String(actor.system?.props?.auspicio ?? "").trim();
  const auspicio = getCanonicalKonaAuspicio(oficio, active, current);
  const auspicioInput = canvas.querySelector?.(".ha-field-auspicio input");
  if (auspicioInput) auspicioInput.value = auspicio || current;
}

function actorIsInActiveCombat(actor) {
  const combat = game.combat;
  if (!combat?.started) return false;
  const combatants = Array.from(combat.combatants ?? []);
  if (!combatants.length) return true;
  return combatants.some(c =>
    c?.actorId === actor?.id ||
    c?.actor?.id === actor?.id ||
    c?.actor?.uuid === actor?.uuid
  );
}

function applyKonaExaltarState(canvas, actor) {
  const button = canvas?.querySelector?.("[data-ha-exaltar-sheet]");
  if (!button || !actor) return;
  const prepared = Boolean(actor.getFlag?.(MODULE_ID, "exaltarPrepared"));
  const inCombat = actorIsInActiveCombat(actor);
  button.classList.toggle("is-active", prepared);
  button.classList.toggle("is-in-combat", inCombat);
  button.textContent = "Exaltar";
  button.setAttribute("aria-label", prepared ? "Exaltar preparado" : "Exaltar");
  button.setAttribute("aria-pressed", prepared ? "true" : "false");
  const pendingId = pendingByActor.get(actor.uuid);
  const pendingAction = pendingId ? pendingById.get(pendingId) : null;
  button.title = prepared
    ? "Exaltar preparado para la próxima acción ordinaria · clic para cancelar"
    : pendingAction?.state === "pending"
      ? "Exaltar esta acción · +1 y gastar 1 Newen"
      : "Exaltar · preparar +1 para la próxima acción ordinaria";
}

function applyKonaManifestState(canvas, actor) {
  const button = canvas?.querySelector?.("[data-ha-manifest]");
  if (!button || !actor) return;

  const descendiente = isKonaDescendiente(actor);
  button.style.display = descendiente ? "" : "none";
  const grade = Number(actor.system?.props?.manifestacion_activa ?? 0);
  const active = grade > 0;
  button.classList.toggle("is-active", active);
  button.setAttribute("aria-pressed", active ? "true" : "false");
  button.title = active
    ? `Manifestación ${MANIFESTACION_DATA[grade]?.label ?? grade} activa · segundo clic para limpiar`
    : "Manifestación";
}


const HIPERA_RITUAL_TEMPLATE_NAME = "_Hiperaustralis Ritual";
const HIPERA_RITUAL_TEMPLATE_ID = "HipRitualTpl0001";
const HIPERA_RITUAL_SAMPLE_NAME = "Lakutun · Legar";

function isHiperaRitualItem(item) {
  if (!item || item.type !== "equippableItem") return false;
  const flagKind = String(item.getFlag?.(MODULE_ID, "kind") ?? "").trim().toLowerCase();
  const propKind = String(item.system?.props?.hipera_tipo ?? "").trim().toLowerCase();
  return flagKind === "ritual" || propKind === "ritual";
}

function getKonaRitualItems(actor) {
  if (!actor?.items) return [];
  return Array.from(actor.items).filter(isHiperaRitualItem).sort((a, b) => {
    const sa = Number(a.getFlag?.(MODULE_ID, "ritualSlot")) || 99;
    const sb = Number(b.getFlag?.(MODULE_ID, "ritualSlot")) || 99;
    if (sa !== sb) return sa - sb;
    return Number(a.sort ?? 0) - Number(b.sort ?? 0) || String(a.name).localeCompare(String(b.name), "es");
  });
}

async function repairKonaRitualSlotPersistence(actor) {
  if (!actor?.items) return [];
  const rituals = Array.from(actor.items).filter(isHiperaRitualItem);
  const originalHolder = new Map();
  const assignedById = new Map();
  for (const item of rituals) {
    const slot = Number(item.getFlag?.(MODULE_ID, "ritualSlot")) || 0;
    if (slot >= 1 && slot <= 4 && !originalHolder.has(slot)) {
      originalHolder.set(slot, item);
      assignedById.set(item.id, slot);
    }
  }

  // Respeta primero la correspondencia antigua ritual_1..4 cuando exista.
  // Para los restantes, completa únicamente el flag con la prioridad nueva.
  const legacyProps = actor.system?.props ?? {};
  const updates = [];
  for (let slot = 1; slot <= 4; slot++) {
    if (originalHolder.has(slot)) continue;
    const legacyName = String(legacyProps[`ritual_${slot}`] ?? "").trim();
    if (!legacyName) continue;
    const match = rituals.find(item => !assignedById.has(item.id) && String(item.name ?? "").trim() === legacyName);
    if (match) {
      originalHolder.set(slot, match);
      assignedById.set(match.id, slot);
      updates.push({ _id: match.id, [`flags.${MODULE_ID}.ritualSlot`]: slot });
    }
  }

  const claimed = new Set(originalHolder.keys());
  for (const item of rituals) {
    if (assignedById.has(item.id)) continue;
    const nextSlot = nextKonaPrioritySlot(claimed);
    if (!nextSlot) break; // Overflow Items remain embedded and untouched.
    claimed.add(nextSlot);
    originalHolder.set(nextSlot, item);
    assignedById.set(item.id, nextSlot);
    updates.push({ _id: item.id, [`flags.${MODULE_ID}.ritualSlot`]: nextSlot });
  }
  if (updates.length) await actor.updateEmbeddedDocuments("Item", updates);
  return getKonaRitualItems(actor);
}

function getLegacyKonaRitualNames(actor) {
  const props = actor?.system?.props ?? {};
  return [1, 2, 3, 4]
    .map(i => String(props[`ritual_${i}`] ?? "").trim())
    .filter(Boolean);
}

function setLegacyRitualFieldsVisible(canvas, visible) {
  canvas?.querySelectorAll?.('[class*="ha-ritual-"]')?.forEach?.(el => {
    if (el.classList?.contains("ha-ritual-items-area")) return;
    if (el.classList?.contains("ha-ritual-items-grid")) return;
    if (el.classList?.contains("ha-ritual-legacy-list")) return;
    if (el.classList?.contains("ha-ritual-item-row")) return;
    if (el.classList?.contains("ha-ritual-legacy-row")) return;
    el.style.display = visible ? "" : "none";
  });
}

function createHiperaMiniItemIcon(item, className = "ha-mini-item-icon") {
  const icon = document.createElement("img");
  icon.className = className;
  icon.src = String(item?.img ?? "icons/svg/item-bag.svg");
  icon.alt = "";
  icon.loading = "lazy";
  icon.draggable = false;
  icon.setAttribute("aria-hidden", "true");
  if (item?.name) icon.title = String(item.name);
  return icon;
}

/* KONA ITEM GRID · núcleo visual común.
   Los adaptadores conservan tipos, persistencia, límites y acciones propios.
   Este helper sólo construye celdas, iconos, hover y geometría acotada. */
function renderKonaItemGrid(grid, items, options = {}) {
  if (!grid) return;
  const columns = Math.max(1, Number(options.columns ?? 2));
  const rows = Math.max(1, Number(options.rows ?? 2));
  const capacity = columns * rows;
  const slotClass = String(options.slotClass ?? "ha-kona-item-grid-slot");
  const iconClass = String(options.iconClass ?? "ha-kona-item-grid-icon");
  const datasetKey = String(options.datasetKey ?? "haKonaItem");
  const ariaPrefix = String(options.ariaPrefix ?? "Abrir");
  const overflow = options.overflow === "visible" ? "visible" : "hidden";
  const sourceEntries = Array.from(items ?? []).slice(0, capacity);
  const preserveSlots = Boolean(options.preserveSlots && options.slotField);
  const slotField = String(options.slotField ?? "");
  const slotPriority = Array.isArray(options.slotPriority) ? options.slotPriority : KONA_SLOT_PRIORITY;
  const slotPositions = Array.isArray(options.slotPositions) ? options.slotPositions : null;
  // 0.24.185 · geometría radial trazada desde KONA_V2_BOTONES_CENTROS_REFERENCIA.
  // Cada centro usa el ViewBox nativo 1448×1086; el diámetro SVG es 70u.
  const radialCenters = Array.isArray(options.radialCenters) && options.radialCenters.length >= capacity
    ? options.radialCenters
    : null;
  const radialSize = Math.max(1, Number(options.radialSize ?? 70));
  const applyRadialGeometry = (node, physicalSlot) => {
    const point = radialCenters?.[physicalSlot - 1];
    if (!point || !Number.isFinite(Number(point.x)) || !Number.isFinite(Number(point.y))) return false;
    node.style.setProperty("position", "absolute", "important");

    /* 0.24.187 · Las coordenadas del SVG pertenecen a la hoja completa,
       no al pequeño contenedor de cada grupo. Convertirlas al espacio local
       del grid evita que los slots hereden una escala/posición equivocada. */
    const sheet = grid.closest?.(".ha-kona-sheet");
    const sheetRect = sheet?.getBoundingClientRect?.();
    const gridRect = grid.getBoundingClientRect?.();
    const validRects = sheetRect && gridRect && sheetRect.width > 0 && sheetRect.height > 0 &&
      gridRect.width > 0 && gridRect.height > 0;
    if (validRects) {
      const leftPx = (Number(point.x) - radialSize / 2) / 1448 * sheetRect.width + sheetRect.left - gridRect.left;
      const topPx = (Number(point.y) - radialSize / 2) / 1086 * sheetRect.height + sheetRect.top - gridRect.top;
      const widthPx = radialSize / 1448 * sheetRect.width;
      const heightPx = radialSize / 1086 * sheetRect.height;
      node.style.setProperty("left", `${leftPx / gridRect.width * 100}%`, "important");
      node.style.setProperty("top", `${topPx / gridRect.height * 100}%`, "important");
      node.style.setProperty("width", `${widthPx / gridRect.width * 100}%`, "important");
      node.style.setProperty("height", `${heightPx / gridRect.height * 100}%`, "important");
    } else {
      // Fallback seguro si Foundry aún no ha calculado las dimensiones.
      node.style.setProperty("left", `${(Number(point.x) - radialSize / 2) / 1448 * 100}%`, "important");
      node.style.setProperty("top", `${(Number(point.y) - radialSize / 2) / 1086 * 100}%`, "important");
      node.style.setProperty("width", `${radialSize / 1448 * 100}%`, "important");
      node.style.setProperty("height", `${radialSize / 1086 * 100}%`, "important");
    }
    node.style.setProperty("max-width", "none", "important");
    node.style.setProperty("max-height", "none", "important");
    node.style.setProperty("transform", "none", "important");
    return true;
  };
  const gridPositionForSlot = physicalSlot => {
    const mapped = slotPositions?.[physicalSlot - 1];
    return mapped && Number.isFinite(Number(mapped.row)) && Number.isFinite(Number(mapped.column))
      ? mapped
      : { row: Math.ceil(physicalSlot / columns), column: ((physicalSlot - 1) % columns) + 1 };
  };
  const itemBySlot = new Map();
  if (preserveSlots) {
    for (const item of sourceEntries) {
      const slot = Number(item.getFlag?.(MODULE_ID, slotField)) || 0;
      if (slot >= 1 && slot <= capacity && !itemBySlot.has(slot)) itemBySlot.set(slot, item);
    }
  }
  const usedSlots = preserveSlots ? new Set(itemBySlot.keys()) : new Set();
  const addAction = String(options.addAction ?? "").trim();
  const nextPrioritySlot = preserveSlots && addAction && sourceEntries.length < capacity
    ? slotPriority.find(slot => slot >= 1 && slot <= capacity && !usedSlots.has(slot)) ?? null
    : null;

  // 0.24.198: renderizar en append-only y reconciliar por posición física.
  // Los nodos exteriores existentes se reutilizan para evitar el vaciado visual.
  const previousChildren = Array.from(grid.children);
  const previousCount = previousChildren.length;
  grid.dataset.count = String(sourceEntries.length);
  grid.style.setProperty("display", radialCenters ? "block" : "grid", "important");
  grid.style.setProperty("position", radialCenters ? "absolute" : "relative", "important");
  if (radialCenters) {
    grid.style.setProperty("left", "0", "important");
    grid.style.setProperty("top", "0", "important");
    grid.style.setProperty("right", "0", "important");
    grid.style.setProperty("bottom", "0", "important");
    grid.style.setProperty("pointer-events", "none", "important");
  }
  grid.style.setProperty("width", "100%", "important");
  grid.style.setProperty("height", "100%", "important");
  grid.style.setProperty("min-width", "0", "important");
  grid.style.setProperty("min-height", "0", "important");
  grid.style.setProperty("grid-template-columns", `repeat(${columns}, minmax(0, 1fr))`, "important");
  grid.style.setProperty("grid-template-rows", `repeat(${rows}, minmax(0, 1fr))`, "important");
  grid.style.setProperty("grid-auto-flow", "row", "important");
  grid.style.setProperty("gap", "0", "important");
  grid.style.setProperty("column-gap", "0", "important");
  grid.style.setProperty("row-gap", "0", "important");
  grid.style.setProperty("min-width", "0", "important");
  grid.style.setProperty("min-height", "0", "important");

  const renderSlot = (item, physicalSlot) => {
    // In preserved-slot mode, empty positions remain empty DOM cells. This is
    // intentional: items do not slide into a different engraved zone.
    if (!item) {
      if (preserveSlots && physicalSlot === nextPrioritySlot) return;
      const empty = document.createElement("div");
      empty.className = `${slotClass} ha-kona-item-grid-empty-slot`;
      empty.setAttribute("aria-hidden", "true");
      if (radialCenters) {
        applyRadialGeometry(empty, physicalSlot);
      } else if (preserveSlots) {
        const position = gridPositionForSlot(physicalSlot);
        empty.style.setProperty("grid-row", String(position.row), "important");
        empty.style.setProperty("grid-column", String(position.column), "important");
      }
      empty.style.setProperty("min-width", "0", "important");
      empty.style.setProperty("min-height", "0", "important");
      empty.style.setProperty("pointer-events", "none", "important");
      grid.appendChild(empty);
      return;
    }

    const name = String(item?.name ?? "Elemento");
    const slot = document.createElement("div");
    slot.className = slotClass;
    slot.dataset[datasetKey] = String(item.id ?? "");
    slot.title = name;
    slot.setAttribute("data-tooltip", name);
    slot.setAttribute("data-tooltip-direction", "UP");
    slot.setAttribute("role", "button");
    slot.setAttribute("tabindex", "0");
    slot.setAttribute("aria-label", `${ariaPrefix}: ${name}`);
    if (radialCenters) {
      applyRadialGeometry(slot, physicalSlot);
    } else if (preserveSlots) {
      const position = gridPositionForSlot(physicalSlot);
      slot.style.setProperty("grid-row", String(position.row), "important");
      slot.style.setProperty("grid-column", String(position.column), "important");
    }
    slot.style.setProperty("box-sizing", "border-box", "important");
    slot.style.setProperty("display", "flex", "important");
    slot.style.setProperty("align-items", "center", "important");
    slot.style.setProperty("justify-content", "center", "important");
    if (!radialCenters) {
      slot.style.setProperty("width", "100%", "important");
      slot.style.setProperty("height", "100%", "important");
    }
    slot.style.setProperty("min-width", "0", "important");
    slot.style.setProperty("min-height", "0", "important");
    slot.style.setProperty("padding", "0", "important");
    slot.style.setProperty("margin", "0", "important");
    slot.style.setProperty("border", "0", "important");
    slot.style.setProperty("background", "transparent", "important");
    const isTerritorySlot = slotClass.includes("ha-biomas-row");
    const isInstrumentSlot = slotClass.includes("ha-sentir-instrumento-row");
    const isRitualSlot = slotClass.includes("ha-ritual-item-row");
    // Rituales amplían el arte fuera del hitbox de 70u; el contenedor no debe recortarlo.
    slot.style.setProperty("overflow", (isTerritorySlot || isInstrumentSlot || isRitualSlot) ? "visible" : overflow, "important");
    slot.style.setProperty("cursor", "pointer", "important");

    const icon = createHiperaMiniItemIcon(item, iconClass);
    icon.title = name;
    icon.setAttribute("data-tooltip", name);
    icon.setAttribute("data-tooltip-direction", "UP");
    icon.setAttribute("aria-label", name);
    icon.style.setProperty("display", "block", "important");
    icon.style.setProperty("width", "100%", "important");
    icon.style.setProperty("height", "100%", "important");
    icon.style.setProperty("min-width", "0", "important");
    icon.style.setProperty("min-height", "0", "important");
    icon.style.setProperty("max-width", "100%", "important");
    icon.style.setProperty("max-height", "100%", "important");
    icon.style.setProperty("object-fit", "contain", "important");
    icon.style.setProperty("border", "0", "important");
    icon.style.setProperty("border-radius", "0", "important");
    icon.style.setProperty("background", "transparent", "important");
    icon.style.setProperty("pointer-events", "none", "important");
    if (isInstrumentSlot && options.iconScaleByCount && !radialCenters) {
      const scale = Number(options.iconScaleByCount[sourceEntries.length] ?? options.iconScaleByCount.default ?? 1);
      if (Number.isFinite(scale) && scale > 0) {
        icon.style.setProperty("transform", `scale(${scale})`, "important");
        icon.style.setProperty("transform-origin", String(options.iconTransformOrigin ?? "center center"), "important");
      }
    }
    if (isTerritorySlot) {
      for (const prop of ["width", "height", "max-width", "max-height"]) {
        icon.style.setProperty(prop, "99.1875%", "important");
      }
      icon.style.setProperty("flex", "0 0 99.1875%", "important");
      icon.style.setProperty("margin", "0", "important");
      // 0.24.188: agranda sólo el arte visible, sin mover el centro ni el hitbox.
      // El anclaje inferior-derecho mantiene fija esa esquina al escalar.
      icon.style.setProperty("transform", "scale(1.3)", "important");
      icon.style.setProperty("transform-origin", "100% 100%", "important");
    }
    slot.appendChild(icon);
    grid.appendChild(slot);
  };

  if (preserveSlots) {
    for (let slot = 1; slot <= capacity; slot++) renderSlot(itemBySlot.get(slot) ?? null, slot);
  } else {
    sourceEntries.forEach((item, index) => renderSlot(item, index + 1));
  }

  // The add control occupies the next priority zone without moving the
  // underlying engraved positions or replacing another Item's receiver.
  if (addAction && sourceEntries.length < capacity) {
    const add = document.createElement("button");
    add.type = "button";
    add.className = `${slotClass} ha-kona-add-item`;
    add.dataset.haKonaAdd = addAction;
    add.textContent = "+";
    add.title = String(options.hoverLabel ?? options.addLabel ?? addAction);
    add.setAttribute("aria-label", add.title);
    add.setAttribute("data-tooltip", add.title);
    add.setAttribute("data-tooltip-direction", "UP");
    add.style.setProperty("box-sizing", "border-box", "important");
    add.style.setProperty("display", "flex", "important");
    add.style.setProperty("align-items", "center", "important");
    add.style.setProperty("justify-content", "center", "important");
    if (!radialCenters) {
      add.style.setProperty("width", "100%", "important");
      add.style.setProperty("height", "100%", "important");
    }
    add.style.setProperty("min-width", "0", "important");
    add.style.setProperty("min-height", "0", "important");
    add.style.setProperty("padding", "0", "important");
    add.style.setProperty("margin", "0", "important");
    add.style.setProperty("appearance", "none", "important");
    add.style.setProperty("position", "relative", "important");
    add.style.setProperty("z-index", "70", "important");
    add.style.setProperty("border", "0", "important");
    add.style.setProperty("outline", "0", "important");
    add.style.setProperty("background", "transparent", "important");
    add.style.setProperty("box-shadow", "none", "important");
    add.style.setProperty("border-radius", "0", "important");
    add.style.setProperty("cursor", "pointer", "important");
    add.style.setProperty("pointer-events", "auto", "important");
    if (radialCenters && nextPrioritySlot) {
      applyRadialGeometry(add, nextPrioritySlot);
      add.style.setProperty("position", "absolute", "important");
    } else if (preserveSlots && nextPrioritySlot) {
      const position = gridPositionForSlot(nextPrioritySlot);
      add.style.setProperty("grid-row", String(position.row), "important");
      add.style.setProperty("grid-column", String(position.column), "important");
    }
    if (slotClass.includes("ha-biomas-row")) {
      add.style.setProperty("position", "absolute", "important");
      add.style.setProperty("overflow", "visible", "important");
    }
    grid.appendChild(add);
  }

  const desiredChildren = Array.from(grid.children).slice(previousCount);
  const syncAttributes = (target, source) => {
    for (const attr of Array.from(target.attributes)) {
      if (!source.hasAttribute(attr.name)) target.removeAttribute(attr.name);
    }
    for (const attr of Array.from(source.attributes)) target.setAttribute(attr.name, attr.value);
    target.style.cssText = source.style.cssText;
    if (target.tagName === "IMG" && source.tagName === "IMG") {
      if (target.getAttribute("src") !== source.getAttribute("src")) target.setAttribute("src", source.getAttribute("src") ?? "");
      target.alt = source.alt;
    } else if (target.textContent !== source.textContent && !source.children.length) {
      target.textContent = source.textContent;
    } else if (source.children.length) {
      const sameShape = target.children.length === source.children.length &&
        Array.from(source.children).every((child, index) => child.tagName === target.children[index]?.tagName && child.className === target.children[index]?.className);
      if (sameShape) Array.from(source.children).forEach((child, index) => syncAttributes(target.children[index], child));
      else target.replaceChildren(...Array.from(source.children).map(child => child.cloneNode(true)));
    }
  };
  const finalNodes = [];
  for (let index = 0; index < desiredChildren.length; index++) {
    const desired = desiredChildren[index];
    const existing = previousChildren[index];
    if (existing && existing.tagName === desired.tagName && existing.className === desired.className) {
      syncAttributes(existing, desired);
      finalNodes.push(existing);
    } else finalNodes.push(desired);
  }
  // Quitar nodos antiguos excedentes y anexar sólo los nodos realmente nuevos.
  for (const node of previousChildren) if (!finalNodes.includes(node)) node.remove();
  for (const node of desiredChildren) if (!finalNodes.includes(node)) node.remove();
  finalNodes.forEach((node, index) => {
    const atIndex = grid.children[index];
    if (atIndex !== node) grid.insertBefore(node, atIndex ?? null);
  });
  while (grid.children.length > finalNodes.length) grid.lastElementChild.remove();
}
function renderKonaRitualItems(canvas, actor) {
  if (!canvas || !actor) return;

  const itemRituals = getKonaRitualItems(actor);
  let area = canvas.querySelector(".ha-ritual-items-area");
  if (!area) {
    area = document.createElement("div");
    area.className = "ha-ritual-items-area";
    area.dataset.haRitualItems = "1";
    canvas.appendChild(area);
  }

  const hasItems = itemRituals.length > 0;
  if (canvas.classList.contains("ha-kona-experimental-sheet")) {
    area.style.setProperty("position", "absolute", "important");
    area.style.setProperty("left", "0", "important");
    area.style.setProperty("top", "0", "important");
    area.style.setProperty("width", "100%", "important");
    area.style.setProperty("height", "100%", "important");
    area.style.setProperty("max-height", "100%", "important");
    area.style.setProperty("overflow", "visible", "important");
    area.style.setProperty("pointer-events", "none", "important");
    area.style.setProperty("display", "block", "important");
  }
  area.style.setProperty("visibility", "visible", "important");
  area.title = "Rituales";
  area.setAttribute("aria-label", "Rituales");
  if (canvas.classList.contains("ha-kona-experimental-sheet")) {
    area.style.setProperty("overflow", "visible", "important");
  }
  // 0.24.102: el recuadro común sustituye por completo los campos/textos antiguos.
  // Los datos legacy permanecen en el Actor, pero no se duplican visualmente.
  setLegacyRitualFieldsVisible(canvas, false);
  area.replaceChildren();

  const grid = document.createElement("div");
  grid.className = "ha-ritual-items-grid";
  grid.dataset.haKonaItemGrid = "rituales";
  area.appendChild(grid);
  renderKonaItemGrid(grid, itemRituals, {
    columns: 2,
    rows: 2,
    slotClass: "ha-ritual-item-row ha-kona-item-grid-slot",
    iconClass: "ha-mini-item-icon ha-ritual-item-icon",
    datasetKey: "haRitualItem",
    ariaPrefix: "Abrir Ritual",
    overflow: "hidden",
    addAction: "rituales",
    addLabel: "Agregar ritual",
    hoverLabel: "Agregar ritual",
    // Always preserve the four physical cells. Legacy Rituals without a flag
    // remain temporarily unplaced until repair assigns their persistent slot;
    // they never flash into a different cell or get compacted.
    preserveSlots: true,
    slotField: "ritualSlot",
    slotPriority: KONA_SLOT_PRIORITY,
    radialCenters: canvas.classList.contains("ha-kona-experimental-sheet") ? [
      { x: 639.9, y: 155.1 }, { x: 544.4, y: 207.8 },
      { x: 561.5, y: 313.1 }, { x: 641.3, y: 270.4 }
    ] : null,
    radialSize: 70
  });
}

function getHiperaRitualTemplate() {
  const stable = game.items?.get?.(HIPERA_RITUAL_TEMPLATE_ID);
  if (stable?.type === "_equippableItemTemplate") return stable;
  return game.items?.find?.(item =>
    item?.type === "_equippableItemTemplate" &&
    (
      item.name === HIPERA_RITUAL_TEMPLATE_NAME ||
      String(item.getFlag?.(MODULE_ID, "kind") ?? "") === "ritual-template"
    )
  ) ?? null;
}

function ritualTemplateSystemData() {
  const richField = (key, cssClass, tooltip) => ({
    key,
    cssClass,
    role: 0,
    editRole: 0,
    permission: 0,
    tooltip,
    visibilityFormula: "",
    editableFormula: "",
    label: "",
    defaultValue: "",
    style: "dialog",
    type: "textArea"
  });

  return {
    body: {
      contents: [
        richField("procedimiento", "ha-ritual-procedimiento", "Procedimiento del Ritual"),
        richField("correspondencias", "ha-ritual-correspondencias", "Correspondencias requeridas cuando corresponda"),
        richField("coste", "ha-ritual-coste", "Coste de Newén cuando corresponda"),
        richField("notas", "ha-ritual-notas", "Notas del Ritual")
      ],
      key: "custom_body",
      cssClass: "ha-ritual-sheet",
      role: 0,
      editRole: 0,
      permission: 0,
      tooltip: "",
      visibilityFormula: "",
      editableFormula: "",
      flow: "vertical",
      align: "left",
      verticalAlign: "top",
      type: "panel"
    },
    display: {
      width: 543,
      height: 408,
      fix_size: false,
      pp_width: 64,
      pp_height: 64
    },
    header: {
      contents: [],
      key: "custom_header",
      cssClass: "",
      type: "panel"
    },
    hidden: [],
    modifiers: [],
    templateSystemUniqueVersion: 166001
  };
}

async function ensureHiperaRitualTemplate() {
  let stable = game.items?.get?.(HIPERA_RITUAL_TEMPLATE_ID) ?? null;

  // A failed earlier prototype can leave our deterministic ID occupied by the
  // wrong document type. If it is clearly one of our own residues, remove it
  // before rebuilding the canonical CSB template.
  if (stable && stable.type !== "_equippableItemTemplate") {
    const ours =
      stable.name === HIPERA_RITUAL_TEMPLATE_NAME ||
      String(stable.getFlag?.(MODULE_ID, "kind") ?? "").startsWith("ritual");

    if (ours && game.user?.isGM) {
      await stable.delete({ render: false });
      stable = null;
    } else {
      console.error(`MELIAZ Bridge: ${HIPERA_RITUAL_TEMPLATE_ID} está ocupado por un Item ajeno/no compatible.`, stable);
      return null;
    }
  }

  if (stable?.type === "_equippableItemTemplate") {
    // Repair every GM ready/open pass. This is deliberately idempotent and
    // prevents stale body/template data from surviving a module replacement.
    if (game.user?.isGM) {
      await stable.update({
        name: HIPERA_RITUAL_TEMPLATE_NAME,
        img: "icons/svg/book.svg",
        system: ritualTemplateSystemData(),
        [`flags.${MODULE_ID}.kind`]: "ritual-template"
      }, { render: false });
    }
    return stable;
  }

  if (!game.user?.isGM) return getHiperaRitualTemplate();

  const oldTemplate = game.items?.find?.(item =>
    item?.type === "_equippableItemTemplate" &&
    item.id !== HIPERA_RITUAL_TEMPLATE_ID &&
    (
      item.name === HIPERA_RITUAL_TEMPLATE_NAME ||
      String(item.getFlag?.(MODULE_ID, "kind") ?? "") === "ritual-template"
    )
  ) ?? null;

  const template = await Item.create({
    _id: HIPERA_RITUAL_TEMPLATE_ID,
    name: HIPERA_RITUAL_TEMPLATE_NAME,
    type: "_equippableItemTemplate",
    img: "icons/svg/book.svg",
    system: ritualTemplateSystemData(),
    flags: {
      [MODULE_ID]: { kind: "ritual-template", migratedFrom: oldTemplate?.id ?? null }
    }
  }, { keepId: true });

  return template ?? null;
}

function hiperaCloneTemplateData(value) {
  if (value == null) return value;
  try {
    if (globalThis.foundry?.utils?.deepClone) return foundry.utils.deepClone(value);
    if (typeof structuredClone === "function") return structuredClone(value);
    return JSON.parse(JSON.stringify(value));
  } catch (error) {
    console.warn("MELIAZ Bridge: no pude clonar una parte de la plantilla; se conserva el original.", error);
    return value;
  }
}

function hiperaMergeCsbPanelDefinitions(templatePanel, legacyPanel) {
  if (!templatePanel) return hiperaCloneTemplateData(legacyPanel);
  if (!legacyPanel) return hiperaCloneTemplateData(templatePanel);

  const merged = {
    ...hiperaCloneTemplateData(legacyPanel),
    ...hiperaCloneTemplateData(templatePanel)
  };
  const templateContents = Array.isArray(templatePanel.contents) ? templatePanel.contents : [];
  const legacyContents = Array.isArray(legacyPanel.contents) ? legacyPanel.contents : [];
  const legacyByKey = new Map(legacyContents.filter(field => field?.key).map(field => [String(field.key), field]));
  const templateKeys = new Set();

  merged.contents = templateContents.map(field => {
    const key = String(field?.key ?? "");
    if (!key) return hiperaCloneTemplateData(field);
    templateKeys.add(key);
    const oldField = legacyByKey.get(key);
    // New template controls the schema; legacy-only metadata is not discarded.
    return oldField
      ? { ...hiperaCloneTemplateData(oldField), ...hiperaCloneTemplateData(field) }
      : hiperaCloneTemplateData(field);
  });
  for (const oldField of legacyContents) {
    const key = String(oldField?.key ?? "");
    if (key && !templateKeys.has(key)) merged.contents.push(hiperaCloneTemplateData(oldField));
  }
  return merged;
}

async function applyHiperaTemplateWithoutContentLoss(item, template, kind, version) {
  if (!item || !template || item.type !== "equippableItem") return false;
  const before = item.toObject();
  const oldSystem = hiperaCloneTemplateData(before.system ?? {});
  const oldProps = hiperaCloneTemplateData(oldSystem.props ?? {});
  const oldBody = hiperaCloneTemplateData(oldSystem.body);
  const oldHeader = hiperaCloneTemplateData(oldSystem.header);
  const oldDisplay = hiperaCloneTemplateData(oldSystem.display);
  const oldHidden = hiperaCloneTemplateData(oldSystem.hidden);
  const oldModifiers = hiperaCloneTemplateData(oldSystem.modifiers);

  // One-time, persistent recovery point. Never replace an earlier snapshot.
  const existingBackup = item.getFlag?.(MODULE_ID, "templateContentBackupV1");
  if (!existingBackup) {
    const backup = {
      schema: 1,
      capturedAt: new Date().toISOString(),
      kind,
      originalTemplate: String(oldSystem.template ?? ""),
      originalTemplateSystemUniqueVersion: Number(oldSystem.templateSystemUniqueVersion ?? 0),
      props: oldProps,
      body: oldBody,
      header: oldHeader,
      display: oldDisplay,
      hidden: oldHidden,
      modifiers: oldModifiers,
      unique: oldSystem.unique ?? false,
      uniqueId: String(oldSystem.uniqueId ?? "")
    };
    try {
      await item.setFlag(MODULE_ID, "templateContentBackupV1", backup);
    } catch (error) {
      console.error("MELIAZ Bridge: migración cancelada; no se pudo guardar el respaldo de contenido.", item, error);
      return false;
    }
  }

  const newProps = { ...(oldProps ?? {}), hipera_tipo: kind };
  try {
    await item.update({
      "system.template": template.id,
      "system.props": newProps,
      "system.unique": false,
      "system.uniqueId": "",
      [`flags.${MODULE_ID}.kind`]: kind
    }, { render: false });

    // CSB may replace body/header definitions. Restore data and retain any
    // old-only custom fields after applying the new template's current schema.
    await item.templateSystem?.reloadTemplate?.(template.id);

    const reloadedSystem = hiperaCloneTemplateData(item.system ?? {});
    const patch = {
      "system.props": newProps,
      "system.unique": false,
      "system.uniqueId": "",
      [`flags.${MODULE_ID}.kind`]: kind,
      "system.templateSystemUniqueVersion": Number(version) || 1,
      [`flags.${MODULE_ID}.templateMigrationV1`]: {
        version: Number(version) || 1,
        completedAt: new Date().toISOString(),
        contentBackup: "templateContentBackupV1"
      }
    };

    if (oldBody || reloadedSystem.body) {
      patch["system.body"] = hiperaMergeCsbPanelDefinitions(reloadedSystem.body, oldBody);
    }
    if (oldHeader || reloadedSystem.header) {
      patch["system.header"] = hiperaMergeCsbPanelDefinitions(reloadedSystem.header, oldHeader);
    }
    // Preserve item-specific display settings. The template migration must not
    // resize or otherwise alter the item's existing presentation unexpectedly.
    if (oldDisplay !== undefined) patch["system.display"] = oldDisplay;
    if (oldHidden !== undefined) patch["system.hidden"] = oldHidden;
    if (oldModifiers !== undefined) patch["system.modifiers"] = oldModifiers;

    await item.update(patch, { render: false });

    const restoredProps = item.system?.props ?? {};
    const lostKeys = Object.keys(oldProps ?? {}).filter(key =>
      JSON.stringify(restoredProps[key]) !== JSON.stringify(oldProps[key])
    );
    if (lostKeys.length) {
      await item.update({ "system.props": newProps }, { render: false });
      console.error(`MELIAZ Bridge: se restauraron propiedades tras migrar ${item.name}.`, lostKeys);
    }
    return true;
  } catch (error) {
    // Best-effort rollback of the content-bearing CSB data. The persistent
    // backup flag remains available even if a future CSB API change intervenes.
    try {
      const rollback = { "system.props": newProps };
      if (oldBody !== undefined) rollback["system.body"] = oldBody;
      if (oldHeader !== undefined) rollback["system.header"] = oldHeader;
      if (oldDisplay !== undefined) rollback["system.display"] = oldDisplay;
      if (oldHidden !== undefined) rollback["system.hidden"] = oldHidden;
      if (oldModifiers !== undefined) rollback["system.modifiers"] = oldModifiers;
      await item.update(rollback, { render: false });
    } catch (rollbackError) {
      console.error("MELIAZ Bridge: falló la restauración inmediata; el respaldo persistente sigue en el Item.", rollbackError);
    }
    console.error(`MELIAZ Bridge: migración segura falló para ${item.name}; se conservó respaldo.`, error);
    return false;
  }
}

async function normalizeRitualItem(item, template) {
  return applyHiperaTemplateWithoutContentLoss(item, template, "ritual", 166001);
}

async function openHiperaRitualItem(item) {
  if (!item || item.type !== "equippableItem") return;

  try {
    const template = await ensureHiperaRitualTemplate();
    if (!template) {
      ui.notifications.error("MELIAZ: falta la plantilla canónica de Ritual.");
      return;
    }

    const linked = game.items?.get?.(String(item.system?.template ?? ""));
    const staleVersion = Number(item.system?.templateSystemUniqueVersion ?? 0) !== 166001;
    if (linked?.id !== template.id || linked?.type !== "_equippableItemTemplate" || staleVersion) {
      await normalizeRitualItem(item, template);
    }

    // Give CSB one microtask to rebuild its TemplateSystem after reloadTemplate.
    await Promise.resolve();

    const sheet = item.sheet;
    if (!sheet) {
      console.error("MELIAZ Bridge: Item-Ritual sin sheet después de reparar template.", item);
      ui.notifications.error("MELIAZ: el Ritual existe, pero CSB no entregó una hoja para abrirlo.");
      return;
    }

    sheet.render(true);
  } catch (err) {
    console.error("MELIAZ Bridge: error reparando/abriendo hoja de Ritual.", err, item);
    ui.notifications.error("MELIAZ: no pude reparar y abrir la hoja del Ritual.");
  }
}

async function repairHiperaRitualItems(actor) {
  if (!actor?.items) return;
  const ritualItems = Array.from(actor.items).filter(isHiperaRitualItem);
  if (!ritualItems.length) return;

  const template = await ensureHiperaRitualTemplate();
  if (!template) return;

  // Ritual Items are never auto-deleted or deduplicated. Multiple Kona may know
  // the same Ritual, and several embedded copies are valid Foundry documents.
  for (const item of ritualItems) {
    const currentTemplate = game.items?.get?.(String(item.system?.template ?? ""));
    const needsTemplateRepair = currentTemplate?.type !== "_equippableItemTemplate" || currentTemplate.id !== template.id;
    const needsUniqueRepair = Boolean(item.system?.unique) || Boolean(String(item.system?.uniqueId ?? ""));
    const needsVersionRepair = Number(item.system?.templateSystemUniqueVersion ?? 0) !== 166001;
    if (needsTemplateRepair || needsUniqueRepair || needsVersionRepair) {
      await normalizeRitualItem(item, template);
    }
  }
}

function inferHiperaItemKind(item) {
  if (!item || item.type !== "equippableItem") return null;

  const flagKind = String(item.getFlag?.(MODULE_ID, "kind") ?? "").trim().toLowerCase();
  if (["ritual","reliquia","arma","equipo","instrumento","defensa","armadura","flora","fauna","funga","bioma"].includes(flagKind)) return flagKind;

  if (item.flags?.["hiperaustralis-bioma-item"]) return "bioma";
  if (item.flags?.["hiperaustralis-flora-item"]) return "flora";
  if (item.flags?.["hiperaustralis-fauna-item"]) return "fauna";
  if (item.flags?.["hiperaustralis-funga-item"]) return "funga";
  if (item.flags?.["hiperaustralis-equipo"]) return "equipo";
  if (item.flags?.["hiperaustralis-instrumentos"]) return "instrumento";
  if (item.flags?.["hiperaustralis-armas"]) return "arma";
  if (item.flags?.["hiperaustralis-defensas"]) return "defensa";

  const propKind = String(item.system?.props?.hipera_tipo ?? "").trim().toLowerCase();
  if (["ritual","reliquia","arma","equipo","instrumento","defensa","armadura","flora","fauna","funga","bioma"].includes(propKind)) return propKind;

  const templateId = String(item.system?.template ?? "");
  if (templateId === HIPERA_RITUAL_TEMPLATE_ID) return "ritual";
  if (templateId === HIPERA_RELIQUIA_TEMPLATE_ID) return "reliquia";
  if (templateId === HIPERA_ARMA_TEMPLATE_ID) return "arma";

  const linked = game.items?.get?.(templateId);
  const linkedKind = String(linked?.getFlag?.(MODULE_ID, "kind") ?? "").trim().toLowerCase();
  if (linkedKind === "ritual-template") return "ritual";
  if (linkedKind === "reliquia-template") return "reliquia";

  return null;
}

const KONA_COMPENDIUM_TARGETS = {
  equipo: { label: "Equipo", kinds: ["arma", "equipo", "defensa"], documentNames: ["Item"] },
  territorio: { label: "Territorio", kinds: ["flora", "fauna", "funga", "bioma"], documentNames: ["JournalEntry"] },
  reliquias: { label: "Reliquias", kinds: ["reliquia"], documentNames: ["Item"] },
  instrumentos: { label: "Instrumentos", kinds: ["instrumento"], documentNames: ["Item"] },
  rituales: { label: "Rituales", kinds: ["ritual"], documentNames: ["Item"] },
  arma: { label: "Arma", kinds: ["arma"], documentNames: ["Item"] },
  defensa: { label: "Defensa", kinds: ["defensa"], documentNames: ["Item"] }
};

function konaCompendiumPackLabel(pack) {
  return String(pack?.metadata?.label ?? pack?.title ?? pack?.collection ?? "Compendio");
}

function konaCompendiumIndexKind(entry) {
  const direct = String(entry?.flags?.[MODULE_ID]?.kind ?? entry?.system?.props?.hipera_tipo ?? "").trim().toLowerCase();
  if (direct) return direct;
  if (entry?.flags?.["hiperaustralis-bioma-item"]) return "bioma";
  if (entry?.flags?.["hiperaustralis-flora-item"]) return "flora";
  if (entry?.flags?.["hiperaustralis-fauna-item"]) return "fauna";
  if (entry?.flags?.["hiperaustralis-funga-item"]) return "funga";
  if (entry?.flags?.["hiperaustralis-instrumentos"]) return "instrumento";
  if (entry?.flags?.["hiperaustralis-armas"]) return "arma";
  if (entry?.flags?.["hiperaustralis-defensas"]) return "defensa";
  return "";
}

async function addKonaCompendiumSource(canvas, actor, target, source) {
  const config = KONA_COMPENDIUM_TARGETS[target];
  if (!canvas || !actor || !config || !source) return false;

  if (target === "territorio" && source.documentName === "JournalEntry") {
    const refs = actor.getFlag(MODULE_ID, "biomasRefs") ?? [];
    const count = hiperaNaturalezaItems(actor).length + refs.length;
    if (!hiperaBoxHasCapacity(actor, count, "Territorio / Naturaleza")) return false;
    const uuid = String(source.uuid ?? "");
    if (!uuid) return false;
    if (refs.some(entry => entry.uuid === uuid)) {
      ui.notifications.info(`${source.name} ya está en Territorio.`);
      return false;
    }
    const folderName = String(source.folder?.name ?? "").trim();
    const parentFolderName = String(source.folder?.folder?.name ?? "").trim();
    await actor.setFlag(MODULE_ID, "biomasRefs", [...refs, {
      uuid, name: source.name, img: source.img || "icons/svg/book.svg",
      category: folderName, territory: parentFolderName
    }]);
    installHiperaBiomas(canvas, actor);
    ui.notifications.info(`${source.name} añadido a Territorio como referencia.`);
    return true;
  }

  if (source.documentName !== "Item" || source.type !== "equippableItem") {
    ui.notifications.warn("El documento seleccionado no es un Item compatible con esta sección.");
    return false;
  }
  const kind = inferHiperaItemKind(source);
  if (!config.kinds.includes(kind)) {
    ui.notifications.warn(`El documento no corresponde a ${config.label}.`);
    return false;
  }

  if (target === "equipo") {
    const ok = await attachHiperaArmaToEquipo(actor, source);
    if (ok) installHiperaEquipoSlotIcons(canvas, actor);
    return ok;
  }

  if (target === "arma" || target === "defensa") {
    const slot = target === "arma" ? "arma" : "armadura";
    if (slot === "armadura" && !isHiperaArmorOficio(actor)) return false;
    if (getHiperaNequeLoadoutItem(actor, slot)) {
      ui.notifications.warn(`${config.label}: el espacio ya está ocupado.`);
      return false;
    }
    const ok = await attachHiperaNequeLoadout(actor, source, slot);
    if (ok) renderHiperaNequeLoadout(canvas, actor);
    return ok;
  }

  if (target === "instrumentos") {
    const ok = await attachHiperaInstrumentoToSentir(actor, source);
    if (ok) renderKonaInstrumentos(canvas, actor);
    return ok;
  }

  if (target === "rituales") {
    await repairKonaRitualSlotPersistence(actor);
    const count = getKonaRitualItems(actor).length;
    if (!hiperaBoxHasCapacity(actor, count, "Rituales")) return false;
    const data = source.toObject();
    delete data._id; delete data.folder; delete data.ownership; delete data._stats;
    data.flags ??= {}; data.flags[MODULE_ID] ??= {};
    data.flags[MODULE_ID].kind = "ritual";
    const occupiedRitualSlots = new Set(getKonaRitualItems(actor)
      .map(item => Number(item.getFlag?.(MODULE_ID, "ritualSlot")) || 0)
      .filter(slot => slot >= 1 && slot <= 4));
    const ritualSlot = nextKonaPrioritySlot(occupiedRitualSlots);
    if (!ritualSlot) return false;
    data.flags[MODULE_ID].ritualSlot = ritualSlot;
    data.system ??= {}; data.system.props ??= {};
    data.system.props.hipera_tipo = "ritual";
    data.system.unique = false; data.system.uniqueId = "";
    const created = await actor.createEmbeddedDocuments("Item", [data]);
    const embedded = created?.[0] ?? null;
    if (!embedded) return false;
    const template = await ensureHiperaRitualTemplate();
    if (template) await normalizeRitualItem(embedded, template);
    renderKonaRitualItems(canvas, actor);
    ui.notifications.info(`${source.name} añadido a Rituales.`);
    return true;
  }

  if (target === "reliquias") {
    const count = getKonaReliquiaItems(actor).length;
    if (!hiperaBoxHasCapacity(actor, count, "Reliquias", getKonaReliquiaTempleCapacity(actor))) return false;
    const data = source.toObject();
    delete data._id; delete data.folder; delete data.ownership; delete data._stats;
    data.flags ??= {}; data.flags[MODULE_ID] ??= {};
    data.flags[MODULE_ID].kind = "reliquia";
    data.system ??= {}; data.system.props ??= {};
    data.system.props.hipera_tipo = "reliquia";
    data.system.unique = false; data.system.uniqueId = "";
    const created = await actor.createEmbeddedDocuments("Item", [data]);
    const embedded = created?.[0] ?? null;
    if (!embedded) return false;
    const template = await ensureHiperaReliquiaTemplate();
    if (template) await normalizeReliquiaItem(embedded, template);
    renderKonaReliquiaItems(canvas, actor);
    ui.notifications.info(`${source.name} añadido a Reliquias.`);
    return true;
  }

  if (target === "territorio") {
    const count = hiperaNaturalezaItems(actor).length + (actor.getFlag(MODULE_ID, "biomasRefs") ?? []).length;
    if (!hiperaBoxHasCapacity(actor, count, "Territorio / Naturaleza")) return false;
    const marker = hiperaSeedMarker(source, kind);
    const duplicate = actor.items?.some?.(item => inferHiperaItemKind(item) === kind && hiperaSeedMarker(item, kind) === marker);
    if (duplicate) {
      ui.notifications.info(`${source.name} ya está en Territorio.`);
      return false;
    }
    const data = source.toObject();
    delete data._id; delete data.folder; delete data.ownership; delete data._stats;
    data.flags ??= {}; data.flags[MODULE_ID] ??= {};
    data.flags[MODULE_ID].kind = kind;
    data.system ??= {}; data.system.props ??= {};
    data.system.unique = false; data.system.uniqueId = "";
    const created = await actor.createEmbeddedDocuments("Item", [data]);
    if (!created?.length) return false;
    installHiperaBiomas(canvas, actor);
    ui.notifications.info(`${source.name} añadido a Territorio.`);
    return true;
  }
  return false;
}

const KONA_TERRITORY_BIOMAS = [
  "Titicaca — Altiplano lacustre",
  "Paititi — Bosque nublado de la vertiente oriental",
  "Ngulumapu — Bosque templado lluvioso",
  "Pewenmapu — Bosque de pewen y cordillera volcánica",
  "Patagonia austral — Estepa, bosque subantártico y campos de hielo",
  "Tierra del Fuego — Estepa, bosque austral y turbera",
  "Canales australes — Maritorio archipelágico",
  "Umbral Polar"
];
const KONA_TERRITORY_CATEGORIES = ["Flora", "Fauna", "Funga"];

function findKonaTerritoryPack() {
  const direct = game.packs?.get?.("world.territorio");
  if (direct?.documentName === "JournalEntry") return direct;
  const candidates = Array.from(game.packs ?? []).filter(pack =>
    pack?.documentName === "JournalEntry" &&
    (String(pack.collection ?? "").startsWith("world.") || String(pack.metadata?.package ?? "") === "world")
  );
  return candidates.find(pack => {
    const label = String(pack.metadata?.label ?? pack.title ?? "").trim().toLocaleLowerCase("es");
    const name = String(pack.metadata?.name ?? pack.name ?? "").trim().toLocaleLowerCase("es");
    const collection = String(pack.collection ?? "").trim().toLocaleLowerCase("es");
    return label === "territorio" || name === "territorio" || collection === "world.territorio";
  }) ?? null;
}

async function ensureKonaTerritoryPackReady() {
  let pack = findKonaTerritoryPack();
  if (!pack && game.user?.isGM) {
    const CompendiumClass = globalThis.CompendiumCollection
      ?? globalThis.foundry?.documents?.collections?.CompendiumCollection;
    if (!CompendiumClass?.createCompendium) throw new Error("Foundry no ofrece createCompendium.");
    const created = await CompendiumClass.createCompendium({
      name: "territorio",
      label: "Territorio",
      package: "world",
      type: "JournalEntry",
      path: "packs/territorio",
      system: game.system?.id
    });
    // Some Foundry builds register the pack in game.packs one microtask after
    // createCompendium resolves; keep the returned collection as a fallback.
    pack = findKonaTerritoryPack() ?? created ?? null;
  }
  if (!pack || pack.documentName !== "JournalEntry") {
    throw new Error(game.user?.isGM
      ? "No se pudo crear el compendio Journal Territorio. Revisa permisos de escritura del mundo."
      : "El compendio Territorio todavía no existe en este mundo. Una persona GM debe abrir primero la hoja para crearlo.");
  }

  // Foundry materializa la colección de carpetas junto con el índice del pack.
  await pack.getIndex({ fields: ["name", "img", "folder"] });

  if (game.user?.isGM) {
    const FolderClass = globalThis.Folder ?? globalThis.foundry?.documents?.Folder;
    if (!FolderClass?.createDocuments) throw new Error("Foundry no ofrece la creación de carpetas de compendio.");
    const wasLocked = Boolean(pack.locked);
    if (wasLocked) await pack.configure({ locked: false });
    try {
      const folders = new Map();
      const readFolders = () => Array.from(pack.folders?.contents ?? pack.folders ?? []);
      for (const folder of readFolders()) folders.set(String(folder.id), folder);
      const parentIdOf = folder => {
        const value = folder?.folder ?? folder?.parent;
        return value?.id ? String(value.id) : (value ? String(value) : null);
      };
      const findFolder = (name, parent) => Array.from(folders.values()).find(folder =>
        folder.name === name && parentIdOf(folder) === (parent ? String(parent.id) : null)
      ) ?? null;
      const ensureFolder = async (name, parent, sort) => {
        let folder = findFolder(name, parent);
        if (!folder) {
          const created = await FolderClass.createDocuments([{
            name,
            type: "JournalEntry",
            folder: parent?.id ?? null,
            sorting: "m",
            sort
          }], { pack: pack.collection });
          folder = created?.[0] ?? null;
          if (!folder) throw new Error(`Foundry no creó la carpeta ${name}.`);
          folders.set(String(folder.id), folder);
        } else if (Number(folder.sort ?? 0) !== sort || folder.sorting !== "m") {
          await folder.update({ sort, sorting: "m" });
        }
        return folder;
      };

      for (let biomeIndex = 0; biomeIndex < KONA_TERRITORY_BIOMAS.length; biomeIndex++) {
        const biome = await ensureFolder(KONA_TERRITORY_BIOMAS[biomeIndex], null, (biomeIndex + 1) * 1000);
        for (let categoryIndex = 0; categoryIndex < KONA_TERRITORY_CATEGORIES.length; categoryIndex++) {
          await ensureFolder(KONA_TERRITORY_CATEGORIES[categoryIndex], biome, (categoryIndex + 1) * 100);
        }
      }
      await pack.configure({ ownership: {
        PLAYER: "OBSERVER", TRUSTED: "OBSERVER", ASSISTANT: "OBSERVER", GAMEMASTER: "OWNER"
      }});
    } finally {
      if (wasLocked && pack && !pack.locked) await pack.configure({ locked: true });
    }
    await pack.getIndex({ fields: ["name", "img", "folder"] });
  }
  return pack;
}

function getKonaTerritoryPackReady() {
  if (!KONA_TERRITORY_SETUP_PROMISE) {
    KONA_TERRITORY_SETUP_PROMISE = ensureKonaTerritoryPackReady().catch(error => {
      KONA_TERRITORY_SETUP_PROMISE = null;
      throw error;
    });
  }
  return KONA_TERRITORY_SETUP_PROMISE;
}

async function openKonaTerritoryPicker(canvas, actor) {
  if (!canvas || !actor) return;
  const DialogClass = globalThis.Dialog;
  if (typeof DialogClass !== "function") {
    ui.notifications.error("MELIAZ: no está disponible el selector de Territorio de Foundry.");
    return;
  }

  let pack;
  try {
    pack = await getKonaTerritoryPackReady();
  } catch (error) {
    console.error("MELIAZ Bridge: no pude preparar el compendio Territorio.", error);
    ui.notifications.error(`Territorio: ${error.message ?? error}`);
    return;
  }

  const content = `
    <div class="meliaz-kona-picker meliaz-territorio-picker" style="display:flex;flex-direction:column;gap:8px;min-width:520px;height:72vh;min-height:500px;max-height:calc(100vh - 150px);">
      <nav class="meliaz-territorio-breadcrumb" aria-label="Ruta de Territorio" style="display:flex;flex-wrap:wrap;gap:4px;align-items:center;"></nav>
      <label style="display:flex;flex-direction:column;gap:3px;">Buscar en esta carpeta
        <input class="meliaz-territorio-search" type="search" placeholder="Filtrar por nombre…" style="width:100%;">
      </label>
      <div class="meliaz-territorio-status" aria-live="polite" style="font-size:12px;opacity:.78;">Abriendo Territorio…</div>
      <div class="meliaz-territorio-results" style="display:flex;flex:1 1 auto;flex-direction:column;gap:4px;min-height:360px;max-height:none;overflow-y:auto;overscroll-behavior:contain;"></div>
    </div>`;

  let dialog;
  dialog = new DialogClass({
    title: "Agregar elemento de Territorio",
    content,
    buttons: { close: { label: "Cerrar" } },
    default: "close",
    render: html => {
      const root = html?.[0] ?? html;
      const breadcrumb = root.querySelector(".meliaz-territorio-breadcrumb");
      const search = root.querySelector(".meliaz-territorio-search");
      const status = root.querySelector(".meliaz-territorio-status");
      const results = root.querySelector(".meliaz-territorio-results");
      if (!breadcrumb || !search || !status || !results) return;

      // The compendium index must be loaded BEFORE reading pack.folders.
      void (async () => {
        try {
          const index = await pack.getIndex({ fields: ["name", "img", "folder"] });
          const foldersRaw = pack.folders?.contents ?? pack.folders ?? [];
          const folders = Array.from(foldersRaw);
          const folderById = new Map(folders.map(folder => [String(folder.id), folder]));
          const parentIdOf = folder => {
            const parent = folder?.folder ?? folder?.parent;
            return parent?.id ? String(parent.id) : (parent ? String(parent) : null);
          };
          let currentFolderId = null;
          let sequence = 0;

          const pathFor = folderId => {
            const path = [];
            if (!folderId) return path;
            let current = folderById.get(String(folderId));
            const seen = new Set();
            while (current && !seen.has(String(current.id))) {
              seen.add(String(current.id));
              path.unshift(current);
              const parentId = parentIdOf(current);
              current = parentId ? folderById.get(parentId) : null;
            }
            return path;
          };
          const makeButton = (label, className = "meliaz-kona-picker-result") => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = className;
            button.textContent = label;
            button.style.cssText = "display:flex;align-items:center;gap:8px;text-align:left;width:100%;padding:6px 8px;";
            return button;
          };

          const renderView = async () => {
            const renderId = ++sequence;
            const currentFolder = currentFolderId ? folderById.get(currentFolderId) : null;
            if (currentFolderId && !currentFolder) {
              status.textContent = "No se encuentra la carpeta seleccionada.";
              return;
            }
            const path = pathFor(currentFolderId);
            breadcrumb.replaceChildren();
            const rootCrumb = makeButton("Territorio", "meliaz-territorio-crumb");
            rootCrumb.style.width = "auto";
            rootCrumb.style.padding = "2px 5px";
            rootCrumb.disabled = !currentFolderId;
            rootCrumb.addEventListener("click", () => { currentFolderId = null; search.value = ""; renderView(); });
            breadcrumb.appendChild(rootCrumb);
            path.forEach((folder, pathIndex) => {
              const sep = document.createElement("span");
              sep.textContent = "›";
              sep.style.opacity = ".55";
              breadcrumb.appendChild(sep);
              const crumb = makeButton(folder.name, "meliaz-territorio-crumb");
              crumb.style.width = "auto";
              crumb.style.padding = "2px 5px";
              crumb.disabled = pathIndex === path.length - 1;
              crumb.addEventListener("click", () => { currentFolderId = String(folder.id); search.value = ""; renderView(); });
              breadcrumb.appendChild(crumb);
            });

            results.replaceChildren();
            const currentFolderName = currentFolder?.name ?? "Territorio";
            status.textContent = `Carpeta: ${currentFolderName}`;
            const query = String(search.value ?? "").trim().toLocaleLowerCase("es");
            const childFolders = folders.filter(folder => parentIdOf(folder) === currentFolderId)
              .sort((a, b) => Number(a.sort ?? 0) - Number(b.sort ?? 0) || String(a.name).localeCompare(String(b.name), "es"));
            for (const folder of childFolders) {
              if (query && !String(folder.name).toLocaleLowerCase("es").includes(query)) continue;
              const button = makeButton(`▸  ${folder.name}`, "meliaz-territorio-folder");
              button.addEventListener("click", () => { currentFolderId = String(folder.id); search.value = ""; renderView(); });
              results.appendChild(button);
            }

            const docs = Array.from(index ?? []).filter(entry => {
              const entryFolder = entry.folder?.id ? String(entry.folder.id) : (entry.folder ? String(entry.folder) : null);
              return entryFolder === currentFolderId && (!query || String(entry.name ?? "").toLocaleLowerCase("es").includes(query));
            }).sort((a, b) => String(a.name).localeCompare(String(b.name), "es"));

            for (const entry of docs) {
              const id = String(entry._id ?? entry.id ?? "");
              if (!id) continue;
              const button = makeButton("", "meliaz-kona-picker-result");
              const icon = document.createElement("img");
              icon.src = entry.img || "icons/svg/book.svg";
              icon.alt = "";
              icon.style.cssText = "width:26px;height:26px;object-fit:contain;flex:0 0 26px;";
              const label = document.createElement("span");
              label.textContent = entry.name;
              label.style.cssText = "min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;";
              button.append(icon, label);
              button.addEventListener("click", async event => {
                event.preventDefault();
                button.disabled = true;
                status.textContent = `Agregando ${entry.name}…`;
                try {
                  const selected = await pack.getDocument(id);
                  const added = await addKonaCompendiumSource(canvas, actor, "territorio", selected);
                  if (added) dialog.close();
                  else button.disabled = false;
                } catch (error) {
                  console.error("MELIAZ Bridge: error agregando referencia de Territorio.", error);
                  ui.notifications.error(`No pude agregar ${entry.name}.`);
                  button.disabled = false;
                  status.textContent = "No se pudo agregar el documento. Puedes intentarlo de nuevo.";
                }
              });
              results.appendChild(button);
            }
            const visibleCount = childFolders.filter(folder => !query || String(folder.name).toLocaleLowerCase("es").includes(query)).length + docs.length;
            status.textContent = visibleCount
              ? `${currentFolderName} · ${visibleCount} carpeta(s)/documento(s)`
              : (query ? "No hay coincidencias en esta carpeta." : "Esta carpeta está vacía por ahora.");
            if (renderId !== sequence) return;
          };

          search.addEventListener("input", renderView);
          if (!folders.length) status.textContent = "Territorio está creado, pero aún no contiene carpetas. Revisa la configuración del pack.";
          renderView();
        } catch (error) {
          console.error("MELIAZ Bridge: no pude cargar índice/carpetas del compendio Territorio.", error);
          status.textContent = "No pude cargar Territorio. Revisa los permisos del compendio.";
        }
      })();
    }
  }, {
    width: Math.min(640, Math.round(window.innerWidth * 0.88)),
    height: Math.min(900, Math.max(600, Math.round(window.innerHeight * 0.84)))
  });
  dialog.render(true);
}
function openKonaCompendiumPicker(canvas, actor, target) {
  if (target === "territorio") return openKonaTerritoryPicker(canvas, actor);
  const config = KONA_COMPENDIUM_TARGETS[target];
  if (!config || !canvas || !actor) return;
  const DialogClass = globalThis.Dialog;
  if (typeof DialogClass !== "function") {
    ui.notifications.error("MELIAZ: no está disponible el selector de compendios de Foundry.");
    return;
  }

  // Pre-check the fixed slots before opening the picker.
  if (target === "equipo" && Array.from(actor.items ?? []).filter(item =>
    ["arma", "equipo", "defensa"].includes(String(item.getFlag?.(MODULE_ID, "kind") ?? "").toLowerCase()) &&
    Number(item.getFlag?.(MODULE_ID, "equipoSlot")) > 0
  ).length >= 4) {
    ui.notifications.warn("Equipo está completo (4 espacios).");
    return;
  }
  if ((target === "arma" && getHiperaNequeLoadoutItem(actor, "arma")) ||
      (target === "defensa" && (!isHiperaArmorOficio(actor) || getHiperaNequeLoadoutItem(actor, "armadura")))) return;

  const packs = Array.from(game.packs ?? []).filter(pack => config.documentNames.includes(pack.documentName));
  if (!packs.length) {
    ui.notifications.warn(`No hay compendios compatibles disponibles para ${config.label}.`);
    return;
  }
  packs.sort((a, b) => konaCompendiumPackLabel(a).localeCompare(konaCompendiumPackLabel(b), "es"));

  const content = `
    <div class="meliaz-kona-picker" style="display:flex;flex-direction:column;gap:8px;min-width:520px;height:72vh;min-height:500px;max-height:calc(100vh - 150px);">
      <label style="display:flex;flex-direction:column;gap:3px;">Compendio
        <select class="meliaz-kona-picker-pack" style="width:100%;"></select>
      </label>
      <label style="display:flex;flex-direction:column;gap:3px;">Buscar documento
        <input class="meliaz-kona-picker-search" type="search" placeholder="Escribe el nombre…" style="width:100%;">
      </label>
      <div class="meliaz-kona-picker-status" aria-live="polite" style="font-size:12px;opacity:.75;">Selecciona un compendio.</div>
      <div class="meliaz-kona-picker-results" style="display:flex;flex:1 1 auto;flex-direction:column;gap:3px;min-height:360px;max-height:none;overflow-y:auto;overscroll-behavior:contain;"></div>
    </div>`;

  let dialog;
  dialog = new DialogClass({
    title: `Añadir ${config.label} desde compendio`,
    content,
    buttons: { close: { label: "Cerrar" } },
    default: "close",
    render: html => {
      const root = html?.[0] ?? html;
      const packSelect = root.querySelector(".meliaz-kona-picker-pack");
      const searchInput = root.querySelector(".meliaz-kona-picker-search");
      const status = root.querySelector(".meliaz-kona-picker-status");
      const results = root.querySelector(".meliaz-kona-picker-results");
      if (!packSelect || !searchInput || !status || !results) return;

      for (const pack of packs) {
        const option = document.createElement("option");
        option.value = pack.collection;
        option.textContent = konaCompendiumPackLabel(pack);
        packSelect.appendChild(option);
      }

      const packIndexCache = new Map();
      const docCache = new Map();
      let renderSequence = 0;
      let debounceId = null;

      const renderResults = async () => {
        const sequence = ++renderSequence;
        const pack = game.packs.get(packSelect.value);
        const query = String(searchInput.value ?? "").trim().toLocaleLowerCase("es");
        results.replaceChildren();
        status.textContent = "Buscando documentos compatibles…";
        if (!pack) { status.textContent = "No se encontró ese compendio."; return; }

        try {
          let index = packIndexCache.get(pack.collection);
          if (!index) {
            index = await pack.getIndex({ fields: [
              "name", "img", "type", "system.props.hipera_tipo",
              `flags.${MODULE_ID}.kind`,
              "flags.hiperaustralis-bioma-item", "flags.hiperaustralis-flora-item",
              "flags.hiperaustralis-fauna-item", "flags.hiperaustralis-funga-item", "flags.hiperaustralis-instrumentos",
              "flags.hiperaustralis-armas", "flags.hiperaustralis-defensas"
            ] });
            index = Array.from(index ?? []);
            packIndexCache.set(pack.collection, index);
          }
          if (sequence !== renderSequence) return;
          const candidates = index.filter(entry => {
            const name = String(entry.name ?? "").toLocaleLowerCase("es");
            if (query && !name.includes(query)) return false;
            if (pack.documentName === "Item" && entry.type && entry.type !== "equippableItem") return false;
            return true;
          }).slice(0, query ? 120 : 70);

          const valid = [];
          for (const entry of candidates) {
            if (sequence !== renderSequence) return;
            const id = String(entry._id ?? entry.id ?? "");
            if (!id) continue;
            const cacheKey = `${pack.collection}.${id}`;
            let doc = docCache.get(cacheKey);
            if (doc === undefined) {
              doc = await pack.getDocument(id).catch(() => null);
              docCache.set(cacheKey, doc);
            }
            if (!doc) continue;
            if (doc.documentName === "Item") {
              if (doc.type !== "equippableItem") continue;
              if (!config.kinds.includes(inferHiperaItemKind(doc))) continue;
            } else if (!(target === "territorio" && doc.documentName === "JournalEntry")) {
              continue;
            }
            valid.push(doc);
            if (valid.length >= 35) break;
          }
          if (sequence !== renderSequence) return;

          if (!valid.length) {
            status.textContent = query
              ? "No hay coincidencias compatibles. Prueba otro término o compendio."
              : "No se encontraron documentos de este tipo. Usa la búsqueda para afinar.";
            return;
          }
          status.textContent = `${valid.length} documento(s) compatible(s). La selección se identifica por UUID, no sólo por nombre.`;
          for (const doc of valid) {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "meliaz-kona-picker-result";
            button.style.cssText = "display:flex;align-items:center;gap:8px;text-align:left;width:100%;padding:5px 7px;";
            const img = document.createElement("img");
            img.src = doc.img || (doc.documentName === "JournalEntry" ? "icons/svg/book.svg" : "icons/svg/item-bag.svg");
            img.alt = "";
            img.style.cssText = "width:26px;height:26px;object-fit:contain;flex:0 0 26px;";
            const label = document.createElement("span");
            label.textContent = doc.name;
            label.style.cssText = "min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;";
            button.append(img, label);
            button.addEventListener("click", async event => {
              event.preventDefault();
              button.disabled = true;
              status.textContent = `Añadiendo ${doc.name}…`;
              try {
                const selected = await pack.getDocument(doc.id);
                const added = await addKonaCompendiumSource(canvas, actor, target, selected);
                if (added) dialog.close();
                else button.disabled = false;
              } catch (error) {
                console.error("MELIAZ Bridge: error importando documento desde compendio.", error);
                ui.notifications.error(`No pude añadir ${doc.name}.`);
                button.disabled = false;
                status.textContent = "La importación falló. Puedes intentarlo de nuevo.";
              }
            });
            results.appendChild(button);
          }
        } catch (error) {
          console.error("MELIAZ Bridge: error leyendo índice de compendio.", error);
          status.textContent = "No pude leer ese compendio. Revisa permisos y contenido.";
        }
      };

      packSelect.addEventListener("change", renderResults);
      searchInput.addEventListener("input", () => {
        clearTimeout(debounceId);
        debounceId = setTimeout(renderResults, 180);
      });
      if (packs[0]) packSelect.value = packs[0].collection;
      renderResults();
    }
  }, {
    width: Math.min(640, Math.round(window.innerWidth * 0.88)),
    height: Math.min(900, Math.max(600, Math.round(window.innerHeight * 0.84)))
  });
  dialog.render(true);
}

function installKonaCompendiumAddButtons(canvas, actor) {
  if (!canvas || !actor || canvas.dataset.meliazCompendiumAddBound === "1") return;
  canvas.dataset.meliazCompendiumAddBound = "1";
  // Capture phase prevents the occupied-slot opener from swallowing + clicks.
  canvas.addEventListener("click", event => {
    const button = event.target.closest?.("[data-ha-kona-add]");
    if (!button || !canvas.contains(button)) return;
    const target = String(button.dataset.haKonaAdd ?? "");
    if (!KONA_COMPENDIUM_TARGETS[target]) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    if (target === "territorio") {
      void openKonaTerritoryPicker(canvas, actor);
      return;
    }
    openKonaCompendiumPicker(canvas, actor, target);
  }, true);
}

const HIPERA_KONA_BOX_CAPACITY = 4;

function hiperaBoxHasCapacity(actor, count, label, requestedMax = HIPERA_KONA_BOX_CAPACITY) {
  const max = Math.max(1, Math.min(HIPERA_KONA_BOX_CAPACITY, Number(requestedMax) || HIPERA_KONA_BOX_CAPACITY));
  if (count < max) return true;
  ui.notifications.warn(`Hiperaustralis: ${label} admite hasta ${max} entradas según Temple. Retira una antes de añadir otra.`);
  return false;
}

function getKonaReliquiaTempleCapacity(actor) {
  const raw = Number(actor?.system?.props?.temple ?? 1);
  return Math.max(1, Math.min(4, Number.isFinite(raw) ? Math.floor(raw) : 1));
}

function hiperaNaturalezaItems(actor) {
  return [...(actor.items ?? [])].filter(i => ["flora","fauna","funga","bioma"].includes(inferHiperaItemKind(i)));
}

function hiperaPlainFlags(item) {
  if (!item) return {};
  try {
    if (typeof item.toObject === "function") return item.toObject()?.flags ?? {};
  } catch {}
  return item.flags ?? {};
}

function hiperaSeedMarker(item, kind) {
  const ns = kind === "flora" ? "hiperaustralis-flora-item" : kind === "fauna" ? "hiperaustralis-fauna-item" : kind === "funga" ? "hiperaustralis-funga-item" : kind === "bioma" ? "hiperaustralis-bioma-item" : "";
  const flags = hiperaPlainFlags(item);
  const fromFlag = ns ? String(flags?.[ns]?.seedId ?? "").trim() : "";
  const fromCode = String(item?.system?.props?.codigo ?? "").trim();
  const fromUuid = String(item?.uuid ?? "").trim();
  const fromName = String(item?.name ?? "").trim();
  return fromFlag || fromCode || fromUuid || fromName;
}

async function hiperaResolveDroppedItem(data) {
  if (!data) return null;
  const uuid = String(data.uuid ?? data.documentUuid ?? data.itemUuid ?? "");
  if (uuid) {
    const doc = await fromUuid(uuid).catch(() => null);
    if (doc?.documentName === "Item") return doc;
  }
  const packId = String(data.pack ?? data.packId ?? "");
  const id = String(data.id ?? data._id ?? "");
  if (packId && id) {
    const doc = await game.packs.get(packId)?.getDocument(id).catch(() => null);
    if (doc?.documentName === "Item") return doc;
  }
  return id ? (game.items?.get(id) ?? null) : null;
}

async function itemFromHiperaDropEvent(event) {
  const textEditorData = globalThis.TextEditor?.getDragEventData?.(event);
  if (textEditorData?.uuid || textEditorData?.pack) {
    const resolved = await hiperaResolveDroppedItem(textEditorData);
    if (resolved) return resolved;
  }
  const raw =
    event.dataTransfer?.getData?.("text/plain") ||
    event.dataTransfer?.getData?.("application/json") ||
    "";

  if (!raw) return null;

  let data = null;
  try {
    data = JSON.parse(raw);
  } catch (_) {
    return null;
  }

  const uuid = String(
    data?.uuid ??
    data?.documentUuid ??
    data?.itemUuid ??
    ""
  );

  if (uuid) {
    try {
      const doc = await fromUuid(uuid);
      if (doc?.documentName === "Item" || doc instanceof Item) return doc;
    } catch (err) {
      console.warn("MELIAZ Bridge: no pude resolver Item arrastrado por UUID.", err, data);
    }
  }

  const id = String(data?.id ?? data?._id ?? "");
  if (id) {
    const worldItem = game.items?.get?.(id);
    if (worldItem) return worldItem;
  }

  return null;
}

async function embedHiperaItemFromDrop(canvas, actor, event) {
  if (!canvas || !actor || !event) return false;

  const source = await itemFromHiperaDropEvent(event);
  if (!source || source.type !== "equippableItem") return false;

  const kind = inferHiperaItemKind(source);
  if (kind !== "ritual" && kind !== "reliquia") return false;
  if (kind === "ritual") await repairKonaRitualSlotPersistence(actor);

  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();

  if (!hiperaBoxHasCapacity(actor, [...(actor.items ?? [])].filter(i => inferHiperaItemKind(i) === kind).length, kind === "ritual" ? "Rituales" : "Reliquias", kind === "reliquia" ? getKonaReliquiaTempleCapacity(actor) : HIPERA_KONA_BOX_CAPACITY)) return false;

  if (kind === "ritual" && isHiperaItemEmbeddedInActor(source, actor)) {
    const occupied = new Set(getKonaRitualItems(actor)
      .map(item => Number(item.getFlag?.(MODULE_ID, "ritualSlot")) || 0)
      .filter(slot => slot >= 1 && slot <= 4));
    const oldSlot = Number(source.getFlag?.(MODULE_ID, "ritualSlot")) || 0;
    const slot = oldSlot >= 1 && oldSlot <= 4 ? oldSlot : nextKonaPrioritySlot(occupied);
    if (!slot) return false;
    await source.update({
      [`flags.${MODULE_ID}.kind`]: "ritual",
      [`flags.${MODULE_ID}.ritualSlot`]: slot,
      "system.props": { ...(source.system?.props ?? {}), hipera_tipo: "ritual" }
    }, { render: false });
    const template = await ensureHiperaRitualTemplate();
    if (template) await normalizeRitualItem(source, template);
    renderKonaRitualItems(canvas, actor);
    return true;
  }

  const data = source.toObject();
  delete data._id;
  delete data.folder;
  delete data.ownership;
  delete data._stats;

  data.flags ??= {};
  data.flags[MODULE_ID] ??= {};
  data.flags[MODULE_ID].kind = kind;
  if (kind === "ritual") {
    const occupied = new Set(getKonaRitualItems(actor)
      .map(item => Number(item.getFlag?.(MODULE_ID, "ritualSlot")) || 0)
      .filter(slot => slot >= 1 && slot <= 4));
    const slot = nextKonaPrioritySlot(occupied);
    if (!slot) return false;
    data.flags[MODULE_ID].ritualSlot = slot;
  }

  data.system ??= {};
  data.system.props ??= {};
  data.system.props.hipera_tipo = kind;
  data.system.unique = false;
  data.system.uniqueId = "";

  const created = await actor.createEmbeddedDocuments("Item", [data]);
  const embedded = created?.[0] ?? null;

  if (embedded) {
    if (kind === "ritual") {
      const template = await ensureHiperaRitualTemplate();
      if (template) await normalizeRitualItem(embedded, template);
      renderKonaRitualItems(canvas, actor);
    } else {
      const template = await ensureHiperaReliquiaTemplate();
      if (template) await normalizeReliquiaItem(embedded, template);
      renderKonaReliquiaItems(canvas, actor);
    }

    ui.notifications.info(
      kind === "ritual"
        ? `Ritual añadido a ${actor.name}.`
        : `Reliquia añadida a ${actor.name}.`
    );
  }

  return Boolean(embedded);
}


function hiperaDragKindFromEvent(event) {
  const raw =
    event?.dataTransfer?.getData?.("text/plain") ||
    event?.dataTransfer?.getData?.("application/json") ||
    "";
  if (!raw) return null;

  let data;
  try { data = JSON.parse(raw); }
  catch (_) { return null; }

  const directId = String(data?.id ?? data?._id ?? "");
  let item = directId ? game.items?.get?.(directId) : null;

  if (!item) {
    const uuid = String(data?.uuid ?? data?.documentUuid ?? data?.itemUuid ?? "");
    const match = uuid.match(/^Item\.([^.]+)$/);
    if (match) item = game.items?.get?.(match[1]) ?? null;
  }

  return inferHiperaItemKind(item);
}

function hiperaDropFieldAtPointer(canvas, event) {
  if (!canvas || !event) return null;
  const containsPointer = selector => {
    const area = canvas.querySelector(selector);
    if (!area) return false;
    const rect = area.getBoundingClientRect?.();
    if (!rect?.width || !rect?.height) return false;
    return event.clientX >= rect.left && event.clientX <= rect.right &&
      event.clientY >= rect.top && event.clientY <= rect.bottom;
  };

  // La zona de drop es el mismo rectángulo DOM que dibuja cada recuadro.
  // Los anfitriones permanecen montados aunque estén visualmente vacíos.
  if (containsPointer(".ha-ritual-items-area")) return "ritual";
  if (containsPointer(".ha-reliquia-items-area")) return "reliquia";
  return null;
}


function hiperaEquipoSlotAtPointer(canvas, event) {
  const rect = canvas?.getBoundingClientRect?.();
  if (!rect?.width || !rect?.height) return null;

  const x = ((event.clientX - rect.left) / rect.width) * 100;
  const y = ((event.clientY - rect.top) / rect.height) * 100;

  // 0.24.144 · Área de recepción ampliada e invisible para TODO Equipo.
  // Cubre el grupo de cuatro puntos v40, no sólo cada círculo de 54 px.
  // Los cuatro slots visibles siguen siendo los destinos de ordenación.
  const zone = { left: 37.2, top: 66.5, width: 10.6, height: 16.5 };
  return (
    x >= zone.left && x <= zone.left + zone.width &&
    y >= zone.top && y <= zone.top + zone.height
  ) ? "equipo" : null;
}

// 0.24.198: se retira la normalización automática de Equipo.
// Los datos históricos se conservan; cualquier migración futura será explícita,
// reversible y separada del montaje/render de la hoja.

function isHiperaItemEmbeddedInActor(source, actor) {
  return Boolean(source && actor && source.parent?.documentName === "Actor" && source.parent.id === actor.id);
}

async function attachHiperaArmaToEquipo(actor, source) {
  if (!actor || !source) return false;
  const sourceKind = inferHiperaItemKind(source);
  if (sourceKind !== "equipo") {
    ui.notifications.warn("Sólo un Item de tipo Equipo puede ocupar los espacios de Equipo.");
    return false;
  }

  // No normalizar ni migrar datos al equipar. Los slots legacy se respetan.
  const current = Array.from(actor.items ?? []).filter(item => {
    const kind = String(item.getFlag?.(MODULE_ID, "kind") ?? inferHiperaItemKind(item) ?? "").toLowerCase();
    const slot = Number(item.getFlag?.(MODULE_ID, "equipoSlot")) || 0;
    return ["arma", "equipo", "defensa"].includes(kind) && slot >= 1 && slot <= 4;
  });
  const existingSlot = Number(source.getFlag?.(MODULE_ID, "equipoSlot")) || 0;
  if (isHiperaItemEmbeddedInActor(source, actor) && existingSlot >= 1 && existingSlot <= 4) return true;
  if (current.length >= 4) {
    ui.notifications.warn("Equipo está completo (4 espacios). Retira uno antes de añadir otro.");
    return false;
  }
  if (isHiperaItemEmbeddedInActor(source, actor)) {
    if (current.length >= 4) {
      ui.notifications.warn("Equipo está completo (4 espacios). Retira uno antes de añadir otro.");
      return false;
    }
    const occupied = new Set(current.map(item => Number(item.getFlag?.(MODULE_ID, "equipoSlot")) || 0));
    const slot = nextKonaPrioritySlot(occupied);
    if (!slot) return false;
    await source.update({
      [`flags.${MODULE_ID}.kind`]: inferHiperaItemKind(source) || "equipo",
      [`flags.${MODULE_ID}.equipoSlot`]: slot,
      "system.props": { ...(source.system?.props ?? {}), hipera_tipo: inferHiperaItemKind(source) || "equipo" }
    }, { render: false });
    ui.notifications.info(`${source.name} asignado a Equipo (${slot}/4), sin duplicar el Item.`);
    return true;
  }

  const occupied = new Set(current.map(item => Number(item.getFlag?.(MODULE_ID, "equipoSlot")) || 0));
  const slot = nextKonaPrioritySlot(occupied);
  if (!slot) return false;

  const data = source.toObject();
  delete data._id;
  delete data.folder;
  delete data.ownership;
  delete data._stats;

  data.flags ??= {};
  data.flags[MODULE_ID] ??= {};
  data.flags[MODULE_ID].kind = inferHiperaItemKind(source) || "equipo";
  data.flags[MODULE_ID].equipoSlot = slot;

  data.system ??= {};
  data.system.props ??= {};
  data.system.props.hipera_tipo = inferHiperaItemKind(source) || "equipo";
  data.system.unique = false;
  data.system.uniqueId = "";

  const created = await actor.createEmbeddedDocuments("Item", [data]);
  const embedded = created?.[0] ?? null;
  if (!embedded) return false;

  // 0.24.202 · Equipo nuevo vive exclusivamente en Items + flags equipoSlot.
  // No escribir system.props.equipo_N: esos campos CSB son legacy y su
  // actualización reinyecta nombres de Items antiguos en el render de Kona.
  // Los valores históricos se conservan intactos; sólo dejamos de generar
  // nuevas duplicaciones visuales al hacer drag-and-drop.
  ui.notifications.info(`${source.name} añadido a Equipo (${slot}/4).`);
  return true;
}


function hiperaSentirInstrumentZoneAtPointer(canvas, event) {
  // La zona de drop sigue la geometría REAL del recuadro visible. Evita
  // desajustes entre porcentajes CSS, escalado de hoja y distintas resoluciones.
  const box = canvas?.querySelector?.(".ha-sentir-instrumentos-box");
  const rect = box?.getBoundingClientRect?.();
  if (!rect || rect.width <= 0 || rect.height <= 0) return false;
  return event.clientX >= rect.left && event.clientX <= rect.right &&
    event.clientY >= rect.top && event.clientY <= rect.bottom;
}

function getKonaInstrumentos(actor) {
  if (!actor?.items) return [];
  return Array.from(actor.items).filter(item => {
    if (inferHiperaItemKind(item) !== "instrumento") return false;
    const current = String(item.getFlag?.(MODULE_ID,"sentirInstrumento") ?? "") === "1";
    const legacy = String(item.getFlag?.(MODULE_ID,"picardiaInstrumento") ?? "") === "1";
    return current || legacy;
  }).sort((a, b) => {
    const aSlot = Number(a.getFlag?.(MODULE_ID, "sentirInstrumentoSlot")) || 99;
    const bSlot = Number(b.getFlag?.(MODULE_ID, "sentirInstrumentoSlot")) || 99;
    if (aSlot !== bSlot) return aSlot - bSlot;
    const aSort = Number(a.sort ?? 0), bSort = Number(b.sort ?? 0);
    return aSort - bSort || String(a.name).localeCompare(String(b.name), "es");
  });
}

async function repairKonaInstrumentoPersistence(actor) {
  if (!actor?.items) return [];
  const candidates = Array.from(actor.items).filter(item => {
    if (inferHiperaItemKind(item) !== "instrumento") return false;
    return String(item.getFlag?.(MODULE_ID, "sentirInstrumento") ?? "") === "1" ||
      String(item.getFlag?.(MODULE_ID, "picardiaInstrumento") ?? "") === "1";
  });

  // Reserve pre-existing valid slots before filling gaps, so a missing slot
  // earlier in collection order cannot steal a valid position from a later Item.
  // If duplicates exist, the first Item in collection order retains the slot.
  const originalHolder = new Map();
  for (const item of candidates) {
    const slot = Number(item.getFlag?.(MODULE_ID, "sentirInstrumentoSlot")) || 0;
    if (slot >= 1 && slot <= 4 && !originalHolder.has(slot)) originalHolder.set(slot, item.id);
  }
  const claimed = new Set(originalHolder.keys());
  const updates = [];
  for (const item of candidates) {
    const oldSlot = Number(item.getFlag?.(MODULE_ID, "sentirInstrumentoSlot")) || 0;
    const hasCurrentMarker = String(item.getFlag?.(MODULE_ID, "sentirInstrumento") ?? "") === "1";
    const ownsOriginalSlot = oldSlot >= 1 && oldSlot <= 4 && originalHolder.get(oldSlot) === item.id;
    const slot = ownsOriginalSlot ? oldSlot : nextKonaPrioritySlot(claimed);
    if (!slot) continue; // Preserve overflow Items; they remain embedded.
    claimed.add(slot);

    const update = { _id: item.id };
    if (!hasCurrentMarker) update[`flags.${MODULE_ID}.sentirInstrumento`] = "1";
    if (oldSlot !== slot) update[`flags.${MODULE_ID}.sentirInstrumentoSlot`] = slot;
    if (Object.keys(update).length > 1) updates.push(update);
  }
  if (updates.length) await actor.updateEmbeddedDocuments("Item", updates);
  return getKonaInstrumentos(actor);
}

async function attachHiperaInstrumentoToSentir(actor, source) {
  if (!actor || !source) return false;
  await repairKonaInstrumentoPersistence(actor);
  if (isHiperaItemEmbeddedInActor(source, actor)) {
    const alreadyAssigned = getKonaInstrumentos(actor).some(item => item.id === source.id);
    if (alreadyAssigned) return true;
    const current = getKonaInstrumentos(actor);
    if (!hiperaBoxHasCapacity(actor, current.length, "Música / Instrumentos")) return false;
    const used = new Set(current.map(item => Number(item.getFlag?.(MODULE_ID, "sentirInstrumentoSlot")) || 0));
    const slot = nextKonaPrioritySlot(used);
    if (!slot) return false;
    await source.update({
      [`flags.${MODULE_ID}.kind`]: "instrumento",
      [`flags.${MODULE_ID}.sentirInstrumento`]: "1",
      [`flags.${MODULE_ID}.sentirInstrumentoSlot`]: slot,
      "system.props": { ...(source.system?.props ?? {}), hipera_tipo: "instrumento" }
    }, { render: false });
    ui.notifications.info(`${source.name} asignado a Música (${slot}/4), conservando el Item existente.`);
    return true;
  }
  if (!hiperaBoxHasCapacity(actor, getKonaInstrumentos(actor).length, "Música / Instrumentos")) return false;

  const data = source.toObject();
  delete data._id;
  delete data.folder;
  delete data.ownership;
  delete data._stats;

  data.flags ??= {};
  data.flags[MODULE_ID] ??= {};
  data.flags[MODULE_ID].kind = "instrumento";
  data.flags[MODULE_ID].sentirInstrumento = "1";
  const occupiedSlots = new Set(getKonaInstrumentos(actor)
    .map(item => Number(item.getFlag?.(MODULE_ID, "sentirInstrumentoSlot")) || 0)
    .filter(slot => slot >= 1 && slot <= 4));
  data.flags[MODULE_ID].sentirInstrumentoSlot = nextKonaPrioritySlot(occupiedSlots);
  // Keep the legacy assignment marker as an audit trail when cloning an old item.


  data.system ??= {};
  data.system.props ??= {};
  data.system.props.hipera_tipo = "instrumento";
  data.system.unique = false;
  data.system.uniqueId = "";

  const created = await actor.createEmbeddedDocuments("Item", [data]);
  const embedded = created?.[0] ?? null;
  if (!embedded) return false;

  ui.notifications.info(`${source.name} añadido a Instrumentos de Sentir.`);
  return true;
}

function renderKonaInstrumentos(canvas, actor) {
  if (!canvas || !actor) return;

  // Retirar contenedores y restos visuales de versiones anteriores.
  canvas.querySelectorAll(".ha-picardia-instrumentos-box, .ha-sentir-instrumentos-legacy, .ha-instrumentos-legacy-list").forEach(node => node.remove());

  let box = canvas.querySelector(".ha-sentir-instrumentos-box");
  if (!box) {
    box = document.createElement("div");
    box.className = "ha-sentir-instrumentos-box";
    box.dataset.haSentirInstrumentos = "1";

    const title = document.createElement("div");
    title.className = "ha-sentir-instrumentos-title";
    title.textContent = "INSTRUMENTOS";

    const list = document.createElement("div");
    list.className = "ha-sentir-instrumentos-list";

    box.append(list);
    canvas.appendChild(box);
  }

  box.title = "Música";
  box.setAttribute("aria-label", "Música");
  const list = box.querySelector(".ha-sentir-instrumentos-list");
  if (canvas.classList.contains("ha-kona-experimental-sheet")) {
    box.style.setProperty("position", "absolute", "important");
    box.style.setProperty("left", "0", "important");
    box.style.setProperty("top", "0", "important");
    box.style.setProperty("width", "100%", "important");
    box.style.setProperty("height", "100%", "important");
    box.style.setProperty("max-width", "100%", "important");
    box.style.setProperty("max-height", "100%", "important");
    box.style.setProperty("overflow", "visible", "important");
    box.style.setProperty("pointer-events", "none", "important");
    list.style.setProperty("overflow", "visible", "important");
    list.style.setProperty("position", "absolute", "important");
    list.style.setProperty("left", "0", "important");
    list.style.setProperty("top", "0", "important");
    list.style.setProperty("width", "100%", "important");
    list.style.setProperty("height", "100%", "important");
    list.style.setProperty("overflow", "visible", "important");
    list.style.setProperty("pointer-events", "none", "important");
  }
  const instrumentos = getKonaInstrumentos(actor);
  renderKonaItemGrid(list, instrumentos, {
    columns: 2,
    rows: 2,
    slotClass: "ha-sentir-instrumento-row ha-kona-item-grid-slot",
    iconClass: "ha-mini-item-icon ha-sentir-instrumento-icon",
    datasetKey: "haSentirInstrumento",
    ariaPrefix: "Abrir Instrumento",
    overflow: "hidden",
    addAction: "instrumentos",
    addLabel: "Agregar instrumento",
    hoverLabel: "Agregar instrumento",
    // Preserve the old engraved zones. Priority affects which empty zone is
    // filled next, not the physical position of any Instrument.
    preserveSlots: true,
    slotField: "sentirInstrumentoSlot",
    slotPriority: KONA_SLOT_PRIORITY,
    // Keep the original physical 2×2 zones. The sequence 1→3→4→2 selects
    // only the next zone to fill; it does not move or remap any zone.
    iconScaleByCount: { 1: 1.92, 2: 1.38, 3: 1.12, 4: 0.98 },
    iconTransformOrigin: "center center",
    radialCenters: canvas.classList.contains("ha-kona-experimental-sheet") ? [
      { x: 954.9, y: 242.0 }, { x: 944.9, y: 333.1 },
      { x: 1034.7, y: 317.4 }, { x: 1080.3, y: 398.5 }
    ] : null,
    radialSize: 70
  });
}

function installKonaInstrumentos(canvas, actor) {
  if (!canvas || !actor) return;
  renderKonaInstrumentos(canvas, actor);
  void repairKonaInstrumentoPersistence(actor).then(() => {
    if (canvas.isConnected) renderKonaInstrumentos(canvas, actor);
  }).catch(error => console.warn("MELIAZ Bridge: no pude reparar los espacios de Música sin modificar los Items.", error));

  if (canvas.dataset.meliazInstrumentosBound === "1") return;
  canvas.dataset.meliazInstrumentosBound = "1";

  canvas.addEventListener("click", async event => {
    const remove = event.target.closest?.("[data-ha-sentir-instrumento-remove]");
    if (remove && canvas.contains(remove)) {
      event.preventDefault();
      event.stopPropagation();
      const id = String(remove.dataset.haSentirInstrumentoRemove ?? "");
      if (id) await actor.deleteEmbeddedDocuments("Item", [id]);
      renderKonaInstrumentos(canvas, actor);
      return;
    }

    const row = event.target.closest?.("[data-ha-sentir-instrumento]");
    if (row && canvas.contains(row)) {
      const id = String(row.dataset.haSentirInstrumento ?? "");
      const item = actor.items?.get?.(id);
      if (item) item.sheet?.render?.(true);
    }
  }, true);
}


function hiperaNequeLoadoutZoneAtPointer(canvas, event) {
  const rect = canvas?.getBoundingClientRect?.();
  if (!rect?.width || !rect?.height) return null;
  // La capa visible de Arma/Defensa se desplaza 15px a la derecha y 5px abajo.
  // Restar esos offsets conserva el mismo rectángulo lógico de drop y tamaño.
  const x = ((event.clientX - rect.left - 15) / rect.width) * 100;
  // Se mantiene la compensación vertical histórica de -10px; el nuevo +5px
  // inferior deja un neto de +5px para el punto del puntero.
  const y = ((event.clientY - rect.top + 5) / rect.height) * 100;
  const hit = (left, top, width, height) =>
    x >= left && x <= left + width && y >= top && y <= top + height;

  // Hitboxes ampliados hacia la izquierda para aceptar drops sobre los
  // pictogramas fijos de lanzas y escudo. El display equipado conserva su
  // posición independiente a la derecha.
  if (hit(22.5, 67.8, 13.5, 7.2)) return "arma";
  if (hit(22.5, 75.0, 13.5, 7.2)) return "armadura";
  return null;
}


function isHiperaArmorOficio(actor) {
  const oficio = String(actor?.system?.props?.oficio ?? "").trim().toLowerCase();

  // CORE actual: Guerrero. "Weichan" se acepta sólo como alias técnico de
  // compatibilidad para hojas antiguas que todavía no han migrado el valor.
  return oficio === "guerrero" || oficio === "weichan";
}

function getHiperaNequeLoadoutItem(actor, slot) {
  return actor?.items?.find?.(item =>
    String(item.getFlag?.(MODULE_ID,"nequeSlot") ?? "") === String(slot)
  ) ?? null;
}

async function attachHiperaNequeLoadout(actor, source, slot) {
  if (!actor || !source || !slot) return false;
  const kind = inferHiperaItemKind(source);

  if (slot === "arma" && kind !== "arma") {
    ui.notifications.warn("Sólo un Arma puede ocupar el espacio ARMA.");
    return false;
  }
  if (slot === "armadura" && kind !== "defensa") {
    ui.notifications.warn("Sólo una Defensa puede ocupar el espacio ARMADURA.");
    return false;
  }
  if (slot === "armadura" && !isHiperaArmorOficio(actor)) {
    return false;
  }

  const previous = getHiperaNequeLoadoutItem(actor, slot);
  if (previous && previous.id !== source.id) {
    // Swapping equipment must not destroy the previous Item or its CSB content.
    // Keep it embedded and record which slot it previously occupied.
    await previous.update({
      [`flags.${MODULE_ID}.nequeFormerSlot`]: slot,
      [`flags.${MODULE_ID}.nequeSlot`]: ""
    }, { render: false });
  }

  if (isHiperaItemEmbeddedInActor(source, actor)) {
    await source.update({
      [`flags.${MODULE_ID}.kind`]: kind,
      [`flags.${MODULE_ID}.nequeSlot`]: slot,
      "system.props": { ...(source.system?.props ?? {}), hipera_tipo: kind }
    }, { render: false });
    return true;
  }

  const data = source.toObject();
  delete data._id;
  delete data.folder;
  delete data.ownership;
  delete data._stats;

  data.flags ??= {};
  data.flags[MODULE_ID] ??= {};
  data.flags[MODULE_ID].kind = kind;
  data.flags[MODULE_ID].nequeSlot = slot;

  data.system ??= {};
  data.system.props ??= {};
  data.system.props.hipera_tipo = kind;
  data.system.unique = false;
  data.system.uniqueId = "";

  const created = await actor.createEmbeddedDocuments("Item", [data]);
  return Boolean(created?.[0]);
}

function renderHiperaNequeLoadout(canvas, actor) {
  if (!canvas || !actor) return;

  let box = canvas.querySelector(".ha-neque-loadout");
  if (!box) {
    box = document.createElement("div");
    box.className = "ha-neque-loadout";
    box.innerHTML = `
      <div class="ha-neque-loadout-row" data-ha-neque-row="arma" title="Arma equipada">
        <img class="ha-neque-loadout-icon" data-ha-neque-icon="arma" alt="" aria-hidden="true" style="display:none">
        <span class="ha-neque-loadout-name" data-ha-neque-name="arma"></span>
        <button type="button" class="ha-neque-loadout-remove" data-ha-neque-remove="arma" title="Retirar Arma">×</button>
      </div>
      <div class="ha-neque-loadout-row" data-ha-neque-row="armadura" title="Armadura equipada">
        <img class="ha-neque-loadout-icon" data-ha-neque-icon="armadura" alt="" aria-hidden="true" style="display:none">
        <span class="ha-neque-loadout-name" data-ha-neque-name="armadura"></span>
        <button type="button" class="ha-armadura-averiada" data-ha-armadura-reparar="1" title="Clic para marcar Armadura reparada"><i class="fa-solid fa-triangle-exclamation"></i></button>
        <button type="button" class="ha-neque-loadout-remove" data-ha-neque-remove="armadura" title="Retirar Armadura">×</button>
      </div>
    `;
    canvas.appendChild(box);
  }

  for (const slot of ["arma","armadura"]) {
    const item = getHiperaNequeLoadoutItem(actor, slot);
    const row = box.querySelector(`[data-ha-neque-row="${slot}"]`);
    const name = box.querySelector(`[data-ha-neque-name="${slot}"]`);
    const icon = box.querySelector(`[data-ha-neque-icon="${slot}"]`);
    // El hover identifica el objeto; no añade instrucciones redundantes.
    const title = item?.name || (slot === "arma" ? "Arma" : "Armadura");
    if (row) {
      row.title = title;
      row.setAttribute("aria-label", title);
      row.dataset.haNequeItemId = item?.id ?? "";
      row.classList.toggle("is-empty", !item);
    }
    if (name) {
      name.textContent = item?.name ?? "";
      name.dataset.haNequeOpen = item?.id ?? "";
      name.title = title;
    }
    if (icon) {
      icon.src = item?.img || "icons/svg/item-bag.svg";
      icon.title = title;
      icon.dataset.haNequeOpen = item?.id ?? "";
      icon.style.display = item ? "block" : "none";
    }

    let addButton = row?.querySelector?.(".ha-neque-add-button");
    const allowedEmpty = !item && (slot === "arma" || (slot === "armadura" && isHiperaArmorOficio(actor)));
    if (allowedEmpty && row) {
      if (!addButton) {
        addButton = document.createElement("button");
        addButton.type = "button";
        addButton.className = "ha-neque-add-button";
        addButton.textContent = "+";
        row.appendChild(addButton);
      }
      addButton.dataset.haKonaAdd = slot === "arma" ? "arma" : "defensa";
      addButton.title = slot === "arma" ? "Añadir Arma desde compendio" : "Añadir Defensa desde compendio";
      addButton.setAttribute("aria-label", addButton.title);
      addButton.style.setProperty("display", "flex", "important");
    } else if (addButton) {
      addButton.remove();
    }
  }

  const armorRow = box.querySelector('[data-ha-neque-row="armadura"]');
  const canUseArmor = isHiperaArmorOficio(actor);
  if (armorRow) armorRow.style.setProperty("display", canUseArmor ? "flex" : "none", "important");
  const broken = Boolean(actor.getFlag?.(MODULE_ID,"armaduraAveriada"));
  armorRow?.classList?.toggle("is-averiada", canUseArmor && broken);
  if (armorRow && canUseArmor) {
    const armorItem = getHiperaNequeLoadoutItem(actor, "armadura");
    armorRow.title = armorItem?.name || "Armadura";
    armorRow.setAttribute("aria-label", armorRow.title);
  }
  // Reveal only after both current Ñeque destinations have been reconciled.
  canvas.classList.add("ha-kona-neque-ready");
}

function installHiperaNequeLoadout(canvas, actor) {
  if (!canvas || !actor) return;
  renderHiperaNequeLoadout(canvas, actor);

  if (canvas.dataset.haNequeLoadoutBound === "1") return;
  canvas.dataset.haNequeLoadoutBound = "1";

  canvas.addEventListener("click", async event => {
    const remove = event.target.closest?.("[data-ha-neque-remove]");
    if (remove && canvas.contains(remove)) {
      event.preventDefault();
      event.stopPropagation();
      const slot = String(remove.dataset.haNequeRemove ?? "");
      const item = getHiperaNequeLoadoutItem(actor, slot);
      if (item) await item.delete();
      renderHiperaNequeLoadout(canvas, actor);
      return;
    }

    const repair = event.target.closest?.("[data-ha-armadura-reparar]");
    if (repair && canvas.contains(repair)) {
      event.preventDefault();
      event.stopPropagation();
      await actor.unsetFlag(MODULE_ID,"armaduraAveriada");
      renderHiperaNequeLoadout(canvas, actor);
      ui.notifications.info("Armadura reparada.");
      return;
    }

    const loadoutRow = event.target.closest?.("[data-ha-neque-row]");
    if (loadoutRow && canvas.contains(loadoutRow)) {
      event.preventDefault();
      event.stopPropagation();
      const id = String(loadoutRow.dataset.haNequeItemId ?? "");
      const item = id ? actor.items?.get?.(id) : null;
      if (item) item.sheet?.render?.(true);
      return;
    }
  }, true);

  // CORE · edición contextual de recursos: clic abre, derecho retira.
  // Sólo actúa sobre Items / referencias efectivamente representadas en recuadros.
  canvas.addEventListener("contextmenu", async event => {
    const target = event.target;
    const equipoInput = target.closest?.("[data-ha-equipo-slot][data-ha-equipo-item-id]");
    const equipoCell = target.closest?.(".ha-equipo-grid-cell[data-ha-equipo-slot]");
    const equipoTarget = equipoCell ?? equipoInput;
    if (equipoTarget && canvas.contains(equipoTarget)) {
      const slot = Number(equipoTarget.dataset.haEquipoSlot);
      const item = actor.items?.find?.(candidate =>
        ["arma", "equipo", "defensa"].includes(String(candidate.getFlag?.(MODULE_ID, "kind") ?? "").toLowerCase()) &&
        Number(candidate.getFlag?.(MODULE_ID, "equipoSlot")) === slot
      );
      if (!item && !equipoCell) return;
      event.preventDefault(); event.stopPropagation(); event.stopImmediatePropagation();
      if (item) await actor.deleteEmbeddedDocuments("Item", [item.id]);
      installHiperaEquipoSlotIcons(canvas, actor);
      return;
    }
    const ritual = target.closest?.("[data-ha-ritual-item]");
    const reliquia = target.closest?.("[data-ha-reliquia-item]");
    const instrumento = target.closest?.("[data-ha-sentir-instrumento]");
    const naturaleza = target.closest?.(".ha-biomas-row");
    const neque = target.closest?.("[data-ha-neque-row]");
    const row = ritual ?? reliquia ?? instrumento ?? naturaleza ?? neque;
    if (!row || !canvas.contains(row)) return;
    event.preventDefault(); event.stopPropagation(); event.stopImmediatePropagation();
    if (ritual || reliquia || instrumento) {
      const id = ritual?.dataset.haRitualItem ?? reliquia?.dataset.haReliquiaItem ?? instrumento?.dataset.haSentirInstrumento;
      if (id && actor.items?.get?.(id)) await actor.deleteEmbeddedDocuments("Item", [id]);
      renderKonaRitualItems(canvas, actor);
      renderKonaReliquiaItems(canvas, actor);
      renderKonaInstrumentos(canvas, actor);
      return;
    }
    // Biomas: clic derecho retira el Item embebido o la referencia UUID.
    if (naturaleza) {
      const key = naturaleza.dataset.haBiomasEntry ?? "";
      if (key.startsWith("ref:")) {
        const uuid = key.slice(4);
        const current = actor.getFlag(MODULE_ID, "biomasRefs") ?? [];
        await actor.setFlag(MODULE_ID, "biomasRefs", current.filter(entry => entry.uuid !== uuid));
      } else if (key && actor.items?.get?.(key)) {
        await actor.deleteEmbeddedDocuments("Item", [key]);
      }
      installHiperaBiomas(canvas, actor);
      return;
    }
    if (neque) {
      const slot = neque.dataset.haNequeRow;
      const item = getHiperaNequeLoadoutItem(actor, slot);
      if (item) await item.delete();
      renderHiperaNequeLoadout(canvas, actor);
    }
  }, true);
}


// Biomas: referencias documentales, sin propiedades mecánicas. Clic abre; clic derecho retira.
function installHiperaBiomas(canvas, actor) {
  if (!canvas || !actor) return;
  let box = canvas.querySelector('.ha-biomas-box');
  if (!box) {
    box = document.createElement('section');
    box.className = 'ha-biomas-box';
    box.setAttribute('aria-label', 'Territorio');
    box.title = 'Territorio';
    box.innerHTML = '<div class="ha-biomas-heading">TERRITORIO · soltar aquí</div><div class="ha-biomas-list"></div>';
    canvas.appendChild(box);
  }
  box.setAttribute('aria-label', 'Territorio');
  box.title = 'Territorio';

  // Territory + is routed by the shared canvas capture listener, exactly once.

  // GM bootstrap runs on sheet open so the pack and its folder tree exist
  // before the user reaches the +. It is idempotent and does not import content.
  if (game.user?.isGM && canvas.dataset.meliazTerritoryBootstrap !== "done" &&
      canvas.dataset.meliazTerritoryBootstrap !== "running") {
    canvas.dataset.meliazTerritoryBootstrap = "running";
    void getKonaTerritoryPackReady().then(() => {
      canvas.dataset.meliazTerritoryBootstrap = "done";
    }).catch(error => {
      delete canvas.dataset.meliazTerritoryBootstrap;
      console.warn("MELIAZ Bridge: la preparación inicial del compendio Territorio falló; se reintentará al pulsar +.", error);
    });
  }

  const render = () => {
    const refs = actor.getFlag(MODULE_ID, 'biomasRefs') ?? [];
    const list = box.querySelector('.ha-biomas-list');
    const natureItems = Array.from(actor.items ?? []).filter(item => {
      const kind = inferHiperaItemKind(item);
      return kind === 'flora' || kind === 'fauna' || kind === 'funga' || kind === 'bioma';
    });
    const gridEntries = [
      ...natureItems.map(item => ({ id: item.id, name: item.name, img: item.img || 'icons/svg/item-bag.svg' })),
      ...refs.map(entry => ({ id: `ref:${entry.uuid}`, name: entry.name, img: entry.img || 'icons/svg/book.svg' }))
    ];
    renderKonaItemGrid(list, gridEntries, {
      columns: 2,
      rows: 2,
      slotClass: 'ha-biomas-row ha-kona-item-grid-slot',
      iconClass: 'ha-mini-item-icon ha-biomas-icon',
      datasetKey: 'haBiomasEntry',
      ariaPrefix: 'Abrir referencia de Territorio',
      overflow: 'hidden',
      addAction: 'territorio',
      addLabel: 'Agregar elemento de Territorio',
      hoverLabel: 'Agregar elemento de Territorio'
    });
    if (canvas.classList.contains('ha-kona-experimental-sheet')) {
      // Coordinates are relative to the bounding box of Territory circles 1–4 in SVG v40.
      // Territorio: cuatro centros sobre la curva radial EXTERIOR de la placa.
      // Coordenadas nativas de la imagen 1448×1086; Lenguas conserva su arco interior.
      const territory = [
        { x: 844, y: 920 },
        { x: 953, y: 862 },
        { x: 1039, y: 770 },
        { x: 1095, y: 657 }
      ];
      // Caja ceñida a los cuatro centros y sus hitboxes de 72u (radio 36u).
      const minX = 808, minY = 621, boxW = 323, boxH = 335;
      Array.from(list.querySelectorAll('.ha-biomas-row')).forEach((slot, index) => {
        const point = territory[index];
        if (!point) return;
        slot.style.setProperty('position', 'absolute', 'important');
        // Hitbox 72u; el icono interno conserva 54u y no crece visualmente.
        slot.style.setProperty('left', `${(point.x - 36 - minX) / boxW * 100}%`, 'important');
        slot.style.setProperty('top', `${(point.y - 36 - minY) / boxH * 100}%`, 'important');
        slot.style.setProperty('width', `${72 / boxW * 100}%`, 'important');
        slot.style.setProperty('height', `${72 / boxH * 100}%`, 'important');
        slot.style.setProperty('border', '0', 'important');
        slot.style.setProperty('border-radius', '50%', 'important');
        slot.style.setProperty('padding', '0', 'important');
        slot.style.setProperty('background', 'transparent', 'important');
      });
    }
    for (const slot of list.querySelectorAll('.ha-biomas-row')) {
      if (slot.classList.contains('ha-kona-add-item')) continue;
      const key = slot.dataset.haBiomasEntry || '';
      slot.dataset.haBiomasEntryName = String(gridEntries.find(entry => entry.id === key)?.name ?? "documento");
      slot.addEventListener('click', async ev => {
        ev.preventDefault(); ev.stopPropagation();
        if (key.startsWith('ref:')) {
          const doc = await fromUuid(key.slice(4)).catch(() => null);
          if (doc?.sheet) doc.sheet.render(true);
          else ui.notifications.warn(`No se pudo resolver la referencia de Territorio: ${slot.dataset.haBiomasEntryName ?? "documento"}.`);
        } else {
          const item = actor.items?.get?.(key);
          if (item?.sheet) item.sheet.render(true);
        }
      });
    }
    box.classList.toggle('is-empty', !gridEntries.length);
  };
  render();
  if (box.dataset.haBiomasBound === '1') return;
  box.dataset.haBiomasBound = '1';
  box.addEventListener('dragenter', e=> { e.preventDefault(); box.classList.add('is-dragover'); }, true);
  box.addEventListener('dragleave', e=> { if(!box.contains(e.relatedTarget)) box.classList.remove('is-dragover'); }, true);
  box.addEventListener('dragover', e=> { e.preventDefault(); e.dataTransfer.dropEffect='copy'; }, true);
  box.addEventListener('drop', async e=> {
    e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
    box.classList.remove('is-dragover');
    const raw = e.dataTransfer?.getData('text/plain') || e.dataTransfer?.getData('application/json');
    let data = globalThis.TextEditor?.getDragEventData?.(e) ?? null;
    if (!data) { try { data = JSON.parse(raw); } catch { ui.notifications.warn('No se reconoció el recurso arrastrado.'); return; } }
    const uuid = String(data?.uuid ?? data?.documentUuid ?? '');
    const doc = (await hiperaResolveDroppedItem(data)) ?? (uuid ? await fromUuid(uuid).catch(()=>null) : null);
    if (!doc) { ui.notifications.warn('No se encontró el documento arrastrado; revisa que provenga de un compendio de Items.'); return; }
    // DnD Flora/Fauna/Funga se resuelve ANTES de registrar referencias de Biomas.
    const kind = doc?.documentName === 'Item' ? inferHiperaItemKind(doc) : null;
    if (kind === 'flora' || kind === 'fauna' || kind === 'funga' || kind === 'bioma') {
      if (!hiperaBoxHasCapacity(actor, hiperaNaturalezaItems(actor).length + (actor.getFlag(MODULE_ID,'biomasRefs') ?? []).length, 'Territorio / Naturaleza')) return;
      const seed = hiperaSeedMarker(doc, kind);
      const duplicate = actor.items?.some?.(i => inferHiperaItemKind(i) === kind && hiperaSeedMarker(i, kind) === seed);
      if (duplicate) { ui.notifications.info(`${doc.name} ya está en la ficha.`); return; }
      try {
        const payload = doc.toObject();
        delete payload._id; delete payload.folder; delete payload.ownership; delete payload._stats;
        payload.system ??= {}; payload.system.unique=false; payload.system.uniqueId='';
        const created = await actor.createEmbeddedDocuments('Item',[payload]);
        if (created?.length) { render(); ui.notifications.info(`${doc.name} añadido a la ficha.`); }
      } catch (err) { console.error('Hiperaustralis Flora/Fauna/Funga DnD',err); ui.notifications.error('No se pudo añadir el Item.'); }
      return;
    }
    if (!doc || !['Item','JournalEntry','JournalEntryPage'].includes(doc.documentName)) {
      ui.notifications.warn('Territorio acepta Flora, Fauna, Funga, Biomas o referencias de Journal.'); return;
    }
    const name = String(doc.name ?? '').trim();
    if (!name) return;
    const current = actor.getFlag(MODULE_ID, 'biomasRefs') ?? [];
    if (!hiperaBoxHasCapacity(actor, hiperaNaturalezaItems(actor).length + current.length, 'Territorio / Naturaleza')) return;
    const key = uuid || doc.uuid;
    if (current.some(x=>x.uuid===key)) return;
    await actor.setFlag(MODULE_ID, 'biomasRefs', [...current, {uuid:key,name}]);
    render();
  }, true);
}

function installHiperaItemDrop(canvas, actor) {
  if (!canvas || !actor) return;
  if (canvas.dataset.meliazItemDropBound === "1") return;
  canvas.dataset.meliazItemDropBound = "1";

  // Foundry Compendium drags use Compendium.* UUIDs; resolving the Item
  // asynchronously on DROP is the reliable path. During dragover it is enough
  // to advertise that this sheet accepts Item drops.
  canvas.addEventListener("dragover", event => {
    const types = Array.from(event?.dataTransfer?.types ?? []);
    if (types.includes("text/plain") || types.includes("application/json") || types.includes("text/uri-list")) {
      event.preventDefault();
      if (event.dataTransfer) event.dataTransfer.dropEffect = "copy";
    }
  }, true);

  canvas.addEventListener("drop", async event => {
    let source = null;
    try {
      source = await itemFromHiperaDropEvent(event);
    } catch (err) {
      console.warn("Hiperaustralis: no pude resolver el Item arrastrado.", err);
    }
    if (!source) return;

    const kind = inferHiperaItemKind(source);
    if (!kind) return;

    // Flora, Fauna y Funga son Items documentales, no Biomas ni equipo.
    // Suelta sobre la ficha para agregar una copia al Actor sin alterar el compendio.
    if (kind === "flora" || kind === "fauna" || kind === "funga" || kind === "bioma") {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      try {
        if (!hiperaBoxHasCapacity(actor, hiperaNaturalezaItems(actor).length + (actor.getFlag(MODULE_ID,"biomasRefs") ?? []).length, "Territorio / Naturaleza")) return;
        const marker = hiperaSeedMarker(source, kind);
        const existing = actor.items?.find?.(x => inferHiperaItemKind(x) === kind && hiperaSeedMarker(x, kind) === marker);
        if (existing) {
          ui.notifications.info(`Hiperaustralis: ${source.name} ya está en los Items del personaje.`);
          return;
        }
        const data = source.toObject();
        delete data._id; delete data.folder; delete data.ownership; delete data._stats;
        data.system ??= {}; data.system.unique = false; data.system.uniqueId = "";
        const created = await actor.createEmbeddedDocuments("Item", [data]);
        if (created?.length) { installHiperaBiomas(canvas, actor); ui.notifications.info(`Hiperaustralis: ${source.name} añadido a los Items del personaje.`); }
      } catch (err) {
        console.error("Hiperaustralis: error al añadir Flora/Fauna.", err);
        ui.notifications.error("Hiperaustralis: no pude añadir Flora/Fauna/Funga a la ficha.");
      }
      return;
    }

    // Armas sólo pueden ocupar el destino dedicado de Ñeque.
    if (kind === "arma") {
      const nequeSlot = hiperaNequeLoadoutZoneAtPointer(canvas, event);
      if (nequeSlot !== "arma") return;
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      await attachHiperaNequeLoadout(actor, source, "arma");
      renderHiperaNequeLoadout(canvas, actor);
      return;
    }

    // Defensas sólo pueden ocupar Armadura en Ñeque y con Oficio habilitado.
    if (kind === "defensa") {
      const nequeSlot = hiperaNequeLoadoutZoneAtPointer(canvas, event);
      if (nequeSlot !== "armadura" || !isHiperaArmorOficio(actor)) return;
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      await attachHiperaNequeLoadout(actor, source, "armadura");
      renderHiperaNequeLoadout(canvas, actor);
      return;
    }

    // Equipo común → Equipo.
    if (kind === "equipo") {
      const slot = hiperaEquipoSlotAtPointer(canvas, event);
      if (!slot) return;
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      await attachHiperaArmaToEquipo(actor, source);
      installHiperaEquipoSlotIcons(canvas, actor);
      return;
    }

    // Instrumentos → SENTIR / ONDA.
    if (kind === "instrumento") {
      if (!hiperaSentirInstrumentZoneAtPointer(canvas, event)) return;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      try {
        await attachHiperaInstrumentoToSentir(actor, source);
        renderKonaInstrumentos(canvas, actor);
      } catch (err) {
        console.error("Hiperaustralis: error adjuntando Instrumento a Sentir.", err);
        ui.notifications.error("Hiperaustralis: no pude añadir el Instrumento a Sentir.");
      }
      return;
    }

    // Rituales / Reliquias conservan sus zonas específicas.
    const field = hiperaDropFieldAtPointer(canvas, event);
    if (!field) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    if (kind !== field) {
      ui.notifications.warn(
        kind === "ritual"
          ? "Los Rituales sólo pueden soltarse en RITUALES."
          : "Las Reliquias sólo pueden soltarse en RELIQUIAS."
      );
      return;
    }

    try {
      await embedHiperaItemFromDrop(canvas, actor, event);
    } catch (err) {
      console.error("MELIAZ Bridge: error al incrustar Ritual/Reliquia arrastrado.", err);
      ui.notifications.error("MELIAZ: no pude añadir ese Ritual/Reliquia a la hoja.");
    }
  }, true);
}


function installKonaRitualItemPrototype(canvas, actor) {
  if (!canvas || !actor) return;

  renderKonaRitualItems(canvas, actor);
  void repairKonaRitualSlotPersistence(actor).then(() => {
    if (canvas.isConnected) renderKonaRitualItems(canvas, actor);
  }).catch(error => console.warn("MELIAZ Bridge: no pude reparar el orden persistente de Rituales.", error));

  if (canvas.dataset.meliazRitualItemsBound === "1") return;
  canvas.dataset.meliazRitualItemsBound = "1";

  canvas.addEventListener("click", async event => {
    const remove = event.target.closest?.("[data-ha-ritual-remove]");
    if (remove && canvas.contains(remove)) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      const id = String(remove.dataset.haRitualRemove ?? "");
      const item = actor.items?.get?.(id);
      if (!item) return;

      await actor.deleteEmbeddedDocuments("Item", [id]);
      renderKonaRitualItems(canvas, actor);
      return;
    }

    const row = event.target.closest?.("[data-ha-ritual-item]");
    if (row && canvas.contains(row)) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      const id = String(row.dataset.haRitualItem ?? "");
      const item = actor.items?.get?.(id);
      if (item) await openHiperaRitualItem(item);
    }
  }, true);

  canvas.addEventListener("keydown", async event => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const slot = event.target.closest?.("[data-ha-ritual-item]");
    if (!slot || !canvas.contains(slot)) return;
    event.preventDefault();
    event.stopPropagation();
    const item = actor.items?.get?.(String(slot.dataset.haRitualItem ?? ""));
    if (item) await openHiperaRitualItem(item);
  }, true);
}


const HIPERA_RELIQUIA_TEMPLATE_NAME = "_Hiperaustralis Reliquia";
const HIPERA_RELIQUIA_TEMPLATE_ID = "HipRelqTpl000001";
const HIPERA_ARMA_TEMPLATE_ID = "HipArmaTpl000001";

function isHiperaReliquiaItem(item) {
  if (!item || item.type !== "equippableItem") return false;
  const flagKind = String(item.getFlag?.(MODULE_ID, "kind") ?? "").trim().toLowerCase();
  const propKind = String(item.system?.props?.hipera_tipo ?? "").trim().toLowerCase();
  return flagKind === "reliquia" || propKind === "reliquia";
}

function getKonaReliquiaItems(actor) {
  if (!actor?.items) return [];
  return Array.from(actor.items).filter(isHiperaReliquiaItem);
}

function getLegacyKonaReliquiaNames(actor) {
  const props = actor?.system?.props ?? {};
  return [1, 2, 3, 4]
    .map(i => String(props[`reliquia_${i}`] ?? "").trim())
    .filter(Boolean);
}

function setLegacyReliquiaFieldsVisible(canvas, visible) {
  for (let i = 1; i <= 4; i++) {
    const el = canvas?.querySelector?.(`.ha-reliquia-${i}`);
    if (el) el.style.display = visible ? "" : "none";
  }
}

function renderKonaReliquiaItems(canvas, actor) {
  if (!canvas || !actor) return;

  const itemReliquias = getKonaReliquiaItems(actor);
  const templeCapacity = getKonaReliquiaTempleCapacity(actor);
  let area = canvas.querySelector(".ha-reliquia-items-area");

  // Los campos antiguos se conservan en los datos, pero nunca vuelven a mostrarse.
  setLegacyReliquiaFieldsVisible(canvas, false);
  if (!area) {
    area = document.createElement("div");
    area.className = "ha-reliquia-items-area";
    area.dataset.haReliquiaItems = "1";
    canvas.appendChild(area);
  }

  const count = itemReliquias.length;
  const showArea = count > 0;
  if (canvas.classList.contains("ha-kona-experimental-sheet")) {
    area.style.setProperty("position", "absolute", "important");
    area.style.setProperty("left", "0", "important");
    area.style.setProperty("top", "0", "important");
    area.style.setProperty("width", "100%", "important");
    area.style.setProperty("height", "100%", "important");
    area.style.setProperty("max-width", "100%", "important");
    area.style.setProperty("max-height", "100%", "important");
    area.style.setProperty("overflow", "visible", "important");
    area.style.setProperty("pointer-events", "none", "important");
  }
  area.dataset.count = String(count);
  area.dataset.templeCapacity = String(templeCapacity);
  area.title = "Reliquias";
  area.setAttribute("aria-label", "Reliquias");
  // La distribución se fija directamente en el nodo para evitar que reglas
  // heredadas de las listas horizontales de Kona puedan imponerse al grid.
  area.style.setProperty("display", showArea ? "grid" : "none", "important");
  area.style.setProperty("grid-auto-flow", "row", "important");
  // Geometría maestra definida por el caso máximo (4 Reliquias).
  // Todas las cantidades reutilizan las mismas cuatro celdas 2×2.
  area.style.setProperty("grid-template-columns", "1fr 1fr", "important");
  area.style.setProperty("grid-template-rows", "1fr 1fr", "important");
  area.style.setProperty("align-items", "stretch", "important");
  area.style.setProperty("justify-items", "stretch", "important");
  area.style.setProperty("gap", "0", "important");
  renderKonaItemGrid(area, itemReliquias, {
    columns: 2,
    rows: 2,
    slotClass: "ha-reliquia-icon-slot",
    iconClass: "ha-reliquia-item-icon",
    datasetKey: "haReliquiaItem",
    ariaPrefix: "Abrir Reliquia",
    overflow: "hidden",
    radialCenters: canvas.classList.contains("ha-kona-experimental-sheet") ? [
      { x: 467.5, y: 269.0 }, { x: 406.2, y: 335.9 },
      { x: 487.4, y: 353.0 }, { x: 391.9, y: 407.1 }
    ] : null,
    radialSize: 70
  });
  area.dataset.count = String(count);
  area.dataset.templeCapacity = String(templeCapacity);
  area.style.setProperty("display", showArea ? (canvas.classList.contains("ha-kona-experimental-sheet") ? "block" : "grid") : "none", "important");
  area.style.setProperty("visibility", showArea ? "visible" : "hidden", "important");
  // El tercer icono conserva la celda inferior centrada, sin alterar el grid maestro.
  const third = area.querySelector(".ha-reliquia-icon-slot:nth-child(3)");
  if (third && count === 3 && !canvas.classList.contains("ha-kona-experimental-sheet")) {
    third.style.setProperty("grid-column", "1 / 3", "important");
    third.style.setProperty("width", "50%", "important");
    third.style.setProperty("justify-self", "center", "important");
  }
}

function getHiperaReliquiaTemplate() {
  const stable = game.items?.get?.(HIPERA_RELIQUIA_TEMPLATE_ID);
  if (stable?.type === "_equippableItemTemplate") return stable;
  return game.items?.find?.(item =>
    item?.type === "_equippableItemTemplate" &&
    (
      item.name === HIPERA_RELIQUIA_TEMPLATE_NAME ||
      String(item.getFlag?.(MODULE_ID, "kind") ?? "") === "reliquia-template"
    )
  ) ?? null;
}

function reliquiaTemplateSystemData() {
  const richField = (key, cssClass, label, tooltip) => ({
    key,
    cssClass,
    role: 0,
    editRole: 0,
    permission: 0,
    tooltip,
    visibilityFormula: "",
    editableFormula: "",
    label,
    defaultValue: "",
    style: "dialog",
    type: "textArea"
  });

  return {
    body: {
      contents: [
        richField("historia", "ha-reliquia-historia", "Historia", "Historia material de la Reliquia"),
        richField("correspondencias", "ha-reliquia-correspondencias", "Correspondencias", "Correspondencias elementales, celestes, materiales o territoriales"),
        richField("resonancia", "ha-reliquia-resonancia", "Resonancia", "Cómo pueden volver a operar sus relaciones en una escena"),
        richField("notas", "ha-reliquia-notas", "Notas", "Condiciones particulares de la Reliquia")
      ],
      key: "custom_body",
      cssClass: "ha-reliquia-item-sheet",
      role: 0,
      editRole: 0,
      permission: 0,
      tooltip: "",
      visibilityFormula: "",
      editableFormula: "",
      flow: "vertical",
      align: "left",
      verticalAlign: "top",
      type: "panel"
    },
    display: {
      width: 507,
      height: 381,
      fix_size: false,
      pp_width: 64,
      pp_height: 64
    },
    header: {
      contents: [],
      key: "custom_header",
      cssClass: "",
      type: "panel"
    },
    hidden: [],
    modifiers: [],
    templateSystemUniqueVersion: 172001
  };
}

async function ensureHiperaReliquiaTemplate() {
  let stable = game.items?.get?.(HIPERA_RELIQUIA_TEMPLATE_ID) ?? null;

  if (stable && stable.type !== "_equippableItemTemplate") {
    const ours =
      stable.name === HIPERA_RELIQUIA_TEMPLATE_NAME ||
      String(stable.getFlag?.(MODULE_ID, "kind") ?? "").startsWith("reliquia");

    if (ours && game.user?.isGM) {
      await stable.delete({render: false});
      stable = null;
    } else {
      console.error(`MELIAZ Bridge: ${HIPERA_RELIQUIA_TEMPLATE_ID} está ocupado por un Item ajeno/no compatible.`, stable);
      return null;
    }
  }

  if (stable?.type === "_equippableItemTemplate") {
    if (game.user?.isGM) {
      await stable.update({
        name: HIPERA_RELIQUIA_TEMPLATE_NAME,
        img: "icons/svg/item-bag.svg",
        system: reliquiaTemplateSystemData(),
        [`flags.${MODULE_ID}.kind`]: "reliquia-template"
      }, {render: false});
    }
    return stable;
  }

  if (!game.user?.isGM) return getHiperaReliquiaTemplate();

  const template = await Item.create({
    _id: HIPERA_RELIQUIA_TEMPLATE_ID,
    name: HIPERA_RELIQUIA_TEMPLATE_NAME,
    type: "_equippableItemTemplate",
    img: "icons/svg/item-bag.svg",
    system: reliquiaTemplateSystemData(),
    flags: {
      [MODULE_ID]: {kind: "reliquia-template"}
    }
  }, {keepId: true});

  return template ?? null;
}

async function normalizeReliquiaItem(item, template) {
  return applyHiperaTemplateWithoutContentLoss(item, template, "reliquia", 172001);
}

async function openHiperaReliquiaItem(item) {
  if (!item || item.type !== "equippableItem") return;

  try {
    const template = await ensureHiperaReliquiaTemplate();
    if (!template) {
      ui.notifications.error("MELIAZ: falta la plantilla canónica de Reliquia.");
      return;
    }

    const linked = game.items?.get?.(String(item.system?.template ?? ""));
    const staleVersion = Number(item.system?.templateSystemUniqueVersion ?? 0) !== 172001;
    if (linked?.id !== template.id || linked?.type !== "_equippableItemTemplate" || staleVersion) {
      await normalizeReliquiaItem(item, template);
    }

    await Promise.resolve();

    const sheet = item.sheet;
    if (!sheet) {
      console.error("MELIAZ Bridge: Item-Reliquia sin sheet después de reparar template.", item);
      ui.notifications.error("MELIAZ: la Reliquia existe, pero CSB no entregó una hoja para abrirla.");
      return;
    }

    sheet.render(true);
  } catch (err) {
    console.error("MELIAZ Bridge: error reparando/abriendo hoja de Reliquia.", err, item);
    ui.notifications.error("MELIAZ: no pude reparar y abrir la hoja de la Reliquia.");
  }
}

async function repairHiperaReliquiaItems(actor) {
  if (!actor?.items) return;
  const reliquiaItems = Array.from(actor.items).filter(isHiperaReliquiaItem);
  if (!reliquiaItems.length) return;

  const template = await ensureHiperaReliquiaTemplate();
  if (!template) return;

  for (const item of reliquiaItems) {
    const currentTemplate = game.items?.get?.(String(item.system?.template ?? ""));
    const needsTemplateRepair =
      currentTemplate?.type !== "_equippableItemTemplate" ||
      currentTemplate.id !== template.id;
    const needsUniqueRepair = Boolean(item.system?.unique) || Boolean(String(item.system?.uniqueId ?? ""));
    const needsVersionRepair = Number(item.system?.templateSystemUniqueVersion ?? 0) !== 172001;
    if (needsTemplateRepair || needsUniqueRepair || needsVersionRepair) {
      await normalizeReliquiaItem(item, template);
    }
  }
}

function installKonaReliquiaItems(canvas, actor) {
  if (!canvas || !actor) return;

  renderKonaReliquiaItems(canvas, actor);

  if (canvas.dataset.meliazReliquiaItemsBound === "1") return;
  canvas.dataset.meliazReliquiaItemsBound = "1";

  canvas.addEventListener("click", async event => {
    const remove = event.target.closest?.("[data-ha-reliquia-remove]");
    if (remove && canvas.contains(remove)) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      const id = String(remove.dataset.haReliquiaRemove ?? "");
      const item = actor.items?.get?.(id);
      if (!item) return;

      await actor.deleteEmbeddedDocuments("Item", [id]);
      renderKonaReliquiaItems(canvas, actor);
      return;
    }

    const row = event.target.closest?.("[data-ha-reliquia-item]");
    if (row && canvas.contains(row)) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      const id = String(row.dataset.haReliquiaItem ?? "");
      const item = actor.items?.get?.(id);
      if (item) await openHiperaReliquiaItem(item);
    }
  }, true);

  canvas.addEventListener("keydown", async event => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const slot = event.target.closest?.("[data-ha-reliquia-item]");
    if (!slot || !canvas.contains(slot)) return;
    event.preventDefault();
    event.stopPropagation();
    const item = actor.items?.get?.(String(slot.dataset.haReliquiaItem ?? ""));
    if (item) await openHiperaReliquiaItem(item);
  }, true);
}


// Descendiente is stored in Actor flags so CSB template refreshes cannot erase it.
// Legacy system.props.descendiente is read once and migrated without changing its value.
const konaDescendienteFlagInit = new Map();

function isKonaDescendiente(actor) {
  const persisted = actor?.getFlag?.(MODULE_ID, "descendiente");
  if (typeof persisted === "boolean") return persisted;
  return Boolean(Number(actor?.system?.props?.descendiente ?? 0));
}

function ensureKonaDescendienteFlag(actor) {
  if (!actor?.uuid) return Promise.resolve(false);
  const persisted = actor.getFlag?.(MODULE_ID, "descendiente");
  if (typeof persisted === "boolean") return Promise.resolve(persisted);
  if (konaDescendienteFlagInit.has(actor.uuid)) return konaDescendienteFlagInit.get(actor.uuid);

  const legacyValue = Boolean(Number(actor.system?.props?.descendiente ?? 0));
  const migration = Promise.resolve(actor.setFlag(MODULE_ID, "descendiente", legacyValue))
    .then(() => legacyValue)
    .catch(error => {
      konaDescendienteFlagInit.delete(actor.uuid);
      console.error("MELIAZ Bridge: no pude migrar el estado Descendiente a un flag persistente.", error);
      return legacyValue;
    });
  konaDescendienteFlagInit.set(actor.uuid, migration);
  return migration;
}

function installKonaSheetControls(application, html) {
  const initialActor = getSheetActor(application);
  if (initialActor?.type === "character") void ensureKonaDescendienteFlag(initialActor);
  const root = getRenderedRoot(html);
  const canvas = root?.querySelector?.(".ha-kona-sheet");
  if (!canvas) return;

  const actor = getSheetActor(application);
  if (!actor || actor.type !== "character") return;

  const kizuField = canvas.querySelector(".ha-field-kizuamun");
  const kizuInput = kizuField?.matches?.("input, textarea")
    ? kizuField
    : kizuField?.querySelector?.("input, textarea");
  for (const node of [kizuField, kizuInput].filter(Boolean)) {
    node.title = "Tu misión en la vida";
    node.setAttribute("data-tooltip", "Tu misión en la vida");
    node.setAttribute("aria-label", "Tu misión en la vida");
  }

  if (!canvas.querySelector(".ha-step-newen")) {
    const newen = document.createElement("div");
    newen.className = "ha-resource-stepper ha-step-newen";
    newen.innerHTML = `
      <button type="button" data-ha-resource="newen" data-ha-delta="1" title="Newen +1">+</button>
      <button type="button" data-ha-resource="newen" data-ha-delta="-1" title="Newen −1">−</button>
    `;
    canvas.appendChild(newen);
  }

  if (!canvas.querySelector(".ha-step-aguante")) {
    const aguante = document.createElement("div");
    aguante.className = "ha-resource-stepper ha-step-aguante";
    aguante.innerHTML = `
      <button type="button" data-ha-resource="aguante" data-ha-delta="1" title="Aguante +1">+</button>
      <button type="button" data-ha-resource="aguante" data-ha-delta="-1" title="Aguante −1">−</button>
    `;
    canvas.appendChild(aguante);
  }

  if (!canvas.querySelector(".ha-cap-lock")) {
    const lock = document.createElement("button");
    lock.type = "button";
    lock.className = "ha-cap-lock";
    lock.dataset.haCapLock = "1";
    canvas.appendChild(lock);
  }

  if (!canvas.querySelector(".ha-manifest-button")) {
    const manifest = document.createElement("button");
    manifest.type = "button";
    manifest.className = "ha-manifest-button";
    manifest.dataset.haManifest = "1";
    manifest.title = "Manifestación";
    manifest.textContent = "Manifestación";
    canvas.appendChild(manifest);
  }

  if (!canvas.querySelector(".ha-exaltar-button")) {
    const exaltar = document.createElement("button");
    exaltar.type = "button";
    exaltar.className = "ha-exaltar-button";
    exaltar.dataset.haExaltarSheet = "1";
    exaltar.textContent = "Exaltar";
    exaltar.setAttribute("aria-label", "Exaltar");
    canvas.appendChild(exaltar);
  }

  // v20 hotfix: enlazar Exaltar directamente al hotspot.
  // Esto evita que el control dependa exclusivamente del listener delegado de CSB/canvas.
  const exaltarDirectButton = canvas.querySelector(".ha-exaltar-button");
  if (exaltarDirectButton && exaltarDirectButton.dataset.meliazExaltarBound !== "1") {
    exaltarDirectButton.dataset.meliazExaltarBound = "1";
    exaltarDirectButton.addEventListener("click", async event => {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      if (Number(actor.system?.props?.manifestacion_activa ?? 0) > 0) {
        ui.notifications.warn("MELIAZ: una Manifestación activa no admite Exaltar.");
        return;
      }

      const current = Boolean(actor.getFlag?.(MODULE_ID, "exaltarPrepared"));
      const newen = Number(actor.system?.props?.newen ?? 0);
      if (!current && (!Number.isFinite(newen) || newen < 1)) {
        ui.notifications.warn("MELIAZ: no tienes Newen para preparar Exaltar.");
        return;
      }

      try {
        const pendingId = pendingByActor.get(actor.uuid);
        const pendingAction = pendingId ? pendingById.get(pendingId) : null;

        // Si ya hay una acción pendiente, Exaltar interviene ahora.
        // Si no hay acción pendiente, conserva el comportamiento de preparación.
        if (pendingAction?.state === "pending") {
          await exaltar(actor.uuid);
          applyKonaExaltarState(canvas, actor);
          return;
        }

        if (current) {
          await actor.unsetFlag(MODULE_ID, "exaltarPrepared");
          ui.notifications.info("MELIAZ: Exaltar cancelado.");
        } else {
          await actor.setFlag(MODULE_ID, "exaltarPrepared", true);
          ui.notifications.info("MELIAZ: Exaltar preparado · +1 a la próxima acción ordinaria.");
        }
        applyKonaExaltarState(canvas, actor);
      } catch (err) {
        console.error("MELIAZ Bridge: error preparando/activando Exaltar desde Hoja Kona.", err);
        ui.notifications.error("MELIAZ: no pude actualizar Exaltar desde la Hoja Kona.");
      }
    });
  }

  if (!canvas.querySelector(".ha-descendiente-marker")) {
    const descendiente = document.createElement("button");
    descendiente.type = "button";
    descendiente.className = "ha-descendiente-marker";
    descendiente.dataset.haDescendiente = "1";
    descendiente.textContent = "Descendiente";
    canvas.appendChild(descendiente);
  }

  installKonaMascotaPortrait(canvas, actor);
  applyKonaCapabilityLock(root, actor);
  applyKonaDescendienteState(canvas, actor);
  applyKonaManifestState(canvas, actor);
  applyKonaExaltarState(canvas, actor);
  installKonaCompendiumAddButtons(canvas, actor);
  installHiperaItemDrop(canvas, actor);
  installHiperaEquipoSlotIcons(canvas, actor);
  installHiperaNequeLoadout(canvas, actor);
  installKonaInstrumentos(canvas, actor);
  installHiperaBiomas(canvas, actor);
  installKonaRitualItemPrototype(canvas, actor);
  installKonaReliquiaItems(canvas, actor);

  if (canvas.dataset.meliazKonaControlsBound === "1") return;
  canvas.dataset.meliazKonaControlsBound = "1";

  canvas.addEventListener("change", async event => {
    const select = event.target.closest?.("[data-ha-choice-prop]");
    if (!select || !canvas.contains(select)) return;
    const propKey = select.dataset.haChoiceProp;
    if (propKey !== "oficio" && propKey !== "auspicio") return;

    // Bridge is the sole persistence controller for these two custom selectors.
    // Stop CSB bubble listeners from persisting a stale form snapshot afterward.
    event.stopPropagation();
    event.stopImmediatePropagation();
    const locked = Boolean(actor.getFlag?.(MODULE_ID, "capacidadesLocked"));
    if (locked) { event.preventDefault(); return; }

    const value = String(select.value ?? "").trim();
    if (propKey === "auspicio" && value === "__hipera_custom__") {
      const custom = canvas.querySelector(".ha-auspicio-custom-input");
      const back = canvas.querySelector(".ha-auspicio-menu-back");
      if (custom) {
        select.style.display = "none";
        custom.value = String(actor.system?.props?.auspicio ?? "");
        custom.style.display = "";
        if (back) back.style.display = "";
        custom.focus(); custom.select();
      }
      return;
    }

    await queueKonaActorMutation(actor, async () => {
      if (propKey === "oficio") {
        const gracia = KONA_GRACIA_POR_OFICIO[value] ?? String(actor.system?.props?.gracia ?? "").trim();
        const build = KONA_BUILD_POR_OFICIO[value] ?? null;
        const isDescendiente = isKonaDescendiente(actor);
        const auspicio = getCanonicalKonaAuspicio(value, isDescendiente, String(actor.system?.props?.auspicio ?? "").trim());

        // First make CSB's own form state agree with the requested Oficio.
        // This prevents a delayed CSB form save from restoring the old build.
        syncKonaOficioIntoCsbForm(canvas, value, gracia, build);

        const updateData = {
          "system.props.oficio": value,
          "system.props.gracia": gracia,
          "system.props.auspicio": auspicio
        };

        if (build) {
          updateData["system.props.temple"] = String(build.temple);
          updateData["system.props.onda"] = String(build.onda);
          updateData["system.props.picardia"] = String(build.picardia);
          updateData["system.props.neque"] = String(build.neque);
          updateData["system.props.aguante"] = String(build.neque);
        }

        // Then persist one canonical snapshot to the Actor.
        await actor.update(updateData, { render: false });

        // Re-apply once after CSB's own synchronous change listeners have run.
        syncKonaOficioIntoCsbForm(canvas, value, gracia, build);
        setKonaCsbInputValue(canvas, "auspicio", auspicio, false);
        syncKonaCreationChoices(canvas, actor, false);

        return;
      }

      if (propKey === "auspicio") {
        const oficio = String(actor.system?.props?.oficio ?? "").trim();
        const isDescendiente = isKonaDescendiente(actor);
        const allowed = getKonaAuspiciosFor(oficio, isDescendiente);
        const next = allowed.includes(value) ? value : (allowed[0] ?? "");

        await actor.update(
          { "system.props.auspicio": next },
          { render: false }
        );

        const auspicioInput = canvas.querySelector(".ha-field-auspicio input");
        if (auspicioInput) auspicioInput.value = next;
        select.value = next;
      }
    });
  }, true);

  canvas.addEventListener("click", async event => {
    const resourceButton = event.target.closest?.("[data-ha-resource]");
    if (resourceButton && canvas.contains(resourceButton)) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      const key = resourceButton.dataset.haResource;
      const delta = Number(resourceButton.dataset.haDelta);
      if (!["newen", "aguante"].includes(key) || ![-1, 1].includes(delta)) return;

      await adjustKonaResource(actor, key, delta);
      return;
    }

    const lockButton = event.target.closest?.("[data-ha-cap-lock]");
    if (lockButton && canvas.contains(lockButton)) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      const current = Boolean(actor.getFlag?.(MODULE_ID, "capacidadesLocked"));

      await queueKonaActorMutation(actor, async () => {
        await actor.update(
          { [`flags.${MODULE_ID}.capacidadesLocked`]: !current },
          { render: false }
        );
      });

      applyKonaCapabilityLock(root, actor);
      return;
    }

    const descendienteButton = event.target.closest?.("[data-ha-descendiente]");
    if (descendienteButton && canvas.contains(descendienteButton)) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      const locked = Boolean(actor.getFlag?.(MODULE_ID, "capacidadesLocked"));
      if (locked) return;

      // Finish legacy migration before toggling to avoid a late default flag overwriting the click.
      await ensureKonaDescendienteFlag(actor);
      const current = isKonaDescendiente(actor);
      const nextDescendiente = !current;
      const oficio = String(actor.system?.props?.oficio ?? "").trim();
      const auspicio = getCanonicalKonaAuspicio(oficio, nextDescendiente, String(actor.system?.props?.auspicio ?? "").trim());

      // Durable source of truth lives in Actor flags, outside CSB's template-managed props.
      // The props value is retained only as a compatibility mirror for existing sheets.
      await queueKonaActorMutation(actor, async () => {
        const update = {
          "system.props.descendiente": nextDescendiente ? 1 : 0,
          "system.props.auspicio": auspicio
        };
        if (!nextDescendiente) update["system.props.manifestacion_activa"] = 0;
        try {
          await actor.update(update, { render: false });
        } catch (error) {
          // CSB may reject unknown template props; the Actor flag remains authoritative.
          console.warn("MELIAZ Bridge: no se pudo actualizar la copia CSB de Descendiente.", error);
        }
        // Write the canonical flag last, outside CSB's template-managed system.props.
        await actor.setFlag(MODULE_ID, "descendiente", nextDescendiente);
      });
      setKonaCsbInputValue(canvas, "auspicio", auspicio, false);
      applyKonaDescendienteState(canvas, actor);
      applyKonaManifestState(canvas, actor);
      syncKonaCreationChoices(canvas, actor, Boolean(actor.getFlag?.(MODULE_ID, "capacidadesLocked")));
      return;
    }

    const exaltarSheetButton = event.target.closest?.("[data-ha-exaltar-sheet]");
    if (exaltarSheetButton && canvas.contains(exaltarSheetButton)) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      if (Number(actor.system?.props?.manifestacion_activa ?? 0) > 0) {
        ui.notifications.warn("MELIAZ: una Manifestación activa no admite Exaltar.");
        return;
      }

      const current = Boolean(actor.getFlag?.(MODULE_ID, "exaltarPrepared"));
      const newen = Number(actor.system?.props?.newen ?? 0);
      if (!current && (!Number.isFinite(newen) || newen < 1)) {
        ui.notifications.warn("MELIAZ: no tienes Newen para preparar Exaltar.");
        return;
      }

      const pendingId = pendingByActor.get(actor.uuid);
      const pendingAction = pendingId ? pendingById.get(pendingId) : null;

      if (pendingAction?.state === "pending") {
        await exaltar(actor.uuid);
        applyKonaExaltarState(canvas, actor);
        return;
      }

      if (current) {
        await actor.unsetFlag(MODULE_ID, "exaltarPrepared");
        ui.notifications.info("MELIAZ: Exaltar cancelado.");
      } else {
        await actor.setFlag(MODULE_ID, "exaltarPrepared", true);
        ui.notifications.info("MELIAZ: Exaltar preparado · +1 a la próxima acción ordinaria.");
      }
      applyKonaExaltarState(canvas, actor);
      return;
    }

    const manifestButton = event.target.closest?.("[data-ha-manifest]");
    if (manifestButton && canvas.contains(manifestButton)) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      try {
        if (!isKonaDescendiente(actor)) {
          ui.notifications.warn("MELIAZ: sólo un Descendiente puede Manifestar.");
          return;
        }
        const active = Number(actor.system?.props?.manifestacion_activa ?? 0);
        if (active > 0) {
          await clearManifestacion(actor.uuid);
        } else {
          if (actor.getFlag?.(MODULE_ID, "exaltarPrepared")) {
            await actor.unsetFlag(MODULE_ID, "exaltarPrepared");
            applyKonaExaltarState(canvas, actor);
          }
          await activateManifestacion(actor.uuid);
        }
        applyKonaManifestState(canvas, actor);
      } catch (err) {
        console.error("MELIAZ Bridge: error usando Manifestación desde Hoja Kona.", err);
        ui.notifications.error("MELIAZ: no pude actualizar la Manifestación desde la Hoja Kona.");
      }
      return;
    }
  }, true);
}



function installKonaRollCenterShield(root) {
  const canvas = root?.querySelector?.(".ha-kona-sheet");
  if (!canvas) return;
  if (canvas.querySelector(":scope > .ha-roll-center-shield")) return;

  const shield = document.createElement("div");
  shield.className = "ha-roll-center-shield";
  shield.setAttribute("aria-hidden","true");
  canvas.appendChild(shield);
}

function bindKonaCapabilityClicks(application, html) {
  const root = getRenderedRoot(html);
  if (!root?.querySelector?.(".ha-kona-sheet")) return;
  installKonaRollCenterShield(root);
  if (root.dataset.meliazKonaActionsBound === "1") return;

  const actor = getSheetActor(application);
  if (!actor || actor.type !== "character") return;

  root.dataset.meliazKonaActionsBound = "1";

  root.addEventListener("click", async event => {
    // Los controles de formulario pueden estar superpuestos a zonas de tirada
    // por el diseño absoluto de Kona. Nunca interceptar sus clics en captura:
    // preventDefault aquí puede cerrar inmediatamente los desplegables nativos.
    if (event.target.closest?.("select, option, input, textarea, button, [contenteditable='true']")) return;

    const zone = event.target.closest?.(".ha-kona-roll");
    if (!zone || !root.contains(zone)) return;

    // Gracia is a separate sheet action.
    if (zone.classList.contains("ha-roll-gracia")) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      const raw = String(actor.system?.props?.gracia ?? "").trim().toLowerCase();
      const graciaKey = {
        "pewma": "pewma",
        "entonar": "entonar",
        "franquear": "franquear",
        "arremetida": "arremetida"
      }[raw];

      if (!graciaKey) {
        ui.notifications.warn("MELIAZ: escribe Pewma, Entonar, Franquear o Arremetida en el campo Gracia.");
        return;
      }

      try {
        await activateGracia(actor.uuid, graciaKey, "porte");
      } catch (err) {
        console.error("MELIAZ Bridge: error usando Gracia desde Hoja Kona.", err);
        ui.notifications.error("MELIAZ: no pude activar la Gracia desde la Hoja Kona.");
      }
      return;
    }

    let capKey = null;
    if (zone.classList.contains("ha-roll-temple")) capKey = "temple";
    else if (zone.classList.contains("ha-roll-sentir")) capKey = "sentir";
    else if (zone.classList.contains("ha-roll-onda")) capKey = "sentir"; // legado visual
    else if (zone.classList.contains("ha-roll-neque")) capKey = "neque";
    else if (zone.classList.contains("ha-roll-picardia")) capKey = "picardia";

    if (!capKey) return;

    // The module owns these four click zones. This deliberately bypasses
    // CSB's Label rollMessage handler, which is unreliable under the
    // absolutely-positioned skin used by the Kona sheet.
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    try {
      await startAction(actor.uuid, capKey);
    } catch (err) {
      console.error("MELIAZ Bridge: error desde Hoja Kona.", err);
      ui.notifications.error("MELIAZ: no pude iniciar la acción desde la Hoja Kona.");
    }
  }, true);

  console.log(`MELIAZ Bridge 0.15.1-select-layout-v2 · acciones Hoja Kona enlazadas a ${getActorDisplayName(actor)}.`);
}


function escapeHiperaHtml(value) {
  return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

async function declareHiperaRivalAction(actor) {
  if (!actor || !game.user) return;
  const defaultAction = String(actor.system?.props?.en_escena ?? "").trim();
  const DialogV2 = foundry?.applications?.api?.DialogV2;
  if (!DialogV2?.prompt) {
    ui.notifications.error("MELIAZ: esta versión de Foundry no dispone del diálogo necesario para declarar la acción.");
    return;
  }
  let result;
  try {
    result = await DialogV2.prompt({
      window: { title: `${getActorDisplayName(actor)} · Ataque / Acción` },
      content: `
        <div style="display:grid;gap:0.6rem;min-width:320px;">
          <label style="display:grid;gap:0.25rem;"><strong>Tipo</strong>
            <select name="haRivalActionType"><option value="Ataque">Ataque</option><option value="Acción">Otra acción</option></select>
          </label>
          <label style="display:grid;gap:0.25rem;"><strong>Qué hace el Rival</strong>
            <textarea name="haRivalActionDescription" rows="4" style="width:100%;resize:vertical;">${escapeHiperaHtml(defaultAction)}</textarea>
          </label>
          
        </div>`,
      label: "Publicar en chat",
      rejectClose: false,
      callback: (_event, _button, dialog) => {
        const el = dialog?.element ?? dialog;
        return {
          type: String(el?.querySelector?.('[name="haRivalActionType"]')?.value ?? "Acción"),
          description: String(el?.querySelector?.('[name="haRivalActionDescription"]')?.value ?? "").trim()
        };
      }
    });
  } catch (err) {
    console.error("MELIAZ Bridge: no pude abrir el diálogo de acción del Rival.", err);
    ui.notifications.error("MELIAZ: no pude declarar la acción del Rival.");
    return;
  }
  if (!result || typeof result !== "object") return;
  const description = String(result.description ?? "").trim();
  if (!description) {
    ui.notifications.warn("MELIAZ: escribe la descripción del ataque o acción.");
    return;
  }
  const type = result.type === "Ataque" ? "Ataque" : "Acción";
  const peso = Number(actor.system?.props?.peso);
  const pesoLine = Number.isInteger(peso) && peso >= 1 ? `<p><strong>Peso:</strong> ${peso}</p>` : "";
  await ChatMessage.create({
    user: game.user.id,
    speaker: ChatMessage.getSpeaker({ actor }),
    content: `<section class="meliaz-rival-action-card"><h3>RIVAL · ${escapeHiperaHtml(type.toUpperCase())}</h3><p><strong>${escapeHiperaHtml(getActorDisplayName(actor))}</strong></p>${pesoLine}<p>${escapeHiperaHtml(description).replace(/\n/g, "<br>")}</p></section>`,
    flags: { [MODULE_ID]: { rivalAction: { actorUuid: actor.uuid, type, description, peso: Number.isFinite(peso) ? peso : null, createdAt: Date.now() } } }
  });
}

async function declareHiperaCreatureAction(actor) {
  if (!actor || !game.user) return;
  const defaultAction = String(actor.system?.props?.en_escena ?? "").trim();
  const DialogV2 = foundry?.applications?.api?.DialogV2;
  if (!DialogV2?.prompt) {
    ui.notifications.error("MELIAZ: esta versión de Foundry no dispone del diálogo necesario para declarar la acción.");
    return;
  }
  let result;
  try {
    result = await DialogV2.prompt({
      window: { title: `${getActorDisplayName(actor)} · Acción` },
      content: `
        <div style="display:grid;gap:0.6rem;min-width:320px;">
          <label style="display:grid;gap:0.25rem;"><strong>Acción de la Criatura</strong>
            <textarea name="haCreatureActionDescription" rows="4" style="width:100%;resize:vertical;">${escapeHiperaHtml(defaultAction)}</textarea>
          </label>
          
        </div>`,
      label: "Publicar en chat",
      rejectClose: false,
      callback: (_event, _button, dialog) => {
        const el = dialog?.element ?? dialog;
        return { description: String(el?.querySelector?.('[name="haCreatureActionDescription"]')?.value ?? "").trim() };
      }
    });
  } catch (err) {
    console.error("MELIAZ Bridge: no pude abrir el diálogo de acción de la Criatura.", err);
    ui.notifications.error("MELIAZ: no pude declarar la acción de la Criatura.");
    return;
  }
  if (!result || typeof result !== "object") return;
  const description = String(result.description ?? "").trim();
  if (!description) {
    ui.notifications.warn("MELIAZ: escribe la descripción de la acción.");
    return;
  }
  const peso = Number(actor.system?.props?.peso);
  const pesoLine = Number.isInteger(peso) && peso >= 1 ? `<p><strong>Peso:</strong> ${peso}</p>` : "";
  await ChatMessage.create({
    user: game.user.id,
    speaker: ChatMessage.getSpeaker({ actor }),
    content: `<section class="meliaz-rival-action-card"><h3>CRIATURA · ACCIÓN</h3><p><strong>${escapeHiperaHtml(getActorDisplayName(actor))}</strong></p>${pesoLine}<p>${escapeHiperaHtml(description).replace(/\n/g, "<br>")}</p></section>`,
    flags: { [MODULE_ID]: { creatureAction: { actorUuid: actor.uuid, type: "Acción", description, peso: Number.isFinite(peso) ? peso : null, createdAt: Date.now() } } }
  });
}


// Compatibilidad: limpia exclusivamente anotaciones de producción conocidas en actores Hiperaustralis heredados.
// No genera ni añade reglas nuevas; el contenido de juego se conserva salvo la nota técnica explícita.
// Migración de compatibilidad: elimina etiquetas de producción y campos heredados de fichas Hiperaustralis.
// La pasada es conservadora: no toca texto corriente si no detecta lenguaje de producción conocido.
const HIPERA_LEGACY_TEXT_CLEANUP_PENDING = new Set();
const HIPERA_TEMPLATE_IDS = new Set(["HipRivalTpl00001", "HipCriatTpl00001", "HipObstTpl00001", "HipAnimalTpl00001"]);
const HIPERA_PRODUCTION_TEXT_RE = /nota\s+de\s+peso|nota[_\s-]*peso|playtest|\bcandidato\b|\bcandidata\b|\bprovisional\b|\bprovisorio\b|no\s+can[oó]n(?:ico|ica)?|peso\s+t[eé]cnico|fuente\s+documental|inventario\s+de\s+juego|ejemplo\s+ya\s+documentado|confirmado\s+(?:por\s+el\s+autor|en\s+playtest)|estado\s+maestro|estado\s+editorial|prueba\s+runtime|pendiente\s+de\s+(?:validaci[oó]n|prueba|revisi[oó]n)|reserva\s+editorial|revisi[oó]n\s+espec[ií]fica|no\s+concede\s+PV\s+ni\s+da[nñ]o\s+autom[aá]tico|estado\s+de\s+contenido|revisi[oó]n\s+interna|no\s+publicar|preseleccionado|discrepancia\s+documental|selecci[oó]n\s+del\s+autor|aprobado\s+por\s+autor|CULT\s+v\d+|fuente\s*\/\s*lab|visual-pending|ratificada_v\d+_revision_interna|source-supplied/iu;
const HIPERA_TECHNICAL_CONTENT_RE = /nota\s+de\s+peso|nota[_\s-]*peso|playtest|no\s+can[oó]n(?:ico|ica)?|no\s+est[aá]\s+canonizad[oa]|peso\s+t[eé]cnico|fuente\s+documental|inventario\s+de\s+juego|ejemplo\s+ya\s+documentado|confirmado\s+(?:por\s+el\s+autor|en\s+playtest)|estado\s+maestro|estado\s+editorial|prueba\s+runtime|pendiente\s+de\s+(?:validaci[oó]n|prueba|revisi[oó]n)|reserva\s+editorial|revisi[oó]n\s+espec[ií]fica|no\s+concede\s+PV\s+ni\s+da[nñ]o\s+autom[aá]tico|estado\s+de\s+contenido|revisi[oó]n\s+interna|no\s+publicar|preseleccionado|discrepancia\s+documental|selecci[oó]n\s+del\s+autor|aprobado\s+por\s+autor|CULT\s+v\d+|fuente\s*\/\s*lab|visual-pending|ratificada_v\d+_revision_interna|source-supplied/iu;

const HIPERA_WEIGHT_GUIDANCE_CUE = /(?:\bpuede\s+representar\b|\bsolo\s+(?:corresponde|si|cuando)\b|\bs[oó]lo\s+(?:corresponde|si|cuando)\b|\b(?:asigna|aplica|ajusta|determina|valora)\s+(?:el\s+)?peso\b|\bpeso\s+(?:solo|s[oó]lo|seg[uú]n|de\s+referencia|sugerido|mayor|importa|depende)\b|\bsu\s+peso\s+importa\b|\boposici[oó]n\s+(?:f[ií]sica|corporal|directa|concreta|significativa)\b|\bno\s+concede\s+PV\b|\bcopiar\s+autom[aá]ticamente\b|\bpor\s+escena\b)/iu;
function isHiperaWeightGuidanceBlock(value) {
  const text = stripHiperaMarkup(value);
  if (!/\bpeso\b/iu.test(text)) return false;
  return /^(?:(?:nota\s+de\s+)?peso(?:\s+de\s+referencia)?(?:\s+\d+)?\s*[:—-]?|su\s+peso\b|(?:aplica|asigna|ajusta|determina|valora)\s+(?:el\s+)?peso\b)/iu.test(text) && HIPERA_WEIGHT_GUIDANCE_CUE.test(text)
    || /\bpeso\s+de\s+referencia\s*:/iu.test(text)
    || (/^intervenciones\b/iu.test(text) && HIPERA_WEIGHT_GUIDANCE_CUE.test(text));
}
function isHiperaWeightGuidanceSegment(value) {
  const text = stripHiperaMarkup(value);
  return /\bpeso\b/iu.test(text) && HIPERA_WEIGHT_GUIDANCE_CUE.test(text);
}
function cleanExplicitNotaPesoBlocks(value) {
  const original = String(value ?? "");
  if (!/nota\s+de\s+peso/iu.test(original)) return original;
  if (typeof DOMParser !== "undefined" && /<[a-z][^>]*>/iu.test(original)) {
    try {
      const parsed = new DOMParser().parseFromString(original, "text/html");
      let removed = false;
      for (const block of Array.from(parsed.body.querySelectorAll("p, li, blockquote, h1, h2, h3, h4, h5, h6")).reverse()) {
        const plain = String(block.textContent ?? "").replace(/\s+/gu, " ").trim();
        if (/^nota\s+de\s+peso(?:\s*[:—-]|$)/iu.test(plain)) {
          block.remove();
          removed = true;
        }
      }
      if (removed) return parsed.body.innerHTML;
    } catch (_) {}
  }
  const parts = original.split(/(\r?\n\s*\r?\n|\r?\n)/u);
  let changed = false;
  const kept = [];
  for (const part of parts) {
    const plain = part.replace(/<[^>]*>/gu, " ").replace(/&nbsp;/giu, " ").replace(/\s+/gu, " ").trim();
    if (/^nota\s+de\s+peso(?:\s*[:—-]|$)/iu.test(plain)) { changed = true; continue; }
    kept.push(part);
  }
  return changed ? kept.join("").replace(/(?:\r?\n){3,}/gu, "\n\n").trim() : original;
}
function cleanHiperaWeightGuidanceText(value) {
  const original = String(value ?? "");
  const explicitClean = cleanExplicitNotaPesoBlocks(original);
  if (explicitClean !== original) return explicitClean;
  if (!isHiperaWeightGuidanceBlock(original) && !isHiperaWeightGuidanceSegment(original)) return original;
  if (typeof DOMParser !== "undefined" && /<[a-z][^>]*>/iu.test(original)) {
    try {
      const parsed = new DOMParser().parseFromString(original, "text/html");
      for (const block of Array.from(parsed.body.querySelectorAll("p, li, blockquote, h1, h2, h3, h4, h5, h6")).reverse()) {
        if (isHiperaWeightGuidanceBlock(block.textContent ?? "")) block.remove();
      }
      const walker = parsed.createTreeWalker(parsed.body, NodeFilter.SHOW_TEXT);
      const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
      for (const node of nodes) {
        const parts = String(node.nodeValue ?? "").split(/(?<=[.!?;])\s+/u);
        node.nodeValue = parts.filter(part => !isHiperaWeightGuidanceSegment(part)).join(" ");
      }
      return parsed.body.innerHTML;
    } catch (_) {}
  }
  const paragraphs = original.split(/(?:\r?\n\s*\r?\n)+/u);
  const output = [];
  for (const paragraph of paragraphs) {
    if (isHiperaWeightGuidanceBlock(paragraph)) continue;
    const parts = paragraph.split(/(?<=[.!?;])\s+/u).filter(part => !isHiperaWeightGuidanceSegment(part));
    const joined = parts.join(" ").replace(/\s+([,.;:])/gu, "$1").trim();
    if (joined) output.push(joined);
  }
  return output.join("\n\n");
}
const HIPERA_EDITORIAL_KEY_RE = /^(?:nota[_\s-]*peso|nota[_\s-]*editorial|nota[_\s-]*documental|peso[_\s-]*contexto|estado[_\s-]*(?:peso|editorial|visual|inclusion)|ajuste[_\s-]*situacional|reserva[_\s-]*editorial|revision[_\s-]*especifica|icon[_\s-]*status|text[_\s-]*status|name[_\s-]*status|evidence[_\s-]*status|publication[_\s-]*status|visual[_\s-]*status|description[_\s-]*source)$/iu;
const HIPERA_DELETE_VALUE = Symbol("HIPERA_DELETE_VALUE");
function stripHiperaMarkup(value) { return String(value ?? "").replace(/<[^>]*>/gu, " ").replace(/&nbsp;/giu, " ").replace(/\s+/gu, " ").trim(); }
function cleanLegacyHiperaGameplayField(value) {
  if (typeof value !== "string" || (!HIPERA_TECHNICAL_CONTENT_RE.test(value) && !isHiperaWeightGuidanceBlock(value) && !isHiperaWeightGuidanceSegment(value))) return null;
  const original = value;
  let text = cleanHiperaWeightGuidanceText(value)
    .replace(/Peso situacional de playtest\s*;\s*no concede PV ni da[nñ]o autom[aá]tico\.?/giu, "")
    .replace(/Peso t[eé]cnico inicial \d+,?\s*provisional y no can[oó]nico\.?\s*/giu, "")
    .replace(/Peso 1 confirmado en playtest\.?/giu, "")
    .replace(/Peso 1 confirmado por el autor\.?/giu, "")
    .replace(/Peso \d+ es la sugerencia que ya figura en el Item de fauna y sigue siendo PLAYTEST, no canon\.?\s*/giu, "")
    .replace(/Peso \d+ es una propuesta de dise[nñ]o PLAYTEST, no un dato zool[oó]gico ni canon\.?\s*/giu, "")
    .replace(/Peso \d+ es una propuesta de dise[nñ]o PLAYTEST para\s*/giu, "Peso puede representar ")
    .replace(/Peso \d+ es una propuesta de PLAYTEST para\s*/giu, "Peso puede representar ")
    .replace(/Peso \d+ s[oó]lo para el encuentro de playtest del refugio, como propone la fuente documental\.?\s*Sigue siendo PLAYTEST y no un valor universal de todos los milodones; recalibrar seg[uú]n la oposici[oó]n real de cada escena\./giu, "En el refugio, Peso puede representar la oposici[oó]n f[ií]sica; en otras situaciones, ajusta el Peso a lo que ocurra en la escena.")
    .replace(/Peso \d+ es PLAYTEST y s[oó]lo representa\s*/giu, "Peso puede representar ")
    .replace(/Peso \d+ es PLAYTEST para\s*/giu, "Peso puede representar ")
    .replace(/Peso \d+ es un valor de PLAYTEST para\s*/giu, "Peso puede representar ")
    .replace(/La supervivencia de [^.;]+ no est[aá] canonizada;?\s*/giu, "")
    .replace(/La revisi[oó]n comercial del nombre intertextual sigue pendiente\.?/giu, "")
    .replace(/como propone la fuente documental/giu, "")
    .replace(/seg[uú]n el inventario de juego/giu, "")
    .replace(/\(ejemplo ya documentado\)/giu, "")
    .replace(/la cuant[ií]a de dicho bono sigue indefinida en el Estado Maestro\.?/giu, "")
    .replace(/\bEn juego:\s*/giu, "");

  // Limpia HTML por bloques interiores, nunca por contenedores raíz como <section> o <div>.
  // Así se retira la nota técnica sin borrar también la descripción de juego que la rodea.
  if (typeof DOMParser !== "undefined" && /<[a-z][^>]*>/iu.test(text)) {
    try {
      const parsed = new DOMParser().parseFromString(text, "text/html");
      const blockSelector = "p, li, h1, h2, h3, h4, h5, h6, blockquote, small, span, strong, em, div, section";
      const blocks = Array.from(parsed.body.querySelectorAll(blockSelector)).reverse();
      for (const block of blocks) {
        if (!block.isConnected) continue;
        const blockText = stripHiperaMarkup(block.textContent ?? "");
        if (!blockText || (!HIPERA_TECHNICAL_CONTENT_RE.test(blockText) && !isHiperaWeightGuidanceBlock(blockText) && !isHiperaWeightGuidanceSegment(blockText))) continue;
        const children = Array.from(block.children ?? []);
        const directTextNodes = Array.from(block.childNodes ?? []).filter(node => node.nodeType === 3);
        // No borres un párrafo completo si contiene texto de juego junto a una marca técnica.
        const directTextIsEditorial = directTextNodes.every(node => {
          const directText = stripHiperaMarkup(node.nodeValue ?? "");
          return !directText || HIPERA_TECHNICAL_CONTENT_RE.test(directText) || isHiperaWeightGuidanceSegment(directText);
        });
        const childrenAreEditorial = children.every(child => {
          const childText = stripHiperaMarkup(child.textContent ?? "");
          return !childText || HIPERA_TECHNICAL_CONTENT_RE.test(childText) || isHiperaWeightGuidanceBlock(childText) || isHiperaWeightGuidanceSegment(childText);
        });
        const safeToRemove = directTextIsEditorial && childrenAreEditorial &&
          (children.length === 0 || directTextNodes.length === 0 ||
           stripHiperaMarkup(block.textContent ?? "") === directTextNodes.map(node => node.nodeValue ?? "").join(" ").trim());
        if (safeToRemove) block.remove();
      }
      const walker = parsed.createTreeWalker(parsed.body, NodeFilter.SHOW_TEXT);
      const textNodes = [];
      while (walker.nextNode()) textNodes.push(walker.currentNode);
      for (const node of textNodes) {
        const nodeText = String(node.nodeValue ?? "");
        if (!HIPERA_TECHNICAL_CONTENT_RE.test(nodeText) && !isHiperaWeightGuidanceBlock(nodeText) && !isHiperaWeightGuidanceSegment(nodeText)) continue;
        const cleanedNode = nodeText.split(/(?<=[.!?;])\s+/u)
          .filter(sentence => !HIPERA_TECHNICAL_CONTENT_RE.test(sentence) && !isHiperaWeightGuidanceSegment(sentence)).join(" ");
        node.nodeValue = cleanedNode;
      }
      for (const empty of Array.from(parsed.body.querySelectorAll("p, li, h1, h2, h3, h4, h5, h6, blockquote, small, span, strong, em")).reverse()) {
        if (!stripHiperaMarkup(empty.textContent ?? "") && !empty.querySelector("img, input, textarea, select")) empty.remove();
      }
      text = parsed.body.innerHTML;
    } catch (error) {
      // Fallback abaixo para entornos sin DOMParser.
    }
  }
  // Fallback de texto plano (o HTML ya saneado): elimina solo la oración marcada.
  text = text.split(/\r?\n/u).map(line => {
    if (!HIPERA_TECHNICAL_CONTENT_RE.test(stripHiperaMarkup(line)) && !isHiperaWeightGuidanceBlock(line) && !isHiperaWeightGuidanceSegment(line)) return line;
    return line.split(/(?<=[.!?;])\s+/u).filter(sentence => !HIPERA_TECHNICAL_CONTENT_RE.test(stripHiperaMarkup(sentence)) && !isHiperaWeightGuidanceSegment(sentence)).join(" ");
  }).join("\n");
  if (HIPERA_TECHNICAL_CONTENT_RE.test(stripHiperaMarkup(text)) || isHiperaWeightGuidanceBlock(text) || isHiperaWeightGuidanceSegment(text)) return "";
  text = text
    .replace(/<p(?:\s[^>]*)?>\s*<\/p>/giu, "")
    .replace(/<div(?:\s[^>]*)?>\s*<\/div>/giu, "")
    .replace(/[ \t]{2,}/gu, " ")
    .replace(/\n[ \t]+/gu, "\n")
    .replace(/^[ \t\r\n]+|[ \t\r\n]+$/gu, "");
  return text === original ? null : text;
}
function isHiperaEditorialKey(key, value, inFlags = false) {
  const k = String(key ?? "");
  const normalized = k.toLocaleLowerCase("es").normalize("NFD")
    .replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  if (normalized === "notapeso" || normalized === "notadepeso") return true;
  if (HIPERA_EDITORIAL_KEY_RE.test(k)) return true;
  if (inFlags && /^(?:candidate|iscandidate|status|estado)$/iu.test(normalized)) return true;
  return false;
}
function sanitizeHiperaTree(value, inFlags = false, parentKey = "") {
  if (typeof value === "string") {
    if (/^version$/iu.test(parentKey) && /playtest/iu.test(value)) return value.replace(/[-_ ]*playtest.*$/iu, "").trim() || "1";
    const cleaned = cleanLegacyHiperaGameplayField(value);
    return cleaned === null ? value : cleaned;
  }
  if (Array.isArray(value)) {
    const result = [];
    for (const item of value) {
      const next = sanitizeHiperaTree(item, inFlags, parentKey);
      if (next !== HIPERA_DELETE_VALUE) result.push(next);
    }
    return result;
  }
  if (!value || typeof value !== "object") return value;
  const result = {};
  for (const [key, child] of Object.entries(value)) {
    if (isHiperaEditorialKey(key, child, inFlags)) continue;
    const next = sanitizeHiperaTree(child, inFlags, key);
    if (next !== HIPERA_DELETE_VALUE) result[key] = next;
  }
  return result;
}
function isLegacyNotaPesoFieldDefinition(field) {
  if (!field || typeof field !== "object") return false;
  const values = [field.key, field.cssClass, field.label, field.name, field.title,
    field.value, field.defaultValue, field.tooltip, field.placeholder, field.ariaLabel,
    field.fieldKey, field.prefix, field.suffix, field.description, field.caption]
    .filter(value => typeof value === "string").join(" ");
  const normalized = values.toLocaleLowerCase("es").normalize("NFD")
    .replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  return normalized.includes("notadepeso") || normalized.includes("notapeso");
}
function removeLegacyPesoField(contents) {
  if (!Array.isArray(contents)) return contents;
  const cleanNested = value => {
    if (Array.isArray(value)) return removeLegacyPesoField(value);
    if (!value || typeof value !== "object") return value;
    const next = {};
    for (const [key, child] of Object.entries(value)) {
      const normalizedKey = String(key).toLocaleLowerCase("es").normalize("NFD")
        .replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
      if (normalizedKey === "notapeso" || normalizedKey === "notadepeso") continue;
      next[key] = cleanNested(child);
    }
    return next;
  };
  const result = [];
  for (const field of contents) {
    if (!field || typeof field !== "object") { result.push(field); continue; }
    if (isLegacyNotaPesoFieldDefinition(field)) continue;
    result.push(cleanNested(field));
  }
  return result;
}
function noteLooksDuplicated(scene, note) {
  const norm = value => String(value ?? "").toLocaleLowerCase("es").replace(/[^a-z0-9áéíóúüñ]+/g, " ").trim();
  const a = norm(scene), b = norm(note);
  if (!a || !b) return false;
  if (a.includes(b) || b.includes(a)) return true;
  const aw = new Set(a.split(/\s+/u).filter(w => w.length > 2));
  const bw = new Set(b.split(/\s+/u).filter(w => w.length > 2));
  if (!aw.size || !bw.size) return false;
  let common = 0;
  for (const w of bw) if (aw.has(w)) common++;
  return common / Math.min(aw.size, bw.size) >= 0.82;
}
function buildHiperaTreeUpdateChanges(prefix, original, cleaned, changes) {
  if (JSON.stringify(original) === JSON.stringify(cleaned)) return;
  if (original && cleaned && typeof original === "object" && typeof cleaned === "object" && !Array.isArray(original) && !Array.isArray(cleaned)) {
    for (const key of Object.keys(original)) {
      if (!Object.prototype.hasOwnProperty.call(cleaned, key)) changes[`${prefix}.-=${key}`] = null;
      else buildHiperaTreeUpdateChanges(`${prefix}.${key}`, original[key], cleaned[key], changes);
    }
    for (const key of Object.keys(cleaned)) {
      if (!Object.prototype.hasOwnProperty.call(original, key)) changes[`${prefix}.${key}`] = cleaned[key];
    }
    return;
  }
  changes[prefix] = cleaned;
}
function cleanHiperaActorName(name) {
  return String(name ?? "").replace(/\s*[·—-]\s*(?:candidato|playtest|provisional)\b.*$/iu, "").replace(/\s*\[(?:candidato|playtest|provisional)[^\]]*\]\s*/giu, " ").trim();
}
async function cleanLegacyHiperaGameplayActor(actor) {
  if (!actor || !game.user?.isGM || actor.pack || !actor.isOwner) return false;
  const templateId = String(actor.system?.template ?? "");
  const flags = actor.flags ?? {};
  const propsForDetection = actor.system?.props ?? {};
  const bodyFieldsForDetection = [
    ...(actor.system?.body?.contents ?? []),
    ...(actor.system?.header?.contents ?? [])
  ];
  const hasLegacyPesoProp = Object.prototype.hasOwnProperty.call(propsForDetection, "nota_peso") ||
    Object.prototype.hasOwnProperty.call(propsForDetection, "nota-peso");
  const hasLegacyPesoField = Array.isArray(bodyFieldsForDetection) && bodyFieldsForDetection.some(field => {
    if (!field || typeof field !== "object") return false;
    return isLegacyNotaPesoFieldDefinition(field) || /playtest|candidato|provisional|estado[_\s-]*(?:editorial|peso|visual|inclusion)/iu
      .test(`${field.key ?? ""} ${field.cssClass ?? ""} ${field.label ?? ""} ${field.name ?? ""} ${field.value ?? ""} ${field.title ?? ""}`);
  });
  const hasHiperaImage = /modules\/hiperaustralis-rituales\//iu.test(String(actor.img ?? "")) ||
    /modules\/hiperaustralis-rituales\//iu.test(String(actor.prototypeToken?.texture?.src ?? ""));
  const isTemplate = actor.type === "_template" && (
    HIPERA_TEMPLATE_IDS.has(String(actor.id ?? "")) ||
    flags["hiperaustralis-rival-template"] || flags["hiperaustralis-creature-template"] ||
    flags["hiperaustralis-obstacle-template"] || flags["hiperaustralis-animal-template"] ||
    /^_?Hiperaustralis\b/iu.test(String(actor.name ?? ""))
  );
  const isHiperaSheet = isTemplate || HIPERA_TEMPLATE_IDS.has(templateId) ||
    Boolean(flags["hiperaustralis-bestiario"]) || Boolean(flags["hiperaustralis-adversarios-mapuche"]) ||
    hasHiperaImage || hasLegacyPesoProp || hasLegacyPesoField;
  if (!isHiperaSheet) return false;
  const uuid = String(actor.uuid ?? actor.id ?? "unknown");
  if (HIPERA_LEGACY_TEXT_CLEANUP_PENDING.has(uuid)) return false;
  const changes = {};
  const finalName = cleanHiperaActorName(actor.name);
  if (finalName && finalName !== actor.name) changes.name = finalName;

  const props = actor.system?.props ?? {};
  const rawLegacyNote = typeof props.nota_peso === "string" ? props.nota_peso : "";
  const noteIsTechnical = HIPERA_PRODUCTION_TEXT_RE.test(rawLegacyNote);
  const usefulLegacyNote = rawLegacyNote.trim() && !noteIsTechnical ? rawLegacyNote.trim() : "";
  const originalScene = String(props.en_escena ?? "");
  let sceneForMerge = originalScene;
  if (usefulLegacyNote && !noteLooksDuplicated(originalScene, usefulLegacyNote)) {
    sceneForMerge = [originalScene.trim(), usefulLegacyNote].filter(Boolean).join("\n\n");
  }
  const propsSource = { ...props, en_escena: sceneForMerge };
  const cleanProps = sanitizeHiperaTree(propsSource, false);
  buildHiperaTreeUpdateChanges("system.props", props, cleanProps, changes);
  // Explicitly remove the old field even if it contained no text.
  for (const legacyKey of Object.keys(props)) {
    const normalized = legacyKey.toLocaleLowerCase("es").normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
    if (normalized === "notapeso" || normalized === "notadepeso") changes[`system.props.-=${legacyKey}`] = null;
  }

  for (const collectionKey of ["body", "header"]) {
    const collection = actor.system?.[collectionKey];
    if (collection && Array.isArray(collection.contents)) {
      const filtered = removeLegacyPesoField(collection.contents);
      if (JSON.stringify(filtered) !== JSON.stringify(collection.contents)) changes[`system.${collectionKey}.contents`] = filtered;
    }
  }
  for (const flagName of Object.keys(flags)) {
    if (flagName === "hiperaustralis" || flagName.startsWith("hiperaustralis-")) {
      const sanitizedFlag = sanitizeHiperaTree(flags[flagName], true);
      buildHiperaTreeUpdateChanges(`flags.${flagName}`, flags[flagName], sanitizedFlag, changes);
    } else if (flagName === MODULE_ID && flags[flagName]?.mascotaPortrait) {
      const portrait = flags[flagName].mascotaPortrait;
      const cleanedPortrait = sanitizeHiperaTree(portrait, true);
      buildHiperaTreeUpdateChanges(`flags.${MODULE_ID}.mascotaPortrait`, portrait, cleanedPortrait, changes);
    }
  }
  if (!Object.keys(changes).length) return false;
  HIPERA_LEGACY_TEXT_CLEANUP_PENDING.add(uuid);
  try {
    await actor.update(changes, { render: false });
    return true;
  } catch (error) {
    console.warn("MELIAZ: no se pudo actualizar una ficha antigua de Hiperaustralis.", error);
    return false;
  } finally {
    HIPERA_LEGACY_TEXT_CLEANUP_PENDING.delete(uuid);
  }
}
async function sanitizeHiperaDocument(document, basePath = "") {
  const changes = {};
  const props = document.system?.props;
  if (props && typeof props === "object") {
    const cleanProps = sanitizeHiperaTree(props, false);
    buildHiperaTreeUpdateChanges("system.props", props, cleanProps, changes);
  }
  for (const collectionKey of ["body", "header"]) {
    const contents = document.system?.[collectionKey]?.contents;
    if (Array.isArray(contents)) {
      const filtered = removeLegacyPesoField(contents);
      if (JSON.stringify(filtered) !== JSON.stringify(contents)) changes[`system.${collectionKey}.contents`] = filtered;
    }
  }
  const finalName = cleanHiperaActorName(document.name);
  if (finalName && finalName !== document.name) changes.name = finalName;
  for (const [flagName, flag] of Object.entries(document.flags ?? {})) {
    if (!(flagName === "hiperaustralis" || flagName.startsWith("hiperaustralis-"))) continue;
    const cleanFlag = sanitizeHiperaTree(flag, true);
    buildHiperaTreeUpdateChanges(`flags.${flagName}`, flag, cleanFlag, changes);
  }
  if (document.flags?.[MODULE_ID]?.mascotaPortrait) {
    const portrait = document.flags[MODULE_ID].mascotaPortrait;
    buildHiperaTreeUpdateChanges(`flags.${MODULE_ID}.mascotaPortrait`, portrait, sanitizeHiperaTree(portrait, true), changes);
  }
  if (!Object.keys(changes).length) return false;
  await document.update(changes, { render: false });
  return true;
}
function hasHiperaLegacyFieldSignature(document) {
  const fields = [
    ...(document?.system?.body?.contents ?? []),
    ...(document?.system?.header?.contents ?? [])
  ];
  return fields.some(field => {
    if (!field || typeof field !== "object") return false;
    const signature = `${field.key ?? ""} ${field.cssClass ?? ""} ${field.label ?? ""} ${field.name ?? ""} ${field.value ?? ""} ${field.title ?? ""}`;
    return isLegacyNotaPesoFieldDefinition(field) || /playtest|candidato|provisional|estado[_\s-]*(?:editorial|peso|visual|inclusion)|peso[_\s-]*contexto|ajuste[_\s-]*situacional|nota[_\s-]*(?:editorial|documental)/iu.test(signature);
  });
}

function hasHiperaWeightGuidanceDeep(value, depth = 0) {
  if (depth > 16 || value == null) return false;
  if (typeof value === "string") {
    return /nota\s+de\s+peso|nota[_\s-]*peso/iu.test(value) ||
      isHiperaWeightGuidanceBlock(value) || isHiperaWeightGuidanceSegment(value);
  }
  if (Array.isArray(value)) return value.some(item => hasHiperaWeightGuidanceDeep(item, depth + 1));
  if (typeof value === "object") return Object.values(value).some(item => hasHiperaWeightGuidanceDeep(item, depth + 1));
  return false;
}

function hasHiperaNamespace(flags = {}) {
  return Object.keys(flags ?? {}).some(key => key === "hiperaustralis" || key.startsWith("hiperaustralis-"));
}

function isHiperaCleanupTarget(document) {
  if (!document) return false;
  const flags = document.flags ?? {};
  const templateId = String(document.system?.template ?? "");
  const imagePaths = [document.img, document.prototypeToken?.texture?.src]
    .map(value => String(value ?? "")).join(" ");
  const name = String(document.name ?? "");
  const props = document.system?.props ?? {};
  const hasLegacyNote = Object.prototype.hasOwnProperty.call(props, "nota_peso") ||
    Object.prototype.hasOwnProperty.call(props, "nota-peso");
  const hasPagesWithHiperaMarkers = Array.from(document.pages?.contents ?? []).some(page =>
    hasHiperaNamespace(page.flags ?? {}) ||
    hasHiperaWeightGuidanceDeep(page.text?.content ?? "")
  );
  return hasHiperaNamespace(flags) ||
    /modules\/hiperaustralis-rituales\//iu.test(imagePaths) ||
    HIPERA_TEMPLATE_IDS.has(templateId) || HIPERA_TEMPLATE_IDS.has(String(document.id ?? "")) ||
    /^_?Hiperaustralis\b/iu.test(name) || hasLegacyNote || hasHiperaLegacyFieldSignature(document) || hasPagesWithHiperaMarkers || hasHiperaWeightGuidanceDeep(document.system?.props) || hasHiperaWeightGuidanceDeep(document.system?.body);
}

async function cleanHiperaJournalDocumentV02446(journal) {
  const journalChanges = {};
  let changed = false;
  const finalName = cleanHiperaActorName(journal.name);
  if (finalName && finalName !== journal.name) journalChanges.name = finalName;
  for (const [flagName, flag] of Object.entries(journal.flags ?? {})) {
    if (!(flagName === "hiperaustralis" || flagName.startsWith("hiperaustralis-"))) continue;
    buildHiperaTreeUpdateChanges(`flags.${flagName}`, flag, sanitizeHiperaTree(flag, true), journalChanges);
  }
  const pageUpdates = [];
  for (const page of journal.pages?.contents ?? []) {
    const update = { _id: page.id };
    let any = false;
    const finalPageName = cleanHiperaActorName(page.name);
    if (finalPageName && finalPageName !== page.name) { update.name = finalPageName; any = true; }
    if (typeof page.text?.content === "string") {
      const cleaned = cleanLegacyHiperaGameplayField(page.text.content);
      if (cleaned !== null) { update["text.content"] = cleaned; any = true; }
    }
    for (const [flagName, flag] of Object.entries(page.flags ?? {})) {
      if (!(flagName === "hiperaustralis" || flagName.startsWith("hiperaustralis-"))) continue;
      const changedFlags = {};
      buildHiperaTreeUpdateChanges(`flags.${flagName}`, flag, sanitizeHiperaTree(flag, true), changedFlags);
      for (const [key, value] of Object.entries(changedFlags)) { update[key] = value; any = true; }
    }
    if (any) pageUpdates.push(update);
  }
  if (Object.keys(journalChanges).length) {
    await journal.update(journalChanges, { render: false });
    changed = true;
  }
  if (pageUpdates.length) {
    await journal.updateEmbeddedDocuments("JournalEntryPage", pageUpdates, { render: false });
    changed = true;
  }
  return changed;
}

async function migrateHiperaGameplayDocuments() {
  if (!game.user?.isGM || game.system?.id !== "custom-system-builder") {
    return { skipped: true, reason: "Se requiere GM y Custom System Builder." };
  }
  const report = {
    version: "0.24.50",
    actorsScanned: 0, itemsScanned: 0, journalsScanned: 0,
    worldPacksScanned: 0, packDocumentsScanned: 0,
    updated: 0, failures: 0, skippedPacks: 0
  };
  for (const actor of game.actors?.contents ?? []) {
    report.actorsScanned++;
    try { if (await cleanLegacyHiperaGameplayActor(actor)) report.updated++; }
    catch (error) { report.failures++; console.warn("MELIAZ: no se pudo limpiar una ficha antigua.", actor?.name, error); }
  }
  for (const item of game.items?.contents ?? []) {
    report.itemsScanned++;
    if (!item || item.pack || !item.isOwner || !isHiperaCleanupTarget(item)) continue;
    try { if (await sanitizeHiperaDocument(item)) report.updated++; }
    catch (error) { report.failures++; console.warn("MELIAZ: no se pudo limpiar un recurso antiguo.", item.name, error); }
  }
  for (const journal of game.journal?.contents ?? []) {
    report.journalsScanned++;
    if (!journal || journal.pack || !journal.isOwner || !isHiperaCleanupTarget(journal)) continue;
    try { if (await cleanHiperaJournalDocumentV02446(journal)) report.updated++; }
    catch (error) { report.failures++; console.warn("MELIAZ: no se pudo limpiar un diario antiguo.", journal.name, error); }
  }

  // Los compendios de módulo son de solo lectura para Foundry; solo se modifican compendios del mundo.
  // Revisa todos los compendios de mundo: algunos bestiarios antiguos tienen nombres
  // históricos que no incluyen "Hiperaustralis". Solo se modifica un documento cuando
  // contiene una marca de esta familia o una Nota de Peso/editorial reconocible.
  const worldPacks = Array.from(game.packs?.values?.() ?? []).filter(pack =>
    String(pack.collection ?? pack.metadata?.id ?? "").startsWith("world.")
  );
  for (const pack of worldPacks) {
    report.worldPacksScanned++;
    const wasLocked = Boolean(pack.locked);
    try {
      if (wasLocked) await pack.configure({ locked: false });
      const documents = await pack.getDocuments();
      for (const document of documents) {
        report.packDocumentsScanned++;
        try {
          if (document.pages?.contents) {
            if (await cleanHiperaJournalDocumentV02446(document)) report.updated++;
          } else if ((isHiperaCleanupTarget(document) || hasHiperaWeightGuidanceDeep(document)) && await sanitizeHiperaDocument(document)) {
            report.updated++;
          }
        } catch (error) {
          report.failures++;
          console.warn("MELIAZ: no se pudo limpiar una entrada de compendio del mundo.", pack.collection, document?.name, error);
        }
      }
    } catch (error) {
      report.failures++;
      console.warn("MELIAZ: no se pudo revisar el compendio del mundo.", pack.collection, error);
    } finally {
      if (wasLocked) {
        try { await pack.configure({ locked: true }); }
        catch (error) { report.failures++; console.warn("MELIAZ: no se pudo restaurar el bloqueo del compendio.", pack.collection, error); }
      }
    }
  }

  globalThis.MELIAZBridgeCleanupReport = report;
  console.info("MELIAZ Bridge 0.24.52 · Limpieza persistente completada", report);
  console.table?.([
    { concepto: "Actores revisados", total: report.actorsScanned },
    { concepto: "Items y plantillas revisados", total: report.itemsScanned },
    { concepto: "Diarios revisados", total: report.journalsScanned },
    { concepto: "Compendios del mundo revisados", total: report.worldPacksScanned },
    { concepto: "Documentos de compendio revisados", total: report.packDocumentsScanned },
    { concepto: "Documentos actualizados", total: report.updated },
    { concepto: "Errores", total: report.failures }
  ]);
  if (report.updated) ui.notifications?.info?.(`MELIAZ: limpieza aplicada a ${report.updated} fichas, recursos o páginas.`);
  else ui.notifications?.info?.("MELIAZ: revisión completa; no quedan cambios pendientes en documentos del mundo.");
  return report;
}

function auditMeliazRelatedModulesV02446() {
  const modules = Array.from(game.modules?.values?.() ?? [])
    .filter(module => /meliaz|hiperaustralis|kona|hoja.?fix|fix.?hoja|compendios|rituales/iu.test(`${module.id ?? ""} ${module.title ?? ""}`))
    .map(module => ({ id: module.id, title: module.title, version: module.version, active: Boolean(module.active) }));
  globalThis.MELIAZRelatedModuleAudit = modules;
  console.groupCollapsed("MELIAZ Bridge 0.24.52 · Auditoría de módulos relacionados");
  console.table?.(modules);
  const externalKonaFixes = modules.filter(module => module.active && module.id !== MODULE_ID &&
    /kona|hoja.?fix|fix.?hoja/iu.test(`${module.id} ${module.title}`));
  if (externalKonaFixes.length) {
    console.warn("Hay un módulo KONA/Hoja adicional activo. Puede duplicar estilos de MELIAZ Bridge; no se desactiva automáticamente.", externalKonaFixes);
  }
  console.groupEnd?.();
  return modules;
}

globalThis.meliazBridgeRunCleanup = migrateHiperaGameplayDocuments;
globalThis.meliazBridgeAuditModules = auditMeliazRelatedModulesV02446;
Hooks.once("ready", () => {
  // Foundry V14: startup remains read-only. Document migrations are explicit.
  void auditMeliazRelatedModulesV02446();
  console.info("MELIAZ Bridge: inicio seguro; migración disponible mediante meliazBridgeRunCleanup().");
});
function removeLegacyNotaPesoControlsV02449(root) {
  if (!root?.querySelectorAll) return;
  const selectors = [
    ".ha-rival-nota-peso", ".ha-nota-peso", ".ha-rival-notapeso", ".ha-notapeso",
    "[data-key='nota_peso']", "[data-key='nota-peso']", "[data-key='notaPeso']", "[data-key='Nota de Peso']",
    "[data-field-key*='nota' i][data-field-key*='peso' i]", "[data-field*='nota' i][data-field*='peso' i]",
    "[name*='nota' i][name*='peso' i]", "[data-prop*='nota' i][data-prop*='peso' i]",
    "[class*='nota-peso' i]", "[class*='nota_peso' i]", "[class*='notapeso' i]"
  ];
  for (const selector of selectors) {
    for (const node of Array.from(root.querySelectorAll(selector))) {
      const container = node.closest?.("[data-key], [data-field-key], .custom-system-form-field, .custom-system-component, .form-group, .form-field, .custom-system-field, .property, .field-row") ?? node;
      const signature = `${container?.getAttribute?.("data-key") ?? ""} ${container?.getAttribute?.("data-field-key") ?? ""} ${container?.className ?? ""}`.toLocaleLowerCase("es");
      if (/ha-rival-peso|data-key=[\"']?peso|data-field-key=[\"']?peso/.test(signature)) continue;
      if (container !== root) container.remove?.(); else node.remove?.();
    }
  }
  // CSB ha usado label, span, div, p y encabezados para el mismo rótulo.
  const normalize = value => String(value ?? "").toLocaleLowerCase("es").normalize("NFD")
    .replace(/[\\u0300-\\u036f]/gu, "").replace(/[^a-z0-9]/gu, "");
  for (const label of Array.from(root.querySelectorAll("label, legend, .field-label, .custom-system-label, span, div, p, h1, h2, h3, h4, small, strong"))) {
    if (!new Set(["notadepeso", "notapeso"]).has(normalize(label.textContent))) continue;
    const container = label.closest?.("[data-key], [data-field-key], .custom-system-form-field, .custom-system-component, .form-group, .form-field, .custom-system-field, .property, .field-row") ?? label.parentElement;
    const isPesoContainer = container && (container.matches?.("[data-key='peso'], [data-field-key='peso'], .ha-rival-peso") || container.querySelector?.(".ha-rival-peso, [data-key='peso'], [data-field-key='peso']"));
    if (container && container !== root && !isPesoContainer) container.remove?.();
    else label.remove?.();
  }
  // Algunos actores antiguos guardan la etiqueta y el texto en un único bloque,
  // no como control CSB con data-key. Retira solo el bloque que empieza por Nota de Peso.
  const normalizeNote = value => String(value ?? "").toLocaleLowerCase("es").normalize("NFD")
    .replace(/[\u0300-\u036f]/gu, "").replace(/\s+/gu, " ").trim();
  const blocks = Array.from(root.querySelectorAll("p, li, blockquote, fieldset, .custom-system-component, .custom-system-form-field, .form-group, .form-field, .field-row, div, section, article, label, legend, span, small, strong")).reverse();
  for (const block of blocks) {
    if (!block.isConnected) continue;
    const text = normalizeNote(block.textContent);
    if (!/^nota de peso(?:\s*[:—-]|\s+aplica\s+peso|$)/u.test(text)) continue;
    if (/^(?:nota de peso)\s*$/u.test(text)) {
      const wrapper = block.closest?.("[data-key], [data-field-key], .custom-system-component, .custom-system-form-field, .form-group, .form-field, .field-row") ?? block.parentElement;
      if (wrapper && wrapper !== root && !wrapper.querySelector?.(".ha-rival-peso, [data-key='peso'], [data-field-key='peso']")) wrapper.remove?.();
      else block.remove?.();
    } else {
      block.remove?.();
    }
  }
}
function installHiperaRivalSheetVisual(application, html) {
  const actor = getSheetActor(application);
  if (!actor || actor.type !== "character") return;

  void cleanLegacyHiperaGameplayActor(actor);
  const templateId = String(actor.system?.template ?? "");
  const rivalFlag =
    actor?.flags?.["hiperaustralis-bestiario"] ||
    actor?.flags?.["hiperaustralis-adversarios-mapuche"];
  const isRivalTemplate = templateId === "HipRivalTpl00001";
  const isObstacleTemplate = templateId === "HipObstTpl00001";
  const isAnimalTemplate = templateId === "HipAnimalTpl00001";
  const isCreatureTemplate = templateId === "HipCriatTpl00001";
  const hasPeso = actor.system?.props?.peso !== undefined;

  if (!isRivalTemplate && !isObstacleTemplate && !isAnimalTemplate && !isCreatureTemplate && !rivalFlag) return;
  if (!hasPeso) return;

  const root = getRenderedRoot(html);
  if (!root) return;

  removeLegacyNotaPesoControlsV02449(root);
  const legacyNoteControls = Array.from(root.querySelectorAll(".ha-rival-nota-peso, .ha-nota-peso, [data-key='nota_peso'], [data-key='nota-peso']"));
  for (const legacyControl of legacyNoteControls) legacyControl.style?.setProperty?.("display", "none", "important");
  const fields = Array.from(root.querySelectorAll(
    ".ha-rival-peso, .ha-rival-descripcion, .ha-rival-escena"
  ));
  if (!fields.length) return;

  const canvas = getCommonAncestor(fields, root) ?? root;
  canvas.classList.add("ha-rival-visual-sheet");
  canvas.dataset.haRivalVisual = "1";
  // Evita mostrar por un frame la distribución original de CSB antes de fijar las posiciones finales.
  const previousVisibility = canvas.style.getPropertyValue("visibility");
  canvas.style.setProperty("visibility", "hidden", "important");
  canvas.style.setProperty("position", "relative", "important");
  canvas.style.setProperty("overflow", "hidden", "important");

  installHiperaOwnArtLayer(canvas, actor, {
    className: "ha-rival-own-art",
    zIndex: 1,
    opacity: 0.32,
    objectFit: "cover"
  });

  // A dark veil is deliberately used here: unlike the Item treatment,
  // Rival text is white and its source portraits/photos vary greatly in value.
  installHiperaSheetVeil(canvas, {
    className: "ha-rival-text-veil",
    zIndex: 2,
    opacity: 0.28,
    color: "0,0,0"
  });

  for (const child of Array.from(canvas.children)) {
    if (
      child.classList?.contains("ha-rival-own-art") ||
      child.classList?.contains("ha-rival-text-veil") ||
      child.classList?.contains("ha-rival-action-button")
    ) continue;
    child.style?.setProperty?.("position", "relative", "important");
    child.style?.setProperty?.("z-index", "4", "important");
    child.style?.setProperty?.("background", "transparent", "important");
    child.style?.setProperty?.("background-color", "transparent", "important");
  }

  const pesoControl = root.querySelector(".ha-rival-peso");
  if (pesoControl?.style) {
    pesoControl.style.setProperty("position", "absolute", "important");
    pesoControl.style.setProperty("left", "10px", "important");
    pesoControl.style.setProperty("top", "10px", "important");
    pesoControl.style.setProperty("width", "76px", "important");
    pesoControl.style.setProperty("min-width", "0", "important");
    pesoControl.style.setProperty("max-width", "76px", "important");
    pesoControl.style.setProperty("z-index", "12", "important");
    pesoControl.style.setProperty("box-sizing", "border-box", "important");
    const pesoInputs = pesoControl.matches?.("input, textarea, select")
      ? [pesoControl]
      : Array.from(pesoControl.querySelectorAll?.("input, textarea, select") ?? []);
    for (const input of pesoInputs) {
      input.style?.setProperty?.("width", "100%", "important");
      input.style?.setProperty?.("min-width", "0", "important");
      input.style?.setProperty?.("max-width", "100%", "important");
      input.style?.setProperty?.("box-sizing", "border-box", "important");
      input.style?.setProperty?.("text-align", "center", "important");
    }
  }

  const descriptionControl = root.querySelector(".ha-rival-descripcion");
  if (descriptionControl?.style) {
    descriptionControl.style.setProperty("position", "absolute", "important");
    descriptionControl.style.setProperty("left", "96px", "important");
    descriptionControl.style.setProperty("top", "10px", "important");
    descriptionControl.style.setProperty("width", "calc(100% - 106px)", "important");
    descriptionControl.style.setProperty("max-width", "calc(100% - 106px)", "important");
    descriptionControl.style.setProperty("z-index", "12", "important");
    descriptionControl.style.setProperty("box-sizing", "border-box", "important");
    const descriptionInputs = descriptionControl.matches?.("input, textarea, select")
      ? [descriptionControl]
      : Array.from(descriptionControl.querySelectorAll?.("input, textarea, select") ?? []);
    for (const input of descriptionInputs) {
      input.style?.setProperty?.("width", "100%", "important");
      input.style?.setProperty?.("min-width", "0", "important");
      input.style?.setProperty?.("max-width", "100%", "important");
      input.style?.setProperty?.("box-sizing", "border-box", "important");
    }
  }

  const nodes = [
    ...fields,
    ...canvas.querySelectorAll("label, legend, p, span, strong, em, small, h1, h2, h3, h4, input, textarea, select")
  ];
  for (const node of nodes) {
    if (!node?.style) continue;
    node.style.setProperty("color", "#fffdf7", "important");
    node.style.setProperty("-webkit-text-fill-color", "#fffdf7", "important");
    if (node.matches?.("input, textarea, select")) {
      node.style.setProperty("background", "rgba(0,0,0,0.18)", "important");
      node.style.setProperty("background-color", "rgba(0,0,0,0.18)", "important");
      node.style.setProperty("border-color", "rgba(255,255,255,0.30)", "important");
      node.style.setProperty("caret-color", "#fffdf7", "important");
    } else {
      node.style.setProperty("text-shadow", "0 1px 2px rgba(0,0,0,0.9)", "important");
    }
  }

  let actionButton = canvas.querySelector(":scope > .ha-rival-action-button");
  if (!actionButton) actionButton = canvas.querySelector(".ha-rival-action-button");
  if (isRivalTemplate || rivalFlag || isCreatureTemplate) {
    if (!actionButton) {
      actionButton = document.createElement("button");
      actionButton.type = "button";
      actionButton.className = "ha-rival-action-button";
    }
    // Los listeners se marcan por tipo para evitar duplicados al re-renderizar CSB.
    const actionKind = isCreatureTemplate ? "creature" : "rival";
    if (actionButton.dataset.haActionKind !== actionKind) {
      actionButton.replaceWith(actionButton.cloneNode(false));
      actionButton = canvas.querySelector(".ha-rival-action-button");
      if (!actionButton) {
        actionButton = document.createElement("button");
        actionButton.type = "button";
        actionButton.className = "ha-rival-action-button";
      }
      actionButton.dataset.haActionKind = actionKind;
      actionButton.addEventListener("click", async event => {
        event.preventDefault(); event.stopPropagation(); event.stopImmediatePropagation();
        if (actionButton.dataset.haActionKind === "creature") await declareHiperaCreatureAction(actor);
        else await declareHiperaRivalAction(actor);
      });
    }
    // Rival y Criatura comparten este layout; solo cambia la etiqueta y el tipo de declaración.
    actionButton.textContent = isCreatureTemplate ? "Acción" : "Ataque";
    actionButton.setAttribute("aria-label", isCreatureTemplate ? "Acción" : "Ataque");
    actionButton.title = isCreatureTemplate ? "Declarar una acción de la Criatura en el chat" : "Declarar un ataque o acción del Rival en el chat";
    if (actionButton.parentElement !== canvas) canvas.appendChild(actionButton);
  } else if (actionButton) {
    actionButton.remove();
    actionButton = null;
  }

  // Distribución coordinada de los campos visibles: Peso, Descripción y En escena.
  const sceneControl = root.querySelector(".ha-rival-escena");
  const placeRivalLayout = () => {
    if (!canvas.isConnected) return;
    const canvasRect = canvas.getBoundingClientRect();
    if (!canvasRect.width) return;
    const setBox = (el, left, top, width) => {
      if (!el?.style) return;
      el.style.setProperty("position", "absolute", "important");
      el.style.setProperty("left", left, "important");
      el.style.setProperty("top", `${Math.round(top)}px`, "important");
      el.style.setProperty("width", width, "important");
      el.style.setProperty("max-width", width, "important");
      el.style.setProperty("min-width", "0", "important");
      el.style.setProperty("box-sizing", "border-box", "important");
      el.style.setProperty("z-index", "12", "important");
      el.style.setProperty("margin", "0", "important");
    };
    const innerHeight = el => {
      if (!el) return 0;
      const rect = el.getBoundingClientRect();
      return Math.max(rect.height, el.scrollHeight || 0, 34);
    };
    const width = canvasRect.width;
    const gap = 10;
    const x = 10;
    const full = `calc(100% - ${x * 2}px)`;
    // Peso, Descripción y Ataque/Acción ocupan posiciones coordinadas.
    // El botón comparte la franja superior a la derecha y nunca se recoloca debajo del Peso.
    const top = 10;
    setBox(pesoControl, `${x}px`, top, "76px");

    const buttonWidth = actionButton
      ? Math.ceil(actionButton.getBoundingClientRect().width || actionButton.scrollWidth || 68)
      : 0;
    const compactHeader = Boolean(actionButton) && width - (116 + buttonWidth) < 110;
    let descriptionWidth = actionButton && !compactHeader
      ? `calc(100% - ${116 + buttonWidth}px)`
      : "calc(100% - 106px)";
    setBox(descriptionControl, "96px", top, descriptionWidth);

    if (actionButton?.style) {
      actionButton.style.setProperty("position", "absolute", "important");
      actionButton.style.setProperty("left", "auto", "important");
      actionButton.style.setProperty("right", "10px", "important");
      actionButton.style.setProperty("bottom", "auto", "important");
      actionButton.style.setProperty("top", `${Math.round(top)}px`, "important");
      actionButton.style.setProperty("z-index", "20", "important");
      actionButton.style.setProperty("width", "auto", "important");
      actionButton.style.setProperty("max-width", "none", "important");
    }

    let topRowH;
    if (actionButton && compactHeader) {
      // Fallback for narrow sheets: the action button moves below the complete header,
      // aligned right, so it cannot cover either Peso or Descripción.
      const headerHeight = Math.max(innerHeight(descriptionControl), innerHeight(pesoControl));
      actionButton.style.setProperty("top", `${Math.round(top + headerHeight + 6)}px`, "important");
      topRowH = headerHeight + 6 + innerHeight(actionButton);
    } else {
      topRowH = Math.max(innerHeight(descriptionControl), innerHeight(pesoControl));
    }
    const sceneY = top + topRowH + gap;
    setBox(sceneControl, `${x}px`, sceneY, full);
    const sceneH = innerHeight(sceneControl);
    const bottom = sceneY + sceneH + 12;
    canvas.style.setProperty("min-height", `${Math.ceil(bottom)}px`, "important");
  };
  // Aplicar posición inicial antes de revelar la hoja; los RAF posteriores solo
  // corrigen dimensiones si el DOM termina de asentarse.
  placeRivalLayout();
  if (previousVisibility) canvas.style.setProperty("visibility", previousVisibility, "important");
  else canvas.style.removeProperty("visibility");
  requestAnimationFrame(() => {
    placeRivalLayout();
    requestAnimationFrame(placeRivalLayout);
  });
  if (typeof ResizeObserver !== "undefined" && !canvas.dataset.haRivalLayoutObserver) {
    const observer = new ResizeObserver(() => placeRivalLayout());
    observer.observe(canvas);
    for (const field of fields) observer.observe(field);
    canvas.__haRivalLayoutObserver = observer;
    canvas.dataset.haRivalLayoutObserver = "1";
  }
}

function cleanVisibleExplicitNotaPeso(root) {
  if (!root?.querySelectorAll) return;
  // Algunos compendios antiguos muestran la Nota dentro de un textarea o panel editable.
  // Se elimina el párrafo técnico entero; el texto de escena restante se conserva.
  const controls = Array.from(root.querySelectorAll("textarea, [contenteditable=\"true\"], [role=\"textbox\"]"));
  for (const control of controls) {
    const current = typeof control.value === "string" ? control.value : String(control.textContent ?? "");
    const cleaned = cleanExplicitNotaPesoBlocks(current);
    if (cleaned !== current) {
      if (typeof control.value === "string") control.value = cleaned;
      else control.textContent = cleaned;
      control.dispatchEvent?.(new Event("input", { bubbles: true }));
      control.dispatchEvent?.(new Event("change", { bubbles: true }));
    }
  }
  const blocks = Array.from(root.querySelectorAll("p, li, blockquote, h1, h2, h3, h4, h5, h6"));
  for (const block of blocks.reverse()) {
    if (!block.isConnected) continue;
    const plain = String(block.textContent ?? "").replace(/\s+/gu, " ").trim();
    if (/^nota\s+de\s+peso(?:\s*[:—-]|$)/iu.test(plain)) block.remove();
  }
}

function installHiperaJournalTextCleanup(application, html) {
  const root = getRenderedRoot(html);
  if (!root?.querySelectorAll) return;
  const clean = () => {
    cleanVisibleExplicitNotaPeso(root);
    const blocks = Array.from(root.querySelectorAll("p, li, blockquote, h1, h2, h3, h4, h5, h6, .journal-page-content, .journal-entry-page, .editor-content"));
    for (const block of blocks.reverse()) {
      if (!block.isConnected) continue;
      const text = stripHiperaMarkup(block.textContent ?? "");
      if (!text || !hasHiperaWeightGuidanceDeep(text)) continue;
      if (isHiperaWeightGuidanceBlock(text)) { block.remove(); continue; }
      const cleaned = cleanLegacyHiperaGameplayField(block.innerHTML ?? block.textContent ?? "");
      if (cleaned !== null) {
        if (stripHiperaMarkup(cleaned)) block.innerHTML = cleaned;
        else block.remove();
      }
    }
  };
  clean();
  if (!root.dataset.meliazWeightNoteObserver && typeof MutationObserver !== "undefined") {
    const observer = new MutationObserver(() => clean());
    observer.observe(root, { childList:true, subtree:true, characterData:true });
    root.dataset.meliazWeightNoteObserver = "1";
    root.__meliazWeightNoteObserver = observer;
  }
}

// Kona mount guard — CSB 6 / Foundry V14 may rebuild its inner panel
// after renderApplicationV2 has fired. Mounting controls synchronously in that
// early phase causes a visible flash: CSB then replaces the panel and paints
// its sheet over the Bridge controls. Wait for two paint frames and watch the
// application root for a later CSB rebuild. Re-installation is idempotent:
// the installers redraw their own nodes and keep one delegated listener.
const konaMountObservers = new WeakMap();
const konaMountScheduled = new WeakSet();

function konaBridgeMountIncomplete(canvas) {
  if (!canvas?.isConnected) return true;
  const required = [
    ".ha-equipo-items-grid",
    ".ha-mascota-portrait",
    ".ha-step-newen",
    ".ha-step-aguante",
    ".ha-cap-lock",
    ".ha-descendiente-marker",
    ".ha-neque-loadout",
    ".ha-sentir-instrumentos-box",
    ".ha-biomas-box",
    ".ha-ritual-items-area",
    ".ha-reliquia-items-area"
  ];
  return required.some(selector => !canvas.querySelector(selector));
}

function scheduleKonaPostCsbMount(application, html) {
  const root = getRenderedRoot(html);
  const actor = getSheetActor(application);
  if (!root || !actor || actor.type !== "character") return;

  // CSB can reuse the previous canvas while rebuilding the inner panel.
  // Hide the old loadout immediately; installHiperaNequeLoadout reveals it
  // only after the current two-slot DOM has been reconciled.
  root.querySelector(".ha-kona-sheet")?.classList?.remove("ha-kona-neque-ready");

  const mount = () => {
    konaMountScheduled.delete(root);
    if (!root.isConnected) return;
    const currentActor = getSheetActor(application);
    const canvas = root.querySelector(".ha-kona-sheet");
    if (!canvas || !currentActor || currentActor.type !== "character") return;
    // Do not mount against CSB's empty shell: wait until the actual template
    // fields are present inside the custom panel.
    if (!canvas.querySelector(".ha-val-temple") || !canvas.querySelector(".ha-field-nombre")) return;

    // Bind delegated actions against the stable application root; the shield
    // is recreated on the current canvas if CSB replaced its inner panel.
    bindKonaCapabilityClicks(application, root);
    if (konaBridgeMountIncomplete(canvas)) {
      installKonaSheetControls(application, root);
    }
    installRivalApinarVisualState(application, root);
    installHiperaRivalSheetVisual(application, root);
  };

  const enqueue = () => {
    if (konaMountScheduled.has(root)) return;
    konaMountScheduled.add(root);
    const raf = globalThis.requestAnimationFrame ?? (callback => setTimeout(callback, 16));
    // First frame: allow CSB's deferred form construction. Second frame:
    // mount after the browser has committed that final DOM tree.
    raf(() => raf(mount));
  };

  if (!konaMountObservers.has(root) && typeof MutationObserver !== "undefined") {
    const observer = new MutationObserver(() => {
      const currentCanvas = root.querySelector(".ha-kona-sheet");
      if (konaBridgeMountIncomplete(currentCanvas)) enqueue();
    });
    observer.observe(root, { childList: true, subtree: true });
    konaMountObservers.set(root, observer);
  }

  enqueue();
}

// Foundry v13 / ApplicationV2.
Hooks.on("renderApplicationV2", (application, element) => {
  installHiperaJournalTextCleanup(application, element);
  installHiperaRitualSheetVisual(application, element);
  installHiperaReliquiaSheetVisual(application, element);
  installHiperaArmaSheetVisual(application, element);
  installHiperaGenericItemOwnArt(application, element);
  installHiperaRivalSheetVisual(application, element);
  // CSB ApplicationV2 can finish the inner custom panel one microtask later.
  queueMicrotask(() => {
    installHiperaRitualSheetVisual(application, element);
    installHiperaReliquiaSheetVisual(application, element);
    installHiperaArmaSheetVisual(application, element);
    installHiperaGenericItemOwnArt(application, element);
    installHiperaRivalSheetVisual(application, element);
  });

  const actor = getSheetActor(application);
  // Kona controls mount only after CSB's deferred inner panel has settled.
  // The root observer also repairs them if CSB replaces that panel later.
  scheduleKonaPostCsbMount(application, element);
  // Las reparaciones de Items no deben volver a instalar ni refrescar los
  // controles interactivos: eso puede competir con el foco/hover y cerrar
  // menús desplegables que el usuario acaba de abrir.
  void Promise.all([
    repairHiperaRitualItems(actor),
    repairHiperaReliquiaItems(actor)
  ]).catch(err => {
    console.warn("MELIAZ Bridge: reparación de Items de hoja no completada.", err);
  });
  // Estas funciones antes dependían solo de renderItemSheet (ApplicationV1).
  // CSB sobre V14 puede renderizar Items mediante ApplicationV2.
  installHiperaBioInfo(application, element);
  installHiperaItemTheme(application, element);
});

// Fallback para hojas que todavía pasen por la familia ActorSheet v1.
Hooks.on("renderJournalSheet", (application, html) => installHiperaJournalTextCleanup(application, html));
Hooks.on("renderJournalEntryPageSheet", (application, html) => installHiperaJournalTextCleanup(application, html));
Hooks.on("renderJournalPageSheet", (application, html) => installHiperaJournalTextCleanup(application, html));

Hooks.on("renderItemSheet", (application, html) => {
  installHiperaJournalTextCleanup(application, html);
  installHiperaRitualSheetVisual(application, html);
  installHiperaReliquiaSheetVisual(application, html);
  installHiperaArmaSheetVisual(application, html);
  installHiperaGenericItemOwnArt(application, html);
  queueMicrotask(() => {
    installHiperaRitualSheetVisual(application, html);
    installHiperaReliquiaSheetVisual(application, html);
    installHiperaArmaSheetVisual(application, html);
    installHiperaGenericItemOwnArt(application, html);
  });
});

Hooks.on("renderActorSheet", (application, html) => {
  installHiperaJournalTextCleanup(application, html);
  const actor = getSheetActor(application);
  scheduleKonaPostCsbMount(application, html);
  // La reparación de Items es independiente y no reinicializa la interacción.
  void Promise.all([
    repairHiperaRitualItems(actor),
    repairHiperaReliquiaItems(actor)
  ]).catch(err => {
    console.warn("MELIAZ Bridge: reparación de Items de hoja no completada.", err);
  });
});

Hooks.on("preCreateItem", (item, data) => {
  if (item?.type !== "equippableItem") return;

  const rawKind = String(data?.flags?.[MODULE_ID]?.kind ?? "").trim().toLowerCase();
  const rawPropKind = String(data?.system?.props?.hipera_tipo ?? "").trim().toLowerCase();
  const ritualish = rawKind === "ritual" || rawPropKind === "ritual" || item.name === HIPERA_RITUAL_SAMPLE_NAME;
  const reliquiaish = rawKind === "reliquia" || rawPropKind === "reliquia";

  if (ritualish) {
    const template = getHiperaRitualTemplate();
    if (!template) return;
    item.updateSource({
      "system.template": template.id,
      "system.props.hipera_tipo": "ritual",
      [`flags.${MODULE_ID}.kind`]: "ritual"
    });
    return;
  }

  if (reliquiaish) {
    const template = getHiperaReliquiaTemplate();
    if (!template) return;
    item.updateSource({
      "system.template": template.id,
      "system.props.hipera_tipo": "reliquia",
      [`flags.${MODULE_ID}.kind`]: "reliquia"
    });
  }
});

Hooks.on("createItem", item => {
  const actor = item?.parent;
  if (!actor || actor.documentName !== "Actor") return;

  if (isHiperaRitualItem(item)) {
    void (async () => {
      const template = await ensureHiperaRitualTemplate();
      if (template) await normalizeRitualItem(item, template);
      await repairHiperaRitualItems(actor);
      actor.sheet?.render?.(false);
    })();
    return;
  }

  if (isHiperaReliquiaItem(item)) {
    void (async () => {
      const template = await ensureHiperaReliquiaTemplate();
      if (template) await normalizeReliquiaItem(item, template);
      await repairHiperaReliquiaItems(actor);
      actor.sheet?.render?.(false);
    })();
  }
});


Hooks.once("init", () => {
  installKonaSheetStyles();
  const module = game.modules.get(MODULE_ID);

  module.api = Object.freeze({
    startAction,
    exaltar,
    apinarRival,
    activateGracia,
    activateManifestacion,
    clearManifestacion
  });

  console.log("Hiperaustralis · MELIAZ Bridge 0.24.182 inicializado.");
});

// Camino recomendado por SocketLib.
Hooks.once("socketlib.ready", () => {
  registerSocketLib();
});

// Fallback deliberado para Forge / orden de carga:
// si socketlib.ready ocurrió antes de que este módulo alcanzara a escucharlo,
// intentamos registrar nuevamente en ready y durante unos segundos más.

Hooks.on("renderChatMessageHTML", (message, html) => {
  const root =
    html instanceof HTMLElement
      ? html
      : html?.[0] instanceof HTMLElement
        ? html[0]
        : null;

  if (!root) return;

  root.querySelectorAll("[data-meliaz-exaltar]").forEach(button => {
    const ownerUserId = button.dataset.ownerUserId;
    button.style.display = ownerUserId === game.user.id ? "" : "none";
  });

  root.querySelectorAll("[data-meliaz-prestar-ropa]").forEach(button => {
    const ownerUserId = button.dataset.ownerUserId;
    button.style.display = ownerUserId !== game.user.id ? "" : "none";
  });
});

Hooks.once("ready", async () => {
  installClickListener();

  try {
    const ritualTemplate = await ensureHiperaRitualTemplate();
    const reliquiaTemplate = await ensureHiperaReliquiaTemplate();

    if (game.user?.isGM) {
      for (const item of Array.from(game.items ?? [])) {
        if (ritualTemplate && isHiperaRitualItem(item)) await normalizeRitualItem(item, ritualTemplate);
        if (reliquiaTemplate && isHiperaReliquiaItem(item)) await normalizeReliquiaItem(item, reliquiaTemplate);
      }
      for (const actor of Array.from(game.actors ?? [])) {
        await repairHiperaRitualItems(actor);
        await repairHiperaReliquiaItems(actor);
      }
      const activeScene = canvas?.scene;
      for (const tokenDoc of Array.from(activeScene?.tokens ?? [])) {
        const tokenActor = tokenDoc.actor;
        if (tokenActor) {
          await repairHiperaRitualItems(tokenActor);
          await repairHiperaReliquiaItems(tokenActor);
        }
      }
    }
  } catch (err) {
    console.error("MELIAZ Bridge: no pude preparar la plantilla de Ritual.", err);
    if (game.user?.isGM) ui.notifications.warn("MELIAZ: no pude preparar la plantilla de Items-Ritual.");
  }

  if (registerSocketLib()) return;

  for (let i = 0; i < 12 && !meliazSocket; i++) {
    await new Promise(resolve => setTimeout(resolve, 500));
    registerSocketLib();
  }

  if (!meliazSocket) {
    console.error("MELIAZ Bridge 0.15.1-select-layout-v2: SocketLib está activo pero no pudo registrarse.");
    ui.notifications.error(
      "MELIAZ: no pude enlazar SocketLib. Revisa que SocketLib esté ACTIVO en este mundo y recarga ambos clientes."
    );
  }
});

function registerSocketLib() {
  if (meliazSocket) return true;

  const sl = globalThis.socketlib;

  if (!sl?.registerModule) {
    return false;
  }

  try {
    meliazSocket = sl.registerModule(MODULE_ID);
    meliazSocket.register("receivePrestarRopa", receivePrestarRopa);
    meliazSocket.register("receiveApinar", receiveApinar);
    meliazSocket.register("applyPesoLoss", applyPesoLossLocal);
    console.log("MELIAZ Bridge 0.15.1-select-layout-v2 · SocketLib registrado.");
    return true;
  } catch (err) {
    console.error("MELIAZ Bridge: error registrando SocketLib.", err);
    meliazSocket = null;
    return false;
  }
}

function installClickListener() {
  if (clickListenerInstalled) return;
  document.addEventListener("click", handleDocumentClick);
  clickListenerInstalled = true;
}


async function askPorte(graciaName, maxPorte) {
  const options = [];

  for (let i = 1; i <= maxPorte; i++) {
    const data = PORTE_DATA[i];
    options.push(
      `<option value="${i}">${data.label} · ${data.costText} de Newen</option>`
    );
  }

  try {
    const porte = await foundry.applications.api.DialogV2.prompt({
      window: { title: `MELIAZ · Gracia · ${graciaName}` },
      content: `
        <div style="display:grid;gap:0.75rem;">
          <p><strong>${graciaName}</strong></p>
          <label for="meliaz-porte"><strong>Porte</strong></label>
          <select id="meliaz-porte" name="porte">
            ${options.join("")}
          </select>
        </div>
      `,
      ok: {
        label: "Usar Gracia",
        callback: (event, button) => Number(button.form.elements.porte.value)
      },
      rejectClose: false,
      modal: true
    });

    if (porte === null || porte === undefined) return null;
    return Number(porte);
  } catch (err) {
    console.warn("MELIAZ Bridge: selección de Porte cancelada.", err);
    return null;
  }
}

async function activateGracia(actorUuid, graciaKey, porteKey) {
  const actor = await fromUuid(actorUuid);

  if (!actor || actor.documentName !== "Actor") {
    ui.notifications.error("MELIAZ: no pude encontrar el Actor.");
    return;
  }

  const graciaName = GRACIA_LABELS[graciaKey];

  if (!graciaName) {
    ui.notifications.error(`MELIAZ: Gracia desconocida: ${graciaKey}`);
    return;
  }

  const maxPorte = Number(actor.system?.props?.[porteKey] ?? 1);

  if (!Number.isInteger(maxPorte) || maxPorte < 1 || maxPorte > 3) {
    ui.notifications.error(`MELIAZ: el Porte de ${graciaName} debe estar entre I y III.`);
    return;
  }

  const porte = await askPorte(graciaName, maxPorte);
  if (!porte) return;

  if (porte > maxPorte || !PORTE_DATA[porte]) {
    ui.notifications.warn("MELIAZ: ese Porte no está disponible para esta Gracia.");
    return;
  }

  const newenBefore = Number(actor.system?.props?.newen ?? 0);
  const cost = PORTE_DATA[porte].cost;

  if (!Number.isFinite(newenBefore) || newenBefore < cost) {
    ui.notifications.warn(
      `MELIAZ: no tienes suficiente Newen para ${graciaName} ${PORTE_DATA[porte].label}.`
    );
    return;
  }

  const newenAfter = newenBefore - cost;

  await actor.update({
    "system.props.newen": newenAfter
  });

  const copyText = [
    "MELIAZ · GRACIA",
    actor.name,
    `Gracia: ${graciaName} · Porte ${PORTE_DATA[porte].label}`,
    `Newen: ${newenBefore} → ${newenAfter}`
  ].join("\n");

  const message = await ChatMessage.create({
    user: game.user.id,
    speaker: ChatMessage.getSpeaker({ actor }),
    content: `
      <div>
        <h3>MELIAZ · GRACIA</h3>
        <p><strong>${getActorDisplayName(actor)}</strong></p>
        <p><strong>Gracia:</strong> ${graciaName}</p>
        <p><strong>Porte:</strong> ${PORTE_DATA[porte].label}</p>
        <p><strong>Newen:</strong> ${newenBefore} → ${newenAfter}</p>
        <p><em>La Gracia queda activada; si todavía existe oposición e incertidumbre, MELIAZ resuelve después la acción pertinente.</em></p>
      </div>
    `,
    flags: {
      [MODULE_ID]: {
        copyText,
        gracia: {
          graciaKey,
          graciaName,
          porte,
          porteLabel: PORTE_DATA[porte].label,
          cost,
          newenBefore,
          newenAfter,
          actorUuid,
          createdAt: Date.now()
        }
      }
    }
  });

  // Añade el botón de copia después de crear el mensaje, reutilizando el mismo handler.
  await message.update({
    content: `
      <div>
        <h3>MELIAZ · GRACIA</h3>
        <p><strong>${getActorDisplayName(actor)}</strong></p>
        <p><strong>Gracia:</strong> ${graciaName}</p>
        <p><strong>Porte:</strong> ${PORTE_DATA[porte].label}</p>
        <p><strong>Newen:</strong> ${newenBefore} → ${newenAfter}</p>
        <p><em>La Gracia queda activada; si todavía existe oposición e incertidumbre, MELIAZ resuelve después la acción pertinente.</em></p>
        <div class="meliaz-copy-row">
          <button
            type="button"
            class="meliaz-copy-icon"
            data-meliaz-copy-text="1"
            data-message-id="${message.id}"
            title="Copiar texto"
            aria-label="Copiar texto">⧉</button>
        </div>
      </div>
    `
  });
}


async function askManifestacion(maxGrade) {
  const options = [];

  for (let i = 1; i <= maxGrade; i++) {
    const data = MANIFESTACION_DATA[i];
    options.push(
      `<option value="${i}">${data.label} · ${data.costText} de Newen</option>`
    );
  }

  try {
    const grade = await foundry.applications.api.DialogV2.prompt({
      window: { title: "MELIAZ · Manifestación" },
      content: `
        <div style="display:grid;gap:0.75rem;">
          <label for="meliaz-manifestacion"><strong>Manifestación</strong></label>
          <select id="meliaz-manifestacion" name="manifestacion">
            ${options.join("")}
          </select>
        </div>
      `,
      ok: {
        label: "Manifestar",
        callback: (event, button) => Number(button.form.elements.manifestacion.value)
      },
      rejectClose: false,
      modal: true
    });

    if (grade === null || grade === undefined) return null;
    return Number(grade);
  } catch (err) {
    console.warn("MELIAZ Bridge: selección de Manifestación cancelada.", err);
    return null;
  }
}

async function activateManifestacion(actorUuid, maxGradeKey = "manifestacion_max", activeKey = "manifestacion_activa") {
  const actor = await fromUuid(actorUuid);

  if (!actor || actor.documentName !== "Actor") {
    ui.notifications.error("MELIAZ: no pude encontrar el Actor.");
    return;
  }

  let maxGrade = Number(actor.system?.props?.[maxGradeKey] ?? 3);

  if (!Number.isInteger(maxGrade) || maxGrade < 1 || maxGrade > 3) {
    maxGrade = 3;
  }

  const alreadyActive = Number(actor.system?.props?.[activeKey] ?? 0);
  if (alreadyActive > 0) {
    ui.notifications.warn(
      "MELIAZ LAB: ya hay una Manifestación registrada como activa. Este laboratorio no modela reactivaciones; límpiala al terminar la batalla."
    );
    return;
  }

  const grade = await askManifestacion(maxGrade);
  if (!grade) return;

  const data = MANIFESTACION_DATA[grade];
  if (!data || grade > maxGrade) {
    ui.notifications.warn("MELIAZ: esa Manifestación no está disponible.");
    return;
  }

  const newenBefore = Number(actor.system?.props?.newen ?? 0);

  if (!Number.isFinite(newenBefore) || newenBefore < data.cost) {
    ui.notifications.warn(
      `MELIAZ: no tienes suficiente Newen para Manifestación ${data.label}.`
    );
    return;
  }

  const newenAfter = newenBefore - data.cost;

  await actor.update({
    "system.props.newen": newenAfter,
    [`system.props.${activeKey}`]: grade
  });

  const copyText = [
    "MELIAZ · MANIFESTACIÓN",
    actor.name,
    `Manifestación: ${data.label}`,
    `Newen: ${newenBefore} → ${newenAfter}`,
    `En batalla: +${data.battleBonus} a la Capacidad pertinente mientras la Manifestación permanezca activa.`
  ].join("\n");

  const message = await ChatMessage.create({
    user: game.user.id,
    speaker: ChatMessage.getSpeaker({ actor }),
    content: `
      <div>
        <h3>MELIAZ · MANIFESTACIÓN</h3>
        <p><strong>${getActorDisplayName(actor)}</strong></p>
        <p><strong>Manifestación:</strong> ${data.label}</p>
        <p><strong>Newen:</strong> ${newenBefore} → ${newenAfter}</p>
        <p><strong>En batalla:</strong> +${data.battleBonus} a la Capacidad pertinente mientras permanezca activa.</p>
        <p><em>Este laboratorio registra el estado; todavía no aplica automáticamente el bono a las tiradas.</em></p>
      </div>
    `,
    flags: {
      [MODULE_ID]: {
        copyText,
        manifestacion: {
          grade,
          label: data.label,
          cost: data.cost,
          battleBonus: data.battleBonus,
          actorUuid,
          activeKey,
          createdAt: Date.now()
        }
      }
    }
  });

  await message.update({
    content: `
      <div>
        <h3>MELIAZ · MANIFESTACIÓN</h3>
        <p><strong>${getActorDisplayName(actor)}</strong></p>
        <p><strong>Manifestación:</strong> ${data.label}</p>
        <p><strong>Newen:</strong> ${newenBefore} → ${newenAfter}</p>
        <p><strong>En batalla:</strong> +${data.battleBonus} a la Capacidad pertinente mientras permanezca activa.</p>
        <p><em>Este laboratorio registra el estado; todavía no aplica automáticamente el bono a las tiradas.</em></p>
        <div class="meliaz-copy-row">
          <button
            type="button"
            class="meliaz-copy-icon"
            data-meliaz-copy-text="1"
            data-message-id="${message.id}"
            title="Copiar texto"
            aria-label="Copiar texto">⧉</button>
        </div>
      </div>
    `
  });
}

async function clearManifestacion(actorUuid, activeKey = "manifestacion_activa") {
  const actor = await fromUuid(actorUuid);

  if (!actor || actor.documentName !== "Actor") {
    ui.notifications.error("MELIAZ: no pude encontrar el Actor.");
    return;
  }

  const active = Number(actor.system?.props?.[activeKey] ?? 0);

  if (!active) {
    ui.notifications.warn("MELIAZ: no hay una Manifestación activa registrada.");
    return;
  }

  await actor.update({
    [`system.props.${activeKey}`]: 0
  });

  ui.notifications.info("MELIAZ: Manifestación activa limpiada.");
}


async function askUseManifestacion(grade) {
  const data = MANIFESTACION_DATA[grade];
  if (!data) return false;

  try {
    const useIt = await foundry.applications.api.DialogV2.confirm({
      window: { title: "MELIAZ · Manifestación activa" },
      content: `
        <div style="display:grid;gap:0.75rem;">
          <p>Hay una <strong>Manifestación ${data.label}</strong> activa.</p>
          <p>¿Es pertinente a esta acción?</p>
          <p><strong>Si la aplicas:</strong> +${data.battleBonus} a la Capacidad. Esta acción no admite Exaltar ni Prestar ropa.</p>
        </div>
      `,
      yes: { label: "Aplicar Manifestación" },
      no: { label: "Acción ordinaria" },
      rejectClose: false,
      modal: true
    });

    return Boolean(useIt);
  } catch (err) {
    console.warn("MELIAZ Bridge: decisión de Manifestación cancelada.", err);
    return false;
  }
}

function getSingleTargetSnapshot() {
  const targets = Array.from(game.user?.targets ?? []).filter(token => token?.actor);

  if (targets.length === 0) {
    return { status: "none" };
  }

  if (targets.length > 1) {
    return { status: "multiple", count: targets.length };
  }

  const token = targets[0];
  const targetActor = token.actor;
  const rawPeso = targetActor?.system?.props?.peso;
  const pesoBase = Number(rawPeso);
  const validPeso = Number.isInteger(pesoBase) && pesoBase >= 1;

  return {
    status: validPeso ? "rival" : "noPeso",
    tokenUuid: token.document?.uuid ?? token.uuid ?? null,
    actorUuid: targetActor?.uuid ?? null,
    actorId: targetActor?.id ?? token.document?.actorId ?? null,
    actor: targetActor,
    name: getActorDisplayName(targetActor),
    pesoBase: validPeso ? pesoBase : null,
    apinarPrepared: validPeso ? Boolean(targetActor?.getFlag?.(MODULE_ID, "apinarPrepared")) : false
  };
}

async function askOpposition(target) {
  const hasRivalTarget = target?.status === "rival";
  const hasTargetWithoutPeso = target?.status === "noPeso";
  let result;

  const targetLine = hasRivalTarget || hasTargetWithoutPeso
    ? `<p style="margin:0;"><strong>Objetivo:</strong> ${target.name}</p>`
    : "";

  const pesoControl = hasRivalTarget
    ? `
        <div style="display:flex;align-items:center;gap:0.75rem;">
          <strong>Peso base</strong>
          <span style="font-size:1.15em;">${target.pesoBase}</span>
        </div>
      `
    : `
        ${hasTargetWithoutPeso ? `<p style="margin:0;"><em>Este objetivo no tiene un Peso válido. Decláralo manualmente.</em></p>` : ""}
        <div style="display:flex;align-items:center;gap:0.75rem;">
          <label for="meliaz-peso"><strong>Peso</strong></label>
          <input
            id="meliaz-peso"
            name="peso"
            type="number"
            min="1"
            step="1"
            value="3"
            autofocus
            style="width:6rem;"
          >
        </div>
      `;

  try {
    result = await foundry.applications.api.DialogV2.prompt({
      window: { title: "MELIAZ · Oposición" },
      content: `
        <div style="display:grid;gap:0.75rem;">
          ${targetLine}
          ${pesoControl}
        </div>
      `,
      ok: {
        label: "Declarar acción",
        callback: (event, button) => {
          const form = button.form;

          if (hasRivalTarget) {
            return {
              pesoBase: target.pesoBase,
              apinarBonus: 0,
              peso: target.pesoBase
            };
          }

          const pesoBase = form.elements.peso.valueAsNumber;
          return { pesoBase, apinarBonus: 0, peso: pesoBase };
        }
      },
      rejectClose: false,
      modal: true
    });
  } catch (err) {
    console.warn("MELIAZ Bridge: diálogo de oposición cancelado.", err);
    return null;
  }

  if (result === null || result === undefined) return null;

  const pesoBase = Number(result.pesoBase);
  const apinarBonus = Number(result.apinarBonus ?? 0);
  const peso = Number(result.peso);

  if (!Number.isInteger(pesoBase) || pesoBase < 1 || !Number.isInteger(peso) || peso < 1) {
    ui.notifications.warn("MELIAZ: el Peso debe ser un número entero de 1 o más.");
    return null;
  }

  if (![0, 1].includes(apinarBonus)) {
    ui.notifications.warn("MELIAZ: Apiñar sólo puede aportar +1.");
    return null;
  }

  return { pesoBase, apinarBonus, peso };
}


function announceHiperaTargetSnapshot() {
  const target = getSingleTargetSnapshot();

  if (target.status === "none" || target.status === "multiple") return;

  if (target.status === "rival") {
    ui.notifications.info(
      `MELIAZ · Objetivo: ${target.name} · Peso ${target.pesoBase}`
    );
    return;
  }

  ui.notifications.warn(
    `MELIAZ · Objetivo: ${target.name} · este Actor no tiene un Peso válido.`
  );
}

Hooks.on("targetToken", (user, token, targeted) => {
  if (user?.id !== game.user?.id) return;
  if (!targeted) return;

  // Espera a que Foundry haya actualizado game.user.targets.
  queueMicrotask(() => announceHiperaTargetSnapshot());
});

function makeActionId() {
  return foundry.utils.randomID();
}

async function startAction(actorUuid, capKey) {
  if (pendingByActor.has(actorUuid)) {
    ui.notifications.warn("MELIAZ: este personaje ya tiene una acción pendiente.");
    return;
  }

  const actor = await fromUuid(actorUuid);

  if (!actor || actor.documentName !== "Actor") {
    ui.notifications.error("MELIAZ: no pude encontrar el Actor.");
    return;
  }

  const capName = CAP_LABELS[capKey];
  if (!capName) {
    ui.notifications.error(`MELIAZ: Capacidad desconocida: ${capKey}`);
    return;
  }

  const capValue = Number(actor.system?.props?.[capKey] ?? (capKey === "sentir" ? actor.system?.props?.onda : undefined));

  if (!Number.isFinite(capValue)) {
    ui.notifications.error(`MELIAZ: ${capName} no contiene un valor numérico válido.`);
    return;
  }

  const activeManifestacion = Number(actor.system?.props?.manifestacion_activa ?? 0);
  const manifestacionData = MANIFESTACION_DATA[activeManifestacion] ?? null;
  const useManifestacion = Boolean(manifestacionData);
  const manifestacionBonus = manifestacionData?.battleBonus ?? 0;
  let selfExaltar = false;
  let selfExaltarNewenBefore = null;
  let selfExaltarNewenAfter = null;
  const exaltarPrepared = Boolean(actor.getFlag?.(MODULE_ID, "exaltarPrepared"));

  if (!useManifestacion && exaltarPrepared) {
    const newen = Number(actor.system?.props?.newen ?? 0);
    if (Number.isFinite(newen) && newen >= 1) {
      selfExaltar = true;
      selfExaltarNewenBefore = newen;
      selfExaltarNewenAfter = newen - 1;
    } else {
      try { await actor.unsetFlag(MODULE_ID, "exaltarPrepared"); } catch (err) {}
      ui.notifications.warn("MELIAZ: Exaltar preparado fue cancelado porque ya no queda Newen.");
    }
  }

  const target = getSingleTargetSnapshot();

  if (target.status === "multiple") {
    ui.notifications.warn("MELIAZ: deja un solo objetivo marcado para esta acción. Varios objetivos no significan Apiñar, Piño ni Arremetida.");
    return;
  }

  const preparedApinarBonus = target.status === "rival" && target.apinarPrepared ? 1 : 0;

  const opposition = target.status === "rival"
    ? {
        pesoBase: target.pesoBase,
        apinarBonus: preparedApinarBonus,
        peso: target.pesoBase + preparedApinarBonus
      }
    : await askOpposition(target);
  if (!opposition) return;

  const peso = opposition.peso;
  const pesoBase = opposition.pesoBase;
  const apinarBonus = opposition.apinarBonus;
  const targetName = target.status === "rival" || target.status === "noPeso" ? target.name : null;
  const targetActorUuid = target.status === "rival" || target.status === "noPeso" ? target.actorUuid : null;
  const targetActorId = target.status === "rival" || target.status === "noPeso" ? target.actorId : null;
  const targetTokenUuid = target.status === "rival" || target.status === "noPeso" ? target.tokenUuid : null;

  const actionId = makeActionId();
  const speaker = ChatMessage.getSpeaker({ actor });
  const exaltarBonus = selfExaltar ? 1 : 0;
  const effectiveValue = capValue + manifestacionBonus + exaltarBonus;

  const manifestationLine = useManifestacion
    ? `<p><strong>MANIFESTACIÓN ${manifestacionData.label}:</strong> +${manifestacionBonus}</p>`
    : "";
  const selfExaltarLine = selfExaltar
    ? `<p><strong>EXALTAR:</strong> +1 · Newen ${selfExaltarNewenBefore} → ${selfExaltarNewenAfter}</p>`
    : "";

  const targetLine = targetName
    ? `<p><strong>Objetivo:</strong> ${targetName}</p>`
    : "";

  const pesoLine = apinarBonus
    ? `<strong>Peso:</strong> ${pesoBase} → ${peso} · <strong>Apiñar:</strong> +1`
    : `<strong>Peso:</strong> ${peso}`;

  const pendingControls = useManifestacion
    ? `<p><em>La Manifestación está activa: esta acción no admite Exaltar ni Prestar ropa.</em></p>`
    : `
        <p>
          <button
            type="button"
            data-meliaz-prestar-ropa="1"
            data-action-id="${actionId}"
            data-owner-user-id="${game.user.id}">
            PRESTAR ROPA
          </button>
        </p>
        ${selfExaltar ? "" : `<p><button type="button" data-meliaz-exaltar="1" data-actor-uuid="${actorUuid}" data-owner-user-id="${game.user.id}">EXALTAR</button></p>`}
        <p><em>Sin intervención, se resuelve en 10 segundos.</em></p>
      `;

  const message = await ChatMessage.create({
    user: game.user.id,
    speaker,
    content: `
      <div>
        <h3>MELIAZ · ACCIÓN ${useManifestacion ? "CON MANIFESTACIÓN" : "PENDIENTE"}</h3>
        <p><strong>${getActorDisplayName(actor)}</strong></p>
        ${targetLine}
        <p><strong>Capacidad:</strong> ${capName} (${useManifestacion ? `${capValue} → ${effectiveValue}` : capValue}) · ${pesoLine}</p>
        ${manifestationLine}
        ${selfExaltarLine}
        ${pendingControls}
      </div>
    `,
    flags: {
      [MODULE_ID]: {
        action: {
          actionId,
          state: "pending",
          ownerUserId: game.user.id,
          actorUuid,
          capKey,
          baseValue: capValue,
          effectiveValue,
          peso,
          pesoBase,
          apinarBonus,
          targetName,
          targetActorUuid,
          targetActorId,
          targetTokenUuid,
          intervention: null,
          selfExaltar,
          newenBefore: selfExaltarNewenBefore,
          newenAfter: selfExaltarNewenAfter,
          useManifestacion,
          manifestacionGrade: useManifestacion ? activeManifestacion : 0,
          manifestacionBonus,
          createdAt: Date.now()
        }
      }
    }
  });


  if (selfExaltar) {
    try {
      await actor.update({ "system.props.newen": selfExaltarNewenAfter });
      await actor.unsetFlag(MODULE_ID, "exaltarPrepared");
      if (actor?.sheet?.rendered) actor.sheet.render(false);
    } catch (err) {
      console.error("MELIAZ Bridge: no pude consumir Exaltar preparado.", err);
    }
  }

  // Apiñar can be declared from the Rival sheet before the confrontation.
  // It is a one-action preparation: consume the flag only once the pending
  // action was created successfully. It never mutates the Rival's base Peso.
  if (preparedApinarBonus && target.actor?.getFlag?.(MODULE_ID, "apinarPrepared")) {
    try {
      await target.actor.unsetFlag(MODULE_ID, "apinarPrepared");
      await rerenderRivalSheet(target.actor);
    } catch (err) {
      console.warn("MELIAZ Bridge: no pude limpiar Apiñar preparado.", err);
    }
  }

  const action = {
    actionId,
    ownerUserId: game.user.id,
    actorUuid,
    actor,
    capKey,
    capName,
    baseValue: capValue,
    effectiveValue,
    peso,
    pesoBase,
    apinarBonus,
    targetName,
    targetActorUuid,
    targetActorId,
    targetTokenUuid,
    messageId: message.id,
    intervention: null,
    selfExaltar,
    helperActorUuid: null,
    helperName: null,
    state: "pending",
    timer: null,
    newenBefore: selfExaltarNewenBefore,
    newenAfter: selfExaltarNewenAfter,
    useManifestacion,
    manifestacionGrade: useManifestacion ? activeManifestacion : 0,
    manifestacionBonus
  };

  pendingById.set(actionId, action);
  pendingByActor.set(actorUuid, actionId);

  if (useManifestacion) {
    await resolveAction(action);
    return;
  }

  action.timer = setTimeout(() => {
    resolveAction(action).catch(err => {
      console.error("MELIAZ Bridge: error resolviendo acción.", err);
      cleanupAction(action);
    });
  }, WAIT_MS);
}

async function askExaltarMode() {
  try {
    const mode = await foundry.applications.api.DialogV2.prompt({
      window: { title: "MELIAZ · Exaltar" },
      content: `
        <div style="display:grid;gap:.75rem">
          <p><strong>Exaltar Azar</strong></p>
          <p>Gasta 1 Newén y garantiza un éxito raso en esta acción.</p>
        </div>
      `,
      ok: {
        label: "Exaltar Azar",
        callback: () => "azar"
      },
      rejectClose: false,
      modal: true
    });
    return mode === "azar" ? "azar" : null;
  } catch (err) {
    console.warn("MELIAZ: selección de Exaltar no completada.", err);
    return null;
  }
}

async function exaltar(actorUuid, mode = "capacidad") {
  const actionId = pendingByActor.get(actorUuid);
  const action = actionId ? pendingById.get(actionId) : null;

  if (!action || action.state !== "pending") {
    ui.notifications.warn("MELIAZ: no hay una acción pendiente de este personaje para Exaltar.");
    return;
  }

  if (action.useManifestacion) {
    ui.notifications.warn("MELIAZ: una acción con Manifestación no admite Exaltar.");
    return;
  }

  if (action.selfExaltar) {
    ui.notifications.warn("MELIAZ: esta acción ya fue Exaltada desde la hoja.");
    return;
  }

  if (mode !== "capacidad" && mode !== "azar") return;

  const actor = await fromUuid(actorUuid);
  if (!actor) {
    ui.notifications.error("MELIAZ: no pude encontrar el Actor.");
    return;
  }

  const newen = Number(actor.system?.props?.newen ?? 0);
  if (!Number.isFinite(newen) || newen <= 0) {
    ui.notifications.warn("MELIAZ: no tienes Newén para Exaltar.");
    return;
  }

  if (!claimIntervention(action, mode === "azar" ? "exaltarAzar" : "exaltarCapacidad")) return;

  action.newenBefore = newen;
  action.newenAfter = newen - 1;
  if (mode === "azar") {
    action.forceOutcome = "ÉXITO RASO";
  } else {
    action.effectiveValue = action.baseValue + 1;
  }

  await actor.update({ "system.props.newen": action.newenAfter });
  await resolveAction(action, { alreadyClaimed: true });
}

function claimIntervention(action, type) {
  if (!action || action.state !== "pending") return false;

  action.state = "claimed";
  action.intervention = type;

  if (action.timer) {
    clearTimeout(action.timer);
    action.timer = null;
  }

  return true;
}

function getHelperActor() {
  if (game.user.character) return game.user.character;

  const controlled = canvas?.tokens?.controlled?.filter(t => t.actor) ?? [];
  if (controlled.length === 1) return controlled[0].actor;

  return null;
}

async function handleDocumentClick(event) {
  const officiateButton = event.target.closest?.("[data-meliaz-oficiar]");
  if (officiateButton) {
    event.preventDefault();
    event.stopPropagation();
    if (officiateButton.dataset.busy === "1") return;
    officiateButton.dataset.busy = "1";
    officiateButton.disabled = true;
    try {
      await oficiarRitual(String(officiateButton.dataset.itemUuid ?? ""), String(officiateButton.dataset.actorUuid ?? ""));
    } finally {
      officiateButton.dataset.busy = "0";
      officiateButton.disabled = false;
    }
    return;
  }

  const pesoButton = event.target.closest?.("[data-meliaz-lose-peso]");
  if (pesoButton) {
    event.preventDefault();
    event.stopPropagation();

    const actorUuid = String(pesoButton.dataset.actorUuid ?? "");
    if (!actorUuid) {
      ui.notifications.warn("MELIAZ: este control no identifica al objetivo.");
      return;
    }

    pesoButton.disabled = true;
    try {
      const result = await requestPesoLoss(actorUuid, 1);
      if (result?.ok) {
        pesoButton.textContent = `PESO ${result.before} → ${result.after}`;
      }
    } finally {
      // Se deja activo para poder marcar otra pérdida si la ficción lo exige.
      pesoButton.disabled = false;
    }
    return;
  }

  const copyButton = event.target.closest?.("[data-meliaz-copy-text]");
  if (copyButton) {
    event.preventDefault();
    event.stopPropagation();

    const messageId = copyButton.dataset.messageId;
    const message = messageId ? game.messages.get(messageId) : null;
    const copyText = message?.getFlag(MODULE_ID, "copyText");

    if (!copyText) {
      ui.notifications.warn("MELIAZ: no encuentro texto limpio para copiar.");
      return;
    }

    try {
      await copyTextToClipboard(copyText);
      ui.notifications.info("MELIAZ: resultado copiado.");
    } catch (err) {
      console.error("MELIAZ Bridge: no pude copiar el resultado.", err);
      ui.notifications.error("MELIAZ: no pude copiar el resultado.");
    }
    return;
  }

  const exaltarButton = event.target.closest?.("[data-meliaz-exaltar]");
  if (exaltarButton) {
    event.preventDefault();
    event.stopPropagation();

    const ownerUserId = exaltarButton.dataset.ownerUserId;
    const actorUuid = exaltarButton.dataset.actorUuid;

    if (ownerUserId !== game.user.id) {
      ui.notifications.warn("MELIAZ: sólo quien ejecuta la acción puede Exaltar.");
      return;
    }

    if (!actorUuid) {
      ui.notifications.error("MELIAZ: el botón Exaltar no identifica al Actor.");
      return;
    }

    exaltarButton.disabled = true;

    try {
      const mode = await askExaltarMode();
      if (mode) await exaltar(actorUuid, mode);
    } finally {
      const actionId = pendingByActor.get(actorUuid);
      if (actionId) exaltarButton.disabled = false;
    }

    return;
  }

  const button = event.target.closest?.("[data-meliaz-prestar-ropa]");
  if (!button) return;

  event.preventDefault();
  event.stopPropagation();

  const actionId = button.dataset.actionId;
  const ownerUserId = button.dataset.ownerUserId;

  if (!actionId || !ownerUserId) {
    ui.notifications.error("MELIAZ: el botón Prestar ropa no tiene una acción válida.");
    return;
  }

  if (ownerUserId === game.user.id) {
    ui.notifications.warn("MELIAZ: Prestar ropa debe venir de otro jugador/personaje.");
    return;
  }

  // Fallback adicional: si por cualquier motivo no quedó registrado al cargar,
  // intentamos hacerlo justo antes de usarlo.
  if (!meliazSocket) registerSocketLib();

  if (!meliazSocket) {
    ui.notifications.error(
      "MELIAZ: SocketLib está instalado pero Bridge no logró enlazarlo. Recarga este cliente."
    );
    return;
  }

  const helper = getHelperActor();

  if (!helper) {
    ui.notifications.warn(
      "MELIAZ: asigna un personaje a este usuario o selecciona un único token antes de Prestar ropa."
    );
    return;
  }

  button.disabled = true;
  button.textContent = `PRESTANDO ROPA · ${helper.name}…`;

  try {
    const result = await meliazSocket.executeAsUser(
      "receivePrestarRopa",
      ownerUserId,
      {
        actionId,
        helperUserId: game.user.id,
        helperActorUuid: helper.uuid,
        helperName: helper.name
      }
    );

    if (result?.ok) {
      ui.notifications.info(`MELIAZ: ${helper.name} prestó ropa.`);
    } else {
      button.disabled = false;
      button.textContent = "PRESTAR ROPA";
      ui.notifications.warn(
        result?.message ?? "MELIAZ: la acción ya no acepta Prestar ropa."
      );
    }
  } catch (err) {
    console.error("MELIAZ Bridge: falló Prestar ropa por SocketLib.", err);
    button.disabled = false;
    button.textContent = "PRESTAR ROPA";
    ui.notifications.error(
      "MELIAZ: no pude comunicar Prestar ropa al jugador activo."
    );
  }
}


function getPendingMessagesForRival(rival) {
  const rivalActorUuid = rival?.uuid ?? null;
  const rivalActorId = rival?.id ?? null;

  return (game.messages?.contents ?? []).filter(message => {
    const data = message.getFlag?.(MODULE_ID, "action");
    if (data?.state !== "pending") return false;

    const sameUuid = Boolean(rivalActorUuid && data?.targetActorUuid === rivalActorUuid);
    const sameId = Boolean(rivalActorId && data?.targetActorId === rivalActorId);
    return sameUuid || sameId;
  });
}

async function apinarRival(rivalActorUuid) {
  if (!game.user.isGM) {
    ui.notifications.warn("MELIAZ: sólo la Voz del Mundo puede Apiñar Rivales.");
    return;
  }

  const rival = await fromUuid(rivalActorUuid);
  const pesoBase = Number(rival?.system?.props?.peso);

  if (!rival || rival.documentName !== "Actor" || !Number.isInteger(pesoBase) || pesoBase < 1) {
    ui.notifications.warn("MELIAZ: este Actor no tiene un Peso de Rival válido.");
    return;
  }

  const matches = getPendingMessagesForRival(rival);

  if (matches.length > 1) {
    ui.notifications.warn(`MELIAZ: hay más de una acción pendiente contra ${getActorDisplayName(rival)}. Resuelve una antes de Apiñar.`);
    return;
  }

  // Si ya existe una acción contra este Rival, Apiñar interviene de inmediato.
  if (matches.length === 1) {
    const message = matches[0];
    const actionData = message.getFlag(MODULE_ID, "action");

    if (Number(actionData?.apinarBonus ?? 0) >= 1) {
      ui.notifications.warn("MELIAZ: este Rival ya está Apiñado en esa acción.");
      return;
    }

    const payload = {
      actionId: actionData.actionId,
      rivalActorUuid,
      rivalActorId: rival.id,
      rivalName: getActorDisplayName(rival),
      gmUserId: game.user.id
    };

    let result;

    if (actionData.ownerUserId === game.user.id) {
      result = await receiveApinar(payload);
    } else {
      if (!meliazSocket) registerSocketLib();

      if (!meliazSocket) {
        ui.notifications.error("MELIAZ: SocketLib no está disponible para Apiñar.");
        return;
      }

      result = await meliazSocket.executeAsUser(
        "receiveApinar",
        actionData.ownerUserId,
        payload
      );
    }

    if (result?.ok) {
      // Si por alguna razón estaba preparado además de intervenir, limpiamos
      // la preparación para evitar que se arrastre a una segunda acción.
      if (rival.getFlag?.(MODULE_ID, "apinarPrepared")) {
        try { await rival.unsetFlag(MODULE_ID, "apinarPrepared"); } catch (err) {}
      }
      await rerenderRivalSheet(rival);
      ui.notifications.info(`MELIAZ: ${getActorDisplayName(rival)} se apiña · Peso +1.`);
    } else {
      ui.notifications.warn(result?.message ?? "MELIAZ: no pude Apiñar esta acción.");
    }
    return;
  }

  // Sin acción pendiente, el botón queda disponible como intervención
  // anticipada. Se arma para la próxima oposición de este Rival, tanto dentro
  // como fuera de una batalla. Segundo clic = cancelar preparación.
  const prepared = Boolean(rival.getFlag?.(MODULE_ID, "apinarPrepared"));

  try {
    if (prepared) {
      await rival.unsetFlag(MODULE_ID, "apinarPrepared");
      await rerenderRivalSheet(rival);
      ui.notifications.info(`MELIAZ: Apiñar cancelado para ${getActorDisplayName(rival)}.`);
    } else {
      await rival.setFlag(MODULE_ID, "apinarPrepared", true);
      await rerenderRivalSheet(rival);
      ui.notifications.info(`MELIAZ: ${getActorDisplayName(rival)} queda Apiñado · +1 a su próxima oposición.`);
    }
  } catch (err) {
    console.error("MELIAZ Bridge: no pude cambiar Apiñar preparado.", err);
    ui.notifications.error("MELIAZ: no pude preparar Apiñar en este Rival.");
  }
}

async function refreshPendingActionMessage(action) {
  const message = game.messages.get(action?.messageId);
  if (!message || !action || action.state !== "pending") return;

  const manifestationLine = action.useManifestacion
    ? `<p><strong>MANIFESTACIÓN ${MANIFESTACION_DATA[action.manifestacionGrade].label}:</strong> +${action.manifestacionBonus}</p>`
    : "";
  const selfExaltarLine = action.selfExaltar
    ? `<p><strong>EXALTAR:</strong> +1 · Newen ${action.newenBefore} → ${action.newenAfter}</p>`
    : "";

  const targetLine = action.targetName
    ? `<p><strong>Objetivo:</strong> ${action.targetName}</p>`
    : "";

  const pesoLine = action.apinarBonus
    ? `<strong>Peso:</strong> ${action.pesoBase} → ${action.peso} · <strong>Apiñar:</strong> +1`
    : `<strong>Peso:</strong> ${action.peso}`;

  const pendingControls = action.useManifestacion
    ? `<p><em>La Manifestación está activa: esta acción no admite Exaltar ni Prestar ropa.</em></p>`
    : `
        <p>
          <button
            type="button"
            data-meliaz-prestar-ropa="1"
            data-action-id="${action.actionId}"
            data-owner-user-id="${action.ownerUserId}">
            PRESTAR ROPA
          </button>
        </p>
        ${action.selfExaltar ? "" : `<p><button type="button" data-meliaz-exaltar="1" data-actor-uuid="${action.actorUuid}" data-owner-user-id="${action.ownerUserId}">EXALTAR</button></p>`}
        <p><em>Sin intervención, se resuelve en 10 segundos.</em></p>
      `;

  await message.update({
    content: `
      <div>
        <h3>MELIAZ · ACCIÓN ${action.useManifestacion ? "CON MANIFESTACIÓN" : "PENDIENTE"}</h3>
        <p><strong>${getActorDisplayName(action.actor)}</strong></p>
        ${targetLine}
        <p><strong>Capacidad:</strong> ${action.capName} (${action.useManifestacion ? `${action.baseValue} → ${action.effectiveValue}` : action.baseValue}) · ${pesoLine}</p>
        ${manifestationLine}
        ${selfExaltarLine}
        ${pendingControls}
      </div>
    `,
    [`flags.${MODULE_ID}.action.peso`]: action.peso,
    [`flags.${MODULE_ID}.action.pesoBase`]: action.pesoBase,
    [`flags.${MODULE_ID}.action.apinarBonus`]: action.apinarBonus,
    [`flags.${MODULE_ID}.action.selfExaltar`]: Boolean(action.selfExaltar),
    [`flags.${MODULE_ID}.action.newenBefore`]: action.newenBefore,
    [`flags.${MODULE_ID}.action.newenAfter`]: action.newenAfter
  });
}

async function receiveApinar(payload) {
  const action = pendingById.get(payload?.actionId);

  if (!action) {
    return { ok: false, message: "La acción ya no está pendiente." };
  }

  if (action.ownerUserId !== game.user.id) {
    return { ok: false, message: "Este usuario no es la autoridad de la acción." };
  }

  if (action.state !== "pending") {
    return { ok: false, message: "La acción ya se está resolviendo o ya terminó." };
  }

  const sameUuid = Boolean(action.targetActorUuid && action.targetActorUuid === payload?.rivalActorUuid);
  const sameId = Boolean(action.targetActorId && action.targetActorId === payload?.rivalActorId);

  if (!sameUuid && !sameId) {
    return { ok: false, message: "Ese Rival no es el objetivo de esta acción." };
  }

  if (Number(action.apinarBonus ?? 0) >= 1) {
    return { ok: false, message: "Apiñar ya fue aplicado a esta acción." };
  }

  action.apinarBonus = 1;
  action.peso = Number(action.pesoBase) + 1;

  await refreshPendingActionMessage(action);

  return {
    ok: true,
    actionId: action.actionId,
    pesoBase: action.pesoBase,
    peso: action.peso
  };
}

async function copyTextToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();

  const ok = document.execCommand("copy");
  textarea.remove();

  if (!ok) throw new Error("document.execCommand('copy') falló.");
}

async function receivePrestarRopa(payload) {
  const action = pendingById.get(payload?.actionId);

  if (!action) {
    return { ok: false, message: "La acción ya no está pendiente." };
  }

  if (action.ownerUserId !== game.user.id) {
    return { ok: false, message: "Este usuario no es la autoridad de la acción." };
  }

  if (action.state !== "pending") {
    return { ok: false, message: "Otra intervención ya resolvió la acción." };
  }

  if (action.useManifestacion) {
    return { ok: false, message: "Una acción con Manifestación no admite Prestar ropa." };
  }

  if (payload.helperActorUuid === action.actorUuid) {
    return { ok: false, message: "Un personaje no puede prestarse ropa a sí mismo." };
  }

  if (!claimIntervention(action, "prestarRopa")) {
    return { ok: false, message: "La acción ya no acepta intervenciones." };
  }

  action.effectiveValue = Number(action.effectiveValue) + 1;
  action.helperActorUuid = payload.helperActorUuid;
  action.helperName = payload.helperName || "otro personaje";

  await resolveAction(action, { alreadyClaimed: true });

  return {
    ok: true,
    actionId: action.actionId,
    helperName: action.helperName
  };
}



async function applyPesoLossLocal(actorUuid, amount = 1) {
  const actor = await fromUuid(actorUuid);
  if (!actor || actor.documentName !== "Actor") {
    return { ok:false, message:"No pude encontrar el Rival objetivo." };
  }

  const current = Number(actor.system?.props?.peso);
  if (!Number.isFinite(current)) {
    return { ok:false, message:`${getActorDisplayName(actor)} no tiene Peso válido.` };
  }

  const loss = Math.max(1, Math.trunc(Number(amount) || 1));
  const next = Math.max(0, current - loss);

  await actor.update({ "system.props.peso": next });

  if (actor?.sheet?.rendered) {
    try { actor.sheet.render(false); } catch (err) {}
  }

  return {
    ok:true,
    actorUuid,
    actorName:getActorDisplayName(actor),
    before:current,
    after:next,
    loss
  };
}

async function requestPesoLoss(actorUuid, amount = 1) {
  const actor = await fromUuid(actorUuid);
  if (!actor) {
    ui.notifications.error("MELIAZ: no pude encontrar el Rival para marcar Peso.");
    return null;
  }

  let result = null;

  if (game.user?.isGM || actor.isOwner) {
    result = await applyPesoLossLocal(actorUuid, amount);
  } else {
    if (!meliazSocket) registerSocketLib();

    if (!meliazSocket) {
      ui.notifications.error("MELIAZ: SocketLib no está disponible para marcar Peso.");
      return null;
    }

    result = await meliazSocket.executeAsGM(
      "applyPesoLoss",
      actorUuid,
      amount
    );
  }

  if (!result?.ok) {
    ui.notifications.warn(result?.message ?? "MELIAZ: no pude marcar la pérdida de Peso.");
    return result;
  }

  const fuera = Number(result.after) === 0 ? " · FUERA DE COMBATE" : "";
  ui.notifications.info(
    `MELIAZ · ${result.actorName}: Peso ${result.before} → ${result.after}${fuera}`
  );
  return result;
}

async function resolveAction(action, { alreadyClaimed = false } = {}) {
  if (!action) return;

  if (!alreadyClaimed) {
    if (action.state !== "pending") return;

    action.state = "resolving";

    if (action.timer) {
      clearTimeout(action.timer);
      action.timer = null;
    }
  } else {
    if (action.state !== "claimed") return;
    action.state = "resolving";
  }

  const value = action.effectiveValue;
  const peso = action.peso;

  const ventaja =
    value === peso ? "SIN VENTAJA · cambia la situación" :
    value > peso ? "VENTAJA: PERSONAJE" :
    "VENTAJA: RIVAL";

  let resultLine = "No se tira.";
  let rollTotal = null;

  if (action.forceOutcome === "ÉXITO RASO") {
    resultLine = "ÉXITO RASO · Exaltar Azar";
  } else if (value > peso) {
    const roll = await new Roll("1d4").evaluate();
    rollTotal = Number(roll.total);

    const outcome = {
      1: "DESASTRE",
      2: "FALLO",
      3: "ÉXITO",
      4: "CRÍTICO"
    }[rollTotal];

    resultLine = `d4: ${rollTotal} · ${outcome}`;
  } else if (value < peso) {
    // Current CORE: a lower effective Capability cannot impose directly
    // against a Rival's Weight and must not trigger a chance test.
    resultLine = "SIN PRUEBA DE AZAR · Capacidad efectiva inferior al Peso. Cambia la situación antes de resolver.";
  }

  const message = game.messages.get(action.messageId);

  if (message) {
    const changedValue =
      action.intervention || action.useManifestacion || action.selfExaltar;

    const capLine = changedValue
      ? `${action.capName} (${action.baseValue} → ${action.effectiveValue})`
      : `${action.capName} (${action.baseValue})`;

    const interventionHtmlParts = [];
    const interventionTextParts = [];

    if (action.useManifestacion) {
      const mData = MANIFESTACION_DATA[action.manifestacionGrade];
      interventionHtmlParts.push(`<p><strong>MANIFESTACIÓN ${mData.label}:</strong> +${action.manifestacionBonus}</p>`);
      interventionTextParts.push(`MANIFESTACIÓN ${mData.label}: +${action.manifestacionBonus}`);
    } else {
      if (action.selfExaltar) {
        interventionHtmlParts.push(`<p><strong>EXALTAR:</strong> +1 · Newen ${action.newenBefore} → ${action.newenAfter}</p>`);
        interventionTextParts.push(`EXALTAR: +1 · Newen ${action.newenBefore} → ${action.newenAfter}`);
      }
      if (action.intervention === "exaltarCapacidad") {
        interventionHtmlParts.push(`<p><strong>EXALTAR CAPACIDAD:</strong> +1 · Newen ${action.newenBefore} → ${action.newenAfter}</p>`);
        interventionTextParts.push(`EXALTAR CAPACIDAD: +1 · Newen ${action.newenBefore} → ${action.newenAfter}`);
      }
      if (action.intervention === "exaltarAzar") {
        interventionHtmlParts.push(`<p><strong>EXALTAR AZAR:</strong> éxito raso garantizado · Newen ${action.newenBefore} → ${action.newenAfter}</p>`);
        interventionTextParts.push(`EXALTAR AZAR: éxito raso garantizado · Newen ${action.newenBefore} → ${action.newenAfter}`);
      }
      if (action.intervention === "prestarRopa") {
        interventionHtmlParts.push(`<p><strong>PRESTAR ROPA:</strong> ${action.helperName} · +1</p>`);
        interventionTextParts.push(`PRESTAR ROPA: ${action.helperName} · +1`);
      }
    }

    const interventionLine = interventionHtmlParts.length
      ? interventionHtmlParts.join("")
      : `<p><strong>Intervención:</strong> ninguna</p>`;
    const interventionText = interventionTextParts.length
      ? interventionTextParts.join(" · ")
      : "Intervención: ninguna";

    const targetText = action.targetName ? `Objetivo: ${action.targetName}` : null;
    const pesoText = action.apinarBonus
      ? `Peso: ${action.pesoBase} → ${peso} · Apiñar: +1`
      : `Peso: ${peso}`;
    const targetHtml = action.targetName
      ? `<p><strong>Objetivo:</strong> ${action.targetName}</p>`
      : "";

    const targetAguanteControl = action.targetActorUuid
      ? `
          <p>
            <button
              type="button"
              data-meliaz-lose-peso="1"
              data-actor-uuid="${action.targetActorUuid}">
              MARCAR −1 PESO
            </button>
          </p>
        `
      : "";
    const pesoHtml = action.apinarBonus
      ? `<strong>Peso:</strong> ${action.pesoBase} → ${peso} · <strong>Apiñar:</strong> +1`
      : `<strong>Peso:</strong> ${peso}`;

    const copyText = [
      "MELIAZ · RESOLUCIÓN",
      action.actor.name,
      targetText,
      `Capacidad: ${capLine} · ${pesoText}`,
      interventionText,
      ventaja,
      resultLine
    ].filter(Boolean).join("\n");

    await message.update({
      content: `
        <div>
          <h3>MELIAZ · RESOLUCIÓN</h3>
          <p><strong>${getActorDisplayName(action.actor)}</strong></p>
          ${targetHtml}
          <p><strong>Capacidad:</strong> ${capLine} · ${pesoHtml}</p>
          ${interventionLine}
          <p><strong>${ventaja}</strong></p>
          <p>${resultLine}</p>
          ${targetAguanteControl}
          <p><em>Resuelto automáticamente. La pérdida de Peso se marca sólo cuando el PJ se impone en combate y su intención implica desgaste.</em></p>
          <div class="meliaz-copy-row">
            <button
              type="button"
              class="meliaz-copy-icon"
              data-meliaz-copy-text="1"
              data-message-id="${action.messageId}"
              title="Copiar texto"
              aria-label="Copiar texto">⧉</button>
          </div>
        </div>
      `,
      [`flags.${MODULE_ID}.copyText`]: copyText,
      [`flags.${MODULE_ID}.action.state`]: "resolved",
      [`flags.${MODULE_ID}.action.effectiveValue`]: action.effectiveValue,
      [`flags.${MODULE_ID}.action.peso`]: action.peso,
      [`flags.${MODULE_ID}.action.pesoBase`]: action.pesoBase,
      [`flags.${MODULE_ID}.action.apinarBonus`]: action.apinarBonus,
      [`flags.${MODULE_ID}.action.targetName`]: action.targetName,
      [`flags.${MODULE_ID}.action.targetActorUuid`]: action.targetActorUuid,
      [`flags.${MODULE_ID}.action.targetActorId`]: action.targetActorId,
      [`flags.${MODULE_ID}.action.targetTokenUuid`]: action.targetTokenUuid,
      [`flags.${MODULE_ID}.action.intervention`]: action.intervention,
      [`flags.${MODULE_ID}.action.selfExaltar`]: Boolean(action.selfExaltar),
      [`flags.${MODULE_ID}.action.newenBefore`]: action.newenBefore,
      [`flags.${MODULE_ID}.action.newenAfter`]: action.newenAfter,
      [`flags.${MODULE_ID}.action.useManifestacion`]: action.useManifestacion,
      [`flags.${MODULE_ID}.action.manifestacionGrade`]: action.manifestacionGrade,
      [`flags.${MODULE_ID}.action.manifestacionBonus`]: action.manifestacionBonus,
      [`flags.${MODULE_ID}.action.helperActorUuid`]: action.helperActorUuid,
      [`flags.${MODULE_ID}.action.helperName`]: action.helperName,
      [`flags.${MODULE_ID}.action.rollTotal`]: rollTotal,
      [`flags.${MODULE_ID}.action.forceOutcome`]: action.forceOutcome ?? null,
      [`flags.${MODULE_ID}.action.resolvedAt`]: Date.now()
    });
  }

  action.state = "resolved";
  cleanupAction(action);
}

function cleanupAction(action) {
  if (!action) return;

  if (action.timer) {
    clearTimeout(action.timer);
    action.timer = null;
  }

  pendingById.delete(action.actionId);

  if (pendingByActor.get(action.actorUuid) === action.actionId) {
    pendingByActor.delete(action.actorUuid);
  }
}


// V14 · Helpers compartidos por ApplicationV2 y la ruta legacy de CSB.
function installHiperaBioInfo(application, html) {
  const item = application?.document ?? application?.item;
  if (String(item?.system?.props?.hipera_tipo ?? "").toLowerCase() !== "bioma") return;
  const root = html?.querySelector ? html : html?.[0];
  if (!root?.querySelector || root.querySelector(".ha-bio-info-v14")) return;
  const props = item.system?.props ?? {};
  const box = document.createElement("section");
  box.className = "ha-bio-info-v14";
  box.style.cssText = "";
  for (const [label,key] of [["Descripción","descripcion"],["Situación de juego","en_escena"],["Entorno","bioma"],["Obstáculo de ejemplo","cientifico"]]) {
    const value = String(props[key] ?? "").trim();
    if (!value) continue;
    const heading = document.createElement("strong"); heading.textContent=label;
    const paragraph = document.createElement("p"); paragraph.textContent=value;
    box.append(heading,paragraph);
  }
  if (box.childElementCount) (root.querySelector(".window-content") ?? root).appendChild(box);
}

function installHiperaItemTheme(application, html) {
  const root = html?.querySelector ? html : html?.[0];
  if (!root?.querySelector) return;
  const doc = application?.document ?? application?.item;
  if (!doc || doc.type !== "equippableItem") return;
  root.classList?.add("ha-normalized-item-sheet");
  const content = root.querySelector(".window-content") ?? root;
  content.classList?.add("ha-normalized-item-content");
}

// Ruta legacy conservada para sistemas que todavía usan ApplicationV1.
Hooks.on("renderItemSheet", (application, html) => {
  installHiperaBioInfo(application, html);
  installHiperaItemTheme(application, html);
});


Hooks.once("ready", () => {
  if (document.getElementById("ha-item-theme-normalization")) return;
  const style = document.createElement("style");
  style.id = "ha-item-theme-normalization";
  style.textContent = `
    .ha-normalized-item-content {
      --ha-card-bg: rgba(127,127,127,.055);
      --ha-card-border: rgba(127,127,127,.24);
      color: var(--color-text-primary, inherit);
    }
    .ha-normalized-item-sheet :is(.ha-bio-info-v14, .ha-item-reading-block) {
      box-sizing: border-box; padding: 10px 12px; margin: 8px;
      max-height: 360px; overflow: auto;
      color: var(--color-text-primary, inherit) !important;
      background-color: var(--ha-card-bg) !important;
      border: 1px solid var(--ha-card-border) !important;
      border-radius: 4px;
      font: inherit;
    }
    .ha-normalized-item-sheet .ha-bio-info-v14 :is(p,strong) {
      color: inherit !important; line-height: 1.35;
    }
    .ha-normalized-item-sheet .ha-bio-info-v14 strong { display: block; margin: .45em 0 .15em; }
    .ha-normalized-item-sheet .ha-bio-info-v14 p { margin: 0 0 .45em; }
    .ha-normalized-item-sheet :is(input,textarea,select) {
      color: var(--color-text-primary, inherit);
    }
  `;
  style.textContent += `
    /* 0.24.102 · Limpieza visual definitiva de los cuatro recuadros drag & drop.
       Los antiguos listados de texto quedan fuera de la interfaz; no se borran datos. */
    .ha-kona-sheet .ha-ritual-legacy-list,
    .ha-kona-sheet .ha-ritual-legacy-row,
    .ha-kona-sheet .ha-ritual-legacy-name,
    .ha-kona-sheet .ha-biomas-heading,
    .ha-kona-sheet .ha-biomas-open,
    .ha-kona-sheet .ha-biomas-remove {
      display: none !important;
    }
    .ha-kona-sheet .ha-sentir-instrumentos-box,
    .ha-kona-sheet .ha-sentir-instrumentos-list,
    .ha-kona-sheet .ha-biomas-box,
    .ha-kona-sheet .ha-biomas-list,
    .ha-kona-sheet .ha-ritual-items-area {
      background: transparent !important;
      background-color: transparent !important;
      box-shadow: none !important;
      outline: 0 !important;
    }
  `;
  style.textContent += `
    /* 0.24.103 · Equipo adopta la cuadrícula común 2×2; los inputs CSB siguen persistiendo. */
    .ha-kona-sheet .ha-equipo-items-grid {
      position: absolute !important;
      left: 36.2% !important;
      top: 73.5% !important;
      width: 10.6% !important;
      height: 10.6% !important;
      display: grid !important;
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      grid-template-rows: repeat(2, minmax(0, 1fr)) !important;
      gap: 1px !important;
      padding: 0 !important;
      margin: 0 !important;
      box-sizing: border-box !important;
      background: transparent !important;
      border: 0 !important;
      box-shadow: none !important;
      z-index: 35 !important;
    }
    .ha-kona-sheet .ha-equipo-grid-cell {
      min-width: 0 !important; min-height: 0 !important;
      width: 100% !important; height: 100% !important;
      padding: 0 !important; margin: 0 !important;
      display: flex !important; align-items: center !important; justify-content: center !important;
      overflow: hidden !important; box-sizing: border-box !important;
      border: 1px dashed rgba(85,39,27,.20) !important;
      border-radius: 2px !important;
      background: transparent !important;
      box-shadow: none !important;
      cursor: pointer !important;
    }
    .ha-kona-sheet .ha-equipo-grid-cell:has(.ha-equipo-grid-icon) {
      border-color: transparent !important;
    }
    .ha-kona-sheet .ha-equipo-grid-icon {
      display: block !important; width: 100% !important; height: 100% !important;
      object-fit: contain !important; pointer-events: none !important;
    }
    .ha-kona-sheet .ha-equipo-grid-empty {
      display: block !important; color: rgba(85,39,27,.40) !important;
      font: 12px/1 Georgia,serif !important; pointer-events: none !important;
    }
  `;
  style.textContent += `
    /* 0.24.104 · Ñeque: Arma y Armadura en dos tarjetas verticales grandes. */
    .ha-kona-sheet .ha-neque-loadout {
      left: 27.3% !important;
      top: calc(66.0% - 10px) !important;
      width: 10.0% !important;
      height: 14.4% !important;
      display: flex !important;
      flex-direction: column !important;
      gap: 2% !important;
      box-sizing: border-box !important;
      background: transparent !important;
      pointer-events: auto !important;
    }
    .ha-kona-sheet .ha-neque-loadout-row {
      position: relative !important;
      display: flex !important;
      flex: 1 1 0 !important;
      width: 100% !important;
      min-height: 0 !important;
      max-height: none !important;
      margin: 0 !important;
      padding: 2px !important;
      align-items: center !important;
      justify-content: center !important;
      box-sizing: border-box !important;
      border: 1px solid rgba(74,36,21,.42) !important;
      border-radius: 2px !important;
      background: rgba(244,222,183,.10) !important;
      overflow: hidden !important;
      cursor: pointer !important;
    }
    .ha-kona-sheet .ha-neque-loadout-icon {
      display: block;
      width: 100% !important;
      height: 100% !important;
      max-width: 100% !important;
      max-height: 100% !important;
      min-width: 0 !important;
      min-height: 0 !important;
      object-fit: contain !important;
      border: 0 !important;
      border-radius: 0 !important;
      pointer-events: none !important;
    }
    .ha-kona-sheet .ha-neque-loadout-name {
      position: absolute !important;
      inset: 0 !important;
      width: 100% !important;
      height: 100% !important;
      opacity: 0 !important;
      overflow: hidden !important;
      cursor: pointer !important;
    }
    .ha-kona-sheet .ha-neque-loadout-remove { display:none !important; }
    .ha-kona-sheet .ha-armadura-averiada {
      position: absolute !important;
      right: 2px !important;
      top: 2px !important;
      z-index: 3 !important;
      display: none !important;
      width: 18px !important;
      height: 18px !important;
      background: rgba(255,248,233,.88) !important;
      border-radius: 50% !important;
    }
    .ha-kona-sheet .ha-neque-loadout-row.is-averiada .ha-armadura-averiada {
      display: inline-flex !important;
    }

    /* 0.24.105 · Geometría anclada a los dos recuadros originales de Ñeque.
       Elimina el transform heredado: la zona visible y el hitbox deben coincidir. */
    .ha-kona-sheet .ha-neque-loadout {
      left: 27.3% !important;
      top: calc(66.0% - 10px) !important;
      width: 10.0% !important;
      height: 14.4% !important;
      transform: none !important;
      border: 0 !important;
      outline: 0 !important;
      box-shadow: none !important;
      background: transparent !important;
      gap: 0 !important;
    }
    .ha-kona-sheet .ha-neque-loadout-row {
      flex: 0 0 50% !important;
      width: 100% !important;
      height: 50% !important;
      min-height: 0 !important;
      max-height: 50% !important;
      margin: 0 !important;
      padding: 1px !important;
      border: 1px solid rgba(74,36,21,.42) !important;
      background: rgba(244,222,183,.10) !important;
    }
    .ha-kona-sheet .ha-neque-loadout-row.is-empty {
      border: 0 !important;
      background: transparent !important;
      box-shadow: none !important;
    }
  `;
  /* 0.24.107 · Ñeque: dimensiones iguales a una celda de KonaItemGrid.
     Mantiene el bloque 10% × 14.4% y dos slots 50/50 del checkpoint 0.24.105.
     Elimina el límite legacy de miniatura 14px sin alterar la regla de Oficio. */
  style.textContent += `
    .ha-kona-sheet .ha-neque-loadout {
      left: 27.3% !important;
      top: calc(66.0% - 10px) !important;
      width: 10% !important;
      height: 14.4% !important;
      transform: none !important;
      display: flex !important;
      flex-direction: column !important;
      gap: 0 !important;
      padding: 0 !important;
      margin: 0 !important;
      border: 0 !important;
      background: transparent !important;
      box-shadow: none !important;
      overflow: visible !important;
    }
    .ha-kona-sheet .ha-neque-loadout-row {
      position: relative !important;
      display: flex !important;
      flex: 0 0 50% !important;
      width: 100% !important;
      height: 50% !important;
      min-width: 0 !important;
      min-height: 0 !important;
      max-height: 50% !important;
      box-sizing: border-box !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
      border: 0 !important;
      border-radius: 0 !important;
      background: transparent !important;
      box-shadow: none !important;
      overflow: hidden !important;
      cursor: pointer !important;
    }
    .ha-kona-sheet .ha-neque-loadout-icon {
      display: block;
      flex: 0 0 100% !important;
      width: 100% !important;
      height: 100% !important;
      min-width: 0 !important;
      min-height: 0 !important;
      max-width: 100% !important;
      max-height: 100% !important;
      object-fit: contain !important;
      border: 0 !important;
      border-radius: 0 !important;
      background: transparent !important;
      pointer-events: none !important;
      transform: translateY(-12%) scale(1.35) !important;
      transform-origin: center center !important;
    }
    .ha-kona-sheet .ha-neque-loadout-row.is-empty {
      border: 0 !important;
      background: transparent !important;
      box-shadow: none !important;
    }
    .ha-kona-sheet .ha-neque-loadout-name,
    .ha-kona-sheet .ha-neque-loadout-remove {
      display: none !important;
    }
  `;
  /* 0.24.128 · Ñeque: cada hitbox coincide con su pictograma original.
     Coordenadas relativas a la placa Kona 1448×1086 (4:3).
     No cambia eventos, persistencia, clasificación ni restricción de Oficio. */
  style.textContent += `
    .ha-kona-sheet .ha-neque-loadout {
      left: 22.03% !important;
      top: 58.66% !important;
      width: 12.22% !important;
      height: 20.72% !important;
      display: block !important;
      position: absolute !important;
      transform: none !important;
      padding: 0 !important; margin: 0 !important; gap: 0 !important;
      border: 0 !important; background: transparent !important;
      box-shadow: none !important; overflow: visible !important;
      pointer-events: none !important;
    }
    .ha-kona-sheet .ha-neque-loadout-row {
      position: absolute !important; display: flex !important;
      box-sizing: border-box !important; margin: 0 !important; padding: 0 !important;
      min-width: 0 !important; min-height: 0 !important;
      max-width: none !important; max-height: none !important;
      border: 0 !important; border-radius: 0 !important;
      background: transparent !important; box-shadow: none !important;
      overflow: hidden !important; pointer-events: auto !important;
      cursor: pointer !important; transform: none !important;
    }
    .ha-kona-sheet [data-ha-neque-row="arma"] {
      left: 0 !important; top: 0 !important;
      width: 56.50% !important; height: 44.45% !important;
    }
    .ha-kona-sheet [data-ha-neque-row="armadura"] {
      left: 37.85% !important; top: 51.11% !important;
      width: 62.15% !important; height: 48.89% !important;
    }
    .ha-kona-sheet .ha-neque-loadout-row.is-empty {
      border: 0 !important; background: transparent !important;
      box-shadow: none !important;
    }
    .ha-kona-sheet .ha-neque-loadout-icon {
      width: 100% !important; height: 100% !important;
      max-width: 100% !important; max-height: 100% !important;
      object-fit: contain !important; transform: none !important;
      pointer-events: none !important;
    }
  `;
  style.textContent += `
    /* 0.24.131 · KONA EXPERIMENTAL V2 — approved base A and v40 geometry.
       The official .ha-kona-sheet retains its approved plate and original positions. */
    .ha-kona-sheet.ha-kona-experimental-sheet {
      background-image: linear-gradient(rgba(255,248,233,.04), rgba(255,248,233,.04)),
        url("modules/meliaz-bridge/assets/hoja-kona-experimental-v2.webp") !important;
      background-position: center center !important;
      background-size: 100% 100% !important;
    }
    .ha-kona-sheet.ha-kona-experimental-sheet > .ha-equipo-items-grid {
      left: 0 !important; top: 0 !important; width: 100% !important; height: 100% !important;
      position: absolute !important; display: block !important; background: transparent !important;
      pointer-events: none !important;
    }
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-equipo-grid-cell {
      pointer-events: auto !important;
      background: transparent !important;
      border: 0 !important;
      border-radius: 50% !important;
    }
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-biomas-box {
      left: 52.25% !important; top: 58.0% !important;
      width: 18.65% !important; height: 19.47% !important;
      transform: none !important; overflow: visible !important;
      background: transparent !important; pointer-events: auto !important;
    }
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-biomas-list {
      position: relative !important; width: 100% !important; height: 100% !important;
      max-height: 100% !important; overflow: visible !important;
    }
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-biomas-row {
      position: absolute !important; min-height: 0 !important; max-height: none !important;
      display: flex !important; align-items: center !important; justify-content: center !important;
      cursor: pointer !important; overflow: hidden !important;
    }
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-biomas-icon {
      width: 100% !important; height: 100% !important; max-width: 100% !important;
      max-height: 100% !important; object-fit: contain !important;
    }
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-biomas-box.is-empty::after {
      content: "" !important;
    }

    /* 0.24.132 · Corrección candidata del desfase vertical general.
       Eleva 10 CSS px SOLO los campos/indicadores que no son drag & drop.
       Se usa la propiedad independiente translate para conservar los
       transforms locales ya aprobados. No tocar fondo, hitboxes ni datos.
       EXCLUIDOS deliberadamente: Cariños, Lenguas, Rituales, Reliquias,
       Instrumentos/Música, Arma/Armadura, Equipo y Territorio/Biomas. */
    .ha-kona-sheet.ha-kona-experimental-sheet :is(
      .ha-field-nombre, .ha-field-auspicio, .ha-field-cultura,
      .ha-field-oficio, .ha-field-kizuamun, .ha-field-gracia,
      .ha-select-auspicio-v2, .ha-select-oficio-v2,
      .ha-val-temple, .ha-val-sentir, .ha-val-onda,
      .ha-val-neque, .ha-val-picardia, .ha-val-newen, .ha-val-aguante,
      .ha-descendiente-marker, .ha-step-newen, .ha-step-aguante
    ) {
      translate: 0 -10px !important;
    }

    /* 0.24.133 · Ajustes finos a partir de captura Foundry al 100%.
       Manifestación: subir 5 px adicionales.
       Números de Capacidades: subir 5 px adicionales (neto -15 px).
       Stepper +/- Newen/Aguante: bajar 5 px respecto de 0.24.132 (neto -5 px).
       Los círculos Arraigo/Decadencia/Porte NO se recalibran aquí: requieren
       offsets independientes medidos contra el centro de cada aro grabado. */
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-manifest-button {
      translate: 0 5px !important;
    }
    .ha-kona-sheet.ha-kona-experimental-sheet :is(
      .ha-val-temple, .ha-val-sentir, .ha-val-onda,
      .ha-val-neque, .ha-val-picardia
    ) {
      translate: 0 -15px !important;
    }
    .ha-kona-sheet.ha-kona-experimental-sheet :is(
      .ha-step-newen, .ha-step-aguante
    ) {
      translate: 0 5px !important;
    }

    /* 0.24.134 · KONA V2 — calibración individual contra placa A 1448×1086.
       Estos nueve controles dejan de heredar el translate vertical general.
       Cada hitbox se centra sobre el centro del aro grabado correspondiente.
       No cambia el tamaño ni el mecanismo de interacción/persistencia. */
    .ha-kona-sheet.ha-kona-experimental-sheet :is(
      .ha-arraigo-1, .ha-arraigo-2, .ha-arraigo-3,
      .ha-decadencia-1, .ha-decadencia-2, .ha-decadencia-3,
      .ha-porte-1, .ha-porte-2, .ha-porte-3
    ) { translate: none !important; }

    .ha-kona-sheet.ha-kona-experimental-sheet .ha-arraigo-1 { left: 11.6431% !important; top: 58.9232% !important; }
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-arraigo-2 { left: 13.3834% !important; top: 64.7796% !important; }
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-arraigo-3 { left: 15.6210% !important; top: 71.0779% !important; }

    .ha-kona-sheet.ha-kona-experimental-sheet .ha-decadencia-1 { left: 84.2674% !important; top: 58.9232% !important; }
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-decadencia-2 { left: 82.4442% !important; top: 64.7796% !important; }
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-decadencia-3 { left: 80.3724% !important; top: 71.1884% !important; }

    .ha-kona-sheet.ha-kona-experimental-sheet .ha-porte-1 { left: 43.9530% !important; top: 51.7041% !important; }
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-porte-2 { left: 48.1796% !important; top: 51.8145% !important; }
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-porte-3 { left: 52.3232% !important; top: 51.8145% !important; }

    /* 0.24.135 · KONA V2 — ajuste fino de valores Newen/Aguante.
       Ambos números bajan 5 px y permanecen alineados verticalmente.
       Aguante avanza además 5 CSS px a la derecha.
       No mueve los steppers +/- ni modifica círculos, hitboxes o drag-and-drop. */
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-val-newen {
      translate: 0 5px !important;
    }
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-val-aguante {
      left: calc(50.2% + 5px) !important;
      translate: 0 5px !important;
    }

    /* 0.24.144 · Ajuste horizontal exclusivo de Newen (+5px).
       La posición se fija con top/left absolutos, no con translate.
       Se elimina el translate heredado -10px y se deja un neto -5px:
       visualmente baja 5px respecto de la posición que heredaba 0.24.134.
       Aguante conserva además +5px horizontal. Steppers intactos. */
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-val-newen {
      top: calc(41.72% - 5px) !important;
      left: calc(42.0% + 5px) !important;
      translate: none !important;
    }
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-val-aguante {
      top: calc(41.72% - 5px) !important;
      left: calc(50.2% + 5px) !important;
      translate: none !important;
    }
    /* 0.24.144 · KONA V2 — composición radial inferior.
       Manifestación se separa del marcador Descendiente.
       Arma/Armadura gana superficie hacia arriba y derecha.
       Lenguas sigue la curva radial INTERIOR en cuatro campos escalonados.
       Territorio conserva los cuatro centros ya calibrados sobre la curva EXTERIOR.
       La hoja oficial y sus coordenadas permanecen intactas. */
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-manifest-button {
      top: 27.8% !important;
      translate: 0 0 !important;
    }
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-neque-loadout {
      left: 23.0% !important;
      top: 57.4% !important;
      width: 13.5% !important;
      height: 21.8% !important;
    }

    /* 0.24.147 · KONA V2 — geometría y capas saneadas.
       Lenguas: conservar la diagonal aprobada más reciente.
       Territorio: volver a v40 sin translateX; el contenedor no invade
       la capa interactiva de Lenguas. Los items mantienen sus centros SVG.
       Una única regla experimental gobierna cada grupo. */
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-lengua-1 {
      left: 43.0% !important; top: 70.5% !important;
      width: 7.8% !important; height: 2.25% !important;
      z-index: 42 !important;
    }
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-lengua-2 {
      left: 46.1% !important; top: 67.0% !important;
      width: 7.8% !important; height: 2.25% !important;
      z-index: 42 !important;
    }
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-lengua-3 {
      left: 49.2% !important; top: 63.5% !important;
      width: 7.8% !important; height: 2.25% !important;
      z-index: 42 !important;
    }
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-lengua-4 {
      left: 52.3% !important; top: 60.0% !important;
      width: 7.8% !important; height: 2.25% !important;
      z-index: 42 !important;
    }
    .ha-kona-sheet.ha-kona-experimental-sheet :is(
      .ha-lengua-1, .ha-lengua-2, .ha-lengua-3, .ha-lengua-4
    ) {
      overflow: visible !important;
    }
    .ha-kona-sheet.ha-kona-experimental-sheet :is(
      .ha-lengua-1 input, .ha-lengua-2 input,
      .ha-lengua-3 input, .ha-lengua-4 input
    ) {
      width: 100% !important;
      height: 100% !important;
      min-width: 0 !important;
      padding: 0 2px !important;
      text-align: center !important;
      box-sizing: border-box !important;
      background: rgba(239,214,164,.18) !important;
      border: 1px solid rgba(85,39,27,.22) !important;
      border-radius: 3px !important;
    }

    /* Territorio: contenedor v40 original, sin traslación horizontal.
       Capa 18: queda debajo de Lenguas (42); el área receptora sigue activa
       en la superficie libre y cada item conserva su hitbox independiente. */
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-biomas-box {
      left: 52.25% !important;
      top: 58.0% !important;
      width: 18.65% !important;
      height: 19.47% !important;
      transform: none !important;
      translate: none !important;
      overflow: visible !important;
      z-index: 18 !important;
      pointer-events: auto !important;
    }
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-biomas-list {
      position: relative !important;
      width: 100% !important;
      height: 100% !important;
      max-height: 100% !important;
      overflow: visible !important;
      pointer-events: none !important;
    }
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-biomas-row {
      z-index: 52 !important;
      pointer-events: auto !important;
      transform: none !important;
    }
  `;

  /* 0.24.144 · Auspicio: elevar el recuadro completo 5px, sin cambiar dimensiones. */
  style.textContent += `
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-field-auspicio {
      top: calc(26.5% - 5px) !important;
    }
  `;

  /* 0.24.147 · Identidad: Nombre y Auspicio igualan exactamente la escala final de Cultura.
     Auspicio se alinea explícitamente con el borde superior del menú Oficio (26.0%). */
  style.textContent += `
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-field-nombre input,
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-field-auspicio input {
      font-size: clamp(11px, 1.05vw, 16px) !important;
    }
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-field-auspicio {
      top: 26.0% !important;
    }
  `;

  /* 0.24.148 · KONA V2 — cierre de auditoría geométrica.
     Los campos de Lenguas y el receptor de Territorio conservan coordenadas
     independientes. No se cambia el SVG ni se recalculan los centros v40.
     Se fija aquí una única autoridad final para la capa experimental. */
  style.textContent += `
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-field-auspicio {
      top: 24.0% !important;
    }

    .ha-kona-sheet.ha-kona-experimental-sheet :is(
      .ha-lengua-1, .ha-lengua-2, .ha-lengua-3, .ha-lengua-4
    ) {
      position: absolute !important;
      z-index: 42 !important;
      overflow: visible !important;
    }
    /* 0.24.160 · Lenguas sobre la curva interior del sector Picardía.
       Cuatro campos iguales, diagonal regular hacia el arco superior-derecho.
       Territorio conserva sus receptores exteriores de 0.24.159. */
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-lengua-1 {
      left: 50.0% !important; top: 71.5% !important;
      width: 8.5% !important; height: 2.25% !important;
    }
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-lengua-2 {
      left: 53.2% !important; top: 68.0% !important;
      width: 8.5% !important; height: 2.25% !important;
    }
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-lengua-3 {
      left: 56.4% !important; top: 64.5% !important;
      width: 8.5% !important; height: 2.25% !important;
    }
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-lengua-4 {
      left: 59.6% !important; top: 61.0% !important;
      width: 8.5% !important; height: 2.25% !important;
    }

    .ha-kona-sheet.ha-kona-experimental-sheet .ha-biomas-box {
      left: 52.25% !important; top: 58.0% !important;
      width: 18.65% !important; height: 19.47% !important;
      position: absolute !important;
      transform: none !important; translate: none !important;
      overflow: visible !important; z-index: 18 !important;
      pointer-events: auto !important;
    }
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-biomas-list {
      position: relative !important;
      width: 100% !important; height: 100% !important;
      max-height: 100% !important; overflow: visible !important;
      pointer-events: none !important;
    }
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-biomas-row {
      z-index: 52 !important;
      pointer-events: auto !important;
      transform: none !important;
      cursor: pointer !important;
    }
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-biomas-icon {
      width: 75% !important;
      height: 75% !important;
      max-width: 75% !important;
      max-height: 75% !important;
      flex: 0 0 75% !important;
      object-fit: contain !important;
      pointer-events: none !important;
    }

    .ha-kona-sheet.ha-kona-experimental-sheet .ha-equipo-grid-cell {
      transform: none !important;
    }

    /* 0.24.153 · corrección de superposición Manifestación/Descendiente.
       La regla heredada de 0.24.133 aplicaba translateY(-10px) al marcador
       Descendiente; por eso cambiar sólo top no lo bajaba y ambos botones
       terminaban montados. Se anula explícitamente el translate en ambos.
       Los dos se sitúan más abajo, manteniendo borde izquierdo y ancho. */
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-manifest-button {
      left: 5.6% !important;
      width: 11.2% !important;
      top: 33.0% !important;
      translate: none !important;
    }
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-descendiente-marker {
      left: 5.6% !important;
      width: 11.2% !important;
      top: 37.0% !important;
      translate: none !important;
    }

    /* 0.24.157 · Ajuste fino Aguante: valor y steppers +5px al Este. */
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-val-aguante {
      left: calc(50.2% + 10px) !important;
    }
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-step-aguante {
      left: calc(56.85% + 5px) !important;
    }

    /* 0.24.159 · Autoridad única de Territorio.
       Los cuatro slots ocupan la curva radial EXTERIOR de la placa 1448×1086.
       Lenguas conserva su diagonal interior; no se desplaza ni se reescribe.
       Hitbox circular 72u; icono visible 54u. Sin transformaciones heredadas. */
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-biomas-box {
      left: 55.8011% !important;
      top: 57.1823% !important;
      width: 22.3066% !important;
      height: 30.8471% !important;
      position: absolute !important;
      transform: none !important;
      translate: none !important;
      overflow: visible !important;
      z-index: 18 !important;
      pointer-events: auto !important;
      background: transparent !important;
    }
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-biomas-list {
      position: relative !important;
      width: 100% !important;
      height: 100% !important;
      max-height: 100% !important;
      overflow: visible !important;
      pointer-events: none !important;
    }
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-biomas-row {
      z-index: 18 !important;
      pointer-events: auto !important;
      transform: none !important;
      cursor: pointer !important;
      border-radius: 50% !important;
    }
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-biomas-icon {
      width: 75% !important;
      height: 75% !important;
      max-width: 75% !important;
      max-height: 75% !important;
      flex: 0 0 75% !important;
      object-fit: contain !important;
      pointer-events: none !important;
    }

    /* 0.24.161 · Ajustes solicitados tras revisar el preview 0.24.160.
       Lenguas: +20px Este, sin alterar ancho, altura ni diagonal.
       Aguante: +10px Este adicional en valor y controles +/−.
       Arma y Armadura: pictogramas +25%; hitboxes y posiciones de drag intactas. */
    /* 0.24.162 · Lenguas: +15px adicionales; desplazamiento acumulado +35px. */
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-lengua-1 { left: calc(50.0% + 35px) !important; }
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-lengua-2 { left: calc(53.2% + 35px) !important; }
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-lengua-3 { left: calc(56.4% + 35px) !important; }
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-lengua-4 { left: calc(59.6% + 35px) !important; }

    .ha-kona-sheet.ha-kona-experimental-sheet .ha-val-aguante {
      left: calc(50.2% + 20px) !important;
    }
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-step-aguante {
      left: calc(56.85% + 15px) !important;
    }

    .ha-kona-sheet.ha-kona-experimental-sheet .ha-neque-loadout-row {
      overflow: visible !important;
    }
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-neque-loadout-icon {
      transform: scale(1.25) !important;
      transform-origin: center center !important;
    }

    /* 0.24.163 · Ajuste geométrico medido sobre placa 1448×1086.
       Newen y Aguante: valores y controles +/−, 5px abajo.
       Lenguas: cuatro campos +5px Este y -5px Norte.
       No modifica tamaños, receptores de Territorio ni lógica D&D. */
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-val-newen {
      top: 41.72% !important;
      left: calc(42.0% + 5px) !important;
      translate: none !important;
    }
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-val-aguante {
      top: 41.72% !important;
      left: calc(50.2% + 20px) !important;
      translate: none !important;
    }
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-step-newen {
      top: calc(41.87% + 10px) !important;
      left: 39.65% !important;
      translate: none !important;
    }
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-step-aguante {
      top: calc(41.87% + 10px) !important;
      left: calc(56.85% + 15px) !important;
      translate: none !important;
    }
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-lengua-1 {
      left: calc(50.0% + 40px) !important;
      top: calc(71.5% - 5px) !important;
    }
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-lengua-2 {
      left: calc(53.2% + 40px) !important;
      top: calc(68.0% - 5px) !important;
    }
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-lengua-3 {
      left: calc(56.4% + 40px) !important;
      top: calc(64.5% - 5px) !important;
    }
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-lengua-4 {
      left: calc(59.6% + 40px) !important;
      top: calc(61.0% - 5px) !important;
    }
  `;


  /* 0.24.164 · Biomas +15% anclados abajo/derecha; instrumentos +30% anclados a la derecha.
     No cambia las hitboxes ni los centros de drag & drop. */
  style.textContent += `
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-biomas-row {
      justify-content: flex-end !important;
      align-items: flex-end !important;
    }
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-biomas-icon {
      width: 86.25% !important;
      height: 86.25% !important;
      max-width: 86.25% !important;
      max-height: 86.25% !important;
      flex: 0 0 86.25% !important;
      margin: 0 !important;
      object-fit: contain !important;
      transform: none !important;
    }
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-sentir-instrumento-icon {
      transform: scale(1.495) !important;
      transform-origin: right center !important;
    }

    /* 0.24.166 · Limpieza visual Lenguas; ampliación Territorio/Instrumentos;
       normalización tipográfica y vertical de los selectores Auspicio/Oficio. */

    .ha-kona-sheet.ha-kona-experimental-sheet :is(
      .ha-lengua-1, .ha-lengua-2, .ha-lengua-3, .ha-lengua-4
    ) {
      background: transparent !important;
      border: 0 !important;
      box-shadow: none !important;
      outline: 0 !important;
      border-radius: 0 !important;
    }
    .ha-kona-sheet.ha-kona-experimental-sheet :is(
      .ha-lengua-1 input, .ha-lengua-2 input,
      .ha-lengua-3 input, .ha-lengua-4 input
    ) {
      background: transparent !important;
      border: 0 !important;
      box-shadow: none !important;
      outline: 0 !important;
      border-radius: 0 !important;
    }
    .ha-kona-sheet.ha-kona-experimental-sheet :is(
      .ha-lengua-1 input, .ha-lengua-2 input,
      .ha-lengua-3 input, .ha-lengua-4 input
    ):focus {
      background: transparent !important;
      border: 0 !important;
      box-shadow: none !important;
      outline: 0 !important;
    }

    /* Territorio: 15% adicional sobre el tamaño visual anterior (86,25%). */
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-biomas-row {
      justify-content: flex-end !important;
      align-items: flex-end !important;
      overflow: visible !important;
    }
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-biomas-icon {
      width: 99.1875% !important;
      height: 99.1875% !important;
      max-width: 99.1875% !important;
      max-height: 99.1875% !important;
      flex: 0 0 99.1875% !important;
      margin: 0 !important;
      object-fit: contain !important;
      transform: none !important;
      transform-origin: right bottom !important;
    }

    /* Instrumentos: +15% adicional sobre el 130% anterior; borde derecho fijo. */
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-sentir-instrumento-icon {
      transform: scale(1.495) !important;
      transform-origin: right center !important;
    }

    /* Igualar menú final de Oficio al de Auspicio: fuente, tamaño, línea y eje vertical. */
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-select-auspicio-v2,
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-select-oficio-v2 {
      box-sizing: border-box !important;
      height: 3.8% !important;
      min-height: 0 !important;
      padding-top: 0 !important;
      padding-bottom: 0 !important;
      font-family: inherit !important;
      font-size: clamp(14px, 1.45vw, 22px) !important;
      font-weight: 400 !important;
      line-height: normal !important;
      vertical-align: middle !important;
      display: block !important;
    }
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-select-oficio-v2 {
      left: 80.5% !important;
      top: 26.0% !important;
      width: 14.2% !important;
      height: 3.8% !important;
      box-sizing: border-box !important;
      font-family: Georgia, "Times New Roman", serif !important;
      font-size: clamp(13px, 1.28vw, 20px) !important;
      font-weight: 400 !important;
      line-height: normal !important;
      display: block !important;
      text-align: left !important;
      text-align-last: left !important;
      padding: 0 .08em 0 .20em !important;
    }
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-select-auspicio-v2 {
      text-align: left !important;
      text-align-last: left !important;
    }

    /* 0.24.172 · Recuperación del menú Oficio.
       Altura fija: evita que CSB colapse el select por resolver height:%
       contra un contenedor auto. Mantiene posición y ancho ya calibrados. */
    .ha-kona-sheet.ha-kona-experimental-sheet select.ha-select-oficio-v2 {
      position: absolute !important;
      left: 80.5% !important;
      top: 26.0% !important;
      width: 14.2% !important;
      height: 30px !important;
      min-height: 30px !important;
      max-height: 30px !important;
      box-sizing: border-box !important;
      padding: 1px 22px 1px .20em !important;
      margin: 0 !important;
      font-family: Georgia, "Times New Roman", serif !important;
      font-size: clamp(14px, 1.05vw, 17px) !important;
      font-weight: 400 !important;
      line-height: 26px !important;
      text-align: left !important;
      text-align-last: left !important;
      white-space: nowrap !important;
      appearance: auto !important;
      -webkit-appearance: menulist !important;
      overflow: visible !important;
      opacity: 1 !important;
      visibility: visible !important;
    }
    .ha-kona-sheet.ha-kona-experimental-sheet select.ha-select-oficio-v2[hidden] {
      display: none !important;
      visibility: hidden !important;
    }
  `;
  /* 0.24.173 · ampliación acumulativa de iconos y retorno de Aguante.
     Sólo se escala la imagen; los receptores de drag & drop no cambian tamaño. */
  style.textContent += `
    /* Territorio: +15% real, anclado abajo/derecha; hitboxes intactas. */
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-biomas-box,
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-biomas-list {
      overflow: visible !important;
    }
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-biomas-row {
      overflow: visible !important;
      justify-content: flex-end !important;
      align-items: flex-end !important;
      position: relative !important;
    }
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-biomas-icon {
      width: 99.1875% !important;
      height: 99.1875% !important;
      max-width: 99.1875% !important;
      max-height: 99.1875% !important;
      flex: 0 0 99.1875% !important;
      margin: 0 !important;
      transform: none !important;
      object-fit: contain !important;
      transform-origin: right bottom !important;
    }

    /* Armas y Defensas: +30% sobre el aumento previo del 25% (escala 1,625).
       Anclaje inferior derecho: el crecimiento avanza hacia arriba/izquierda. */
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-neque-loadout,
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-neque-loadout-row {
      overflow: visible !important;
    }
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-neque-loadout-icon {
      transform: scale(1.625) !important;
      transform-origin: right bottom !important;
      pointer-events: none !important;
    }

    /* Instrumentos: +30% adicional sobre la escala vigente 1,495. */
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-sentir-instrumentos-box,
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-sentir-instrumentos-list {
      overflow: visible !important;
    }
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-sentir-instrumento-row {
      overflow: visible !important;
      position: relative !important;
    }
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-sentir-instrumento-icon {
      transform: scale(1.9435) !important;
      transform-origin: right center !important;
      pointer-events: none !important;
    }

    /* 0.24.182 · Arma y Defensa: 15 px adicionales al Este + 5 px al Sur.
       La propiedad translate se suma a la geometría existente sin cambiar
       el tamaño de los receptores ni los iconos internos. */
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-neque-loadout {
      translate: 15px 5px !important;
    }

    /* Aguante: valor y controles −5px al Oeste; Newen no se mueve. */
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-val-aguante {
      left: calc(50.2% + 15px) !important;
    }
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-step-aguante {
      left: calc(56.85% + 10px) !important;
    }
  `;

  /* 0.24.175 · Porte I — calibración fina sobre su aro soporte.
     La captura Foundry muestra el centro del control I 1 px por encima
     de los aros II/III. Se corrige sólo su posición vertical.
     El indicador seleccionado aumenta de 56% a 60% del slot: el diámetro
     resultante (incluida la sombra de 2px) ocupa el aro sin rebasarlo.
     No cambia el tamaño del receptor ni la posición de Porte II/III. */
  style.textContent += `
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-porte-1 {
      top: calc(51.7041% + 1px) !important;
    }
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-porte-1:has(input[type="radio"]:checked)::before {
      left: 50% !important;
      top: 50% !important;
      width: 60% !important;
      transform: translate(-50%, -50%) !important;
    }
  `;

  /* 0.24.181 · Add controls are a naked, subtle cross only.
     No tile, frame, fill, outline, dotted stroke or shadow; color changes on hover. */
  style.textContent += `
    .ha-kona-sheet :is(.ha-kona-add-item, .ha-equipo-grid-cell[data-ha-kona-add="equipo"], .ha-neque-add-button) {
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      appearance: none !important;
      -webkit-appearance: none !important;
      padding: 0 !important;
      margin: 0 !important;
      border: 0 !important;
      border-radius: 0 !important;
      outline: 0 !important;
      background: transparent !important;
      box-shadow: none !important;
      color: rgba(88,65,48,.52) !important;
      font: 400 clamp(22px, 2.25vw, 31px)/1 Georgia, "Times New Roman", serif !important;
      text-shadow: none !important;
      opacity: .78 !important;
      cursor: pointer !important;
      pointer-events: auto !important;
    }
    .ha-kona-sheet :is(.ha-kona-add-item, .ha-equipo-grid-cell[data-ha-kona-add="equipo"], .ha-neque-add-button):hover,
    .ha-kona-sheet :is(.ha-kona-add-item, .ha-equipo-grid-cell[data-ha-kona-add="equipo"], .ha-neque-add-button):focus-visible {
      color: #bd6b32 !important;
      opacity: 1 !important;
      border: 0 !important;
      outline: 0 !important;
      background: transparent !important;
      box-shadow: none !important;
      text-shadow: none !important;
    }
    .ha-kona-sheet .ha-biomas-row.ha-kona-add-item {
      position: absolute !important;
      z-index: 4 !important;
      font-size: clamp(22px, 2.25vw, 31px) !important;
    }
    .ha-kona-sheet .ha-equipo-grid-cell[data-ha-kona-add="equipo"] .ha-equipo-grid-empty {
      display: block !important;
      color: rgba(88,65,48,.52) !important;
      font: 400 clamp(22px, 2.25vw, 31px)/1 Georgia, "Times New Roman", serif !important;
      opacity: .78 !important;
      text-shadow: none !important;
    }
    .ha-kona-sheet .ha-equipo-grid-cell[data-ha-kona-add="equipo"]:hover .ha-equipo-grid-empty,
    .ha-kona-sheet .ha-equipo-grid-cell[data-ha-kona-add="equipo"]:focus-visible .ha-equipo-grid-empty {
      color: #bd6b32 !important;
      opacity: 1 !important;
    }
    .ha-kona-sheet .ha-neque-add-button {
      position: absolute !important;
      inset: 0 !important;
      z-index: 8 !important;
      width: 100% !important;
      height: 100% !important;
    }
    .meliaz-kona-picker .meliaz-kona-picker-result:hover,
    .meliaz-territorio-picker :is(.meliaz-territorio-folder, .meliaz-kona-picker-result, .meliaz-territorio-crumb):hover { filter: brightness(.96); }
  `;
  /* 0.24.180 · Keep Bridge hitboxes above CSB's late-painted form layer.
     Only stacking order changes; slot coordinates and hitbox dimensions remain intact. */
  style.textContent += `
    .ha-kona-sheet.ha-kona-experimental-sheet > :is(
      .ha-equipo-items-grid, .ha-biomas-box, .ha-sentir-instrumentos-box,
      .ha-ritual-items-area, .ha-reliquia-items-area, .ha-neque-loadout,
      .ha-mascota-portrait, .ha-step-newen, .ha-step-aguante,
      .ha-cap-lock, .ha-descendiente-marker
    ) {
      z-index: 120 !important;
    }
    .ha-kona-sheet.ha-kona-experimental-sheet :is(
      .ha-equipo-grid-cell, .ha-biomas-row, .ha-sentir-instrumento-row,
      .ha-ritual-item-row, .ha-reliquia-icon-slot, .ha-neque-loadout-row,
      .ha-kona-add-item
    ) {
      pointer-events: auto !important;
    }
  `;
  /* 0.24.192 · Escala visual solicitada: Rituales +30%, Territorio +20%.
     Las imágenes crecen dentro de sus slots; las hitboxes y coordenadas de drop
     permanecen intactas. */
  style.textContent += `
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-ritual-items-grid,
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-ritual-item-row {
      overflow: visible !important;
    }
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-ritual-item-icon {
      transform: scale(1.3) !important;
      transform-origin: center center !important;
    }
    .ha-kona-sheet.ha-kona-experimental-sheet .ha-biomas-icon {
      width: 119.025% !important;
      height: 119.025% !important;
      max-width: 119.025% !important;
      max-height: 119.025% !important;
      flex: 0 0 119.025% !important;
      transform: none !important;
      transform-origin: right bottom !important;
    }
  `;
  document.head.appendChild(style);
});
