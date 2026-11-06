/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AccessGate } from './components/AccessGate';
import { MainPortal } from './components/MainPortal';
import { AssessmentDataProvider } from './context/AssessmentDataContext';

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);

  return (
    <AssessmentDataProvider>
      {isUnlocked ? (
        <MainPortal onLockSession={() => setIsUnlocked(false)} />
      ) : (
        <AccessGate
          isUnlocked={isUnlocked}
          onUnlock={() => setIsUnlocked(true)}
          onLock={() => setIsUnlocked(false)}
        />
      )}
    </AssessmentDataProvider>
  );
}
