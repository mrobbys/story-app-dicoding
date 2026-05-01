import Map from '../utils/map';

export async function storiesMapper(stories) {
  return {
    ...stories,
    placeName: await Map.getPlaceNameByCoordinate(
      stories.lat,
      stories.lon,
    ),
  };
}