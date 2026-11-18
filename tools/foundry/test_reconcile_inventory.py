import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).with_name("reconcile-inventory.py")

class ReconcileInventoryTests(unittest.TestCase):
    def run_tool(self, tmp: Path):
        inventory = tmp / "inventory.json"
        sources = tmp / "sources"
        sources.mkdir()
        out = tmp / "report.json"
        payload = {
            "exportType": "test",
            "documents": [
                {"documentType": "Item", "sourceScope": "world-compendium",
                 "sourcePack": "world.test", "uuid": "Compendium.test.Item.same",
                 "documentId": "same", "name": "Same", "itemType": "equippableItem",
                 "document": {"_id": "same", "name": "Same", "system": {"value": 1},
                              "_stats": {"modifiedTime": 1}, "folder": "old", "sort": 1}},
                {"documentType": "Item", "sourceScope": "world-compendium",
                 "sourcePack": "world.test", "uuid": "Compendium.test.Item.changed",
                 "documentId": "changed", "name": "Changed", "itemType": "equippableItem",
                 "document": {"_id": "changed", "name": "Changed", "system": {"value": 1}}},
                {"documentType": "Item", "sourceScope": "world-compendium",
                 "sourcePack": "world.test", "uuid": "Compendium.test.Item.name",
                 "documentId": "name-old", "name": "Twin Name", "itemType": "equippableItem",
                 "document": {"_id": "name-old", "name": "Twin Name"}},
            ]
        }
        inventory.write_text(json.dumps(payload), encoding="utf-8")
        (sources / "same.json").write_text(json.dumps(
            {"_id": "same", "name": "Same", "system": {"value": 1},
             "_stats": {"modifiedTime": 2}, "folder": "new", "sort": 9}), encoding="utf-8")
        (sources / "changed.json").write_text(json.dumps(
            {"_id": "changed", "name": "Changed", "system": {"value": 2}}), encoding="utf-8")
        (sources / "twin.json").write_text(json.dumps(
            {"_id": "name-new", "name": "Twin Name"}), encoding="utf-8")
        proc = subprocess.run(
            [sys.executable, str(SCRIPT), "--inventory", str(inventory),
             "--source-root", str(sources), "--out", str(out)],
            check=True, capture_output=True, text=True)
        return json.loads(out.read_text(encoding="utf-8"))

    def test_classifies_without_mutating(self):
        with tempfile.TemporaryDirectory() as directory:
            report = self.run_tool(Path(directory))
            statuses = {x["documentId"]: x["status"] for x in report["idMatches"]}
            self.assertEqual(statuses["same"], "METADATA_ONLY")
            self.assertEqual(statuses["changed"], "CONTENT_DIFFERENCE")
            self.assertEqual(len(report["nameOnlyCandidates"]), 1)
            self.assertEqual(report["nameOnlyCandidates"][0]["status"], "NAME_ONLY_REVIEW_REQUIRED")
            self.assertEqual(report["summary"]["exportOnlyRecords"], 1)
            self.assertEqual(report["summary"]["sourceOnlyDocuments"], 1)

if __name__ == "__main__":
    unittest.main()
