import styled from "@emotion/styled";
import {NavLink} from "react-router-dom";
import {colors} from "styles";

export const SideBarContainer = styled.aside`
    animation-duration: 0.2s;
    background-color: ${colors.warmWheat};
    text-align: center;
    border-radius: 1.5rem;
    margin: 8px;
    flex: 0 1 300px;

    & svg {
        min-width: 1.2rem;
    }

    @media (max-width: 1000px) and (min-width: 750px) {
        width: fit-content;
        text-align: center;
        & span {
            display: none;
        }
    }

    @media (max-width: 750px) {
        display: none;
    }

    > div {
        padding: 16px;
    }
`;

export const MenuContainer = styled.div`
    width: 100%;
    gap: 8px;
    display: flex;
    flex-direction: column;
`;

export const WirdLogoContainer = styled.div`
    padding: 1rem;
`;

export const MenuLink = styled(NavLink)`
    display: flex;
    text-decoration: none;
    justify-content: flex-end;
    border-radius: 0.75rem;
    align-items: center;
    color: ${colors.darkGrey};
    white-space: nowrap;
    height: 3.063rem;
    padding: 0.5rem 0.8rem;
    flex-direction: row;
    font-weight: 700;
    text-align: start;
    gap: 1rem;
    font-size: 1rem;

    :hover {
        background-color: ${colors.lightRed};
        color: ${colors.black};
    }

    :focus, &.active {
        background-color: ${colors.lightRed};
        color: ${colors.black};
    }

    @media (max-width: 1000px) {
        font-size: 0.9rem;
        width: 100%;
        justify-content: center;
    }
`;

export const MenuItem = styled.span`
    display: ${({isSidebarCollapsed}) => {
        if (isSidebarCollapsed === true) return "none";
        if (isSidebarCollapsed === false) return "flex";
        return "";
    }};
    cursor: pointer;
    padding: 0;
    border: none;
    width: 100%;
`;
