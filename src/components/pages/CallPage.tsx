import { useEffect, useMemo } from "react";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { useSbCalls } from "../../lib/sendbird-calls";
import * as mixins from "../../styles/mixins";
import { media } from "../../utils";
import Overlay from "../atoms/Overlay";
import {Screen} from "../templates/Screen/Screen";
import CallView from "../views/CallView/CallView";
import DialView from "../views/DialView/DialView";
import ChatModel from "../templates/Modal/ChatModel";

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  padding-bottom: 55px; // TabToolbar height
  ${media.main} {
    padding-bottom: 0;
  }
`;

const Contents = styled(Screen)`
  ${mixins.flexCenter};
  flex-direction: column;
  height: calc(100% - 80px - 57px);
  ${media.main} {
    height: calc(100% - 48px - 56px);
  }
`;

const SplitViewOverlay = styled(Overlay)`
  display: flex;
  height: 100%;
  width: 100%;

  > * {
    flex: 1; // Assign equal width to each child
  }
`;

interface DirectCallMainProps {
}
const CallPage: React.FC<DirectCallMainProps> = ({ children }) => {
    const { isAuthenticated, calls } = useSbCalls();
    const history = useHistory();
    const location = useLocation();
    const query = new URLSearchParams(useLocation().search);
    const { path, url } = useRouteMatch();

    useEffect(() => {
        if (location.pathname === `${url}/login`) {
            if (isAuthenticated) {
                history.replace('/main/dial');
            }
        }
    }, [isAuthenticated, location.pathname]);



    const onCall = useMemo(() => {
        return calls.find(call => call.isOngoing)
    }, [calls])

    return (
        <Wrapper>
            {!!calls.length && <CallView call={calls[calls.length - 1]}/>}
            <Contents>
                <DialView />
                {onCall &&
                <Overlay>
                  <CallView call={onCall} />
                </Overlay>
                }
            </Contents>
        </Wrapper>
    );
};

export default CallPage;