import { ReactNode, useState, useEffect } from 'react';
import styled from 'styled-components';

type CardProps = {
  content: {
    title?: string;
    description: ReactNode;
    button1?: ReactNode;
    button2?: ReactNode;
    button3?: ReactNode;
    button4?: ReactNode;
    urgencyValue?: string;
  };
  disabled?: boolean;
  fullWidth?: boolean;
};



const CardWrapper = styled.div<{ fullWidth?: boolean; disabled: boolean }>`
  display: flex;
  flex-direction: column;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : '250px')};
  background-color: ${({ theme }) => theme.colors.card.default};
  margin-top: 2.4rem;
  margin-bottom: 2.4rem;
  padding: 2.4rem;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.default};
  box-shadow: ${({ theme }) => theme.shadows.default};
  filter: opacity(${({ disabled }) => (disabled ? '.4' : '1')});
  align-self: stretch;
  ${({ theme }) => theme.mediaQueries.small} {
    width: 100%;
    margin-top: 1.2rem;
    margin-bottom: 1.2rem;
    padding: 1.6rem;
  }
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.large};
  margin: 0;
  ${({ theme }) => theme.mediaQueries.small} {
    font-size: ${({ theme }) => theme.fontSizes.text};
  }
`;

const Description = styled.div`
  margin-top: 2.4rem;
  margin-bottom: 2.4rem;
`;

export const CardUrgency = ({ content, disabled = false, fullWidth }: CardProps) => {
  const [mobileView, setMobileView] = useState(false);
  useEffect(() => {
    setMobileView(window.innerWidth <= 500);
  }, []);
  const { title, description, button1, button2, button3, button4, urgencyValue} = content;
  return (
    <CardWrapper fullWidth={true} disabled={disabled}>
      {title && (
        <Title>{title}</Title>
      )}
      <Description>{description}</Description>
      <div style={{ display: 'grid', gridTemplateColumns:`${mobileView?'repeat(1, auto)':'repeat(4, auto)'}`,justifyContent: 'center', alignItems:'center'}}>
        {button1}
        {button2}  
        {button3}
        {button4}
      </div>
    </CardWrapper>
  );
};
