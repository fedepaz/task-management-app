import { useState, useEffect } from "react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Tag } from "@task-app/shared/src/types/tag";
import { useTags } from "@/hooks/useTag";

interface TagAutoCompleteProps {
  onSelect: (tag: Tag) => void;
  selectedTags: Tag["id"][];
}

export const TagAutoComplete = ({
  selectedTagIds,
  onTagsChange,
}: TagAutoCompleteProps) => {
  const [search, setSearch] = useState("");
  const {
    searchTags,
    createTag,
    searchResults,
    selectedTags,
    isLoading,
    error,
  } = useTags(selectedTagIds);
  const [localResults, setLocalResults] = useState<Tag[]>([]);
  useEffect(() => {
    const performSearch = async () => {
      if (search.trim()) {
        const results = await searchTags(search);
        setLocalResults(results);
      } else {
        setLocalResults([]);
      }
    };

    const debounceTimeout = setTimeout(performSearch, 300);
    return () => clearTimeout(debounceTimeout);
  }, [search]);

  const handleSelectTag = async (tagId: Tag["id"]) => {
    if (!selectedTagIds.includes(tagId)) {
      onTagsChange([...selectedTagIds, tagId]);
    }
    setSearch("");
  };
  const handleCreateTag = async () => {
    if (search.trim()) {
      const newTag = await createTag(search.trim());
      handleSelectTag(newTag.id);
    }
  };

  const handleRemoveTag = (tagId: Tag["id"]) => {
    onTagsChange(selectedTagIds.filter((id: string) => id !== tagId));
  };

  return (
    <div className="space-y-2">
      <Command className="border rounded-md">
        <CommandInput
          value={search}
          onValueChange={setSearch}
          placeholder="Search or create tags..."
          className="h-9"
        />
        {search && (
          <CommandList className="max-h-48 overflow-y-auto">
            {localResults.map((tag) => (
              <CommandItem
                key={tag.id}
                onSelect={() => handleSelectTag(tag.id)}
                className="cursor-pointer hover:bg-accent"
              >
                {tag.name}
              </CommandItem>
            ))}
            {search && !localResults.length && (
              <CommandItem
                onSelect={handleCreateTag}
                className="cursor-pointer hover:bg-accent text-muted-foreground"
              >
                Create tag "{search}"...
              </CommandItem>
            )}
          </CommandList>
        )}
      </Command>

      <div className="flex flex-wrap gap-2">
        {selectedTags.map((tag) => (
          <Badge
            key={tag.id}
            variant="secondary"
            className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
            onClick={() => handleRemoveTag(tag.id)}
          >
            {tag.name} ×
          </Badge>
        ))}
      </div>
    </div>
  );
};
