import FetchApi from "../client.js";
import { config } from "../config/config.js";

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

/**
 * Build query string for explore endpoints.
 * @param {{ search?: string, country?: string, page?: number, limit?: number }} params
 * @param {boolean} includeCountry - If false, omit country param (e.g. for government orgs)
 */
function buildQuery(params, includeCountry = true) {
  const { search = "", country = "", page = 1, limit = DEFAULT_LIMIT } = params;
  const limitClamped = Math.min(Math.max(limit, 1), MAX_LIMIT);
  const q = new URLSearchParams();
  if (search) q.set("search", search);
  if (includeCountry && country) q.set("country", country);
  q.set("page", String(page));
  q.set("limit", String(limitClamped));
  return q.toString();
}

/**
 * GET /api/explore/esps — List ESPs (Education Service Providers). Public, no auth.
 * @returns {Promise<{ success: boolean, data: { items: any[], total: number, currentPage: number, totalPages: number, limit: number, hasMore: boolean } }>}
 */
export async function getExploreEsps(params = {}) {
  const query = buildQuery(params, true);
  return FetchApi.fetch(`${config.api}/api/explore/esps?${query}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * GET /api/explore/ei — List EI (Education Institutions = HEI). Public, no auth.
 * @returns {Promise<{ success: boolean, data: { items: any[], total: number, currentPage: number, totalPages: number, limit: number, hasMore: boolean } }>}
 */
export async function getExploreEi(params = {}) {
  const query = buildQuery(params, true);
  return FetchApi.fetch(`${config.api}/api/explore/ei?${query}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * GET /api/explore/government-organizations — List government organizations. Public, no auth.
 * Country filter is not applied for this endpoint.
 * @returns {Promise<{ success: boolean, data: { items: any[], total: number, currentPage: number, totalPages: number, limit: number, hasMore: boolean } }>}
 */
export async function getExploreGovernmentOrganizations(params = {}) {
  const query = buildQuery({ ...params, country: "" }, false);
  return FetchApi.fetch(`${config.api}/api/explore/government-organizations?${query}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
}
