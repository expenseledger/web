import styled from "styled-components";

const Block = styled.div`
    border-radius: 6px;
    background-color: white;
`;

const PageSetting: React.FC = () => {
    return (
        <div className="panel">
            <Block className="panel-block is-justify-content-space-between">
                <span>Move menu to the right</span>
                <span>Test</span>
            </Block>
        </div>
    );
};

export default PageSetting;
