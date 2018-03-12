import axios from "axios";
import * as sharedstreetsPbf from "sharedstreets-pbf";

export type Tile = number[];
export type Layer = "geometry" | "intersection" | "metadata" | "reference";
export type Output = "json" | "pbf";

/**
 * Download Tile
 *
 * @param {Array<number>} tile Tile [x, y, z]
 * @param {string} layer Layer (geometry|intersection|metadata|reference)
 * @param {Object} [options={}] Optional parameter
 * @param {string} [options.output="pbf"] Output (json|pbf)
 * @returns {Promise<Buffer>} PBF Buffer
 */
export function downloadTile(tile: Tile, layer: Layer, options: {
  output?: Output,
} = {}) {
  // Default parameters
  options.output = options.output || "pbf";
  const [x, y, z] = tile;
  const url = `https://tiles.sharedstreets.io/${z}-${x}-${y}.${layer}.pbf`;

  // Perform HTTP connection to SharedStreets API Server
  return axios.get(url).then((response) => {
    const data = response.data;
    // Handle outputs in JSON
    if (options.output === "json") {
      switch (layer) {
      case "geometry": return sharedstreetsPbf.geometry(data);
      case "intersection": return sharedstreetsPbf.intersection(data);
      case "metadata": return sharedstreetsPbf.metadata(data);
      case "reference": return sharedstreetsPbf.reference(data);
      default: throw new Error("invalid layer");
      }
    }
    // Data in PBF
    return data;
  });
}
