import { useContext, useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { MetamaskActions, MetaMaskContext } from '../hooks';
import { connectSnap, getSnap, shouldDisplayReconnectButton } from '../utils';
import {
  ConnectButton,
  InstallFlaskButton,
  ReconnectButton,
  SendHelloButton,
  Card,
  NotificationsButton,
  ReloadButton,
  UrgencyButton,
} from '../components';
import { CardUrgency } from '../components/CardUrgency';
import { defaultSnapOrigin } from '../config';
import { CChart } from '@coreui/react-chartjs';
import { ColorRing } from 'react-loader-spinner';
import jsonData from '../key.json';

const key = jsonData.key;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  margin-top: 7.6rem;
  margin-bottom: 7.6rem;
  ${({ theme }) => theme.mediaQueries.small} {
    padding-left: 2.4rem;
    padding-right: 2.4rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
    width: auto;
  }
`;

const Heading = styled.h1`
  margin-top: 0;
  margin-bottom: 2.4rem;
  text-align: center;
`;

const Span = styled.span`
  color: ${(props) => props.theme.colors.primary.default};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: 500;
  margin-top: 0;
  margin-bottom: 0;
  ${({ theme }) => theme.mediaQueries.small} {
    font-size: ${({ theme }) => theme.fontSizes.text};
  }
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 64.8rem;
  width: 100%;
  height: 100%;
  margin-top: 1.5rem;
`;

const Notice = styled.div`
  background-color: ${({ theme }) => theme.colors.background.alternative};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  color: ${({ theme }) => theme.colors.text.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;

  & > * {
    margin: 0;
  }
  ${({ theme }) => theme.mediaQueries.small} {
    margin-top: 1.2rem;
    padding: 1.6rem;
  }
`;

const ErrorMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.error.muted};
  border: 1px solid ${({ theme }) => theme.colors.error.default};
  color: ${({ theme }) => theme.colors.error.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-bottom: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.small} {
    padding: 1.6rem;
    margin-bottom: 1.2rem;
    margin-top: 1.2rem;
    max-width: 100%;
  }
`;

enum TransactionConstants {
  // The address of an arbitrary contract that will reject any transactions it receives
  Address = '0x08A8fDBddc160A7d5b957256b903dCAb1aE512C5',
  // Some example encoded contract transaction data
  UpdateWithdrawalAccount = '0x83ade3dc00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000200000000000000000000000047170ceae335a9db7e96b72de630389669b334710000000000000000000000006b175474e89094c44da98b954eedeac495271d0f',
  UpdateMigrationMode = '0x2e26065e0000000000000000000000000000000000000000000000000000000000000000',
  UpdateCap = '0x85b2c14a00000000000000000000000047170ceae335a9db7e96b72de630389669b334710000000000000000000000000000000000000000000000000de0b6b3a7640000',
}

const Index = () => {
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

  const handleSendTxn = async () => {
    try {
      const [from] = (await window.ethereum.request({
        method: 'eth_requestAccounts',
      })) as string[];

      if (!from) {
        throw new Error('No account selected');
      }

      await window.ethereum.request({
        // This txn should fail
        method: 'eth_sendTransaction',
        params: [
          {
            from,
            to: TransactionConstants.Address,
            value: '0x0',
            data: TransactionConstants.UpdateWithdrawalAccount,
          },
        ],
      });
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  //Notifications
  const [enableNotifications, setEnableNotifications] = useState(false);
  const handleNotifications = () => {
    setEnableNotifications(!enableNotifications);
  };

  //Urgency
  const [urgencyValue, setUrgencyValue] = useState('0');

  async function handleUrgency(value: any) {
    setUrgencyValue(value);
    console.log('Urgency Value', value);

    if (value == 30) {
      await window.ethereum.request({
        method: 'wallet_invokeSnap',
        params: [
          defaultSnapOrigin,
          {
            method: 'set_urgency_35',
            params: {
              urgency: value,
            },
          },
        ],
      });
    }

    if (value == 60) {
      await window.ethereum.request({
        method: 'wallet_invokeSnap',
        params: [
          defaultSnapOrigin,
          {
            method: 'set_urgency_60',
            params: {
              urgency: value,
            },
          },
        ],
      });
    }

    if (value == 90) {
      await window.ethereum.request({
        method: 'wallet_invokeSnap',
        params: [
          defaultSnapOrigin,
          {
            method: 'set_urgency_90',
            params: {
              urgency: value,
            },
          },
        ],
      });
    }

    if (value == 100) {
      await window.ethereum.request({
        method: 'wallet_invokeSnap',
        params: [
          defaultSnapOrigin,
          {
            method: 'set_urgency_100',
            params: {
              urgency: value,
            },
          },
        ],
      });
    }
  }

  async function callApi() {
    try {
      await window.ethereum.request({
        method: 'wallet_invokeSnap',
        params: [
          defaultSnapOrigin,
          {
            method: 'call_api',
          },
        ],
      });
    } catch (e) {
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  }

  // Gas Price charts
  const network = 'eth'; // could be any supported network
  const [labels, setLabels]: any[] = useState([]);
  const [datasets, setDatasets]: any[] = useState([]);
  const [loading, setLoading] = useState(false);
  const months = {
    '01': 'Jan',
    '02': 'Feb',
    '03': 'Mar',
    '04': 'Apr',
    '05': 'May',
    '06': 'June',
    '07': 'July',
    '08': 'Aug',
    '09': 'Sept',
    '10': 'Oct',
    '11': 'Nov',
    '12': 'Dec',
  };
  const fetchGasPrice = async () => {
    setLoading(true);
    const res = await fetch(
      `https://api.owlracle.info/v3/${network}/history?apikey=${key}`,
    );
    const data = await res.json();
    const x: any[] = [];
    const y: any[] = [];

    for (var i = data.length - 1; i >= 0; i--) {
      var date = data[i]['timestamp'].substr(0, 10).split('-');
      // console.log(date);
      var dateStr =
        date[2] +
        ' ' +
        months[date[1]] +
        ' ' +
        date[0] +
        ' (' +
        data[i]['timestamp'].substr(11, 8) +
        ')';
      x.push(dateStr);
      y.push((data[i]['gasPrice']['low'] + data[i]['gasPrice']['high']) / 2);
    }
    setLabels(x);
    setDatasets(y);
    // console.log(data);
    // console.log(x);
    // console.log(y);
    setLoading(false);
  };
  useEffect(() => {
    fetchGasPrice();
  }, []);
  const handleReload = async () => {
    fetchGasPrice();
  };
  return (
    <>
      <Container>
        <Heading>
          Welcome to <Span>EtherEyes</Span>
        </Heading>
        <Subtitle>
          {/* Get started by editing <code>src/index.ts</code> */}
        </Subtitle>
        <CardContainer>
          {state.error && (
            <ErrorMessage>
              <b>An error happened:</b> {state.error.message}
            </ErrorMessage>
          )}
          {!state.isFlask && (
            <Card
              content={{
                title: 'Install',
                description:
                  'Snaps is pre-release software only available in MetaMask Flask, a canary distribution for developers with access to upcoming features.',
                button: <InstallFlaskButton />,
              }}
              fullWidth
            />
          )}
          {!state.installedSnap && (
            <Card
              content={{
                title: 'Connect',
                description:
                  'Get started by connecting to and installing the example snap.',
                button: (
                  <ConnectButton
                    onClick={handleConnectClick}
                    disabled={!state.installedSnap}
                  />
                ),
              }}
              disabled={!state.installedSnap}
            />
          )}
          {/* {shouldDisplayReconnectButton(state.installedSnap) && (
          <Card
            content={{
              title: 'Reconnect',
              description:
                'While connected to a local running snap this button will always be displayed in order to update the snap if a change is made.',
              button: (
                <ReconnectButton
                  onClick={handleConnectClick}
                  disabled={!state.installedSnap}
                />
              ),
            }}
            disabled={!state.installedSnap}
          />
        )} */}
          <Card
            content={{
              title: 'Send Transaction',
              description:
                'Display a custom txn within a confirmation screen in MetaMask.',
              button: (
                <SendHelloButton
                  onClick={handleSendTxn}
                  disabled={!state.installedSnap}
                />
              ),
            }}
            disabled={!state.installedSnap}
            fullWidth={
              state.isFlask &&
              Boolean(state.installedSnap) &&
              !shouldDisplayReconnectButton(state.installedSnap)
            }
          />
          <Card
            content={{
              title: 'Get current gas fees',
              description: 'Display a notification with current gas fees',
              button: (
                <SendHelloButton
                  onClick={callApi}
                  disabled={!state.installedSnap}
                />
              ),
            }}
            disabled={!state.installedSnap}
            fullWidth={
              state.isFlask &&
              Boolean(state.installedSnap) &&
              !shouldDisplayReconnectButton(state.installedSnap)
            }
          />
          <CardUrgency
            content={{
              title: 'Urgency',
              description: 'Describe the urgency of your transaction.',
              button1: (
                <UrgencyButton
                  onClick={() => handleUrgency('30')}
                  disabled={!state.installedSnap}
                  title="Less Urgent"
                  enabled={urgencyValue === '30' ? true : false}
                />
              ),
              button2: (
                <UrgencyButton
                  onClick={() => handleUrgency('60')}
                  disabled={!state.installedSnap}
                  title="Moderately Urgent"
                  enabled={urgencyValue === '60' ? true : false}
                />
              ),
              button3: (
                <UrgencyButton
                  onClick={() => handleUrgency('90')}
                  disabled={!state.installedSnap}
                  title="Very Urgent"
                  enabled={urgencyValue === '90' ? true : false}
                />
              ),
              button4: (
                <UrgencyButton
                  onClick={() => handleUrgency('100')}
                  disabled={!state.installedSnap}
                  title="Immediate Transaction"
                  enabled={urgencyValue === '100' ? true : false}
                />
              ),
              urgencyValue: `${urgencyValue}`,
            }}
            disabled={!state.installedSnap}
            fullWidth={
              state.isFlask &&
              Boolean(state.installedSnap) &&
              !shouldDisplayReconnectButton(state.installedSnap)
            }
          />
          {/* <Card
          content={{
            title: 'Start cron job',
            description:
              'Start a cron job',
            button: (
              <SendHelloButton
                onClick={handleCronJob}
                disabled={!state.installedSnap}
              />
            ),
          }}
          disabled={!state.installedSnap}
          fullWidth={
            state.isFlask &&
            Boolean(state.installedSnap) &&
            !shouldDisplayReconnectButton(state.installedSnap)
          }
        /> */}
        </CardContainer>
      </Container>
      <ReloadButton onClick={handleReload} style={{ margin: 'auto' }} />
      {!loading ? (
        <CChart
          type="line"
          data={{
            labels: labels,
            datasets: [
              {
                label: 'Gas Price: ',
                backgroundColor: 'rgba(220, 220, 220, 0.2)',
                borderColor: 'rgba(220, 220, 220, 1)',
                pointBackgroundColor: 'rgba(220, 220, 220, 1)',
                pointBorderColor: '#fff',
                data: datasets,
              },
            ],
          }}
        />
      ) : (
        <div style={{ margin: 'auto' }}>
          <ColorRing
            visible={true}
            height="50vh"
            width="80"
            ariaLabel="blocks-loading"
            wrapperStyle={{}}
            wrapperClass="blocks-wrapper"
            colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
          />
        </div>
      )}
    </>
  );
};

export default Index;
