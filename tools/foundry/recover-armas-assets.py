#!/usr/bin/env python3
"""Hiperaustralis: recover original Armas WebP from verified 0.4.75 backup.

No writes to GitHub, Foundry, source JSON, or module/ by itself.
Requires --stage DIR to materialize binaries in an isolated output directory.
"""
import argparse
import hashlib
import json
import sys
import zipfile
from pathlib import Path

EXPECTED_BACKUP_SHA256 = 'c195fd0caf440ab3599a05780c0a7fbc7ebea9311ff85a89ac493f27f04f645e'
OLD_PREFIX = 'modules/hiperaustralis-rituales/assets/armas/'
ZIP_PREFIX = 'hiperaustralis-rituales/assets/armas/'
NEW_PREFIX = 'modules/hiperaustralis-compendios-prototype/assets/armas/'

def sha(data):
    return hashlib.sha256(data).hexdigest()

def fail(msg):
    raise ValueError(msg)

def audit(archive: Path, manifest: Path, stage: Path | None = None):
    if not archive.is_file() or not manifest.is_file():
        fail('Archivo ZIP o manifiesto GitHub ausente; no reconstruir por nombre')
    source_sha = sha(archive.read_bytes())
    if source_sha != EXPECTED_BACKUP_SHA256:
        fail('ZIP no coincide con el SHA-256 histórico: ' + source_sha)
    rules = json.loads(manifest.read_text(encoding='utf-8'))
    entries = rules.get('items')
    if rules.get('count') != 20 or not isinstance(entries, list) or len(entries) != 20:
        fail('El manifiesto de GitHub no contiene los 20 Items esperados')
    report = {
        'schemaVersion': 1, 'status': 'VALIDATED',
        'archiveSha256': source_sha, 'archiveBytes': archive.stat().st_size,
        'sourceManifest': 'manifests/armas-source-manifest.json',
        'sourceScope': 'legacy 0.4.75 ZIP, internal module.json 0.4.74',
        'destination': NEW_PREFIX, 'items': [], 'count': 20,
        'note': 'Asset-only recovery; Foundry Item IDs and payloads unchanged'
    }
    with zipfile.ZipFile(archive) as z:
        bad = z.testzip()
        if bad: fail('ZIP CRC inválido: ' + bad)
        names = z.namelist()
        if len(names) != len(set(names)):
            fail('ZIP contiene rutas duplicadas')
        from_zip = {n for n in names if n.startswith(ZIP_PREFIX) and not n.endswith('/')}
        expected_zip = set()
        seen_ids = set()
        for item in entries:
            ident = item.get('_id')
            img = item.get('img', '')
            if not ident or ident in seen_ids:
                fail('ID no único del manifiesto: ' + str(ident))
            seen_ids.add(ident)
            if not img.startswith(OLD_PREFIX):
                fail('Ruta histórica inesperada: ' + img)
            fn = img[len(OLD_PREFIX):]
            if '/' in fn or '\\' in fn or '..' in fn or not fn.endswith('.webp'):
                fail('Nombre de archivo inseguro: ' + fn)
            original_name = ZIP_PREFIX + fn
            expected_zip.add(original_name)
            if original_name not in names:
                fail('No existe el asset original: ' + original_name)
            binary = z.read(original_name)
            if binary[:4] != b'RIFF' or binary[8:12] != b'WEBP':
                fail('Cabecera WebP inválida: ' + original_name)
            report['items'].append({
                'itemId': ident, 'name': item['name'],
                'oldImg': img, 'newImg': NEW_PREFIX+fn,
                'originalZipEntry': original_name,
                'bytes': len(binary), 'sha256': sha(binary)
            })
        if expected_zip != from_zip:
            fail('Discrepancia en inventario de Armas del ZIP; adicionales: '+str(sorted(from_zip-expected_zip)))
        if stage is not None:
            if stage.resolve() == Path('.').resolve():
                fail('Destino no puede ser el repo raíz')
            for row in report['items']:
                target = stage / 'module' / 'assets' / 'armas' / row['oldImg'].split('/')[-1]
                if target.exists() and sha(target.read_bytes()) != row['sha256']:
                    fail('Asset existente divergente en destino: ' + str(target))
            for row in report['items']:
                target = stage / 'module' / 'assets' / 'armas' / row['oldImg'].split('/')[-1]
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_bytes(z.read(row['originalZipEntry']))
            report['status'] = 'STAGED_BINARIES_VERIFIED'
            report_file = stage / 'manifests' / 'armas-assets-recovered.json'
            report_file.parent.mkdir(parents=True, exist_ok=True)
            report_file.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    return report

def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('--archive',required=True,type=Path)
    p.add_argument('--manifest',required=True,type=Path)
    p.add_argument('--stage',type=Path,default=None,help='Isolated staging folder; omit for read-only dry-run')
    a=p.parse_args()
    try:
        report=audit(a.archive,a.manifest,a.stage)
    except Exception as e:
        print('BLOCKED: '+str(e),file=sys.stderr)
        return 1
    print(json.dumps({'status':report['status'],'count':len(report['items']), 'bytes':sum(x['bytes'] for x in report['items']), 'archiveSha256':report['archiveSha256']},ensure_ascii=False))
    return 0

if __name__=='__main__':
    sys.exit(main())
