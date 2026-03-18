/**
 * Sub-admins (non–main-admin) on the admin dashboard who are disabled/inactive
 * must not access admin features. Main admin is never blocked by this check.
 */
export function isAdminSubAdminAccountDisabled(userData) {
  if (!userData || userData.activeDashboard !== "admin") return false;
  if (userData.isMainAdmin === true) return false;
  if (userData.enabled === false) return true;
  const status = String(userData.status || "").toLowerCase();
  return status === "inactive" || status === "disabled";
}
