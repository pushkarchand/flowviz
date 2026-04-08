import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useThemeContext } from "@contexts/ThemeContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import iconSvg from "../../assets/icon.svg";

const Nav = styled.nav`
  height: 48px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  background: ${(p) => p.theme.colors.navBg};
  border-bottom: 1px solid ${(p) => p.theme.colors.navBorder};
  gap: 4px;
  flex-shrink: 0;
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-right: 16px;
  flex-shrink: 0;
`;

const LogoIcon = styled.img`
  width: 28px;
  height: 28px;
`;

const BrandText = styled.span`
  font-weight: 700;
  font-size: 14px;
  color: ${(p) => p.theme.colors.text};
  white-space: nowrap;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
`;

const DropdownContainer = styled.div`
  position: relative;
`;

const DropdownTrigger = styled.button<{ $isOpen?: boolean; $isActive?: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: none;
  background: ${(p) => (p.$isOpen || p.$isActive ? p.theme.colors.navHover : "transparent")};
  color: ${(p) => (p.$isActive ? p.theme.colors.navActive : p.theme.colors.navText)};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: ${(p) => p.theme.colors.navHover};
  }

  &::after {
    content: "";
    border: 4px solid transparent;
    border-top-color: ${(p) => (p.$isActive ? p.theme.colors.navActive : p.theme.colors.navText)};
    margin-top: 4px;
    transition: transform 0.2s ease;
    transform: ${(p) => (p.$isOpen ? "rotate(180deg) translateY(4px)" : "rotate(0)")};
  }
`;

const DropdownMenu = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  min-width: 180px;
  padding: 6px;
  background: ${(p) => p.theme.colors.cardBg};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  opacity: ${(p) => (p.$isOpen ? 1 : 0)};
  visibility: ${(p) => (p.$isOpen ? "visible" : "hidden")};
  transform: ${(p) => (p.$isOpen ? "translateY(0)" : "translateY(-8px)")};
  transition: all 0.2s ease;
  z-index: 1000;
`;

const DropdownNavLink = styled(NavLink)`
  display: block;
  padding: 10px 14px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
  color: ${(p) => p.theme.colors.navText};
  white-space: nowrap;
  transition: all 0.15s ease;

  &:hover {
    background: ${(p) => p.theme.colors.navHover};
  }

  &.active {
    color: ${(p) => p.theme.colors.navActive};
    background: ${(p) => p.theme.colors.navHover};
    font-weight: 700;
  }
`;

const DisabledItem = styled.span`
  display: block;
  padding: 10px 14px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  color: ${(p) => p.theme.colors.textMuted};
  white-space: nowrap;
  cursor: not-allowed;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
  flex-shrink: 0;
`;

const ThemeToggle = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.cardBg};
  color: ${(p) => p.theme.colors.text};
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s;

  &:hover {
    border-color: ${(p) => p.theme.colors.textMuted};
    transform: scale(1.1);
  }
`;

interface DropdownProps {
  label: string;
  routes: string[];
  children: React.ReactNode;
}

const Dropdown: React.FC<DropdownProps> = ({ label, routes, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isActive = routes.some((route) => location.pathname === route || location.pathname.startsWith(route + "/"));

  return (
    <DropdownContainer onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <DropdownTrigger $isOpen={isOpen} $isActive={isActive}>
        {label}
      </DropdownTrigger>
      <DropdownMenu $isOpen={isOpen}>{children}</DropdownMenu>
    </DropdownContainer>
  );
};

export const NavBar: React.FC = () => {
  const { isDark, toggleTheme } = useThemeContext();
  const { t } = useTranslation();

  return (
    <Nav>
      <Brand>
        <LogoIcon src={iconSvg} alt="Logo" />
        <BrandText>{t("nav.brand")}</BrandText>
      </Brand>
      <NavLinks>
        <Dropdown label={t("nav.js")} routes={["/event-loop"]}>
          <DropdownNavLink to="/event-loop">{t("nav.eventLoop")}</DropdownNavLink>
        </Dropdown>

        <Dropdown label={t("nav.browser")} routes={["/browser"]}>
          <DropdownNavLink to="/browser/rendering-pipeline">{t("nav.renderingPipeline")}</DropdownNavLink>
        </Dropdown>

        <Dropdown label={t("nav.css")} routes={["/flexbox", "/grid", "/positioning", "/box-model"]}>
          <DropdownNavLink to="/flexbox">{t("nav.flexbox")}</DropdownNavLink>
          <DropdownNavLink to="/grid">{t("nav.grid")}</DropdownNavLink>
          <DropdownNavLink to="/positioning">{t("nav.positioning")}</DropdownNavLink>
          <DropdownNavLink to="/box-model">{t("nav.boxModel")}</DropdownNavLink>
        </Dropdown>

        <Dropdown label={t("nav.react")} routes={["/react"]}>
          <DisabledItem>{t("common.comingSoon")}</DisabledItem>
        </Dropdown>
      </NavLinks>
      <RightSection>
        <LanguageSwitcher />
        <ThemeToggle onClick={toggleTheme} title={isDark ? "Light mode" : "Dark mode"}>
          {isDark ? "☀️" : "🌙"}
        </ThemeToggle>
      </RightSection>
    </Nav>
  );
};
