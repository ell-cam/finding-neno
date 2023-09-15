import { useNavigation } from '@react-navigation/native';
import { Menu, useToast, ScrollView, View, Heading, Pressable } from "native-base";
import { Dimensions, RefreshControl, SafeAreaView } from 'react-native';
import { Color } from "../components/atomic/Theme";
import { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { TabBar, TabView } from 'react-native-tab-view';

import { useSelector } from "react-redux";
import Report from '../components/Report';
import Sighting from '../components/Sighting';

const DashboardPage = () => {
	const { IP, PORT } = useSelector((state) => state.api)
	const { USER_ID, ACCESS_TOKEN } = useSelector((state) => state.user);

	const windowWidth = Dimensions.get('window').width;
	const navigation = useNavigation();
	const toast = useToast();
	const isFocused = useIsFocused();

	const [reports, setReports] = useState([]);
	const [allSightings, setAllSightings] = useState([]);
	const [reportCards, setReportCards] = useState('');
	const [sightingCards, setSightingCards] = useState('');
	const [sightingData, setSightingData] = useState({ authorId: USER_ID });
	const [sightingImage, setSightingImage] = useState(null);
	const [initialReportsLoaded, setInitialReportsLoaded] = useState(false);
	const [initialSightingsLoaded, setInitialSightingsLoaded] = useState(false);

	const [routes] = useState([
		{ key: 'reports', title: 'Reports' },
		{ key: 'sightings', title: 'Sightings' },
	])
	const [index, setIndex] = useState(0);

	// 
	useEffect(() => {
		if (isFocused) {
			fetchData();
		}
	}, [isFocused, initialReportsLoaded, initialSightingsLoaded]);

	const onRefresh = () => {
		fetchData();
	}

	const fetchData = () => {
		fetchAllReports();
		setReportCards(generateReportCards());
		fetchAllSightings();
		setSightingCards(generateSightingCards());
	}

	const generateReportCards = () => {
		return (
			reports?.map((report, index) => (
				<Report userId={USER_ID} report={report} key={index} />
			))
		)
	}

	const generateSightingCards = () => {
		return (
			allSightings?.map((sighting, index) => (
				<Sighting userId={USER_ID} sighting={sighting} key={index} />
			))
		)
	}

	const ReportsView = () => (
		<ScrollView style={{ backgroundColor: '#EDEDED' }} refreshControl={<RefreshControl onRefresh={onRefresh} />}>
			{reportCards}
		</ScrollView>
	)

	const SightingsView = () => (
		<ScrollView style={{ backgroundColor: '#EDEDED' }} refreshControl={<RefreshControl onRefresh={onRefresh} />}>
			{sightingCards}
		</ScrollView>
	)

	// API calls 
	const fetchAllReports = async () => {
		try {
			const url = `${IP}:${PORT}/get_missing_reports`;
			const response = await fetch(url, {
				method: "GET",
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${ACCESS_TOKEN}`,
					'User-ID': USER_ID,
				},
			});

			if (!response.ok) {
				throw new Error(`Request failed with status: ${response.status}`);
			}

			await response.json().then(data => {
				setReports(data[0]);
				setInitialReportsLoaded(true);
			});
		} catch (error) {
			console.error(error);
		}
	};

	const fetchAllSightings = async () => {
		try {
			const url = `${IP}:${PORT}/get_sightings`;
			const response = await fetch(url, {
				method: "GET",
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${ACCESS_TOKEN}`,
					'User-ID': USER_ID,
				},
			});

			if (!response.ok) {
				throw new Error(`Request failed with status: ${response.status}`);
			}

			await response.json().then(data => {
				setAllSightings(data[0]);
				setInitialSightingsLoaded(true);
				console.log(data[0].length)
			});
			
		} catch (error) {
			console.error(error);
		}
	};

	// image_url is not being set properly without this useEffect - should probs find a more robust way to fix it later 
	useEffect(() => {
		setSightingData({ ...sightingData, image_url: sightingImage })
	}, [sightingImage]);

	// console.log(allSightings.length)
	return (
		<SafeAreaView style={{height: "100%"}}>
			<View justifyContent="center" alignItems="flex-start" bg={'blue.300'} padding={4}>
				<Menu shadow={2} w="360" trigger={(triggerProps) => (
					<Pressable width="100%" accessibilityLabel="More options menu" {...triggerProps}>
						<View style={{ alignItems: 'flex-start' }}>
							<Heading> ➕ New Post </Heading>
						</View>
					</Pressable>
				)}>
					<Menu.Item onPress={() => navigation.navigate('Report', { screen: 'New Report Page' })}>Report</Menu.Item>
					<Menu.Item onPress={() => navigation.navigate('Dashboard', { screen: 'New Sighting Page' })}>Sighting</Menu.Item>
				</Menu>
			</View>

			<TabView
				navigationState={{ index, routes }}
				renderScene={({ route }) => {
					switch (route.key) {
						case 'reports':
							return ReportsView();
						case 'sightings':
							return SightingsView();
						default:
							return null; // TODO: make a view that says "no reports/sightings yet" etc for when theres nothing on the app yet ?
					}
				}}
				onIndexChange={setIndex}
				initialLayout={{ width: windowWidth }}
				renderTabBar={props => <TabBar {...props} style={{backgroundColor: Color.NENO_BLUE}}/>}
			/>

		</SafeAreaView>
	);
}

export default DashboardPage;