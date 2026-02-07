"use client";

import { usePathname, useRouter } from "next/navigation";
import { TAB_GROUPS, titleForTab, tabFromPath, type Tab } from "@/lib/navigation";
import { useUIStore } from "@/store/use-ui-store";

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { navGroupsCollapsed, setNavGroupsCollapsed } = useUIStore();

  const currentTab = tabFromPath(pathname) || "home";

  const handleTabClick = (tab: Tab) => {
    router.push(`/${tab === "chat" ? "" : tab}`);
  };

  const toggleGroup = (label: string) => {
    setNavGroupsCollapsed({
      ...navGroupsCollapsed,
      [label]: !navGroupsCollapsed[label],
    });
  };

  return (
    <nav className="navigation">
      {TAB_GROUPS.map((group) => {
        const isCollapsed =
          ("collapsed" in group && group.collapsed) || navGroupsCollapsed[group.label];

        return (
          <div key={group.label || "default"} className="nav-group">
            {group.label && (
              <button
                className="nav-group-header"
                onClick={() => toggleGroup(group.label)}
                aria-expanded={!isCollapsed}
              >
                <span className="nav-group-label">{group.label}</span>
                <span className={`nav-group-chevron ${isCollapsed ? "collapsed" : ""}`}>▼</span>
              </button>
            )}
            {(!group.label || !isCollapsed) && (
              <div className={`nav-tabs ${"subtabs" in group && group.subtabs ? "subtabs" : ""}`}>
                {group.tabs.map((tab) => {
                  const isActive = currentTab === tab;
                  return (
                    <button
                      key={tab}
                      className={`nav-tab ${isActive ? "active" : ""}`}
                      onClick={() => handleTabClick(tab)}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {titleForTab(tab)}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
