import fs from "fs";
import path from "path";
import test from "tape";
import * as api from "./";
import { Layer } from "./";

const tile = [1186, 1466, 12];
const [x, y, z] = tile;
const layers: Layer[] = ["geometry", "intersection", "metadata", "reference"];

test("sharedstreets-api -- Download Tile", (t) => {
  layers.forEach((layer) => {
    // Download PBF
    api.downloadTile(tile, layer).then((pbf) => {
      const fileout = path.join(__dirname, "test", "out", `${z}-${x}-${y}.${layer}.pbf`);
      fs.writeFileSync(fileout, pbf);
      t.pass(layer);
    });
  });
  t.end();
});
