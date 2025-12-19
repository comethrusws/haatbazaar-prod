import { faCar, faHome, faMobile, faTshirt, faList, faAsterisk } from "@fortawesome/free-solid-svg-icons";

export const formatMoney = (amount: number): string => {
  return 'रू' + new Intl.NumberFormat('en-NP', { style: 'currency', currency: 'NPR', minimumFractionDigits: 2 }).format(amount).replace('NPR', '');
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
};

export const defaultRadius = 50 * 1000;

export const categories = [
  { key: 'electronics', label: 'Electronics', icon: faMobile },
  { key: 'fashion', label: 'Fashion', icon: faTshirt },
  { key: 'home', label: 'Home & Garden', icon: faHome },
  { key: 'vehicles', label: 'Vehicles', icon: faCar },
  { key: 'property', label: 'Property', icon: faList },
  { key: 'other', label: 'Other', icon: faAsterisk },
];