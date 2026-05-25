/**
 * Organization accounts blocked by admin (including rejected university claims)
 * have user.status === "blocked" while org profile status is stored as "suspended".
 */
export function isOrganizationAccountBlocked(userData, orgProfile) {
  if (!userData || userData.activeDashboard !== "organization") return false;
  const userStatus = userData.status;
  const orgStatus = orgProfile?.status ?? userData.status;
  return userStatus === "blocked" || orgStatus === "blocked";
}

export function getOrganizationBlockedMessage(orgProfile) {
  if (orgProfile?.isClaimFlow) {
    return "Your university claim has been rejected and your organization account has been blocked. Please contact support for further assistance.";
  }
  return "Your Organization Account has been blocked. Please contact support for further assistance.";
}
