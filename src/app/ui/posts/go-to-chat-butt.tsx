'use client';

import { useTranslations } from 'next-intl';
import { Button } from '../button';
import { useActionState } from 'react';
import { startNewChat } from '../../lib/actions';
import { startTransition } from 'react';

export default function GoToChatButton({ postId }: { postId: string | undefined }) {
  const t = useTranslations('posts');
  const [state, dispatch, pending] = useActionState(startNewChat, undefined);
  if (!postId) return <p>Error</p>;

  const handleClick = () => {
    startTransition(() => {
      dispatch(postId);
    });
  };

  return (
    <Button disabled={pending} onClick={handleClick}>
      {t('goToChat')}
    </Button>
  );
}
