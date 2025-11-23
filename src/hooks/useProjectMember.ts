import { ActionProjectMemberInput } from "@/schemas/project-member.schema";
import {
  createProjectMember,
  deleteProjectMember,
  editProjectMember,
  getAllProjectMember,
} from "@/services/project-member.service";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useAddProjectMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ActionProjectMemberInput) => createProjectMember(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-members"] });
    },
  });
};

export const useAllProjectMember = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ["project-members", page, limit],
    queryFn: () => getAllProjectMember(page, limit),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
};

export const useEditProjectMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: ActionProjectMemberInput;
    }) => editProjectMember(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-members"] });
    },
  });
};


export const useDeleteProjectMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteProjectMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-members"] });
    },
  });
};