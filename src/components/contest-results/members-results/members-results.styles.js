import styled from "@emotion/styled";

export const StyledMembersResultsWrapper = styled.div`
  display: flex;
  gap: 16px;
  flex-direction: column;

  .side-filters {
    width: 100%;

    .ant-form {
      max-width: 350px;
    }
  }

  .main-content {
    width: 100%;
    min-height: 500px;
    background: rgba(150, 150, 150, 0.05);
    padding: 32px 24px 24px;
    border-radius: 16px;

    .ant-empty {
      margin-top: 100px;
    }

    .spinner-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 250px;
    }
  }
`;
