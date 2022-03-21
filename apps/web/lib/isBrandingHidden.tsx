import { User, UserPlan } from "@prisma/client";

export function isBrandingHidden<TUser extends Pick<User, "hideBranding" | "plan">>(user: TUser) {
  return user.hideBranding && user.plan !== UserPlan.FREE;
}
