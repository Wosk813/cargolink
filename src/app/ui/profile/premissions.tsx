'use client';

import React from 'react';
import { Select } from '../select';
import { Role } from '../../lib/definitions';
import { useTranslations } from 'next-intl';

interface RoleSelectProps {
  userId: string;
  currentRole: Role;
  onRoleChange: (userId: string, newRole: Role) => Promise<void>;
}

export default function RoleSelect({ userId, currentRole, onRoleChange }: RoleSelectProps) {
  const t = useTranslations('profile');
  return (
    <Select
      containerStytles="bg-slate-800"
      title={t('changeUserPremissions')}
      value={currentRole}
      onChange={(e) => onRoleChange(userId, e.target.value as Role)}
      options={[
        { value: 'user', label: t('user') },
        { value: 'moderator', label: t('moderator') },
        { value: 'admin', label: t('admin') },
      ]}
    />
  );
}
