import { useMutation } from '@tanstack/react-query';
import {
  postWriting,
  type WritingPayload,
  type WritingResponse,
} from '@_api/WritingApiClient';

export function useSubmitWriting() {
  return useMutation<WritingResponse, unknown, WritingPayload>({
    mutationFn: postWriting,
    onMutate: (p) => {
      if (import.meta.env.DEV) console.log('[MUTATE] /writing payload', p);
    },
    onSuccess: (res) => {
      if (import.meta.env.DEV) console.log('[SUCCESS] /writing', res);
    },
    onError: (e) => {
      if (import.meta.env.DEV) console.log('[ERROR] /writing', e);
    },
  });
}
