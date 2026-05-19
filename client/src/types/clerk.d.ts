import type { PortalRole } from "@/lib/portal";

declare module "@clerk/shared/types" {
  interface UserPublicMetadata {
    role?: PortalRole;
  }

  interface UserUnsafeMetadata {
    role?: PortalRole;
  }
}
