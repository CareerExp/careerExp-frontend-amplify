/**
 * Returns the acting-as header when admin is managing an AME dashboard.
 * Use in org-scoped API thunks: merge with request headers when id is set.
 * @param {Function} getState - Redux getState
 * @returns {{ [key: string]: string }} Header object to spread into request headers, or {}
 */
export const ACTING_AS_HEADER_NAME = "X-Acting-As-Organization-Id";

export function getActingAsHeader(getState) {
  const state = getState();
  const id = state?.ameContext?.actingAsOrganizationId;
  if (!id) return {};
  return { [ACTING_AS_HEADER_NAME]: id };
}
