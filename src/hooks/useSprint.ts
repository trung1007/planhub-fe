import { ActionSprintInput } from "@/schemas/sprint-schema";
import {
  createSprint,
  deleteSprint,
  editSprint,
  getAllSprint,
  getListActiveSprint,
  getListSprint,
} from "@/services/sprint.service";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useAddSprint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ActionSprintInput) => createSprint(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sprints"] });
      queryClient.invalidateQueries({ queryKey: ["listSprints"] });
      queryClient.invalidateQueries({ queryKey: ["activeSprints"] });
    },
  });
};

export const useAllSprint = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ["sprints", page, limit],
    queryFn: () => getAllSprint(page, limit),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
};

export const useListSprint = () => {
  return useQuery({
    queryKey: ["listSprints"],
    queryFn: () => getListSprint(),
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
};

export const useActiveSprint = () => {
  return useQuery({
    queryKey: ["activeSprints"],
    queryFn: () => getListActiveSprint(),
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
};


export const useEditSprint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ActionSprintInput }) =>
      editSprint(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sprints"] });
      queryClient.invalidateQueries({ queryKey: ["listSprints"] });
      queryClient.invalidateQueries({ queryKey: ["activeSprints"] });
    },
  });
};

export const useDeleteSprint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteSprint(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sprints"] });
      queryClient.invalidateQueries({ queryKey: ["listSprints"] });
      queryClient.invalidateQueries({ queryKey: ["activeSprints"] });
    },
  });
};
