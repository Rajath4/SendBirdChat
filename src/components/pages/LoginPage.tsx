import styled from 'styled-components';
import * as fonts from 'styles/fonts';
import * as mixins from 'styles/mixins';
import { media } from 'utils';

import {Screen} from 'components/templates/Screen/Screen';

import LoginForm from '../organisms/LoginForm/LoginForm';

const Wrapper = styled(Screen)`
  width: 100vw;
  height: 100vh;
  ${mixins.flexCenter};
  color: rgb(33, 34, 66);
  background-color: rgb(255, 255, 255);
  ${media.main} {
    background-color: rgb(246, 248, 252);
  }
`;

const Content = styled.div`
  ${mixins.flexCenter};
  flex-direction: column;
  height: 100%;
  ${media.main} {
    height: auto;
    margin-top: 134px;
    margin-bottom: auto;
  }
`;

const Title = styled.div`
  ${fonts.big};
  ${fonts.demi};
  margin-bottom: 40px;
`;

const VersionInfo = styled.div`
  ${mixins.flexCenter};
  width: 100%;
  bottom: 24px;
  position: absolute;
  ${media.main} {
    display: none;
  }
`;

const VersionText = styled.div`
  ${fonts.small};
  margin-left: 8px;
  margin-right: 8px;
`;

const LoginPage = () => {
  return (
    <Wrapper>
      <Content>
        <Title>Assignment Demo</Title>
        <LoginForm />
      </Content>
    </Wrapper>
  )
}
export default LoginPage;
