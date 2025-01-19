import { useQuery } from "@tanstack/react-query";
import { tagService } from "../services/tagService";
import { Tag } from "@task-app/shared/src/types/tag";

export const useTaksTags = (tagIds: string[]) => {
  const {
    data: tags = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Tag[]>({
    queryKey: ["tags", tagIds],
    queryFn: () => tagService.getTagsByIds(tagIds).then((res) => res.data),
    enabled: tagIds.length > 0,
    staleTime: 1000 * 60 * 5,
  });

  return {
    tags: tags || [],
    isLoading,
    error,
    refetch,
  };
};
