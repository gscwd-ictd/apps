export type Card = {
  icon: any;
  color: 'orange' | 'rose' | 'blue' | 'indigo' | 'green' | 'lime' | 'gray';
  title: string;
  description: string;
  linkType: 'router' | 'href';
  destination: any;
  state: boolean;
};
