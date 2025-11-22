import { ActionProjectMemberInput } from "@/schemas/project-member.schema";
import { createProjectMember, getAllProjectMember } from "@/services/project-member.service";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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