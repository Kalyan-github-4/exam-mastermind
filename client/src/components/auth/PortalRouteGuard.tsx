import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUser } from "@clerk/react";

import { portalHomePath, portalLabels, portalSignInPath, type PortalRole, isPortalRole } from "@/lib/portal";
import { isExaminerLoggedIn } from "@/lib/examinerAuth";

const getStoredRole = (userRole: unknown): PortalRole | null => {
  if (isPortalRole(userRole)) {
    return userRole;
  }

  return null;
};

type PortalRouteGuardProps = {
  role: PortalRole;
};

const PortalRouteGuard = ({ role }: PortalRouteGuardProps) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const location = useLocation();
  const [syncingRole, setSyncingRole] = useState(false);

  const currentRole = getStoredRole(
    (user?.publicMetadata as { role?: unknown } | undefined)?.role ??
      (user?.unsafeMetadata as { role?: unknown } | undefined)?.role
  );

  useEffect(() => {
    console.log("[auth] route guard state", {
      role,
      path: location.pathname,
      isLoaded,
      isSignedIn,
      syncingRole,
      currentRole,
      userId: user?.id ?? null,
    });
  }, [currentRole, isLoaded, isSignedIn, location.pathname, role, syncingRole, user?.id]);

  useEffect(() => {
    if (role === 'examiner') return;
    
    if (!isLoaded || !isSignedIn || !user || currentRole || syncingRole) {
      return;
    }

    const syncRole = async () => {
      try {
        setSyncingRole(true);
        console.log("[auth] syncing clerk role metadata", { role, userId: user.id });
        await user.update({
          unsafeMetadata: {
            ...(user.unsafeMetadata as Record<string, unknown>),
            role,
          },
        });
        console.log("[auth] clerk role metadata synced", { role, userId: user.id });
      } catch (error) {
        console.error("Failed to persist portal role:", error);
      } finally {
        setSyncingRole(false);
      }
    };

    void syncRole();
  }, [currentRole, isLoaded, isSignedIn, role, syncingRole, user]);

  if (role === 'examiner') {
    if (!isExaminerLoggedIn()) {
      console.warn("[auth] examiner guard redirecting to sign-in", { path: location.pathname });
      return <Navigate to={portalSignInPath('examiner')} replace state={{ from: location.pathname }} />;
    }
    console.log("[auth] examiner guard allowing access");
    return <Outlet />;
  }

  if (!isLoaded || syncingRole) {
    console.log("[auth] waiting for clerk state before rendering protected route", {
      role,
      isLoaded,
      syncingRole,
    });
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-sm rounded-2xl border bg-card px-6 py-8 text-center shadow-sm">
          <div className="mx-auto mb-4 h-10 w-10 animate-pulse rounded-full bg-primary/15" />
          <p className="text-sm font-medium text-foreground">Preparing the {portalLabels[role]} portal</p>
          <p className="mt-2 text-sm text-muted-foreground">Checking your Clerk session and access role.</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    console.warn("[auth] clerk session missing, redirecting to sign-in", { role, path: location.pathname });
    return <Navigate to={portalSignInPath(role)} replace state={{ from: location.pathname }} />;
  }

  if (currentRole && currentRole !== role) {
    console.warn("[auth] clerk role mismatch, redirecting", { role, currentRole, path: location.pathname });
    return <Navigate to={portalHomePath(currentRole)} replace />;
  }

  return <Outlet />;
};

export default PortalRouteGuard;
