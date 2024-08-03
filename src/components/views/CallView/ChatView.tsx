import { useCallback, useEffect } from 'react';
import styled from 'styled-components';

import {Screen} from 'components/templates/Screen/Screen';
import { useSbCalls } from 'lib/sendbird-calls';
import type { StatefulDirectCall } from 'lib/sendbird-calls';
import * as mixins from 'styles/mixins';
import { media } from 'utils';

const Wrapper = styled(Screen)`
  ${mixins.flexCenter};
  flex-direction: column;
  width: 100%; // Cover only parent's width
  height: 100%; // Cover only parent's height
  color: white;
  background-color: var(--navy-100);
  position: relative; // Adjust to be relative within its parent
`;

const Background = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
`;

interface CallViewProps { call: StatefulDirectCall; }
const ChatView: React.FC<CallViewProps> = ({ call }) => {
  const { clearCalls } = useSbCalls();

  useEffect(() => {
    // Example initialization, could be modified according to actual use
    console.log('Component initialized or updated');
  }, []);

  return (
    <Wrapper>
      <Background>
        <h1>Chat View</h1>
        {/* Other components and logic can be added here */}
      </Background>
    </Wrapper>
  );
};

export default ChatView;
