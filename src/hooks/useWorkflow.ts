import {
  createWorkflow,
  deleteWorkflow,
  editWorkflow,
  getAllWorkflow,
  getStatusByWorkflowId,
  getTransitionByWorkflowId,
  getWorkflowById,
} from "@/services/workflow.service";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useAllWorkflow = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ["workflows", page, limit],
    queryFn: () => getAllWorkflow(page, limit),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: true,
  });
};

export const useAddWorkflow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => createWorkflow(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workflows"], exact: false });
      queryClient.invalidateQueries({
        queryKey: ["workflowDetail"],
        exact: false,
      });
    },
  });
};

export const useEditWorkflow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      editWorkflow(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workflows"], exact: false });
      queryClient.invalidateQueries({
        queryKey: ["workflowDetail"],
        exact: false,
      });
    },
  });
};

export const useDeleteWorkflow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteWorkflow(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workflows"], exact: false });
      queryClient.invalidateQueries({
        queryKey: ["workflowDetail"],
        exact: false,
      });
    },
  });
};

export const useGetDetailWorkflow = (id: number) => {
  return useQuery({
    queryKey: ["workflowDetail", id],
    queryFn: () => getWorkflowById(id),
    enabled: !!id,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
};

export const useGetStatusWorkflow = (id: number) => {
  return useQuery({
    queryKey: ["workflowStatus", id],
    queryFn: () => getStatusByWorkflowId(id),
    enabled: !!id,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
};

export const useGetTransitionWorkflow = (id: number) => {
  return useQuery({
    queryKey: ["workflowTransition", id],
    queryFn: () => getTransitionByWorkflowId(id),
    enabled: !!id,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
};
