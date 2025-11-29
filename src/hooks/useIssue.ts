import {
  AssignIssueToSprintInput,
  IssueFormValues,
} from "@/schemas/issue.schema";
import {
  assignIssueToSprint,
  createIssue,
  deleteIssue,
  editIssue,
  getAllIssue,
  getAllIssueIds,
  getIssueById,
  getIssueHistory,
  getListIssue,
  getSubtasksByIssueId,
} from "@/services/issue.service";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useAllIssue = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ["issues", page, limit],
    queryFn: () => getAllIssue(page, limit),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: true,
  });
};

export const useAllIssuesIds = () => {
  return useQuery({
    queryKey: ["issue_ids"],
    queryFn: getAllIssueIds,
    enabled: false,
    staleTime: 5 * 60 * 1000, // cache 5 phút
  });
};

export const useListIssue = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["listIssues"],
    queryFn: () => getListIssue(),
    enabled,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: true,
  });
};

export const useAddIssue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IssueFormValues) => createIssue(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["subtasks"], exact: false });
      queryClient.invalidateQueries({
        queryKey: ["issueHistory"],
        exact: false,
      });
    },
  });
};

export const useAssignIssueToSprint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (issueId: number) => assignIssueToSprint(issueId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["subtasks"], exact: false });
      queryClient.invalidateQueries({
        queryKey: ["issueHistory"],
        exact: false,
      });
    },
  });
};

export const useGetDetailIssue = (id: number) => {
  return useQuery({
    queryKey: ["issueDetail", id],
    queryFn: () => getIssueById(id),
    enabled: !!id,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
};

export const useEditIssue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      editIssue(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["subtasks"], exact: false });
      queryClient.invalidateQueries({
        queryKey: ["issueHistory"],
        exact: false,
      });
    },
  });
};

export const useDeleteIssue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteIssue(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["subtasks"], exact: false });
      queryClient.invalidateQueries({
        queryKey: ["issueHistory"],
        exact: false,
      });
    },
  });
};

export const useAllSubtask = (
  parentId: number,
  page: number = 1,
  limit: number = 10
) => {
  return useQuery({
    queryKey: ["subtasks", parentId, page, limit],
    queryFn: () => getSubtasksByIssueId(parentId, page, limit),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
};

// export const useIssueHistory = (issue_id: number) => {
//   return useQuery({
//     queryKey: ["issueHistory"],
//     queryFn: () => getIssueHistory(issue_id),
//     staleTime: 1000 * 60,
//     refetchOnWindowFocus: false,
//     refetchOnReconnect: false,
//     refetchOnMount: false,
//   });
// };

export const useIssueHistory = (
  issueId: number,
  page: number,
  limit: number = 10
) => {
  return useQuery({
    queryKey: ["issueHistory", issueId, page, limit],
    queryFn: () => getIssueHistory(issueId, page, limit),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
  });
};
