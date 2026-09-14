import {
  ActivityInteraction,
  RealWorldChallengeActivity,
} from "../types";

export type RealWorldChallengeState = {
  confirmed: boolean;
};

export function createRealWorldChallengeState(): RealWorldChallengeState {
  return { confirmed: false };
}

export function resetRealWorldChallengeState(): RealWorldChallengeState {
  return createRealWorldChallengeState();
}

/**
 * Confirmation is deliberately local: this engine never observes or requests
 * camera, microphone, location, network, or any other device capability.
 */
export function evaluateRealWorldChallenge(
  activity: RealWorldChallengeActivity,
  confirmed = true,
): ActivityInteraction {
  return confirmed
    ? { completed: true }
    : { completed: false, feedback: activity.retryFeedback };
}