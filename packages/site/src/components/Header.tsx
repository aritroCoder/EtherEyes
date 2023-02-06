import { useContext, useState, useEffect } from 'react';
import styled, { useTheme } from 'styled-components';
import { MetamaskActions, MetaMaskContext } from '../hooks';
import { connectSnap, getThemePreference, getSnap } from '../utils';
import { HeaderButtons, NotificationsButton } from './Buttons';
import { SnapLogo } from './SnapLogo';
import { Toggle } from './Toggle';
import { defaultSnapOrigin } from '../config';
import Ethereyes from '../images/ethereyes.png'
const HeaderWrapper = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 2.4rem;
  border-bottom: 1px solid ${(props) => props.theme.colors.border.default};
`;

const Title = styled.p`
  font-size: ${(props) => props.theme.fontSizes.title};
  font-weight: bold;
  margin: 0;
  margin-left: 1.2rem;
  ${({ theme }) => theme.mediaQueries.small} {
    display: none;
  }
`;

const LogoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const RightContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const Header = ({
  handleToggleClick,
}: {
  handleToggleClick(): void;
}) => {
  const theme = useTheme();
  const [state, dispatch] = useContext(MetaMaskContext);

  const handleConnectClick = async () => {
    try {
      await connectSnap();
      const installedSnap = await getSnap();

      dispatch({
        type: MetamaskActions.SetInstalled,
        payload: installedSnap,
      });
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  //Notifications
  const [enableNotifications, setEnableNotifications] = useState(false);

  useEffect(()=>{
    if(state.installedSnap){
      (async () => {
        const notif = await window.ethereum.request({
          method: 'wallet_invokeSnap',
          params: [
            defaultSnapOrigin,
            {
              method: 'notif_toggle_false',
            },
          ],
        });
        setEnableNotifications(false);
      })();
    }
  }, [])

  const handleNotifications = async () => {
    console.log('Notifications', !enableNotifications);

    if (!enableNotifications) {
      await window.ethereum.request({
        method: 'wallet_invokeSnap',
        params: [
          defaultSnapOrigin,
          {
            method: 'notif_toggle_true',
          },
        ],
      });
    } else {
      await window.ethereum.request({
        method: 'wallet_invokeSnap',
        params: [
          defaultSnapOrigin,
          {
            method: 'notif_toggle_false',
          },
        ],
      });
    }
    setEnableNotifications(!enableNotifications);
  };
  // const Ethereyes = require('../images/ethereyes.svg');
  // console.log(Ethereyes);
  return (
    <HeaderWrapper>
        {/* <img src={Ethereyes} alt="" srcSet="Logo" style={{width:'100px', height:'100px'}}/> */}
      <LogoWrapper>
      <img src={Ethereyes} alt='' style={{width:'50px', height:'auto'}}/>
        {/* <SnapLogo color={theme.colors.icon.default} size={36} /> */}
        <Title>EtherEyes</Title>
      </LogoWrapper>
      <RightContainer>
        <NotificationsButton
          onClick={handleNotifications}
          disabled={!state.installedSnap}
          enabled={enableNotifications}
        />
        <Toggle
          onToggle={handleToggleClick}
          defaultChecked={getThemePreference()}
        />
        <HeaderButtons state={state} onConnectClick={handleConnectClick} />
      </RightContainer>
    </HeaderWrapper>
  );
};
