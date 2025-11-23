
import ReleaseStatusTag from "@/components/ReleaseStatusTag";
import { ReleaseStatus } from "@/enums/release.enum";

export const releaseStatusOptions = Object.values(ReleaseStatus).map((s) => ({
  value: s,
  label: <ReleaseStatusTag status={s} />,
}));