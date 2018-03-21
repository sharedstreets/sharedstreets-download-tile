import axios from "axios";
import * as sharedstreetsPbf from "sharedstreets-pbf";

export type Tile = number[];
export type Layer = "geometry" | "intersection" | "metadata" | "reference";
export type Output = "json" | "pbf";
export type Extensions = "pbf";
export type Protocols = "https" | "http";

/**
 * Download Tile
 *
 * @param {Array<number>} tile Tile [x, y, z]
 * @param {string} layer Layer (geometry|intersection|metadata|reference)
 * @param {Object} [options={}] Optional parameter
 * @param {string} [options.output="pbf"] Output (json|pbf)
 * @param {string} [options.protocol="https"] Protocol (https|http)
 * @param {string} [options.domain="tiles.sharedstreets.io"] Domain
 * @param {string} [options.extension="pbf"] Extension
 * @returns {Promise<Buffer>} PBF Buffer
 * @example
 * const tile = [1186, 1466, 12];
 * const layer = "geometry";
 *
 * sharedstreetsApi.downloadTile(tile, layer).then(data => {
 *   data // => PBF Buffer
 * })
 */
export function downloadTile(tile: Tile, layer: Layer, options: {
  output?: Output,
  protocol?: Protocols,
  domain?: string,
  extension?: Extensions,
} = {}) {
  // Default parameters
  const output = options.output || "pbf";
  const protocol = options.protocol || "https";
  const domain = options.domain || "tiles.sharedstreets.io";
  const extension = options.extension || "pbf";
  const [x, y, z] = tile;
  const url = `${protocol}://${domain}/${z}-${x}-${y}.${layer}.${extension}`;

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
