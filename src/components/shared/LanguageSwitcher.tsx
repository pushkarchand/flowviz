import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { languages } from '@/i18n';

const Container = styled.div`
  position: relative;
`;

const Trigger = styled.button<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.$isOpen ? p.theme.colors.navHover : p.theme.colors.cardBg};
  color: ${(p) => p.theme.colors.text};
  font-size: 14px;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: ${(p) => p.theme.colors.navHover};
  }
`;

const Flag = styled.span`
  font-size: 16px;
`;

const Dropdown = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  min-width: 140px;
  padding: 6px;
  background: ${(p) => p.theme.colors.cardBg};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  opacity: ${(p) => p.$isOpen ? 1 : 0};
  visibility: ${(p) => p.$isOpen ? 'visible' : 'hidden'};
  transform: ${(p) => p.$isOpen ? 'translateY(0)' : 'translateY(-8px)'};
  transition: all 0.2s ease;
  z-index: 1000;
`;

const Option = styled.button<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  background: ${(p) => p.$isActive ? p.theme.colors.navHover : 'transparent'};
  color: ${(p) => p.$isActive ? p.theme.colors.navActive : p.theme.colors.text};
  font-size: 13px;
  font-weight: ${(p) => p.$isActive ? 600 : 400};
  text-align: left;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: ${(p) => p.theme.colors.navHover};
  }
`;

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = languages.find((l) => l.code === i18n.language) || languages[0];

  const handleChange = (code: string) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  return (
    <Container
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Trigger $isOpen={isOpen}>
        <Flag>{currentLang.flag}</Flag>
        <span>{currentLang.code.toUpperCase()}</span>
      </Trigger>
      <Dropdown $isOpen={isOpen}>
        {languages.map((lang) => (
          <Option
            key={lang.code}
            $isActive={lang.code === i18n.language}
            onClick={() => handleChange(lang.code)}
          >
            <Flag>{lang.flag}</Flag>
            {lang.name}
          </Option>
        ))}
      </Dropdown>
    </Container>
  );
};
