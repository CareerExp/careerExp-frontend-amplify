import FetchApi from "../client.js";
import { config } from "../config/config.js";
import { ACTING_AS_HEADER_NAME } from "../utility/getActingAsHeader.js";

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

/**
 * Build query string for explore endpoints.
 * @param {{ search?: string, country?: string, language?: string, specialization?: string, program?: string, page?: number, limit?: number }} params
 * @param {boolean} includeCountry - If false, omit country param (e.g. for government orgs)
 * @param {boolean} includeLanguage - If true, add language param (EI and ESP only)
 * @param {boolean} includeSpecialization - If true, add specialization param (ESP only)
 * @param {boolean} includeProgram - If true, add program param (EI/HEI only)
 */
function buildQuery(
  params,
  includeCountry = true,
  includeLanguage = false,
  includeSpecialization = false,
  includeProgram = false,
) {
  const {
    search = "",
    country = "",
    language = "",
    specialization = "",
    program = "",
    page = 1,
    limit = DEFAULT_LIMIT,
  } = params;
  const limitClamped = Math.min(Math.max(limit, 1), MAX_LIMIT);
  const q = new URLSearchParams();
  if (search) q.set("search", search);
  if (includeCountry && country) q.set("country", country);
  if (includeLanguage && language) q.set("language", language);
  if (includeSpecialization && specialization)
    q.set("specialization", specialization);
  if (includeProgram && program) q.set("program", program);
  q.set("page", String(page));
  q.set("limit", String(limitClamped));
  return q.toString();
}

/**
 * GET /api/explore/esps — List ESPs (Education Service Providers). Public, no auth.
 * @returns {Promise<{ success: boolean, data: { items: any[], total: number, currentPage: number, totalPages: number, limit: number, hasMore: boolean } }>}
 */
export async function getExploreEsps(params = {}) {
  const query = buildQuery(params, true, true, true);
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
  const query = buildQuery(params, true, true, false, true);
  return FetchApi.fetch(`${config.api}/api/explore/ei?${query}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * GET /api/explore/program-options — List program options for Partners page (public). No auth.
 * @returns {Promise<string[]>} Array of program name strings.
 */
export async function getHeiProgramOptions() {
  const res = await FetchApi.fetch(
    `${config.api}/api/explore/program-options`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    },
  );
  if (!res?.success) return [];
  const raw = res.data;
  if (Array.isArray(raw))
    return raw.filter((p) => typeof p === "string" && p.trim());
  if (raw && Array.isArray(raw.programs))
    return raw.programs.filter((p) => typeof p === "string" && p.trim());
  return [];
}

/**
 * GET /api/organization/profile/me/program-options — List program options for HEI dashboard (auth required).
 * Used in About us → Institute Info. Returns default + dynamic options.
 * Auth: Authorization: Bearer <token>; for admin acting as org, pass actingAsOrganizationId for X-Acting-As-Organization-Id.
 * @param {string} token — Access token (required).
 * @param {string|null|undefined} [actingAsOrganizationId] — When admin is in AME context, organization profile id.
 * @returns {Promise<string[]>} Array of program name strings.
 */
export async function getOrganizationProgramOptions(token, actingAsOrganizationId) {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  if (actingAsOrganizationId) {
    headers[ACTING_AS_HEADER_NAME] = actingAsOrganizationId;
  }
  const res = await FetchApi.fetch(
    `${config.api}/api/organization/profile/me/program-options`,
    {
      method: "GET",
      headers,
    },
  );
  if (!res?.success) return [];
  const raw = res.data;
  if (Array.isArray(raw))
    return raw.filter((p) => typeof p === "string" && p.trim());
  if (raw && Array.isArray(raw.programs))
    return raw.programs.filter((p) => typeof p === "string" && p.trim());
  return [];
}

/**
 * GET /api/explore/government-organizations — List government organizations. Public, no auth.
 * Country filter is not applied for this endpoint.
 * @returns {Promise<{ success: boolean, data: { items: any[], total: number, currentPage: number, totalPages: number, limit: number, hasMore: boolean } }>}
 */
export async function getExploreGovernmentOrganizations(params = {}) {
  const query = buildQuery({ ...params, country: "" }, false);
  return FetchApi.fetch(
    `${config.api}/api/explore/government-organizations?${query}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    },
  );
}
