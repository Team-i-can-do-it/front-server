export function isValidEmailBasic(str?: string | null) {
  // 최소 요건: @와 .이 모두 포함
  return !!str && str.includes('@') && str.includes('.');
}

export function isValidPassword(str?: string | null) {
  // 8자 이상 + 특수문자 1개 이상(영문/숫자 외의 문자)
  return !!str && str.length >= 8 && /[^A-Za-z0-9]/.test(str);
}
