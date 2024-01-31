import {createContext, useContext, useEffect, useMemo, useState} from "react";
import {Spin} from "antd";
import {GroupsApi} from "../../services/groups/api";

const GroupContext = createContext({
    groups: {
        list: [],
        setList: () => {
        },
        loading: false,
        setLoading: () => {
        },
    }
});
export const useGroupContext = () => useContext(GroupContext);


export const GroupContextProvider = ({ children }) => {
    const [groups, setGroups] = useState([]);
    const [groupsLoading, setGroupsLoading] = useState(false);

    const loadGroups = async () => {
        setGroupsLoading(true);
        try {
            const data = await GroupsApi.getGroups();
            setGroups(data);
        } finally {
            setGroupsLoading(false);
        }
    };

    useEffect(() => {
        loadGroups();
    }, []);

    const contextValue = useMemo(
        () => ({
            groups: {
                list: groups,
                setList: setGroups,
                loading: groupsLoading,
                setLoading: setGroupsLoading,
            }
        }),
        [groups, setGroups],
    );

    return (
        <GroupContext.Provider value={contextValue}>
            <Spin spinning={contextValue.groups.loading}>
                {typeof children === "function" ? children(contextValue) : children}
            </Spin>
        </GroupContext.Provider>
    );
};
