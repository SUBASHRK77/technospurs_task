export interface Address {
  line1: string;
  state: string;
  city: string;
  pin: string;
}

export interface User {
  id: any;
  key: string;
  name: string;
  email: string;
  linkedin: string;
  gender: string;
  address: Address;
}

export interface Config {
  editable: boolean;
  name: {
    minLength: number;
    maxLength: number;
  };
}
