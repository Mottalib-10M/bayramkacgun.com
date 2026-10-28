/**
 * Trousse de rédaction : tout chiffre et toute date écrits dans une page viennent d'ici, jamais tapés à la main.
 *   K.P                         paramètres datés (params-2026.json)
 *   K.bayram, K.ramazan, K.tatiller, K.yilOzeti …   bayramlar ve resmi tatiller (engine/takvim.ts)
 *   K.optimize, K.kopruler, K.bayramTatili …          köprü ve izin (engine/izin.ts)
 *   K.vakit, K.hhmm, K.IL, K.imsakiye …               imsak ve iftar (engine/vakit.ts, engine/iller.ts)
 *   K.tool(kind, lang, args, valeurs)  lance un simulateur de tool-specs.ts et rend sa carte de résultat
 */
import P from '../data/params-2026.json';
import * as T from './engine/takvim';
import * as I from './engine/izin';
import * as V from './engine/vakit';
import * as IL from './engine/iller';
import { runTool } from './tool-specs';
import { LAST_UPDATED } from '../data/site-config';

export const KIT = { P, ...T, ...I, ...V, ...IL, tool: runTool, OKUMA: LAST_UPDATED };
export type Kit = typeof KIT;
