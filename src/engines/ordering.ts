import { OrderingActivity } from "../types";

export type OrderingState = {
  selectedItemIds: string[];
  completed: boolean;
};

export type OrderingStep = {
  state: OrderingState;
  completed: boolean;
  incorrect: boolean;
};

export function createOrderingState(): OrderingState {
  return { selectedItemIds: [], completed: false };
}

export function resetOrderingState(): OrderingState {
  return createOrderingState();
}

export function isOrderingCorrect(
  selectedItemIds: readonly string[],
  correctOrder: readonly string[],
): boolean {
  return (
    selectedItemIds.length === correctOrder.length &&
    selectedItemIds.every((id, index) => id === correctOrder[index])
  );
}

/**
 * Adds one configured item to the order. A wrong choice clears the attempt so
 * children can try again without a punishment state or an invalid partial order.
 */
export function selectOrderingItem(
  state: OrderingState,
  itemId: string,
  correctOrder: readonly string[],
): OrderingStep {
  if (state.completed) return { state, completed: true, incorrect: false };

  const position = state.selectedItemIds.length;
  if (correctOrder[position] !== itemId) {
    return {
      state: createOrderingState(),
      completed: false,
      incorrect: true,
    };
  }

  const selectedItemIds = [...state.selectedItemIds, itemId];
  const completed = isOrderingCorrect(selectedItemIds, correctOrder);
  return {
    state: { selectedItemIds, completed },
    completed,
    incorrect: false,
  };
}

export function evaluateOrdering(
  activity: OrderingActivity,
  selectedItemIds: readonly string[],
) {
  return isOrderingCorrect(selectedItemIds, activity.config.correctOrder)
    ? { completed: true }
    : { completed: false, feedback: activity.retryFeedback };
}