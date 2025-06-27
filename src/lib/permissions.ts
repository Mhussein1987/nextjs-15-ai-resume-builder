import { SubscriptionLevel } from "./subscription";

export function canCreateResume(
  subscriptionLevel: SubscriptionLevel,
  currentResumeCount: number,
) {
  // Soft launch: All users get 5 resumes max
  return currentResumeCount < 5;
}

export function canUseAITools(subscriptionLevel: SubscriptionLevel) {
  // Soft launch: All users get AI tools
  return true;
}

export function canUseCustomizations(subscriptionLevel: SubscriptionLevel) {
  // Soft launch: All users get customizations
  return true;
}
