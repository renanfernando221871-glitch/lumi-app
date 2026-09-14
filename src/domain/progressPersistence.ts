import { ProgressState } from "../types";

export async function persistProgressBeforeCommit(
  progress: ProgressState,
  persist: (nextProgress: ProgressState) => Promise<void>,
  commit: (nextProgress: ProgressState) => void,
): Promise<void> {
  await persist(progress);
  commit(progress);
}