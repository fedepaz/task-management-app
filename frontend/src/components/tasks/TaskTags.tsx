import { Badge } from "@/components/ui/badge";
import { useTaksTags } from "@/hooks/useTaksTags";
import { ErrorModal } from "@/components/common/ErrorModal";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { AxiosError } from "axios";
import { useEffect, useRef, useState } from "react";

interface TaskTagsProps {
  tagsIds: string[];
}

export const TaskTags = ({ tagsIds }: TaskTagsProps) => {
  const previousTagsIds = useRef<string[]>([]);
  const [shouldRefetch, setShouldRefetch] = useState(false);

  // Compare if tagsIds have changed
  useEffect(() => {
    const currentTagsString = tagsIds.sort().join(",");
    const previousTagsString = previousTagsIds.current.sort().join(",");

    if (currentTagsString !== previousTagsString) {
      previousTagsIds.current = tagsIds;
      setShouldRefetch(true);
    }
  }, [tagsIds]);

  const { tags, isLoading, error, refetch } = useTaksTags(tagsIds);

  // Trigger refetch when tags change
  useEffect(() => {
    if (shouldRefetch) {
      refetch();
      setShouldRefetch(false);
    }
  }, [shouldRefetch, refetch]);

  const [errorModal, setErrorModal] = useState<{
    show: boolean;
    message?: string;
  }>({
    show: false,
  });

  useEffect(() => {
    if (error) {
      setErrorModal({
        show: true,
        message:
          error instanceof AxiosError
            ? error.response?.data
            : "An unexpected error occurred while fetching tasks",
      });
    }
  }, [error]);

  if (isLoading) {
    return <LoadingSpinner />;
  }
  if (error) {
    return (
      <ErrorModal
        open={errorModal.show}
        onClose={() => setErrorModal({ show: false })}
        error={errorModal.message}
      />
    );
  }
  return (
    <div className="flex gap-2 flex-wrap">
      {tags.map((tag) => (
        <Badge key={tag.id} variant="secondary" className="px-2 py-1">
          {tag.name}
        </Badge>
      ))}
    </div>
  );
};
