import { ActionReleaseInput } from "@/schemas/release.schema";
import {
  createRelease,
  deleteRelease,
  editRelease,
  getAllRelease,
  getListRelease,
} from "@/services/release.service";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useAddRelease = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ActionReleaseInput) => createRelease(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["releases"] });
      queryClient.invalidateQueries({ queryKey: ["listReleases"] });
    },
  });
};

export const useAllRelease = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ["releases", page, limit],
    queryFn: () => getAllRelease(page, limit),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
};

export const useListProject = () => {
  return useQuery({
    queryKey: ["listReleases"],
    queryFn: () => getListRelease(),
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
};

export const useEditRelease = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ActionReleaseInput }) =>
      editRelease(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["releases"] });
      queryClient.invalidateQueries({ queryKey: ["listReleases"] });
    },
  });
};

export const useDeleteRelease = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteRelease(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["releases"] });
      queryClient.invalidateQueries({ queryKey: ["listReleases"] });
    },
  });
};
