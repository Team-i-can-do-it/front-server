import { useLocation, useParams, useSearchParams } from 'react-router-dom';

export function useTopicId(explicit?: string) {
  const params = useParams();
  const location = useLocation();
  const [sp] = useSearchParams();

  return (
    explicit ||
    (location.state as any)?.topicId ||
    (params.id as string | undefined) ||
    sp.get('topicId') ||
    undefined
  );
}
