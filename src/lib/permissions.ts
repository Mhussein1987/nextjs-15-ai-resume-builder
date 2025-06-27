import { SubscriptionLevel } from "./subscription";

export function canCreateResume(
  subscriptionLevel: SubscriptionLevel,
  currentResumeCount: number,
) {
  // Soft launch: All users get 5 resumes max
  return currentResumeCount < 5;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function canUseAITools(subscriptionLevel: SubscriptionLevel) {
  // Soft launch: All users get AI tools
  return true;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function canUseCustomizations(subscriptionLevel: SubscriptionLevel) {
  // Soft launch: All users get customizations
  return true;
}
