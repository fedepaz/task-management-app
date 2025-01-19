import { useState, useEffect, useCallback, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Tag } from "@task-app/shared/src/types/tag";
import { useTags } from "@/hooks/useTag";

interface TagAutoCompleteProps {
  onTagsChange: (tags: Tag["id"][]) => void;
  selectedTags: Tag["id"][];
}

export const TagAutoComplete = ({
  selectedTags,
  onTagsChange,
}: TagAutoCompleteProps) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [lastSearchChar, setLastSearchChar] = useState("");

  const {
    searchTags,
    createTag,
    selectedTags: tagDetails = [],
  } = useTags(selectedTags);

  const performInitialSearch = useCallback(
    async (searchTerm: string) => {
      if (!searchTerm.trim()) {
        setAllTags([]);
        return;
      }

      try {
        setIsSearching(true);
        const results = await searchTags(searchTerm);
        setAllTags(results || []);
      } catch (error) {
        console.error("Search error:", error);
        setAllTags([]);
      } finally {
        setIsSearching(false);
      }
    },
    [searchTags]
  );

  useEffect(() => {
    const firstChar = inputValue.charAt(0).toLowerCase();
    if (
      firstChar &&
      (firstChar !== lastSearchChar || inputValue.length === 1)
    ) {
      setLastSearchChar(firstChar);
      performInitialSearch(firstChar);
    }
  }, [inputValue, lastSearchChar, performInitialSearch]);

  const filteredResults = useMemo(() => {
    return allTags.filter((tag) =>
      tag.name.toLowerCase().startsWith(inputValue.toLowerCase())
    );
  }, [allTags, inputValue]);

  const handleSelectTag = useCallback(
    (tagId: Tag["id"]) => {
      if (!selectedTags.includes(tagId)) {
        onTagsChange([...selectedTags, tagId]);
      }
      setInputValue("");
      setOpen(false);
      setSelectedIndex(-1);
    },
    [selectedTags, onTagsChange]
  );

  const handleCreateTag = useCallback(async () => {
    if (inputValue.trim()) {
      try {
        setIsSearching(true);
        const newTag = await createTag(inputValue.trim());
        if (newTag?.id) {
          await performInitialSearch(inputValue.charAt(0));
          handleSelectTag(newTag.id);
        }
      } catch (error) {
        console.error("Error creating tag:", error);
      } finally {
        setIsSearching(false);
      }
    }
  }, [inputValue, createTag, handleSelectTag, performInitialSearch]);

  const handleRemoveTag = useCallback(
    (tagId: Tag["id"]) => {
      onTagsChange(selectedTags.filter((id: string) => id !== tagId));
    },
    [selectedTags, onTagsChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!open) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < filteredResults.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > -1 ? prev - 1 : -1));
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0 && filteredResults[selectedIndex]) {
            handleSelectTag(filteredResults[selectedIndex].id);
          } else if (inputValue.trim()) {
            const existingTag = filteredResults.find(
              (tag) => tag.name.toLowerCase() === inputValue.toLowerCase()
            );
            if (existingTag) {
              handleSelectTag(existingTag.id);
            } else {
              handleCreateTag();
            }
          }
          break;
        case "Escape":
          setOpen(false);
          setSelectedIndex(-1);
          break;
      }
    },
    [
      open,
      selectedIndex,
      filteredResults,
      handleSelectTag,
      handleCreateTag,
      inputValue,
    ]
  );

  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          id="tags"
          type="text"
          value={inputValue}
          onChange={(e) => {
            const newValue = e.target.value;
            setInputValue(newValue);
            setOpen(true);
            setSelectedIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            setTimeout(() => {
              setOpen(false);
              setSelectedIndex(-1);
            }, 200);
          }}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          placeholder="Search or create tags..."
        />
        {open && inputValue && (
          <div className="absolute z-50 w-full mt-2 rounded-md border bg-popover text-popover-foreground shadow-md">
            <div className="max-h-48 overflow-auto p-1">
              {isSearching ? (
                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                  Searching...
                </div>
              ) : (
                <>
                  {filteredResults.length > 0
                    ? filteredResults.map((tag, index) => (
                        <div
                          key={tag.id}
                          onClick={() => handleSelectTag(tag.id)}
                          className={`px-2 py-1.5 text-sm cursor-pointer rounded-sm ${
                            index === selectedIndex
                              ? "bg-accent text-accent-foreground"
                              : "hover:bg-accent hover:text-accent-foreground"
                          }`}
                        >
                          {tag.name}
                        </div>
                      ))
                    : inputValue.trim() && (
                        <div
                          onClick={handleCreateTag}
                          className="px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-sm text-muted-foreground"
                        >
                          Create tag "{inputValue.trim()}"...
                        </div>
                      )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {(tagDetails || []).map((tag) => (
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
