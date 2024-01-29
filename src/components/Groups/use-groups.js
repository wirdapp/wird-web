import {useGroupContext} from "./groups-context";
import {GroupsApi} from "../../services/groups/api";

export function useGroups(){
    const {groups} = useGroupContext();

    const add = async (body) => {
        const groupData = await GroupsApi.addGroup({ body });
        groups.setList([...groups.list, groupData]);
    };

    const update = async (id, body) => {
        const groupData = await GroupsApi.updateGroup({ id, body });
        const index = groups.list.findIndex((group) => group.id === id);
        const newGroups = [...groups.list];
        newGroups[index] = groupData;
        groups.setList(newGroups);
    };

    const remove = async (id) => {
        await GroupsApi.deleteGroup({ id });
        const newGroups = groups.list.filter((group) => group.id !== id);
        groups.setList(newGroups);
    };
    return ({
        groups: groups.list,
        loading: groups.loading,
        actions: {
            add,
            update,
            remove
        }
    });
}