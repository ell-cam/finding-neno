import Sighting from './Sighting';
import { FlatList } from 'native-base';
import { memo, useState } from "react";
import { Text } from 'react-native-paper';
import { formatDateTimeDisplay } from '../Pages/shared';

function SightingsList({sightings, onRefresh, columns, emptyText}) {
    const [refreshing, setRefreshing] = useState(false);
    const onRefreshList = () => {
        setRefreshing(true);
        onRefresh();
        setRefreshing(false);
    }

    return (
        <FlatList paddingY='3%' width='100%' numColumns={columns} style={{ backgroundColor: 'transparent' }} contentContainerStyle={{ alignItems: 'center' }}
            data={sightings}
            renderItem={({ item }) => <Sighting sighting={item} refresh={onRefreshList}/>}
            keyExtractor={item => `${item[0]}`}
            onRefresh={onRefreshList}
            refreshing={refreshing}
            ListEmptyComponent={<Text style={{ paddingVertical: '5%', fontSize: 15, fontWeight: '700' }}>{emptyText}</Text>}
            ListFooterComponent={<Text style={{ paddingVertical: '5%', fontSize: 15, fontWeight: '700' }}>Last updated {formatDateTimeDisplay(new Date())}</Text>}
        />
    )
}

export default memo(SightingsList);