export interface QouteRequest {
  pick_up_location: {
    lat: number;
    lng: number;
  };
  drop_off_location: {
    lat: number;
    lng: number;
  };
}

export interface QouteResponse {
  id: string;
  estimated_price: number;
}
