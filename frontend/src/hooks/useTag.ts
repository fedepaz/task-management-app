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
  setSelectedTags: (tags: Tag["id"][]) => void;
}

export const useTags = (
  initialSelectedTags: Tag["id"][] = []
): UseTagsReturn => {
  const queryClient = useQueryClient();

  // Query for searching tags
  const {
    data: searchResults = [],
    isLoading: isSearchLoading,
    isError: isSearchError,
    error: searchError,
    refetch: performSearch,
  } = useQuery({
    queryKey: ["tags", "search"],
    queryFn: () => Promise.resolve([]), // Initial empty state
    enabled: false, // Don't run automatically
  });

  // Mutation for creating new tags
  const {
    mutateAsync: createTagMutation,
    isPending: isCreateLoading,
    isError: isCreateError,
    error: createError,
  } = useMutation({
    mutationFn: tagService.createTag,
    onSuccess: (newTag) => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });

  // Query for selected tags details
  const {
    data: selectedTags = [],
    isLoading: isSelectedLoading,
    isError: isSelectedError,
    error: selectedError,
  } = useQuery({
    queryKey: ["tags", "selected", initialSelectedTags],
    queryFn: async () => {
      if (!initialSelectedTags.length) return [];
      const allTags = await tagService.getTags();
      return allTags.data.filter((tag) => initialSelectedTags.includes(tag.id));
    },
    enabled: initialSelectedTags.length > 0,
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
    setSelectedTags: (tags) => {
      queryClient.setQueryData(["tags", "selected"], tags);
    },
    selectedTags,
  };
};
