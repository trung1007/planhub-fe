import {
  getAllWorkflow,
  getStatusByWorkflowId,
  getTransitionByWorkflowId,
  getWorkflowById,
} from "@/services/workflow.service";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

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
