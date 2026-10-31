/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AccessGate } from './components/AccessGate';
import { MainPortal } from './components/MainPortal';

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);

  if (isUnlocked) {
    return <MainPortal onLockSession={() => setIsUnlocked(false)} />;
  }

  return (
    <AccessGate
      isUnlocked={isUnlocked}
      onUnlock={() => setIsUnlocked(true)}
      onLock={() => setIsUnlocked(false)}
    />
  );
}
