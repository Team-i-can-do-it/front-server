import ApiClient from './ApiClient';

export type ReferenceMaterial = {
  title: string;
  imageUrl: string;
  url: string;
};

export type ReferenceMaterialResponse = {
  status: number;
  message: string;
  result: ReferenceMaterial[];
};

export async function GetReferenceMaterialsByTopic(
  topicId: number,
): Promise<ReferenceMaterialResponse> {
  const { data } = await ApiClient.get<ReferenceMaterialResponse>(
    `/reference-material/by-topic/${topicId}`,
  );
  return data;
}
