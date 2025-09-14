export function parseJwtClaims(token: string): Record<string, any> | null {
  try {
    const [, payload] = token.split('.');
    if (!payload) return null;


    const pad = '='.repeat((4 - (payload.length % 4)) % 4);
    const b64 = payload.replace(/-/g, '+').replace(/_/g, '/') + pad;
    const bin = atob(b64);
    const json = decodeURIComponent(
      Array.from(
        bin,
        (c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'),
      ).join(''),
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}


export function mergeUserFromBodyAndClaims(
  bodyUser: any,
  claims: Record<string, any> | null,
): { id: number; name: string; email: string } | null {

  let id: number | null =
    bodyUser?.id ??
    bodyUser?.userId ??
    bodyUser?.memberId ??
    (typeof claims?.userId === 'number' ? claims!.userId : null) ??
    (typeof claims?.memberId === 'number' ? claims!.memberId : null) ??

    (claims?.sub && !Number.isNaN(Number(claims.sub))
      ? Number(claims.sub)
      : null);


  const name = bodyUser?.name ?? '';


  const email = bodyUser?.email ?? bodyUser?.userEmail ?? claims?.email ?? '';

  // email/ID 둘 다 전혀 없으면 user 자체를 null로 처리
  if (!email && id == null) return null;

  // TS에서 User.id가 number이므로 null일 땐 -1로 대체
  if (id == null) id = -1;

  return { id, name, email };
}
