export function getPagination(req, defaultLimit = 10, maxLimit = 50) {
  const limitRaw = Number(req.query.limit);
  const skipRaw = Number(req.query.skip);

  const limit = Number.isFinite(limitRaw)
    ? Math.min(Math.max(limitRaw, 1), maxLimit)
    : defaultLimit;
  const skip = Number.isFinite(skipRaw) ? Math.max(skipRaw, 0) : 0;

  return { limit, skip };
}
