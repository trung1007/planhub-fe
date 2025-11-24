
import ReleaseStatusTag from "@/components/tag/ReleaseStatusTag";
import { ReleaseStatus } from "@/enums/release.enum";

export const releaseStatusOptions = Object.values(ReleaseStatus).map((s) => ({
  value: s,
  label: <ReleaseStatusTag status={s} />,
}));