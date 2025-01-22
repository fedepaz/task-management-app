import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { tagService } from "../services/tagService";
import { Tag } from "@task-app/shared/src/types/tag";

interface UseTagsReturn {
  searchTags: (query: string) => Promise<Tag[]>;
  createTag: (name: string) => Promise<Tag>;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  searchResults: Tag[];
  selectedTags: Tag[];
}

export const useTags = (
  initialSelectedTags: Tag["id"][] = []
): UseTagsReturn => {
  const queryClient = useQueryClient();

  const {
    data: searchResults = [],
    isLoading: isSearchLoading,
    isError: isSearchError,
    error: searchError,
  } = useQuery({
    queryKey: ["tags", "search"],
    queryFn: () => Promise.resolve([]),
    enabled: false,
  });

  const {
    mutateAsync: createTagMutation,
    isPending: isCreateLoading,
    isError: isCreateError,
    error: createError,
  } = useMutation({
    mutationFn: tagService.createTag,
    onSuccess: (newTag) => {
      queryClient.setQueryData(["tags", "search"], (oldData: Tag[] = []) => [
        newTag.data,
        ...oldData,
      ]);
    },
  });

  const {
    data: selectedTags = [],
    isLoading: isSelectedLoading,
    isError: isSelectedError,
    error: selectedError,
  } = useQuery({
    queryKey: ["tags", "selected", initialSelectedTags],
    queryFn: async () => {
      if (!initialSelectedTags?.length) return Promise.resolve([]);
      const res = await tagService.getTagsByIds(initialSelectedTags);
      return res.data;
    },
    enabled: initialSelectedTags.length > 0,
    staleTime: 1000 * 60 * 5,
  });

  const searchTags = async (query: string): Promise<Tag[]> => {
    if (!query) return [];
    const response = await tagService.searchTags(query);
    return response.data;
  };

  const createTag = async (name: string): Promise<Tag> => {
    const response = await createTagMutation(name);
    return response.data;
  };
  return {
    searchTags,
    createTag,
    isLoading: isSearchLoading || isCreateLoading || isSelectedLoading,
    isError: isSearchError || isCreateError || isSelectedError,
    error: searchError || createError || selectedError,
    searchResults,
    selectedTags,
  };
};
