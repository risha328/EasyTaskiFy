import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  fetchMyOrgsApi,
  createOrgApi,
  fetchOrgMembersApi,
  addOrgMemberApi,
  removeOrgMemberApi,
} from '../services/api';
import { useAuth } from './AuthContext';

const OrganizationContext = createContext(null);

export const OrganizationProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const [organizations, setOrganizations] = useState([]);
  const [activeOrg, setActiveOrg] = useState(null);
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load organizations when user logs in
  const loadOrganizations = useCallback(async () => {
    if (!isAuthenticated) {
      setOrganizations([]);
      setActiveOrg(null);
      setMembers([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const data = await fetchMyOrgsApi();
      if (data.status === 'success') {
        setOrganizations(data.organizations);

        const storedOrgId = localStorage.getItem('taskflow_active_org_id');
        const foundOrg = data.organizations.find((o) => o.id === storedOrgId);

        const selectedOrg = foundOrg || data.organizations[0] || null;

        if (selectedOrg) {
          setActiveOrg(selectedOrg);
          localStorage.setItem('taskflow_active_org_id', selectedOrg.id);
        }
      }
    } catch (error) {
      console.error('Failed to load user organizations:', error.message);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadOrganizations();
  }, [loadOrganizations]);

  // Load active organization members
  const loadMembers = useCallback(async () => {
    if (!activeOrg) {
      setMembers([]);
      return;
    }

    try {
      const data = await fetchOrgMembersApi(activeOrg.id);
      if (data.status === 'success') {
        setMembers(data.members);
      }
    } catch (error) {
      console.error('Failed to load members:', error.message);
    }
  }, [activeOrg]);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  const switchOrganization = (orgId) => {
    const targetOrg = organizations.find((o) => o.id === orgId);
    if (targetOrg) {
      setActiveOrg(targetOrg);
      localStorage.setItem('taskflow_active_org_id', targetOrg.id);
    }
  };

  const createOrganization = async (name, adminEmail) => {
    const data = await createOrgApi(name, adminEmail);
    if (data.status === 'success') {
      const newOrg = data.organization;
      setOrganizations((prev) => [newOrg, ...prev]);
      setActiveOrg(newOrg);
      localStorage.setItem('taskflow_active_org_id', newOrg.id);
    }
    return data;
  };

  const addMember = async (email, role, targetOrgId = null) => {
    const orgId = targetOrgId || activeOrg?.id;
    if (!orgId) return;
    const data = await addOrgMemberApi(orgId, email, role);
    if (data.status === 'success') {
      await loadMembers();
    }
    return data;
  };

  const removeMember = async (userId, targetOrgId = null) => {
    const orgId = targetOrgId || activeOrg?.id;
    if (!orgId) return;
    const data = await removeOrgMemberApi(orgId, userId);
    if (data.status === 'success') {
      await loadMembers();
    }
    return data;
  };

  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  const userRole = isSuperAdmin ? 'SUPER_ADMIN' : activeOrg?.role || 'MEMBER';
  const isAdmin = isSuperAdmin || userRole === 'ADMIN';
  const isManager = userRole === 'MANAGER';
  const isMember = userRole === 'MEMBER';

  // Permission helpers aligned with Jira RBAC (Only Superadmin creates workspaces)
  const canCreateWorkspace = isSuperAdmin;

  const permissions = {
    isSuperAdmin,
    isAdmin,
    isManager,
    isMember,
    canManageWorkspace: isSuperAdmin || isAdmin,
    canInviteMembers: isSuperAdmin || isAdmin || isManager,
    canCreateProject: isSuperAdmin || isAdmin || isManager,
    canCreateWorkspace,
    canCreateTask: true, // All team members can create and work on tasks
  };

  const value = {
    organizations,
    activeOrg,
    members,
    userRole,
    ...permissions,
    isLoading,
    switchOrganization,
    createOrganization,
    addMember,
    removeMember,
    refreshMembers: loadMembers,
    refreshOrganizations: loadOrganizations,
  };

  return <OrganizationContext.Provider value={value}>{children}</OrganizationContext.Provider>;
};

export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
};
