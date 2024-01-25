import styled from "@emotion/styled";

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  margin: 0 8px;
  min-height: 100vh;
`;

export const MainContent = styled.main`
  flex-grow: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  @media (min-width: 768px) {
    margin: 8px;
  }

  .page-content {
    padding: 24px;
    background: #fff;
    border-radius: 1.5rem;
    flex: 1;
  }

  /* margin: 7rem 0 0 0; // will get back to 0 to change the width when needing to move elements to left */
`;
